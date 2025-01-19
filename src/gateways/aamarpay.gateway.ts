import { PaymentError } from '../errors/PaymentError';
import { AamarPayData, PaymentData } from '../types/interfaces';
import { BaseGateway } from './base.gateway';

export class AamarPayGateway extends BaseGateway {
  private readonly storeId: string;
  private readonly signatureKey: string;
  private readonly serverUrl: string;

  constructor(config: { storeId: string; signatureKey: string; serverUrl: string }) {
    super();
    this.storeId = config.storeId;
    this.signatureKey = config.signatureKey;
    this.serverUrl = config.serverUrl;
  }

  async processPayment(data: PaymentData): Promise<string> {
    try {
      const aamarpayData = this.mapToAamarPay(data);
      const response = await fetch(this.serverUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(aamarpayData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const paymentUrl = responseData?.payment_url;

      if (!paymentUrl) {
        throw new PaymentError(500, 'Aamarpay session was not successful. No payment URL returned.');
      }

      return paymentUrl;
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(500, `Failed to process Aamarpay payment: ${error.message}`, error);
    }
  }

  private mapToAamarPay(data: PaymentData): AamarPayData {
    return {
      store_id: this.storeId,
      signature_key: this.signatureKey,
      tran_id: data.transactionId,
      amount: data.amount,
      currency: data.currency,
      success_url: data.urls.success as string,
      fail_url: data.urls.fail as string,
      cancel_url: data.urls.cancel as string,
      desc: data.product.description,
      cus_name: data.customer.name,
      cus_email: data.customer.email,
      cus_phone: data.customer.phone,
      cus_add1: data.customer.address.line1,
      cus_add2: data.customer.address.line2,
      cus_city: data.customer.address.city,
      cus_state: data.customer.address.state,
      cus_postcode: data.customer.address.postcode,
      cus_country: data.customer.address.country,
      type: 'json',
    };
  }
}
