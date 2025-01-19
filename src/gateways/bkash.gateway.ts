import { PaymentError } from '../errors/PaymentError';
import { BkashData, BkashExecutePaymentResponse, BkashQueryPaymentResponse, PaymentData } from '../types/interfaces';
import { BaseGateway } from './base.gateway';

export class BkashGateway extends BaseGateway {
  private readonly username: string;
  private readonly password: string;
  private readonly appKey: string;
  private readonly appSecret: string;
  private readonly baseUrl: string;
  private authToken: string | null = null;

  constructor(config: { username: string; password: string; appKey: string; appSecret: string; isSandbox?: boolean }) {
    super();
    this.username = config.username;
    this.password = config.password;
    this.appKey = config.appKey;
    this.appSecret = config.appSecret;
    this.baseUrl = config.isSandbox
      ? 'https://tokenized.sandbox.bka.sh/v1.2.0-beta'
      : 'https://tokenized.pay.bka.sh/v1.2.0-beta';
  }
  //01823074817
  private async getAuthToken(): Promise<string> {
    if (this.authToken) return this.authToken;

    try {
      const response = await fetch(`${this.baseUrl}/tokenized/checkout/token/grant`, {
        method: 'POST',

        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
          username: this.username,
          password: this.password,
        },
        body: JSON.stringify({
          app_key: this.appKey,
          app_secret: this.appSecret,
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      if (!data.id_token) {
        throw new Error('No token received from bKash');
      }

      this.authToken = data.id_token;
      return this.authToken as string;
    } catch (error: any) {
      throw new PaymentError(500, `Failed to get bKash auth token: ${error.message}`, error);
    }
  }

  async processPayment(data: PaymentData): Promise<string> {
    try {
      const token = await this.getAuthToken();
      const bkashData = this.mapToBkash(data);

      const response = await fetch(`${this.baseUrl}/tokenized/checkout/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.appKey,
        },
        body: JSON.stringify(bkashData),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();
      const paymentUrl = responseData?.bkashURL;

      if (!paymentUrl) {
        throw new PaymentError(500, 'bKash session was not successful. No payment URL returned.');
      }

      return paymentUrl;
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(500, `Failed to process bKash payment: ${error.message}`, error);
    }
  }

  private mapToBkash(data: PaymentData): BkashData {
    return {
      mode: '0011',
      payerReference: data.customer.phone,
      callbackURL: data.urls.callback as string,
      amount: data.amount.toString(),
      currency: data.currency,
      intent: 'sale',
      merchantInvoiceNumber: data.transactionId,
    };
  }

  async executePayment(paymentId: string): Promise<BkashExecutePaymentResponse> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseUrl}/tokenized/checkout/execute`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.appKey,
        },
        body: JSON.stringify({ paymentID: paymentId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const responseData = await response.json();

      if (responseData.statusCode && responseData.statusCode !== '0000') {
        throw new PaymentError(400, `bKash payment execution failed: ${responseData.statusMessage || 'Unknown error'}`);
      }

      return responseData;
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(500, `Failed to execute bKash payment: ${error.message}`, error);
    }
  }

  async queryPayment(paymentId: string): Promise<BkashQueryPaymentResponse> {
    try {
      const token = await this.getAuthToken();

      const response = await fetch(`${this.baseUrl}/tokenized/checkout/payment/status`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: token,
          'X-APP-Key': this.appKey,
        },
        body: JSON.stringify({ paymentID: paymentId }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      return await response.json();
    } catch (error: any) {
      if (error instanceof PaymentError) {
        throw error;
      }
      throw new PaymentError(500, `Failed to query bKash payment: ${error.message}`, error);
    }
  }
}
