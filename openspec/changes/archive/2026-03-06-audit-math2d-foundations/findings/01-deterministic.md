# Phase 1 - Audit: deterministic/ (Tasks 1.1-1.11)

## 1.1 Inventory of deterministic-kernels.ts

**File:** `src/deterministic/deterministic-kernels.ts` (992 lines, single file module)

### Exported Functions (18)

| Function      | Category     | Safe Variant  | Lines            |
| ------------- | ------------ | ------------- | ---------------- |
| `sqrt(x)`     | Arithmetic   | `sqrtSafe(x)` | 183-230, 241-243 |
| `hypot(x, y)` | Arithmetic   | -             | 273-308          |
| `sin(x)`      | Trigonometry | -             | 399-426          |
| `cos(x)`      | Trigonometry | -             | 448-475          |
| `sinCos(x)`   | Trigonometry | -             | 486-515          |
| `tan(x)`      | Trigonometry | -             | 526-530          |
| `atan(x)`     | Trigonometry | -             | 568-605          |
| `atan2(y, x)` | Trigonometry | -             | 629-665          |
| `acos(x)`     | Trigonometry | `acosSafe(x)` | 676-681, 708-712 |
| `asin(x)`     | Trigonometry | `asinSafe(x)` | 692-697, 723-727 |
| `log(x)`      | Arithmetic   | `logSafe(x)`  | 755-797, 816-819 |
| `exp(x)`      | Arithmetic   | `expSafe(x)`  | 843-879, 890-895 |
| `pow(b, e)`   | Arithmetic   | -             | 912-940          |

### Internal Functions (4)

| Function         | Purpose                                           | Lines   |
| ---------------- | ------------------------------------------------- | ------- |
| `reduceAngle(x)` | Range reduction to [-PI/4, PI/4] with octant info | 321-347 |
| `kernelSin(x)`   | Sine polynomial for x in [-PI/4, PI/4]            | 357-362 |
| `kernelCos(x)`   | Cosine polynomial for x in [-PI/4, PI/4]          | 372-377 |
| `kernelAtan(x)`  | Arctangent polynomial for x in [0, 7/16]          | 540-557 |

### Polynomial Coefficient Sets (5)

| Set      | Source          | Count | Used By    |
| -------- | --------------- | ----- | ---------- |
| S1-S6    | fdlibm k_sin.c  | 6     | kernelSin  |
| C1-C6    | fdlibm k_cos.c  | 6     | kernelCos  |
| AT0-AT10 | fdlibm s_atan.c | 11    | kernelAtan |
| Lg1-Lg7  | fdlibm e_log.c  | 7     | log        |
| E1-E5    | fdlibm e_exp.c  | 5     | exp        |

### Other Exports

- `config` object with `useNativeMath: boolean` toggle (default: false)
- `DeterministicKernels` const object aggregating all 18 functions
- Re-exports `SinCos` type from `auxiliary/angle/operations`

### Infrastructure

- Shared `ArrayBuffer(8)` + `DataView` for IEEE 754 bit manipulation (sqrt, log, exp)
- Imports `HALF_PI, PI, QUARTER_PI, TAU` from `auxiliary/scalar/constants`

---

## 1.2 sin/cos Coefficients vs fdlibm C Source

### Sine (k_sin.c)

| Coeff | Value                      | Hex Annotation     | fdlibm Match |
| ----- | -------------------------- | ------------------ | ------------ |
| S1    | -1.66666666666666324348e-1 | 0xBFC5555555555549 | YES          |
| S2    | 8.33333333332248946124e-3  | 0x3F8111111110F8A6 | YES          |
| S3    | -1.98412698298579493134e-4 | 0xBF2A01A019C161D5 | YES          |
| S4    | 2.75573137070700676789e-6  | 0x3EC71DE357B1FE7D | YES          |
| S5    | -2.50507602534068634195e-8 | 0xBE5AE5E68A2B9CEB | YES          |
| S6    | 1.58969099521155010221e-10 | 0x3DE5D93A5ACFD57C | YES          |

### Cosine (k_cos.c)

