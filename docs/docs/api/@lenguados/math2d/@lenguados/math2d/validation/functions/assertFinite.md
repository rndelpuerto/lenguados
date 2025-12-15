# Function: assertFinite()

> **assertFinite**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:98](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L98)

Asserts that a value is finite (not NaN, not Infinity).

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

If assertions enabled and value is not finite

## Example

```typescript
function computeVelocity(dx: number, dt: number): number {
  assertFinite(dx, 'dx');
  assertFinite(dt, 'dt');
  return dx / dt;
}
```
