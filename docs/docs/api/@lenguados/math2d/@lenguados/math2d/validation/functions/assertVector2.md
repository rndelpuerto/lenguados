# Function: assertVector2()

> **assertVector2**(`x`, `y`, `name?`): `void`

Defined in: [src/validation/assert.ts:351](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/validation/assert.ts#L351)

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

0.1.0
