# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **math2d**: Complete modular architecture -- 6 layers (deterministic, auxiliary, core, types, validation, utils) with 30+ source files replacing 3 monolithic modules
- **math2d**: Deterministic math kernels (`sin`, `cos`, `tan`, `atan2`, `exp`, `log`, `pow`) via fdlibm polynomial approximations for L0 bit-exact cross-platform results
- **math2d**: 5 new core types -- Rotation2, Complex, Interval, Matrix3, Transform2
- **math2d**: Auxiliary layer -- scalar (constants, arithmetic, comparison, interpolation), angle (conversion, normalization, operations, unwrapping), numeric (guards, rounding, safety, wrapping)
- **math2d**: Tree-shakeable validation layer with configurable assertions (`setAssertionsEnabled`), stripped from production via conditional exports
- **math2d**: Utility layer -- `SeededRandomSource` (xoshiro128++), parse/format functions, performance measurement
- **math2d**: `Complex.exp()`, `Complex.log()`, `Complex.toPolar()` for analytical 2D math
- **math2d**: `Complex.fromPolarCS()`, `Rotation2.fromCS()` hot-path factories from pre-computed cos/sin
- **math2d**: `Matrix2.fromAngleScale()` combined rotation+scale factory
- **math2d**: `Matrix3.getTranslation()`, `Matrix3.getScale()`, `Matrix3.getRotation()` decomposition methods
- **math2d**: 10 component-wise operations on Complex (abs, floor, ceil, round, trunc, sign, min, max, clamp, mod)
- **math2d**: `Transform2.COMPONENT_COUNT` constant
- **math2d**: `assertRotation2Normalized()` validation function
- **math2d**: Complete triality for `Interval.sqrt` (added `sqrtSafe`, `sqrtUnchecked`)
- **math2d**: Complete instance/static parity for Matrix2 and Matrix3
- **math2d**: `config` object exported for determinism toggle (`config.useNativeMath`)
- **tooling**: 4 custom ESLint rules for TSDoc enforcement (`enforce-category-vocabulary`, `enforce-required-tags`, `enforce-see-format`, `enforce-tag-fragments`)
- **tooling**: ESLint migrated from v8 to v9 (flat config)
- **math2d**: Comprehensive TSDoc DOCUMENTATION_STANDARD.md with 14 templates and canonical tag order

### Changed

- **BREAKING** -- **math2d**: `Vector2.magnitudeSquared` renamed to `magnitudeSq` (consistency with `Complex.magnitudeSq`)
- **BREAKING** -- **math2d**: `Rotation2.negate()` renamed to `conjugate()` (implementation does conjugation, not negation)
- **BREAKING** -- **math2d**: `Rotation2.inversed` getter renamed to `inverted` (consistency with Matrix2/Matrix3/Transform2)
- **BREAKING** -- **math2d**: Unified scalar multiplication to `multiplyScalar` across all 5 core types; removed ambiguous `scale` alias
- **BREAKING** -- **math2d**: `Complex.argument()` removed; `angle` is canonical (consistent with Vector2/Rotation2)
- **BREAKING** -- **math2d**: `Interval.divide`/`divideSafe`/`divideUnchecked` renamed to `divideScalar`/`divideScalarSafe`/`divideScalarUnchecked`
- **BREAKING** -- **math2d**: `Vector2.angle()` converted from instance method to `get angle()` / `set angle()` accessor pair
- **BREAKING** -- **math2d**: Renamed `fma` parameter `scale` to `scalar` across Vector2, Matrix2, Matrix3
- **math2d**: `Rotation2.fromMatrix2` precision improvement -- direct column extraction + normalize instead of atan2 round-trip
- **math2d**: Widened `randomOnSegment`, `randomInTriangle`, `randomOnTriangle` parameter types from `ReadonlyVector2` to `ReadonlyVector2Like`
- **math2d**: `formatMatrix3` nested format now includes outer brackets for consistency with Matrix2
- **deps**: Updated all dependencies (ESLint 8->9, commitlint 19->20, cross-env 7->10, typescript-eslint 8.30->8.49, Rollup plugins)

### Removed

