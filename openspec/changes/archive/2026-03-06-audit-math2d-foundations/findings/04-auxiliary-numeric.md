# Phase 1 - Audit: auxiliary/numeric/ (Tasks 4.1-4.11)

## 4.1 guards.ts

**File:** `src/auxiliary/numeric/guards.ts` (124 lines)

### Functions (5)

| Function               | Formula                            | Standard Equivalent                     |
| ---------------------- | ---------------------------------- | --------------------------------------- |
| isPositiveInfinity(v)  | v === Infinity                     | No direct equivalent                    |
| isNegativeInfinity(v)  | v === -Infinity                    | No direct equivalent                    |
| isInfinity(v)          | v === Inf \|\| v === -Inf          | !Number.isFinite(v) && !Number.isNaN(v) |
| isDenormal(v)          | v !== 0 && \|v\| < SMALLEST_NORMAL | No standard equivalent                  |
| isInRange(v, min, max) | v >= min && v <= max               | No standard equivalent                  |

### Analysis

- **isPositiveInfinity/isNegativeInfinity:** Simple value checks. These are one-liners that don't justify library functions in most codebases, but they improve readability.
- **isInfinity:** Equivalent to `!Number.isFinite(v) && !Number.isNaN(v)`. Slightly more readable.
- **isDenormal:** Correct per IEEE 754. Uses SMALLEST_NORMAL (2^-1022) as the boundary. This is a useful check for performance-sensitive code (denormals can be ~100x slower on some CPUs).
- **isInRange:** Exact range check (no epsilon). **OVERLAPS** with scalar/comparison.inRange which adds epsilon tolerance.

### Overlap: isInRange vs inRange

|           | numeric/guards.isInRange | scalar/comparison.inRange |
| --------- | ------------------------ | ------------------------- |
| Tolerance | None (exact)             | Epsilon-based             |
| Signature | (v, min, max)            | (v, min, max, eps?)       |
| Use case  | Exact boundary check     | Floating-point comparison |

These serve different purposes. The naming is confusing though — `isInRange` (exact) vs `inRange` (tolerant). A user might pick the wrong one.

---

## 4.2 rounding.ts

**File:** `src/auxiliary/numeric/rounding.ts` (163 lines)

### Functions (6)

| Function                         | Algorithm                        | Dependencies                     |
| -------------------------------- | -------------------------------- | -------------------------------- |
| roundToInt(v)                    | Banker's rounding (half-to-even) | None                             |
| roundToPlaces(v, places)         | Factor-based                     | Math.round                       |
| roundToMultiple(v, multiple)     | Division-based                   | Math.round                       |
| roundToPowerOfTwo(v)             | Log2-based                       | deterministic: log; scalar: LN_2 |
| snapToGrid(v, gridSize, offset?) | Division-based                   | Math.round                       |
| fract(v)                         | Floor subtraction                | Math.floor                       |

### Banker's Rounding Analysis

`roundToInt` implements banker's rounding (IEEE 754 "round half to even"):

- 3.5 → 4 (even), 4.5 → 4 (even), 5.5 → 6 (even)
- This reduces statistical bias in repeated rounding

**Verification against Math.round:**

- Math.round(0.5) = 1 (round half UP, not to even)
- roundToInt(0.5) = 0 (round half to EVEN)
- These differ intentionally. The function name could be clearer about this.

**GLSL round:** GLSL `round` uses IEEE 754 default (round to nearest even). So roundToInt matches GLSL.

**Edge case:** Throws RangeError for non-finite input. This follows the Strict convention.

### roundToPowerOfTwo Concern

Uses `log(value) / LN_2` where `log` is the deterministic kernel. This means:

1. Deterministic log is used for a non-precision-critical operation (rounding)
2. The deterministic log has lower precision (~6 digits in tests) than Math.log
3. For values near a power-of-two boundary, this could round incorrectly

**Alternative:** Use bitwise operations for integer inputs, Math.log2 for float inputs. Both are deterministic (IEEE 754 required operations for the basic operations involved).

---

## 4.3 Rounding vs External References

