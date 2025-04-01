import Web3 from 'web3';
import { getContractConfig, type ContractConfig } from './contract-config';

declare global {
  interface Window {
    ethereum?: unknown;
  }
}

export interface HashData {
  hash: string;
  fileName: string;
  fileType: string;
  fileSize: string;
  timestamp: number;
}

export class Web3Service {
  private web3: Web3;
  private contract: unknown;
  private contractConfig: ContractConfig | null = null;

  constructor() {
    if (typeof window === 'undefined' || !window.ethereum) {
      throw new Error('Please install MetaMask to use this application');
    }
    this.web3 = new Web3(window.ethereum);
  }

  async initialize(): Promise<void> {
    try {
      // Get contract configuration
      this.contractConfig = await getContractConfig();
      
      // Initialize contract
      this.contract = new this.web3.eth.Contract(
        this.contractConfig.abi,
        this.contractConfig.address
      );

      // Listen for network changes
      window.ethereum.on('chainChanged', () => {
        window.location.reload();
      });

    } catch (error: unknown) {
      throw new Error(`Failed to initialize Web3Service: ${error as string}`);
    }
  }

  async getContractAddress(): Promise<string> {
    if (!this.contractConfig) {
      throw new Error('Contract not initialized');
    }
    return this.contractConfig.address;
  }

  async getNetworkName(): Promise<string> {
    const networkId = await this.web3.eth.net.getId();
    const networks: Record<string, string> = {
      '1': 'Ethereum Mainnet',
      '5': 'Goerli Testnet',
      '11155111': 'Sepolia Testnet',
      '5777': 'Local Ganache'
    };
    return networks[networkId.toString()] || `Network ${networkId}`;
  }

  async connectWallet(): Promise<string[]> {
    try {
      const accounts = await window.ethereum.request({ 
        method: 'eth_requestAccounts' 
      });
      return accounts;
    } catch (error: unknown) {
      throw new Error('Failed to connect wallet');
    }
  }

  async storeHash(
    hash: string, 
    fileName: string, 
    fileType: string,
    fileSize: string
  ): Promise<string> {
    this.ensureInitialized();
    try {
      const accounts = await this.connectWallet();
      const result = await (this.contract as any).methods
        .storeHash(hash, fileName, fileType, fileSize)
        .send({
          from: accounts[0]
        });
      console.log("txhash:", result.transactionHash)

      return result.transactionHash;
    } catch (error: unknown) {
      throw new Error(error as string || 'Failed to store hash');
    }
  }

  async getAllProtectedAssets(): Promise<HashData[]> {
    this.ensureInitialized();
    try {
      const hashes = await (this.contract as any).methods.getAllHashes().call();
      const assets: HashData[] = [];

      for (const hash of hashes) {
        const data = await (this.contract as any).methods.getHashData(hash).call();
        assets.push({
          hash: data[0],
          fileName: data[1],
          fileType: data[2],
          fileSize: data[3],
          timestamp: Number(data[4])
        });
      }

      return assets;
    } catch (error: unknown) {
      throw new Error(error as string || 'Failed to fetch protected assets');
    }
  }

  async verifyHash(hash: string): Promise<{
    exists: boolean;
    fileName?: string;
    fileType?: string;
    fileSize?: string;
    timestamp?: number;
    transactionHash?: string;
  }> {
    this.ensureInitialized();
    try {
      const exists = await (this.contract as any).methods.hashExists(hash).call();
      if (exists) {
        const data = await (this.contract as any).methods.getHashData(hash).call();
        console.log("hash",hash);
        return { 
          exists, 
          fileName: data[1],
          fileType: data[2],
          fileSize: data[3],
          timestamp: Number(data[4]),
          transactionHash: hash
        };
      }
      return { exists };
    } catch (error: unknown) {
      throw new Error('Failed to verify hash');
    }
  }

  async getHashTransactionHash(hash: string): Promise<string> {
    this.ensureInitialized();
    try {
      // Get past events for the HashStored event (this is the event name from your smart contract)
      const events = await (this.contract as any).getPastEvents('HashStored', {
        filter: { hash: hash },
        fromBlock: 0,
        toBlock: 'latest'
      });

      if (events.length === 0) {
        throw new Error('No transaction found for this hash');
      }

      // Return the transaction hash of the event
      return events[0].transactionHash;
    } catch (error: unknown) {
      throw new Error(`Failed to get transaction hash: ${error as string}`);
    }
  }

  // Add check for contract initialization
  private ensureInitialized() {
    if (!this.contract) {
      throw new Error('Contract not initialized. Call initialize() first.');
    }
  }
} 