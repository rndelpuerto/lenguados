# Phase 1 - Audit: auxiliary/scalar/ (Tasks 2.1-2.16)

## 2.1 Inventory: constants.ts

**File:** `src/auxiliary/scalar/constants.ts` (317 lines)

### Constants (21 total)

| Constant               | Value        | Category       | Source                  |
| ---------------------- | ------------ | -------------- | ----------------------- |
| EPSILON                | 1e-10        | Tolerance      | Custom choice           |
| EPSILON_SQUARED        | 1e-20        | Tolerance      | Derived                 |
| ITERATIVE_TOLERANCE    | 1e-6         | Tolerance      | Custom choice           |
| MAX_SAFE_INTEGER_F64   | 2^53-1       | Numeric Limits | Number.MAX_SAFE_INTEGER |
| PI                     | ~3.14159     | Angular        | Math.PI                 |
| TAU                    | ~6.28318     | Angular        | 2 \* Math.PI            |
| HALF_PI                | ~1.57080     | Angular        | Math.PI / 2             |
| QUARTER_PI             | ~0.78540     | Angular        | Math.PI / 4             |
| ANGLE_EPSILON          | 1e-12        | Angular        | Custom choice           |
| DEG_TO_RAD             | ~0.01745     | Conversion     | Math.PI / 180           |
| RAD_TO_DEG             | ~57.29578    | Conversion     | 180 / Math.PI           |
| RAD_TO_TURN            | ~0.15915     | Conversion     | 1 / TAU                 |
| TURN_TO_RAD            | ~6.28318     | Conversion     | TAU                     |
| SQRT_2                 | ~1.41421     | Mathematical   | Math.SQRT2              |
| SQRT_HALF              | ~0.70711     | Mathematical   | Math.SQRT1_2            |
| LN_2                   | ~0.69315     | Mathematical   | Math.LN2                |
| E                      | ~2.71828     | Mathematical   | Math.E                  |
| GOLDEN_RATIO           | ~1.61803     | Mathematical   | (1+sqrt(5))/2           |
| GOLDEN_RATIO_CONJUGATE | ~0.61803     | Mathematical   | (sqrt(5)-1)/2           |
| SMALLEST_NORMAL        | 2.225e-308   | Numeric Limits | IEEE 754                |
| Constants              | (bag object) | Collection     | All above               |

All IEEE 754 double precision values verified. Math.PI, Math.SQRT2, etc. use the exact IEEE 754 representations built into the JS engine.

---

## 2.2 EPSILON (1e-10) Evaluation

### Comparison with Other Libraries

| Library   | Default Epsilon                                             | Context              |
| --------- | ----------------------------------------------------------- | -------------------- |
| gl-matrix | 1e-6 (EPSILON)                                              | General 3D math      |
| three.js  | No global epsilon; per-op tolerance                         | 3D rendering         |
| Box2D     | 1.192092896e-07 (FLT_EPSILON)                               | 2D physics (float32) |
| Rapier    | 1e-5 (default)                                              | 2D/3D physics        |
| Eigen     | 1e-12 (NumTraits::dummy_precision for double)               | Scientific computing |
| Unity     | 1e-5 (Mathf.Epsilon is ~1.4e-45 but unused for comparisons) | Game engine          |
| GLSL      | No built-in epsilon                                         | Shaders (float32)    |

### Analysis

**EPSILON = 1e-10** is:

- More precise than gl-matrix (1e-6) and game engines (~1e-5)
- Less precise than Eigen (1e-12) and machine epsilon (~2.22e-16)
- NOT aligned with any standard reference value

**Higham's error analysis** (Chapter 1): For double precision, unit roundoff u = 2^-53 ~ 1.11e-16. The rounding error of a single operation is bounded by u. For a chain of n operations, error can accumulate to ~n*u (forward error) or sqrt(n)*u (probabilistic).

For a typical 2D math operation chain (5-20 operations): error ~20\*u ~ 2.2e-15. An epsilon of 1e-10 provides ~5 orders of magnitude margin. This is reasonable for a physics library that values robustness over maximal precision.

