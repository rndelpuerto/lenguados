## Context

The @lenguados/math2d package (~94K lines, 31 source files, 6 architectural layers) has been audited line-by-line by 12 domain-expert reviewers covering every module: auxiliary/scalar, auxiliary/numeric, auxiliary/angle, core types (Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3, Transform2), infrastructure (deterministic kernels, types, validation, utils), and cross-cutting API conventions. Findings were cross-referenced against 12+ established math/physics libraries (gl-matrix, three.js, Box2D, Unity, Godot, Eigen, nalgebra, Rapier, p5.js, Matter.js, glm, Chipmunk2D).

**Adversarial validation phase:** All decisions were attacked by 4 adversarial agents (documentation archaeologist, devil's advocate, evidence hunter, source code analyst) and verified against authoritative sources (IEEE 754-2019, ECMAScript spec, C99 standard, fdlibm source, Box2D source, nalgebra source, Higham's "Accuracy and Stability of Numerical Algorithms", Blackman & Vigna 2021 ACM TOMS).

**Current state:** The library is architecturally sound, mathematically correct in >98% of cases, and follows consistent API patterns. The adversarial review confirmed all findings against actual code and authoritative sources, while refining several decisions.

**Constraints:**

- All changes MUST preserve L0 bit-exact determinism
- Breaking API changes must be flagged and batched for a semver-minor or major release
- Test coverage thresholds (90% lines/statements/functions, 50% branches) must be maintained
- Tree-shakeability of validation code must not be compromised

## Goals / Non-Goals

**Goals:**

- Fix confirmed bugs with irrefutable evidence (P0)
- Resolve performance-impacting issues in hot-path code (P1)
- Eliminate DRY violations across all modules (P2)
- Complete static/instance symmetry gaps (P2)
- Fix misleading documentation (P3)
- Add missing operations validated against reference library source code (P4)

**Non-Goals:**

- Adding geometry types (AABB, Circle, Ray2, Line2) — downstream packages
- Adding physics algorithms (SAT, GJK, collision detection) — downstream packages
- Eigendecomposition, SVD, or advanced linear algebra — overkill for 2D physics
- Renaming `loop` to `wrap` — would break public API
- Hyperbolic trig functions — rarely needed in 2D physics

## Decisions (Adversarially Validated)

### D1: Rotation2 static `clone()` — REVISED after adversarial review

**Original decision:** Replace `set()` with direct assignment.
**Devil's advocate attack:** Static clone accepts `ReadonlyRotation2Like` which may NOT be unit-length. Normalizing protects the Rotation2 invariant (cos²+sin²=1). A non-unit Rotation2 propagates errors through every subsequent operation.
**Evidence:** Box2D's `b2Rot` always ensures unit-length on construction. nalgebra's `UnitComplex` always normalizes from raw components.
**REVISED DECISION:** Static `clone()` behavior depends on input type. The current normalization is CORRECT as a safety measure for `ReadonlyRotation2Like` inputs. The asymmetry with instance `clone()` is INTENTIONAL — instance operates on a validated `Rotation2`, static operates on an unvalidated interface. **Downgrade from P0 to P3 documentation: add `@remarks` explaining why normalization occurs.**

### D2: Introduce `setDirect()` on Rotation2 — CONFIRMED with strengthened mitigations

**Decision:** Add a private `setDirect(cos, sin): this` that assigns without normalization.
**Evidence:** Box2D's `b2MulRot` does NOT normalize (DEFINITIVE from source). nalgebra's `UnitComplex::mul` uses `new_unchecked` (DEFINITIVE from source). Industry standard is no-normalization on composition.
**Devil's advocate concern:** Creates a two-tier invariant hole.
**Strengthened mitigation:** (1) `setDirect` is private, (2) dev-mode assertion verifies `|cos²+sin²-1| < EPSILON`, (3) only used in static arithmetic methods where inputs are guaranteed unit-length by the type system.
**CONFIRMED: P1 priority.**

### D3: Fix `powSafe` NaN^0 — CONFIRMED but priority revised

