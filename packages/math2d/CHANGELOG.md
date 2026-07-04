# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [Unreleased]

### BREAKING CHANGES

- **BREAKING (distribution only, zero API change)**: the published ESM and CJS outputs are now multi-module trees with preserved module boundaries instead of single pre-bundled files; `module.js` and every subpath entry remain at their existing paths as thin facades. Import statements are unchanged; consumer bundlers now eliminate whole modules (a single-type import drops from ~27 KB to ~6.6 KB gzip, −76%). See `DESIGN_DECISIONS.md` ADR-020.
  - **Migration**: none — import statements and the public API are unchanged.

- **Build target**: raised to ES2022 (native class static fields); frozen constants carry pure-call annotations preserved through minification.
  - **Migration**: consumers targeting environments without ES2022 support must transpile the package themselves.

- **Transform2.inverse**: Fixed position computation order from `R⁻¹ · S⁻¹ · t` to `S⁻¹ · R⁻¹ · t` (apply inverse rotation first, then inverse scale). Previous inverse results were mathematically incorrect for non-uniform scale transforms.
  - **Migration**: Results are now correct; if you were compensating for the bug, remove the workaround. For exact point recovery with non-uniform scale, use `inverseTransformPoint` or `Matrix3.inverse` via `toMatrix3()`.

- **compare(NaN, ...)**: NaN now sorts after everything (`compare(NaN, x) → 1`, `compare(x, NaN) → -1`) instead of returning 0. This provides stable sorting when NaN values are present.
  - **Migration**: If you relied on `compare(NaN, x) === 0`, update your code. Use explicit NaN checks if you need to treat NaN as equal to finite values.

- **Complex.divide**: Now uses Smith's algorithm with Baudin-Smith pre-scaling for robust division. Results may differ slightly in extreme cases (near-overflow/underflow magnitudes).
  - **Migration**: Results are more accurate; no changes needed unless you relied on the specific overflow behavior of the naive algorithm.

- **SeededRandomSource**: Replaced Park-Miller LCG with xoshiro128++ algorithm. Sequences generated with the same seed will produce different values. State is now a 4-element uint32 array. `setState` renamed to `restoreState`, `getState` returns `[s0, s1, s2, s3]`.
  - **Migration**: If you stored seeded sequences for replay, regenerate them. Update `setState(n)` calls to `restoreState([s0, s1, s2, s3])` using saved state from `getState()`.

- **Interval.fromArray / Interval.fromObject**: Now validate `min <= max` order, consistent with `Interval.fromValues()`. Previously, reversed inputs (e.g., `fromArray([5, 2])`) silently created invalid intervals with corrupted `width()`, `contains()`, and `overlaps()` behavior.
  - **Migration**: Use `Interval.fromUnsorted(a, b)` for data with unknown ordering.

### Features