| Operation      | lenguados          | Math.round   | GLSL    | Python      |
| -------------- | ------------------ | ------------ | ------- | ----------- |
| Half rounding  | To even (banker's) | To +Infinity | To even | To even     |
| Decimal places | roundToPlaces      | N/A          | N/A     | round(v, n) |
| Grid snapping  | snapToGrid         | N/A          | N/A     | N/A         |
| Power of two   | roundToPowerOfTwo  | N/A          | N/A     | N/A         |

lenguados's roundToInt matches GLSL/Python convention (banker's rounding), which is more mathematically rigorous than Math.round.

---

## 4.4 safety.ts

**File:** `src/auxiliary/numeric/safety.ts` (402 lines)

### Functions and Constants

| Entity                             | Type      | Dependencies              |
| ---------------------------------- | --------- | ------------------------- |
| MIN_SAFE_DIVISOR (= EPSILON)       | Constant  | scalar/constants: EPSILON |
| divideSafe(num, den, eps?)         | Function  | -                         |
| reciprocalSafe(v, eps?)            | Function  | -                         |
| sqrtSafe                           | Re-export | deterministic/            |
| acosSafe                           | Re-export | deterministic/            |
| asinSafe                           | Re-export | deterministic/            |
| logSafe(v, base?)                  | Function  | deterministic: log        |
| powSafe(base, exp)                 | Function  | deterministic: pow        |
| robustSum(values)                  | Function  | -                         |
| neumaierSum(values)                | Function  | -                         |
| compensatedProduct(a, b)           | Function  | -                         |
| lerpSafe(a, b, t)                  | Function  | -                         |
| sanitizeNumber(v, fb?, min?, max?) | Function  | scalar/arithmetic: clamp  |
| ensureFinite(v, fb?)               | Function  | -                         |

### Safe Convention Assessment

All Safe functions follow the pattern: check input validity → return fallback or delegate to strict version.

| Function       | Invalid Input      | Fallback         |
| -------------- | ------------------ | ---------------- |
| divideSafe     | \|den\| < eps      | 0                |
| reciprocalSafe | \|v\| < eps        | 0                |
| sqrtSafe       | v <= 0             | 0                |
| acosSafe       | \|x\| > 1          | 0 or PI          |
| asinSafe       | \|x\| > 1          | -PI/2 or PI/2    |
| logSafe        | v <= 0             | 0                |
| powSafe        | base < 0, frac exp | NaN (exception!) |
| lerpSafe       | t out of [0,1]     | a or b           |
| ensureFinite   | !finite            | 0                |
| sanitizeNumber | !finite            | fallback param   |

**powSafe NaN exception:** The function returns NaN for negative base with fractional exponent. This breaks the Safe convention (should return a finite fallback). The TSDoc justifies this as "mathematically undefined in R" and cites universal external convention (IEEE 754, C99, Unity, GLM, Eigen). This is a reasonable exception — returning 0 would be misleading.

### logSafe Name Collision

There are TWO `logSafe` functions:

1. `deterministic/deterministic-kernels.ts:logSafe` — simple guard, returns 0, single arg
2. `auxiliary/numeric/safety.ts:logSafe` — supports custom base, returns 0

The deterministic version is marked `@internal` and not exported from main index. The safety.ts version IS exported and adds base support. This is documented but could cause confusion if someone imports from the wrong path.

---

## 4.5 Safety Fallbacks vs External References

### Comparison

| Approach                     | Library                      | Pattern                             |
| ---------------------------- | ---------------------------- | ----------------------------------- |
| Return fallback (0, neutral) | lenguados, Rapier            | Safe variant returns finite value   |
| Return NaN (propagate)       | gl-matrix, three.js          | Let caller handle                   |
| Clamp/skip                   | Box2D                        | Clamp inputs, skip degenerate cases |
| Assert + crash               | Eigen (debug), Unity (debug) | Fail fast in development            |

lenguados's approach matches Rapier's: provide Safe variants that always return usable values. This is good for physics where NaN propagation can crash simulations.

---

## 4.6 Compensated Arithmetic Validation

### robustSum (Kahan Summation)

Algorithm matches Kahan 1965:

```
compensation = 0; sum = 0
for each value:
  y = value - compensation
  t = sum + y
  compensation = (t - sum) - y
  sum = t
```

**Correct.** The implementation adds sanitization (non-finite → 0) which is not in the original algorithm but appropriate for a physics library.

### neumaierSum (Improved Kahan)

Algorithm matches Neumaier 1974:

```
sum = 0; compensation = 0
for each value:
  t = sum + value
  if |sum| >= |value|:
    compensation += (sum - t) + value  // low-order of value lost
  else:
    compensation += (value - t) + sum  // low-order of sum lost
  sum = t
return sum + compensation
```

**Correct.** Same sanitization addition.

### compensatedProduct (Veltkamp/Dekker Splitting)

Uses Veltkamp splitting with factor 2^27 + 1 = 134217729, matching the Ogita/Rump/Oishi 2005 error-free transformation:

```
split = 2^27 + 1
c = split * a
aHigh = c - (c - a)
aLow = a - aHigh
(same for b)
product = a * b
error = aLow * bLow - ((product - aHigh*bHigh) - aLow*bHigh - aHigh*bLow)
```

**Correct.** The splitting factor 2^27 + 1 is the standard choice for double precision (splits 53-bit mantissa into two 26-bit halves). Same sanitization pattern.

---

## 4.7 wrapping.ts

**File:** `src/auxiliary/numeric/wrapping.ts` (86 lines)

### Functions (3)

| Function                               | Triality  | Formula                 |
| -------------------------------------- | --------- | ----------------------- |
| flooredMod(dividend, divisor)          | Strict    | ((a%b)+b)%b             |
| flooredModSafe(dividend, divisor)      | Safe      | Returns 0 if divisor ~0 |
| flooredModUnchecked(dividend, divisor) | Unchecked | No validation           |

### Overlap with scalar/arithmetic.mod

|                   | scalar/mod             | numeric/flooredMod          |
| ----------------- | ---------------------- | --------------------------- |
| Divisor sign      | Must be positive       | Any sign                    |
| Negative dividend | Always positive result | Same sign as divisor        |
| Strict validation | divisor <= 0 → throw   | divisor ~0 → throw          |
| Use case          | Always-positive modulo | Mathematical floored modulo |

**Key difference:** `mod` requires positive divisor and always returns positive. `flooredMod` handles any divisor sign and returns result with same sign as divisor (Python-style `%`).

**Assessment:** These are different operations with different mathematical definitions. The overlap is more apparent than real. However, the naming could be clearer — `mod` in scalar/ is really "Euclidean modulo" and should perhaps be named `euclideanMod` to distinguish from `flooredMod`.

---

## 4.8 index.ts

Clean barrel export:

```typescript
export * from './safety';
export * from './guards';
export * from './rounding';
export * from './wrapping';
```

**Potential conflict:** Both safety.ts and deterministic/ export `sqrtSafe`, `acosSafe`, `asinSafe`. Safety.ts re-exports them for convenience. No actual naming conflict since safety.ts imports and re-exports the same functions.

---

## 4.9 Internal Composition of numeric/

### Cross-file Dependencies

```
safety.ts imports from:
  - deterministic/: acosSafe, asinSafe, log, pow, sqrtSafe
  - scalar/arithmetic: clamp
  - scalar/constants: EPSILON

guards.ts imports from:
  - scalar/constants: SMALLEST_NORMAL

rounding.ts imports from:
  - deterministic/: log
  - scalar/constants: LN_2

wrapping.ts imports from:
  - scalar/comparison: isNearZero
```

### Internal Dependencies

No cross-file dependencies within numeric/. Each file is independent:

- safety.ts does NOT use guards.ts
- rounding.ts does NOT use wrapping.ts
- guards.ts does NOT use safety.ts

This is clean: no circular dependencies, no deep delegation chains.

---

## 4.10 Consumer Map for numeric/

### Most consumed functions from numeric/

| Function             | Consumer Count | Key Consumers                                       |
| -------------------- | -------------- | --------------------------------------------------- |
| divideSafe           | 5              | vector2, complex, rotation2, matrix2, matrix3       |
| sqrtSafe (re-export) | 3              | vector2, interval, matrix2, matrix3                 |
| acosSafe (re-export) | 1              | vector2 (angleTo)                                   |
| MIN_SAFE_DIVISOR     | 0              | (only used internally by divideSafe/reciprocalSafe) |
| robustSum            | 0              | No consumers in codebase                            |
| neumaierSum          | 0              | No consumers in codebase                            |
| compensatedProduct   | 0              | No consumers in codebase                            |
| isDenormal           | 0              | No consumers in codebase                            |
| roundToInt           | 0              | No consumers in codebase                            |
| flooredMod           | 0              | No consumers in codebase                            |

