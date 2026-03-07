# Function: freezeComplex()

> **freezeComplex**(`complex`): [`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Defined in: [src/core/complex.ts:100](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L100)

Permanently freezes a [Complex](../classes/Complex.md) instance so it can no longer be mutated.

## Parameters

### complex

[`Complex`](../classes/Complex.md)

The Complex object to freeze.

## Returns

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

The same instance, now typed as ReadonlyComplex.

## Remarks

- The returned object keeps its original reference; no new memory is allocated.
- In strict mode any subsequent attempt to modify `real` or `imag` throws a TypeError.

## Example

```typescript
const UNIT = freezeComplex(new Complex(1, 0));
UNIT.real = 5; // Throws in strict mode
```

## Since

0.7.0
