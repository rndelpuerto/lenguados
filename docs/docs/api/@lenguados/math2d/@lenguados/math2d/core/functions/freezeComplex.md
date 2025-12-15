# Function: freezeComplex()

> **freezeComplex**(`complex`): [`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Defined in: [src/core/complex.ts:85](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L85)

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

0.9.0
