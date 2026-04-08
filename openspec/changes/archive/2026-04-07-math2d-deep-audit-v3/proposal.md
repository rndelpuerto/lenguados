## Why

Third-generation exhaustive audit of `@lenguados/math2d` (~31,600 lines, 32 source files). This audit builds on two prior audits (comprehensive-audit and deep-audit) by deploying a multi-agent architecture: 8 domain-expert investigators, 1 reference-library comparison agent, 1 adversarial verifier, 1 post-audit code state agent, and 1 documentation contrast agent. **Every finding has been verified empirically by executing the actual library code.**

**Audit architecture:**

1. **Phase 1** -- 8 domain-specialist agents performed line-by-line analysis of every module
2. **Phase 2** -- Reference library comparison against gl-matrix, Three.js, Unity, Godot, Box2D, Rapier, Matter.js, mathjs
3. **Phase 3** -- Adversarial agent independently verified all findings against source code
4. **Phase 4** -- Cross-reference with prior audit results to identify true delta
5. **Phase 5** -- Integration with project documentation and rules
6. **Phase 6** -- Documentation contrast pass against `.claude/rules/`, README, ARCHITECTURE.md
7. **Phase 7** -- **Empirical verification**: every claim tested by executing the library with real inputs

**Key finding**: The codebase is exceptionally well-designed. Out of ~31,600 lines audited line-by-line: **4 confirmed issues** (1 precision, 1 performance, 1 API consistency, 1 triality deviation). **2 findings retracted** -- `floorPowerOfTwo` retracted after empirical testing proved the prior audit correct; `Complex.toRotation2()` refuted by documentation contrast (no rule mandates conversion symmetry). Zero mathematical errors in any core type formula.

## What Changes

### Precision Fixes

- **Fix `Transform2.toMatrix3()` lossy trigonometric roundtrip** (P2): Line 1575 calls `Rotation2.angle(this.rotation)` (atan2) then `Matrix3.fromTransform2(position, angle, scale)` which calls `sinCos(angle)` to reconstruct cos/sin. **Empirically measured**: 1-2 ULP drift in matrix entries (tested with `Transform2.fromComponents({x:10,y:20}, PI/6, {x:2,y:3})`). The direct path `Matrix3.fromTransform2Like(this, out)` produces exact results. This is both a precision AND a performance improvement (avoids 1 atan2 + 1 sinCos call).

### Performance Fixes

- **Fix `Complex` instance `reciprocal()`/`reciprocalSafe()` hypot overhead** (P3): The instance methods call `this.magnitude()` (hypot) then square the result, while the static counterparts correctly use `magnitudeSq()` directly. **Empirically measured**: instance version is 25.8% slower in a 2M-iteration x 5-round benchmark. The results are numerically identical (0 difference). The instance `reciprocalUnchecked()` already correctly uses `magnitudeSq()`, proving the pattern is established.

### Design Consistency Fixes

- **Fix `Interval.fromArray`/`fromObject` order validation gap** (P3): **Empirically demonstrated**: `Interval.fromArray([5, 2])` silently creates an interval with `min=5, max=2` (invariant violated). `Interval.fromValues(5, 2)` correctly throws `RangeError: "Interval.fromValues: min (5) must be <= max (2)"`. `Interval.fromUnsorted(5, 2)` correctly auto-sorts to `[2, 5]`. The inconsistency between `fromValues` (validates) and `fromArray`/`fromObject` (skips validation) violates `math2d-patterns.md` line 65: "Where setDirect is NOT appropriate: User-facing code paths."

### Documented Deviations (no code change)

- **`Rotation2.normalize()` triality deviation** (P3): **Empirically demonstrated**: `new Rotation2(0,0).normalize()` returns `(cos=1, sin=0)` instead of throwing. `normalizeSafe()` produces identical result. This violates: (a) `math2d-patterns.md` line 14: "op() -- strict, throws on error (default)"; (b) README line 118: "normalize() throws on zero-length vectors"; (c) ARCHITECTURE.md line 90: "op(): Strict, throws on error". However, the prior comprehensive audit documented this as a known deviation (design.md open question #2). Document as an intentional exception in Rotation2-specific TSDoc.

### Proposals Retracted During This Audit (with evidence)

- ~~**`floorPowerOfTwo` snap-to-integer guard**~~: **RETRACTED after empirical execution.** `floorPowerOfTwo(2**n)` was tested for ALL integer exponents n=1 to 52: **zero failures**. The prior audit's mathematical proof was confirmed correct: the floating-point error in `log(2^n)/LN_2` is always zero or a tiny positive offset (e.g., n=51: `51.000000000000007105`). `Math.floor` absorbs positive error correctly. Only `Math.ceil` is vulnerable to positive error (fixed in prior audit). Our Phase 1 and adversarial agents made an incorrect theoretical assumption that the error could be negative.

- ~~`Complex.toRotation2()`~~: No project rule mandates conversion symmetry. Bidirectional conversion exists via `Rotation2.fromComplex()` + `Complex.fromRotation2()`. REFUTED by documentation contrast pass.

### Previously Identified Items Still Pending

- **`logKernelSafe` still exported** (from deep-audit): `export` keyword remains at line 834 despite `@internal` tag.
- **`Vector2.refract` not yet added** (from deep-audit): Identified as P2 addition in prior audit; implementation not started.

## Capabilities

### Modified Capabilities

- `transform2-toMatrix3-fix`: Replace `Rotation2.angle()` path with `Matrix3.fromTransform2Like(this)`. Eliminates 1-2 ULP precision loss.
- `complex-reciprocal-fix`: Replace `this.magnitude()` with `this.magnitudeSq()` in instance reciprocal/reciprocalSafe. Eliminates 25.8% overhead.
- `interval-validation-fix`: Add `assertOrder` to `fromArray` and `fromObject`. Prevents silent invariant violation.

## Impact

- **Affected code**: `core/transform2.ts`, `core/complex.ts`, `core/interval.ts`
- **APIs**: No new or removed APIs. All changes are internal corrections.
- **Breaking**: `Interval.fromArray([5,2])` will now throw RangeError (was silently accepting invalid order)
- **Bundle size**: Negligible change (fewer trig calls in toMatrix3)
- **Deterministic guarantees**: Unchanged
- **Rollback plan**: Each fix is independent and can be reverted separately

## Evidence Summary

Every finding includes empirical verification:

| Finding              | Evidence Type         | Test Command                            | Result                            |
| -------------------- | --------------------- | --------------------------------------- | --------------------------------- |
| Transform2.toMatrix3 | Precision measurement | Compare toMatrix3 vs fromTransform2Like | 1-2 ULP difference measured       |
| Complex.reciprocal   | Performance benchmark | 2M iterations x 5 rounds                | 25.8% slower (instance vs static) |
| Interval.fromArray   | Invariant test        | `Interval.fromArray([5,2])`             | Creates min=5,max=2 (invalid)     |
| Rotation2.normalize  | Behavior test         | `new Rotation2(0,0).normalize()`        | Returns (1,0), does not throw     |
| ~~floorPowerOfTwo~~  | Exhaustive test       | All n=1..52                             | 0/52 failures (RETRACTED)         |
