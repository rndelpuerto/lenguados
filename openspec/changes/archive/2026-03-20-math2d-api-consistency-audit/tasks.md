# Tasks: math2d-api-consistency-audit

> **Note:** Requirements R1-R7 (api-consistency-patterns spec) are architectural governance rules applied across all phases, not standalone tasks. R1 (\*Like interfaces) is implemented by Phase 3. R2 (validation tiers) is implemented by Phase 4 tasks 4.3, 4.4. R5 (hot-path allocation) is implemented by Phase 2. R6 (lerp documentation) is implemented by Phase 1 task 1.3. R7 (zero-detection) is implemented by Phase 1 task 1.1. R3 and R4 are consistency rules verified during final review (task 5.2).

## Phase 1: Foundation & Correctness (WP-0 + WP-1)

### 1.1 Complex.reciprocal Threshold Consistency (D2 — revised)

- [x] 1.1.1 Change instance `reciprocal()` to use `magnitude` instead of `magnitudeSq` for zero-detection — `complex.ts:~1790`
- [x] 1.1.2 Change instance `reciprocalSafe()` to use `magnitude` for consistency — `complex.ts:~1810`
- [x] 1.1.3 Verify static and instance `reciprocal` produce identical results for edge cases near zero (|z| between 1e-10 and 3.16e-6)
- [x] 1.1.4 Add test: `Complex(5e-6, 0)` reciprocal must succeed (not treated as zero); both static and instance must agree

### 1.2 Interval Correctness Fixes

- [x] 1.2.1 Fix `Interval.center()` static: change `(interval.min + interval.max) * 0.5` to `interval.min + (interval.max - interval.min) * 0.5` — `interval.ts:~1098`
- [x] 1.2.2 Fix `Interval.center()` instance (getter): same overflow-safe formula — `interval.ts:~1359`
- [x] 1.2.3 Fix `Interval.hull()` array overload: replace `second as Interval | undefined` with `instanceof Interval` check — `interval.ts:~1140`
- [x] 1.2.4 Add test: `Interval.center(Interval.fromValues(1e308, 1e308))` must return `1e308`, not `Infinity`

### 1.3 lerp Documentation Corrections (D5)

- [x] 1.3.1 Fix Matrix2.lerp JSDoc: remove "clamped" from `t` parameter description — `matrix2.ts` static lerp
- [x] 1.3.2 Fix Matrix2.lerp instance JSDoc: same correction — `matrix2.ts` instance lerp
- [x] 1.3.3 Fix Matrix2.lerpClamped JSDoc: change "alias for lerp which already clamps" to "clamps t to [0,1] before interpolating" — `matrix2.ts`
- [x] 1.3.4 Fix Matrix3.lerp static and instance JSDoc: same as Matrix2 — `matrix3.ts`
- [x] 1.3.5 Fix Matrix3.lerpClamped JSDoc: same as Matrix2 — `matrix3.ts`
- [x] 1.3.6 Fix Interval.lerp static JSDoc: remove "clamped" from `t` parameter — `interval.ts`
- [x] 1.3.7 Fix Transform2 doc example: replace `t.setPosition(10, 20).setRotation(...).setScale(...)` with `t.position.set(10, 20); t.rotation.setAngle(...); t.scale.set(2, 2)` — `transform2.ts:~110`

### 1.4 Run Tests After Phase 1

- [x] 1.4.1 Run `npm run test:unit` — all 3267 tests pass

---

## Phase 2: Performance — Hot-Path Allocation Elimination (WP-2) (D4)

### 2.1 complexDivideSmith Refactor

- [x] 2.1.1 Change `complexDivideSmith` signature from returning `[number, number]` to accepting `out: Complex` and writing directly to `out.real`/`out.imag` — `complex.ts:~150-173`
- [x] 2.1.2 Update all 3 callers (`divide`, `divideSafe`, `divideUnchecked`) to pass `out` parameter instead of destructuring — `complex.ts:~546, ~572, ~598`
- [x] 2.1.3 Verify bit-identical results with existing tests (especially extreme-value tests for Smith algorithm underflow protection)

### 2.2 Interval.multiply Array Elimination

