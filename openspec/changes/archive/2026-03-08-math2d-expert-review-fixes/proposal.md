## Why

An exhaustive line-by-line expert review of all 32 source files in `@lenguados/math2d` uncovered 80+ issues spanning correctness, numerical stability, IEEE 754 compliance, API consistency, documentation accuracy, and performance. Three findings are **critical** (Transform2 inverse order, lerpAngle sign error, pow2 subnormal bug), eight are **high** severity (atan2 signed-zero, complex division overflow, \*Safe contract violations), and the remainder are medium/low. These issues collectively undermine the library's core promises of determinism, numerical robustness, and API completeness. Addressing them now — before further downstream adoption — prevents compounding technical debt and establishes the mathematical rigor expected of a commercial-grade physics engine foundation.

## What Changes

### Critical Correctness Fixes (P0)

- **BREAKING**: Fix `Transform2.inverse` position computation order for non-uniform scale (`R⁻¹·S⁻¹·t` → `S⁻¹·R⁻¹·t`)
- Fix `lerpAngle` intermediate normalization that inverts sign at the PI boundary
- Fix `pow2` IEEE 754 exponent construction for biased exponents ≤ -1022 (affects `exp()`)

### Deterministic Kernel Hardening (P0)

- Fix `atan2` signed-zero (`-0`) handling to match IEEE 754 semantics
- Improve angle range reduction precision for `|x| > 2^20·PI` (~3.3M radians)
- Add `log` mantissa sqrt(2) boundary adjustment per fdlibm `e_log.c`
- Export `config` object from main package entry point
- Resolve `logSafe` kernel/auxiliary naming collision

### Numerically Robust Complex Division (P1)

- **BREAKING**: Replace naive `denom = c²+d²` formula with Smith's or Baudin-Smith (2012) algorithm across all 6 division code paths

### \*Safe Function Contract Enforcement (P1)

- Fix `powSafe(0, -n)` returning `0` instead of `Infinity`
- Fix `lerpSafe` still overflowing for large-magnitude opposite-sign operands
- Fix `logSafe(x, 1)` returning `Infinity` — validate `base` parameter
- Fix `divideSafe`/`reciprocalSafe` documentation showing incorrect return values
- Fix `sanitizeNumber` fallback bypassing clamp range
- Fix `ensureFinite` not validating that `fallback` is itself finite
- Fix `expSafe(NaN)` returning `1` instead of `NaN`

### Angle Computation Accuracy (P1)

- Fix `angleDifference` anti-symmetry violation at PI boundary
- Fix `smoothStepAngle` redundant `saturate(t)` call
- Fix `Rotation2.lerp` discontinuous extrapolation contradicting "allows extrapolation" docs
- Document `normalizeRadians` precision loss for very large angles
- Document `isAngleBetween` ambiguous semantics when `start === end`
- Document `AngleUnwrapper` precision drift for long sequences
- Document `clampAngle` output range

### Core Types API Corrections (P1–P2)

- Fix `Complex.reciprocal` using linear epsilon on squared magnitude
- Fix `Complex.pow(ZERO, -n)` producing `Complex(Inf, NaN)`
- Fix `Complex.slerp` missing zero-magnitude guard (unlike `Vector2.slerp`)
- Fix `Complex.lerp` JSDoc claiming "clamped" when it does not clamp
- Fix `Rotation2.fromComplex` JSDoc `@throws` that never throws
- Fix `Matrix2`/`Matrix3` doc headers inverting column membership
- Fix `Matrix3.ortho` missing zero-width/zero-height guard
- Fix `Matrix3.isOrthogonal` failing for affine matrices with translation
- Fix `getScale()` vs `decompose()` sign inconsistency in Matrix2 and Matrix3
- Fix multiply example comments showing reversed transformation order
- Fix `Transform2.toObject()` returning `Rotation2` instance instead of plain object
- Fix `Vector2.instance.limit` missing `lengthSq > 0` guard present in static version
- Remove orphaned JSDoc blocks in Matrix2 and Matrix3
- Document `Rotation2.multiply` drift and periodic renormalization guidance
- Document `Rotation2` constructor non-normalizing behavior
- Document `Transform2.inverse` limitation for non-uniform scale
- Document `applyMatrix3` perspective division silent collapse to origin

