# Function: assertNonZero()

> **assertNonZero**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:120](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L120)

Asserts that a value is not zero.

## Parameters

### value

`number`

Value to check

### name?

`string`

Parameter name for error messages

## Returns

`void`

## Throws

If assertions enabled and value is zero

## Example

```typescript
function divideScalar(v: Vector2, s: number): Vector2 {
  assertNonZero(s, 'scalar');
  return v.divideScalar(s);
}
```
