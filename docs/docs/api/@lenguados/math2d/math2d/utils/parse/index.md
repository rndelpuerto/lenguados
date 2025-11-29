# math2d/utils/parse

## File

src/utils/parse.ts

## Description

Parsing and serialization utilities for mathematical types.

Provides consistent string parsing for all math types, supporting
various formats commonly used in configuration files and data interchange.

Design principles:

- Flexible input format acceptance
- Consistent error handling
- Support for both creation and in-place parsing (out parameter)

## Remarks

All trigonometric operations use [DeterministicMath](../../../@lenguados/math2d/deterministic/classes/DeterministicMath.md) for
cross-platform reproducibility.

## Functions

- [formatMat2](functions/formatMat2.md)
- [formatMat3](functions/formatMat3.md)
- [formatRot2](functions/formatRot2.md)
- [formatTransform2](functions/formatTransform2.md)
- [formatVector2](functions/formatVector2.md)
- [parseMat2](functions/parseMat2.md)
- [parseMat3](functions/parseMat3.md)
- [parseRot2](functions/parseRot2.md)
- [parseTransform2](functions/parseTransform2.md)
- [parseVector2](functions/parseVector2.md)
