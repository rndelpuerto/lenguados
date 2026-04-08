# Function: assertRange()

> **assertRange**(`value`, `min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:245](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L245)

Asserts that a value is within a range (inclusive).

## Parameters

### value

`number`

Numeric value to validate

### min

`number`

Minimum inclusive bound

### max

`number`

Maximum inclusive bound

### name?

`string`

Parameter name for error messages (optional)

## Returns

`void`

## Remarks

Uses inclusive bounds: `min ≤ value ≤ max`.
No-op when assertions are disabled.

## Throws

If assertions enabled and value ∉ [min, max]

## Example

```typescript
function lerp(a: number, b: number, t: number): number {
 assertRange(t, 0, 1, 't');
 return a + (b - a) * t;
}
```

## Since

0.7.0
