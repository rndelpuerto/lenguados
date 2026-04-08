# Function: mod()

> **mod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:382](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L382)

Modulo operation that always returns positive result (strict).

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

## Throws

If divisor is not positive

## Example

```typescript
mod(7, 3); // 1
mod(-7, 3); // 2 (not -1 like %)
```

## See

- [modSafe](modSafe.md) - Returns 0 if divisor invalid
- [modUnchecked](modUnchecked.md) - No validation

## Since

0.7.0
