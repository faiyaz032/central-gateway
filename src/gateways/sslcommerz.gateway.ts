import { SslCommerzPayment } from 'sslcommerz';
import { PaymentError } from '../errors/PaymentError';
import { PaymentData, SslCommerzData } from '../types/interfaces';
import { BaseGateway } from './base.gateway';

export class SslCommerzGateway extends BaseGateway {
  private readonly storeId: string;
  private readonly storePassword: string;
  private readonly testMode: boolean;

  constructor(config: { storeId: string; storePassword: string; testMode?: boolean }) {
    super();
    this.storeId = config.storeId;
    this.storePassword = config.storePassword;
    this.testMode = config.testMode ?? false;
  }

  async processPayment(data: PaymentData): Promise<string> {
    try {
      const sslcommerzData = this.mapToSslCommerz(data);
      const sslcommerz = new SslCommerzPayment(this.storeId, this.storePassword, this.testMode);

      const response = await sslcommerz.init(sslcommerzData);
      const gatewayPageUrl = response?.GatewayPageURL;

      if (!gatewayPageUrl) {
        throw new PaymentError(500, 'SSL Commerz session was not successful. No GatewayPageURL returned.');
      }

      return gatewayPageUrl;
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(500, `Failed to process SSL Commerz payment: ${error.message}`, error);
    }
  }

  private mapToSslCommerz(data: PaymentData): SslCommerzData {
    return {
      total_amount: data.amount,
      currency: data.currency,
      tran_id: data.transactionId,
      success_url: data.urls.success,
      fail_url: data.urls.fail,
      cancel_url: data.urls.cancel,
      ipn_url: data.urls.ipn,
      product_name: data.product.name,
      product_category: data.product.category || 'default',
      product_profile: 'default',
      cus_name: data.customer.name,
      cus_email: data.customer.email,
      cus_phone: data.customer.phone,
      cus_add1: data.customer.address.line1,
      cus_add2: data.customer.address.line2,
      cus_city: data.customer.address.city,
      cus_state: data.customer.address.state,
      cus_postcode: data.customer.address.postcode,
      cus_country: data.customer.address.country,
      shipping_method: 'NO',
    };
  }
}