- **Matrix2.svd**: Closed-form 2×2 Singular Value Decomposition `M = U · Σ · Vᵀ` via the Demmel-Kahan 1990 closed-form algorithm. Returns `SvdResult` with proper-rotation factors `U`, `V` and signed singular values `(σ_x, σ_y)` under Convention A (`σ_x ≥ 0`, `σ_y` signed by reflection sign of `M`, with `det(M) = σ_x · σ_y` exact).
- **Matrix2.pseudoInverse**: Moore-Penrose pseudo-inverse `M⁺ = V · diag(σ⁺) · Uᵀ` via SVD, with default tolerance `2 · |σ_max| · ε` (Higham 2002 §5.5.5). Returns the unique pseudo-inverse satisfying the four Penrose 1955 axioms; silent regularisation (no throw on singular).
- **Matrix2.polarDecompose**: Polar decomposition `M = R · S` under Convention A. `R` is **always** a proper rotation (`det(R) = +1`); `S` is symmetric exactly (`S.m01 === S.m10`) and positive-semi-definite when `det(M) ≥ 0` / indefinite when `det(M) < 0`. See `EDGE_CASES.md §10.5` for the Convention A vs textbook polar contrast.
- **Matrix2.conditionNumber**: 2-norm condition number `κ₂(M) = σ_max / |σ_min|` (Turing 1948, Wilkinson 1965). Returns `+Infinity` for singular input per IEEE 754 §7.2; NaN propagates per IEEE 754 §6.2.
- **Rotation2.fromMatrix2Closest**: Closest proper rotation to `matrix` in Frobenius norm (orthogonal Procrustes — Schönemann 1966, Kabsch 1976). Computed as `R = U · Vᵀ`. Always returns a proper rotation; deterministic identity for the zero-matrix input.
- **`SvdResult` and `PolarDecomposeResult`**: New result type exports for the decomposition methods.
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
- **lerp**: Added endpoint exactness guards for both `t === 0` and `t === 1` (strict equality, preserving extrapolation); the `t === 0` guard also prevents `NaN` when an endpoint is non-finite, since `a + (b − a) * 0` would evaluate `∞ × 0 = NaN`
- **lerpAngle endpoint guards**: Added `t === 0` / `t === 1` short-circuits so a non-finite endpoint returns the finite endpoint instead of `NaN` (the guard runs before `from + angleDifference(from, to) * t`)
- **Interpolation family endpoint exactness**: `Vector2.slerp`, `Complex.slerp`, `Rotation2.lerp`, and `Transform2.lerp` / `smoothStep` now return the endpoint as an IEEE 754 bit-identical value at `t === 0` / `t === 1`; `Rotation2.lerp` copies the endpoint `(cos, sin)` directly, reproducing a non-unit `*Like` endpoint verbatim
- **remap**: Added endpoint guards for drift prevention
- **inverseLerp**: Changed to strict zero check for zero-range detection
- **assertRange**: Fixed NaN passthrough
- **Matrix3.ortho**: Added zero-guard, created orthoSafe fallback
- **formatComplex**: Fixed negative-zero imaginary display
- **parseComplex**: Added scientific notation support, tightened decimal regex

### Performance

- **Library-side DCE for assertions (Model B)**: development assertions are now eliminated at the library build step via the build-time constant substitution of `__LENGUADOS_DEV__` (configured in `rollup.config.mjs`). Production library bundles (`lib/cjs/index.production.js`, `lib/esm/module.js`) are self-contained — zero assertion call sites, zero assertion-failure label strings, zero assertion bodies — regardless of the consumer's bundler. Bundle size reduced by approximately 17% (161.96 KB → 135 KB CJS); tree-shake-effectiveness metric improved correspondingly. See `DESIGN_DECISIONS.md` ADR-017 for the model rationale.
- **unwrapAngles**: Replaced holey array with filled array
- **Matrix3.fromArray**: Removed intermediate array allocation
- **Rotation2.set**: Inlined normalization to avoid object allocation
- **Vector2.normalize**: Uses `scale(1/length)` instead of `divideScalar`
- **Rotation2.fromVector2**: Uses `Math.sqrt(magSq)` instead of redundant `hypot`
- **Rotation2.fromVectors2**: Inlined cross/dot computation, eliminating two temporary allocations
- **Complex.fromPolar**: Removed redundant `normalizeRadians` before periodic `sinCos`
- **Vector2/Complex.smoothStep**: Removed redundant outer `saturate(t)` call

# [0.6.0](https://github.com/rndelpuerto/lenguados/compare/v0.5.0...v0.6.0) (2025-09-27)

### Features

- **math2d:** add 'scalar' module ([bac1fc9](https://github.com/rndelpuerto/lenguados/commit/bac1fc9d1b4b013d1d2636a7f88d16899da64704))
- **math2d:** add Vector2 and Mat2; update README ([49c135e](https://github.com/rndelpuerto/lenguados/commit/49c135ee4528c970745f01fd26e798411d6a606b))

# [0.5.0](https://github.com/rndelpuerto/lenguados/compare/v0.4.0...v0.5.0) (2025-04-30)

### Features

- **math2d:** add 'scalar' module ([bac1fc9](https://github.com/rndelpuerto/lenguados/commit/bac1fc9d1b4b013d1d2636a7f88d16899da64704))
