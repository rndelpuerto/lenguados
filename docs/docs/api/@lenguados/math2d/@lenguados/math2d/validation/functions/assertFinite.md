# Function: assertFinite()

> **assertFinite**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:158](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L158)

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

0.7.0
