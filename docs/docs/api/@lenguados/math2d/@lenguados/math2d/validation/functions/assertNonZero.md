# Function: assertNonZero()

> **assertNonZero**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:210](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L210)

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

If assertions enabled and value is zero or NaN

## Example

```typescript
function divideScalar(v: Vector2, s: number): Vector2 {
 assertNonZero(s, 'scalar');
 return v.divideScalar(s);
}
```

## Since

0.7.0
