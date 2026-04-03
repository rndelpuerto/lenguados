## Context

A comprehensive line-by-line audit of @lenguados/math2d (96K lines, 31 files, 6 layers) was performed by specialized agents, then adversarially verified by executing every finding in Node.js, cross-referencing against existing test expectations, and validating against authoritative external sources.

**Current state**: The library is architecturally excellent — zero circular dependencies, strict layer boundaries, comprehensive static/instance symmetry, correct mathematical formulas throughout, proper fdlibm coefficients, and complete triality coverage. **Zero mathematical bugs** in any formula.

**Critical finding**: The angle normalization convention `[-PI, PI)` is non-standard. Research against IEEE 754, C standard, MATLAB, Unity, Box2D, Bullet Physics, pytransform3d, and the mathematical principal argument Arg(z) shows **every authoritative source uses `(-PI, PI]` or `[-PI, PI]`**. None use `[-PI, PI)`. This non-standard convention caused 5 TSDoc "bugs" (the docs were actually aligned with the standard; the code was the outlier) and an internal inconsistency with atan2 round-trips.

**Other findings**: 1 TSDoc bug from Ericson combined tolerance pattern, 8 TSDoc API signature errors in Matrix2/Matrix3, 2 phantom package.json exports, 1 name collision, 3 API gaps, and 3 design inconsistencies.

**Constraints**: Preserve deterministic guarantees, tree-shaking, layer boundaries. Breaking changes are acceptable since the library is pre-1.0.

## Goals / Non-Goals

**Goals:**

- Align angle normalization with the universal standard `(-PI, PI]` (root cause fix)
- Fix remaining TSDoc bugs not resolved by the convention change
- Clean up phantom exports and barrel conflicts
- Add the 2-3 most impactful missing API methods
- Document known limitations

**Non-Goals:**

- Adding geometry types (AABB, Circle, Ray) — future packages
- Adding physics algorithms — future packages
- Restructuring architecture — already well-designed
- Modifying fdlibm coefficients — all verified correct
- Adding marginal constants (SQRT_3) — insufficient justification

## Decisions

### D1: Change angle normalization from `[-PI, PI)` to `(-PI, PI]` (convention alignment)

**Choice**: Add `result === -PI ? PI : result` to `normalizeRadians` and `result === -180 ? 180 : result` to `normalizeDegrees`. A 1-line change per function.

**Alternatives considered**:

1. _Fix only the documentation_: Rejected because the code convention is non-standard. Every authoritative source (IEEE 754 atan2, C standard, MATLAB wrapToPi, Unity Mathf.DeltaAngle, Box2D, Bullet Physics, mathematical Arg(z), pytransform3d) uses `(-PI, PI]` or `[-PI, PI]`. The TSDoc authors intuitively wrote examples matching the standard — it was the code that was the outlier.
2. _Change to `[-PI, PI]` (closed)_: Rejected because a half-open interval is mathematically cleaner for modular arithmetic. `(-PI, PI]` is the mathematical principal argument convention.

**Evidence (irrefutable)**:
| Source | `normalize(PI)` returns | Convention |
|--------|------------------------|------------|
| IEEE 754 / C atan2 | +PI | `[-PI, PI]` |
| JavaScript Math.atan2 | +PI | `[-PI, PI]` |
| MATLAB wrapToPi | +PI | `[-PI, PI]` |
| Unity Mathf.DeltaAngle | +180 | `(-180, 180]` |
| Box2D | +PI (via atan2) | `[-PI, PI]` |
| Bullet Physics | +PI | `[-PI, PI]` |
| Mathematical Arg(z) | +PI | `(-PI, PI]` |
| pytransform3d | +PI | `(-PI, PI]` |
| **This library (current)** | **-PI** | **`[-PI, PI)`** |

**Impact analysis** (verified by execution):

- Only the EXACT value `-PI` (bitwise `=== -Math.PI`) changes. Values 1e-15 away are NOT affected.
- `angleDifference`, `angleBisector`, `lerpAngle`, `unwrapAngles`, `AngleUnwrapper` all inherit the fix automatically — no code changes needed in those functions.
- `Rotation2.fromAngle(PI).angle` becomes `+PI` (consistent round-trip; was `-PI`).
- `normalizeRadiansPositive` / `normalizeDegreesPositive` are NOT affected (they use `[0, TAU)` / `[0, 360)`).
- No core types (Vector2, Matrix2, Matrix3, Complex, Interval, Transform2) are affected.
- The 180° ambiguity moves from `-PI` (CW bias) to `+PI` (CCW bias), aligning with the library's documented CCW-positive convention.

### D2: Fix relativeEquals TSDoc — document Ericson pattern correctly

**Choice**: Correct the TSDoc example and add remarks explaining the `max(1, |a|, |b|)` combined tolerance pattern.

