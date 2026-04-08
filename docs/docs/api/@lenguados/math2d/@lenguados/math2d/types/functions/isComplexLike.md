# Function: isComplexLike()

> **isComplexLike**(`value`): `value is ReadonlyComplexLike`

Defined in: [src/types/index.ts:368](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/types/index.ts#L368)

Type guard to check if value has complex number properties (ComplexLike).

## Parameters

### value

`unknown`

Value to check

## Returns

`value is ReadonlyComplexLike`

True if value conforms to ReadonlyComplexLike

## Example

```typescript
const c = { real: 1, imag: 2 };
if (isComplexLike(c)) {
 console.log(c.real, c.imag); // TypeScript knows real, imag are numbers
}
```

## Since

0.7.0