- [x] 2.2.1 Replace static `multiply` array allocation with 4 local variables + `Math.min`/`Math.max` — `interval.ts:~469`
- [x] 2.2.2 Replace instance `multiply` array allocation with same pattern — `interval.ts:~1487`

### 2.3 Transform2 Inline Rotation Math

- [x] 2.3.1 Inline rotation multiply in static `Transform2.multiply`: compute `cos = a.cos*b.cos - a.sin*b.sin, sin = a.sin*b.cos + a.cos*b.sin` directly — `transform2.ts:~537`
- [x] 2.3.2 Inline rotation inverse in static `Transform2.inverse`: use `invCos = rotation.cos, invSin = -rotation.sin` — `transform2.ts:~587`
- [x] 2.3.3 Inline rotation inverse in static `Transform2.inverseSafe` — `transform2.ts:~634`
- [x] 2.3.4 Inline rotation inverse in static `Transform2.inverseUnchecked` — `transform2.ts:~673`
- [x] 2.3.5 Verify instance and static versions produce identical results via property-based tests

### 2.4 frobeniusNorm Optimization

- [x] 2.4.1 Replace `sqrtSafe(...)` with `Math.sqrt(...)` in Matrix2.frobeniusNorm — `matrix2.ts:~1632`
- [x] 2.4.2 Replace `sqrtSafe(...)` with `Math.sqrt(...)` in Matrix3.frobeniusNorm — `matrix3.ts:~1890`
- [x] 2.4.3 Same for instance frobeniusNorm methods if they exist

### 2.5 Run Tests After Phase 2

- [x] 2.5.1 Run `npm run test:unit` — all tests must pass with bit-identical results

---

## Phase 3: Type Consistency (WP-3) (D3, D7)

### 3.1 Interval Instance Methods — ReadonlyIntervalLike

- [x] 3.1.1 Change parameter types in these Interval instance methods from `ReadonlyInterval` to `ReadonlyIntervalLike`: `copy`, `add`, `subtract`, `multiply`, `overlaps`, `isSubsetOf`, `intersect`, `union`, `exactEquals`, `nearEquals`, `lerpInterval` — `interval.ts`

### 3.2 Matrix2 Instance — ReadonlyVector2Like

- [x] 3.2.1 Change `Matrix2.transformVector` instance parameter from `ReadonlyVector2` to `ReadonlyVector2Like` — `matrix2.ts:~2871`

### 3.3 Complex Static — ReadonlyComplexLike

- [x] 3.3.1 Change `Complex.clone` static parameter from `ReadonlyComplex` to `ReadonlyComplexLike` — `complex.ts:~445`
- [x] 3.3.2 Change `Complex.copy` static parameter from `ReadonlyComplex` to `ReadonlyComplexLike` — `complex.ts`
- [x] 3.3.3 Audit remaining Complex static methods for concrete type usage and widen to \*Like where applicable

### 3.4 assert\*Like — TypeScript asserts Return Types (D7)

- [x] 3.4.1 Add `asserts value is Vector2Like` to `assertVector2Like` — `validation/assert.ts:~741`
- [x] 3.4.2 Add `asserts value is Rotation2Like` to `assertRotation2Like` — `validation/assert.ts:~776`
- [x] 3.4.3 Add `asserts value is Matrix2Like` to `assertMatrix2Like` — `validation/assert.ts:~811`
- [x] 3.4.4 Add `asserts value is Matrix3Like` to `assertMatrix3Like` — `validation/assert.ts:~848`
- [x] 3.4.5 Add `asserts value is ComplexLike` to `assertComplexLike` — `validation/assert.ts:~885`
- [x] 3.4.6 Add `asserts value is IntervalLike` to `assertIntervalLike` — `validation/assert.ts:~921`
- [x] 3.4.7 Add `asserts value is Transform2Like` to `assertTransform2Like` — `validation/assert.ts:~961`

### 3.5 Format Function Input Types

