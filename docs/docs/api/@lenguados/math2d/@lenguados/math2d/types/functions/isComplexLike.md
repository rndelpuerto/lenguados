# Function: isComplexLike()

> **isComplexLike**(`value`): `value is ReadonlyComplexLike`

Defined in: [src/types/index.ts:386](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/types/index.ts#L386)

Type guard to check if value has complex number properties (ComplexLike).

## Parameters

### value

`unknown`

Value to check.

## Returns

`value is ReadonlyComplexLike`

True if value conforms to ReadonlyComplexLike.

## Example

```typescript
const c = { real: 1, imag: 2 };
if (isComplexLike(c)) {
 console.log(c.real, c.imag); // TypeScript knows real, imag are numbers
}
```

## Since

0.1.0
