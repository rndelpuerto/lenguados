# Function: step()

> **step**(`edge`, `x`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:251](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L251)

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

## Example

```typescript
step(5, 3);      // 0 (3 < 5)
step(5, 5);      // 1 (5 >= 5)
step(5, 7);      // 1 (7 > 5)
```

## Since

1.0.0
