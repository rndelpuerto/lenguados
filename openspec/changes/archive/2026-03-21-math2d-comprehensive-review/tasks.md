# Tasks — math2d-comprehensive-review

## 1. Layer Agent L0: Deterministic Kernels

- [x] 1.1 Review `deterministic/deterministic-kernels.ts` — fdlibm fidelity, polynomial coefficients, edge cases (NaN, Infinity, denormals, ±0), local constants correctness
- [x] 1.2 Verify layer isolation — confirm NO imports from auxiliary/ or higher layers; check line ~1002 `sqrtSafe` re-export for circular dependency
- [x] 1.3 Document findings for L0 in findings.md

## 2. Layer Agent L1a: Scalar Utilities

- [x] 2.1 Review `auxiliary/scalar/constants.ts` — EPSILON value, exported constant completeness, naming
- [x] 2.2 Review `auxiliary/scalar/arithmetic.ts` — lerp, clamp, saturate, remap, smoothStep, sign; edge cases with NaN/Infinity/±0
- [x] 2.3 Review `auxiliary/scalar/comparison.ts` — nearEquals, nearZero tolerance handling, @see cross-references
- [x] 2.4 Review `auxiliary/scalar/interpolation.ts` — interpolation functions, parameter validation
- [x] 2.5 Review `auxiliary/scalar/index.ts` — barrel exports completeness
- [x] 2.6 Document findings for L1a in findings.md

## 3. Layer Agent L1b: Angle Utilities

- [x] 3.1 Review `auxiliary/angle/conversion.ts` — deg/rad conversion, constant accuracy
- [x] 3.2 Review `auxiliary/angle/interpolation.ts` — angle lerp/slerp, wrapping behavior
- [x] 3.3 Review `auxiliary/angle/normalization.ts` — normalizeAngle, wrapAngle ranges
- [x] 3.4 Review `auxiliary/angle/operations.ts` — angleBetween, angleBisector, anglesNearEqual; verify JSDoc accuracy (anglesNearEqual tolerance parameter, angleBisector description)
- [x] 3.5 Review `auxiliary/angle/unwrapping.ts` — AngleUnwrapper class, JSDoc accuracy (known bug: class description may be inaccurate)
- [x] 3.6 Review `auxiliary/angle/index.ts` — barrel exports
- [x] 3.7 Document findings for L1b in findings.md

## 4. Layer Agent L1c: Numeric Utilities

- [x] 4.1 Review `auxiliary/numeric/guards.ts` — isNearZero, isFiniteNumber, type guards; @see cross-references
- [x] 4.2 Review `auxiliary/numeric/safety.ts` — safeDivide, safeSqrt, safeInverse; safety contracts, error handling tiers
- [x] 4.3 Review `auxiliary/numeric/rounding.ts` — roundToPlaces, snapToGrid; precision handling
- [x] 4.4 Review `auxiliary/numeric/wrapping.ts` — wrap, pingPong; boundary behavior
- [x] 4.5 Review `auxiliary/numeric/index.ts` — barrel exports
- [x] 4.6 Document findings for L1c in findings.md

## 5. Core Type Agent C1: Vector2

- [x] 5.1 Review `core/vector2.ts` — API completeness: static+instance symmetry, negate triple, clone/copy/equals/nearEquals, component-wise ops, factory methods, predicates
- [x] 5.2 Verify constants: ZERO, ONE, NEGATIVE_ONE, UNIT_X/Y, NEGATIVE_UNIT_X/Y, UNIT_DIAGONAL, NEGATIVE_UNIT_DIAGONAL, POSITIVE/NEGATIVE_INFINITY — all frozen, all correct values
- [x] 5.3 Check for missing `inverted` getter (inversed exists but inverted does not — consistency with other types)
- [x] 5.4 Verify all \*CS variants exist where applicable (rotateCS, etc.)
- [x] 5.5 Verify Safe/Unchecked variants for fallible operations (normalize, divide)
- [x] 5.6 Review test coverage in `test/core/vector2.node.spec.ts`
- [x] 5.7 Document findings for C1 in findings.md

## 6. Core Type Agent C2: Complex