| Coeff | Value                       | Hex Annotation     | fdlibm Match |
| ----- | --------------------------- | ------------------ | ------------ |
| C1    | 4.16666666666666019037e-2   | 0x3FA555555555554C | YES          |
| C2    | -1.38888888888741095749e-3  | 0xBF56C16C16C15177 | YES          |
| C3    | 2.48015872894767294178e-5   | 0x3EFA01A019CB1590 | YES          |
| C4    | -2.75573143513906633035e-7  | 0xBE927E4F809C52AD | YES          |
| C5    | 2.0875723212981748279e-9    | 0x3E21EE9EBDB4B1C4 | YES          |
| C6    | -1.13596475577881948265e-11 | 0xBDA8FAE9BE8838D4 | YES          |

### Polynomial Application

- kernelSin: `x + x3 * (S1 + x2 * (S2 + ...))` - Horner's method, correct
- kernelCos: `1 - x2/2 + x4 * (C1 + x2 * (C2 + ...))` - Horner's method, correct

### CRITICAL FINDING: Range Reduction

The polynomial coefficients match fdlibm, but the **range reduction** does NOT.

fdlibm uses **Cody-Waite** (for moderate angles) and **Payne-Hanek** (for very large angles) high-precision argument reduction that splits PI/2 into high and low parts to maintain precision.

This implementation uses:

```typescript
let y = x % TAU;
if (y < 0) y += TAU;
const quadrant = Math.trunc(y / PI_2) % 4;
```

**Problem:** JavaScript's `%` operator for floating-point is NOT high-precision. For angles > ~2^20 radians, the modulo `x % TAU` loses significant precision because TAU cannot be represented exactly in float64. This means sin/cos for large angles will have degraded accuracy.

**Impact:** For typical 2D physics angles (|x| < 100), precision loss is negligible. For applications that accumulate angles over time (e.g., rotating wheels), precision degrades.

**Reference:** fdlibm e_rem_pio2.c uses a 66-bit representation of 2/PI for high-precision reduction.

---

## 1.3 atan2, sqrt, exp, log, pow vs fdlibm C Source

### sqrt - SIGNIFICANT DEVIATION

**fdlibm e_sqrt.c:** Uses integer-based Newton's method operating directly on IEEE 754 bit representation. Achieves correctly-rounded result (0.5 ULP).

**This implementation:** Uses floating-point Newton-Raphson with 5 iterations from an IEEE 754 exponent-based initial guess.

Differences:

1. Initial guess via `2^(exponent/2)` is coarser than fdlibm's mantissa-aware approach
2. 5 floating-point Newton-Raphson iterations don't guarantee correctly-rounded result
3. Shared DataView buffer creates implicit state (reentrancy concern)

**Key question:** Is custom sqrt even needed? See Task 1.7.

### atan - GOOD MATCH

**fdlibm s_atan.c:** Range reduction into segments [0, 7/16], [7/16, 11/16], [11/16, 19/16], [19/16, 39/16], [39/16, inf], using identities atan(x) = C + atan(reduced).

**This implementation:** Same 5-segment reduction with matching breakpoints. AT0-AT10 coefficients match. Minor difference: uses `PI/6` and `PI/3` computed at call time vs fdlibm's precomputed constants.

### log - GOOD MATCH

**fdlibm e_log.c:** Range reduction via IEEE 754 exponent extraction, s = f/(2+f) substitution, polynomial R(s^2) with odd/even term split.

**This implementation:** Matches the structure. Lg1-Lg7 coefficients match. LN2_HI/LN2_LO split matches. Subnormal handling present. **Concern:** Shares the same DataView buffer as sqrt.

### exp - MOSTLY MATCHES, FRAGILE SCALING

**fdlibm e_exp.c:** Range reduction k\*ln(2) + r, polynomial approximation, 2^k scaling.

**This implementation:** Matches structure. E1-E5 coefficients match. BUT:

**Fragile 2^k scaling (line 874-878):**

```typescript
sqrtView.setFloat64(0, expR, false);
let hi = sqrtView.getUint32(0, false);
hi += k << 20; // Add k to exponent
sqrtView.setUint32(0, hi, false);
```

This modifies only the HIGH 32 bits. It works for normal numbers where adding k to the exponent field is valid, but:

- Does NOT handle the low 32 bits (truncation for edge cases)
- Can corrupt the number if k pushes the exponent outside [1, 2046]
- fdlibm uses `scalbn` or careful two-step multiplication for this

