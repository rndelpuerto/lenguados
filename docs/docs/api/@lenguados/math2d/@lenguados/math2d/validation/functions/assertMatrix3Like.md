# Function: assertMatrix3Like()

> **assertMatrix3Like**(`value`, `name?`): `asserts value is Matrix3Like`

Defined in: [src/validation/assert.ts:908](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/validation/assert.ts#L908)

Asserts that an object has valid Matrix3-like shape with finite elements.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`asserts value is Matrix3Like`

## Remarks

Validates that object has `m00`..`m22` numeric properties that are finite.
No-op when assertions are disabled. In production builds, this function
is eliminated via DCE. For runtime shape validation, use `isMatrix3Like()`.

## Throws

If assertions enabled and object is not Matrix3-like or has invalid elements

## Example

```typescript
function processMatrix3(m: unknown): void {
 assertMatrix3Like(m, 'transform');
 // m is now validated as Matrix3Like with finite elements
}
```

## Since

0.8.0
