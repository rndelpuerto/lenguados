## 1. Convention Alignment — normalizeRadians / normalizeDegrees

- [x] 1.1 Change `normalizeRadians` in `packages/math2d/src/auxiliary/angle/normalization.ts:34-36` — add `const result = loop(radians, -PI, PI); return result === -PI ? PI : result;` to implement `(-PI, PI]`
- [x] 1.2 Change `normalizeDegrees` in `normalization.ts:77-79` — add `const result = loop(degrees, -180, 180); return result === -180 ? 180 : result;` to implement `(-180, 180]`
- [x] 1.3 Update `normalizeRadians` TSDoc — change range description from `[-PI, PI)` to `(-PI, PI]`, update examples: `normalizeRadians(Math.PI) // Math.PI`, `normalizeRadians(-Math.PI) // Math.PI`, `normalizeRadians(3 * Math.PI) // Math.PI`
- [x] 1.4 Update `normalizeDegrees` TSDoc — change range from `[-180, 180)` to `(-180, 180]`, update examples: `normalizeDegrees(180) // 180`, `normalizeDegrees(-180) // 180`
- [x] 1.5 Update `angleDifference` TSDoc in `operations.ts` — change `@returns` range from `[-PI, PI)` to `(-PI, PI]`, update anti-symmetry remark (now both return `+PI` instead of `-PI`), update lines 78, 81, 87
- [x] 1.6 Update `angleBisector` TSDoc in `operations.ts:159-163` — example `angleBisector(-PI/2, PI/2)` now correctly returns `0`, example `angleBisector(0, PI)` now returns `PI/2`
- [x] 1.7 Update `clampAngle` TSDoc in `operations.ts:233` — change range reference from `[-PI, PI)` to `(-PI, PI]`
- [x] 1.8 Update `sinCosNormalized` TSDoc in `operations.ts:61` — change "Equivalent to sinCos(Math.PI)" to "Equivalent to sinCos(Math.PI)" (now actually correct with new convention)
- [x] 1.9 Update `lerpAngle` TSDoc in `interpolation.ts:16` — change `[-PI, PI)` to `(-PI, PI]`
- [x] 1.10 Update `unwrapAngles` TSDoc in `unwrapping.ts:72` — change `[0, Math.PI, 0]` to `[0, Math.PI, 2 * Math.PI]` (correct continuous unwrapping)
- [x] 1.11 Update `AngleUnwrapper` class TSDoc in `unwrapping.ts:132-137` — `next(PI)` now correctly returns `Math.PI`, `next(0)` returns `2 * Math.PI`, `value` returns `2 * Math.PI`, `reset(0)` then `next(PI)` returns `Math.PI`
- [x] 1.12 Update `Rotation2.angleTurns` getter TSDoc in `rotation2.ts:1407` — `fromAngle(PI).angleTurns` now correctly returns `0.5`
- [x] 1.13 Update tests in `normalization.node.spec.ts` — change expectations for `normalizeRadians(PI)` from `-PI` to `+PI`, same for `normalizeDegrees(180)`
- [x] 1.14 Update tests in `operations.node.spec.ts` — simplify `angleBisector` test (remove `Math.abs` wrapper, expect `toBeCloseTo(Math.PI)` directly or `toBeCloseTo(0)` for the `-PI/2, PI/2` case)
- [x] 1.15 Update tests in `unwrapping.node.spec.ts` — update reference-based unwrap expectations

## 2. TSDoc Corrections (not fixed by convention change)

