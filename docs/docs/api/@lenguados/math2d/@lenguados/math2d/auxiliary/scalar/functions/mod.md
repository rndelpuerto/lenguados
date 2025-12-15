# Function: mod()

> **mod**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:391](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L391)

Modulo operation that always returns positive result (strict).

## Parameters

### dividend

`number`

Value to divide.

### divisor

`number`

Divisor (must be positive).

## Returns

`number`

Positive modulo result.

## Throws

If divisor is not positive.

## See

- [modSafe](modSafe.md) - Returns 0 if divisor invalid
- [modUnchecked](modUnchecked.md) - No validation

## Example

```typescript
mod(7, 3); // 1
mod(-7, 3); // 2 (not -1 like %)
```

## Since

1.0.0
