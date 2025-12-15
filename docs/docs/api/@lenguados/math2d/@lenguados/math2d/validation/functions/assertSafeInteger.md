# Function: assertSafeInteger()

> **assertSafeInteger**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:286](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L286)

Asserts that a value is a safe JavaScript integer.

## Parameters

### value

`number`

Numeric value to validate.

### name?

`string`

Parameter name for error messages (optional).

## Returns

`void`

## Throws

If value is not a safe integer.

## Remarks

Safe integers are integers that can be exactly represented as
IEEE-754 double precision numbers. Range: -(2⁵³ - 1) to 2⁵³ - 1.
No-op when assertions are disabled.

## Example

```typescript
function setIndex(i: number): void {
 assertSafeInteger(i, 'index');
 this.index = i;
}
```

## Since

0.1.0