- [x] 2.1 Fix `relativeEquals` TSDoc example in `comparison.ts:123` — change `false (100% difference)` to `true (scale floor: max(1, |a|, |b|) = 1, threshold = 0.01)` and add `@remarks` documenting Christer Ericson's combined tolerance pattern
- [x] 2.2 Fix `Matrix2.fromScale(2, 2)` TSDoc examples in `matrix2.ts` at lines 644, 1941, 1969-1970 — change to `Matrix2.fromScale(2)` for uniform or `Matrix2.fromScale({ x: 2, y: 1 })` for non-uniform
- [x] 2.3 Fix `Matrix3.fromTranslation(10, 20)` TSDoc examples in `matrix3.ts` at lines 926, 2548, 2576-2577, 2626 — change to `Matrix3.fromTranslation({ x: 10, y: 20 })`
- [x] 2.4 Add `@remarks` to `Rotation2.copy` in `rotation2.ts` documenting that unlike `clone()`/`set()`, `copy()` does NOT normalize
- [x] 2.5 Add `@remarks` to `Vector2.isParallel` and `Vector2.isPerpendicular` (static + instance) in `vector2.ts` documenting scale-dependence

## 3. Export & Build Hygiene

- [x] 3.1 Remove phantom exports `./deterministic/precision-math` and `./deterministic/rounding-control` from `packages/math2d/package.json`
- [x] 3.2 Add proper `./deterministic` subpath export to `package.json` pointing to `deterministic-kernels` with dev/prod conditional exports
- [x] 3.3 Add `@internal` TSDoc tag to `pow2` (already present) function in `deterministic-kernels.ts`
- [x] 3.4 Remove `sinCos` from explicit named re-exports at `index.ts:117`
- [x] 3.5 Add `@remarks` to `ReadonlySinCos` (already documented) interface in `types/index.ts` explaining forward use

## 4. API Additions — Complex.addScalar / subtractScalar

- [x] 4.1 Add static `Complex.addScalar(z: ReadonlyComplexLike, scalar: number, out?: Complex): Complex` — implementation: `set(z.real + scalar, z.imag)`
- [x] 4.2 Add static `Complex.subtractScalar(z: ReadonlyComplexLike, scalar: number, out?: Complex): Complex` — implementation: `set(z.real - scalar, z.imag)`
- [x] 4.3 Add instance `Complex.prototype.addScalar(scalar: number): this` — mutates `this.real += scalar`, returns `this`
- [x] 4.4 Add instance `Complex.prototype.subtractScalar(scalar: number): this` — mutates `this.real -= scalar`, returns `this`
- [x] 4.5 Add TSDoc with `@category Arithmetic`, `@since` tag, examples, `@see` cross-links
- [x] 4.6 Write tests in `complex.node.spec.ts`

## 5. API Additions — Rotation2.angleTo

- [x] 5.1 Add instance `Rotation2.prototype.angleTo(other: ReadonlyRotation2Like): number` — delegates to `Rotation2.angleBetween(this, other)`
- [x] 5.2 Add TSDoc with `@category Computed`, `@since` tag, examples, `@see` cross-link to `angleBetween`
- [x] 5.3 Write tests in `rotation2.node.spec.ts`

## 6. API Additions — lerpAngleClamped

- [x] 6.1 Add `lerpAngleClamped(from: number, to: number, t: number): number` to `interpolation.ts` — implementation: `lerpAngle(from, to, saturate(t))`
- [x] 6.2 Import `saturate` from `../scalar/arithmetic`
- [x] 6.3 Add TSDoc with `@category Interpolation`, `@since` tag, examples, `@see` cross-links
- [x] 6.4 Write tests in `interpolation.node.spec.ts`

## 7. Design Consistency — Complex.sqrt

- [x] 7.1 Refactor instance `Complex.prototype.sqrt()` in `complex.ts` to delegate to `Complex.sqrt(this, this)` instead of `this.pow(0.5)`
- [x] 7.2 Update tests to verify static/instance produce identical results
- [x] 7.3 Add property-based test for `Complex.sqrt(z) === z.clone().sqrt()` equivalence

## 8. Verification

- [x] 8.1 Run full test suite: `npm run test:unit`
- [x] 8.2 Run lint: `npm run lint`
- [x] 8.3 Build: `npm run build`
- [x] 8.4 Verify all package.json export paths resolve correctly
- [x] 8.5 Verify `normalizeRadians(Math.atan2(y, x)) === Math.atan2(y, x)` for edge cases (+0/-0, ±Infinity)