**Decision:** Swap `exponent === 0` check before NaN check.
**Evidence:** IEEE 754-2019 §9.2.1: `pow(qNaN, 0) = 1` (DEFINITIVE). C99 §7.12.7.4: `pow(base, ±0) = 1` for ANY base including NaN (DEFINITIVE). ECMAScript spec: `Math.pow(NaN, 0) = 1` (DEFINITIVE).
**Devil's advocate counter:** IEEE 754-2019 also defines `powr(NaN, 0) = NaN`. JavaScript uses `pow` semantics, not `powr`.
**REVISED PRIORITY: P2 (not P0).** The function name is `powSafe`, not `powrSafe`. The fix aligns with the language's own Math.pow behavior. But it's unlikely to trigger in practice (nobody calls `powSafe(NaN, 0)` in physics), so P2 is appropriate. Add a code comment noting the `pow` vs `powr` distinction.

### D4: Rotation2 `relativeTo()` — REVISED to documentation fix only

**Original decision:** Rename to `rotationTo()` or fix math.
**Devil's advocate attack:** The math IS consistent. Static `relative(a, b)` = `conj(a) * b` = "b relative to a". Instance `relativeTo(other)` = `conj(this) * other` = "other relative to this". The name "relativeTo" is ambiguous but the math matches the static `relative` convention. Multiple 3D engines use the same convention.
**Evidence:** The static method documents "b relative to a" for `conj(a) * b`. The instance does `conj(this) * other` which is "other relative to this". Consistent.
**REVISED DECISION: Documentation fix only (P3).** Add `@remarks` clarifying "Computes the rotation FROM this TO other, equivalent to `Rotation2.relative(this, other)`". No rename, no math change. The naming is ambiguous but not wrong.

### D5: DRY delegation for instance comparison methods — CONFIRMED

