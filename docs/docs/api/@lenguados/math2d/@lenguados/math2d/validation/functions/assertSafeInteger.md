# Function: assertSafeInteger()

> **assertSafeInteger**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:397](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L397)

Asserts that an integer is within safe JavaScript integer range.

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

If value is not a safe integer

## Remarks

Safe integers are integers that can be exactly represented as
IEEE-754 double precision numbers. Range: -(2^53 - 1) to 2^53 - 1.

## Example

```typescript
function setIndex(i: number): void {
  assertSafeInteger(i, 'index');
  this.index = i;
}
```
