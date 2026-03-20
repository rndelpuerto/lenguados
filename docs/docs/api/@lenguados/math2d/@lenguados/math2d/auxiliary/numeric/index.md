# @lenguados/math2d/auxiliary/numeric

## File

auxiliary/numeric/guards.ts

## Description

Numeric type guards (boolean predicates)

## Remarks

This module provides boolean predicates for testing numeric values
that are NOT available in the standard library.
For safe operations that return numbers, see ./safety.

For basic guards like `isFinite`, `isNaN`, `isSafeInteger`, use
`Number.isFinite()`, `Number.isNaN()`, `Number.isSafeInteger()` directly.

## Guards

- [isDenormal](functions/isDenormal.md)
- [isInfinity](functions/isInfinity.md)
- [isInRange](functions/isInRange.md)
- [isNegativeInfinity](functions/isNegativeInfinity.md)
- [isPositiveInfinity](functions/isPositiveInfinity.md)
