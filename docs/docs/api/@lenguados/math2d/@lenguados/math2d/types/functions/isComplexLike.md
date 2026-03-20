# Function: isComplexLike()

> **isComplexLike**(`value`): `value is ReadonlyComplexLike`

Defined in: [src/types/index.ts:368](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/types/index.ts#L368)

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
