# Function: modSafe()

> **modSafe**(`dividend`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:407](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L407)

Modulo operation that always returns positive result (safe).

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor

## Returns

`number`

Positive modulo result, or 0 if divisor <= 0

## Example

```typescript
modSafe(7, 3); // 1
modSafe(7, 0); // 0
```

## See

[mod](mod.md) - Throws for non-positive divisor

## Since

0.7.0
