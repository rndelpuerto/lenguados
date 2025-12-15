# @lenguados/math2d/auxiliary/numeric

## File

auxiliary/numeric/guards.ts

## Description

Numeric type guards (boolean predicates)

## Remarks

This module provides boolean predicates for testing numeric values.
For safe operations that return numbers, see ./safety.

**API Design Note:**
Some functions like `isFinite` and `isNaN` are thin wrappers around
`Number.*` methods. They are included for:
- API consistency (all numeric guards in one place)
- Tree-shaking (import only what you need)
- Documentation (clear examples and edge case behavior)

Functions like `isDenormal`, `isInfinity`, and `isInRange` provide
additional value not available in the standard library.

## Guards

- [isDenormal](functions/isDenormal.md)
- [isFinite](functions/isFinite.md)
- [isInfinity](functions/isInfinity.md)
- [isInRange](functions/isInRange.md)
- [isNaN](functions/isNaN.md)
- [isNegativeInfinity](functions/isNegativeInfinity.md)
- [isPositiveInfinity](functions/isPositiveInfinity.md)
- [isSafeInteger](functions/isSafeInteger.md)
