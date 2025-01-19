# Central Gateway

Simplify payments in Bangladesh with one unified library for AamarPay, SSLCommerz, and bKash. Skip the hassle of multiple gateway documentations—our consistent API does it all for you!

## Features

- **Unified Interface**: Single, consistent API for multiple payment gateways - no need to learn different gateway-specific configurations
- **Gateway Abstraction**: Handles all the complex gateway-specific implementations behind the scenes
- **Type Safety**: Full TypeScript support with type definitions for all configurations
- **Error Handling**: Robust error handling with detailed error types
- **Multiple Gateways**: Currently supports AamarPay and SSLCommerz with the same configuration structure
- **Extensible**: Modular design makes it easy to add new payment gateways
- **Validation**: Built-in validation for payment parameters
- **Environment Support**: Supports both sandbox and production environments
- **Simple Integration**: One configuration pattern works across all supported payment gateways

## Installation

```bash
npm install central-gateway
# or
yarn add central-gateway
```

## SSLCommerz Integration

### Configuration

```typescript
import { PaymentService } from 'central-gateway';

const paymentService = new PaymentService({
  sslcommerz: {
    storeId: 'your-store-id',
    storePassword: 'your-store-password',
    sandbox: true, // Set to false for production
  },
});
```

### Process Payment

```typescript
const sslcommerz = paymentService.getGateway('sslcommerz');

const paymentUrl = await sslcommerz.processPayment({
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
});
```

## AamarPay Integration

### Configuration

```typescript
const paymentService = new PaymentService({
  aamarpay: {
    storeId: 'your-store-id',
    signatureKey: 'your-signature-key',
    serverUrl: 'https://sandbox.aamarpay.com/jsonpost.php', // Use production URL for live
  },
});
```

### Process Payment

```typescript
const aamarpay = paymentService.getGateway('aamarpay');

const paymentUrl = await aamarpay.processPayment({
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
});
```

## bKash Integration

### Configuration

```typescript
const paymentService = new PaymentService({
  bkash: {
    username: 'your-username',
    password: 'your-password',
    appKey: 'your-app-key',
    appSecret: 'your-app-secret',
    isSandbox: true, // Set to false for production
  },
});
```

### 1. Process Payment

```typescript
const bkash = paymentService.getGateway('bkash');

const paymentUrl = await bkash.processPayment({
  amount: 50,
  currency: 'BDT',
  transactionId: 'unique-transaction-id',
  urls: {
    success: 'https://your-app.com/success',
    callback: 'https://your-app.com/api/payments/execute', // Important: This URL will receive the paymentID
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
});
```

### 2. Execute Payment

After the user completes payment, bKash will redirect to your callback URL with a `paymentID`. You must execute the payment to complete the transaction:

```typescript
// In your callback route handler:
const bkash = paymentService.getGateway('bkash');

// paymentID comes from the URL query parameter
const executionResponse = await bkash.executePayment(paymentID);
```

### 3. Query Payment Status (Optional)

```typescript
const bkash = paymentService.getGateway('bkash');
const paymentStatus = await bkash.queryPayment(paymentID);
```

## Error Handling

All gateways use the same error handling pattern:

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

```typescript
interface PaymentData {
  amount: number;
  currency: string;
  transactionId: string;
  urls: {
    success: string;
    callback?: string; // Required for bKash
    fail: string;
    cancel: string;
    ipn?: string;
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
