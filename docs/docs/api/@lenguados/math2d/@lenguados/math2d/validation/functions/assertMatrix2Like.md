# Function: assertMatrix2Like()

> **assertMatrix2Like**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:811](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L811)

Asserts that an object has valid Matrix2-like shape with finite elements.

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

Validates that object has `m00`, `m01`, `m10`, `m11` numeric properties that are finite.
No-op when assertions are disabled.

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