**Verdict: EPSILON = 1e-10 is justified** for a 2D physics library. It provides good margin for typical operation chains while being precise enough for geometric comparisons. The choice is between gl-matrix territory (1e-6, too loose for accumulated math) and Eigen territory (1e-12, too tight for physics).

---

## 2.3 ANGLE_EPSILON (1e-12)

**Context:** Used for "near-zero angle comparisons" per docs, specifically in deterministic kernels.

**fdlibm kernel precision:** The polynomial approximations in sin/cos kernels have max error ~1 ULP (~2.2e-16 for values near 1). An angle epsilon of 1e-12 is ~4 orders above this.

**Where it's actually used:** Searching the codebase, ANGLE_EPSILON is defined but NOT imported by any other module. It's only in the Constants bag object. This means it's exported but unused.

**Verdict: ⚠️** Defined but unused. If it's meant for angular comparisons, it should be used by anglesNearEqual (which uses EPSILON instead). Either use it consistently or remove it.

---

## 2.4 MIN_SAFE_DIVISOR, ITERATIVE_TOLERANCE, SMALLEST_NORMAL

### MIN_SAFE_DIVISOR (= EPSILON = 1e-10)

Defined in `numeric/safety.ts`. Used as threshold for divideSafe/reciprocalSafe. Making it equal to EPSILON provides consistency with isNearZero checks.

**IEEE 754 consideration:** The actual smallest safe divisor for double precision is much smaller (denormals go to ~5e-324). 1e-10 is conservative but safe — prevents results from becoming astronomically large even if the divisor is technically nonzero.

**Verdict: ✅** Reasonable choice. Consistent with EPSILON.

### ITERATIVE_TOLERANCE (1e-6)

Used for convergence criteria in iterative algorithms (constraint solving).

**Reference:** In numerical analysis, iterative convergence tolerance should be looser than comparison epsilon to avoid excessive iterations. 1e-6 vs 1e-10 gives 4 orders of margin. Standard practice.

**Verdict: ✅** Well-chosen. However, it's NOT used anywhere in the current codebase. Future-facing constant.

### SMALLEST_NORMAL (2.2250738585072014e-308 = 2^-1022)

Correct per IEEE 754-2019 Section 3.4. This is the boundary between normal and subnormal numbers.

**Verdict: ✅** Correct. Used by isDenormal guard.

---

## 2.5 GOLDEN_RATIO, GOLDEN_RATIO_CONJUGATE

**Codebase search:** Neither GOLDEN_RATIO nor GOLDEN_RATIO_CONJUGATE is imported by any module.

They appear ONLY in:

1. Their definitions in constants.ts
2. The Constants bag object

**Assessment:** These are utility constants with no consumers. They're not math-core for a 2D physics library. Golden ratio is used in:

- Fibonacci hashing (not relevant to math2d)
- Aesthetic proportions (UI, not math primitives)
- Voronoi/Fibonacci sphere sampling (3D, not relevant)

**Verdict: ⚠️** No consumers. Consider removing from the core constants. If needed in the future, they belong in a utility or higher-layer package.

---

## 2.6 Inventory: arithmetic.ts

**File:** `src/auxiliary/scalar/arithmetic.ts` (419 lines)

### Functions (19 total)

| Function                         | Triality    | Delegates To    | Category |
| -------------------------------- | ----------- | --------------- | -------- |
| clamp(v, min, max)               | No (single) | -               | Core     |
| sign(v)                          | No (single) | -               | Core     |
| saturate(v)                      | No (single) | clamp(v, 0, 1)  | Facade   |
| saturateSigned(v)                | No (single) | clamp(v, -1, 1) | Facade   |
| remap(v, iMin, iMax, oMin, oMax) | Strict      | -               | Core     |
| remapSafe(...)                   | Safe        | -               | Core     |
| loop(v, min, max)                | Strict      | -               | Core     |
| loopSafe(v, min, max)            | Safe        | -               | Core     |
| loopUnchecked(v, min, max)       | Unchecked   | -               | Core     |
| pingPong(v, min, max)            | Strict      | -               | Core     |
| pingPongSafe(v, min, max)        | Safe        | -               | Core     |
| pingPongUnchecked(v, min, max)   | Unchecked   | -               | Core     |
| step(edge, x)                    | No (single) | -               | Core     |
| mod(div, divisor)                | Strict      | -               | Core     |
| modSafe(div, divisor)            | Safe        | -               | Core     |
| modUnchecked(div, divisor)       | Unchecked   | -               | Core     |
| floorDivide(v, divisor)          | No (single) | Math.floor      | Core     |

