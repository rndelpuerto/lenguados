# Function: isComplexLike()

> **isComplexLike**(`value`): `value is ReadonlyComplexLike`

Defined in: [src/types/index.ts:368](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/types/index.ts#L368)

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
