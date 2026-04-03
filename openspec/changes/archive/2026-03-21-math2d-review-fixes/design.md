## Context

The `math2d-comprehensive-review` produced 13 verified findings across P1–P3. The prior `math2d-audit-fixes` change (constant deletions, Rotation2 negate fix) is already committed. This change addresses the remaining findings from the 16-agent review: 3 P1 API inconsistencies, 8 P2 completeness gaps, and 2 P3 documentation items.

All findings have been verified against actual source code. One original finding (F2 — nearEquals epsilon order) was eliminated as a false positive. Two findings (F3, F6) were reclassified from P1 to P2. One adversarial rejection (sqrtSafe) was overruled and reinstated as F13.

## Goals / Non-Goals

**Goals:**

- Fix 3 P1 API inconsistencies (Rotation2 getter rename, random.ts type widening, formatMatrix3 brackets)
- Add 8 P2 features (component-wise ops on Complex/Interval, Vector2 inverted getter, assertRotation2Normalized, Transform2 COMPONENT_COUNT, JSDoc gaps, sqrtSafe layer fix)
- Add 2 P3 documentation improvements
- All 3225+ existing tests pass after changes
- Zero behavioral changes to existing public API beyond the two breaking P1 fixes

**Non-Goals:**

- No new validation tiers (Safe/Unchecked) for the added operations — those can be added later
- No smoothStep/smootherStep on Complex/Interval — only if reference types (Vector2/Matrix2) have them
- No README updates
- No performance benchmarking

## Decisions

### D1: Implement P1 fixes first, then P2, then P3

P1 fixes are small, isolated, and breaking. Implement and test them first to catch any cascade issues before adding the larger P2 features (60+ new methods on Complex/Interval).

**Alternative considered:** All at once. Rejected because a test failure in the 60-method batch would be harder to isolate.

### D2: Complex/Interval component-wise ops follow Vector2 pattern exactly

Copy the static+instance pattern from Vector2 for each operation. For Complex: operate on `real` and `imag` independently. For Interval: operate on `min` and `max` independently.

Include `smoothStep` and `smootherStep` only if Vector2/Matrix2 have them (they do — `smoothStep` exists on both).

**Alternative considered:** Only add ops that are "mathematically meaningful" for Complex. Rejected because the library's philosophy is completeness over minimalism, and these are structural operations on 2-component numeric types, not algebraic operations.

### D3: sqrtSafe layer fix — move re-export to auxiliary barrel

The `deterministic-kernels.ts` line 1002 re-exports `sqrtSafe` from `auxiliary/numeric/safety`. This violates the layer rule. The fix: remove the re-export from `deterministic-kernels.ts` and ensure `sqrtSafe` is exported from `auxiliary/numeric/index.ts` (it already is) and from the package barrel `src/index.ts`.

**Alternative considered:** Inline the `sqrtSafe` implementation into `deterministic-kernels.ts`. Rejected because `sqrtSafe` depends on `isNearZero` from auxiliary, so inlining would still require the upward import. The function belongs in auxiliary, not deterministic.

### D4: F1 rename — no deprecation period

Rename `inversed` → `inverted` directly with no backward-compatible alias. The library is pre-1.0 and the convention is "no deprecated code" (established in prior audit-fixes change).

### D5: Test strategy for new component-wise ops

Add tests in existing spec files (`complex.node.spec.ts`, `interval.node.spec.ts`). For Complex, test one representative value per operation (static + instance) plus NaN/Infinity edge cases. For Interval, same pattern applied to min/max bounds. Use the existing Matrix2 tests as a reference pattern.

## Risks / Trade-offs

**[Risk] F1 rename breaks external consumers** → Library is pre-1.0. Breaking changes are expected. The rename aligns with all other types.

**[Risk] 60+ new methods on Complex/Interval increase bundle size** → All methods are tree-shakeable via static method pattern. Instance methods are only included if the class is imported.

**[Risk] sqrtSafe removal from deterministic barrel breaks external imports** → Check that `sqrtSafe` is accessible via the package's main barrel (`src/index.ts`). It already re-exports from `auxiliary/numeric/index.ts`.

**[Risk] formatMatrix3 output change breaks downstream parsers** → The current output `[a],[b],[c]` is not valid JSON array-of-arrays. The fix to `[[a],[b],[c]]` produces valid output. Any parser relying on the broken format was already handling malformed data.
