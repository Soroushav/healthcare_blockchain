import { getCertFromFabric } from "./src/fabricClient";

(async () => {
  const certHash =
    "0x7a0abee36db5fa68f3b4aa3104659a1a60176b7449422a3ae7205a1bb88d8118"; // the one you printed

  try {
    const cert = await getCertFromFabric(certHash);
    console.log("✅ Cert from Fabric:", cert);
  } catch (err: any) {
    console.error("❌ Failed to get certificate:", err.message || err);
  }
})();