### Edge Case Coverage Expansion (P2)

- Add NaN/-0/Infinity handling documentation or guards for ~25 functions: `anglesNearEqual`, `clamp`, `sign`, `step`, `loop`, `lessThan`/`greaterThan`, `inRange`, `lerpClamped`, `smoothStep`, `flooredMod`, `roundToPlaces`, `roundToPowerOfTwo`, `snapToGrid`, `fract`, `angleFromVectors`, `Complex.exp`, `Complex.toString -0`, `Interval.scale -0`, `Interval.lerp`, `assertRange`, `acos`/`asin`
- Add missing `isParallel`/`isPerpendicular` zero-vector guard
- Document `compare` NaN handling and its transitivity implications for sort
- Document type guards accepting NaN as valid `number`

### Numerical Foundations Refinement (P2)

- Fix `inverseLerp`/`inverseLerpSafe` using EPSILON=1e-10 as division guard (too aggressive)
- Fix `lerp(a, b, 1)` not guaranteeing endpoint exactness
- Fix `Interval.divide` EPSILON threshold rejecting valid small divisors
- Fix `Interval.reciprocal` using `divideSafe` on denormal bounds after zero-guard
- Document `compensatedProduct` valid input range for Veltkamp splitting
- Document `remap` precision loss for large-magnitude operands
- Document `Matrix3.decompose` using atan2 with unnecessary sx normalization

### Serialization & Parse Robustness (P2)

- Fix `parseComplex` regex to handle scientific notation (`1e5+2e3i`)
- Fix `formatVector2` (and all format functions) producing invalid JSON for NaN/Infinity
- Fix `parseInterval` JSON branch swallowing its own validation error
- Fix `parseComplex` regex accepting malformed decimals (`1.2.3`)
- Document bracket-matching flexibility in parse functions

### Performance Optimizations (P3)

- Fix `unwrapAngles` using `new Array<number>(n)` (V8 holey array) → `Float64Array` or filled array
- Fix `Matrix3.inverseSafe` computing cofactors/determinant twice
- Fix `Matrix3.fromArray` unnecessary intermediate array allocation
- Fix `Rotation2.set()` creating intermediate `{ cos, sin }` object on every call
- Fix `Vector2.normalize` instance method double-validating via `divideScalar`
- Fix `Rotation2.fromVector2` computing both `magnitudeSquared` and `hypot` redundantly
- Fix `Rotation2.fromVectors2` allocating two temporary `Rotation2` objects
- Fix `Complex.fromPolar` unnecessary `normalizeRadians` before `sinCos`
- Fix `angleFromVectors` using two `atan2` calls instead of cross/dot single-call formula
- Fix `Rotation2.nearEquals` slow path using two `atan2` calls
- Evaluate `Constants` object `Object.freeze` for runtime immutability

### API Consistency & Triality Completion (P3)

- Fix `compare` NaN-equals-everything breaking sort comparator transitivity
- Add `floorDivide` zero-divisor handling or triality variants
- Fix `Vector2.isUnit` (magnitude-based) vs `Complex.isUnit` (magnitudeSq-based) inconsistency
- Fix `Complex.reciprocated` getter behavioral mismatch with `reciprocal()` method
- Fix `nearEquals` not validating epsilon non-negative (unlike `relativeEquals`)
- Fix `robustSum`/`neumaierSum` parameter type to `readonly number[]`
- Document `Rotation2.NEGATIVE_QUARTER` and `THREE_QUARTER_TURN` as aliases of identical value
- Document `Interval.hull` overload parameter ambiguity

