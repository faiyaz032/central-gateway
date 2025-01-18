export class PaymentError extends Error {
  constructor(public readonly code: number, message: string, public readonly data?: any) {
    super(message);
    this.name = 'PaymentError';
  }
}