- [x] 3.5.1 Widen input types in 6 format functions in `utils/parse.ts` from branded `Readonly*` to `Readonly*Like`: `formatVector2` (L146: `ReadonlyVector2` → `ReadonlyVector2Like`), `formatMatrix2` (L384: `ReadonlyMatrix2` → `ReadonlyMatrix2Like`), `formatMatrix3` (L519: `ReadonlyMatrix3` → `ReadonlyMatrix3Like`), `formatTransform2` (L669: `ReadonlyTransform2` → `ReadonlyTransform2Like`), `formatComplex` (L804: `ReadonlyComplex` → `ReadonlyComplexLike`), `formatInterval` (L923: `ReadonlyInterval` → `ReadonlyIntervalLike`). Note: `formatRotation2` (L266) already uses `ReadonlyRotation2Like` — no change needed.

### 3.6 Run Tests After Phase 3

- [x] 3.6.1 Run `npm run test:unit` — all tests must pass
- [x] 3.6.2 Run `npm run build` — TypeScript compilation must succeed with widened types

---

## Phase 4: API Surface Parity (WP-4 + WP-5) (D6)

### 4.1 Matrix2 Static Decomposition

- [x] 4.1.1 Add `Matrix2.getRotation(matrix: ReadonlyMatrix2Like): number` static method — returns `atan2(matrix.m01, matrix.m00)`, following Matrix3.getRotation pattern
- [x] 4.1.2 Add `Matrix2.getScale(matrix: ReadonlyMatrix2Like, out?: Vector2): Vector2` static method — returns `(hypot(m00, m01), hypot(m10, m11))`
- [x] 4.1.3 Add tests for both methods including rotation matrices, scale matrices, and combined rotation+scale

### 4.2 Rotation2 Additions

- [x] 4.2.1 Add `Rotation2.fromMatrix2(matrix: ReadonlyMatrix2Like, out?: Rotation2): Rotation2` — extracts angle via `atan2(m01, m00)`, constructs via `fromAngle`
- [x] 4.2.2 Add round-trip test: `Rotation2.fromMatrix2(rotation.toMatrix2()) ~ rotation`
- [x] 4.2.3 Add `@remarks` note to `Rotation2.lerp` JSDoc: "For 2D rotations represented as unit complex numbers, lerp is equivalent to slerp (spherical linear interpolation)."

### 4.3 Vector2 Additions

- [x] 4.3.1 Add `vector.setMagnitudeUnchecked(magnitude)` instance method
- [x] 4.3.2 Add `vector.reflectUnchecked(normal)` instance method
- [x] 4.3.3 Add `vector.directionToSafe(target)` instance method
- [x] 4.3.4 Add tests for new tier variants: setMagnitudeUnchecked (zero vector → NaN), reflectUnchecked (no unit check), directionToSafe (coincident → zero fallback)

### 4.4 Complex Additions

- [x] 4.4.1 Add `Complex.divideScalar(z, scalar, out?)` static — `z.real / scalar, z.imag / scalar`
- [x] 4.4.2 Add `Complex.divideScalarSafe(z, scalar, out?)` static — returns zero for near-zero scalar
- [x] 4.4.3 Add `Complex.divideScalarUnchecked(z, scalar, out?)` static — no validation
- [x] 4.4.4 Add instance counterparts: `divideScalar`, `divideScalarSafe`, `divideScalarUnchecked`
- [x] 4.4.5 Add `Complex.fromVector2(v: ReadonlyVector2Like, out?)` static factory — maps `(x, y)` -> `(real, imag)`
- [x] 4.4.6 Add tests for all new methods

### 4.5 Interval Additions

- [x] 4.5.1 Add `Interval.abs(interval, out?)` static — Moore's definition: 3-case (all-positive, crosses zero, all-negative)
- [x] 4.5.2 Add instance `abs()` — mutates this
- [x] 4.5.3 Add `Interval.fromUnsorted(a, b, out?)` static — `fromValues(Math.min(a, b), Math.max(a, b), out)`
- [x] 4.5.4 Add tests: abs of [2,5]=[2,5]; abs of [-3,5]=[0,5]; abs of [-5,-2]=[2,5]; fromUnsorted(5,2)=[2,5]

### 4.6 Transform2 Additions

