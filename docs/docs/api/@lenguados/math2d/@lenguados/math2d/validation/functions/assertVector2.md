# Function: assertVector2()

> **assertVector2**(`x`, `y`, `name?`): `void`

Defined in: [src/validation/assert.ts:403](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L403)

Asserts that Vector2-like components are finite.

## Parameters

### x

`number`

X component to validate

### y

`number`

Y component to validate

### name?

`string`

Vector name for error messages (optional)

## Returns

`void`

## Remarks

Validates both components are finite (not NaN, not Infinity).
No-op when assertions are disabled.

## Throws

If assertions enabled and any component is not finite

## Example

```typescript
function createVector(x: number, y: number): Vector2 {
 assertVector2(x, y, 'input');
 return new Vector2(x, y);
}
```

## Since

0.7.0