### pow - SIMPLIFIED, POTENTIAL PRECISION LOSS

**fdlibm e_pow.c:** 400+ lines with careful handling of: negative bases with integer exponents, base near 1, exponent near 0, overflow/underflow detection, split computation for precision.

**This implementation:** ~30 lines. Integer path (squaring) is correct but:

- Non-integer path uses `exp(e * log(b))` which compounds rounding errors from both exp and log
- Missing: negative base with odd integer exponent (should return negative), careful overflow detection
- fdlibm achieves much better precision through direct computation

---

## 1.4 Accuracy Assessment

### Test Coverage Analysis

Current tests verify precision at these levels:

- sqrt: `toBeCloseTo(x, 14)` (~15 digits) - 100 random samples
- sin/cos: `toBeCloseTo(x, 12-14)` - 100 random samples in [-5, 5]
- atan: `toBeCloseTo(x, 12)` - 100 random samples in [-50, 50]
- atan2: `toBeCloseTo(x, 12)` - 100 random samples
- log: `toBeCloseTo(x, 6)` - 100 random in (0, 1000) **<-- only 6 digits!**
- exp: `toBeCloseTo(x, 6)` - 100 random in [-10, 10] **<-- only 6 digits!**

### Gaps in Accuracy Testing

1. **No ULP-level testing** - The gold standard for math libraries is measuring max error in ULPs (Units in the Last Place). None of the tests do this.
2. **No testing at critical points** - Missing: denormals, values near PI multiples, values near overflow/underflow boundaries, values near range reduction breakpoints.
3. **Non-reproducible tests** - Uses `Math.random()` instead of a seeded generator.
4. **log/exp only 6 digits** - This suggests known precision limitations.
5. **No large angle testing** - No tests for sin/cos with angles > 100, where range reduction degrades.

### Estimated Maximum Errors (based on algorithm analysis)

| Function      | Estimated Max Error              | fdlibm Target               |
| ------------- | -------------------------------- | --------------------------- |
| kernelSin     | ~1 ULP in [-PI/4, PI/4]          | < 1 ULP                     |
| kernelCos     | ~1 ULP in [-PI/4, PI/4]          | < 1 ULP                     |
| sin (full)    | Degrades with angle magnitude    | < 1 ULP                     |
| cos (full)    | Degrades with angle magnitude    | < 1 ULP                     |
| sqrt          | ~1-2 ULP (Newton-Raphson)        | 0.5 ULP (correctly rounded) |
| log           | ~2-5 ULP (shared buffer concern) | < 1 ULP                     |
| exp           | ~2-5 ULP (fragile scaling)       | < 1 ULP                     |
| pow (non-int) | ~10+ ULP (error compounds)       | < 1 ULP                     |

---

## 1.5 Cross-Platform Determinism Analysis

### IEEE 754-2019 Classification

**Required operations (Section 5.4.1) - DETERMINISTIC by standard:**

- Addition, subtraction, multiplication, division
- `sqrt` (!)
- `Math.abs`, `Math.floor`, `Math.ceil`, `Math.trunc`, `Math.round`
- Comparisons, sign operations

**Recommended operations (Section 9.2) - NOT guaranteed deterministic:**

- `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`
- `exp`, `log`, `pow`
- `sinh`, `cosh`, `tanh`

### Engine Divergence Evidence

Known divergences between JS engines for Math.sin/cos:

- V8 switched from fdlibm to "fast math" in 2015, then partially back
- SpiderMonkey uses different polynomial approximations than V8
- JSC (Safari) uses yet another implementation
- Measured divergences: up to 1 ULP difference for Math.sin between V8 and SpiderMonkey

### Critical Finding: sqrt IS Deterministic

**`Math.sqrt` is a required IEEE 754 operation.** It MUST be correctly rounded to 0.5 ULP on all conforming implementations. There is NO cross-platform divergence for Math.sqrt.

The custom sqrt implementation:

1. Is UNNECESSARY for determinism
2. Is LESS accurate (Newton-Raphson ~1-2 ULP vs correctly-rounded 0.5 ULP)
3. Is SLOWER (5 iterations + DataView manipulation vs native assembly)
4. Adds code complexity and reentrancy concerns

**Recommendation:** Remove custom sqrt, use `Math.sqrt` directly.

### Functions That Genuinely Need Deterministic Kernels

