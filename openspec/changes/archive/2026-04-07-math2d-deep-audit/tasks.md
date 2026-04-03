## 1. Deterministic Layer Audit

- [x] 1.1 Read every file in `packages/math2d/src/deterministic/` line by line; list all exports with their signatures
- [x] 1.2 Verify each kernel (sin, cos, tan, asin, acos, atan, atan2, sqrt, exp, log, pow, hypot) uses fdlibm polynomial coefficients — no direct `Math.*` delegation
- [x] 1.3 Scan all import statements in `deterministic/` — confirm zero cross-layer imports (L0 isolation invariant)
- [x] 1.4 Verify `sinCos` returns `ReadonlySinCos` and is exported from the layer barrel
- [x] 1.5 Verify `config` export exists and toggles between deterministic and native Math.\* mode
- [x] 1.6 Trace `auxiliary/angle/operations.sinCos` — confirm it routes through `deterministic/sin` and `deterministic/cos`, not `Math.*`; file RESTRUCTURE verdict if not
- [x] 1.7 Check `expSafe` and `logSafe` — confirm they live in `deterministic/` (domain correction, not just input clamping); if `acosSafe`/`asinSafe` are in `deterministic/`, file RESTRUCTURE to `auxiliary/numeric/safety.ts`
- [x] 1.8 Produce `deterministic-layer-verdict.md` in `openspec/changes/math2d-deep-audit/verdicts/` listing each export with verdict: KEEP / ADD / REMOVE / RENAME / RESTRUCTURE

## 2. Auxiliary Layer Audit — Scalar

- [x] 2.1 Read `auxiliary/scalar/constants.ts` line by line; trace each constant to find all callers across `auxiliary/`, `core/`, `utils/`
- [x] 2.2 Verify `SMALLEST_NORMAL` has callers in scalar modules; if only used in numeric guard operations, file RESTRUCTURE verdict to `auxiliary/numeric/guards.ts`
- [x] 2.3 Compare `arithmetic.ts` exports (loop, mod) vs `numeric/wrapping.ts` exports (loop, mod, flooredMod) — document the semantic distinction; file REMOVE verdict for any true duplicate
- [x] 2.4 Verify `pingPong` matches Unity/Godot triangle-wave semantics; test with t=0,0.25,0.5,0.75,1.0,1.25,1.5
- [x] 2.5 Verify triality completeness: every fallible arithmetic function (remap, loop, pingPong, mod) has strict / Safe / Unchecked variants; non-fallible functions (clamp, sign, step) have NO triality variants
- [x] 2.6 Read `comparison.ts` line by line; verify `nearEquals`, `relativeEquals`, `compare` semantics against IEEE-754 conventions
- [x] 2.7 Read `interpolation.ts` line by line; verify `smoothStep` matches GLSL cubic Hermite definition and `smootherStep` matches quintic (Perlin) definition
- [x] 2.8 Produce `scalar-verdict.md` in verdicts/

## 3. Auxiliary Layer Audit — Angle

- [x] 3.1 Read all files in `auxiliary/angle/` line by line
- [x] 3.2 Verify `normalizeRadians` maps to (-π, π] and `normalizeRadiansPositive` maps to [0, 2π) — confirm boundary convention is consistent with Godot/three.js
- [x] 3.3 Verify `angleDifference` returns the shortest signed arc (Box2D convention) and `angleDistance` returns the unsigned shortest arc
- [x] 3.4 Verify `angleBisector` correctly computes midpoint on the shortest arc
- [x] 3.5 Scan `AngleUnwrapper` — confirm it is the only class/stateful export in all of `auxiliary/`; document rationale for its placement
- [x] 3.6 Verify `sinCos` and `sinCosNormalized` return `SinCos` type from `types/`
- [x] 3.7 Produce `angle-verdict.md` in verdicts/

## 4. Auxiliary Layer Audit — Numeric

- [x] 4.1 Read all files in `auxiliary/numeric/` line by line
- [x] 4.2 Verify `neumaierSum` corrects for cancellation error (test: [1e10, 1, -1e10] → 1.0)
- [x] 4.3 Verify `robustSum` and `compensatedProduct` are distinct algorithms with distinct use-cases — file REMOVE verdict if one is redundant
- [x] 4.4 Verify `flushDenormal` returns 0 for sub-normal inputs and the original value otherwise
- [x] 4.5 Audit `lerpSafe` in `numeric/safety.ts` — determine if it duplicates `inverseLerpSafe` from `scalar/interpolation.ts`; if yes file REMOVE verdict
- [x] 4.6 Verify `roundToPowerOfTwo` is semantically distinct from `ceilPowerOfTwo` and `floorPowerOfTwo`; file REMOVE verdict if it is ambiguous/redundant
- [x] 4.7 Produce `numeric-verdict.md` in verdicts/

