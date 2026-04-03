# Function: assertFinite()

> **assertFinite**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:177](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L177)

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
