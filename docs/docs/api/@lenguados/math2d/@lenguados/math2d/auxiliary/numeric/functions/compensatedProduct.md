# Function: compensatedProduct()

> **compensatedProduct**(`a`, `b`): `object`

Defined in: [src/auxiliary/numeric/safety.ts:253](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/safety.ts#L253)

Compensated product using error-free transformation.

## Parameters

### a

`number`

First factor.

### b

`number`

Second factor.

## Returns

`object`

Object with product and error term.

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

0.7.0
