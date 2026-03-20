## 1. CRITICAL — Factual Errors & Missing Required Tags

- [x] 1.1 **vector2.ts `set angle` setter**: Add full JSDoc block with `@param radians - Angle in radians`, `@category Accessor`, `@since 0.7.0`. Ref: DOCUMENTATION_STANDARD Section 2 Table 1 (all public symbols require @param, @category, @since).

- [x] 1.2 **vector2.ts `getComponent`**: Change `@category Mutator` → `@category Accessor`. Ref: DOCUMENTATION_STANDARD Section 4 L565 ("Instance Accessors → @category Accessor (ALL accessors)"). `getComponent` is read-only — it returns a value, does not mutate.

- [x] 1.3 **transform2.ts `toObject` @example** (~L1979): Fix invalid code `t.rotation = Math.PI / 4` — `rotation` is `readonly Rotation2`, not assignable. Replace with valid construction pattern (e.g., `Transform2.fromValues(...)` or `new Transform2()`). Ref: Spec "JSDoc factual accuracy" scenario "@example code compiles and runs".

- [x] 1.4 **transform2.ts `toString` @example** (~L2067): Same fix as 1.3 — replace `t.rotation = Math.PI / 4` with valid code.

- [x] 1.5 **transform2.ts `transformPoint` summary** (~L1442): Change "Transforms a point (applies translation)" → "Transforms a point by applying scale, rotation, and translation". Ref: Spec "JSDoc factual accuracy" scenario "Method summary matches actual behavior".

- [x] 1.6 **matrix3.ts `ortho` missing @throws** (~L539): Add `@throws {RangeError} If left equals right or bottom equals top (degenerate projection)`. Read implementation to verify exact throw condition. Ref: DOCUMENTATION_STANDARD Table 1 (Factory: @throws = "if throws").

- [x] 1.7 **complex.ts `normalized` getter duplicate @remarks** (~L1957+1963): Merge the two `@remarks` blocks into one. TSDoc allows only one `@remarks` block per comment.

- [x] 1.8 **rotation2.ts `applyInverse` wrong property refs** (~L1316): Change `this.c`/`this.s` → `this.cos`/`this.sin` in `@remarks`. Ref: Spec "JSDoc factual accuracy" scenario "@remarks property references match actual names".

- [x] 1.9 **Verification**: Run `npm run test:unit` — confirm 3225/3225 pass. Run `npx eslint packages/math2d/src/core/vector2.ts packages/math2d/src/core/transform2.ts packages/math2d/src/core/matrix3.ts packages/math2d/src/core/complex.ts packages/math2d/src/core/rotation2.ts` — confirm zero new warnings.

## 2. HIGH — Category Inconsistencies (backed by standard)

- [x] 2.1 **matrix2.ts static `determinant`**: Change `@category Matrix Operations` → `@category Computed`. Ref: DOCUMENTATION_STANDARD L452 (Computed typical members: `determinant`, `trace`). Design D2.

- [x] 2.2 **matrix2.ts static `trace`**: Change `@category Matrix Operations` → `@category Computed`. Same ref as 2.1.

- [x] 2.3 **matrix2.ts static `frobeniusNorm`**: Change `@category Matrix Operations` → `@category Computed` (if currently Matrix Operations). Same ref.

- [x] 2.4 **matrix3.ts static `determinant`**: Change `@category Matrix Operations` → `@category Computed`. Same ref as 2.1.

- [x] 2.5 **matrix3.ts static `trace`**: Change `@category Matrix Operations` → `@category Computed`. Same ref.

- [x] 2.6 **matrix3.ts static `frobeniusNorm`**: Change `@category Matrix Operations` → `@category Computed` (if currently Matrix Operations). Same ref.

- [x] 2.7 **matrix3.ts instance `isInvertible`**: Change `@category Computed` → `@category Comparison`. Ref: DOCUMENTATION_STANDARD L455 (Comparison: "predicates" — `isZero`, `isUnit`, `isFinite`). Static version already correctly uses Comparison.

- [x] 2.8 **matrix3.ts instance `isAffine`**: Change `@category Computed` → `@category Comparison`. Same ref as 2.7.

