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
JavaScript engines (sqrt) are delegated to [DeterministicMath](../../deterministic/classes/DeterministicMath.md) to
ensure cross-platform reproducibility for physics simulations, lockstep
networking, and replay systems.

## Other

- [MIN\_SAFE\_DIVISOR](variables/MIN_SAFE_DIVISOR.md)

## Safety

- [compensatedProduct](functions/compensatedProduct.md)
- [ensureFinite](functions/ensureFinite.md)
- [neumaierSum](functions/neumaierSum.md)
- [robustSum](functions/robustSum.md)
- [safeAcos](functions/safeAcos.md)
- [safeAsin](functions/safeAsin.md)
- [safeDivide](functions/safeDivide.md)
- [safeLerp](functions/safeLerp.md)
- [safeLog](functions/safeLog.md)
- [safeMod](functions/safeMod.md)
- [safePow](functions/safePow.md)
- [safeReciprocal](functions/safeReciprocal.md)
- [safeSqrt](functions/safeSqrt.md)
- [sanitizeNumber](functions/sanitizeNumber.md)
