# Function: assertNonZero()

> **assertNonZero**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:189](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L189)

Asserts that a value is not zero.

## Parameters

### value

`number`

Numeric value to validate.

### name?

`string`

Parameter name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and value is exactly zero.

## Remarks

Uses strict equality (`=== 0`). For near-zero checks, use `isNearZero`.
No-op when assertions are disabled.

## Example

```typescript
function divideScalar(v: Vector2, s: number): Vector2 {
 assertNonZero(s, 'scalar');
 return v.divideScalar(s);
}
```

## Since

0.7.0
