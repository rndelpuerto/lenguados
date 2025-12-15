# Function: mod()

> **mod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:293](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L293)

Modulo operation that always returns positive result.
Unlike %, this handles negative numbers correctly.

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor (must be positive)

## Returns

`number`

Positive modulo result

## Example

```typescript
mod(7, 3);       // 1
mod(-7, 3);      // 2 (not -1 like %)
mod(-1, 3);      // 2
```

## Since

1.0.0
