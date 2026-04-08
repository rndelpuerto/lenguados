<!-- GUARDRAILS — apply to EVERY task below:
  1. DOCUMENTATION ONLY — do NOT modify any code (function bodies, signatures, imports, exports)
  2. Do NOT reorder class members or move code blocks
  3. Do NOT add or remove functions/methods/properties
  4. Preserve ALL existing @example blocks unchanged
  5. After each layer group, run: npm run build && npm run test:unit
-->

## Phase A: Trailing Periods (~1,926 occurrences)

Remove trailing periods from @param, @returns, @throws, and @description sentence fragments. Do NOT touch @remarks content, @example content, or prose paragraphs — only the tag-prefixed fragments.

- [x] A1. Remove trailing periods in `auxiliary/scalar/arithmetic.ts` (~71 occurrences on @param/@returns)
- [x] A2. Remove trailing periods in `auxiliary/scalar/comparison.ts` (~32 occurrences)
- [x] A3. Remove trailing periods in `auxiliary/scalar/interpolation.ts` (~29 occurrences)
- [x] A4. Remove trailing periods in `auxiliary/numeric/safety.ts` (~32 occurrences)
- [x] A5. Remove trailing periods in `auxiliary/numeric/wrapping.ts` (~10 occurrences)
- [x] A6. Remove trailing periods in `auxiliary/numeric/rounding.ts` (~16 occurrences)
- [x] A7. Remove trailing periods in `auxiliary/numeric/guards.ts` (~12 occurrences)
- [x] A8. Remove trailing periods in `auxiliary/angle/operations.ts` (~33 occurrences)
- [x] A9. Remove trailing periods in `auxiliary/angle/conversion.ts` (~8 occurrences)
- [x] A10. Remove trailing periods in `auxiliary/angle/normalization.ts` (~8 occurrences)
- [x] A11. Remove trailing periods in `auxiliary/angle/unwrapping.ts` (~13 occurrences)
- [x] A12. Remove trailing periods in `auxiliary/angle/interpolation.ts` (~8 occurrences)
- [x] A13. Remove trailing periods in `validation/assert.ts` (~87 occurrences)
- [x] A14. Remove trailing periods in `utils/random-source.ts` (~22 occurrences)
- [x] A15. Remove trailing periods in `utils/random.ts` (~80 occurrences)
- [x] A16. Remove trailing periods in `utils/parse.ts` (~56 occurrences)
- [x] A17. Remove trailing periods in `utils/performance.ts` (~19 occurrences)
- [x] A18. Remove trailing periods in `core/vector2.ts` (~616 occurrences)
- [x] A19. Remove trailing periods in `core/complex.ts` (~25 occurrences)
- [x] A20. Remove trailing periods in `core/rotation2.ts` (~6 occurrences)
- [x] A21. Remove trailing periods in `core/matrix2.ts` (~282 occurrences)
- [x] A22. Remove trailing periods in `core/matrix3.ts` (~438 occurrences)
- [x] A23. Remove trailing periods in `core/interval.ts` (~14 occurrences)
- [x] A24. Remove trailing periods in `core/transform2.ts` (~9 occurrences)
- [x] A25. **Checkpoint**: run `npm run build && npm run test:unit` — must pass with zero failures

## Phase B: @category Replacements (~105 occurrences)

Replace invalid @category values using the lookup table in design.md D6. Each task is one file.

- [x] B1. In `deterministic/deterministic-kernels.ts`: replace `@category Trigonometry` → `@category Arithmetic` (10 occurrences), replace `@category Deterministic` → `@category Helpers` (1 occurrence)
- [x] B2. In `core/complex.ts`: replace `@category Predicate` → `@category Comparison` (~9), replace `@category Serialization` → `@category Conversion` (~6), replace `@category Core` → `@category Constant` on static constants (~10)
- [x] B3. In `core/rotation2.ts`: replace `@category Validation` → `@category Comparison` (~3), replace `@category Serialization` → `@category Conversion` (~5), replace `@category Core` → `@category Constant` on static constants (~8)
- [x] B4. In `core/matrix2.ts`: add `@category Constant` to static constants that have no @category (~12 single-line JSDoc blocks)
- [x] B5. In `core/matrix3.ts`: add `@category Constant` to static constants that have no @category (~12 single-line JSDoc blocks)
- [x] B6. In `core/interval.ts`: replace `@category Validation` → `@category Comparison` (~5), replace `@category Serialization` → `@category Conversion` (~5), replace `@category Core` → `@category Constant` on static constants (~10)
- [x] B7. In `core/transform2.ts`: replace `@category Validation` → `@category Comparison` (~3), replace `@category Serialization` → `@category Conversion` (~5), replace `@category Component` → `@category Accessor` (~1), replace `@category Core` → `@category Constant` on static constants (~3)
- [x] B8. In `types/index.ts`: replace `@category Type Guards` → `@category Types` (7 occurrences)
- [x] B9. In `utils/parse.ts`: replace `@category Serialization` → `@category Conversion` (14 occurrences)
- [x] B10. In `utils/random-source.ts`: replace `@category Utility` with appropriate values — interface methods → `Accessor`, `setDefaultRandomSource`/`getDefaultRandomSource` → `Configuration`, class constructor → `Factory` (~12 occurrences, assign each individually)
- [x] B11. In `utils/performance.ts`: replace `@category Utility` with appropriate values — `measureTime`/`measureAsync` → `Helpers`, class methods → assign per function (~14 occurrences)
- [x] B12. **Checkpoint**: run `npm run build && npm run test:unit` — must pass

