# Function: assertVector2()

> **assertVector2**(`x`, `y`, `name?`): `void`

Defined in: [src/validation/assert.ts:385](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/validation/assert.ts#L385)

Asserts that Vector2-like components are finite.

## Parameters

### x

`number`

X component to validate.

### y

`number`

Y component to validate.

### name?

`string`

Vector name for error messages (optional).

## Returns

`void`

## Throws

If assertions enabled and any component is not finite.

## Remarks

Validates both components are finite (not NaN, not Infinity).
No-op when assertions are disabled.

## Example

```typescript
function createVector(x: number, y: number): Vector2 {
 assertVector2(x, y, 'input');
 return new Vector2(x, y);
}
```

## Since

0.7.0
