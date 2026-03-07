# Phase 2 - API Design: Auxiliary Modules (Tasks 9.1-9.10)

## 9.1 scalar/constants — Final API

### Constants to Keep (18)

| Constant                     | Value      | Category            |
| ---------------------------- | ---------- | ------------------- |
| EPSILON                      | 1e-10      | Tolerance           |
| EPSILON_SQUARED              | 1e-20      | Tolerance (derived) |
| ITERATIVE_TOLERANCE          | 1e-6       | Tolerance (future)  |
| MAX_SAFE_INTEGER_F64         | 2^53-1     | Numeric limits      |
| SMALLEST_NORMAL              | 2.225e-308 | Numeric limits      |
| PI, TAU, HALF_PI, QUARTER_PI | Standard   | Angular             |
| DEG_TO_RAD, RAD_TO_DEG       | Standard   | Conversion          |
| RAD_TO_TURN, TURN_TO_RAD     | Standard   | Conversion          |
| SQRT_2, SQRT_HALF, LN_2, E   | Standard   | Mathematical        |
| GOLDEN_RATIO_CONJUGATE       | ~0.618     | Mathematical        |
| Constants (bag)              | All above  | Collection          |

### Constants to Remove (2)

| Constant      | Reason                                                                            |
| ------------- | --------------------------------------------------------------------------------- |
| ANGLE_EPSILON | Zero consumers. Remove to avoid confusion.                                        |
| GOLDEN_RATIO  | Zero consumers. GOLDEN_RATIO_CONJUGATE suffices (if needed, phi = 1 + conjugate). |

### Constants to Add (0)

No new constants needed.

---

## 9.2 scalar/arithmetic — Final API

### Functions (19, no changes)

All 19 functions are confirmed keep. No additions, no removals.

| Function                                    | Triality        | Building Block?         |
| ------------------------------------------- | --------------- | ----------------------- |
| clamp                                       | Single          | Yes (3+ consumers)      |
| sign                                        | Single          | No                      |
| saturate                                    | Single (facade) | Yes (5 consumers)       |
| saturateSigned                              | Single (facade) | No                      |
| remap / remapSafe                           | 2/3             | No                      |
| loop / loopSafe / loopUnchecked             | 3/3             | Yes (loop: 4 consumers) |
| pingPong / pingPongSafe / pingPongUnchecked | 3/3             | No                      |
| step                                        | Single          | No                      |
| mod / modSafe / modUnchecked                | 3/3             | No                      |
| floorDivide                                 | Single          | No                      |

### Naming Clarification

`mod` performs Euclidean modulo (always positive result). Consider documenting this more prominently in TSDoc to distinguish from `flooredMod` in numeric/wrapping.

---

## 9.3 scalar/comparison — Final API

### Functions (8, no changes)

All 8 functions confirmed keep.

| Function                   | Tolerance          | Building Block?    |
| -------------------------- | ------------------ | ------------------ |
| nearEquals(a, b, eps?)     | Absolute           | Yes (4+ consumers) |
| isNearZero(v, eps?)        | Absolute           | Yes (3+ consumers) |
| isNearOne(v, eps?)         | Absolute           | No                 |
| relativeEquals(a, b, eps?) | Relative (floor=1) | No                 |
| lessThan(a, b, eps?)       | Tolerant           | No                 |
| greaterThan(a, b, eps?)    | Tolerant           | No                 |
| inRange(v, min, max, eps?) | Tolerant           | No                 |
| compare(a, b, eps?)        | Three-way          | No                 |

### Overlap with numeric/guards.isInRange

`inRange` (tolerant, eps-based) vs `isInRange` (exact). Both are justified but naming is confusing. Document the distinction clearly: `inRange` = "approximately in range", `isInRange` = "exactly in range".

---

## 9.4 scalar/interpolation — Final API

### Functions (7, no changes)

| Function                                             | Triality | Notes                 |
| ---------------------------------------------------- | -------- | --------------------- |
| lerp(a, b, t)                                        | Single   | Extrapolation allowed |
| lerpClamped(a, b, t)                                 | Single   | t clamped to [0,1]    |
| inverseLerp / inverseLerpSafe / inverseLerpUnchecked | 3/3      |                       |
| smoothStep(e0, e1, x)                                | Single   | Matches GLSL          |
| smootherStep(e0, e1, x)                              | Single   | Ken Perlin C2         |

---

## 9.5 angle/conversion — Final API

### Functions (4)

| Function              | Change   | Notes                                                     |
| --------------------- | -------- | --------------------------------------------------------- |
| degreesToRadians(deg) | Keep     | deg \* DEG_TO_RAD                                         |
| radiansToDegrees(rad) | Keep     | rad \* RAD_TO_DEG                                         |
| turnsToRadians(turns) | Keep     | turns \* TAU                                              |
| radiansToTurns(rad)   | Redefine | Change `rad / TAU` to `rad * RAD_TO_TURN` for consistency |

