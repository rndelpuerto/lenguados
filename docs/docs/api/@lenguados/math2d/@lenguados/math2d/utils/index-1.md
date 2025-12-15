# @lenguados/math2d/utils

## File

src/utils/performance.ts

## Description

Lightweight utilities for profiling and measuring execution time.

## Remarks

This module provides development-time utilities for measuring performance.
It is not intended for production use.

## Migration

**Planned Migration**: This module will be moved to `@lenguados/devtools`
in version 2.0. Performance profiling is a development concern, not a
core mathematical operation.

**What will change in v2.0:**

- Import path: `@lenguados/devtools` instead of `@lenguados/math2d`
- Additional features: Flame graphs, memory tracking, comparison reports
- Integration with common profiling tools

**Migration path:**

```typescript
// Before (v1.x)
import { measure, MeasurementCollector } from '@lenguados/math2d';

// After (v2.0)
import { measure, MeasurementCollector } from '@lenguados/devtools';
```

## Types

- [Measurement](interfaces/Measurement.md)
- [MeasurementSummary](interfaces/MeasurementSummary.md)

## Utility

- [MeasurementCollector](classes/MeasurementCollector.md)
- [formatSummary](functions/formatSummary.md)
- [measure](functions/measure.md)
- [measureAsync](functions/measureAsync.md)
- [recordMeasurement](functions/recordMeasurement.md)
- [summarizeMeasurements](functions/summarizeMeasurements.md)
- [timestamp](functions/timestamp.md)
