# Function: assertSafeInteger()

> **assertSafeInteger**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:316](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L316)

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

0.7.0
