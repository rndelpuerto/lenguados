# @lenguados/math2d/validation

## File

src/validation/assert.ts

## Description

Debug assertions for development.

## Remarks

**Pattern**: Inspired by Box2D/Bullet Physics assertions.

This module provides debug-only validation that can be completely
disabled in production for zero overhead. The pattern follows
industry standards from physics engines like Box2D, Bullet, and Planck.js.

**Two-Layer Protection System**:
1. **Assertions** (this module): Catch errors early in development
2. **Safe functions** (`auxiliary/numeric/safety.ts`): Always active fallbacks

## Example

```typescript
import { setAssertionsEnabled, assertFinite } from '@lenguados/math2d';

// Development (default): assertions enabled
assertFinite(value, 'myParam');  // Throws if NaN/Infinity

// Production: disable for zero overhead
setAssertionsEnabled(false);
assertFinite(value, 'myParam');  // No-op, zero cost
```

## Functions

- [areAssertionsEnabled](functions/areAssertionsEnabled.md)
- [assert](functions/assert.md)
- [assertFinite](functions/assertFinite.md)
- [assertMatrix2](functions/assertMatrix2.md)
- [assertMatrix3](functions/assertMatrix3.md)
- [assertNonNegative](functions/assertNonNegative.md)
- [assertNonZero](functions/assertNonZero.md)
- [assertPositive](functions/assertPositive.md)
- [assertRange](functions/assertRange.md)
- [assertRotation2](functions/assertRotation2.md)
- [assertSafeInteger](functions/assertSafeInteger.md)
- [assertVector2](functions/assertVector2.md)
- [setAssertionsEnabled](functions/setAssertionsEnabled.md)
