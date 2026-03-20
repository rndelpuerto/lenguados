# Function: assertRotation2Like()

> **assertRotation2Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:776](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L776)

Asserts that an object has valid Rotation2-like shape with finite elements.

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

Validates that object has `cos` and `sin` numeric properties that are finite.
No-op when assertions are disabled.

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
