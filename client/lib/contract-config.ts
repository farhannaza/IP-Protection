declare global {
  interface Window {
    ethereum?: {
      request: (args: { method: string; params?: unknown[] }) => Promise<unknown>;
    };
  }
}

import HashStorageArtifact from '@/app/routes/artifacts/HashStorage.json';
import { AbiItem } from 'web3-utils';

export interface ContractConfig {
  address: string;
  abi: AbiItem[];
  network: string;
}

export const getContractConfig = async (): Promise<ContractConfig> => {
  try {
    if (!window.ethereum) {
      throw new Error("MetaMask is not installed");
    }

    // Get the network ID from MetaMask
    const networkId = await window.ethereum.request({ method: 'net_version' }) as string;
    
    // Get the deployed address for this network from the contract artifact
    const networks = HashStorageArtifact.networks as Record<string, { address: string }>;
    console.log("network:", networks)
    const deployedNetwork = networks[networkId];
    console.log("deployed:", deployedNetwork.address)


    if (!deployedNetwork) {
      throw new Error(`Contract not deployed on network ${networkId}`);
    }

    return {
      address: deployedNetwork.address,
      abi: HashStorageArtifact.abi as AbiItem[],
      network: networkId
    };
    
  } catch (error: unknown) {
    throw new Error(`Failed to get contract config: ${error instanceof Error ? error.message : error}`);
  }
}; 