## Why

Post-audit analysis of @lenguados/math2d revealed residual API inconsistencies, incomplete pattern coverage, and testing gaps that undermine the library's rigor. The tech-debt-audit (66 tasks) addressed correctness issues; this change addresses **completeness and coherence** — ensuring every pattern established in the library is applied uniformly, every fallible operation has three tiers, every public method exists in both static and instance form, and every tolerance choice is traceable. External comparison with glam (Rust), three.js, Unity, gl-matrix, and Eigen confirms our patterns are sound but incompletely applied.

## What Changes

### API Consistency (core/ layer)

- **Complete triality for Interval.sqrt**: Add `sqrtSafe()` and `sqrtUnchecked()` — currently `sqrt()` throws on negative intervals with no safe fallback
- **Complete triality for Matrix mod operations**: Add static `mod()` and `modScalar()` to Matrix2 and Matrix3 — currently instance-only with no static equivalent
- **Fix Complex.get normalized fallback**: Change from `(0,0)` to `(1,0)` for zero-magnitude input — **BREAKING** — aligns with `normalizeSafe()` and matches three.js/Unity pattern of returning identity for algebraic types (Quaternion → identity, Complex → multiplicative identity)
- **Add \*CS factory variants**: `Complex.fromPolarCS(magnitude, cos, sin)` and `Rotation2.fromCS(cos, sin)` for hot paths where trig is pre-computed
- **Complete Instance ↔ Static parity for Matrix2**: Add instance `compose()`, `decompose()`; add static `premultiply()`
- **Complete Instance ↔ Static parity for Matrix3**: Add instance `decompose()`; add static `premultiply()`, `transformPoints()`, `transformVectors()`, `isAffine()` (note: `getTranslation()`, `getScale()`, `getRotation()` remain instance-only per D4 — accessor-style methods)
- **Add static Interval.sample()**: Currently instance-only

### Documentation (auxiliary/, core/ layers)

- **Categorize tolerance constants**: Document in each function's JSDoc which tolerance constant it uses (EPSILON, MIN_SAFE_DIVISOR) with `@remarks` tag. Note: `Rotation2.lerp` slerp documentation already exists from v0.6.0 audit. ANGLE_EPSILON and ITERATIVE_TOLERANCE do not exist in the codebase — only EPSILON and MIN_SAFE_DIVISOR are used.

### Testing (test/ layer)

- **Add near-singular matrix boundary tests**: Matrix2/Matrix3 inverse with det → 0, inverseSafe with det = 0, Transform2 inverse with scale → 0
- **Raise core/ coverage to 95%+**: Target uncovered lines in complex.ts (85→95%), matrix2.ts (86→95%), matrix3.ts (86→95%), interval.ts (89→95%)

### Migration Policy

This is a v0.6.0 → v0.7.0 transition. No legacy code, deprecated aliases, or backward-compatibility shims will be shipped. Only the final API surface exists in v0.7.0. Breaking changes are clean breaks — consumers on v0.6.0 can pin their version and migrate at their own pace. Pre-1.0 semver allows breaking changes in minor releases.

### Rollback Plan

No changes affect deterministic guarantees. All changes are in the core/ API surface (method signatures, fallback values) and test layer. The only breaking change is `Complex.get normalized` fallback value `(0,0)` → `(1,0)`, which can be reverted by restoring the single `if` branch. No fdlibm kernels, no auxiliary layer algorithms are modified.

## Capabilities

### New Capabilities

- `near-singular-boundaries`: Boundary tests for matrix inversion and transform operations near degenerate inputs (det → 0, scale → 0)
- `tolerance-traceability`: Explicit documentation mapping each tolerance-using function to its tolerance constant category

### Modified Capabilities

- `api-consistency-triality`: Add Interval.sqrt triality, Matrix mod static equivalents, Complex.get normalized identity fallback
- `core-types-api`: Add \*CS factory variants, complete Instance ↔ Static parity for Matrix2/Matrix3/Interval
- `edge-case-coverage`: Raise core/ coverage to 95%+, add near-singular boundary tests
- `performance-architecture`: \*CS factory variants for Complex/Rotation2 hot paths

## Impact

- **Affected code**: `packages/math2d/src/core/` (complex.ts, matrix2.ts, matrix3.ts, interval.ts, rotation2.ts), `packages/math2d/src/auxiliary/` (JSDoc only)
- **Affected tests**: `packages/math2d/test/core/`, `packages/math2d/test/boundaries/` (new file), `packages/math2d/test/properties/`
- **Breaking change**: `Complex.get normalized` returns `(1,0)` instead of `(0,0)` for zero-magnitude — consumers relying on `(0,0)` fallback must update
- **Bundle size**: Net increase from new methods (~20 static + ~10 instance), mitigated by tree-shaking. No impact on production validation stripping.
- **No impact on**: deterministic layer, types layer, validation layer, utils layer
