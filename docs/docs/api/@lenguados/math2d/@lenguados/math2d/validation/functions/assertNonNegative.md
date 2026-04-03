# Function: assertNonNegative()

> **assertNonNegative**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:309](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L309)

Asserts that a value is non-negative (≥ 0).

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

Zero is considered valid. Use `assertPositive` for strictly > 0.
No-op when assertions are disabled.

## Throws

If assertions enabled and value is < 0 or NaN

## Example

```typescript
function setMass(m: number): void {
 assertNonNegative(m, 'mass');
 this.mass = m;
}
```

## Since

0.7.0
