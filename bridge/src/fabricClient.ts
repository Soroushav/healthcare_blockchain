// bridge/src/fabricClient.ts
import { promises as fs } from "fs";
import * as path from "path";
import * as grpc from "@grpc/grpc-js";
import * as crypto from "crypto";
import { isPublisherOnEthereum } from "./ethRegistry";


// runtime imports from fabric-gateway
import { connect, signers } from "@hyperledger/fabric-gateway";

// type-only imports (because of verbatimModuleSyntax)
import type { Identity, Signer, Gateway } from "@hyperledger/fabric-gateway";

const MSP_ID = "Org1MSP";
const CHANNEL_NAME = "mychannel";
const CHAINCODE_NAME = "healthcert";

// 🔴 ADJUST THIS: point to your test-network organizations folder
// Example if your layout is: /.../hyperledger/fabric-samples/test-network
// and this file lives in /.../your-project/bridge/src
const CRYPTO_ROOT = path.resolve(
  __dirname,
  "../../hyperledger/fabric-samples/test-network/organizations"
);

const KEY_DIR = path.join(
  CRYPTO_ROOT,
  "peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/keystore"
);
const CERT_PATH = path.join(
  CRYPTO_ROOT,
  "peerOrganizations/org1.example.com/users/User1@org1.example.com/msp/signcerts/cert.pem"
);
const TLS_CERT_PATH = path.join(
  CRYPTO_ROOT,
  "peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt"
);

const PEER_ENDPOINT = "localhost:7051";
const PEER_HOST_ALIAS = "peer0.org1.example.com";

async function newGrpcConnection(): Promise<grpc.Client> {
  const tlsRootCert = await fs.readFile(TLS_CERT_PATH);
  const tlsCredentials = grpc.credentials.createSsl(tlsRootCert);

  const client = new grpc.Client(PEER_ENDPOINT, tlsCredentials, {
    "grpc.ssl_target_name_override": PEER_HOST_ALIAS,
  });

  return client;
}

async function newIdentity(): Promise<Identity> {
  const credentials = await fs.readFile(CERT_PATH);
  return { mspId: MSP_ID, credentials };
}

async function newSigner(): Promise<Signer> {
  const files = await fs.readdir(KEY_DIR); // string[]

  const [keyFile] = files;
  if (!keyFile) {
    throw new Error(`No key files found in ${KEY_DIR}`);
  }

  const keyPath = path.join(KEY_DIR, keyFile);
  const privateKeyPem = await fs.readFile(keyPath);

  const privateKey = crypto.createPrivateKey(privateKeyPem);
  return signers.newPrivateKeySigner(privateKey);
}

export async function submitCertToFabric(
  certHash: string,
  schemaHash: string,
  expiresAt: number,
  status: number,
  payload: any 
): Promise<void> {
  const client = await newGrpcConnection();
  const identity = await newIdentity();
  const signer = await newSigner();

  const gateway: Gateway = connect({
    client,
    identity,
    signer,
  });

  try {
    const network = gateway.getNetwork(CHANNEL_NAME);
    const contract = network.getContract(CHAINCODE_NAME);

    // If you later extend your chaincode to accept payload JSON, add it here.
    await contract.submitTransaction(
      "issueOrUpdateCert",
      certHash,
      schemaHash,
      expiresAt.toString(),
      JSON.stringify(payload)
    );

    console.log("Submitted certificate to Fabric:", {
      certHash,
      schemaHash,
      expiresAt,
      status,
    });
  } finally {
    gateway.close();
    client.close();
  }
}

export async function getCertFromFabric(certHash: string) {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(CHANNEL_NAME);
    const contract = network.getContract(CHAINCODE_NAME);

    const resultBytes = await contract.evaluateTransaction("getCert", certHash);

    const raw = Buffer.from(resultBytes).toString("utf8");

    console.log("RAW FROM FABRIC:", JSON.stringify(raw));

    // If there is any junk around the JSON, slice it out
    const start = raw.indexOf("{");
    const end = raw.lastIndexOf("}");
    if (start === -1 || end === -1) {
      throw new Error(`Response is not JSON: ${raw}`);
    }

    const json = raw.slice(start, end + 1);
    const cert = JSON.parse(json);
    return cert;
  } finally {
    gateway.close();
    client.close();
  }
}

export async function getAllCertsFromFabric() {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(CHANNEL_NAME);
    const contract = network.getContract(CHAINCODE_NAME);

    const bytes = await contract.evaluateTransaction("getAllCerts");
    const raw = Buffer.from(bytes).toString("utf8");
    return JSON.parse(raw);
  } finally {
    gateway.close();
    client.close();
  }
}

export async function getAllCertsForUser(walletAddress: string) {
  const certs = await getAllCertsFromFabric();
  const isPub = await isPublisherOnEthereum(walletAddress);

  if (isPub) {
    return certs;
  }

  return certs.map((c: any) => ({
    certHash: c.certHash,
    issuedAt: c.issuedAt,
    expiresAt: c.expiresAt,
    status: c.status,
    payload: {
      "fullName": "unauthorized"
    }
  }));
}

export async function updateCertStatusInFabric(
  certHash: string,
  newStatus: number
): Promise<void> {
  const client = await newGrpcConnection();
  const gateway = connect({
    client,
    identity: await newIdentity(),
    signer: await newSigner(),
  });

  try {
    const network = gateway.getNetwork(CHANNEL_NAME);
    const contract = network.getContract(CHAINCODE_NAME);

    await contract.submitTransaction(
      "setStatus",
      certHash,
      newStatus.toString()
    );

    console.log("Updated cert status in Fabric:", { certHash, newStatus });
  } finally {
    gateway.close();
    client.close();
  }
}


export async function getTotalCertCountFromFabric(): Promise<number> {
  const certs = await getAllCertsFromFabric();
  return Array.isArray(certs) ? certs.length : 0;
}