# Function: compensatedProduct()

> **compensatedProduct**(`a`, `b`): `object`

Defined in: [src/auxiliary/numeric/safety.ts:330](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/safety.ts#L330)

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
This overflows for `|a|` or `|b|` > ~1.34e300 (`MAX_VALUE / 134217729`).
For such inputs, the error term will be unreliable (Infinity/NaN).

## Examples

```typescript
const result = compensatedProduct(1.23456789, 9.87654321);
// result.product: main product
// result.error: rounding error
const exact = result.product + result.error;
```

```typescript
// High-precision dot product using compensated multiplication
const { product: p1, error: e1 } = compensatedProduct(a.x, b.x);
const { product: p2, error: e2 } = compensatedProduct(a.y, b.y);
const preciseDot = p1 + p2 + (e1 + e2);
```

## Since

0.7.0
