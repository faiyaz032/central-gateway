import { PaymentError } from './errors/PaymentError';
import { GatewayInstances, GatewayNames, PaymentGatewayConfig } from './types/interfaces';

export class PaymentService {
  private gateways: Map<GatewayNames, GatewayInstances[GatewayNames]> = new Map();

  constructor(config: PaymentGatewayConfig) {
    // Initialize gateways asynchronously
    this.initializeGateways(config).catch((error) => {
      throw new PaymentError(500, `Failed to initialize payment gateways: ${error.message}`);
    });
  }

  /**
   * Dynamically import and initialize payment gateways.
   * @param config The payment gateway configuration.
   */
  private async initializeGateways(config: PaymentGatewayConfig) {
    if (config.aamarpay) {
      const { AamarPayGateway } = await import('./gateways/aamarpay.gateway');
      this.gateways.set('aamarpay', new AamarPayGateway(config.aamarpay) as GatewayInstances['aamarpay']);
    }

    if (config.sslcommerz) {
      const { SslCommerzGateway } = await import('./gateways/sslcommerz.gateway');
      this.gateways.set('sslcommerz', new SslCommerzGateway(config.sslcommerz) as GatewayInstances['sslcommerz']);
    }

    if (config.bkash) {
      const { BkashGateway } = await import('./gateways/bkash.gateway');
      this.gateways.set('bkash', new BkashGateway(config.bkash) as GatewayInstances['bkash']);
    }
  }

  /**
   * Get a specific payment gateway instance.
   * @param gatewayName The name of the payment gateway.
   * @returns The gateway instance.
   * @throws PaymentError if the gateway is not configured.
   */
  public getGateway<K extends GatewayNames>(gatewayName: K): GatewayInstances[K] {
    const gateway = this.gateways.get(gatewayName);
    if (!gateway) {
      throw new PaymentError(400, `Payment gateway ${gatewayName} is not configured`);
    }
    return gateway as GatewayInstances[K];
  }
}

export * from './errors/PaymentError';
export * from './types/interfaces';
