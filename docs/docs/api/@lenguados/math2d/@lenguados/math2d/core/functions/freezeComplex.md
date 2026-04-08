# Function: freezeComplex()

> **freezeComplex**(`complex`): [`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Defined in: [src/core/complex.ts:117](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L117)

Permanently freezes a [Complex](../classes/Complex.md) instance so it can no longer be mutated.

## Parameters

### complex

[`Complex`](../classes/Complex.md)

The Complex object to freeze

## Returns

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

The same instance, now typed as ReadonlyComplex

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
