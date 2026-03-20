## 1. Deterministic Layer

- [x] 1.1 Audit and fix `deterministic/deterministic-kernels.ts`: file header (@file, @module, @description, @remarks with fdlibm/Cody-Waite context), @category values → controlled vocabulary, @internal on kernel functions (no @category/@since), section dividers 80-char format, canonical tag order, exported function mandatory tags

## 2. Auxiliary — Scalar

- [x] 2.1 Audit and fix `auxiliary/scalar/constants.ts`: file header, all constants have @constant {number}, sub-categories match vocabulary (Tolerance, Angular, Conversion, Mathematical, Numeric Limits, Collection), canonical tag order, conversion constants have @example
- [x] 2.2 Audit and fix `auxiliary/scalar/arithmetic.ts`: file header, all functions @category Arithmetic + @since, triality cross-links on remap/remapSafe and loop/loopSafe/loopUnchecked, imperative summaries, @param sentence fragments, @example 2+ cases, canonical tag order
- [x] 2.3 Audit and fix `auxiliary/scalar/comparison.ts`: file header, all functions @category Comparison + @since, canonical tag order, mandatory tags
- [x] 2.4 Audit and fix `auxiliary/scalar/interpolation.ts`: file header, all functions @category Interpolation + @since, triality cross-links where applicable, canonical tag order

## 3. Auxiliary — Numeric

- [x] 3.1 Audit and fix `auxiliary/numeric/safety.ts`: file header, all functions @category Safety + @since, MIN_SAFE_DIVISOR has @constant {number} + @remarks, re-export section divider, canonical tag order
- [x] 3.2 Audit and fix `auxiliary/numeric/wrapping.ts`: file header, triality cross-links on flooredMod/flooredModSafe/flooredModUnchecked (unchecked: no @example, bold precondition; safe: no @throws), @category Wrapping, canonical tag order
- [x] 3.3 Audit and fix `auxiliary/numeric/rounding.ts`: file header, @category Arithmetic, canonical tag order, mandatory tags
- [x] 3.4 Audit and fix `auxiliary/numeric/guards.ts`: file header, @category Guards, canonical tag order, mandatory tags

## 4. Auxiliary — Angle

- [x] 4.1 Audit and fix `auxiliary/angle/operations.ts`: file header, sinCos out-parameter docs ("Optional output object"), @category Arithmetic, section dividers, canonical tag order
- [x] 4.2 Audit and fix `auxiliary/angle/conversion.ts`: file header, @category Conversion, canonical tag order, mandatory tags
- [x] 4.3 Audit and fix `auxiliary/angle/normalization.ts`: file header, @category Normalization, canonical tag order, mandatory tags
- [x] 4.4 Audit and fix `auxiliary/angle/unwrapping.ts`: file header, @category Normalization, canonical tag order, mandatory tags
- [x] 4.5 Audit and fix `auxiliary/angle/interpolation.ts`: file header, @category Interpolation, canonical tag order, mandatory tags

## 5. Types Layer

- [x] 5.1 Audit and fix `types/index.ts`: file header, all \*Like interfaces have minimal JSDoc (@category Types + @since, no @remarks/@example), type guards have @category, @internal helpers have no @category/@since, section dividers 80-char format

## 6. Validation Layer

- [x] 6.1 Audit and fix `validation/assert.ts`: file header, public assertions @category Assertion, configuration functions @category Configuration, @internal symbols no @category/@since, canonical tag order

## 7. Core — Vector2

- [x] 7.1 Reorder `core/vector2.ts` class members to standard section order: Instance Properties → Static Constants → Constructor → Private Helpers → Static Factories → Static Arithmetic → Static Computed → Static Transforms → Static Interpolation → Static Comparison → [Static Type-Specific] → Instance Getters → Instance Mutators → Instance Arithmetic → Instance Computed → Instance Transforms → Instance Interpolation → Instance Comparison → [Instance Type-Specific] → Instance Conversion
- [x] 7.2 Fix Vector2 documentation: consolidate sections (merge "Numeric Transforms"+"Vector Transforms"+"Constraints" → Transforms; merge "Geometry & Measures"+"Direction & Angles" → Computed+Direction; merge all getter sections → Instance Getters; eliminate "Additional Instance Methods"), update @category to controlled vocabulary, fix file header (remove project name suffix), verify class JSDoc (Design/Numerics/Safety), fix all triality cross-links, add missing @category/@since on instance methods

