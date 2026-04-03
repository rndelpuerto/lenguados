## Why

The @lenguados/math2d package has grown to ~96K lines across 31 source files spanning 6 architectural layers. A line-by-line audit verified by code execution, cross-referenced against existing tests, and validated against 15+ authoritative external sources (IEEE 754, C standard, Box2D, Unity, MATLAB, Christer Ericson, Bruce Dawson/Valve, gl-matrix, Godot, Bullet Physics, numpy, Python PEP 485, Eigen, Wikipedia principal argument) revealed:

1. A **non-standard angle normalization convention** `[-PI, PI)` that contradicts IEEE 754 atan2, the mathematical principal argument, and every major physics engine — causing 5 TSDoc value bugs and an internal inconsistency with atan2 round-trips
2. Additional TSDoc bugs with wrong API signatures (8 instances across Matrix2/Matrix3)
3. Dead/phantom exports causing runtime failures
4. Minor API gaps vs industry consensus
5. Design inconsistencies worth resolving before the library matures further

This audit is needed now because the library is pre-1.0. Fixing the convention and these issues before wider adoption prevents breaking changes later.

## What Changes

### Convention Alignment (root cause fix)

- **BREAKING** Change `normalizeRadians` from `[-PI, PI)` to `(-PI, PI]` — the standard convention used by IEEE 754/atan2, C standard, MATLAB wrapToPi, Unity, Box2D, Bullet Physics, and the mathematical principal argument Arg(z). This is a 1-line code change (`result === -PI ? PI : result`) that automatically fixes 5 of the 6 TSDoc value bugs and eliminates the atan2 round-trip inconsistency.
- **BREAKING** Same change for `normalizeDegrees`: `[-180, 180)` → `(-180, 180]`

### TSDoc Corrections (remaining bugs not fixed by convention change)

- Fix `relativeEquals(0.001, 0.002, 0.01)` example: documented as `false`, actually `true` due to Christer Ericson's `max(1, |a|, |b|)` combined tolerance pattern (verified against _Real-Time Collision Detection_, numpy.allclose, Bruce Dawson/Valve)
- Fix `Matrix2.fromScale(2, 2)` — 3 instances using wrong signature (passes `out=number`, causes runtime crash)
- Fix `Matrix3.fromTranslation(10, 20)` — 5 instances using wrong signature (passes number instead of ReadonlyVector2Like, produces NaN)
- Fix `unwrapAngles([0, PI, 0])` — changes from `[0, PI, 0]` to `[0, PI, 2*PI]` (correct continuous unwrapping; old doc implied bouncing which contradicts unwrapper's purpose)

### Export & Build Hygiene

- **BREAKING** Remove phantom `package.json` subpath exports for non-existent `./deterministic/precision-math` and `./deterministic/rounding-control` (cause runtime import failures)
- Add proper `./deterministic` subpath export for the actual `deterministic-kernels` module
- Mark `pow2` as `@internal` in deterministic-kernels
- Remove `sinCos` from explicit deterministic re-exports (resolve barrel shadowing)
- Document `ReadonlySinCos` forward use

### API Completeness (reference library consensus)

- Add `Complex.addScalar` / `Complex.subtractScalar` (standard complex+real operation)
- Add `Rotation2.angleTo` instance method (symmetric with Vector2.angleTo)
- Add `lerpAngleClamped` to angle interpolation module

### Design Consistency

- Fix Complex instance `sqrt()` to use algebraic formula (matching static `Complex.sqrt`)
- Document `Rotation2.copy` normalization asymmetry
- Document `isParallel`/`isPerpendicular` scale-dependence

### Rollback Plan

The convention change and phantom export removal are the only breaking changes. The convention change only affects the exact PI boundary (±180°) — all non-boundary values are bit-identical. The phantom exports already fail at runtime. For deterministic guarantees: no changes to fdlibm coefficients or math algorithms.

## Capabilities

### New Capabilities

- `angle-convention-alignment`: Change normalizeRadians/normalizeDegrees from non-standard `[-PI, PI)` to industry-standard `(-PI, PI]`, validated against IEEE 754, C standard, MATLAB, Unity, Box2D, Bullet Physics, mathematical Arg(z)
- `documentation-correctness`: TSDoc examples contradicting runtime behavior (1 value bug from Ericson pattern + 8 API signature bugs in Matrix2/Matrix3) plus updating all angle-related docs to reflect new convention
- `api-completeness-gaps`: Missing methods identified by cross-referencing 15+ libraries (Complex.addScalar, Rotation2.angleTo, lerpAngleClamped)
- `export-hygiene`: Package.json phantom exports, barrel conflicts, accidentally public internals
- `design-consistency`: Complex.sqrt path, Rotation2.copy normalization, scale-dependent comparisons

### Modified Capabilities

<!-- No existing specs are being modified - this is the first audit -->

## Impact

- **Affected code files**: `normalization.ts` (2 lines of code change), `package.json` (exports), `complex.ts` (sqrt + addScalar), `rotation2.ts` (angleTo), `interpolation.ts` (lerpAngleClamped), `deterministic-kernels.ts` (pow2 @internal), `index.ts` (sinCos shadowing), `types/index.ts` (ReadonlySinCos docs)
- **Affected TSDoc files**: `normalization.ts`, `operations.ts`, `unwrapping.ts`, `interpolation.ts`, `comparison.ts`, `rotation2.ts`, `matrix2.ts`, `matrix3.ts`, `vector2.ts`
- **NOT affected**: All core math types (Vector2, Matrix2, Matrix3, Transform2, Interval, Complex — none use normalizeRadians directly), deterministic kernels, scalar utilities, numeric utilities, normalizeRadiansPositive/normalizeDegreesPositive
- **Bundle size**: Minimal impact (~3 new methods, 2 lines of convention fix)
- **Breaking changes**: Convention change (only exact PI boundary) + phantom export removal (already broken)
- **Deterministic guarantees**: Not affected
