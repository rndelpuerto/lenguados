# Function: assertFinite()

> **assertFinite**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:138](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L138)

Asserts that a value is finite (not NaN, not Infinity).

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

If assertions enabled and value is not finite.

## Remarks

No-op when assertions are disabled. Zero runtime cost in production.

## Example

```typescript
function computeVelocity(dx: number, dt: number): number {
 assertFinite(dx, 'dx');
 assertFinite(dt, 'dt');
 return dx / dt;
}
```

## Since

0.1.0
