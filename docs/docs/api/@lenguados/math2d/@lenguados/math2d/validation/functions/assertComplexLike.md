# Function: assertComplexLike()

> **assertComplexLike**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:650](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L650)

Asserts that an object has valid Complex-like shape with finite components.

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

If assertions enabled and object is not Complex-like or has invalid components.

## Remarks

Validates that object has `real` and `imag` numeric properties that are finite.
No-op when assertions are disabled.

## Since

0.7.0