Triality coverage: loop (3), pingPong (3), mod (3) = 9/19 have full triality.
Missing triality: remap (2/3 - no Unchecked), clamp (1/3), sign (1/3), step (1/3), floorDivide (1/3).

---

## 2.7 Scalar Arithmetic vs External References

### GLSL Spec Comparison

| GLSL                  | lenguados                   | Match                                                          |
| --------------------- | --------------------------- | -------------------------------------------------------------- |
| clamp(x, min, max)    | clamp(value, min, max)      | ✅ Same semantics                                              |
| mix(a, b, t)          | lerp(a, b, t)               | ✅ (in interpolation.ts)                                       |
| step(edge, x)         | step(edge, x)               | ✅ Same signature and semantics                                |
| smoothstep(e0, e1, x) | smoothStep(edge0, edge1, x) | ✅ Same formula: t*t*(3-2t)                                    |
| mod(x, y)             | mod(dividend, divisor)      | ⚠️ GLSL mod can return negative; lenguados mod always positive |
| sign(x)               | sign(value)                 | ⚠️ GLSL returns NaN for NaN; lenguados returns 0               |

### three.js MathUtils Comparison

| three.js                     | lenguados                        | Match                          |
| ---------------------------- | -------------------------------- | ------------------------------ |
| clamp(v, min, max)           | clamp(v, min, max)               | ✅                             |
| mapLinear(x, a1, a2, b1, b2) | remap(v, iMin, iMax, oMin, oMax) | ✅ Same concept                |
| inverseLerp(x, y, v)         | inverseLerp(a, b, v)             | ✅ (in interpolation.ts)       |
| pingpong(x, length)          | pingPong(v, 0, length)           | ⚠️ three.js always starts at 0 |
| euclideanModulo(n, m)        | mod(n, m)                        | ✅ Same: always positive       |

### gl-matrix Comparison

gl-matrix doesn't have standalone scalar functions. It operates directly on vec/mat types. No direct comparison applicable.

---

## 2.8 Internal Composition of arithmetic.ts

### Delegation Chain

```
saturate(v) → clamp(v, 0, 1)
saturateSigned(v) → clamp(v, -1, 1)
floorDivide(v, d) → Math.floor(v / d)
```

All other functions are self-contained primitives. No deep delegation chains.

**Overhead assessment:**

- saturate→clamp: 1 function call overhead. Inlineable by V8 TurboFan. Acceptable.
- saturateSigned→clamp: Same as above.

**No problematic facades in arithmetic.ts.**

---

## 2.9 Comparison Module (comparison.ts)

### Functions (7)

| Function                  | Purpose               | Formula                                |
| ------------------------- | --------------------- | -------------------------------------- |
| nearEquals(a, b, eps)     | Absolute tolerance    | \|a-b\| <= eps                         |
| isNearZero(v, eps)        | Zero test             | \|v\| <= eps                           |
| isNearOne(v, eps)         | One test              | \|v-1\| <= eps                         |
| relativeEquals(a, b, eps) | Relative tolerance    | \|a-b\| <= eps \* max(1, \|a\|, \|b\|) |
| lessThan(a, b, eps)       | Tolerant less-than    | a < b - eps                            |
| greaterThan(a, b, eps)    | Tolerant greater-than | a > b + eps                            |
| inRange(v, min, max, eps) | Range test            | v >= min-eps && v <= max+eps           |
| compare(a, b, eps)        | Three-way             | -1, 0, 1                               |

