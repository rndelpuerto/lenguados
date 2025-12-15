# @lenguados/math2d/utils

## File

src/utils/random-source.ts

## Description

Random number source abstractions for deterministic sampling.

## Remarks

This allows the math2d library to support:

- Default Math.random() for typical use
- Seeded random for deterministic simulations
- Custom random sources for testing or specialized needs

**Note on Math.floor usage**: This module uses `Math.floor` directly for
integer conversion because it's IEEE 754 deterministic and the random
sources handle their own determinism guarantees.

## Types

- [RandomSource](interfaces/RandomSource.md)

## Utility

- [MathRandomSource](classes/MathRandomSource.md)
- [SeededRandomSource](classes/SeededRandomSource.md)
- [defaultRandomSource](variables/defaultRandomSource.md)
- [getDefaultRandomSource](functions/getDefaultRandomSource.md)
- [setDefaultRandomSource](functions/setDefaultRandomSource.md)