- [x] 2.9 **matrix2.ts `setFromArray` missing @throws**: Add `@throws {RangeError} If array has insufficient length`. Read implementation to verify exact condition and error type.

- [x] 2.10 **Verification**: Run `npm run test:unit` — 3225/3225. Run `npx eslint packages/math2d/src/core/matrix2.ts packages/math2d/src/core/matrix3.ts` — zero new warnings.

## 3. HIGH — Section Header / Category Affinity Fixes

- [x] 3.1 **transform2.ts "Instance Computed" section** (~L1341): Insert dashed sub-header `/* ------ Comparison ------ */` before `hasUniformScale` to delineate the Comparison methods from `determinant` (Computed). Per Design D3.

- [x] 3.2 **transform2.ts "Instance Conversion (Matrix)" section** (~L1383): Insert dashed sub-header `/* ------ Mutator ------ */` before `setFromMatrix3` to delineate from Conversion methods. Per Design D3.

- [x] 3.3 **matrix2.ts "Instance Conversion" section**: Insert dashed sub-header `/* ------ Transform ------ */` before `trunc()` to delineate from Conversion methods. Per Design D3.

- [x] 3.4 **interval.ts "Instance Comparison" section** (~L1324): Insert dashed sub-header `/* ------ Set Operations ------ */` before `contains` to delineate Set Operations methods from `isDegenerate` (Comparison). Per Design D3.

- [x] 3.5 **complex.ts orphaned methods**: Insert dashed sub-header `/* ------ Arithmetic ------ */` before `negate()` and `/* ------ Mutator ------ */` before `zero()` to give them section context. Per Design D3.

- [x] 3.6 **complex.ts "Instance Predicates"** (~L1805): Rename to "Instance Comparison". All methods within use `@category Comparison`. Per Design D7.

- [x] 3.7 **vector2.ts duplicate "Static Transforms"**: Rename second occurrence (~L1493) to "Static Transforms (Normalize & Project)". Per Design D8.

- [x] 3.8 **vector2.ts duplicate "Instance Transforms"**: Rename second occurrence (~L4185) to "Instance Transforms (Step)". Per Design D8.

- [x] 3.9 **Verification**: Run `npm run test:unit` — 3225/3225 pass.

## 4. DECISION — Amend DOCUMENTATION_STANDARD for Geometry vs Computed

- [x] 4.1 **Amend DOCUMENTATION_STANDARD.md Section 3 L452**: Update Computed typical members from `dot, cross, magnitude, determinant, trace, angle` to `determinant, trace, frobeniusNorm, angle, magnitude` (removing vector2-specific entries, keeping base-applicable ones).

- [x] 4.2 **Amend DOCUMENTATION_STANDARD.md Section 3 L471**: Update Geometry typical members from `distance, distanceSquared, manhattanDistance` to `dot, cross, magnitude, distance, distanceSquared, manhattanDistance`. Per Design D1.

- [x] 4.3 **Verify vector2.ts**: Confirm `dot`, `cross`, `magnitude` (static + instance) already use `@category Geometry`. No code change expected — D8 already applied this.

- [x] 4.4 **Verify no ESLint impact**: Run `npx eslint packages/math2d/src/core/vector2.ts` — confirm zero warnings. The ESLint rule validates category names (Geometry is valid for vector2.ts), not the typical members text.

## 5. MEDIUM — Triality @see Cross-Linking (systematic)

- [x] 5.1 **vector2.ts triality families**: Add missing `@see` cross-links to all triality families: `divide`/`divideSafe`/`divideUnchecked`, `divideScalar`/`divideScalarSafe`/`divideScalarUnchecked`, `inverse`/`inverseSafe`/`inverseUnchecked`, `normalize`/`normalizeSafe`/`normalizeUnchecked`, `setMagnitude`/`setMagnitudeSafe`/`setMagnitudeUnchecked`, `direction`/`directionSafe`/`directionUnchecked`, `project`/`projectSafe`/`projectUnchecked`, `reject`/`rejectSafe`/`rejectUnchecked`, `reflect`/`reflectSafe`/`reflectUnchecked` — both static and instance versions. Fix `directionSafe` and `projectSafe` and `rejectSafe` and `reflectSafe` that link to Unchecked (Safe should link to Strict ONLY). Per DOCUMENTATION_STANDARD Section 5 L648-720.

