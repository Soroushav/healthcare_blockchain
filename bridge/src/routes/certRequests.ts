// src/routes/certRequests.ts
import { Router } from "express";
import { submitCertToFabric } from "../fabricClient";
import canonicalize from "canonical-json";
import { keccak256, toUtf8Bytes } from "ethers";
import { getAllCertsFromFabric } from "../fabricClient";

const router = Router();

router.post("/cert-requests", async (req, res) => {
  try {
    const { payload, certHash, schemaId, expiresAt } = req.body;

    if (!payload || !schemaId || !expiresAt) {
      return res.status(400).json({ error: "Missing fields" });
    }

    // Recompute certHash on backend to prevent tampering
    const canon = canonicalize(payload);
    const recomputedHash = keccak256(toUtf8Bytes(canon));
    if (recomputedHash !== certHash) {
      return res.status(400).json({ error: "certHash mismatch" });
    }

    const schemaHash = keccak256(toUtf8Bytes(schemaId));
    console.log(payload)
    // status 0 = Pending
    await submitCertToFabric(recomputedHash, schemaHash, expiresAt, 0, payload);

    res.json({
      ok: true,
      certHash: recomputedHash,
      schemaHash,
      status: "Pending"
    });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
});

router.get("/certs", async (req, res) => {
  try {
    const list = await getAllCertsFromFabric();
    res.json({ certs: list });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


export default router;