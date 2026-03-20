# Function: assertMatrix3Like()

> **assertMatrix3Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:848](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L848)

Asserts that an object has valid Matrix3-like shape with finite elements.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`void`

## Remarks

Validates that object has `m00`..`m22` numeric properties that are finite.
No-op when assertions are disabled.

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
