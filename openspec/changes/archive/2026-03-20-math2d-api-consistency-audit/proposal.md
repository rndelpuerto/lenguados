## Why

A 10-agent exhaustive audit (7 specialized domain experts + 3 cross-referencing integrators) of the entire `@lenguados/math2d` package (~27K lines, 7 core types, 3 auxiliary modules) revealed **systemic inconsistencies** across API design, correctness, performance, and developer experience. The audit read every source file line-by-line, cross-referenced findings across modules, and validated against Box2D, nalgebra, gl-matrix, Three.js, Unity, and Godot. A subsequent 4-agent adversarial review challenged all findings against archived formal specs, resolving two contested decisions (D1 and D9) and refining a third (D2). The most critical confirmed finding -- `Complex.reciprocal` instance using a 5-order-of-magnitude different zero-detection threshold than the static version -- means users get **different numerical results** for the same mathematical operation depending on whether they use the static or instance API.

## What Changes

### Bug Fixes (P0 - Correctness)

- Fix `Complex.reciprocal` instance using `magnitudeSq` for zero-detection (threshold ~3.16e-6) while static uses `magnitude` (threshold 1e-10) -- standardize instance on `magnitude`.
- Fix `Interval.center()` overflow for extreme values (`(min+max)*0.5` -> `min + (max-min)*0.5`).
- Fix `Interval.hull()` unsafe type cast in array overload form.
- Fix misleading `lerp` JSDoc claiming "clamped" in Matrix2, Matrix3, and Interval (implementation is correctly unclamped; docs are wrong).
- Fix Transform2 doc example referencing nonexistent `setPosition`/`setRotation`/`setScale` methods.

### Performance Fixes (P1 - Hot Path)

- Eliminate tuple allocation in `complexDivideSmith` (called on every Complex division).
- Eliminate array allocation in `Interval.multiply` (replace with 4 local variables).
- Inline rotation math in `Transform2.multiply`/`inverse` static methods (eliminate temp `Rotation2` allocations).
- Replace `sqrtSafe` with `Math.sqrt` in `frobeniusNorm` (sum of squares is always non-negative).

### API Consistency Fixes (P2 - Type Safety)

- Widen Interval instance method parameters from `ReadonlyInterval` to `ReadonlyIntervalLike` (~11 methods).
- Widen `Matrix2.transformVector` instance parameter from `ReadonlyVector2` to `ReadonlyVector2Like`.
- Widen `Complex.clone`/`copy` static parameters from `ReadonlyComplex` to `ReadonlyComplexLike`.
- Add TypeScript `asserts value is *Like` return types to all 7 `assert*Like` validation functions (zero-cost type narrowing).
- Standardize format function input types to accept `Readonly*Like` interfaces.

### API Surface Parity (P3 - Completeness)

- Add `Matrix2.getRotation(matrix)` and `Matrix2.getScale(matrix, out?)` static methods (Matrix3 has both; Matrix2 only has instance).
- Add `Rotation2.fromMatrix2(matrix)` factory (completes the Rotation2 <-> Matrix2 round-trip).
- Add `Transform2.transformDirection` / `inverseTransformDirection` (applies rotation component only, ignoring scale and translation).
- Add `Transform2.premultiply(other)` for reverse-order transform composition (`this = other × this`).
- Add `Complex.divideScalar` / `divideScalarSafe` / `divideScalarUnchecked` (Vector2 has all three; Complex has none).
- Add `Interval.abs()` static + instance (standard interval arithmetic operation, validated against Moore's framework).
- Add `Interval.fromUnsorted(a, b)` convenience factory.
- Add missing instance validation tier variants: `Vector2.setMagnitudeUnchecked`, `Vector2.reflectUnchecked`, `Vector2.directionToSafe`.
- Add `Complex.fromVector2(v, out?)` static factory (completes bidirectional conversion).

### Structural Cleanup (P4)

- Move `SinCos` interface to `types/` to resolve layering violation (deterministic -> auxiliary).

## Capabilities

### New Capabilities

- `api-consistency-patterns`: Canonical patterns for the entire package -- interface usage rules, validation tier rules, static/instance symmetry rules, allocation rules, naming conventions, documentation rules. This becomes the authoritative reference for all future development.

### Modified Capabilities

- `core-types-api`: New requirements for Transform2 new methods (transformDirection, premultiply), Matrix2 static getRotation/getScale, Complex.divideScalar/fromVector2/reciprocal-fix, Interval.abs/fromUnsorted/center-fix/hull-fix, Rotation2.fromMatrix2
- `api-conventions`: Updated rules for \*Like interface usage on instance methods, `asserts` return types on validation functions, lerp documentation standard
- `auxiliary-api`: SinCos interface relocation
- `performance-architecture`: Hot-path allocation elimination requirements (complexDivideSmith, Interval.multiply, Transform2 inlining, frobeniusNorm)

## Impact

### Affected Layers

- **core/** (all 7 type files): Bug fixes, new methods, type widening
- **auxiliary/** (angle/operations): SinCos re-export
- **types/** (index.ts): SinCos interface addition
- **validation/** (assert.ts): `asserts` return types on 7 functions
- **utils/** (parse.ts): Format function type consistency

### Breaking Changes

- No breaking changes. All type changes are widenings (accept more inputs). The original proposal to change `Rotation2.set()` semantics was overruled by adversarial review (conflicts with two ratified archived specs).

### Backward Compatibility

- All existing tests must continue to pass.
- All public method signatures remain compatible (parameter types are widened, never narrowed).

### Bundle Size Impact

- Net increase ~2-3KB (new methods).
- All new methods are tree-shakeable.

### Rollback Plan

- Each work package (WP-1 through WP-6) is independently revertable via git.

### External Validation Sources

- Three.js issues #17035, #19285 (validates lerp unclamped convention)
- Moore's interval arithmetic framework (validates Interval.abs)
- V8 escape analysis / hidden classes research (validates out parameter over pooling)
- TypeScript docs / 2ality.com (validates asserts type narrowing)
- Box2D v3, nalgebra, Rapier (validates rotation patterns -- evidence considered but D1 overruled by formal spec constraints)

### Adversarial Review Outcomes

- **D1 (Rotation2.set raw assignment)**: OVERRULED. Conflicts with two ratified archived specs. set() keeps normalizing.
- **D2 (blanket magnitudeSq ban)**: REVISED. Fix Complex.reciprocal bug only. magnitudeSq is correct for isUnit checks per ratified spec.
- **D9 (lerpSafe relocation)**: OVERRULED. Safety-family cohesion outweighs operation-family discoverability.
- **D3, D4, D5, D6, D7, D8**: CONFIRMED by all 4 adversarial agents.
