## Context

A 5-agent adversarial audit verified the entire `@lenguados/math2d` codebase line-by-line against authoritative references (gl-matrix, Box2D, Godot, Unity, nalgebra, Eigen, GLM) and academic sources (IEEE 754/1788, Baudin-Smith, fdlibm, Kahan/Neumaier). The audit found zero mathematical bugs and zero determinism violations, but discovered 5 factual errors in the README and 3 verified code-level improvements.

The changes are small in scope (documentation fixes + minor code polish) but high in impact — the README is the primary user-facing document and currently contains misleading information about matrix storage order, export names, and available types.

## Goals / Non-Goals

**Goals:**

- Fix all 5 verified README factual errors so documentation matches code
- Add JSDoc clarifications for `roundToPlaces` and `normalizeUnchecked` edge cases
- Optimize `Rotation2.fromAngle` to skip redundant normalization
- Add `t === 0` endpoint guard to scalar `lerp` for symmetry with `t === 1`
- Document `nearEquals` tolerance semantics across scalar and type levels

**Non-Goals:**

- Rewriting the README to cover all 7 core types in full detail (separate change)
- Adding new methods (bounce, cubic_interpolate, snapped, eigenvalues)
- Refactoring Complex or Interval class scope
- Changing the three-tier validation pattern
- Modifying EPSILON value or tolerance strategy
- Splitting `safety.ts` into smaller files

## Decisions

### D1: README fixes are literal corrections, not a rewrite

The README needs a comprehensive rewrite to cover all 7 core types, but that is a separate, larger change. This change only fixes the 5 verified factual errors: row-major→column-major, DEG2RAD→DEG_TO_RAD, epsilonEquals→nearEquals, length()→magnitude(), and the incomplete types claim.

**Rationale:** Fixing lies is urgent; a full rewrite requires design decisions about structure and examples that are out of scope for an audit fix.

### D2: `roundToPlaces` gets documentation, not a code fix

The `Math.round(value * factor) / factor` approach is standard and well-understood. The IEEE 754 representation issue (1.005 → 1.00499... in binary) is inherent to all floating-point multiply-round-divide approaches. Adding a decimal-aware fix (e.g., using string manipulation or `Number.EPSILON` adjustment) would add complexity for a niche edge case.

**Rationale:** The function behaves correctly for its IEEE 754 inputs. The "bug" is in the user's expectation, not the code. A JSDoc `@remarks` note educates users.

### D3: `Rotation2.fromAngle` optimization bypasses `set()` normalization

Currently `fromAngle(angle)` calls `set(cos, sin)` which calls `hypot()` + divide. Since `sinCos()` already returns unit-length values (sin²+cos²=1 by identity), the normalization in `set()` is redundant. The fix assigns `cos` and `sin` directly.

**Rationale:** `hypot()` is ~10x slower than addition. Removing it from `fromAngle` eliminates unnecessary computation on the most common rotation construction path. The `set()` method itself still normalizes since it accepts arbitrary user input.

### D4: `lerp` gets `t === 0` guard matching existing `t === 1` guard

The existing `if (t === 1) return b;` prevents `a + (b - a) * 1` from drifting due to floating-point cancellation. The same argument applies to `t === 0`: if `b - a` overflows to `±Infinity`, then `a + Infinity * 0 = a + NaN = NaN`. The `t === 0` guard prevents this.

**Rationale:** Follows the C++20 `std::lerp` specification which guards both endpoints. Symmetry with the existing `t === 1` guard.

## Risks / Trade-offs

- **README fix scope**: Fixing individual errors in an outdated README may create inconsistency with surrounding outdated content. Mitigated by keeping fixes surgical and adding a TODO comment about the needed full rewrite.
- **`fromAngle` bypassing `set()`**: Future changes to `set()` normalization logic won't automatically propagate to `fromAngle()`. Mitigated by adding a comment linking the two.
- **`lerp` `t === 0` guard**: Adds a branch to every `lerp` call. Impact is negligible (branch prediction will handle this) and matches `std::lerp` behavior.