- [x] 6.1 Review `core/complex.ts` — API completeness, static+instance symmetry
- [x] 6.2 Verify Complex has ALL component-wise operations that Vector2/Matrix2/Matrix3 have (abs, floor, ceil, round, trunc, sign, min, max, clamp, mod) — CONFIRMED: Complex is missing ALL of these
- [x] 6.3 Verify slerp instance method has zero-magnitude guard matching static version — VERIFIED: BOTH have identical guards (FALSE POSITIVE from prior audit)
- [x] 6.4 Verify pow instance method validates `0^(-n)` matching static version — VERIFIED: BOTH have identical validation (FALSE POSITIVE from prior audit)
- [x] 6.5 Review algebraic operations: add, subtract, multiply, divide, pow, sqrt, exp, log, conjugate, reciprocal
- [x] 6.6 Check addScalar/subtractScalar existence and correctness
- [x] 6.7 Review test coverage in `test/core/complex.node.spec.ts`
- [x] 6.8 Document findings for C2 in findings.md

## 7. Core Type Agent C3: Matrix2

- [x] 7.1 Review `core/matrix2.ts` — API completeness, static+instance symmetry
- [x] 7.2 Verify component-wise ops: abs, floor, ceil, round, trunc, sign, min, max, clamp, mod
- [x] 7.3 Verify smoothStep implementation (no redundant saturate call)
- [x] 7.4 Verify constants set is complete and correct (IDENTITY, ZERO, ROTATE_90/180/270, FLIP_X/Y/XY)
- [x] 7.5 Check Safe/Unchecked variants: inverseSafe, inverseUnchecked, divideScalarSafe, divideScalarUnchecked
- [x] 7.6 Review test coverage — verify Safe/Unchecked variants have tests
- [x] 7.7 Document findings for C3 in findings.md

## 8. Core Type Agent C4: Matrix3

- [x] 8.1 Review `core/matrix3.ts` — API completeness, static+instance symmetry
- [x] 8.2 Verify component-wise ops match Matrix2 pattern
- [x] 8.3 Verify affine structure methods: fromTranslation, fromRotation, fromScale, fromReflection, decompose
- [x] 8.4 Check for static `getRotation()`, `getScale()`, `getTranslation()` methods — VERIFIED: ALL EXIST (FALSE POSITIVE from prior audit)
- [x] 8.5 Verify Safe/Unchecked variants have tests
- [x] 8.6 Review test coverage in `test/core/matrix3.node.spec.ts`
- [x] 8.7 Document findings for C4 in findings.md

## 9. Core Type Agent C5: Interval

- [x] 9.1 Review `core/interval.ts` — API completeness, static+instance symmetry
- [x] 9.2 Verify component-wise ops and algebraic completeness
- [x] 9.3 Verify constants: ZERO, UNIT, SYMMETRIC_UNIT, POSITIVE, NEGATIVE, FULL, EPSILON_INTERVAL, DEGREES, RADIANS
- [x] 9.4 Review interval-specific operations: contains, overlaps, intersection, union, expand, width, center, sample
- [x] 9.5 Review test coverage in `test/core/interval.node.spec.ts`
- [x] 9.6 Document findings for C5 in findings.md

## 10. Core Type Agent C6: Rotation2

- [x] 10.1 Review `core/rotation2.ts` — API completeness, static+instance symmetry
- [x] 10.2 Verify negate triple: static negate(), instance negate(), getter negated — all producing (-cos, -sin)
- [x] 10.3 Verify inverse triple: static inverse(), instance inverse(), getter inversed — all producing (cos, -sin)
- [x] 10.4 Check for missing `conjugated` getter — JUSTIFIED ABSENCE (would duplicate inversed; conjugate = inverse for unit complex)
- [x] 10.5 Evaluate naming: `inversed` vs `inverted` — CONFIRMED: all other types use `inverted`
- [x] 10.6 Verify constructor does NOT normalize but set() DOES — CONFIRMED: JSDoc accurately documents this
- [x] 10.7 Review test coverage in `test/core/rotation2.node.spec.ts`
- [x] 10.8 Document findings for C6 in findings.md

## 11. Core Type Agent C7: Transform2

