# Function: abs()

> **abs**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:71](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L71)

Absolute value.

## Parameters

### value

`number`

Input value.

## Returns

`number`

Absolute value.

## Remarks

This is a thin wrapper around Math.abs provided for API completeness.
Internal library code may use Math.abs directly for clarity and to
avoid indirection overhead in hot paths. Both are deterministic per IEEE 754.

**When to use this function:**

- When you want a consistent import from `@lenguados/math2d`
- In user-facing code for API consistency

**When to use Math.abs directly:**

- In performance-critical internal code
- When working with standard library patterns

## Since

1.0.0
