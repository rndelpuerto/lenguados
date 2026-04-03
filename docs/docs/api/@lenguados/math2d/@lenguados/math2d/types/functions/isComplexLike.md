# Function: isComplexLike()

> **isComplexLike**(`value`): `value is ReadonlyComplexLike`

Defined in: [src/types/index.ts:368](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/types/index.ts#L368)

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
