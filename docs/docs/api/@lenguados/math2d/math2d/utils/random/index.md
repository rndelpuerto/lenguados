# math2d/utils/random

## File

src/utils/random.ts

## Description

Random generation utilities for 2D mathematical objects.

Implementation based on:

- Uniform sampling techniques from "Graphics Gems" series
- "Numerical Recipes" for distribution methods
- Game Programming Gems for practical random generation

All functions ensure proper distributions:

- Points in/on circles use polar coordinates with sqrt(r) for uniform area distribution
- Rotations use uniform angle distribution

## Remarks

All trigonometric functions use [DeterministicMath](../../../@lenguados/math2d/deterministic/classes/DeterministicMath.md) for cross-platform
reproducibility when using a SeededRandomSource.

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
