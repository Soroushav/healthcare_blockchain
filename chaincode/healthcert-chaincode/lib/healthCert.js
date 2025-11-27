'use strict';

const { Contract } = require('fabric-contract-api');

class HealthCertContract extends Contract {
    _key(certHash) {
        return `CERT_${certHash}`;
    }

    async issueOrUpdateCert(ctx, certHash, schemaHash, expiresAt, status) {
        if (!certHash) throw new Error("certHash required");

        const key = this._key(certHash);
        const existing = await ctx.stub.getState(key);
        const now = Math.floor(Date.now() / 1000);

        let record;
        if (!existing || existing.length === 0) {
            record = {
                certHash,
                schemaHash,
                issuedAt: now,
                expiresAt: parseInt(expiresAt),
                status: parseInt(status) // 0=Active,1=Suspended,2=Revoked
            };
        } else {
            record = JSON.parse(existing.toString());
            record.schemaHash = schemaHash;
            record.expiresAt = parseInt(expiresAt);
            record.status = parseInt(status);
        }

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(record)));
        await ctx.stub.setEvent("CertAnchored", Buffer.from(JSON.stringify(record)));
        return record;
    }

    async setStatus(ctx, certHash, newStatus) {
        const key = this._key(certHash);
        const bytes = await ctx.stub.getState(key);
        if (!bytes || bytes.length === 0) throw new Error("NOT_FOUND");

        const record = JSON.parse(bytes.toString());
        record.status = parseInt(newStatus);

        await ctx.stub.putState(key, Buffer.from(JSON.stringify(record)));
        await ctx.stub.setEvent("CertStatusUpdated", Buffer.from(JSON.stringify(record)));
        return record;
    }

    async extendExpiry(ctx, certHash, newExpiresAt) {
        const key = this._key(certHash);
        const bytes = await ctx.stub.getState(key);
        if (!bytes || bytes.length === 0) throw new Error("NOT_FOUND");

        const record = JSON.parse(bytes.toString());
        newExpiresAt = parseInt(newExpiresAt);
        if (newExpiresAt !== 0 && newExpiresAt <= record.expiresAt) {
            throw new Error("bad expiry");
        }

        record.expiresAt = newExpiresAt;
        await ctx.stub.putState(key, Buffer.from(JSON.stringify(record)));
        await ctx.stub.setEvent("CertExpiryUpdated", Buffer.from(JSON.stringify(record)));
        return record;
    }

    async getCertsByWallet(ctx, walletAddress) {
        const iterator = await ctx.stub.getStateByRange("", "");
        const results = [];

        while (true) {
            const res = await iterator.next();
            if (res.value && res.value.value.toString()) {
                try {
                    const cert = JSON.parse(res.value.value.toString());

                    if (
                        cert.walletAddress &&
                        cert.walletAddress.toLowerCase() === walletAddress.toLowerCase()
                    ) {
                        results.push(cert);
                    }
                } catch (err) {
                    console.error("Failed to parse cert:", err);
                }
            }

            if (res.done) break;
        }

        await iterator.close();
        return results;
    }

    async verify(ctx, certHash) {
        const key = this._key(certHash);
        const bytes = await ctx.stub.getState(key);
        if (!bytes || bytes.length === 0) return { isValid: false, reason: "NOT_FOUND" };

        const r = JSON.parse(bytes.toString());
        const now = Math.floor(Date.now() / 1000);

        if (r.status === 2) return { isValid: false, reason: "REVOKED" };
        if (r.status === 1) return { isValid: false, reason: "SUSPENDED" };
        if (r.expiresAt !== 0 && now > r.expiresAt) {
            return { isValid: false, reason: "EXPIRED" };
        }
        return { isValid: true, reason: "ACTIVE" };
    }
}

module.exports = HealthCertContract;