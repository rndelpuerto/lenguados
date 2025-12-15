# Function: assertRotation2()

> **assertRotation2**(`cos`, `sin`, `name?`): `void`

Defined in: [src/validation/assert.ts:367](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/validation/assert.ts#L367)

Asserts that Rotation2-like components are finite.

## Parameters

### cos

`number`

Cosine component

### sin

`number`

Sine component

### name?

`string`

Rotation name for error messages

## Returns

`void`

## Throws

If assertions enabled and any component is not finite

## Example

```typescript
function createRotation(cos: number, sin: number): Rotation2 {
  assertRotation2(cos, sin, 'input');
  return new Rotation2(cos, sin);
}
```
