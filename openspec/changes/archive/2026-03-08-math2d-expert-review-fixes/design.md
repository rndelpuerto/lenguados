## Context

An expert-level review of all 32 source files in `@lenguados/math2d` identified 80+ issues across 6 architectural layers. The codebase is well-engineered with mature patterns (strict/safe/unchecked triality, deterministic kernels, `*Like` interfaces), but exhibits systematic weaknesses in three areas:

1. **IEEE 754 boundary handling** — Signed zeros (`-0`), NaN propagation, and the half-open range `[-PI, PI)` produce asymmetries and silent failures at mathematical boundaries.
2. **Numerical stability** — Naive formulas (complex division `c²+d²`, angle range reduction, lerp `a+(b-a)*t`) break for extreme magnitudes common in physics simulations.
3. **Safety contract violations** — Several `*Safe` functions violate their implicit contract (never return non-finite for finite input) by producing `Infinity`, `NaN`, or mathematically wrong fallbacks.

The codebase is at a pre-1.0 stage (v0.6.x) where fixing these issues is significantly cheaper than post-adoption. All changes maintain backward compatibility except four breaking changes gated behind a semver minor bump.

**Reference libraries consulted:**

- **fdlibm** (Sun Microsystems / FreeBSD) — The gold standard for deterministic IEEE 754 math. Source of polynomial coefficients and reduction algorithms.
- **Box2D / Planck.js** — 2D physics engine conventions for Rotation2, Transform2, normalization drift.
- **gl-matrix / three.js** — JavaScript math library API patterns, out-parameter conventions.
- **Eigen / nalgebra** — C++/Rust linear algebra libraries for numerical stability benchmarks.
- **IEEE 754-2019** — Floating-point standard for edge case semantics (-0, NaN, overflow/underflow).
- **Goldberg (1991)** — "What Every Computer Scientist Should Know About Floating-Point Arithmetic."
- **Baudin & Smith (2012)** — "A Robust Complex Division in Scilab" — three-layer overflow/underflow-safe complex division.
- **Priest (2004)** — "Efficient Scaling for Minimal-Overhead Complex Division" — power-of-two scaling alternative (used by LLVM compiler-rt).
- **Kahan (1996)** — "Lecture Notes on the Status of IEEE Standard 754" — tolerance strategies.
- **Cody & Waite (1980)** — Range reduction for trigonometric functions.
- **Payne & Hanek (1983)** — High-precision modular range reduction.
- **Knuth (1997)** — TAOCP Vol.2 — LCG theory, modulo bias, compensated arithmetic.
- **O'Neill (2014)** — "PCG: A Family of Simple Fast Space-Efficient Statistically Good Algorithms for Random Number Generation."
- **Smith (1962)** — "Algorithm 116: Complex Division" (CACM) — the original overflow-safe algorithm.
- **Blackman & Vigna (2021)** — "Scrambled Linear Pseudorandom Number Generators" — xoshiro/xoroshiro family design and analysis.
- **Lemire (2019)** — "Fast Random Integer Generation in an Interval" — nearly-divisionless debiasing for bounded random integers.
- **Veltkamp (1968)** — Error-free splitting for compensated arithmetic.
- **P0811R3 (C++20)** — `std::lerp` specification requiring endpoint exactness (N4860 §26.8.4).
- **Fabian Giesen (2012)** — "A trip through the Graphics Pipeline" — lerp endpoint analysis and guard critique.

## Goals / Non-Goals

**Goals:**

- Fix all 3 CRITICAL correctness bugs (Transform2 inverse, lerpAngle, pow2)
- Fix all 8 HIGH severity issues (atan2 -0, complex division, \*Safe violations)
- Achieve full IEEE 754 compliance for -0, NaN, and Infinity across all public API functions
- Establish formal behavioral contracts for the `*Safe` function family
- Upgrade random number generation to modern statistical standards
- Close all documentation-vs-implementation gaps found in the review
- Maintain L0 determinism for all fixes touching deterministic kernels
- Maintain 90%+ test coverage with 200+ new test cases

**Non-Goals:**