### Analysis

- **nearEquals:** Correct absolute tolerance pattern. Fast-path for identical values. NaN handling correct.
- **relativeEquals:** Uses `max(1, |a|, |b|)` as scale factor. The `1` floor prevents division by zero and handles near-zero values. This matches Eigen's `isApprox` pattern (which uses `max(|a|, |b|)` but with a separate absolute threshold).
- **compare:** Returns 0 for NaN (stable sorting). This differs from IEEE 754's unordered NaN semantics but is pragmatic for sorting.

### Comparison with Eigen's isApprox

Eigen: `|a-b| <= eps * max(|a|, |b|)` (no floor of 1)
lenguados: `|a-b| <= eps * max(1, |a|, |b|)`

The floor of 1 in lenguados is a design choice: when both values are near zero (e.g., 1e-15 and 2e-15), Eigen's isApprox would use a very tiny threshold and say they're different, while lenguados's relativeEquals with the floor=1 would use EPSILON directly. This is more useful for physics where near-zero values should be treated as "both approximately zero."

**Verdict: ✅** Good tolerance strategy. The relativeEquals floor-of-1 design is well-suited for physics.

---

## 2.10 Comparison vs External References

| Pattern           | lenguados      | Eigen              | nalgebra    | three.js |
| ----------------- | -------------- | ------------------ | ----------- | -------- |
| Absolute eps      | nearEquals     | isApprox (mode)    | abs_diff_eq | -        |
| Relative eps      | relativeEquals | isApprox (default) | relative_eq | -        |
| Near zero         | isNearZero     | isZero (eps)       | -           | -        |
| Near one          | isNearOne      | isIdentity (eps)   | -           | -        |
| Three-way compare | compare        | -                  | -           | -        |

**Notable:** lenguados has both absolute AND relative comparison, which is more complete than most math libraries. The `compare` function is uncommon but useful for sorting.

---

## 2.11 Interpolation Module (interpolation.ts)

### Functions (8)

| Function                      | Triality  | Formula                      |
| ----------------------------- | --------- | ---------------------------- |
| lerp(a, b, t)                 | -         | a + (b-a)\*t                 |
| lerpClamped(a, b, t)          | -         | lerp with t clamped to [0,1] |
| inverseLerp(a, b, v)          | Strict    | (v-a)/(b-a)                  |
| inverseLerpSafe(a, b, v)      | Safe      | Returns 0 if degenerate      |
| inverseLerpUnchecked(a, b, v) | Unchecked | No validation                |
| smoothStep(e0, e1, x)         | -         | t*t*(3-2\*t)                 |
| smootherStep(e0, e1, x)       | -         | t*t*t*(t*(6t-15)+10)         |

### Dependencies

- lerp: none (standalone)
- lerpClamped: inline clamp (not using clamp function)
- inverseLerp: uses isNearZero from comparison.ts
- smoothStep: uses saturate from arithmetic.ts
- smootherStep: uses saturate from arithmetic.ts

---

## 2.12 Interpolation vs External References

### GLSL mix/smoothstep

- **lerp** matches GLSL `mix(a, b, t) = a + (b-a)*t` exactly
- **smoothStep** matches GLSL `smoothstep(edge0, edge1, x)` formula exactly: `t*t*(3-2*t)` where t = clamp((x-edge0)/(edge1-edge0), 0, 1)

**Note:** The implementation handles edge0 == edge1 (degenerate case) by falling back to step function. GLSL spec says "results are undefined if edge0 >= edge1". lenguados is MORE robust.

### three.js lerp

three.js uses `a + (b-a)*t` — identical.

### Unity Mathf.Lerp

Unity clamps t to [0,1] by default. lenguados's `lerp` doesn't clamp (allows extrapolation); `lerpClamped` matches Unity behavior.

### Precision concern with lerp formula

The formula `a + (b-a)*t` has known precision issues:

