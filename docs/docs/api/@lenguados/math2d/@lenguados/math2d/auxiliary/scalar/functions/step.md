# Function: step()

> **step**(`edge`, `x`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:328](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L328)

Step function (Heaviside function).
Returns 0 if x < edge, else 1.

## Parameters

### edge

`number`

Threshold value.

### x

`number`

Input value.

## Returns

`number`

0 or 1.

## Example

```typescript
step(5, 3); // 0 (3 < 5)
step(5, 5); // 1 (5 >= 5)
step(5, 7); // 1 (7 > 5)
```

## Since

0.7.0
