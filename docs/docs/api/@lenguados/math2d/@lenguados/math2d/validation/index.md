# @lenguados/math2d/validation

## File

src/validation/assert.ts

## Description

Debug assertions for development-time validation.

## Remarks

**Pattern**: Inspired by Box2D/Bullet Physics assertions.

This module provides debug-only validation that can be completely
disabled in production for zero overhead. The pattern follows
industry standards from physics engines like Box2D, Bullet, and Planck.js.

**Two-Layer Protection System**:

1. **Assertions** (this module): Catch errors early in development
2. **Safe functions** (`auxiliary/numeric/safety.ts`): Always active fallbacks

**Categories in this module**:

- **Configuration**: Enable/disable assertion system
- **Scalar Assertion**: Validate numeric values (finite, range, sign)
- **Generic Assertion**: Base assertion for any condition
- **Type Assertion**: Validate math types (Vector2, Matrix2, Matrix3, Rotation2)

## Example

```typescript
import { setAssertionsEnabled, assertFinite } from '@lenguados/math2d';

// Development (default): assertions enabled
assertFinite(value, 'myParam'); // Throws if NaN/Infinity

// Production: disable for zero overhead
setAssertionsEnabled(false);
assertFinite(value, 'myParam'); // No-op, zero cost
```

## See

- safeDivide - Always-active safe division
- safeSqrt - Always-active safe square root

## Configuration

- [areAssertionsEnabled](functions/areAssertionsEnabled.md)
- [setAssertionsEnabled](functions/setAssertionsEnabled.md)

## Generic Assertion

- [assert](functions/assert.md)

## Object Assertion

- [assertComplexLike](functions/assertComplexLike.md)
- [assertIntervalLike](functions/assertIntervalLike.md)
- [assertMatrix2Like](functions/assertMatrix2Like.md)
- [assertTransform2Like](functions/assertTransform2Like.md)
- [assertVector2Like](functions/assertVector2Like.md)

## Scalar Assertion

- [assertFinite](functions/assertFinite.md)
- [assertNonNegative](functions/assertNonNegative.md)
- [assertNonZero](functions/assertNonZero.md)
- [assertPositive](functions/assertPositive.md)
- [assertRange](functions/assertRange.md)
- [assertSafeInteger](functions/assertSafeInteger.md)

## Type Assertion

- [assertMatrix2](functions/assertMatrix2.md)
- [assertMatrix3](functions/assertMatrix3.md)
- [assertRotation2](functions/assertRotation2.md)
- [assertVector2](functions/assertVector2.md)
