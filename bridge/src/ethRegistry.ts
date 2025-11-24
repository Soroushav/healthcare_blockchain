import dotenv from "dotenv";
dotenv.config();
import { ethers } from "ethers";
import NetworkDirectoryAbi from "./NetworkDirectoryAbi.json";

const RPC_URL = process.env.RPC_URL!;
const REGISTRY_ADDRESS = process.env.REGISTRY_ADDRESS!;

const provider = new ethers.JsonRpcProvider(RPC_URL);
const registry = new ethers.Contract(REGISTRY_ADDRESS, NetworkDirectoryAbi, provider);

export async function isPublisherOnEthereum(address: string): Promise<boolean> {
  if (!ethers.isAddress(address)) return false;
  return await registry.isPublisher(address);
}