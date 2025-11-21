import { getCertFromFabric } from "./src/fabricClient";

(async () => {
  const certHash =
    "0x8ff033d116dd8ac43efff4f9798ef834d8a908e12f0674412465ab7c839ce96a"; // the one you printed

  try {
    const cert = await getCertFromFabric(certHash);
    console.log("✅ Cert from Fabric:", cert);
  } catch (err: any) {
    console.error("❌ Failed to get certificate:", err.message || err);
  }
})();