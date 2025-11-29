# math2d/utils/random-source

## File

src/utils/random-source.ts

## Description

Random number source abstraction for deterministic and non-deterministic random generation.

This allows the math2d library to support:

- Default Math.random() for typical use
- Seeded random for deterministic simulations
- Custom random sources for testing or specialized needs

## Classes

- [MathRandomSource](classes/MathRandomSource.md)
- [SeededRandomSource](classes/SeededRandomSource.md)

## Interfaces

- [RandomSource](interfaces/RandomSource.md)

## Variables

- [defaultRandomSource](variables/defaultRandomSource.md)

## Functions

- [getDefaultRandomSource](functions/getDefaultRandomSource.md)
- [setDefaultRandomSource](functions/setDefaultRandomSource.md)