- [x] 4.6.1 Add `Transform2.transformDirection(transform, direction, out?)` static — applies rotation component only via `Rotation2.apply`. JSDoc: "applies rotation only, ignores scale and translation"
- [x] 4.6.2 Add `Transform2.transformDirectionCS(cos, sin, direction, out?)` static — CS variant
- [x] 4.6.3 Add instance `transformDirection(direction)` and `transformDirectionCS(cos, sin, direction)`
- [x] 4.6.4 Add `Transform2.inverseTransformDirection(transform, direction, out?)` static + instance + `inverseTransformDirectionCS(cos, sin, direction, out?)` CS variant
- [x] 4.6.5 Add `transform.premultiply(other)` instance — computes `this = other × this` (reverse multiplication order)
- [x] 4.6.6 Add tests: transformDirection must apply rotation only (ignore translation and scale); premultiply must be equivalent to `Transform2.multiply(other, this)`

### 4.7 Run Tests After Phase 4

- [x] 4.7.1 Run `npm run test:unit` — all old + new tests must pass
- [x] 4.7.2 Run `npm run lint` — all new methods must pass ESLint doc enforcement rules

---

## Phase 5: Structural Cleanup (WP-6) (D8 only — D9 rejected)

### 5.1 SinCos Interface Relocation (D8)

- [x] 5.1.1 Move `SinCos` interface definition from `auxiliary/angle/operations.ts` to `types/index.ts`
- [x] 5.1.2 Update `deterministic-kernels.ts` import: `import type { SinCos } from '../types'` instead of `'../auxiliary/angle/operations'`
- [x] 5.1.3 Update `auxiliary/angle/operations.ts` to import and re-export `SinCos` from `types/`
- [x] 5.1.4 Verify no circular dependency introduced

### 5.2 Final Verification

- [x] 5.2.1 Run `npm run test:unit` — complete test suite
- [x] 5.2.2 Run `npm run lint` — zero errors, zero warnings
- [x] 5.2.3 Run `npm run build` — clean build
- [x] 5.2.4 Verify all new methods have proper JSDoc with @category, @since, @example tags

---

## Changes from Original Tasks (Adversarial Review Outcomes)

### REMOVED Tasks (D1 overruled — set() keeps normalizing):

- ~~1.1.1 Change Rotation2.set() to raw assignment~~
- ~~1.1.2 Add Rotation2.setNormalized()~~
- ~~1.1.3 Update fromVector2 to call setNormalized()~~
- ~~1.1.4 Update fromVectors2 to call setNormalized()~~
- ~~1.1.5 Update fromComplex/fromComplexSafe to call setNormalized()~~
- ~~1.1.6 Verify all other set() callers~~
- ~~1.1.7 Update tests for raw set() behavior~~
- ~~1.1.8 Run test suite for normalization change~~

### REMOVED Tasks (D9 overruled — lerpSafe stays):

- ~~5.1.1 Move lerpSafe from numeric/safety.ts to scalar/interpolation.ts~~
- ~~5.1.2 Add re-export from numeric/safety.ts~~
- ~~5.1.3 Add @deprecated JSDoc on re-export~~

### MODIFIED Tasks (D2 revised — targeted fix, not blanket rule):

- 1.1.1-1.1.4 now target only Complex.reciprocal/reciprocalSafe instance methods (was broader)

### REMOVED Tasks (Agnostic Library Review — moveTowards is a game utility, not a math primitive):

- ~~4.3.1 Add Vector2.moveTowards static method~~
- ~~4.3.2 Add vector.moveTowards instance method~~
- ~~4.3.6 Add tests for moveTowards~~

### REMOVED Tasks (Agnostic Library Review — slerp imports 3D quaternion terminology into 2D context):

- ~~4.2.2 Add Rotation2.slerp static alias~~
- ~~4.2.3 Add Rotation2.slerpClamped static alias~~
- ~~4.2.4 Add instance slerp/slerpClamped aliases~~

### ADDED Tasks:

- 1.1.4 (new) Add test for Complex(5e-6, 0) static/instance parity
- 4.2.3 (new) Add @remarks note to Rotation2.lerp JSDoc about slerp equivalence
