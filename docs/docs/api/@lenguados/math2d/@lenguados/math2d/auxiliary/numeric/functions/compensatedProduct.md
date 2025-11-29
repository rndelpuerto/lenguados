# Function: compensatedProduct()

> **compensatedProduct**(`a`, `b`): `object`

Compensated product using error-free transformation.

## Parameters

### a

`number`

First factor

### b

`number`

Second factor

## Returns

`object`

Object with product and error term

### error

> **error**: `number`

### product

> **product**: `number`

## Example

```typescript
const result = compensatedProduct(1.23456789, 9.87654321);
// result.product: main product
// result.error: rounding error
const exact = result.product + result.error;
```

## Since

1.0.0