- When a and b are very large and close together, `b-a` loses precision
- When t is very close to 1, the result may not exactly equal b

The `lerpSafe` in numeric/safety.ts addresses this with a two-branch approach. The standard `lerp` keeps the simple formula for performance.

**Verdict: ✅** Standard, correct implementations matching GLSL/three.js conventions.

---

## 2.13 Consumer Map for scalar/

### Most consumed functions

| Function              | Consumer Count | Key Consumers                                          |
| --------------------- | -------------- | ------------------------------------------------------ |
| EPSILON               | 10+            | All core types, comparison.ts, safety.ts, angle/ops    |
| PI                    | 5+             | normalization, conversion, deterministic               |
| TAU                   | 5+             | normalization, conversion, deterministic, random       |
| clamp                 | 3              | safety.ts (via import), saturate, saturateSigned       |
| saturate              | 5              | rotation2, transform2, interval, complex, angle/interp |
| lerp                  | 5              | vector2, complex, interval, matrix2, matrix3, random   |
| smoothStep            | 4              | rotation2, transform2, interval, complex               |
| nearEquals            | 4              | vector2, complex, matrix2, matrix3, wrapping           |
| isNearZero            | 3              | interpolation, wrapping, rotation2                     |
| loop                  | 4              | all 4 normalization functions in angle/                |
| DEG_TO_RAD/RAD_TO_DEG | 3              | conversion.ts, transform2, parse                       |

### Building Blocks (used by 3+ consumers)

1. **EPSILON** - Foundation constant, cascade risk if changed
2. **clamp** - Base for saturate/saturateSigned, used by safety.ts
3. **saturate** - Used by 5 core types for interpolation clamping
4. **lerp** - Used by all core types for interpolation methods
5. **smoothStep** - Used by 4 core types for smooth interpolation
6. **nearEquals** - Used by all core types for equality testing
7. **loop** - Foundation for all 4 normalization functions

---

## 2.14 Diagnostic by Entity

### constants.ts

| Entity                       | Verdict     | Justification                                                                     |
| ---------------------------- | ----------- | --------------------------------------------------------------------------------- |
| EPSILON (1e-10)              | ✅ Keep     | Well-balanced for 2D physics. Between gl-matrix (1e-6) and Eigen (1e-12)          |
| EPSILON_SQUARED              | ✅ Keep     | Consistent derived constant for area comparisons                                  |
| ITERATIVE_TOLERANCE (1e-6)   | ⚠️ Redefine | No current consumers. Keep but document as future-facing                          |
| MAX_SAFE_INTEGER_F64         | ✅ Keep     | Alias for Number.MAX_SAFE_INTEGER. Documenting intent                             |
| PI, TAU, HALF_PI, QUARTER_PI | ✅ Keep     | Standard angular constants from Math.\*                                           |
| ANGLE_EPSILON (1e-12)        | ⚠️ Redefine | Defined but unused by any module. Either integrate into anglesNearEqual or remove |
| DEG_TO_RAD, RAD_TO_DEG       | ✅ Keep     | Standard conversion factors                                                       |
| RAD_TO_TURN, TURN_TO_RAD     | ✅ Keep     | Complete unit coverage                                                            |
| SQRT_2, SQRT_HALF            | ✅ Keep     | Frequently useful in 2D math                                                      |
| LN_2                         | ✅ Keep     | Used by rounding.ts (roundToPowerOfTwo)                                           |
| E                            | ✅ Keep     | Standard mathematical constant                                                    |
| GOLDEN_RATIO                 | ⚠️ Redefine | Zero consumers in codebase. Not math-core for physics                             |
| GOLDEN_RATIO_CONJUGATE       | ⚠️ Redefine | Zero consumers. Remove or relocate                                                |
| SMALLEST_NORMAL              | ✅ Keep     | Correct IEEE 754 value. Used by isDenormal                                        |
| Constants (bag)              | ✅ Keep     | Convenient unified access                                                         |

### arithmetic.ts