Only these functions have cross-platform divergence risk:
`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`

Functions that are already deterministic via IEEE 754: `sqrt`, `abs`, `floor`, `ceil`, `trunc`, `round`, `sign`, `min`, `max`, `fround`

---

## 1.6 config.useNativeMath Toggle

### Current Implementation

```typescript
export const config = { useNativeMath: false };
```

Every function checks `if (config.useNativeMath) return Math.X(...)` at the top.

### Assessment

**Completeness:** All 18 functions have the toggle. COMPLETE.

**Correctness:** The toggle correctly switches between deterministic and native paths.

**Web Worker concern:** If the module is loaded in multiple Web Workers (e.g., physics on worker, rendering on main thread), they share the same config object. Changing it in one context affects all. This is a potential source of bugs.

**Pattern in engines:**

- **Rapier (Rust/Wasm):** No toggle. Always deterministic via Rust's guaranteed math.
- **Photon Engine:** Server forces deterministic, client can use native for rendering.
- **Box2D:** No toggle. Uses C's math functions (platform-dependent).
- **Godot:** Uses float32 with no deterministic guarantee.

**Performance concern:** The `if (config.useNativeMath)` branch on every call adds a property access + branch. In hot loops calling sin/cos thousands of times, this overhead is measurable. Alternative: compile-time selection via separate build entrypoints.

---

## 1.7 MUST/MAY/SHOULD-NOT Classification

### IEEE 754-2019 Reference

| Function | IEEE 754 Status   | Deterministic? | Kernel Needed?             |
| -------- | ----------------- | -------------- | -------------------------- |
| sin      | Recommended (9.2) | NO             | MUST                       |
| cos      | Recommended (9.2) | NO             | MUST                       |
| tan      | Recommended (9.2) | NO             | MUST                       |
| atan     | Recommended (9.2) | NO             | MUST                       |
| atan2    | Recommended (9.2) | NO             | MUST                       |
| asin     | Recommended (9.2) | NO             | MUST                       |
| acos     | Recommended (9.2) | NO             | MUST                       |
| exp      | Recommended (9.2) | NO             | MUST                       |
| log      | Recommended (9.2) | NO             | MUST                       |
| pow      | Recommended (9.2) | NO             | MUST                       |
| sqrt     | Required (5.4.1)  | YES            | SHOULD-NOT                 |
| hypot    | Recommended (9.2) | NO             | MAY (uses sqrt internally) |

### hypot Special Case

`Math.hypot` is NOT required to be correctly rounded, so different engines could produce different results. However, the current `hypot` implementation uses the custom `sqrt` which is unnecessary. If sqrt is replaced with Math.sqrt, hypot's internal scaling logic (max \* sqrt(1 + ratio^2)) uses only deterministic operations EXCEPT the final sqrt. Since sqrt IS deterministic, the only non-deterministic part would be the intermediate arithmetic (which IS deterministic). So hypot with Math.sqrt should be deterministic.

However, to be safe, keeping a custom hypot that avoids `Math.hypot` (which uses a different algorithm internally in some engines) is reasonable.

---

## 1.8 sinCos Evaluation

### Two Implementations Exist

1. **deterministic/deterministic-kernels.ts:sinCos** (line 486):
   - One `reduceAngle` call, then `kernelSin` + `kernelCos`
   - Returns `{ sin, cos }` - NEW OBJECT on every call
   - No `out` parameter

2. **auxiliary/angle/operations.ts:sinCos** (line 60):
   - Calls `sin(angle)` + `cos(angle)` SEPARATELY
   - Each does its own `reduceAngle` - REDUNDANT
   - Has `out` parameter for zero-alloc hot paths
   - Returns `SinCos` interface

### Issues

1. **Redundant range reduction:** The auxiliary sinCos calls sin() and cos() individually, each performing reduceAngle. The deterministic sinCos does it once. The auxiliary version does NOT delegate to the deterministic sinCos.

2. **Missing out parameter:** The deterministic sinCos allocates a new object every call. For hot paths, this is problematic. The auxiliary version has `out` but wastes work on double reduction.

3. **Interface location:** `SinCos` is defined in `auxiliary/angle/operations.ts` but re-exported from deterministic. This creates a confusing ownership chain.

### Recommendation

