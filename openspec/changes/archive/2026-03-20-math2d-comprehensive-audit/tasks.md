## 1. Layer Dependency Fix

- [x] 1.1 Define `PI = Math.PI`, `HALF_PI = Math.PI / 2`, `QUARTER_PI = Math.PI / 4` locally in `deterministic/deterministic-kernels.ts` with cross-reference comments to `auxiliary/scalar/constants.ts`
- [x] 1.2 Remove the import `{ HALF_PI, PI, QUARTER_PI }` from `auxiliary/scalar/constants` in `deterministic/deterministic-kernels.ts`
- [x] 1.3 Verify no remaining upward imports from `deterministic/` to `auxiliary/`
- [x] 1.4 Run `npm run test:unit` to confirm zero regressions

## 2. Deprecate Constants — Vector2

- [x] 2.1 Add `@deprecated` to `EPSILON_VECTOR` with message "Use a locally defined frozen constant: `Object.freeze(new Vector2(EPSILON, EPSILON))` instead"
- [x] 2.2 Add `@deprecated` to `NEGATIVE_ONE` with message "Use `new Vector2(-1, -1)` instead"
- [x] 2.3 Add `@deprecated` to `UNIT_DIAGONAL` with message "Use `new Vector2(Math.SQRT1_2, Math.SQRT1_2)` instead"
- [x] 2.4 Add `@deprecated` to `NEGATIVE_UNIT_DIAGONAL` with message "Use `new Vector2(-Math.SQRT1_2, -Math.SQRT1_2)` instead"

## 3. Deprecate Constants — Complex

- [x] 3.1 Add `@deprecated` to `EPSILON_COMPLEX` with message "Use a locally defined frozen constant: `Object.freeze(new Complex(EPSILON, EPSILON))` instead"
- [x] 3.2 Add `@deprecated` to `SQRT2` with message "Use `new Complex(Math.SQRT2, 0)` instead"
- [x] 3.3 Add `@deprecated` to `SQRT2_INV` with message "Use `new Complex(Math.SQRT1_2, 0)` instead"
- [x] 3.4 Add `@deprecated` to `PI` with message "Use `new Complex(Math.PI, 0)` instead"
- [x] 3.5 Add `@deprecated` to `E` with message "Use `new Complex(Math.E, 0)` instead"

## 4. Deprecate Constants — Matrix2 and Matrix3

- [x] 4.1 Add `@deprecated` to Matrix2: `ONE`, `EPSILON_MATRIX`, `SCALE_2`, `SCALE_HALF`
- [x] 4.2 Add `@deprecated` to Matrix3: `ONE`, `EPSILON_MATRIX`, `SCALE_2`, `SCALE_HALF`

## 5. Deprecate Constants — Interval

- [x] 5.1 Add `@deprecated` to `PERCENT`, `DEGREES`, `RADIANS` in `interval.ts` with messages suggesting inline construction (e.g., "Define application-level constant: `const DEGREES = new Interval(0, 360)`")

## 6. Deprecate Matrix2/3 Component-Wise Rounding

- [x] 6.1 Add `@deprecated` to Matrix2 static+instance: `floor`, `ceil`, `round`, `trunc`, `sign` with message "Uncommon for matrices; access components directly if needed"
- [x] 6.2 Add `@deprecated` to Matrix3 static+instance: `floor`, `ceil`, `round`, `trunc`, `sign` with same message

## 7. Deprecate Rotation2.negated

- [x] 7.1 Add `@deprecated Use \`inversed\` instead — negated is an exact duplicate of inversed for unit rotations.`to`Rotation2.prototype.negated` getter

## 8. Run Tests After All Deprecations

- [x] 8.1 Run `npm run test:unit` to confirm all 3308+ tests still pass with deprecation annotations

## 9. Fix Documentation Bugs

