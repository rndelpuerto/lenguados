# Function: assertNonNegative()

> **assertNonNegative**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:284](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L284)

Asserts that a value is non-negative (≥ 0).

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

If assertions enabled and value < 0.

## Remarks

Zero is considered valid. Use `assertPositive` for strictly > 0.
No-op when assertions are disabled.

## Example

```typescript
function setMass(m: number): void {
 assertNonNegative(m, 'mass');
 this.mass = m;
}
```

## Since

0.7.0
