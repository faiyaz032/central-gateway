import { AamarPayGateway } from '../gateways/aamarpay.gateway';
import { BkashGateway } from '../gateways/bkash.gateway';
import { SslCommerzGateway } from '../gateways/sslcommerz.gateway';

export type GatewayNames = 'aamarpay' | 'sslcommerz' | 'bkash';

export type GatewayInstances = {
  aamarpay: AamarPayGateway;
  sslcommerz: SslCommerzGateway;
  bkash: BkashGateway;
};

export interface PaymentGatewayConfig {
  aamarpay?: {
    storeId: string;
    signatureKey: string;
    serverUrl: string;
  };
  sslcommerz?: {
    storeId: string;
    storePassword: string;
    isLive?: boolean;
  };
  bkash?: {
    username: string;
    password: string;
    appKey: string;
    appSecret: string;
    isSandbox?: boolean;
  };
}

export interface AamarPayData {
  store_id: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  amount: number;
  currency: string;
  signature_key: string;
  desc: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_add2?: string;
  cus_city: string;
  cus_state: string;
  cus_postcode: string;
  cus_country: string;
  cus_phone: string;
  type: string;
}

export interface SslCommerzData {
  total_amount?: number;
  currency: string;
  tran_id: string;
  success_url: string;
  fail_url: string;
  cancel_url: string;
  ipn_url?: string;
  product_name: string;
  product_category: string;
  product_profile: string;
  cus_name: string;
  cus_email: string;
  cus_add1: string;
  cus_add2?: string;
  cus_city: string;
  cus_state?: string;
  cus_postcode?: string | number;
  cus_country: string;
  cus_phone: string;
  shipping_method?: string;
}

export interface BkashData {
  mode: string;
  payerReference: string;
  callbackURL: string;
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

//Unified Payment Data
export interface PaymentData {
  amount: number;
  currency: string;
  transactionId: string;
  urls: {
    callback?: string;
    success?: string;
    fail?: string;
    cancel?: string;
    ipn?: string;
  };

  product: {
    name: string;
    category?: string;
    description: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      line2?: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
}
export interface BkashExecutePaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  payerReference: string;
  customerMsisdn: string;
  trxID: string;
  amount: string;
  transactionStatus: 'Completed' | 'Failed' | 'Canceled';
  paymentExecuteTime: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
}

export interface BkashQueryPaymentResponse {
  statusCode: string;
  statusMessage: string;
  paymentID: string;
  trxID: string;
  transactionStatus: 'Completed' | 'Failed' | 'Canceled';
  amount: string;
  currency: string;
  intent: string;
  merchantInvoiceNumber: string;
  updateTime: string;
  payerReference: string;
  customerMsisdn: string;
}