- Full Payne-Hanek range reduction (would require ~1KB coefficient table; Cody-Waite improvement sufficient for physics use cases where angles are periodically normalized)
- SIMD or WebAssembly acceleration (separate initiative)
- New math types (Vector3, AABB, Circle — separate changes via `/implement-math-type`)
- Quaternion support (2D library scope)
- Breaking the layered architecture (all fixes respect dependency flow: deterministic → auxiliary → core)
- Micro-optimizing cold paths (focus performance work on documented hot paths only)

## Decisions

### D1: Complex Division — Smith's Algorithm over Baudin-Smith

**Decision:** Implement Smith's 1962 algorithm with the Baudin-Smith 2012 scaling refinement.

**Rationale:** The naive formula `denom = c*c + d*d` overflows when `|c|` or `|d|` exceeds ~1e154. Three alternatives were evaluated:

| Algorithm         | Overflow-safe | Underflow-safe | Perf overhead  |                                      Complexity                                      |
| ----------------- | :-----------: | :------------: | :------------: | :----------------------------------------------------------------------------------: |
| Naive (current)   |      No       |       No       |       0%       |                                       Trivial                                        |
| Smith 1962        |      Yes      |    Partial     | ~5-10% (est.)  |                                 Low (branch + scale)                                 |
| Baudin-Smith 2012 |      Yes      |      Yes       | ~10-15% (est.) | Moderate (three layers: pre-scaling, Smith branching, DLADIV2 careful intermediates) |
| Priest 2004       |      Yes      |      Yes       | ~10-15% (est.) |              Moderate (power-of-two scaling, used by LLVM compiler-rt)               |
| Stewart 1985      |      Yes      |      Yes       |  ~20% (est.)   |                                   High (iterative)                                   |

Smith's algorithm avoids squaring by scaling: if `|d| <= |c|`, compute `r = d/c`, `denom = c + d*r`. This eliminates the squared term entirely. The full Baudin-Smith (2012) algorithm is a three-layer design: (1) pre-scaling to avoid overflow/underflow, (2) Smith's branching for the division itself, and (3) a DLADIV2 subroutine for careful intermediate computation. Since underflow in complex division is rare in 2D physics (magnitudes are typically in [1e-6, 1e6]), the base Smith algorithm with Baudin-Smith's pre-scaling guard (layer 1 + layer 2 only) provides optimal cost/benefit. NumPy uses plain Smith without scaling (see `numpy/core/src/npymath/npy_math_complex.c.src`); we add the pre-scaling for extra safety.

**Alternatives rejected:**

- _Keep naive:_ Unacceptable — overflow at 1e154 is within reach of physics accumulations.
- _Full Baudin-Smith (all 3 layers):_ DLADIV2 adds complexity for underflow scenarios that are negligible in 2D physics.
- _Priest 2004:_ Similar quality to Baudin-Smith pre-scaling but uses power-of-two scaling which requires more code. Used by LLVM compiler-rt but no advantage for our use case.
- _Stewart 1985:_ Too complex and slow for a hot-path operation.
- _`BigFloat` library:_ Violates determinism guarantee and adds dependency.

### D2: lerpAngle Fix — Remove Intermediate Normalization

**Decision:** Change `lerpAngle` from `normalizeRadians(diff * t) + from` to `from + angleDifference(from, to) * t`.

**Rationale:** The intermediate `normalizeRadians(diff * t)` serves no mathematical purpose (the final result is not normalized regardless) and prevents correct extrapolation for `t` outside [0, 1]. Removing it:

- Enables proper extrapolation for `t` outside [0, 1] (the primary fix)
- Is simpler (one fewer function call)
- Matches Godot's `lerp_angle` formulation

**Important limitation:** The `angleDifference` PI-boundary behavior is **inherent to the `[-PI, PI)` normalization range** and is NOT fixed by this change. Specifically, `angleDifference(0, PI) = -PI` due to the half-open range, which means `lerpAngle(0, PI, 0.5) = -PI/2` under both the old and new formulations. Unity produces `+PI/2` for the same inputs because it uses a `(-PI, PI]` range convention — this is a different (equally valid) arbitrary choice at the PI boundary, not a bug in either library. The sign at exactly PI radians is fundamentally ambiguous: any half-open interval must pick one direction, and our `[-PI, PI)` convention picks `-PI`.

Rather than changing the normalization range (which would break `normalizeRadians` contract and all downstream consumers), we document this as a known boundary condition.

**Alternatives rejected:**

