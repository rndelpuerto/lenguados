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

## Migration

**Planned Migration**: This module will be moved to `@lenguados/math2d-io`
in version 2.0. The I/O concern (string parsing/serialization) is outside
the core mathematical scope of this library.

**What will change in v2.0:**
- Import path: `@lenguados/math2d-io` instead of `@lenguados/math2d`
- Additional formats: Binary serialization, CSV batch parsing
- Streaming support for large datasets

**Migration path:**
```typescript
// Before (v1.x)
import { parseVector2, formatVector2 } from '@lenguados/math2d';

// After (v2.0)
import { parseVector2, formatVector2 } from '@lenguados/math2d-io';
```

## Functions

- [formatMatrix2](functions/formatMatrix2.md)
- [formatMatrix3](functions/formatMatrix3.md)
- [formatRotation2](functions/formatRotation2.md)
- [formatTransform2](functions/formatTransform2.md)
- [formatVector2](functions/formatVector2.md)
- [parseMatrix2](functions/parseMatrix2.md)
- [parseMatrix3](functions/parseMatrix3.md)
- [parseRotation2](functions/parseRotation2.md)
- [parseTransform2](functions/parseTransform2.md)
- [parseVector2](functions/parseVector2.md)
