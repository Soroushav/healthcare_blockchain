// src/routes/certRequests.ts
import { Router } from "express";
import { submitCertToFabric } from "../fabricClient";
import canonicalize from "canonical-json";
import { keccak256, toUtf8Bytes } from "ethers";
import { getAllCertsForUser, updateCertStatusInFabric, getTotalCertCountFromFabric } from "../fabricClient";

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

// router.get("/certs", async (req, res) => {
//   try {
//     const list = await getAllCertsFromFabric();
//     res.json({ certs: list });
//   } catch (err: any) {
//     console.error(err);
//     res.status(500).json({ error: err.message });
//   }
// });

router.post("/list", async (req, res)=> {
  try {
    const { walletAddress } = req.body;

    if (!walletAddress) {
      return res.status(400).json({ error: "walletAddress is required" });
    }

    const data = await getAllCertsForUser(walletAddress);
    res.json({ certs: data });
  } catch (err: any) {
    console.error(err);
    res.status(500).json({ error: err.message || "Internal error" });
  }
})

router.post("/status", async (req, res) => {
  const { walletAddress, certHash, status } = req.body;

  if (!walletAddress || !certHash || status === undefined) {
    return res.status(400).json({ error: "Missing required fields" });
  }

  const updated = await updateCertStatusInFabric(walletAddress, certHash, status);

  if (!updated) {
    return res.status(403).json({ error: "Unauthorized: not a publisher" });
  }

  return res.json({ ok: true });
});

router.get("/count", async (_req, res) => {
  const count = await getTotalCertCountFromFabric();
  res.json({ count });
});

export default router;