- [x] 5.2 **matrix2.ts triality families**: Add missing `@see` to `inverse`/`inverseSafe`/`inverseUnchecked`, `divideScalar`/`divideScalarSafe`/`divideScalarUnchecked` — both static and instance.

- [x] 5.3 **matrix3.ts triality families**: Add missing `@see` to `inverse`/`inverseSafe`/`inverseUnchecked`, `divideScalar`/`divideScalarSafe`/`divideScalarUnchecked`, `ortho`/`orthoSafe` — both static and instance.

- [x] 5.4 **complex.ts triality families**: Add missing `@see` to `divide`/`divideSafe`/`divideUnchecked`, `normalize`/`normalizeSafe`/`normalizeUnchecked`, `reciprocal`/`reciprocalSafe`/`reciprocalUnchecked` — both static and instance. Fix `divideSafe` static that links to Unchecked (remove that link).

- [x] 5.5 **rotation2.ts triality families**: Add missing `@see` to `normalize`/`normalizeSafe`/`normalizeUnchecked`, `fromComplex`/`fromComplexSafe` — static. Fix `fromComplexSafe` @see description if misleading.

- [x] 5.6 **Verification**: Grep all core files for `@see` and verify each triality family is complete. Run `npm run test:unit` — 3225/3225. Run `npx eslint packages/math2d/src/core/` — confirm zero new warnings from `enforce-see-format`.

## 6. MEDIUM — Factory @example Blocks (systematic)

- [x] 6.1 **vector2.ts factory @example**: Add `@example` to `fromValues`, `clone`, `copy`, `fromObject`, `fromComplex`. Per Template 10: show creation with and without `out`.

- [x] 6.2 **matrix2.ts factory @example**: Add `@example` to `fromValues`, `clone`, `copy`, `fromObject`, `fromColumns`, `fromRows`, `fromMatrix2`, `fromArray`. Per Template 10.

- [x] 6.3 **matrix3.ts factory @example**: Add `@example` to `fromValues`, `clone`, `copy`, `fromObject`, `fromTranslation`, `fromRotation`, `fromScale`, `fromMatrix2`, `fromTransform2`, `fromColumns`, `fromRows`, `fromArray`, `ortho`, `orthoSafe`. Per Templates 10, 4, 5.

- [x] 6.4 **complex.ts factory @example**: Add `@example` to `fromPolar`, `fromPolarCS`, `fromArray`, `fromObject`, `fromValues`, `clone`, `copy`. Per Template 10.

- [x] 6.5 **rotation2.ts factory @example**: Add `@example` to `fromCS`, `fromVector2`, `fromVectors2`, `fromComplex`, `fromComplexSafe`, `fromObject`, `fromValues`, `fromArray`, `clone`, `copy`. Per Templates 10, 5.

- [x] 6.6 **interval.ts factory @example**: Add `@example` to `fromValue`, `fromCenterRadius`, `fromArray`, `fromObject`, `clone`, `copy`. Per Template 10.

- [x] 6.7 **transform2.ts factory @example**: Add `@example` to `fromValues`, `fromMatrix3`, `fromObject`, `fromPose`, `clone`, `copy`. Per Template 10.

- [x] 6.8 **Verification**: Run `npm run test:unit` — 3225/3225. Run `npx eslint packages/math2d/src/core/` — confirm enforce-required-tags warnings for factory @example decrease.

## 7. MEDIUM — Triality Strict/Safe @example Blocks

- [x] 7.1 **matrix2.ts triality @example**: Add `@example` to strict: `inverse`, `divideScalar`. Add `@example` to safe: `inverseSafe`, `divideScalarSafe`. Per Templates 4 (strict: include throw case) and 5 (safe: include fallback).