### Random Source Quality (P3)

- Upgrade `SeededRandomSource` LCG (Park-Miller, period 2^31-2) to higher-quality PRNG
- Fix `nextInt` modulo bias for large `max` values
- Add `nextInt` parameter validation for non-positive or non-integer `max`
- Fix `SeededRandomSource` default seed collision within same millisecond
- Fix `randomOnTriangle` division-by-zero for degenerate (zero-perimeter) triangles
- Fix `randomTransform2` not resetting scale on provided `out` parameter

## Capabilities

### New Capabilities

- `complex-robust-division`: Numerically stable complex division via Smith/Baudin-Smith algorithm, replacing the naive `c²+d²` denominator formula that overflows for `|z| > ~1e154`
- `safe-function-contracts`: Formal behavioral invariants for the `*Safe` function family — defines the contract that safe functions must never return non-finite values for finite inputs, and validates/fixes all violations
- `angle-computation-accuracy`: Correctness fixes for angle interpolation (lerpAngle sign), difference (anti-symmetry), unwrapping (precision drift), and boundary semantics (isAngleBetween, clampAngle)
- `random-source-quality`: PRNG quality upgrade from Park-Miller LCG to a modern generator, fixing modulo bias, seed collision, and degenerate-input handling

### Modified Capabilities

- `determinism-guarantees`: Add pow2 subnormal handling, atan2 signed-zero compliance, range reduction improvement, log boundary adjustment, config export, logSafe naming
- `core-types-api`: Add Complex edge-case guards, Matrix documentation accuracy, Transform2 inverse documentation, Rotation2 normalization docs, ortho validation, API corrections
- `edge-case-coverage`: Add ~25 NaN/-0/Infinity behaviors, zero-vector guards, assertRange NaN, type guard documentation
- `numerical-foundations`: Fix inverseLerp/Interval.divide thresholds, lerp endpoint exactness, compensatedProduct/remap documentation
- `serialization-correctness`: Fix parse scientific notation, JSON validity for non-finite, parseInterval error propagation
- `performance-architecture`: Fix holey arrays, double computations, intermediate allocations across 10+ hot paths
- `api-consistency-triality`: Fix compare NaN, floorDivide triality, isUnit consistency, reciprocated getter, parameter types

## Impact

**Affected Layers (all 6):**

- `deterministic/` — 5 kernel function fixes (pow2, atan2, sin/cos range reduction, log, exp)
- `auxiliary/` — 15+ function fixes across angle/, numeric/, scalar/
- `core/` — All 7 core types affected (Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3, Transform2)
- `types/` — Documentation additions for type guards
- `validation/` — assertRange NaN fix
- `utils/` — Parse regex updates, format JSON validity, random source upgrade

**Breaking Changes:**

- `Transform2.inverse` output changes for non-uniform scale inputs
- Complex division results change at numerical boundaries (more accurate)
- `compare(NaN, x)` return value changes from `0` to consistent ordering position
- `powSafe(0, -n)` return value changes from `0` to `Infinity`

**Bundle Size:** Minimal impact. Smith's algorithm adds ~20 lines. PRNG upgrade replaces existing code. Most changes are fixes to existing logic, not new code.

**Tree-Shaking:** No impact. Changes are within existing function bodies and validated assertion patterns.

**Determinism:** All fixes maintain or strengthen L0 determinism. The atan2, pow2, and range reduction fixes specifically improve cross-platform bit-exactness.

**Rollback Plan:** Each capability is independently deployable. If deterministic kernel changes produce unexpected results in downstream consumers, the `config.useNativeMath = true` escape hatch bypasses all custom kernels. Breaking changes are gated behind a semver minor bump (v0.7.0).

**Test Impact:** Estimated 200+ new test cases across unit and property-based tests. All existing tests must continue to pass (except those that assert currently-incorrect behavior, which will be updated).