## Phase C: Missing @since Tags (~57 occurrences)

Add `@since 0.7.0` to static class constants that are missing @since. Each constant's single-line JSDoc must be expanded to include the tag.

- [x] C1. Add @since to static constants in `core/complex.ts` (~10 constants: ZERO, ONE, I, NEG_I, NEG_ONE, EPSILON_COMPLEX, SQRT2, SQRT2_INV, PI, E)
- [x] C2. Add @since to static constants in `core/rotation2.ts` (~10 constants: IDENTITY, QUARTER_TURN, HALF_TURN, THREE_QUARTER_TURN, EIGHTH_TURN, TWELFTH_TURN, SIXTEENTH_TURN, NEGATIVE_QUARTER, SIXTH_TURN, etc.)
- [x] C3. Add @since to static constants in `core/matrix2.ts` (~12 constants: IDENTITY, ZERO, ONE, EPSILON_MATRIX, ROTATE_90/180/270, FLIP_X/Y/XY, SCALE_2, SCALE_HALF)
- [x] C4. Add @since to static constants in `core/matrix3.ts` (~12 constants: same pattern as matrix2)
- [x] C5. Add @since to static constants in `core/interval.ts` (~10 constants: ZERO, UNIT, SYMMETRIC_UNIT, POSITIVE, NEGATIVE, FULL, EPSILON_INTERVAL, PERCENT, DEGREES, RADIANS)
- [x] C6. Add @since to static constants in `core/transform2.ts` (~3 constants: IDENTITY, FLIP_X, FLIP_Y)
- [x] C7. Add @since to `config` object in `deterministic/deterministic-kernels.ts` (1 constant)
- [x] C8. **Checkpoint**: run `npm run build && npm run test:unit` — must pass

## Phase D: @file Path Fixes (5 files)

Remove `src/` prefix from @file tags. E.g., `@file src/utils/parse.ts` → `@file utils/parse.ts`.

- [x] D1. Fix @file path in `validation/assert.ts`, `utils/random-source.ts`, `utils/random.ts`, `utils/parse.ts`, `utils/performance.ts`

## Phase E: Tag Order Corrections (~15 functions)

Fix canonical tag order violations. Move tags within JSDoc blocks WITHOUT changing their content.

- [x] E1. In `auxiliary/scalar/arithmetic.ts`: fix @see appearing before @example in `loop`, `pingPong`, `mod` functions; fix @remarks after @example in `step`, `remap`
- [x] E2. In `auxiliary/scalar/comparison.ts`: fix @throws after @example in `relativeEquals`
- [x] E3. In `auxiliary/scalar/interpolation.ts`: fix @see before @example in `inverseLerp`; fix @see format (add dash separator) in `lerp`, `lerpClamped`
- [x] E4. In `auxiliary/angle/unwrapping.ts`: fix @throws after @example in `unwrapAngles`, `unwrapAnglesInPlace`
- [x] E5. In `auxiliary/angle/operations.ts`: fix @remarks after @example in `sinCosNormalized`
- [x] E6. In `auxiliary/numeric/rounding.ts`: fix @remarks after @example in `roundToPowerOfTwo`
- [x] E7. In `deterministic/deterministic-kernels.ts`: remove @since from file header (file headers should not have @since)
- [x] E8. **Checkpoint**: run `npm run build && npm run test:unit` — must pass

## Phase F: Triality Cross-Link Fixes (~20 gaps)

Fix @see cross-links, precondition formatting, and prohibited tags on triality variants.

