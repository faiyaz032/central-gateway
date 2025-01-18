# Unified-Payments

An unified payment gateway integration library for Bangladeshi payment providers. Currently supports AamarPay and SSLCommerz.

## Installation

```bash
npm install unified-payments
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

MIT

// LICENSE
MIT License

Copyright (c) 2024 Your Name

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
