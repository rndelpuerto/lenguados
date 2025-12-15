# Function: assertRange()

> **assertRange**(`value`, `min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:198](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L198)

Asserts that a value is within a range (inclusive).

## Parameters

### value

`number`

Numeric value to validate.

### min

`number`

Minimum inclusive bound.

### max

`number`

Maximum inclusive bound.

### name?

`string`

Parameter name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and value ∉ [min, max].

## Remarks

Uses inclusive bounds: `min ≤ value ≤ max`.
No-op when assertions are disabled.

## Example

```typescript
function lerp(a: number, b: number, t: number): number {
 assertRange(t, 0, 1, 't');
 return a + (b - a) * t;
}
```

## Since

0.1.0
