# Math2D Structure Migration Guide

## File Relocations

During the refactoring, the following files were moved to create a flatter, more maintainable structure:

### Core Module (Eliminated)
- `src/core/scalar.ts` → `src/scalar.ts`
- `src/core/numeric.ts` → `src/numeric.ts`
- `src/core/mat2.ts` → `src/mat2.ts`
- `src/core/mat3.ts` → `src/mat3.ts`
- `src/core/rot2.ts` → `src/rot2.ts`
- `src/core/transform2.ts` → `src/transform2.ts`
- `src/core/vector2/*` → `src/vector2/*`

### Geometry Module (Partially Flattened)
- `src/geometry/linalg.ts` → `src/linalg.ts`
- `src/geometry/metrics.ts` → `src/geometry/metrics.ts` (kept)
- `src/geometry/predicates.ts` → `src/geometry/predicates.ts` (kept)

### New Modules Added
- `src/constants/` - Mathematical and precision constants
  - `math.ts` - PI, TAU, DEG2RAD, etc.
  - `precision.ts` - EPSILON values
- `src/core-utils/` - Shared utilities
  - `tolerance.ts` - Comparison and validation functions

## Import Path Updates

### Old Import Pattern
```typescript
import { scalar } from '@lenguados/math2d/core';
import { linalg } from '@lenguados/math2d/geometry';
```

### New Import Pattern
```typescript
import { scalar } from '@lenguados/math2d';
import { linalg } from '@lenguados/math2d';
```

## IDE Cache Issues

If your IDE is showing errors about missing files:

1. **Clear IDE cache**:
   - VS Code/Cursor: Cmd+Shift+P → "Reload Window"
   - Or restart the IDE completely

2. **Update TypeScript language server**:
   - Cmd+Shift+P → "TypeScript: Restart TS Server"

3. **Verify you're in the correct workspace**:
   - Should be: `/Users/casa/.cursor/worktrees/lenguados/0Lsgp`
   - Not: Any path containing `/core/` or old structure

## Current Directory Structure

```
src/
├── constants/          # New: Organized constants
├── core-utils/         # New: Shared utilities  
├── geometry/           # Kept: Specialized geometry
├── typed-arrays/       # Kept: Array implementations
├── utils/             # Kept: General utilities
├── vector2/           # Moved: From core/vector2
├── angle.ts           # Kept in root
├── batch.ts           # Kept in root
├── linalg.ts          # Moved: From geometry/
├── mat2.ts            # Moved: From core/
├── mat3.ts            # Moved: From core/
├── numeric.ts         # Moved: From core/
├── rot2.ts            # Moved: From core/
├── scalar.ts          # Moved: From core/
├── transform2.ts      # Moved: From core/
└── vector2.ts         # Re-export point
```
