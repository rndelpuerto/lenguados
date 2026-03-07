# Function: freezeMatrix2()

> **freezeMatrix2**(`matrix`): [`ReadonlyMatrix2`](../type-aliases/ReadonlyMatrix2.md)

Defined in: [src/core/matrix2.ts:71](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/matrix2.ts#L71)

Permanently freezes a [Matrix2](../classes/Matrix2.md) instance so it can no longer be mutated.

## Parameters

### matrix

[`Matrix2`](../classes/Matrix2.md)

The Matrix2 object to freeze.

## Returns

[`ReadonlyMatrix2`](../type-aliases/ReadonlyMatrix2.md)

The same instance, now typed as ReadonlyMatrix2.

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify components throws a TypeError.

## Example

```typescript
const IDENTITY = freezeMatrix2(new Matrix2(1, 0, 0, 1));
IDENTITY.m00 = 5; // Throws in strict mode
```

## Since

0.7.0
