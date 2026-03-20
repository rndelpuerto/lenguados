# Function: assertComplexLike()

> **assertComplexLike**(`value`, `name?`): `void`

Defined in: [src/validation/assert.ts:885](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L885)

Asserts that an object has valid Complex-like shape with finite components.

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

Validates that object has `real` and `imag` numeric properties that are finite.
No-op when assertions are disabled.

## Throws

If assertions enabled and object is not Complex-like or has invalid components

## Example

```typescript
function processComplex(c: unknown): Complex {
 assertComplexLike(c, 'input');
 return new Complex(c.real, c.imag);
}
```

## Since

0.7.0