- [x] 7.2 **matrix3.ts triality @example**: Add `@example` to strict: `inverse`, `divideScalar`, `ortho`. Add `@example` to safe: `inverseSafe`, `divideScalarSafe`, `orthoSafe`. Per Templates 4, 5.

- [x] 7.3 **complex.ts triality @example**: Add `@example` to strict: `divide`, `normalize`, `reciprocal`. Add `@example` to safe: `divideSafe`, `normalizeSafe`, `reciprocalSafe`. Per Templates 4, 5.

- [x] 7.4 **rotation2.ts triality @example**: Add `@example` to strict: `normalize`. Add `@example` to safe: `normalizeSafe`. Per Templates 4, 5. (Note: investigate D9 — `normalize` may not actually throw.)

- [x] 7.5 **Verification**: Run `npm run test:unit` — 3225/3225.

## 8. MEDIUM — Specific Content Fixes

- [x] 8.1 **complex.ts instance `lerp` @param**: Change "clamped" → remove "clamped" from description. This is the unclamped variant; `lerpClamped` is the clamped one.

- [x] 8.2 **rotation2.ts static `normalize` triality investigation** (Design D9): Read implementation of `normalize`, `normalizeSafe`, `normalizeUnchecked`. Determine if `normalize` actually throws. If it doesn't throw, remove any `@throws` tag and document in `@remarks` that it returns identity for zero-length input. Update @see cross-links accordingly.

- [x] 8.3 **complex.ts angle getters "DRY compliance"**: Remove "Uses auxiliary/angle/conversion for DRY compliance" from summaries of `angleDegrees` getter/setter, `angleTurns` getter/setter (~4 methods). Implementation details do not belong in user-facing documentation.

- [x] 8.4 **rotation2.ts angle getters "DRY compliance"**: Same as 8.3 — remove "DRY compliance" from `angleDegrees` getter/setter, `angleTurns` getter/setter (~4 methods).

- [x] 8.5 **Constructor JSDoc**: Add minimal `@param` documentation to constructors in interval.ts, transform2.ts, complex.ts. No `@category` or `@since` needed (no template for constructors in standard).

- [x] 8.6 **transform2.ts instance `inverseTransformPoint`/`inverseTransformVector`**: Add `@throws {RangeError} If transform is not invertible` since these delegate to static methods that throw. Ref: DOCUMENTATION_STANDARD Table 1 ("if throws").

- [x] 8.7 **Verification**: Run `npm run test:unit` — 3225/3225.

## 9. LOW — Style & Formatting

- [x] 9.1 **@see em-dash → hyphen**: Search all 7 core files for `@see` tags using `--` or `—` instead of `-` (space-hyphen-space). Replace with standard format. Ref: DOCUMENTATION_STANDARD Section 5 L635-646.

- [x] 9.2 **transform2.ts `rotation` property @remarks**: Remove or replace opaque "SOLID Architecture (v3)" reference with user-facing explanation of why the property is readonly.

- [x] 9.3 **vector2.ts "Instance Accessors (Readonly)" and "Instance Accessors (Swizzle)"**: Evaluate if these serve readability. Per Design D7, keep if they disambiguate distinct sub-groups. If the methods within are all `@category Accessor`, consider whether the suffixes help IDE navigation.

- [x] 9.4 **Verification**: Run `npm run test:unit` — 3225/3225. Run `npm run lint` on full project — confirm zero new issues in math2d source.

## 10. Final Verification

- [x] 10.1 **Full lint pass**: Run `npm run lint` — zero errors and zero new warnings in `packages/math2d/src/`.

- [x] 10.2 **Full test pass**: Run `npm run test:unit` — 3225/3225 tests pass.

- [x] 10.3 **Cross-file audit**: Run a final grep-based audit confirming: (a) every triality family has complete @see cross-links, (b) every Factory method has @example, (c) no duplicate @remarks blocks remain, (d) no `@category Mutator` on read-only accessors, (e) static and instance `determinant`/`trace` both use `@category Computed`.

- [x] 10.4 **DOCUMENTATION_STANDARD.md consistency**: Re-read Section 3 and verify the amended Geometry and Computed typical members match the actual `@category` assignments in all 7 core files.