- [x] 11.1 Review `core/transform2.ts` — API completeness, static+instance symmetry
- [x] 11.2 Verify composite patterns: multiply, inverse, apply/transform
- [x] 11.3 Check for missing `negate` operations — INTENTIONALLY ABSENT (SRT negate semantically undefined)
- [x] 11.4 Verify instance multiply() allocation pattern — FALSE ALARM: already optimized with inline cos/sin
- [x] 11.5 Verify Symbol.iterator yields 6 components in correct order
- [x] 11.6 Review batch operations: transformPoints(), transformVectors() — accept ReadonlyVector2Like[] correctly
- [x] 11.7 Review test coverage — batch operations have tests
- [x] 11.8 Document findings for C7 in findings.md

## 12. Support Agent S1: Types & Validation

- [x] 12.1 Review `types/index.ts` — all 7 \*Like interfaces match class properties; Readonly variants correct
- [x] 12.2 Review `validation/assert.ts` — assertion functions, tree-shaking correctly implemented via DCE
- [x] 12.3 Verify all 7 core types have corresponding *Like and Readonly*Like interfaces
- [x] 12.4 Document findings for S1 in findings.md

## 13. Support Agent S2: Utils

- [x] 13.1 Review `utils/parse.ts` — parse round-trip correctness confirmed; formatMatrix3 nested bug found
- [x] 13.2 Review `utils/random.ts` — random generation for all 7 types; xoshiro128++ verified
- [x] 13.3 Review `utils/random-source.ts` — PRNG implementation excellent, state save/restore works
- [x] 13.4 Review `utils/performance.ts` — performance.now() with Date.now() fallback; API suitable
- [x] 13.5 Check randomOnSegment/randomOnTriangle — CONFIRMED: accept concrete ReadonlyVector2 instead of \*Like
- [x] 13.6 Document findings for S2 in findings.md

## 14. Cross-Cutting Agent X1: Pattern Consistency

- [x] 14.1 Build complete pattern matrix across all 7 core types: negate triple, inverse triple, clone/copy, equals/nearEquals
- [x] 14.2 Build component-wise ops matrix: abs, floor, ceil, round, trunc, sign, min, max, clamp, mod
- [x] 14.3 Build factory methods matrix: fromArray, fromValues, from*Like, from* specializations
- [x] 14.4 Build predicates matrix: isZero, isNearZero, isFinite, hasNaN, hasInfinity
- [x] 14.5 Build validation tiers matrix: strict/Safe/Unchecked variants across all types
- [x] 14.6 Identify all gaps with mathematical justification for each
- [x] 14.7 Document pattern matrix tables and gaps in findings.md

## 15. Cross-Cutting Agent X2: Barrel & Dependency

- [x] 15.1 Verify `src/index.ts` exports everything from all layers
- [x] 15.2 Verify each layer's `index.ts` re-exports all public symbols from its files
- [x] 15.3 Check for circular dependencies across all layers
- [x] 15.4 Verify `package.json` conditional exports (development vs production) for tree-shaking
- [x] 15.5 Document findings for X2 in findings.md

## 16. Adversarial Agent A1: Philosophy Guardian

- [x] 16.1 Read ALL findings from tasks 1-15
- [x] 16.2 Read CLAUDE.md, math2d-patterns.md rule, README.md for philosophy context
- [x] 16.3 Challenge every finding against: Completeness, Performance, Safety, Determinism
- [x] 16.4 Mark findings as APPROVED, REJECTED, or NEEDS-DISCUSSION
- [x] 16.5 Document A1 verdicts in findings.md

## 17. Adversarial Agent A2: DX Advocate

- [x] 17.1 Read ALL findings from tasks 1-15
- [x] 17.2 Evaluate each finding for DX impact
- [x] 17.3 Mark findings as DX-APPROVED, DX-CONCERN, or DX-BLOCKED
- [x] 17.4 Document A2 verdicts in findings.md

## 18. Consolidation

- [x] 18.1 Merge all agent findings into a single `findings.md` organized by priority (P0 → P3), then by layer
- [x] 18.2 Include adversarial verdicts (A1 + A2) inline with each finding
- [x] 18.3 Generate summary statistics: total findings by priority, by layer, by type
- [x] 18.4 Final review: verify every finding has all required fields, every file was reviewed, pattern matrices are complete