- **BREAKING** -- **math2d**: `Rotation2.slerp` (identical to `lerp` in 2D; documented equivalence in lerp's TSDoc)
- **BREAKING** -- **math2d**: `Rotation2.angleValue` (duplicate of `angle` getter)
- **BREAKING** -- **math2d**: `Interval.NORMALIZED` (duplicate of `Interval.UNIT`)
- **BREAKING** -- **math2d**: Per-type EPSILON constants (Vector2, Complex, Matrix2, Matrix3) -- tolerance is scalar
- **BREAKING** -- **math2d**: `Complex.SQRT2`, `SQRT2_INV`, `PI`, `E` -- real scalar wrappers as Complex have no algebraic significance
- **BREAKING** -- **math2d**: `Matrix2.ONE`, `Matrix3.ONE` -- misleading name (not multiplicative identity), degenerate rank-1
- **BREAKING** -- **math2d**: `Matrix2.SCALE_2`/`SCALE_HALF`, `Matrix3.SCALE_2`/`SCALE_HALF` -- arbitrary; use `fromScale()`
- **BREAKING** -- **math2d**: `Interval.PERCENT` -- ambiguous (0-100 vs 0-1); `Interval.UNIT` covers normalized
- **BREAKING** -- **math2d**: `ITERATIVE_TOLERANCE`, `MAX_SAFE_INTEGER_F64`, `E`, `GOLDEN_RATIO`, `GOLDEN_RATIO_CONJUGATE` scalar constants -- zero consumers

### Fixed

- **math2d**: `Transform2.inverse` position computation order for non-uniform scale (`R^-1*S^-1*t` corrected)
- **math2d**: `lerpAngle` intermediate normalization sign inversion at PI boundary
- **math2d**: `pow2` IEEE 754 exponent construction for biased exponents <= -1022 (affected `exp()`)
- **math2d**: `atan2` signed-zero (`-0`) handling to match IEEE 754 semantics
- **math2d**: `Complex.slerp()` instance -- added zero-magnitude guard matching static version
- **math2d**: `Complex.reciprocal` instance using different zero-detection threshold vs static -- standardized
- **math2d**: `Interval.center()` overflow for extreme values -- changed from `(min+max)*0.5` to `min + (max-min)*0.5`
- **math2d**: `Interval.hull()` unsafe type cast in array overload form
- **math2d**: Deep freeze `Transform2.IDENTITY`, `FLIP_X`, `FLIP_Y` -- nested Vector2/Rotation2 were mutable despite `Object.freeze()`
- **math2d**: Epsilon inconsistency in `getLengthAndNormalize()` -- used `EPSILON*EPSILON` (1e-20) while all other normalize paths use `isNearZero()` (1e-10)
- **math2d**: `hypot()` used in `normalize()`/`normalizeSafe()` for Vector2 and Complex -- previously overflowed for components > 1e154
- **math2d**: Double normalization in `Rotation2.fromComplex()`
- **math2d**: Deterministic `exp` 2^k scaling (replaced fragile bit-manipulation with proper scalbn-style two-step multiply)
- **math2d**: Deterministic `sinCos` range reduction (Cody-Waite split for precision on large angles)
- **math2d**: Angle range reduction precision for |x| > 2^20\*PI
- **math2d**: `log` mantissa sqrt(2) boundary adjustment per fdlibm `e_log.c`
- **math2d**: Misleading `lerp` JSDoc in Matrix2, Matrix3, and Interval (claimed "clamped" but implementation is correctly unclamped)
- **math2d**: Eliminated tuple allocation in `complexDivideSmith` (every Complex division)
- **math2d**: Eliminated array allocation in `Interval.multiply` (replaced with 4 local variables)
- **math2d**: Inlined rotation math in `Transform2.multiply`/`inverse` static methods (eliminated temp allocations)
- **math2d**: Vector2 instance triality divergence -- `reject()`/`project()`/`reflect()` now match static counterpart validation behavior

## [0.6.0] - 2025-09-27

### Added

- **math2d**: Scalar module with constants, arithmetic, comparison, and interpolation utilities
- **math2d**: Vector2 and Matrix2 core types with full static and instance APIs

## [0.5.0] - 2025-04-30

### Added

- **math2d**: Scalar module (initial implementation)

## [0.4.0] - 2025-04-27

### Added

- **scaffold**: Cookiecutter template for new monorepo packages

## [0.3.4] - 2025-04-25

Version bump only for package lenguados.

[Unreleased]: https://github.com/rndelpuerto/lenguados/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/rndelpuerto/lenguados/compare/v0.4.0...v0.6.0
[0.5.0]: https://github.com/rndelpuerto/lenguados/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/rndelpuerto/lenguados/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/rndelpuerto/lenguados/releases/tag/v0.3.4