- [x] F1. In `auxiliary/scalar/arithmetic.ts`: fix `loopUnchecked` (remove @example, change emoji→bold **Precondition:**, add @see to loop+loopSafe); fix `pingPongUnchecked` (same pattern); fix `modUnchecked` (same); fix `floorDivide`/`floorDivideSafe`/`floorDivideUnchecked` @see links; remove @throws from `loopSafe` if present
- [x] F2. In `auxiliary/scalar/interpolation.ts`: fix `inverseLerpUnchecked` (emoji→bold **Precondition:**, add @see to inverseLerp+inverseLerpSafe); add @example to `inverseLerpSafe`; add @see to `inverseLerpSafe` → `inverseLerp`
- [x] F3. In `auxiliary/numeric/wrapping.ts`: fix `flooredModUnchecked` (emoji→bold **Precondition:**, add @see to flooredMod+flooredModSafe); add @example to `flooredModSafe`
- [x] F4. In `deterministic/deterministic-kernels.ts`: add @see from `acos`→`acosSafe` and `asin`→`asinSafe`; add @throws to `acos` and `asin` strict variants if they throw
- [x] F5. Verify triality cross-links in core types (vector2.ts, complex.ts, rotation2.ts, matrix2.ts, matrix3.ts, transform2.ts, interval.ts) — check each *Safe/*Unchecked pair has correct @see links, no @throws on Safe, no @example on Unchecked. Fix any gaps found.
- [x] F6. **Checkpoint**: run `npm run build && npm run test:unit` — must pass

## Phase G: Class Documentation (~6 classes)

Add missing @remarks Design/Numerics/Safety sections and @example blocks on core type classes. Use Vector2's class JSDoc as the gold standard template.

- [x] G1. Add @remarks (Design/Numerics/Safety) and @example to `Complex` class in `core/complex.ts`
- [x] G2. Add @remarks (Design/Numerics/Safety) and @example to `Rotation2` class in `core/rotation2.ts`
- [x] G3. Add @remarks (Design/Numerics/Safety) to `Matrix2` class in `core/matrix2.ts` (restructure existing @remarks to standard format); add @example
- [x] G4. Add @remarks (Design/Numerics/Safety) to `Matrix3` class in `core/matrix3.ts` (restructure existing @remarks to standard format); add @example
- [x] G5. Add @remarks (Design/Numerics/Safety) and @example to `Interval` class in `core/interval.ts`; add file header @remarks
- [x] G6. Add @remarks (Design/Numerics/Safety) and @example to `Transform2` class in `core/transform2.ts`; add file header @remarks
- [x] G7. Add file header @remarks to `core/matrix2.ts`
- [x] G8. **Checkpoint**: run `npm run build && npm run test:unit` — must pass

## Phase H: @internal and Interface Fixes (small, targeted)

- [x] H1. In `deterministic/deterministic-kernels.ts`: remove @category and @since from `logKernelSafe` (@internal should have neither)
- [x] H2. In `types/index.ts`: remove @remarks and @example from `ReadonlyRotation2Like` (interfaces should have no @remarks/@example per Template 8)
- [x] H3. In `utils/parse.ts`: add @internal to `jsonFixed` helper function

## Phase I: Section Divider Width Fixes (2 files)

Fix file-level section dividers from 78-char to 80-char format.

- [x] I1. In `deterministic/deterministic-kernels.ts`: fix 6 file-level dividers from 78→80 chars
- [x] I2. In `core/matrix3.ts`: fix file-level dividers from 78→80 chars (class-level 78-char dividers are correct — do NOT change those)

## Phase J: Missing File Headers

- [x] J1. Verify all files have correct @file, @module, @description. Fix any remaining issues found.

## Phase K: Final Verification

- [x] K1. Run `npm run build && npm run test:unit` — must pass with zero failures
- [x] K2. Search all `src/**/*.ts` for deprecated @category values (Serialization, Predicate, Validation, Trigonometry, Utility, Component, Deterministic, Type Guards, Core on constants) — must find zero
- [x] K3. Search all `src/**/*.ts` for @group, @alpha, @beta tags — must find zero
- [x] K4. Verify no @example on \*Unchecked methods (search for pattern)
- [x] K5. Verify no @throws on \*Safe methods (search for pattern)
- [x] K6. Verify all exported constants have @constant {type} — spot check 10 constants
- [x] K7. Verify no @internal symbols have @category or @since — search for pattern

## Phase L: Post-Audit Gap Fixes (found during deep review)

### L1: Trailing periods missed in types/index.ts

- [x] L1a. Remove trailing periods from @param and @returns on all type guard functions and `hasNumericProperties` in `types/index.ts` (17 occurrences)

### L2: Trailing periods on @description tags

- [x] L2a. Remove trailing periods from @description in 8 files: `types/index.ts`, `core/index.ts`, `deterministic/deterministic-kernels.ts`, `index.ts`, `auxiliary/angle/index.ts`, `auxiliary/numeric/index.ts`, `auxiliary/scalar/constants.ts`, `auxiliary/scalar/index.ts`

### L3: @category vocabulary gaps (not covered by D6 lookup table)

- [x] L3a. In `core/vector2.ts`: replace `@category Initialization` → `@category Mutator` (3 occurrences: `setFromAngle`, `setFromArray`, `setFromObject`)
- [x] L3b. In `core/matrix2.ts`: replace `@category Composition` → `@category Matrix Operations` (2 occurrences)
- [x] L3c. In `core/matrix3.ts`: replace `@category Batch Operations` → `@category Matrix Operations` (4 occurrences), replace `@category Composition` → `@category Matrix Operations` (1 occurrence)

### L4: @see format and tag order in random.ts and deterministic-kernels.ts

- [x] L4a. In `deterministic/deterministic-kernels.ts`: wrap bare @see URLs with description format (2 occurrences: lines 26, 218)
- [x] L4b. In `utils/random.ts`: fix @see tag order (move before @category/@since) and wrap bare URLs (2 functions: `randomGaussianVector2`, `randomInTriangle`)

### L5: Final checkpoint

- [x] L5a. Run `npm run build && npm run test:unit` — must pass with zero failures
