## 1. Multi-Agent Research & Audit

- [x] 1.1 Run investigative agents to research `scale` vs `multiplyScalar` naming in external libraries.
- [x] 1.2 Run investigative agents to research `angle` vs `argument` naming for complex numbers.
- [x] 1.3 Run adversarial agent challenging the `multiplyScalar` recommendation.
- [x] 1.4 Run adversarial agent challenging the `angle` recommendation.
- [x] 1.5 Run integrator agent to synthesize findings and produce final naming recommendations.
- [x] 1.6 Final verification pass: grep entire src/ for aliases not in initial inventory.

## 2. Unify `scale` → `multiplyScalar` across all 5 core types

- [x] 2.1 Matrix2: Rename `scale` → `multiplyScalar` (static + instance), remove old alias.
- [x] 2.2 Matrix3: Rename `scale` → `multiplyScalar` (static + instance), remove old alias.
- [x] 2.3 Vector2: Rename `scale` → `multiplyScalar` (static + instance), update internal callers (normalize, setLength, clampLength, etc.).
- [x] 2.4 Complex: Rename static `scale` → `multiplyScalar`, rename instance `scale` → `multiplyScalar`.
- [x] 2.5 Interval: Rename static `multiplyScalar` (already correct name, just moved implementation from `scale`).
- [x] 2.6 Update `random.ts` caller (`out.scale(radius)` → `out.multiplyScalar(radius)`).
- [x] 2.7 Update JSDoc example in Vector2 class header.
- [x] 2.8 Update all tests across 6 test files (vector2, complex, interval, matrix2, matrix3, coverage-boost).
- [x] 2.9 Update property-based tests (vector2.property, edge-cases.property).

## 3. Remove Complex `argument()`, keep `angle`

- [x] 3.1 Inline `argument()` logic into `angle` getter.
- [x] 3.2 Remove `argument()` instance method.
- [x] 3.3 Rename static `Complex.argument()` → `Complex.angle()`.
- [x] 3.4 Update `angleDegrees`/`angleTurns` getters to use `this.angle`.
- [x] 3.5 Update all internal callers (pow, slerp, log).
- [x] 3.6 Update tests: complex.node.spec.ts, rotation2.node.spec.ts, angular.boundary.node.spec.ts.

## 4. Rename Interval `divide` → `divideScalar` (naming consistency)

- [x] 4.1 Rename static `divide` → `divideScalar`.
- [x] 4.2 Rename static `divideSafe` → `divideScalarSafe`.
- [x] 4.3 Rename static `divideUnchecked` → `divideScalarUnchecked`.
- [x] 4.4 Rename instance `divide` → `divideScalar`.
- [x] 4.5 Rename instance `divideSafe` → `divideScalarSafe`.
- [x] 4.6 Rename instance `divideUnchecked` → `divideScalarUnchecked`.
- [x] 4.7 Update error messages from `Interval.divide:` → `Interval.divideScalar:`.
- [x] 4.8 Update JSDoc cross-references (`@see`, `@link`).
- [x] 4.9 Update all tests in interval.node.spec.ts.

## 5. Minor naming consistency fixes

- [x] 5.1 Rename `fma` parameter `scale` → `scalar` in Vector2 (static + instance).
- [x] 5.2 Rename `fma` parameter `scale` → `scalar` in Matrix2 (static + instance).
- [x] 5.3 Rename `fma` parameter `scale` → `scalar` in Matrix3 (static + instance).
- [x] 5.4 Rename Matrix3 `addScalar` parameters `m`/`s` → `matrix`/`scalar`.
- [x] 5.5 Rename Matrix3 `subtractScalar` parameters `m`/`s` → `matrix`/`scalar`.

## 6. Documentation & validation

- [x] 6.1 Update ARCHITECTURE.md reference `Interval.divide` → `Interval.divideScalar`.
- [x] 6.2 Clean JSDoc on all renamed methods — no alias references.
- [x] 6.3 Build passes (`npm run build`).
- [x] 6.4 All 3458 tests pass (`npm run test:unit`).
- [x] 6.5 Verify zero `public scale()` methods in src.
- [x] 6.6 Verify zero `.argument()` calls in src/test.
- [x] 6.7 Verify zero `Interval.divide(` (without Scalar) in src/test.
- [x] 6.8 Verify zero `fma(.*scale` in src.
- [x] 6.9 Verify `toJSON`/`toObject` untouched across all 7 core types.
- [x] 6.10 Verify `scaleBy`, `fromScale`, `getScale`, `decompose` untouched.
- [x] 6.11 Verify `addScaledVector` parameter `scale` intentionally kept (semantic context).
