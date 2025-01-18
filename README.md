# Unified-Payments

An unified payment gateway integration library for Bangladeshi payment providers. Currently supports AamarPay and SSLCommerz.

## Installation

```bash
npm install unified-payments
```

or

```bash
yarn add unified-payments
```

## Usage

```typescript
import { PaymentService } from 'unified-payments';

// Initialize the payment service
const paymentService = new PaymentService({
  //You can use either Aamarpay or SSLCommerz, or both.

  aamarpay: {
    storeId: 'your-store-id',
    signatureKey: 'your-signature-key',
    serverUrl: 'https://sandbox.aamarpay.com/request.php',
  },

  sslcommerz: {
    storeId: 'your-store-id',
    storePassword: 'your-signature-key',
    sandbox: true,
  },
});

// Process a payment
const paymentUrl = await paymentService.processPayment({
  gateway: 'aamarpay', //Switch your gateway here. It can be either 'aamarpay' or 'sslcommerz'.
  amount: 1000,
  currency: 'BDT',
  transactionId: 'unique-transaction-id',
  urls: {
    success: 'https://your-domain.com/success',
    fail: 'https://your-domain.com/fail',
    cancel: 'https://your-domain.com/cancel',
  },
  product: {
    name: 'Test Product',
    description: 'Product description',
  },
  customer: {
    name: 'John Doe',
    email: 'john@example.com',
    phone: '+8801XXXXXXXXX',
    address: {
      line1: '123 Street',
      city: 'Dhaka',
      state: 'Dhaka',
      postcode: '1000',
      country: 'Bangladesh',
    },
  },
});
```

## Features

- Unified interface for multiple payment gateways
- Type-safe configurations
- Error handling with custom error types
- Supports AamarPay and SSLCommerz
- Easy to extend for additional gateways

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.
