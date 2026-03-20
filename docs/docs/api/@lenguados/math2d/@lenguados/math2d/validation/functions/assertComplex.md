# Function: assertComplex()

> **assertComplex**(`real`, `imag`, `name?`): `void`

Defined in: [src/validation/assert.ts:603](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/validation/assert.ts#L603)

Asserts that Complex-like components are finite.

## Parameters

### real

`number`

Real component to validate

### imag

`number`

Imaginary component to validate

### name?

`string`

Complex name for error messages (optional)

## Returns

`void`

## Remarks

Validates both real and imag are finite (not NaN, not Infinity).
No-op when assertions are disabled.

## Throws

If assertions enabled and any component is not finite

## Example

```typescript
function createComplex(real: number, imag: number): Complex {
 assertComplex(real, imag, 'input');
 return new Complex(real, imag);
}
```

## Since

0.8.0
