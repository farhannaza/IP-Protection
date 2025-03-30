try {
  // ... existing code ...
} catch (_error) {
  // ... existing code ...
}

try {
  // ... existing code ...
} catch (_error) {
  // ... existing code ...
}

interface TransactionConfig {
  from: string;
  to: string;
  value?: string;
  gas?: number;
  gasPrice?: string;
  data?: string;
}

type TransactionResponse = {
  hash: string;
  // add other relevant properties
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
async function someFunction(config: TransactionConfig): Promise<TransactionResponse> {
  // ... existing code ...
}