# Function: assertSafeInteger()

> **assertSafeInteger**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:334](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L334)

Asserts that a value is a safe JavaScript integer.

## Parameters

### value

`number`

Numeric value to validate

### name?

`string`

Parameter name for error messages (optional)

## Returns

`void`

## Remarks

Safe integers are integers that can be exactly represented as
IEEE-754 double precision numbers. Range: -(2⁵³ - 1) to 2⁵³ - 1.
No-op when assertions are disabled.

## Throws

If value is not a safe integer

## Example

```typescript
function setIndex(i: number): void {
 assertSafeInteger(i, 'index');
 this.index = i;
}
```

## Since

0.7.0
