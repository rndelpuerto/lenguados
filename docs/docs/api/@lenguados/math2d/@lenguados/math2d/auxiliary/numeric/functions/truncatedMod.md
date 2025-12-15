# Function: truncatedMod()

> **truncatedMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:60](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/numeric/wrapping.ts#L60)

Truncated modulo (same as %).
Included for completeness and clarity.

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Truncated remainder

## Example

```typescript
truncatedMod(7, 3);      // 1
truncatedMod(-7, 3);     // -1
truncatedMod(7, -3);     // 1
truncatedMod(-7, -3);    // -1
```

## Since

1.0.0
