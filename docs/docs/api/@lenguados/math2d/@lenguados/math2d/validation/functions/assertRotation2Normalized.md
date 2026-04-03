# Function: assertRotation2Normalized()

> **assertRotation2Normalized**(`cos`, `sin`, `tolerance`, `name?`): `void`

Defined in: [src/validation/assert.ts:614](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L614)

Asserts that Rotation2-like components are finite AND form a unit rotation.

## Parameters

### cos

`number`

Cosine component to validate

### sin

`number`

Sine component to validate

### tolerance

`number` = `1e-10`

Maximum deviation of cos²+sin² from 1 (default: 1e-10)

### name?

`string`

Rotation name for error messages (optional)

## Returns

`void`

## Remarks

Validates that cos and sin are finite AND that cos² + sin² ≈ 1 within
the given tolerance. Use this for stricter validation than [assertRotation2](assertRotation2.md)
when the unit constraint must be enforced.
No-op when assertions are disabled.

## Throws

If assertions enabled and components are not finite or not unit

## Example

```typescript
assertRotation2Normalized(1, 0); // passes (unit rotation)
assertRotation2Normalized(0.6, 0.8); // passes (cos²+sin² = 1)
assertRotation2Normalized(2, 0); // throws (cos²+sin² = 4)
```

## Since

0.8.0
