# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [Unreleased] — Expert Review Fixes

### BREAKING CHANGES

- **Transform2.inverse**: Fixed position computation order from `R⁻¹ · S⁻¹ · t` to `S⁻¹ · R⁻¹ · t` (apply inverse rotation first, then inverse scale). Previous inverse results were mathematically incorrect for non-uniform scale transforms.
  - **Migration**: Results are now correct; if you were compensating for the bug, remove the workaround. For exact point recovery with non-uniform scale, use `inverseTransformPoint` or `Matrix3.inverse` via `toMatrix3()`.

- **compare(NaN, ...)**: NaN now sorts after everything (`compare(NaN, x) → 1`, `compare(x, NaN) → -1`) instead of returning 0. This provides stable sorting when NaN values are present.
  - **Migration**: If you relied on `compare(NaN, x) === 0`, update your code. Use explicit NaN checks if you need to treat NaN as equal to finite values.

- **Complex.divide**: Now uses Smith's algorithm with Baudin-Smith pre-scaling for robust division. Results may differ slightly in extreme cases (near-overflow/underflow magnitudes).
  - **Migration**: Results are more accurate; no changes needed unless you relied on the specific overflow behavior of the naive algorithm.

- **SeededRandomSource**: Replaced Park-Miller LCG with xoshiro128++ algorithm. Sequences generated with the same seed will produce different values. State is now a 4-element uint32 array. `setState` renamed to `restoreState`, `getState` returns `[s0, s1, s2, s3]`.
  - **Migration**: If you stored seeded sequences for replay, regenerate them. Update `setState(n)` calls to `restoreState([s0, s1, s2, s3])` using saved state from `getState()`.

### Features

- **xoshiro128++**: High-quality PRNG replacing Park-Miller LCG with SplitMix32 seed expansion
- **Rejection sampling**: Unbiased `nextInt(max)` replacing modulo-biased floor method
- **Smith's algorithm**: Robust complex division with Baudin-Smith pre-scaling
- **floorDivideSafe/floorDivideUnchecked**: Complete triality for floor division
- **Rotation2.nearEquals**: Optimized slow path using cross/dot products (avoids two atan2 calls)
- **Matrix3.inverseSafe**: Inlined cofactor computation to avoid double determinant calculation
- **Epsilon validation**: All comparison functions now throw RangeError for negative epsilon
- **setFromArray bounds checking**: Vector2, Complex, Matrix2, Matrix3 validate array bounds
- **State serialization**: `getState()`/`restoreState()` for save/load of random generator state
- **Object.freeze(Constants)**: Runtime immutability for the Constants namespace

### Bug Fixes

- **pow2**: Fixed subnormal handling for exponents ≤ -1022
- **atan2**: Fixed all 8 IEEE 754 signed-zero cases
- **log**: Added sqrt(2) boundary adjustment per fdlibm
- **lerpAngle**: Fixed to use `angleDifference` for correct shortest-path interpolation
- **Transform2.inverse**: Corrected position computation order
- **lerp**: Added endpoint exactness guard (`if (t === 1) return b`)
- **remap**: Added endpoint guards for drift prevention
- **inverseLerp**: Changed to strict zero check for zero-range detection
- **assertRange**: Fixed NaN passthrough
- **Matrix3.ortho**: Added zero-guard, created orthoSafe fallback
- **formatComplex**: Fixed negative-zero imaginary display
- **parseComplex**: Added scientific notation support, tightened decimal regex

### Performance

- **unwrapAngles**: Replaced holey array with filled array
- **Matrix3.fromArray**: Removed intermediate array allocation
- **Rotation2.set**: Inlined normalization to avoid object allocation
- **Vector2.normalize**: Uses `scale(1/length)` instead of `divideScalar`
- **Rotation2.fromVector2**: Uses `Math.sqrt(magSq)` instead of redundant `hypot`
- **Rotation2.fromVectors2**: Inlined cross/dot computation, eliminating two temporary allocations
- **Complex.fromPolar**: Removed redundant `normalizeRadians` before periodic `sinCos`
- **GOLDEN_RATIO**: Shared `Math.sqrt(5)` computation between constants
- **Vector2/Complex.smoothStep**: Removed redundant outer `saturate(t)` call

# [0.6.0](https://github.com/rndelpuerto/lenguados/compare/v0.4.0...v0.6.0) (2025-09-27)

### Features

- **math2d:** add 'scalar' module ([bac1fc9](https://github.com/rndelpuerto/lenguados/commit/bac1fc9d1b4b013d1d2636a7f88d16899da64704))
- **math2d:** add Vector2 and Mat2; update README ([49c135e](https://github.com/rndelpuerto/lenguados/commit/49c135ee4528c970745f01fd26e798411d6a606b))

# [0.5.0](https://github.com/rndelpuerto/lenguados/compare/v0.4.0...v0.5.0) (2025-04-30)

### Features

- **math2d:** add 'scalar' module ([bac1fc9](https://github.com/rndelpuerto/lenguados/commit/bac1fc9d1b4b013d1d2636a7f88d16899da64704))
