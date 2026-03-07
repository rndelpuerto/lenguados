# @lenguados/math2d/auxiliary/numeric

## File

auxiliary/numeric/safety.ts

## Description

Safe arithmetic operations that handle edge cases gracefully.

## Remarks

This module provides operations that return safe numeric values
instead of NaN/Infinity. For boolean predicates (type guards),
see ./guards.

**Determinism Guarantee**: Mathematical operations that could vary across
JavaScript engines are delegated to deterministic-kernels.

## Other

### safeAcos

Renames and re-exports [acosSafe](../../deterministic/functions/acosSafe.md)

---

### safeAsin

Renames and re-exports [asinSafe](../../deterministic/functions/asinSafe.md)

---

### safeSqrt

Renames and re-exports [sqrtSafe](../../deterministic/functions/sqrtSafe.md)

## Safety

- [MIN_SAFE_DIVISOR](variables/MIN_SAFE_DIVISOR.md)
- [compensatedProduct](functions/compensatedProduct.md)
- [ensureFinite](functions/ensureFinite.md)
- [neumaierSum](functions/neumaierSum.md)
- [robustSum](functions/robustSum.md)
- [safeDivide](functions/safeDivide.md)
- [safeLerp](functions/safeLerp.md)
- [safeLog](functions/safeLog.md)
- [safePow](functions/safePow.md)
- [safeReciprocal](functions/safeReciprocal.md)
- [sanitizeNumber](functions/sanitizeNumber.md)
