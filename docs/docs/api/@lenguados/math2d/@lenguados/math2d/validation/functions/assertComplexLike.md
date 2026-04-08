# Function: assertComplexLike()

> **assertComplexLike**(`value`, `name?`): `asserts value is ComplexLike`

Defined in: [src/validation/assert.ts:946](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/validation/assert.ts#L946)

Asserts that an object has valid Complex-like shape with finite components.

## Parameters

### value

`unknown`

Object to validate

### name?

`string`

Object name for error messages (optional)

## Returns

`asserts value is ComplexLike`

## Remarks

Validates that object has `real` and `imag` numeric properties that are finite.
No-op when assertions are disabled. In production builds, this function
is eliminated via DCE. For runtime shape validation, use `isComplexLike()`.

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
