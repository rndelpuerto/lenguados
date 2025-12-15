# Function: assertMatrix2Like()

> **assertMatrix2Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:575](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L575)

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

0.14.0
