# Function: assertTransform2Like()

> **assertTransform2Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:718](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L718)

Asserts that an object has valid Transform2-like shape.

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

If assertions enabled and object is not Transform2-like.

## Remarks

Validates that object has `position` (Vector2-like), `rotation` (number), and `scale` (Vector2-like).
No-op when assertions are disabled.

## Since

0.7.0
