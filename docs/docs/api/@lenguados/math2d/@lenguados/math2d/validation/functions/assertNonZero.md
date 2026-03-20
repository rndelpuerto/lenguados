# Function: assertNonZero()

> **assertNonZero**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:201](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L201)

Asserts that a value is not zero.

## Parameters

### value

`number`

Numeric value to validate

### name?

`string`

Parameter name for error messages (optional)

## Returns

`void`

## Remarks

Uses strict equality (`=== 0`). For near-zero checks, use `isNearZero`.
No-op when assertions are disabled.

## Throws

If assertions enabled and value is exactly zero

## Example

```typescript
function divideScalar(v: Vector2, s: number): Vector2 {
 assertNonZero(s, 'scalar');
 return v.divideScalar(s);
}
```

## Since

0.7.0