- [x] 9.1 Fix `angleBisector` JSDoc example in `auxiliary/angle/operations.ts`: change `angleBisector(0, Math.PI); // Math.PI / 2` to either `angleBisector(0, Math.PI); // -Math.PI / 2` or replace with unambiguous example `angleBisector(0, Math.PI / 2); // Math.PI / 4`
- [x] 9.2 Add `@remarks` to `Rotation2` constructor JSDoc warning that it does NOT normalize cos/sin
- [x] 9.3 Add `@remarks` to `Rotation2.fromCS` JSDoc documenting that `set()` normalizes the pair
- [x] 9.4 Add `@see isInRange` to `inRange` JSDoc with note "For exact (non-tolerant) range checking"
- [x] 9.5 Add `@see inRange` to `isInRange` JSDoc with note "For epsilon-tolerant range checking"

## 10. Fix smoothStep Redundancy

- [x] 10.1 In `complex.ts` instance `smoothStep` (~L2431): remove the `const clamped = saturate(t);` line and pass `t` directly to `smoothStep(0, 1, t)`
- [x] 10.2 In `interval.ts` static `smoothStep` (~L873): change `smoothStep(0, 1, saturate(t))` to `smoothStep(0, 1, t)`
- [x] 10.3 In `interval.ts` instance `smoothStep` (~L2049): change `smoothStep(0, 1, saturate(t))` to `smoothStep(0, 1, t)`
- [x] 10.4 Run `npm run test:unit` to verify no behavioral change

## 11. Fix Cross-Module Consistency

- [x] 11.1 Change Rotation2 frozen constants (`IDENTITY`, `HALF_PI`, `PI`, `NEGATIVE_HALF_PI`) type from `ReadonlyRotation2Like` to `ReadonlyRotation2`
- [x] 11.2 Add `Symbol.iterator` to Transform2 yielding `[position.x, position.y, rotation.cos, rotation.sin, scale.x, scale.y]` with extensive JSDoc documenting field order and heterogeneous nature

## 12. Add Matrix3.fromReflection

- [x] 12.1 Add `Matrix3.fromReflection(normal: ReadonlyVector2Like, out?: Matrix3): Matrix3` static factory implementing Householder reflector `I - 2nn^T`
- [x] 12.2 Export `fromReflection` from Matrix3 barrel

## 13. Tests for New/Changed Items

- [x] 13.1 Add tests for `Matrix3.fromReflection` (Y-axis normal, X-axis normal, diagonal normal, out param)
- [x] 13.2 Add tests for `Transform2[Symbol.iterator]` (component order, destructuring)
- [x] 13.3 Add tests for smoothStep changes (verify identical results with and without redundant saturate)

## 14. Final Validation

- [x] 14.1 Run full `npm run test:unit` — all tests must pass
- [x] 14.2 Run `npm run lint` — no lint errors
- [x] 14.3 Run `npm run build` — clean build with no warnings

## DEFERRED Items (not in this change)

The following items require separate evaluation:

- **Vector2.isParallel/isPerpendicular tolerance normalization** — Behavioral change that violates the "zero behavioral changes" constraint. Needs separate proposal.
- **Matrix2/3 addScalar/subtractScalar deprecation** — Not part of API hardening but need to verify provenance. Needs research.
- **Complex.fromAngle** — Trivial alias for `fromPolar(1, angle)`. Uncertain value vs API surface cost.
- **Matrix3 affine hot-path methods** — Outside audit's benchmarking scope. Needs separate proposal with benchmarks.

## REVERSED Items (explicitly NOT in this change)

These items were proposed but reversed during adversarial review:

- **GOLDEN_RATIO/GOLDEN_RATIO_CONJUGATE deprecation** — Ratified `performance-architecture` spec mandates these constants.
- **isPositiveInfinity/isNegativeInfinity/isInfinity deprecation** — Prior foundations audit explicitly ruled "Keep."
- **Matrix mod/modScalar deprecation** — Deliberately added by ratified API hardening change.
- **remapSafe boundary guard fix** — Bug does not exist; function already handles degenerate input.
- **moveTowards/Vector2.moveTowards/moveTowardsAngle additions** — Ratified spec explicitly rejected as "game engine convenience."
