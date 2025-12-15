# Function: assertVector2()

> **assertVector2**(`x`, `y`, `name?`): `void`

Defined in: [src/validation/assert.ts:231](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L231)

Asserts that Vector2-like components are finite.

## Parameters

### x

`number`

X component

### y

`number`

Y component

### name?

`string`

Vector name for error messages

## Returns

`void`

## Throws

If assertions enabled and any component is not finite

## Example

```typescript
function createVector(x: number, y: number): Vector2 {
  assertVector2(x, y, 'input');
  return new Vector2(x, y);
}
```
