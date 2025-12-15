# Function: assertNonZero()

> **assertNonZero**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:167](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L167)

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

0.1.0
