# Central Gateway

Simplify payments in Bangladesh with one unified library for AamarPay, SSLCommerz, and bKash. Skip the hassle of multiple gateway documentations—our consistent API does it all for you!

## Features

- **Unified Interface**: Single, consistent Interface for multiple payment gateways.
- **Gateway Abstraction**: Handles gateway-specific complexities behind the scenes.
- **Type Safety**: Full TypeScript support for a seamless development experience.
- **Error Handling**: Robust error handling with detailed error types to ensure reliability.
- **Multiple Gateways**: Supports AamarPay, SSLCommerz, and bKash out of the box.
- **Extensible**: Modular design allows for the easy addition of new gateways.
- **Validation**: Built-in validation for payment parameters to prevent errors.
- **Environment Support**: Easily toggle between sandbox and production environments.
- **Simple Integration**: One configuration pattern for all gateways simplifies setup.

## Installation

Install the package using npm or yarn:

```bash
npm install central-gateway
# or
yarn add central-gateway
```

## Configuration

To use the library, initialize a payment service instance with the required configurations for your gateways:

```typescript
import { PaymentService } from 'central-gateway';

const paymentService = new PaymentService({
  sslcommerz: {
    storeId: 'your-store-id',
    storePassword: 'your-store-password',
    sandbox: true, // Set to false for production
  },
  aamarpay: {
    storeId: 'your-store-id',
    signatureKey: 'your-signature-key',
    serverUrl: 'https://sandbox.aamarpay.com/jsonpost.php',
  },
  bkash: {
    username: 'your-username',
    password: 'your-password',
    appKey: 'your-app-key',
    appSecret: 'your-app-secret',
    isSandbox: true, // Set to false for production
  },
});
```

## Preparing Payment Data

Before initiating a payment, prepare the payment data with all the required properties. This ensures consistency and avoids repetitive code. Here’s an example:

```typescript
const paymentData = {
  amount: 50,
  currency: 'BDT',
  transactionId: 'unique-transaction-id',
  urls: {
    success: 'https://your-app.com/success',
    fail: 'https://your-app.com/fail',
    cancel: 'https://your-app.com/cancel',
    ipn: 'https://your-app.com/ipn',
  },
  product: {
    name: 'Product Name',
    category: 'Category',
    description: 'Product Description',
  },
  customer: {
    name: 'Customer Name',
    email: 'customer@email.com',
    phone: '01XXXXXXXXX',
    address: {
      line1: 'Address Line 1',
      city: 'City',
      state: 'State',
      postcode: '1234',
      country: 'Bangladesh',
    },
  },
};
```

## Processing Payments

Once the payment data is prepared, select the desired gateway and process the payment. Here’s an example for both SSLCommerz and AamarPay:

### Using SSLCommerz

```typescript
const sslcommerzGateway = paymentService.getGateway('sslcommerz');
const sslcommerzUrl = await sslcommerzGateway.processPayment(paymentData);

console.log('Redirect to:', sslcommerzUrl);
```

### Using AamarPay

```typescript
const aamarpayGateway = paymentService.getGateway('aamarpay');
const aamarpayUrl = await aamarpayGateway.processPayment(paymentData);

console.log('Redirect to:', aamarpayUrl);
```

### Using Bkash

```typescript
const bkashGateway = paymentService.getGateway('bkash');
const bkashUrl = await bkashGateway.processPayment(paymentData);

console.log('Redirect to:', bkashUrl);
```

#### bKash-Specific Steps

For bKash, you need additional steps to execute and query payments:

1. Execute the payment in your `callbackUrl` handler:

```typescript
const { paymentID } = req.query;
const bkashGateway = paymentService.getGateway('bkash');
const executionResponse = await bkashGateway.executePayment(paymentID); // paymentID from callback
```

2. You can query payment if you need to like this (Optional):

```typescript
const payment = await bkashGateway.queryPayment(paymentID);
```

## Unified Error Handling

Handle errors consistently across all gateways:

```typescript
try {
  const paymentUrl = await gateway.processPayment(paymentData);
} catch (error) {
  if (error instanceof PaymentError) {
    console.error('Code:', error.code);
    console.error('Message:', error.message);
    console.error('Details:', error.data);
    console.error('Gateway:', error.gateway);
  }
}
```

## Type Definitions

Here's the type definition for `PaymentData` to guide your implementation:

```typescript
interface PaymentData {
  amount: number;
  currency: string;
  transactionId: string;
  urls: {
    success: string;
    fail: string;
    cancel: string;
    ipn?: string;
    callback?: string; // Required for bKash
  };
  product: {
    name: string;
    category?: string;
    description?: string;
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
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.