## 5. Types Layer Audit

- [x] 5.1 Read all files in `types/` line by line
- [x] 5.2 Verify every core type (Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2) has a `Readonly<Type>Like` and `<Type>Like` interface pair — file ADD verdict for any missing pair
- [x] 5.3 Verify type guards (`isVector2Like`, etc.) check structural contract without importing concrete classes
- [x] 5.4 Determine NaN handling policy for type guards (is `{x:NaN, y:0}` a valid `Vector2Like`?) — document decision in the relevant guard file
- [x] 5.5 Verify `SinCos` has exactly two fields (cos, sin) and `ReadonlySinCos` is the readonly variant
- [x] 5.6 Trace all usages of `EigenvalueResult`, `EigendecomposeResult`, `RealEigendecomposition`, `ComplexEigendecomposition` in non-test source files; file REMOVE verdict if zero callers found
- [x] 5.7 Scan all `types/` import statements — confirm zero cross-layer imports
- [x] 5.8 Produce `types-verdict.md` in verdicts/

## 6. Core Types Audit — Vector2 and Rotation2

- [x] 6.1 Read `core/vector2.ts` line by line; produce a complete export list with signatures
- [x] 6.2 Build reference comparison table: for each Vector2 operation, check presence in three.js, gl-matrix, Godot, Unity, Box2D — flag any operation present in ≥3 references but absent from math2d as ADD verdict
- [x] 6.3 Verify all static Vector2 methods accept `ReadonlyVector2Like` inputs (not concrete `Vector2`)
- [x] 6.4 Verify all static Vector2 methods return `Vector2` and accept `out?: Vector2` as last parameter
- [x] 6.5 Verify instance methods return `this` for chaining
- [x] 6.6 Confirm `rotateCS(cos, sin)` exists as static and instance method for hot-loop use
- [x] 6.7 Verify static/instance symmetry: for every instance method there is a static pure equivalent; for every static factory there is a mutating instance setter
- [x] 6.8 Read `core/rotation2.ts` line by line; confirm it stores `cos` and `sin` fields (not raw angle)
- [x] 6.9 Verify `Rotation2.getAngle()` is a derived computation (atan2(sin, cos)) and that round-trip from angle is stable
- [x] 6.10 Produce `vector2-rotation2-verdict.md` in verdicts/

## 7. Core Types Audit — Complex and Interval

- [x] 7.1 Read `core/complex.ts` line by line; verify arithmetic completeness (add, subtract, multiply, divide, conjugate, reciprocal, normalize, magnitude, argument)
- [x] 7.2 Verify `Complex.sqrt` convention is documented (which branch is returned)
- [x] 7.3 Verify that applying a unit Complex to a Vector2 produces the same result as applying a Rotation2 with the equivalent angle (cross-module synergy check)
- [x] 7.4 Read `core/interval.ts` line by line; verify `intersect` behavior for non-overlapping intervals is explicitly defined and consistent
- [x] 7.5 Verify `Interval.sample(t)` maps t=0 → min and t=1 → max
- [x] 7.6 Audit whether all Interval operations that can fail for degenerate inputs (e.g., zero-width interval in `inverseLerp`) have triality variants
- [x] 7.7 Produce `complex-interval-verdict.md` in verdicts/

## 8. Core Types Audit — Matrix2, Matrix3, Transform2

- [x] 8.1 Read `core/matrix2.ts` line by line; verify rotation/scale/shear factory completeness
- [x] 8.2 Trace all callers of `Matrix2.ROTATE_90`, `ROTATE_180`, `FLIP_X`, `FLIP_Y` in non-test source — file REMOVE verdict if no callers found
- [x] 8.3 Verify `Matrix2` eigenvalue decomposition method exists and uses the types from `types/`; if no `eigendecompose` method exists, file REMOVE for the eigenvalue types in `types/`
- [x] 8.4 Read `core/matrix3.ts` line by line; confirm NO 3D projection operations exist (perspective, frustum, ortho, lookAt)
- [x] 8.5 Verify `Matrix3.transformPoint` performs perspective divide (divides by w) and `transformVector` ignores translation
- [x] 8.6 Verify `Matrix3.rotateCS(cos, sin)` instance method exists for hot loops
- [x] 8.7 Read `core/transform2.ts` line by line; verify composition (multiply), inverse, and batch transform methods (transformPoints, transformVectors) are present
- [x] 8.8 Verify `Transform2.fromMatrix` / `toMatrix` round-trip consistency for uniform scale transforms
- [x] 8.9 Produce `matrix-transform-verdict.md` in verdicts/

