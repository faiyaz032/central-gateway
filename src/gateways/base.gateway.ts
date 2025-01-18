import { PaymentData } from '../types/interfaces';

export abstract class BaseGateway {
  abstract processPayment(data: PaymentData): Promise<string>;
}
