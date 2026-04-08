# @lenguados/math2d/auxiliary/numeric

## File

auxiliary/numeric/safety.ts

## Description

Safe arithmetic operations that handle edge cases gracefully

## Remarks

This module provides operations that return safe numeric values
instead of NaN/Infinity. For boolean predicates (type guards),
see ./guards.

**Determinism Guarantee**: Mathematical operations that could vary across
JavaScript engines are delegated to deterministic-kernels.

## Safety

- [MIN_SAFE_DIVISOR](variables/MIN_SAFE_DIVISOR.md)
- [acosSafe](functions/acosSafe.md)
- [asinSafe](functions/asinSafe.md)
- [compensatedProduct](functions/compensatedProduct.md)
- [divideSafe](functions/divideSafe.md)
- [ensureFinite](functions/ensureFinite.md)
- [expSafe](functions/expSafe.md)
- [lerpSafe](functions/lerpSafe.md)
- [logSafe](functions/logSafe.md)
- [neumaierSum](functions/neumaierSum.md)
- [powSafe](functions/powSafe.md)
- [reciprocalSafe](functions/reciprocalSafe.md)
- [robustSum](functions/robustSum.md)
- [sanitizeNumber](functions/sanitizeNumber.md)
- [sqrtSafe](functions/sqrtSafe.md)
