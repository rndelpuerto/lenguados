# Function: assertFinite()

> **assertFinite**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:177](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L177)

Asserts that a value is finite (not NaN, not Infinity).

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

No-op when assertions are disabled. Zero runtime cost in production.

## Throws

If assertions enabled and value is not finite

## Example

```typescript
function computeVelocity(dx: number, dt: number): number {
 assertFinite(dx, 'dx');
 assertFinite(dt, 'dt');
 return dx / dt;
}
```

## Since

0.7.0