## 9. Validation and Utils Audit

- [x] 9.1 Read all files in `validation/` line by line; verify all seven core type assertion functions exist
- [x] 9.2 Build and analyze a production bundle; confirm no assertion function bodies appear in output (tree-shaking works)
- [x] 9.3 Verify `setAssertionsEnabled`/`areAssertionsEnabled` are exported from both `index.ts` and `./validation/assert` subpath
- [x] 9.4 Scan all `core/` files for direct (non-conditional) assertion calls that would not be tree-shaken
- [x] 9.5 Read all files in `utils/` line by line
- [x] 9.6 Verify parse/format pairs exist for all seven core types and are round-trip consistent
- [x] 9.7 Trace all imports in `utils/performance.ts` — if no math dependency exists, file RESTRUCTURE verdict to `@lenguados/common`
- [x] 9.8 Verify `utils/` files do not import from `validation/`
- [x] 9.9 Produce `validation-utils-verdict.md` in verdicts/

## 10. API Design Coherence Audit

- [x] 10.1 Produce a complete import graph for all `packages/math2d/src/` files; flag any upward or lateral dependency violation as RESTRUCTURE
- [x] 10.2 Enumerate all fallible static methods across all core types; verify strict/Safe/Unchecked triality is present for each — produce a gap list
- [x] 10.3 Enumerate all static methods that return core types; verify `out?` parameter is present as the last argument for each
- [x] 10.4 Grep for `normalise`, `colour`, `behaviour` and any British English spellings — file RENAME verdicts for any found
- [x] 10.5 Scan for any `apply*` methods on Matrix3 or Transform2 (should be `transform*`); file RENAME verdicts
- [x] 10.6 Enumerate all `is*` and `has*` methods and verify return type is `boolean`
- [x] 10.7 Scan `index.ts` for any `/** @internal */` exports — verify they are either truly needed for test infrastructure or should be removed
- [x] 10.8 Verify `Vector2.lerp` calls `auxiliary/scalar/interpolation.lerp` rather than inline `a + t*(b-a)`
- [x] 10.9 Verify `Rotation2.fromAngle` routes trig through deterministic kernels
- [x] 10.10 Produce `api-coherence-verdict.md` in verdicts/

## 11. Second-Pass Adversarial Review

- [x] 11.1 For each verdict file in `verdicts/`, run an adversarial agent that challenges every REMOVE and RENAME verdict with counter-evidence from the library's own TSDoc and ARCHITECTURE.md
- [x] 11.2 For each ADD verdict, verify the proposed addition is not already present under a different name or in a different file
- [x] 11.3 Resolve all contested verdicts and update each `*-verdict.md` file with the final decision and its rationale
- [x] 11.4 Produce `audit-summary.md` in `openspec/changes/math2d-deep-audit/verdicts/` — a single document listing all final verdicts organized by phase (RESTRUCTURE → RENAME → REMOVE → ADD)

## 12. Implement — F1: Remove `export` from `pow2`

- [x] 12.1 In `packages/math2d/src/deterministic/deterministic-kernels.ts` line 194, change `export function pow2` to `function pow2`
- [x] 12.2 Confirm `pow2` is not referenced in `DeterministicKernels` namespace (it is not — verify at line ~989)
- [x] 12.3 Run `npm run test:unit` — all existing tests must pass

## 13. Implement — F2: Fix `logKernelSafe` TSDoc

- [x] 13.1 In `deterministic-kernels.ts` line 831, remove the `@internal` tag
- [x] 13.2 Rewrite the `@remarks` block: remove the claim that `safety.ts` delegates to this kernel (it imports `log` directly); replace with accurate description of the function's role as the deterministic layer's single-argument safe log, analogous to `expSafe`
- [x] 13.3 Run `npm run test:unit` — all existing tests must pass

## 14. Test

- [x] 14.1 Verify that `pow2` no longer appears in the exported types of the `./deterministic` subpath (import the subpath in a test and confirm `pow2` is not accessible)
- [x] 14.2 Confirm `DeterministicKernels.logKernelSafe` is still accessible and returns `0` for `x <= 0` and `log(x)` for `x > 0`
