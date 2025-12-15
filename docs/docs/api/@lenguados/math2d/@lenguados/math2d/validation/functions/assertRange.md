# Function: assertRange()

> **assertRange**(`value`, `min`, `max`, `name?`): `void`

Defined in: [src/validation/assert.ts:144](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L144)

Asserts that a value is within a range (inclusive).

## Parameters

### value

`number`

Value to check

### min

`number`

Minimum inclusive value

### max

`number`

Maximum inclusive value

### name?

`string`

Parameter name for error messages

## Returns

`void`

## Throws

If assertions enabled and value is out of range

## Example

```typescript
function lerp(a: number, b: number, t: number): number {
  assertRange(t, 0, 1, 't');
  return a + (b - a) * t;
}
```
