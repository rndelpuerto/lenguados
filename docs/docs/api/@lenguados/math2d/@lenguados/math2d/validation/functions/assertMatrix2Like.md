# Function: assertMatrix2Like()

> **assertMatrix2Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:619](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L619)

Asserts that an object has valid Matrix2-like shape with finite elements.

## Parameters

### value

`unknown`

Object to validate.

### name?

`string`

Object name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and object is not Matrix2-like or has invalid elements.

## Remarks

Validates that object has `m00`, `m01`, `m10`, `m11` numeric properties that are finite.
No-op when assertions are disabled.

## Since

0.7.0
