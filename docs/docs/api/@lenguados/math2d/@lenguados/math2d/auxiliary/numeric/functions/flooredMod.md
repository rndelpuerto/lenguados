# Function: flooredMod()

> **flooredMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:38](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/wrapping.ts#L38)

Floored modulo.

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Floored remainder

## Example

```typescript
flooredMod(7, 3);       // 1
flooredMod(-7, 3);      // 2
flooredMod(7, -3);      // -2
flooredMod(-7, -3);     // -1
```

## Since

1.0.0