- _atan2(sin(diff), cos(diff)):_ Would resolve the PI-boundary ambiguity via atan2's own convention, but requires two deterministic trig calls — unacceptable performance for a lerp function called in animation loops.
- _Change to (-PI, PI]:_ Would fix this specific case but break normalizeRadians contract and downstream consumers.
- _Add special case for |diff| == PI:_ Arbitrary — there is no mathematically "correct" direction at exactly PI. Any special case would be an ad-hoc convention inconsistent with the rest of the API.

### D3: Transform2 Inverse — Document Limitation, Fix Minimally

**Decision:** Fix the position computation order AND add prominent documentation that `Transform2.inverse` is exact only for uniform scale. Do NOT change the SRT representation.

**Rationale:** The fundamental issue is that `S⁻¹ · R⁻¹ ≠ R⁻¹ · S⁻¹` for non-uniform scale, and the Transform2 representation (separate Scale, Rotation, Translation) cannot represent the true inverse of a non-uniform-scale transform without adding shear. Three options:

1. **Fix translation + document limitation** (chosen): Correct the position computation to `-(S⁻¹ · R⁻¹ · t)` and document prominently that `Transform2.inverse` is an **approximation** for non-uniform scale. The linear part also remains approximate because the SRT format computes `R⁻¹ · S⁻¹` whereas the true inverse `(R · S)⁻¹ = S⁻¹ · R⁻¹` applies operations in reverse order, and `R⁻¹ · S⁻¹ ≠ S⁻¹ · R⁻¹` for non-uniform scale — only the translation vector is corrected. Note that `inverseTransformPoint` (which applies the inverse operation directly without decomposing into SRT) is already correct and should be recommended for point transformation. This approach follows a common SRT limitation documented by engines such as DigitalRune (note: DigitalRune is a discontinued product; the reference is to the general SRT inverse limitation pattern, not a specific URL). Industry leaders (Godot, Unity, Phaser) sidestep this entirely by using full matrix inverse for their transform types.
2. **Add shear to Transform2**: Would break the SRT invariant, complicate all operations, and deviate from the 2D physics convention (Box2D has no scale at all).
3. **Use full matrix inverse**: Would be mathematically correct but would require storing the result as a matrix rather than SRT components, breaking the type's fundamental representation. This is what Godot/Unity do — they don't use SRT decomposition for inverse.
4. **Restrict to uniform scale**: Would remove a useful feature. Non-uniform scale transforms are rare in physics but common in rendering.

The position fix changes `scaledPos = S⁻¹ · t` then `R⁻¹ · scaledPos` to `rotatedPos = R⁻¹ · t` then `S⁻¹ · rotatedPos`. This is a BREAKING change for code that depends on the current (incorrect) behavior with non-uniform scale. The fix is **partial** — it corrects the translation vector but the linear part remains approximate for non-uniform scale. Documentation must clearly state this limitation and recommend `inverseTransformPoint` for exact results.

### D4: \*Safe Function Contract — Formal Invariants

**Decision:** Define and enforce three formal invariants for all `*Safe` functions:

1. **Finite-in/Finite-out:** For any finite input(s), the output MUST be finite.
2. **Fallback validity:** The fallback value MUST satisfy the same postconditions as the normal return value (e.g., within [min, max] for `sanitizeNumber`).
3. **Monotonicity preservation:** Where the underlying operation is monotonic, the safe variant MUST preserve monotonicity (no discontinuous jumps at the safety threshold).

