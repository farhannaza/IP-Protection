export class Web3Error extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'Web3Error';
  }
} 