---

## 9.6 angle/normalization — Final API

### Functions (4, no changes)

| Function                      | Range       | Delegates To         |
| ----------------------------- | ----------- | -------------------- |
| normalizeRadians(rad)         | [-PI, PI)   | loop(rad, -PI, PI)   |
| normalizeRadiansPositive(rad) | [0, TAU)    | loop(rad, 0, TAU)    |
| normalizeDegrees(deg)         | [-180, 180) | loop(deg, -180, 180) |
| normalizeDegreesPositive(deg) | [0, 360)    | loop(deg, 0, 360)    |

All correct. Half-open [-PI, PI) is the standard mathematical convention.

---

## 9.7 angle/operations — Final API

### Functions

| Function                                      | Change   | Notes                                                                                                      |
| --------------------------------------------- | -------- | ---------------------------------------------------------------------------------------------------------- |
| SinCos (interface)                            | Keep     | Canonical location                                                                                         |
| sinCos(angle, out?)                           | Redefine | Delegate to deterministic/sinCos to avoid double range reduction                                           |
| sinCosNormalized(angle, out?)                 | Evaluate | If sinCos is fixed, this becomes sinCos(normalizeRadians(angle), out) — may still be useful as convenience |
| angleDifference(from, to)                     | Keep     | Critical building block (6+ consumers)                                                                     |
| angleDistance(a, b)                           | Keep     | abs(angleDifference)                                                                                       |
| anglesNearEqual(a, b, eps?)                   | Keep     | Uses EPSILON default                                                                                       |
| angleBisector(a, b)                           | Keep     | Shortest arc midpoint                                                                                      |
| isAngleBetween(angle, start, end, inclusive?) | Keep     | CCW convention                                                                                             |
| clampAngle(angle, min, max)                   | Keep     | Nearest boundary                                                                                           |
| angleFromVectors(x1, y1, x2, y2)              | Keep     | atan2-based signed angle                                                                                   |

---

## 9.8 angle/interpolation — Final API

### Functions (2, no changes)

| Function                     | Notes                                     |
| ---------------------------- | ----------------------------------------- |
| lerpAngle(from, to, t)       | Shortest-path angular lerp. Correct.      |
| smoothStepAngle(from, to, t) | Composes smoothStep + lerpAngle. Correct. |

---

## 9.9 angle/unwrapping — Final API

### Entities (3, no changes)

| Entity                            | Notes                               |
| --------------------------------- | ----------------------------------- |
| unwrapAngles(angles, ref?)        | Batch array unwrap                  |
| unwrapAnglesInPlace(angles, ref?) | In-place variant                    |
| AngleUnwrapper (class)            | Streaming unwrapper, unique feature |

---

## 9.10 numeric/ — Final API

### Resolving Overlap with scalar/

| numeric/ entity          | scalar/ counterpart    | Resolution                                    |
| ------------------------ | ---------------------- | --------------------------------------------- |
| isInRange (exact)        | inRange (tolerant)     | Keep both. Document distinction.              |
| flooredMod (any divisor) | mod (positive divisor) | Keep both. Different mathematical operations. |

### guards.ts (5 functions, no changes)

All keep. isDenormal is the most specialized.

### rounding.ts (6 functions)

| Function          | Change                                                          |
| ----------------- | --------------------------------------------------------------- |
| roundToInt        | Keep (banker's rounding, matches GLSL)                          |
| roundToPlaces     | Keep                                                            |
| roundToMultiple   | Keep                                                            |
| roundToPowerOfTwo | Redefine: use Math.log2 or bitwise instead of deterministic/log |
| snapToGrid        | Keep                                                            |
| fract             | Keep (matches GLSL)                                             |

### safety.ts (14 entities)

| Entity               | Change                                     |
| -------------------- | ------------------------------------------ |
| MIN_SAFE_DIVISOR     | Keep                                       |
| divideSafe           | Keep (building block: 5 consumers)         |
| reciprocalSafe       | Keep                                       |
| sqrtSafe (re-export) | Keep                                       |
| acosSafe (re-export) | Keep                                       |
| asinSafe (re-export) | Keep                                       |
| logSafe              | Keep (adds base parameter)                 |
| powSafe              | Keep (NaN for complex result is justified) |
| robustSum            | Keep (Kahan, correct)                      |
| neumaierSum          | Keep (Neumaier, correct)                   |
| compensatedProduct   | Keep (Veltkamp/Dekker, correct)            |
| lerpSafe             | Keep (handles overflow)                    |
| sanitizeNumber       | Keep                                       |
| ensureFinite         | Keep                                       |

### wrapping.ts (3 functions, no changes)

flooredMod triality: keep all three.
