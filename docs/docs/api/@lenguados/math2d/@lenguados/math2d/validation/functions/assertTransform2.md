# Function: assertTransform2()

> **assertTransform2**(`px`, `py`, `cos`, `sin`, `sx`, `sy`, `name?`): `void`

Defined in: [src/validation/assert.ts:738](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L738)

Asserts that Transform2 components are finite.

## Parameters

### px

`number`

Position X to validate

### py

`number`

Position Y to validate

### cos

`number`

Rotation cosine to validate

### sin

`number`

Rotation sine to validate

### sx

`number`

Scale X to validate

### sy

`number`

Scale Y to validate

### name?

`string`

Transform name for error messages (optional)

## Returns

`void`

## Remarks

Validates all 6 components are finite (not NaN, not Infinity).
No-op when assertions are disabled.

## Throws

If assertions enabled and any component is not finite

## Example

```typescript
function createTransform(px: number, py: number, cos: number, sin: number): Transform2 {
 assertTransform2(px, py, cos, sin, 1, 1, 'input');
 return new Transform2(px, py, cos, sin, 1, 1);
}
```

## Since

0.8.0
