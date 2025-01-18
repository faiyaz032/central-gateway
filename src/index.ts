import { PaymentError } from './errors/PaymentError';
import { PaymentData, PaymentGatewayConfig } from './types/interfaces';

export class PaymentService {
  private config: PaymentGatewayConfig;
  private gateways: Map<string, any> = new Map();

  constructor(config: PaymentGatewayConfig) {
    this.config = config;
    this.initializeGateways();
  }

  private async initializeGateways() {
    if (this.config.aamarpay) {
      const { AamarPayGateway } = await import('./gateways/aamarpay.gateway');
      this.gateways.set('aamarpay', new AamarPayGateway(this.config.aamarpay));
    }

    if (this.config.sslcommerz) {
      const { SslCommerzGateway } = await import('./gateways/sslcommerz.gateway');
      this.gateways.set('sslcommerz', new SslCommerzGateway(this.config.sslcommerz));
    }
  }

  async processPayment(data: PaymentData): Promise<string> {
    if (!data.gateway) {
      throw new PaymentError(400, 'Payment gateway not specified');
    }

    const gateway = this.gateways.get(data.gateway);
    if (!gateway) {
      throw new PaymentError(400, `Unsupported payment gateway: ${data.gateway}`);
    }

    try {
      return await gateway.processPayment(data);
    } catch (error: any) {
      throw new PaymentError(error.code || 500, `Payment processing failed: ${error.message}`, error.data);
    }
  }
}

export * from './errors/PaymentError';
export * from './types/interfaces';
