# Function: step()

> **step**(`edge`, `x`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:356](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L356)

Step function (Heaviside function).
Returns 0 if x < edge, else 1.

## Parameters

### edge

`number`

Threshold value

### x

`number`

Input value

## Returns

`number`

0 or 1

## Remarks

NaN comparisons: `step(NaN, x)` returns 1 (x is not < NaN), `step(edge, NaN)` returns 1.

## Example

```typescript
step(5, 3); // 0 (3 < 5)
step(5, 5); // 1 (5 >= 5)
step(5, 7); // 1 (7 > 5)
```

## Since

0.7.0
