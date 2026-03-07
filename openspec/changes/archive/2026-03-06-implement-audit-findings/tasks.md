## 1. P1 — Bug Fix: Transform2 Deep Freeze

- [x] 1.1 In `src/core/transform2.ts`, update IDENTITY, FLIP_X, FLIP_Y static constants to deep freeze nested objects using `freezeVector2()` on position and scale, and `freezeRotation2()` on rotation
- [x] 1.2 Add tests in `test/core/transform2.node.spec.ts` verifying that `Transform2.IDENTITY.position.x = 99` throws TypeError in strict mode, and same for rotation.cos and scale.x
- [x] 1.3 Verify FLIP_X and FLIP_Y are also deeply frozen with similar tests

## 2. P2 — Rename Vector2.magnitudeSquared → magnitudeSq

- [x] 2.1 Rename the static method `magnitudeSquared` → `magnitudeSq` in `src/core/vector2.ts`
- [x] 2.2 Rename the instance getter `magnitudeSquared` → `magnitudeSq` in `src/core/vector2.ts`
- [x] 2.3 Update all internal call sites that reference `magnitudeSquared` across `src/` (grep and replace)
- [x] 2.4 Update all tests that reference `magnitudeSquared` across `test/`
- [x] 2.5 Update `src/index.ts` exports if `magnitudeSquared` is explicitly listed

## 3. P2 — Rename Rotation2.negate → conjugate

- [x] 3.1 Rename static method `negate` → `conjugate` in `src/core/rotation2.ts`
- [x] 3.2 Rename instance method `negate` → `conjugate` in `src/core/rotation2.ts`
- [x] 3.3 Update all internal call sites referencing `Rotation2.negate` or `.negate()` across `src/`
- [x] 3.4 Update all tests referencing `negate` in `test/core/rotation2.node.spec.ts` and property tests
- [x] 3.5 Add TSDoc `@remarks` to `conjugate` explaining it returns the inverse rotation (cos, -sin)

## 4. P2 — Remove Rotation2.slerp, Rotation2.angleValue, Interval.NORMALIZED

- [x] 4.1 Remove `slerp` static and instance methods from `src/core/rotation2.ts`
- [x] 4.2 Remove `angleValue` getter from `src/core/rotation2.ts`
- [x] 4.3 Add `@remarks` TSDoc to `Rotation2.lerp` documenting that lerp IS slerp in 2D for unit complex numbers
- [x] 4.4 Remove `NORMALIZED` static constant from `src/core/interval.ts`
- [x] 4.5 Remove tests for `slerp`, `angleValue`, and `NORMALIZED` from test files
- [x] 4.6 Update `src/index.ts` exports if any removed entities are explicitly listed

## 5. P2 — Add ReadonlyRotation2 type alias

- [x] 5.1 Add `export type ReadonlyRotation2 = Readonly<Rotation2>` in `src/core/rotation2.ts`
- [x] 5.2 Add `export function freezeRotation2(r: Rotation2): ReadonlyRotation2` return type update if needed
- [x] 5.3 Export `ReadonlyRotation2` from `src/index.ts`

## 6. P3 — Remove custom sqrt from deterministic/

- [x] 6.1 Remove the `sqrt` function implementation from `src/deterministic/deterministic-kernels.ts`
- [x] 6.2 Remove `sqrt` from the `DeterministicKernels` object
- [x] 6.3 Remove `sqrt` from the named exports
- [x] 6.4 Update `hypot` in deterministic-kernels.ts to use `Math.sqrt` instead of the custom `sqrt`
- [x] 6.5 Update all internal imports that use `sqrt` from deterministic/ to use `Math.sqrt` directly
- [x] 6.6 Update tests in `test/` that reference the deterministic `sqrt` function

## 7. P3 — Move sqrtSafe to numeric/safety

- [x] 7.1 Move `sqrtSafe` implementation to `src/auxiliary/numeric/safety.ts` with body: `x <= 0 ? 0 : Math.sqrt(x)`
- [x] 7.2 Add re-export of `sqrtSafe` from `src/deterministic/deterministic-kernels.ts` for backward compatibility
- [x] 7.3 Update barrel exports in `src/auxiliary/numeric/index.ts` if needed
- [x] 7.4 Update tests for `sqrtSafe` to reflect the new location and Math.sqrt implementation

## 8. P3 — Fix sinCos delegation and add out parameter

- [x] 8.1 Add `out?: SinCos` parameter to `deterministic/sinCos` in `src/deterministic/deterministic-kernels.ts`
- [x] 8.2 Update `angle/sinCos` in `src/auxiliary/angle/operations.ts` to delegate to `deterministic/sinCos` instead of calling `sin()` and `cos()` separately
- [x] 8.3 Update tests for `sinCos` in both `test/auxiliary/angle/` and any deterministic tests

## 9. P4 — Remove ANGLE_EPSILON and GOLDEN_RATIO constants

- [x] 9.1 Remove `ANGLE_EPSILON` from `src/auxiliary/scalar/constants.ts`
- [x] 9.2 Remove `GOLDEN_RATIO` from `src/auxiliary/scalar/constants.ts` (keep `GOLDEN_RATIO_CONJUGATE`)
- [x] 9.3 Remove both from the `Constants` unified object
- [x] 9.4 Update `src/auxiliary/scalar/index.ts` barrel exports
- [x] 9.5 Update any tests that reference `ANGLE_EPSILON` or `GOLDEN_RATIO`
- [x] 9.6 Update `src/index.ts` exports if explicitly listed

## 10. Integration & Verification

- [x] 10.1 Run `npm run test:unit` — all tests must pass
- [x] 10.2 Run `npm run lint` — no lint errors (only pre-existing archive benchmark warnings)
- [x] 10.3 Run `npm run build` — build succeeds with no type errors
- [x] 10.4 Verify coverage thresholds are still met (90% lines/statements, 85% functions, 50% branches)
