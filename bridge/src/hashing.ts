// bridge/src/hashing.ts
import { keccak256, toUtf8Bytes } from "ethers";
import canonicalize from "canonical-json"; // tiny lib, or write your own

export function hashPayload(payload: any): string {
  const canon = canonicalize(payload); // sorted keys, stable JSON
  return keccak256(toUtf8Bytes(canon)); // 0x... bytes32
}

export function hashSchemaId(schemaId: string): string {
  return keccak256(toUtf8Bytes(schemaId));
}