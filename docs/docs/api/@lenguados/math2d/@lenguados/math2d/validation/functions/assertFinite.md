# Function: assertFinite()

> **assertFinite**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:168](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L168)

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
