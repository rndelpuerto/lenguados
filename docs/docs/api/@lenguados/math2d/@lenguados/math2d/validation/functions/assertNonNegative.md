# Function: assertNonNegative()

> **assertNonNegative**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:188](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L188)

Asserts that a value is non-negative (>= 0).

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

If assertions enabled and value < 0

## Example

```typescript
function setMass(m: number): void {
  assertNonNegative(m, 'mass');
  this.mass = m;
}
```
