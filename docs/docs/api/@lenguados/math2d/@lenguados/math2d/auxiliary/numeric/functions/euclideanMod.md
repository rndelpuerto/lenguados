# Function: euclideanMod()

> **euclideanMod**(`dividend`, `divisor`): `number`

Euclidean modulo (always positive).
Better than % for negative numbers.

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor (must be positive)

## Returns

`number`

Positive remainder

## Remarks

Delegates to [mod](../../scalar/functions/mod.md) from scalar/arithmetic for DRY compliance.
Use this alias when working in a wrapping/modulo context.

## Example

```typescript
euclideanMod(7, 3); // 1
euclideanMod(-7, 3); // 2 (not -1 like %)
euclideanMod(0, 3); // 0
euclideanMod(3, 3); // 0
```

## Since

1.0.0
