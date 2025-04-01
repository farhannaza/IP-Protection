import HashStorageArtifact from '@/app/routes/artifacts/HashStorage.json';

export interface ContractConfig {
  address: string;
  abi: any;
  network: string;
}

export const getContractConfig = async (): Promise<ContractConfig> => {
  try {
    // Get the network ID from MetaMask
    const networkId = await window.ethereum.request({ method: 'net_version' });
    
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
      abi: HashStorageArtifact.abi,
      network: networkId
    };
    
  } catch (error: any) {
    throw new Error(`Failed to get contract config: ${error.message}`);
  }
}; 