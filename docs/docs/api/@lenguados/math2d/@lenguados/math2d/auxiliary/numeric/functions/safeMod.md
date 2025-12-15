# Function: safeMod()

> **safeMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/safety.ts:251](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/safety.ts#L251)

Safe modulo that handles negative divisor.

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Modulo result or 0 if divisor is 0

## Remarks

Unlike the % operator, this ensures the result has the same
sign as the divisor (Euclidean modulo).

## Example

```typescript
safeMod(7, 3);       // 1
safeMod(-7, 3);      // 2 (not -1)
safeMod(7, -3);      // -2 (not 1)
safeMod(-7, -3);     // -1
safeMod(5, 0);       // 0 (safe fallback)
```

## Since

1.0.0
