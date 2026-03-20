# Function: assertRange()

> **assertRange**(`value`, `min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:236](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L236)

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
