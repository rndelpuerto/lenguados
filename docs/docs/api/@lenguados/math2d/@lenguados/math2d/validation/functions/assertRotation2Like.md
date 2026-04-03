# Function: assertRotation2Like()

> **assertRotation2Like**(`value`, `name?`): `asserts value is Rotation2Like`

Defined in: [src/validation/assert.ts:834](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L834)

Asserts that an object has valid Rotation2-like shape with finite elements.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`asserts value is Rotation2Like`

## Remarks

Validates that object has `cos` and `sin` numeric properties that are finite.
No-op when assertions are disabled. In production builds, this function
is eliminated via DCE. For runtime shape validation, use `isRotation2Like()`.

## Throws

If assertions enabled and object is not Rotation2-like or has invalid elements

## Example

```typescript
function processRotation(r: unknown): Rotation2 {
 assertRotation2Like(r, 'input');
 return new Rotation2(r.cos, r.sin);
}
```

## Since

0.8.0
