try {
  // ... existing code ...
} catch (_) {
  // ... existing code ...
}

try {
  // ... existing code ...
} catch (_) {
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

function someFunction(config: TransactionConfig) {
  // ... existing code ...
}