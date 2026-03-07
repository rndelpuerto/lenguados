# Function: assertRotation2()

> **assertRotation2**(`cos`, `sin`, `name?`): `void`

Defined in: [src/validation/assert.ts:549](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L549)

Asserts that Rotation2-like components are finite.

## Parameters

### cos

`number`

Cosine component to validate.

### sin

`number`

Sine component to validate.

### name?

`string`

Rotation name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and any component is not finite.

## Remarks

Validates both cos and sin are finite (not NaN, not Infinity).
Does NOT validate that cos² + sin² = 1 (unit constraint).
No-op when assertions are disabled.

## Example

```typescript
function createRotation(cos: number, sin: number): Rotation2 {
 assertRotation2(cos, sin, 'input');
 return new Rotation2(cos, sin);
}
```

## Since

0.7.0
