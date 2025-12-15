# Function: assertComplexLike()

> **assertComplexLike**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:604](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L604)

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

0.14.0