| Entity            | Verdict     | Justification                                                        |
| ----------------- | ----------- | -------------------------------------------------------------------- |
| clamp             | ✅ Keep     | Building block. Matches GLSL. Correct NaN propagation                |
| sign              | ⚠️ Redefine | Returns 0 for NaN (differs from Math.sign/GLSL). Document explicitly |
| saturate          | ✅ Keep     | Clean facade over clamp. Matches GLSL convention                     |
| saturateSigned    | ✅ Keep     | Useful for normalized directions                                     |
| remap             | ✅ Keep     | Standard linear mapping                                              |
| remapSafe         | ✅ Keep     | Safe variant. Missing Unchecked for full triality                    |
| loop              | ✅ Keep     | Building block for angle normalization. Critical primitive           |
| loopSafe          | ✅ Keep     |                                                                      |
| loopUnchecked     | ✅ Keep     |                                                                      |
| pingPong          | ✅ Keep     | Useful for animation/oscillation                                     |
| pingPongSafe      | ✅ Keep     |                                                                      |
| pingPongUnchecked | ✅ Keep     |                                                                      |
| step              | ✅ Keep     | Matches GLSL step exactly                                            |
| mod               | ✅ Keep     | Euclidean modulo. More useful than JS %                              |
| modSafe           | ✅ Keep     |                                                                      |
| modUnchecked      | ✅ Keep     |                                                                      |
| floorDivide       | ✅ Keep     | Useful for grid calculations                                         |

### comparison.ts

| Entity         | Verdict | Justification                              |
| -------------- | ------- | ------------------------------------------ |
| nearEquals     | ✅ Keep | Building block. Good NaN/Infinity handling |
| isNearZero     | ✅ Keep | Widely used predicate                      |
| isNearOne      | ✅ Keep | Useful for rotation/unit checks            |
| relativeEquals | ✅ Keep | Superior to pure absolute for large values |
| lessThan       | ✅ Keep | Tolerant comparison                        |
| greaterThan    | ✅ Keep | Tolerant comparison                        |
| inRange        | ✅ Keep | Tolerant range check                       |
| compare        | ✅ Keep | Useful for sorting. NaN→0 is pragmatic     |

### interpolation.ts

| Entity               | Verdict | Justification                    |
| -------------------- | ------- | -------------------------------- |
| lerp                 | ✅ Keep | Building block. Standard formula |
| lerpClamped          | ✅ Keep | Unity-style clamped lerp         |
| inverseLerp          | ✅ Keep | With triality                    |
| inverseLerpSafe      | ✅ Keep |                                  |
| inverseLerpUnchecked | ✅ Keep |                                  |
| smoothStep           | ✅ Keep | Matches GLSL spec                |
| smootherStep         | ✅ Keep | Ken Perlin's improvement         |

**Summary:** 35 ✅ Keep, 5 ⚠️ Redefine, 0 Remove, 0 Add

---

## 2.15 Tolerance Category Classification

| Category      | Functions                                                                                  | Epsilon Used                       |
| ------------- | ------------------------------------------------------------------------------------------ | ---------------------------------- |
| **Geometric** | nearEquals, isNearZero, isNearOne, inRange, lessThan, greaterThan, compare, relativeEquals | EPSILON (1e-10)                    |
| **Angular**   | anglesNearEqual (in angle/ops)                                                             | EPSILON (1e-10), NOT ANGLE_EPSILON |
| **Safety**    | divideSafe, reciprocalSafe, inverseLerp (degenerate check)                                 | MIN_SAFE_DIVISOR = EPSILON         |
| **Iterative** | (none currently)                                                                           | ITERATIVE_TOLERANCE (1e-6)         |

**Observation:** ANGLE_EPSILON exists but is unused. All angular comparisons use EPSILON. This is either a forgotten constant or an intentional simplification.

---

## 2.16 index.ts

Clean barrel export: `export * from './arithmetic'; export * from './comparison'; export * from './interpolation'; export * from './constants';`

No selective re-exports. Everything is public. No filtering.

**Verdict: ✅** Clean.