The auxiliary sinCos should delegate to the deterministic sinCos for the computation, and only add the `out` parameter pattern on top. Alternatively, the deterministic sinCos should accept an `out` parameter.

---

## 1.9 Consumer Map

### Direct Imports from deterministic/

| Consumer Module                 | Functions Imported                     |
| ------------------------------- | -------------------------------------- |
| `auxiliary/angle/operations.ts` | atan2, cos, sin                        |
| `auxiliary/numeric/rounding.ts` | log                                    |
| `auxiliary/numeric/safety.ts`   | acosSafe, asinSafe, log, pow, sqrtSafe |
| `core/vector2.ts`               | atan2, hypot, sin, sqrt                |
| `core/complex.ts`               | atan2, hypot, pow, sqrt                |
| `core/rotation2.ts`             | hypot, atan2                           |
| `core/matrix2.ts`               | hypot, atan2                           |
| `core/matrix3.ts`               | hypot, atan2                           |
| `core/transform2.ts`            | atan2                                  |
| `utils/random.ts`               | cos, log, sin, sqrtSafe                |
| `utils/parse.ts`                | atan2                                  |

### Most Consumed Functions

| Function          | Consumer Count | Consumers                                                                   |
| ----------------- | -------------- | --------------------------------------------------------------------------- |
| atan2             | 7              | angle/ops, vector2, complex, rotation2, matrix2, matrix3, transform2, parse |
| hypot             | 4              | vector2, complex, rotation2, matrix2, matrix3                               |
| sqrt              | 2              | vector2, complex                                                            |
| sqrtSafe          | 2              | numeric/safety, utils/random                                                |
| sin               | 2              | angle/ops, vector2, utils/random                                            |
| cos               | 1+1            | angle/ops, utils/random                                                     |
| log               | 2              | numeric/rounding, numeric/safety, utils/random                              |
| pow               | 1              | numeric/safety                                                              |
| acosSafe/asinSafe | 1 each         | numeric/safety                                                              |

### Reverse Dependency (deterministic imports FROM auxiliary)

**deterministic-kernels.ts imports from auxiliary/scalar/constants:**

```typescript
import { HALF_PI, PI, QUARTER_PI, TAU } from '../auxiliary/scalar/constants';
```