**Evidence**: The `max(1, |a|, |b|)` pattern originates from Christer Ericson (_Real-Time Collision Detection_). Also validated against Bruce Dawson (Valve), numpy.allclose, Python PEP 485 math.isclose. The `1` floor is a deliberate design feature that makes the function behave as absolute comparison for near-zero values — a feature Bruce Dawson explicitly recommends for game engines.

### D3: Fix Matrix2/Matrix3 TSDoc API signatures

**Choice**: Correct 8 TSDoc examples that use wrong function signatures.

**Evidence**: The functions' own `@example` blocks use correct signatures. The errors appear only in OTHER methods' examples (multiply, rotate, scaleBy) where snippets were written without verifying signatures. gl-matrix, Unity, Godot, Box2D all use vector parameters for these operations.

### D4: Remove phantom exports, add real deterministic subpath

**Choice**: Delete non-existent `precision-math`/`rounding-control` entries. Add `./deterministic` pointing to actual `deterministic-kernels` with dev/prod conditionals.

### D5: Add Complex.addScalar/subtractScalar (static + instance)

**Choice**: `(re + s, im)` / `(re - s, im)`. Follow Vector2 pattern. Complete static/instance symmetry.

### D6: Add Rotation2.angleTo instance method

**Choice**: `angleTo(other)` delegates to `Rotation2.angleBetween(this, other)`. Matches `Vector2.angleTo` naming.

### D7: Add lerpAngleClamped

**Choice**: `lerpAngle(from, to, saturate(t))`. Matches `lerpClamped` pattern.

### D8: Fix Complex.sqrt instance to use algebraic formula

**Choice**: Delegate to `Complex.sqrt(this, this)` instead of `this.pow(0.5)`. The algebraic formula (C99 Annex G) is more numerically stable at branch cuts.

### D9: Mark pow2 @internal, resolve sinCos barrel shadowing

**Choice**: Add `@internal` to `pow2`. Remove explicit `sinCos` re-export from deterministic barrel (auxiliary wrapper already provides it via `export *`).

### D10: Document ReadonlySinCos, Rotation2.copy, isParallel scale-dependence

**Choice**: Add `@remarks` documentation only — no behavioral changes.

## Risks / Trade-offs

**[Risk: Convention change breaks exact PI comparisons]** → Only code using `normalizeRadians(PI) === -PI` would break. The library's own `anglesNearEqual` handles PI/-PI equivalence correctly. The change IMPROVES atan2 interop (`normalizeRadians(atan2(y,x)) === atan2(y,x)` now holds for all cases).

**[Risk: lerpAngle direction changes at exact PI]** → `lerpAngle(0, PI, 0.5)` changes from `-PI/2` to `+PI/2`. Both are valid shortest arcs for the ambiguous 180° case. The new direction (CCW/positive) aligns with the library's Y-up CCW-positive convention.

**[Risk: Phantom export removal]** → Exports point to non-existent files. Any consumer was already failing.

**[Risk: Complex.sqrt precision change]** → Algebraic formula is MORE precise, not less. Edge case values shift by ~1e-16 (within EPSILON).

**[Trade-off: Anti-symmetry at PI]** → `angleDifference(0, PI)` and `angleDifference(PI, 0)` now BOTH return `+PI` instead of both returning `-PI`. The anti-symmetry break is inherent to any half-open interval and is unavoidable. With `(-PI, PI]`, the ambiguous case resolves to +PI (CCW), which matches the CCW-positive convention.

## Migration Plan

1. **Phase 1 — Convention alignment + TSDoc fixes** (single PR):
   - Change `normalizeRadians` / `normalizeDegrees` convention (2 lines of code)
   - Update all angle-related TSDoc to reflect `(-PI, PI]`
   - Fix `relativeEquals` TSDoc example
   - Fix Matrix2/Matrix3 TSDoc signature bugs
   - Document `Rotation2.copy`, `isParallel`/`isPerpendicular`
   - Update affected tests (PI-boundary expectations)

2. **Phase 2 — Export cleanup** (single PR):
   - Remove phantom exports from package.json
   - Add `./deterministic` subpath export
   - Resolve `sinCos` barrel shadowing
   - Mark `pow2` @internal, document `ReadonlySinCos`

3. **Phase 3 — API additions** (single PR):
   - Add `Complex.addScalar` / `Complex.subtractScalar`
   - Add `Rotation2.angleTo`
   - Add `lerpAngleClamped`
   - Fix `Complex.sqrt` instance

**Rollback**: Each phase is an independent PR.

## Open Questions

None — all questions from the initial audit have been resolved by external research:

1. Convention question → Resolved: `(-PI, PI]` per universal standard
2. `relativeEquals` behavior → Resolved: Ericson pattern, code correct, doc wrong
3. Matrix signature question → Resolved: TSDoc typos, not aspirational API