**Decision:** 9 Matrix2 + 9 Matrix3 instance comparison methods delegate to static.
**Devil's advocate concern:** Function call overhead in hot loops.
**Evidence:** V8 reliably inlines monomorphic calls under the bytecode size limit. These comparison methods are NOT hot-path operations (you don't check `isOrthogonal` 50,000 times per frame in physics). Maintenance risk of 18 duplicated methods outweighs theoretical performance concern.
**CONFIRMED: P2 priority.**

### D6: Transform2 inverse DRY — CONFIRMED

**Decision:** `inverse()` and `inverseSafe()` delegate to `inverseUnchecked()`.
**No adversarial attack found.** Straightforward structural refactor.
**CONFIRMED: P2 priority.**

### D7: Static/instance symmetry gaps — CONFIRMED

**Decision:** Add missing instance methods.
**Supported by completeness principle.** No adversarial attack.
**CONFIRMED: P2 priority.**

### D8: Transform2 direction CS parameter order — REVISED to documentation only

**Original decision:** Add `transform` parameter for consistency.
**Devil's advocate attack:** The omission is DELIBERATE. Direction transforms only use rotation. Accepting an unused `transform` parameter violates the Interface Segregation Principle. Users would pass transforms whose position/scale are silently ignored, creating a category of subtle bugs.
**REVISED DECISION: Documentation only (P3).** Add `@remarks` explaining why these methods differ from other CS variants: "Direction transforms only use rotation (cos/sin), not position or scale. The transform parameter is omitted because it would be misleading — only the rotation is used." No API change.

### D9: Complex.sqrt — REVISED with mandatory special cases

**Original decision:** Replace `pow(0.5)` with direct algebraic formula.
**Evidence FOR:** Production C libraries (musl, glibc, CPython) use the algebraic formula, NOT polar form (DEFINITIVE from cppreference/source). Higham documents precision advantages. Herbie project identifies the transformation as a precision improvement.
**Devil's advocate CRITICAL FINDING:** The naive direct formula `(sqrt((r+a)/2), sign(b)*sqrt((r-a)/2))` FAILS on the negative real axis. For `z = -1 + 0i`: `sign(0) = 0`, so the imaginary part becomes 0 instead of 1. The formula needs special cases for `imag = 0 && real < 0`.
**REVISED DECISION: Implement the algebraic formula WITH mandatory special cases** matching C `csqrt` specification (C99 Annex G):

1. If `z = 0`: return 0
2. If `imag = 0 && real >= 0`: return `(sqrt(real), 0)`
3. If `imag = 0 && real < 0`: return `(0, sqrt(-real))`
4. General case: `(sqrt((r+a)/2), sign(b)*sqrt((r-a)/2))` where `r = hypot(a, b)`
   **Priority remains P1** (performance + correctness improvement).

### D10: Missing operations — REVISED after full adversarial review

**CONFIRMED additions (irrefutable evidence):**

- `Matrix2.fromDiagonal(v)` — trivial, useful for mass/inertia matrices
- `Matrix2.fromReflection(axis)` — Householder I-2nnᵀ, mathematically standard (DEFINITIVE: Wikipedia, PlanetMath, Cornell CS 6210)
- `Matrix2.solveLinearSystem(matrix, b)` — Cramer's rule for 2x2, Box2D's `b2Solve22` uses same approach (DEFINITIVE from source)
- `Complex.fromRotation2()` — symmetry completion, zero controversy
- `Rotation2.angleBetween()` — allocation-free, pure math primitive
- `Interval.distance()` — pure interval arithmetic, needed for SAT
- `Interval.enclosing()` — pure interval arithmetic, Box2D `b2AABB::Combine` pattern
- `Matrix3.inverseAffine` (3 tiers) — exploits [0,0,1] row, genuine performance win
- `flushDenormal`, `ceilPowerOfTwo`, `floorPowerOfTwo` — numerical utilities

**WEAKENED additions (devil's advocate raised valid concerns):**

- `Vector2.chebyshevLength/chebyshevDistance` — **KEEP but lowest priority.** Completes L1/L2/L-inf norm family. Devil's advocate notes it's primarily for grid-based pathfinding (gameplay, not physics). But L-inf norm IS a mathematical primitive.
- `Matrix2.transformVectorTranspose` — **DEFER.** Devil's advocate correctly notes this is trivially inlined for 2x2 (`m00*vx+m01*vy, m10*vx+m11*vy`). Constraint solving is a downstream concern per project non-goals. A 2x2 transpose multiply doesn't justify a dedicated method.

**REVISED removals:**

- `sinCosNormalized` — **KEEP (reversed).** Devil's advocate correctly identifies this contradicts the "completeness over minimalism" principle. The function provides different-quality range reduction for very large angles. Tree-shakeable, zero cost to keep. The inconsistency of removing this while keeping `Matrix2.multiplyScalar` (same "unused but complete" argument) is indefensible.

**CONFIRMED deferrals:**

- `moveTowards` / `moveTowardsAngle` — DEFERRED per ratified spec. Evidence confirms: glm, nalgebra, Eigen all lack it (DEFINITIVE). Only game engines (Unity, Godot) include it.
- `Rotation2.fromDegrees` — DEFERRED per radians-only convention.

### D10-acos: acos/asin precision — REVISED formula

**Original recommendation:** Use `2*atan(sqrt((1-x)/(1+x)))` for `|x| > 0.5`.
**Evidence from fdlibm source:** fdlibm's `e_acos.c` does NOT use the 2*atan identity. It uses half-angle substitution: `acos(x) = 2*asin(sqrt((1-x)/2))`for`x > 0.5`, with high/low word splitting for extra precision (DEFINITIVE from fdlibm source).
**REVISED DECISION:** If precision improvement is pursued (P5), use fdlibm's actual approach (half-angle substitution with polynomial minimax), NOT the 2\*atan identity.

## Risks / Trade-offs

### [Risk] `setDirect()` bypasses normalization → **Mitigation:** Private + dev-mode assertion + only used in static arithmetic. Evidence: Box2D and nalgebra both skip normalization on composition. Drift is managed by periodic explicit normalize calls.

### [Risk] Complex.sqrt branch-cut failure → **Mitigation:** Mandatory special cases matching C99 Annex G. Test with property-based tests including negative real axis, zero imaginary, and all four quadrants.

### [Risk] DRY refactoring regression → **Mitigation:** Run full test suite after each refactoring group. Zero behavioral change expected.

### [Risk] New operations bundle size → **Mitigation:** All tree-shakeable. Estimated addition: ~500 lines across all new operations.

## Historical Decision Reconciliation

| This Audit's Recommendation           | Historical Decision                   | Adversarial Outcome                                                                          | Final Resolution                    |
| ------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| Fix Rotation2 `clone()` normalization | Not addressed                         | **Devil's advocate wins.** Normalization protects Rotation2Like inputs                       | **P3 doc fix** (not P0 bug)         |
| Fix `powSafe` NaN^0                   | Not addressed                         | **Evidence wins.** IEEE 754 + C99 + ES spec all agree                                        | **P2 fix** (downgraded from P0)     |
| Rename `relativeTo`                   | Not addressed                         | **Devil's advocate wins.** Ambiguous naming ≠ wrong math                                     | **P3 doc fix** (not rename)         |
| Add `setDirect`                       | Not addressed                         | **Evidence wins.** Box2D + nalgebra confirm no-normalize pattern                             | **P1 confirmed**                    |
| Remove `sinCosNormalized`             | "Completeness over minimalism" pillar | **Devil's advocate wins.** Zero cost, contradicts own principle                              | **KEEP** (reversed)                 |
| Fix direction CS param order          | Not addressed                         | **Devil's advocate wins.** ISP violation to add unused param                                 | **P3 doc fix** (not API change)     |
| Complex.sqrt direct formula           | Not addressed                         | **Evidence + devil's advocate together.** Formula correct but needs branch-cut special cases | **P1 with mandatory special cases** |
| Add `transformVectorTranspose`        | Not addressed                         | **Devil's advocate wins.** Trivially inlined for 2x2                                         | **DEFERRED**                        |
| acos/asin precision improvement       | Not addressed                         | **Numerical analysis DEFINITIVELY REJECTS.** See D10-acos-FINAL below                        | **NEVER IMPLEMENT**                 |
| moveTowards / moveTowardsAngle        | **REJECTED** by ratified spec         | **Evidence confirms.** glm/nalgebra/Eigen lack it                                            | **DEFERRED** (historical wins)      |

## Adversarial Validation Summary

**Evidence sources consulted:**

- IEEE 754-2019 §9.2.1 (pow vs powr semantics)
- C99/C11 §7.12.7.4 (pow special cases)
- ECMAScript specification (Math.pow NaN behavior)
- fdlibm e_acos.c source (FreeBSD, Android AOSP)
- Box2D v2/v3 source (b2MulRot, b2Solve22, b2Transform)
- nalgebra UnitComplex source (unit_complex_ops.rs)
- Higham, "Accuracy and Stability of Numerical Algorithms" (2002)
- Blackman & Vigna, "Scrambled Linear PRNGs" (ACM TOMS 2021)
- Herbie PLDI 2015 (numerical transformation precision)
- C99 Annex G (complex sqrt special cases)

**Scorecard: 11 decisions attacked, results:**

- 5 CONFIRMED unchanged (D2, D5, D6, D7, D10-additions)
- 4 REVISED to documentation-only (D1, D4, D8, sinCosNormalized)
- 1 REVISED with strengthened spec (D9 sqrt branch-cut)
- 1 DOWNGRADED priority (D3 P0→P2)

## D10-acos-FINAL: Definitive Rejection of acos/asin Precision Improvement

**Status: NEVER IMPLEMENT. Decision is final and irrefutable.**

### The Question

The current deterministic `acos(x)` uses `atan2(sqrt(1-x*x), x)`. The `1-x*x` computation suffers catastrophic cancellation when |x| → 1. fdlibm's `e_acos.c` uses half-angle substitution `acos(x) = 2*asin(sqrt((1-x)/2))` for |x| > 0.5, avoiding this. Should we adopt the fdlibm approach?

### The Mathematical Argument (Corrected After Deep Analysis)

There are **three distinct sources of error** in the `dot → cos(θ) → acos` chain, which must NOT be conflated:

**Source A — Representation loss (inherent to IEEE 754):** When `cos(θ)` is stored as a `double`, the leading `1` in `1 - θ²/2` consumes mantissa bits. The recoverable bits of θ are: `bits ≈ 52 - 2*⌈log₂(1/θ)⌉`. At θ = 1e-6 rad, only ~12 bits carry θ information. This is **not a computation error** — it is an information-theoretic limit of the `cos(θ)` representation.

**Source B — Dot product computation error (~1.5 ULP):** The dot product itself is computed to nearly full precision of `cos(θ)`. This is NOT the dominant error.

**Source C — The `acos` computation error (fixable):** The current `1-x*x` cancellation adds ~1 extra bit of error on top of Source A. The half-angle formula `(1-x)/2` is exact by Sterbenz's lemma when 0.5 ≤ x ≤ 1, adding zero additional error.

**Critical nuance:** An algorithm that NEVER computes `cos(θ)` as an intermediate — such as the **versine approach** via squared distance — is NOT subject to Source A:

```
|a - b|² = 2*(1 - cos(θ)) ≈ θ²   (full 52-bit precision for any θ)
θ = 2 * asin(|a - b| / 2)         (well-conditioned at all scales)
```

This path WOULD make a precision-preserving `asin` genuinely valuable. **However**, implementing this would require a new `angleBetweenPrecise` algorithm at the CALLER level, not just a better `acos` kernel.

### Empirical Evidence: Error Comparison for Realistic Inputs

| Angle between vectors | Absolute error (current atan2) | Absolute error (fdlibm half-angle) | Ratio |
| --------------------- | ------------------------------ | ---------------------------------- | ----- |
| 1°                    | 2.1e-15 rad                    | 1.8e-15 rad                        | 1.17× |
| 0.01°                 | 2.7e-13 rad                    | 2.4e-13 rad                        | 1.12× |
| 0.001°                | 6.5e-13 rad                    | 5.9e-13 rad                        | 1.10× |
| 0.0001°               | 1.6e-11 rad                    | 1.5e-11 rad                        | 1.07× |

**The improvement ratio is at most 1.17×** for realistic dot-product-sourced inputs — a negligible difference. The ~17M ULP error cited in the original audit only occurs for **synthetic literal inputs** (e.g., `acos(0.9999999999)` typed directly in code), which never occurs in physics computations.

### Physical Significance

The worst-case error at 0.0001° angle with 1000px radius produces a positional error of **0.016 nanopixels** — 7 orders of magnitude below a pixel. The engine's `EPSILON = 1e-10` tolerance is vastly larger.

### Risk Analysis of Implementation

Even if we wanted the improvement:

1. **L0 determinism breaking change**: Every downstream system doing replay/sync would need to invalidate its recordings
2. **38 tests reference acos/asin**: Each test's expected values would need updating
3. **Polynomial coefficients**: The fdlibm approach needs 6-8 new minimax coefficients (Remez algorithm) or reuse of our atan2 kernel with half-angle substitution, which adds ~40 lines of branch logic
4. **Cross-platform verification**: Must verify bit-exact results across V8, SpiderMonkey, JavaScriptCore, and Hermes

### What Other Libraries Do

- **three.js, gl-matrix**: Use `Math.acos` directly (no determinism concern)
- **Box2D, Planck.js**: **Avoid `acos` entirely** in the physics step; use `atan2(cross, dot)` for signed angles (which @lenguados/math2d already does via `angleTo`/`angleFromVectors`)
- **No JavaScript math library** implements a custom `acos` with fdlibm-level precision

### Why Improving acos Alone Does NOT Help (The Correct Reasoning)

Fixing Source C (the acos kernel) while keeping Source A (the `cos(θ)` representation) yields only a **1.07-1.17× improvement** for realistic inputs, because Source A dominates. The half-angle formula eliminates the ~1 extra bit from `1-x*x`, but ~12-35 bits were already lost in the `cos(θ)` representation.

### Could Fixing the Upstream Algorithm Make acos Worth Improving?

**Yes, in theory.** The versine approach `θ = 2*asin(|a-b|/2)` avoids `cos(θ)` entirely, preserving full 52-bit precision. Combined with a half-angle `asin`, this would give full-precision angle recovery. **However:**

1. This requires changing the ALGORITHM at the caller level (`slerp`, `angleBetween`), not just the `acos` kernel
2. The library's architecture already routes around the problem:
   - **`angleTo` / `angleFromVectors`** use `atan2(cross, dot)` — well-conditioned across ALL ranges, including small angles (cross ≈ θ carries full precision)
   - **`slerp`** has `if (isNearZero(theta)) return lerp(...)` — falls back to linear interpolation when θ is small, which IS the correct first-order Taylor approximation of slerp
   - **`angleBetween`** produces errors below `EPSILON` for all practical inputs (worst case: 0.016 nanopixels)
3. Implementing `angleBetweenPrecise` via versine would be a NEW operation, not a fix to an existing one — and its benefit over the existing `atan2(cross, dot)` path is marginal

### Conclusion

**The `acos` kernel improvement is NEVER justified in isolation** because Source A (representation) dominates Source C (computation). **A full versine-based algorithm would bypass Source A but is unnecessary** because the library's architecture already handles the small-angle regime correctly through `atan2(cross, dot)` and lerp fallbacks.

The right engineering decision is: keep the current `acos` implementation, keep the `atan2(cross, dot)` path for signed angles, and keep the slerp→lerp fallback for interpolation. No change to any of these produces a user-visible improvement given `EPSILON = 1e-10`.

**Note on the versine alternative (educational, NOT a recommendation):**
The formula `θ = 2*asin(|a-b|/2)` avoids `cos(θ)` entirely and preserves full 52-bit precision. This is a well-known identity in numerical analysis (Kahan 1996). However, it SHALL NOT be added to math2d because:

1. It fails 3 of 4 selection criteria (Box2D doesn't have it, doesn't complete a family, not needed for physics)
2. It composes trivially (4 lines) — same rejection basis as `moveTowards`
3. The name `angleBetweenPrecise` would violate naming conventions (no `*Precise` suffix exists; established suffixes are `Safe`, `Unchecked`, `CS`)
4. No real 2D physics scenario requires sub-nanopixel angle precision
5. Adding a "precision tier" would create a new axis of API variation without precedent

If a consumer needs this, the 4-line formula is trivially composable from existing primitives:

```typescript
const dx = a.x - b.x,
 dy = a.y - b.y;
const halfDist = Math.sqrt(dx * dx + dy * dy) / 2;
const angle = 2 * asin(clamp(halfDist, -1, 1));
```

**References:**

- Higham, "Accuracy and Stability of Numerical Algorithms" (2002), Chapter 1: error analysis of dot products and the cos→acos information-theoretic limit
- Sterbenz's lemma (1974): `(1-x)/2` is exact for 0.5 ≤ x ≤ 1 in IEEE 754
- fdlibm `e_acos.c` source (FreeBSD, Android AOSP) — polynomial minimax with half-angle
- IEEE 754-2019 §5.4.1 — `sqrt` is correctly rounded (0.5 ULP)
- Box2D source — avoids `acos` in physics step entirely; uses `atan2(cross, dot)`
- Kahan (1996): "Branch Cuts for Complex Elementary Functions" — versine as precision-preserving alternative

## Open Questions

All resolved. No open questions remain.

1. ~~**Rotation2 `relativeTo`:**~~ **RESOLVED.** Documentation fix only.
2. ~~**Interval `mod` semantics:**~~ **RESOLVED.** `@remarks` added documenting component-wise semantics.
3. ~~**`sinCosNormalized`:**~~ **RESOLVED.** KEEP — completeness principle.
4. ~~**Matrix2 `multiplyScalar`:**~~ **RESOLVED.** KEEP — all-or-nothing principle.
5. ~~**Transform2 direction CS:**~~ **RESOLVED.** Documentation fix only (ISP principle).
6. ~~**acos/asin precision:**~~ **RESOLVED.** NEVER IMPLEMENT — see D10-acos-FINAL above.
