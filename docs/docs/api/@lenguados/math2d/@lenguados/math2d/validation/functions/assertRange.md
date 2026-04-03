# Function: assertRange()

> **assertRange**(`value`, `min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:245](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L245)

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
