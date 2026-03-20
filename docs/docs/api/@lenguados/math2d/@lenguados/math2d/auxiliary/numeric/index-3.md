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

### acosSafe

Re-exports [acosSafe](../../deterministic/functions/acosSafe.md)

---

### asinSafe

Re-exports [asinSafe](../../deterministic/functions/asinSafe.md)