### Building Blocks vs Standalone Utilities

**Building blocks (3+ consumers):**

- divideSafe (5) — Critical safety primitive
- sqrtSafe (3) — Safety wrapper

**Standalone utilities (0 consumers):**

- robustSum, neumaierSum, compensatedProduct — Advanced numeric algorithms with zero internal consumers
- isDenormal — Guard with zero internal consumers
- roundToInt, roundToPlaces, roundToMultiple, roundToPowerOfTwo, snapToGrid, fract — Rounding utilities with zero internal consumers
- flooredMod triality — Wrapping with zero internal consumers
- isPositiveInfinity, isNegativeInfinity, isInfinity — Guards with zero internal consumers
- isInRange — Guard with zero internal consumers

**Assessment:** Most of numeric/ is user-facing utility code with zero internal consumers. Only divideSafe and sqrtSafe are actual building blocks used by core types. The compensated arithmetic functions (robustSum, neumaierSum, compensatedProduct) are advanced features that may find consumers in future geometry/physics packages.

---

## 4.11 Diagnostic by Entity

### guards.ts

| Entity             | Verdict     | Justification                                                           |
| ------------------ | ----------- | ----------------------------------------------------------------------- |
| isPositiveInfinity | ✅ Keep     | Readability helper                                                      |
| isNegativeInfinity | ✅ Keep     | Readability helper                                                      |
| isInfinity         | ✅ Keep     | Readability helper                                                      |
| isDenormal         | ✅ Keep     | Useful for performance diagnostics. Correct IEEE 754                    |
| isInRange          | ⚠️ Redefine | Naming overlap with scalar/comparison.inRange. Distinguish more clearly |

### rounding.ts

| Entity            | Verdict     | Justification                                                              |
| ----------------- | ----------- | -------------------------------------------------------------------------- |
| roundToInt        | ✅ Keep     | Banker's rounding matches GLSL/IEEE 754 default. Zero consumers but useful |
| roundToPlaces     | ✅ Keep     | Standard utility                                                           |
| roundToMultiple   | ✅ Keep     | Useful for grid systems                                                    |
| roundToPowerOfTwo | ⚠️ Redefine | Uses deterministic log unnecessarily. Consider Math.log2 or bitwise        |
| snapToGrid        | ✅ Keep     | Useful for editor/grid systems                                             |
| fract             | ✅ Keep     | Matches GLSL fract. Standard                                               |

### safety.ts

| Entity               | Verdict | Justification                                                 |
| -------------------- | ------- | ------------------------------------------------------------- |
| MIN_SAFE_DIVISOR     | ✅ Keep | Consistent with EPSILON                                       |
| divideSafe           | ✅ Keep | Building block for core types (5 consumers)                   |
| reciprocalSafe       | ✅ Keep | Complements divideSafe                                        |
| sqrtSafe (re-export) | ✅ Keep | Building block (3 consumers)                                  |
| acosSafe (re-export) | ✅ Keep | Convenient re-export                                          |
| asinSafe (re-export) | ✅ Keep | Convenient re-export                                          |
| logSafe              | ✅ Keep | Adds base parameter over deterministic version                |
| powSafe              | ✅ Keep | NaN for complex result is justified (documented exception)    |
| robustSum            | ✅ Keep | Correct Kahan. Zero consumers now, future physics use         |
| neumaierSum          | ✅ Keep | Correct Neumaier. Superior to Kahan for varying magnitudes    |
| compensatedProduct   | ✅ Keep | Correct Veltkamp/Dekker. Useful for precise area calculations |
| lerpSafe             | ✅ Keep | Handles overflow case that standard lerp doesn't              |
| sanitizeNumber       | ✅ Keep | Useful input validation                                       |
| ensureFinite         | ✅ Keep | Simple guard+fallback                                         |

### wrapping.ts

| Entity              | Verdict | Justification                                        |
| ------------------- | ------- | ---------------------------------------------------- |
| flooredMod          | ✅ Keep | Different from scalar/mod (handles negative divisor) |
| flooredModSafe      | ✅ Keep |                                                      |
| flooredModUnchecked | ✅ Keep |                                                      |

**Summary:** 24 ✅ Keep, 2 ⚠️ Redefine, 0 Remove, 0 Add
