# HealthCert Hyperledger Fabric Network

This repository contains the custom **healthcert-chaincode** and setup instructions for running a full Hyperledger Fabric test network with the certificate anchoring chaincode.

## 🚀 Prerequisites

Install the following:

### 1. Docker + Docker Compose
https://docs.docker.com/get-docker/

### 2. Go
https://go.dev/dl/

### 3. Node.js v16+
https://nodejs.org/en/download/

### 4. cURL (macOS/Linux)
Installed by default.

---

## 📦 Install Hyperledger Fabric Samples + Binaries

Navigate to:

```
hyperledger/fabric-samples/
```

Run:

```bash
curl -sSL https://bit.ly/2ysbOFE | bash -s
```

---

## 🏗 Start the Fabric Test Network

```bash
cd hyperledger/fabric-samples/test-network
./network.sh down
./network.sh up createChannel -c mychannel -ca
```

---

## 🔗 Deploy the healthcert chaincode

```bash
./network.sh deployCC \
  -ccn healthcert \
  -ccp ../healthcert-chaincode \
  -ccl javascript \
  -c mychannel
```

---

## 🧪 Test Invoke & Query

### Load environment

```bash
cd hyperledger/fabric-samples/test-network
export PATH=${PWD}/../bin:$PATH
export FABRIC_CFG_PATH=${PWD}/../config/
source ./scripts/envVar.sh
setGlobals 1
```

### Invoke

```bash
peer chaincode invoke \
  -o localhost:7050 \
  --ordererTLSHostnameOverride orderer.example.com \
  --tls \
  --cafile "${PWD}/organizations/ordererOrganizations/example.com/orderers/orderer.example.com/msp/tlscacerts/tlsca.example.com-cert.pem" \
  -C mychannel \
  -n healthcert \
  --peerAddresses localhost:7051 \
  --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org1.example.com/peers/peer0.org1.example.com/tls/ca.crt" \
  --peerAddresses localhost:9051 \
  --tlsRootCertFiles "${PWD}/organizations/peerOrganizations/org2.example.com/peers/peer0.org2.example.com/tls/ca.crt" \
  -c '{"Args":["issueOrUpdateCert","0xabc","0xschema","1800000000","0"]}'
```

### Query

```bash
peer chaincode query \
  -C mychannel \
  -n healthcert \
  -c '{"Args":["getCert","0xabc"]}'
```

---

## 🧹 Git Ignore These Folders

```
fabric-samples/test-network/organizations/
fabric-samples/test-network/system-genesis-block/
fabric-samples/test-network/channel-artifacts/
fabric-samples/test-network/ledger/
fabric-samples/test-network/.tmp/
fabric-samples/test-network/logs/
fabric-samples/**/wallet/
healthcert-chaincode/node_modules/
```

---

## 🎉 Done!

Your teammate can now run the full Fabric network and test the chaincode.