**Rationale:** The current codebase violates all three: `logSafe(x, 1)` returns `Infinity` (#1), `sanitizeNumber(NaN, 50, 0, 10)` returns `50` outside [0,10] (#2), and `powSafe(0, -1)` returns `0` instead of throwing or returning `Infinity` (#1 and #3). Without formal invariants, each `*Safe` function makes ad-hoc decisions.

**Precedent:** The finite-in/finite-out invariant is modeled after:

- **Unity.Mathematics** `normalizesafe`, `math.rcp(x)` safe variants — explicitly guarantee finite output for finite input, using caller-specified fallback values.
- **C++20 `std::lerp`** (P0811R3) — specifies `isfinite(a) && isfinite(b)` implies `isfinite(lerp(a, b, t))` for `t ∈ [0,1]`, establishing "finite-in/finite-out" as a formal standard library contract.
- **Naming convention** draws from Rust's `saturating_*` / `checked_*` tiered arithmetic and Haskell's `safe` package for totality patterns, though these are integer-only and list-safety respectively — they do not define IEEE 754 floating-point safety contracts directly.

### D5: pow2 Fix — Conditional Subnormal Construction

**Decision:** For exponents `n < -1022`, construct subnormal floats by scaling: `pow2(-1022) * pow2(n + 1022)`.

**Rationale:** IEEE 754 subnormals cannot be constructed by setting the exponent field alone (the exponent is always 0 for subnormals; the value is encoded in the mantissa). The two-step approach:

- `pow2(-1022)` produces the smallest normal (`2.2250738585072014e-308`)
- `pow2(n + 1022)` produces a normal float (since `n + 1022` is in valid range for the inputs we receive from `exp()`)
- Their product gives the correct subnormal

This matches fdlibm's `scalbn` implementation and avoids introducing `Math.pow` (which, while deterministic for integer arguments, would be a non-deterministic kernel dependency).

### D6: atan2 Signed-Zero — Complete IEEE 754 Table 9.1 Compliance

**Decision:** Add `Object.is` checks for `-0` in **both** `x` and `y` parameters across all zero-branch cases of the deterministic `atan2`, covering all 8 signed-zero input combinations defined by IEEE 754-2019 Table 9.1.

**Rationale:** JavaScript's `===` cannot distinguish `+0` from `-0` (both return `true`), and critically, `-0 >= 0` evaluates to `true` in JavaScript. This means both `x` and `y` require explicit signed-zero detection — not just `y`. The 8 IEEE 754 atan2 signed-zero cases are:

| y   | x   | atan2(y,x) |
| --- | --- | ---------- |
| +0  | +0  | +0         |
| +0  | -0  | +PI        |
| -0  | +0  | -0         |
| -0  | -0  | -PI        |
| +0  | x>0 | +0         |
| -0  | x>0 | -0         |
| +0  | x<0 | +PI        |
| -0  | x<0 | -PI        |

Two detection approaches:

- `Object.is(y, -0)`: Clear, no allocation, O(1). Slight performance cost from the function call.
- `1/y === -Infinity`: Exploits IEEE 754 division semantics. Faster (no function call) but obscure.

Chose `Object.is` for clarity. The `atan2` function is not in the hot path (rotation operations use `cos`/`sin` directly), so the minor performance cost is acceptable. This aligns with how Node.js internals and V8 handle -0 detection. fdlibm's reference implementation uses sign-bit extraction via `(hy>>31)&1|(hx>>30)&2` to index into a lookup table — we achieve the same semantics with `Object.is` which is more idiomatic in JavaScript.

### D7: Random Source — xoshiro128++ over PCG

**Decision:** Replace the Park-Miller LCG with xoshiro128++ for `SeededRandomSource`. Use SplitMix32 for seed expansion (initializing 128-bit state from a single 32-bit seed). Use Lemire's (2019) nearly-divisionless algorithm for `nextInt` to eliminate modulo bias.

**Rationale:**

| Generator                 | Period      | State   | Speed     | Quality (TestU01)          |
| ------------------------- | ----------- | ------- | --------- | -------------------------- |
| Park-Miller LCG (current) | 2^31 - 2    | 32-bit  | Fast      | Fails SmallCrush           |
| xorshift128+              | 2^128 - 1   | 128-bit | Fastest   | Fails BigCrush             |
| xoshiro128++              | 2^128 - 1   | 128-bit | Very fast | Passes BigCrush (standard) |
| PCG-XSH-RR                | 2^64        | 64-bit  | Fast      | Passes BigCrush            |
| Mersenne Twister          | 2^19937 - 1 | 2.5KB   | Moderate  | Passes BigCrush            |

xoshiro128++ provides the best balance: passes the standard BigCrush battery (Blackman & Vigna 2021, Table 2; see also L'Ecuyer & Simard 2007 for the TestU01 framework and O'Neill 2014, Table 4 for comparative generator quality), has 128-bit state for long periods, and is trivially implementable in ~20 lines of JavaScript with only 32-bit operations via `Math.imul` and bitwise ops (deterministic across platforms per ECMAScript spec).

**Known weaknesses of xoshiro128++ (documented for transparency):**

- **Low-bit linear complexity:** The lowest bits have lower linear complexity than higher bits. For applications requiring uniformity in low bits, use the output's upper bits. This is mitigated by the `++` scrambler but not eliminated.
- **Zeroland repeats:** If all 4 state words have zeros in the same bit positions, those bit positions remain zero for several iterations. The SplitMix32 seed expansion prevents all-zero initialization (which would be a fixed point), but near-zero states can still produce short runs of low-entropy output.

PCG-XSH-RR is an excellent alternative — it CAN be implemented deterministically in JavaScript using `Math.imul` for 32-bit multiplication (contrary to earlier analysis, `BigInt` is NOT required). However, implementing the full 64-bit state update requires decomposing into two 32-bit halves with manual carry propagation, adding ~30 lines of complexity for marginal quality improvement over xoshiro128++ in our use case (game/physics, not cryptography).

**Alternatives rejected:**

- _Keep LCG:_ Fails SmallCrush — visible patterns in particle systems and Monte Carlo integration.
- _PCG:_ Deterministically implementable but more complex (64-bit state manipulation via 32-bit halves). Quality advantage (passes PractRand) is unnecessary for game/physics use.
- _Mersenne Twister:_ Overkill state size (2.5KB), slower initialization, known to fail some BigCrush sub-tests.
- _crypto.getRandomValues:_ Non-deterministic, not seedable.

### D8: inverseLerp Threshold — Separate Division Safety from Comparison Epsilon

**Decision:** Use `denominator === 0` for the strict `inverseLerp` variant and `Math.abs(denominator) < Number.EPSILON` (~2.2e-16) for `inverseLerpSafe`.

**Rationale:** The current threshold uses `EPSILON = 1e-10`, which is a _comparison_ epsilon designed for geometric near-equality testing. Using it as a _division safety_ threshold rejects valid computations: `inverseLerp(0, 1e-10, 5e-11)` throws even though the result `0.5` is perfectly representable. The correct threshold for division safety is much smaller — `Number.EPSILON` (~2.2e-16) represents the smallest value where `1 + x !== 1`, which is a reasonable floor for meaningful division results. For values below `Number.EPSILON`, the quotient loses all significant digits.

This follows the tolerance classification established in the `numerical-foundations` spec: geometric tolerance (EPSILON) vs numerical safety tolerance (Number.EPSILON or MIN_SAFE_DIVISOR).

### D9: Lerp Endpoint Exactness — Strict t===1 Guard

**Decision:** Add `if (t === 1) return b;` guard to `lerp`. For `lerpClamped`, use `if (t >= 1) return b; if (t <= 0) return a;`.

**Rationale:** The formula `a + (b - a) * t` does not guarantee `lerp(a, b, 1) === b` due to floating-point rounding (specifically, `(b - a) * 1.0` can round differently than `b - a` in intermediate precision). The C++20 `std::lerp` standard (P0811R3, N4860 §26.8.4) explicitly requires endpoint exactness.

**Critical distinction between `lerp` and `lerpClamped`:**

- **`lerp`**: Supports extrapolation (`t` outside [0, 1]). Only `t === 1` needs a guard — the `t === 0` case is naturally exact since `a + (b - a) * 0 = a + 0 = a` (IEEE 754 guarantees `x * 0 = 0` for finite x, and `a + 0 = a`). Using `t <= 0` or `t >= 1` would break extrapolation.
- **`lerpClamped`**: Does NOT support extrapolation. Use `if (t >= 1) return b; if (t <= 0) return a;` to both guarantee endpoints and enforce clamping.

**Why no `t === 0` guard for `lerp`:** The formula is naturally exact at `t = 0`. `(b - a) * 0` is exactly `0` by IEEE 754 §6.3 (assuming finite operands), and `a + 0` is exactly `a`. This was confirmed by Fabian Giesen's analysis and is consistent with the C++20 specification which only mandates the `t == 1` guard for the `a + (b-a)*t` form.

**Industry comparison:**

- C++20 `std::lerp`: Uses `if (t == 1) return b;` (strict equality) — NOT `t >= 1`. Also supports extrapolation.
- Luau (Roblox): Uses `if (t == 1) return b;` with the same rationale.
- Unity `Mathf.Lerp`: Clamps `t` to [0,1] first — no endpoint guard needed since clamping handles it. This is equivalent to our `lerpClamped`.
- Godot `lerpf`: Bare formula `a + (b - a) * t` with no guards — does NOT guarantee endpoint exactness.
- three.js `MathUtils.lerp`: Uses `(1 - t) * x + t * y` which is naturally exact at both endpoints (at `t=0`: `1*x + 0*y = x`; at `t=1`: `0*x + 1*y = y`).

## Risks / Trade-offs

### [Breaking Changes] → Semver Minor Bump (v0.7.0)

Four changes alter return values: Transform2.inverse (non-uniform scale), compare(NaN, x), powSafe(0, -n), complex division (boundary values). These are gated behind a single semver minor release with migration notes in CHANGELOG. Risk: downstream code that depends on the current (incorrect) behavior breaks silently. Mitigation: all breaking changes fix objectively wrong results — no correct use case exists for the old behavior.

### [Deterministic Kernel Changes] → Cross-Platform Regression

Modifying pow2, atan2, and range reduction could produce different results on different engines if the implementation is not purely software-computed. Mitigation: all changes use only IEEE 754 basic operations (+, -, \*, /, comparisons) and integer bit manipulation — no engine-specific intrinsics. Property-based tests with fast-check verify bit-exactness across 10,000+ random inputs. The `config.useNativeMath = true` escape hatch remains available.

### [Performance Regression in Complex Division] → Benchmark Gate

Smith's algorithm adds a branch and a division to every complex division. Estimated ~10% overhead (to be confirmed via benchmarking). Mitigation: benchmark before/after using the existing performance measurement utilities. Complex division is not in the documented hot path list (hot paths are: add, subtract, scale, magnitude, dot, normalize, rotation apply, matrix-vector multiply, transform compose, distance). If benchmarks show >15% regression, consider a `divideUnchecked` fast path that retains the naive formula for known-safe magnitude ranges.

### [xoshiro128++ State Size] → Memory Increase

xoshiro128++ uses 128 bits of state vs 32 bits for Park-Miller. This quadruples per-instance memory from 4 bytes to 16 bytes. Mitigation: `SeededRandomSource` instances are rarely created in bulk; the 12-byte increase is negligible. The `MathRandomSource` wrapper (which delegates to `Math.random()`) is unaffected.

### [Scope Creep] → Strict Priority Ordering

With 80+ issues, there is risk of scope creep or incomplete implementation. Mitigation: tasks are strictly ordered P0 → P3. Each priority level is independently shippable. P0 (3 critical fixes) is the minimum viable change. P1 adds numerical robustness. P2 adds completeness. P3 adds polish.

### [lerp Endpoint Guard] → Determinism Delta

Adding `if (t === 1) return b` changes the return value for `lerp(a, b, 1)` from `a + (b-a)*1` (which may differ from `b` by a ULP) to exactly `b`. This is a technically breaking change in output bits. Mitigation: the new behavior is strictly more correct (matches C++20 std::lerp P0811R3), and the difference is at most 1 ULP — within any reasonable tolerance. The `t === 0` case needs NO guard since `a + (b-a)*0` is already exactly `a` by IEEE 754 arithmetic rules. Document in CHANGELOG.

## Open Questions

1. **angleDifference anti-symmetry**: Should `angleDifference` be changed to use `atan2(sin(to-from), cos(to-from))` for perfect continuity, or is documenting the [-PI, PI) boundary behavior sufficient? The atan2 approach adds two deterministic trig calls per invocation.

2. **Interval.divide threshold**: Should `Interval.divide` use the same `Number.EPSILON` threshold as `inverseLerp`, or a different one? Interval arithmetic has different precision requirements than scalar interpolation.

3. **Matrix3.isOrthogonal scope**: Should we add `isLinearPartOrthogonal` (checks only upper-left 2x2) alongside `isOrthogonal` (full 3x3), or rename the existing method to clarify its semantics?

4. **xoshiro128++ seeding**: Should the default seed strategy use `performance.now()` (sub-millisecond) instead of `Date.now()` (millisecond), or should we require explicit seeds and remove the default entirely?

5. **assertRange NaN**: Should `assertRange` reject NaN (add explicit check), or is NaN pass-through the correct behavior since NaN is "not in any range" by IEEE 754 comparison semantics?
