# Function: assertMatrix2Like()

> **assertMatrix2Like**(`value`, `name?`): `asserts value is Matrix2Like`

Defined in: [src/validation/assert.ts:870](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L870)

Asserts that an object has valid Matrix2-like shape with finite elements.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`asserts value is Matrix2Like`

## Remarks

Validates that object has `m00`, `m01`, `m10`, `m11` numeric properties that are finite.
No-op when assertions are disabled. In production builds, this function
is eliminated via DCE. For runtime shape validation, use `isMatrix2Like()`.

## Throws

If assertions enabled and object is not Matrix2-like or has invalid elements

## Example

```typescript
function processMatrix(m: unknown): Matrix2 {
 assertMatrix2Like(m, 'input');
 return new Matrix2(m.m00, m.m01, m.m10, m.m11);
}
```

## Since

0.7.0
