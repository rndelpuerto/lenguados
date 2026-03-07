# Function: assertRange()

> **assertRange**(`value`, `min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:222](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L222)

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

0.7.0