## 8. Core — Complex

- [x] 8.1 Reorder `core/complex.ts` class members to standard section order
- [x] 8.2 Fix Complex documentation: replace "Predicate" → Comparison, "Serialization" → Conversion, merge "Instance Predicates" → Instance Comparison, verify file header, class JSDoc, triality cross-links, @internal on complexDivideSmith, add missing @category/@since

## 9. Core — Rotation2

- [x] 9.1 Reorder `core/rotation2.ts` class members to standard section order
- [x] 9.2 Fix Rotation2 documentation: replace "Serialization" → Conversion, merge "Instance Angle Accessors" → Instance Getters or Instance Computed, replace "Validation" → Comparison, verify file header, class JSDoc, triality cross-links, add missing @category/@since

## 10. Core — Matrix2

- [x] 10.1 Reorder `core/matrix2.ts` class members to standard section order
- [x] 10.2 Fix Matrix2 documentation: replace "Composition" → Matrix Operations, replace "Numeric Transforms" → Transforms, replace "Instance Transformations" → Instance Transforms, keep Matrix Operations as type-specific, verify file header, class JSDoc, triality cross-links, add missing @category/@since

## 11. Core — Matrix3

- [x] 11.1 Reorder `core/matrix3.ts` class members to standard section order
- [x] 11.2 Fix Matrix3 documentation: replace "Composition"/"Batch Operations" → Matrix Operations, replace "Numeric Transforms" → Transforms, keep Matrix Operations + Column/Row as type-specific, verify file header, class JSDoc, triality cross-links, add missing @category/@since

## 12. Core — Transform2

- [x] 12.1 Reorder `core/transform2.ts` class members to standard section order
- [x] 12.2 Fix Transform2 documentation: replace "Component Fields" → Instance Properties, merge "Matrix Conversion" → Instance Conversion, replace "Component" → Accessor, replace "Validation" → Comparison, verify file header, class JSDoc, triality cross-links, add missing @category/@since

## 13. Core — Interval

- [x] 13.1 Reorder `core/interval.ts` class members to standard section order
- [x] 13.2 Fix Interval documentation: keep Set Operations as type-specific, replace "Validation" → Comparison, verify file header, class JSDoc, triality cross-links, add missing @category/@since

## 14. Utils Layer

- [x] 14.1 Audit and fix `utils/random-source.ts`: file header, @category values match vocabulary, section dividers, canonical tag order, mandatory tags
- [x] 14.2 Audit and fix `utils/random.ts`: file header, factory functions @category Factory, section dividers per core type, canonical tag order, mandatory tags
- [x] 14.3 Audit and fix `utils/parse.ts`: file header, parse/format functions @category Conversion, section dividers per core type, canonical tag order, mandatory tags
- [x] 14.4 Audit and fix `utils/performance.ts`: file header, @category values match vocabulary, section dividers, canonical tag order, mandatory tags

## 15. Index / Barrel Files

- [x] 15.1 Audit and fix all index files: `src/index.ts`, `core/index.ts`, `auxiliary/scalar/index.ts`, `auxiliary/numeric/index.ts`, `auxiliary/angle/index.ts` — file headers (@file, @module, @description), re-export JSDoc where originals lack it

## 16. Cross-Cutting Verification

- [x] 16.1 Search all `src/**/*.ts` for deprecated @category values — fix any remaining
- [x] 16.2 Search all `src/**/*.ts` for @group, @alpha, @beta tags — remove any found
- [x] 16.3 Verify no @example on *Unchecked methods, no @throws on *Safe methods
- [x] 16.4 Verify all exported constants have @constant {type}
- [x] 16.5 Run `npm run build` and `npm run test:unit` — confirm zero regressions
