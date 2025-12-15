# Function: assertNonNegative()

> **assertNonNegative**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:256](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L256)

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

0.1.0
