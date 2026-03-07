# Function: assertIntervalLike()

> **assertIntervalLike**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:682](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L682)

Asserts that an object has valid Interval-like shape with finite bounds.

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

If assertions enabled and object is not Interval-like or has invalid bounds.

## Remarks

Validates that object has `min` and `max` numeric properties that are finite.
Also validates that min ≤ max.
No-op when assertions are disabled.

## Since

0.7.0
