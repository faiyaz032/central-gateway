# Central Gateway

Simplify payments in Bangladesh with one unified library for AamarPay, SSLCommerz, and more. Skip the hassle of multiple gateway documentations—our consistent API does it all for you!

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

Install the package using npm:

```bash
npm install central-gateway
```

Or using yarn:

```bash
yarn add central-gateway
```

## Configuration

### Initialize Payment Service

Create a new instance of the payment service with your gateway credentials. The configuration structure remains consistent across all payment gateways:

```typescript
import { PaymentService } from 'central-gateway';

const paymentService = new PaymentService({
  // AamarPay Configuration
  aamarpay: {
    storeId: 'your-store-id',
    signatureKey: 'your-signature-key',
    serverUrl: 'https://sandbox.aamarpay.com/request.php', // Use production URL for live environment
  },

  // SSLCommerz Configuration - Notice how similar the configuration structure is
  sslcommerz: {
    storeId: 'your-store-id',
    storePassword: 'your-store-password',
    isLive: false, // Set to true for production environment
  },
});
```

You can configure either one or both gateways based on your needs. The library handles all the gateway-specific implementations internally, so you don't need to worry about different API structures or requirements.

## Processing Payments

### Basic Payment Processing

The same payment processing code works for all gateways - just change the gateway name:

```typescript
const paymentUrl = await paymentService.processPayment({
  gateway: 'aamarpay', // Simply change to 'sslcommerz' to use SSLCommerz instead
  amount: 1000,
  currency: 'BDT',
  transactionId: 'unique-transaction-id', // Must be unique for each transaction
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

### Advanced Usage

#### Custom Error Handling

Consistent error handling across all payment gateways:

```typescript
import { PaymentError } from 'central-gateway';

try {
  const paymentUrl = await paymentService.processPayment({
    // payment details...
  });
  // Redirect user to paymentUrl
} catch (error) {
  if (error instanceof PaymentError) {
    console.error('Payment processing failed:', error.message);
    console.error('Error code:', error.code);
    console.error('Gateway:', error.gateway);
  }
}
```

#### Environment-Specific Configuration

```typescript
const paymentService = new PaymentService({
  aamarpay: {
    storeId: process.env.AAMARPAY_STORE_ID,
    signatureKey: process.env.AAMARPAY_SIGNATURE_KEY,
    serverUrl:
      process.env.NODE_ENV === 'production'
        ? 'https://secure.aamarpay.com/request.php'
        : 'https://sandbox.aamarpay.com/request.php',
  },
});
```

## Types

### Payment Configuration

The same configuration type works across all supported gateways:

```typescript
interface PaymentConfig {
  gateway: 'aamarpay' | 'sslcommerz';
  amount: number;
  currency: string;
  transactionId: string;
  urls: {
    success: string;
    fail: string;
    cancel: string;
  };
  product: {
    name: string;
    description?: string;
  };
  customer: {
    name: string;
    email: string;
    phone: string;
    address: {
      line1: string;
      city: string;
      state: string;
      postcode: string;
      country: string;
    };
  };
}
```

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

1. Fork the repository
2. Create your feature branch (`git checkout -b gateway/stripe`)
3. Commit your changes (`git commit -m 'Add a gateway'`)
4. Push to the branch (`git push origin gateway/stripe`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/licenses/MIT) file for details.
