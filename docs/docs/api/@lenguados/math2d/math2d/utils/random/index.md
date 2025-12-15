# math2d/utils/random

## File

src/utils/random.ts

## Description

Deterministic random generation utilities for 2D mathematical objects.

Implementation based on:
- Uniform sampling techniques from "Graphics Gems" series
- "Numerical Recipes" for distribution methods
- Game Programming Gems for practical random generation

All functions ensure proper distributions:
- Points in/on circles use polar coordinates with sqrt(r) for uniform area distribution
- Rotations use uniform angle distribution

## Remarks

**Determinism Guarantee**: All mathematical operations use [DeterministicMath](../../../@lenguados/math2d/deterministic/classes/DeterministicMath.md)
for cross-platform reproducibility. When using a SeededRandomSource,
results are guaranteed to be identical across different JavaScript engines.

Functions use:
- `DeterministicMath.sin/cos` for trigonometry
- `DeterministicMath.sqrtSafe` for square roots
- IEEE 754 compliant `Math.log` (deterministic by specification)

## Example

```typescript
// Reproducible random generation
const source = new SeededRandomSource(12345);
const v1 = randomUnitVector2(new Vector2(), source);

// Same seed = same result
const source2 = new SeededRandomSource(12345);
const v2 = randomUnitVector2(new Vector2(), source2);
// v1.exactEquals(v2) === true
```

## Functions

- [randomGaussianVector2](functions/randomGaussianVector2.md)
- [randomInBox](functions/randomInBox.md)
- [randomInCircle](functions/randomInCircle.md)
- [randomInRectangle](functions/randomInRectangle.md)
- [randomInTriangle](functions/randomInTriangle.md)
- [randomInUnitCircle](functions/randomInUnitCircle.md)
- [randomOnCircle](functions/randomOnCircle.md)
- [randomOnRectangle](functions/randomOnRectangle.md)
- [randomOnSegment](functions/randomOnSegment.md)
- [randomOnTriangle](functions/randomOnTriangle.md)
- [randomRotation2](functions/randomRotation2.md)
- [randomRotationMatrix2](functions/randomRotationMatrix2.md)
- [randomTransform2](functions/randomTransform2.md)
- [randomUnitVector2](functions/randomUnitVector2.md)
- [randomVector2](functions/randomVector2.md)
