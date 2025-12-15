# @lenguados/math2d/deterministic

## File

deterministic/precision-math.ts

## Description

High-precision arithmetic using compensation techniques.

## Remarks

This module intentionally uses inline validation to avoid circular
dependencies with the validation module. The validation layer
depends on auxiliary/numeric, which in turn uses PrecisionMath.

## Precision

- [PrecisionMath](classes/PrecisionMath.md)

## Types

- [CompensatedResult](interfaces/CompensatedResult.md)
- [TwoProductResult](interfaces/TwoProductResult.md)
- [TwoSumResult](interfaces/TwoSumResult.md)
