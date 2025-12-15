# Function: truncatedMod()

> **truncatedMod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:109](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L109)

Truncated modulo (same as %).
Included for completeness and clarity.

## Parameters

### dividend

`number`

Value to divide.

### divisor

`number`

Divisor.

## Returns

`number`

Truncated remainder.

## Example

```typescript
truncatedMod(7, 3); // 1
truncatedMod(-7, 3); // -1
truncatedMod(7, -3); // 1
truncatedMod(-7, -3); // -1
```

## Since

1.0.0
