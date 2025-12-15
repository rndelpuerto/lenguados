# @lenguados/math2d/core

## File

core/complex.ts

## Description

Deterministic complex number implementation for advanced mathematics.

## Remarks

## Complex vs Rotation2: When to Use Each

| Use Case | Recommended | Reason |
|----------|-------------|--------|
| Rotate rigid bodies | Rotation2 | Optimized, always unit magnitude |
| Rotate sprites/vectors | Rotation2 | Simple and efficient |
| Fourier analysis | **Complex** | Requires variable magnitude |
| Polynomial roots | **Complex** | Needs full complex algebra |
| Signal processing | **Complex** | Requires exp, log, powers |
| Conformal mappings | **Complex** | General complex operations |

## Mathematical Relationship

A Rotation2 is a **unit complex number** (|z| = 1):
- `Rotation2(cos, sin)` ≡ `Complex(cos, sin)` where `cos² + sin² = 1`
- Rotation composition = Complex multiplication
- Rotation inverse = Complex conjugate (for unit complex)

## Conversion

```typescript
// Complex → Rotation2
const c = Complex.fromPolar(1, Math.PI / 4);
const r = Rotation2.fromComplex(c);

// Rotation2 → Complex
const r2 = Rotation2.fromAngle(Math.PI / 4);
const c2 = r2.toComplex();
```

## See

Rotation2 for 2D rotations in physics simulations

## Helpers

- [freezeComplex](functions/freezeComplex.md)

## Other

- [Complex](classes/Complex.md)
- [ReadonlyComplex](type-aliases/ReadonlyComplex.md)
