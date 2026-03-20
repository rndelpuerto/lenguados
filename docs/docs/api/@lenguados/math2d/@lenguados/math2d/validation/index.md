# @lenguados/math2d/validation

## File

validation/assert.ts

## Description

Debug assertions for development-time validation

## Remarks

**Pattern**: Inspired by Box2D/Bullet Physics assertions with compile-time DCE.

This module provides debug-only validation that is **completely eliminated**
in production builds via Dead Code Elimination (DCE). The `process.env.NODE_ENV`
ecosystem standard is used to safely trigger minifier pruning (e.g., in Vite, Webpack, Rollup).

**Zero-Overhead Production**:

- Development: `process.env.NODE_ENV !== 'production'` → assertions active
- Production: `process.env.NODE_ENV === 'production'` → all assertion code eliminated

**Two-Layer Protection System**:

1. **Assertions** (this module): Catch errors early in development (eliminated in prod)
2. **Safe functions** (`auxiliary/numeric/safety.ts`): Always active fallbacks

**Categories in this module**:

- **Configuration**: Enable/disable assertion system at runtime (dev only)
- **Scalar Assertion**: Validate numeric values (finite, range, sign)
- **Generic Assertion**: Base assertion for any condition
- **Type Assertion**: Validate math types (Vector2, Matrix2, Matrix3, Rotation2)

## Example

```typescript
import { assertFinite } from '@lenguados/math2d';

// Development: assertions throw on invalid input
assertFinite(value, 'myParam'); // Throws if NaN/Infinity

// Production: assertion calls are eliminated by DCE
// The above line becomes a no-op with ZERO runtime cost
```

## See

- divideSafe - Always-active safe division
- sqrtSafe - Always-active safe square root

## Assertion

- [assert](functions/assert.md)
- [assertComplex](functions/assertComplex.md)
- [assertComplexLike](functions/assertComplexLike.md)
- [assertFinite](functions/assertFinite.md)
- [assertInterval](functions/assertInterval.md)
- [assertIntervalLike](functions/assertIntervalLike.md)
- [assertMatrix2](functions/assertMatrix2.md)
- [assertMatrix2Like](functions/assertMatrix2Like.md)
- [assertMatrix3](functions/assertMatrix3.md)
- [assertMatrix3Like](functions/assertMatrix3Like.md)
- [assertNonNegative](functions/assertNonNegative.md)
- [assertNonZero](functions/assertNonZero.md)
- [assertPositive](functions/assertPositive.md)
- [assertRange](functions/assertRange.md)
- [assertRotation2](functions/assertRotation2.md)
- [assertRotation2Like](functions/assertRotation2Like.md)
- [assertSafeInteger](functions/assertSafeInteger.md)
- [assertTransform2](functions/assertTransform2.md)
- [assertTransform2Like](functions/assertTransform2Like.md)
- [assertVector2](functions/assertVector2.md)
- [assertVector2Like](functions/assertVector2Like.md)

## Configuration

- [areAssertionsEnabled](functions/areAssertionsEnabled.md)
- [setAssertionsEnabled](functions/setAssertionsEnabled.md)
