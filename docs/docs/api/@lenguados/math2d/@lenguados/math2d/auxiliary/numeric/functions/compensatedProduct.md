# Function: compensatedProduct()

> **compensatedProduct**(`a`, `b`): `object`

Defined in: [src/auxiliary/numeric/safety.ts:317](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/safety.ts#L317)

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

## Remarks

Veltkamp splitting multiplies inputs by `2^27 + 1` (~1.34e8).
This overflows for `|a|` or `|b|` > ~1.34e291 (`MAX_VALUE / 134217729`).
For such inputs, the error term will be unreliable (Infinity/NaN).

## Example

```typescript
const result = compensatedProduct(1.23456789, 9.87654321);
// result.product: main product
// result.error: rounding error
const exact = result.product + result.error;
```

## Since

0.7.0
