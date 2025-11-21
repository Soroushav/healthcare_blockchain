import { submitCertToFabric, getCertFromFabric } from "./src/fabricClient";
import canonicalize from "canonical-json";
import { keccak256, toUtf8Bytes } from "ethers";

(async () => {
  try {
    console.log("🔧 Testing Fabric client...");

    // Build dummy payload
    const payload = {
      subjectId: "test-user",
      issuerId: "hospital-A",
      issuedAt: Math.floor(Date.now() / 1000),
    };

    // Create deterministic certHash
    const canon = canonicalize(payload);
    const certHash = keccak256(toUtf8Bytes(canon));
    const schemaHash = keccak256(toUtf8Bytes("health-v1"));
    const expiresAt = Math.floor(Date.now() / 1000) + 3600;

    console.log("Computed certHash:", certHash);
    console.log("Submitting to Fabric...");

    await submitCertToFabric(certHash, schemaHash, expiresAt, 0);

    console.log("🎉 SUCCESS! Fabric transaction submitted.");
    console.log("Now check with peer CLI or build a query function.");
  } catch (err: any) {
    console.error("❌ Fabric test failed:");
    console.error(err.message, err);
  }
})();