This creates a cross-layer dependency: deterministic/ depends on auxiliary/scalar. While not circular at the file level (constants.ts doesn't import from deterministic), it means deterministic is NOT a truly independent L0 layer. Constants.ts is a prerequisite.

---

## 1.10 Diagnostic by Entity

| Entity                 | Verdict     | Justification                                                                                                                                   |
| ---------------------- | ----------- | ----------------------------------------------------------------------------------------------------------------------------------------------- |
| `config`               | ⚠️ Redefine | Thread safety for Web Workers. Consider: immutable after init, or build-time selection                                                          |
| `sqrt`                 | ⚠️ Redefine | UNNECESSARY for determinism (IEEE 754 required op). Replace with `Math.sqrt`. Less accurate than native (~1-2 ULP vs 0.5 ULP correctly rounded) |
| `sqrtSafe`             | ⚠️ Redefine | If sqrt removed, sqrtSafe simplifies to `x <= 0 ? 0 : Math.sqrt(x)`. Move to numeric/safety                                                     |
| `hypot`                | ⚠️ Redefine | Keep custom (Math.hypot not required deterministic), but use Math.sqrt internally                                                               |
| `reduceAngle`          | ⚠️ Redefine | Replace `x % TAU` with Cody-Waite reduction for precision with large angles                                                                     |
| `kernelSin`            | ✅ Keep     | Coefficients match fdlibm, Horner's method correct                                                                                              |
| `kernelCos`            | ✅ Keep     | Coefficients match fdlibm, Horner's method correct                                                                                              |
| `sin`                  | ⚠️ Redefine | Good kernel, but range reduction needs improvement                                                                                              |
| `cos`                  | ⚠️ Redefine | Same as sin                                                                                                                                     |
| `sinCos`               | ⚠️ Redefine | Add `out` parameter. Fix aux/sinCos to delegate here                                                                                            |
| `tan`                  | ✅ Keep     | Simple sin/cos ratio, correct                                                                                                                   |
| `kernelAtan`           | ✅ Keep     | Coefficients match fdlibm                                                                                                                       |
| `atan`                 | ✅ Keep     | Range reduction and coefficients match fdlibm                                                                                                   |
| `atan2`                | ✅ Keep     | Good special case handling, correct quadrant logic                                                                                              |
| `acos`                 | ✅ Keep     | Correct identity via atan2                                                                                                                      |
| `asin`                 | ✅ Keep     | Correct identity via atan2                                                                                                                      |
| `acosSafe`             | ✅ Keep     | Simple clamp + delegate                                                                                                                         |
| `asinSafe`             | ✅ Keep     | Simple clamp + delegate                                                                                                                         |
| `log`                  | ⚠️ Redefine | Correct fdlibm approach but: (1) shared buffer reentrancy, (2) only 6-digit test precision suggests issues                                      |
| `logSafe`              | ✅ Keep     | Simple guard. Internal-only is correct                                                                                                          |
| `exp`                  | ⚠️ Redefine | Fragile 2^k scaling via high-word-only bit manipulation. Test precision only 6 digits                                                           |
| `expSafe`              | ⚠️ Redefine | NaN->1 choice is debatable. Consider NaN->0 (safer for physics)                                                                                 |
| `pow`                  | ⚠️ Redefine | Oversimplified vs fdlibm. Compounds errors. Missing negative base + odd int exponent                                                            |
| `DeterministicKernels` | ✅ Keep     | Convenient bag object                                                                                                                           |
| Shared DataView buffer | ⚠️ Redefine | Single buffer used by sqrt, log, exp. Reentrancy risk if called from within each other (e.g., pow -> exp -> log)                                |

**Summary:** 10 ✅ Keep, 13 ⚠️ Redefine, 0 Remove, 0 Add

---

## 1.11 Inferred Rules and Synergy Map

### Inferred Design Rules

1. **"Only wrap non-deterministic Math.\* functions"** - Stated in file header. Correct principle, BUT violated by including sqrt (which IS deterministic per IEEE 754).

2. **"fdlibm as coefficient source"** - All polynomial coefficients come from fdlibm. Good choice for proven minimax approximations.

3. **"Runtime toggle for determinism vs speed"** - config.useNativeMath allows trading determinism for performance. Useful for development/single-player, but thread safety is a gap.

4. **"Safe variants return neutral/sensible fallback"** - sqrtSafe->0, logSafe->0, expSafe->1/MAX_VALUE, acosSafe/asinSafe->boundary. Consistent pattern, though some fallback choices are debatable.

5. **"Shared infrastructure for IEEE 754 bit manipulation"** - Single ArrayBuffer/DataView reused across sqrt, log, exp. Performance optimization at the cost of reentrancy safety.

6. **"L0 = bit-exact cross-platform"** - Clearly documented guarantee level. Good terminology.

### Synergy Map

```
deterministic-kernels.ts
  IMPORTS FROM:
    auxiliary/scalar/constants.ts: HALF_PI, PI, QUARTER_PI, TAU

  EXPORTS TO:
    auxiliary/angle/operations.ts: atan2, cos, sin
    auxiliary/numeric/rounding.ts: log
    auxiliary/numeric/safety.ts: acosSafe, asinSafe, log, pow, sqrtSafe
    core/vector2.ts: atan2, hypot, sin, sqrt
    core/complex.ts: atan2, hypot, pow, sqrt
    core/rotation2.ts: hypot, atan2
    core/matrix2.ts: hypot, atan2
    core/matrix3.ts: hypot, atan2
    core/transform2.ts: atan2
    utils/random.ts: cos, log, sin, sqrtSafe
    utils/parse.ts: atan2
    index.ts: all functions + DeterministicKernels

  MISSED COMPOSITION:
    - auxiliary/angle/operations.ts sinCos should delegate to deterministic sinCos
    - auxiliary/numeric/safety safeSqrt wraps sqrtSafe but could use Math.sqrt directly
```

### Critical Architecture Finding

The layer diagram says `deterministic` is the base (L0), but it imports from `auxiliary/scalar/constants`. This means:

- constants.ts is the TRUE base of the system
- deterministic/ is NOT self-contained
- If constants.ts changes PI/TAU values, deterministic/ behavior changes

This isn't a bug (the constants are mathematically fixed), but it contradicts the "zero dependencies" claim in the design doc.
