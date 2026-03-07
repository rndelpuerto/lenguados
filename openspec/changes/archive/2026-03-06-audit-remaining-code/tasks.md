## 1. Complex.exp, Complex.log, Complex.toPolar

- [x] 1.1 Add static `exp(z: ReadonlyComplexLike, out?: Complex): Complex` to `src/core/complex.ts` using Euler's formula: `e^(re) * (cos(im) + i*sin(im))` with deterministic exp/sinCos
- [x] 1.2 Add instance `exp(): this` that delegates to static exp
- [x] 1.3 Add static `log(z: ReadonlyComplexLike, out?: Complex): Complex` using principal branch: `(log(magnitude), argument)` with deterministic log
- [x] 1.4 Add instance `log(): this` that delegates to static log
- [x] 1.5 Add static `toPolar(z: ReadonlyComplexLike): { magnitude: number; angle: number }` returning `{ magnitude: Complex.magnitude(z), angle: Complex.argument(z) }`
- [x] 1.6 Add instance `toPolar(): { magnitude: number; angle: number }` that delegates to static
- [x] 1.7 Add tests for `Complex.exp` in `test/core/complex.node.spec.ts`: zero, real, imaginary, Euler's identity, overflow, out parameter
- [x] 1.8 Add tests for `Complex.log` in `test/core/complex.node.spec.ts`: e, negative real, unit circle, zero (returns -Infinity), round-trip with exp
- [x] 1.9 Add tests for `Complex.toPolar` in `test/core/complex.node.spec.ts`: real axis, unit circle, zero, round-trip with fromPolar
- [x] 1.10 Add property-based test in `test/properties/complex.property.node.spec.ts`: `exp(log(z)) ≈ z` for non-zero z

## 2. Fix radiansToTurns conversion

- [x] 2.1 In `src/auxiliary/angle/conversion.ts`, change `radiansToTurns` from `return radians / TAU` to `return radians * RAD_TO_TURN`
- [x] 2.2 Add import of `RAD_TO_TURN` from `../scalar/constants` if not already imported
- [x] 2.3 Verify existing tests in `test/auxiliary/angle/conversion.node.spec.ts` still pass

## 3. Improve deterministic/exp 2^k scaling

- [x] 3.1 In `src/deterministic/deterministic-kernels.ts`, replace the bit-manipulation 2^k scaling in `exp` with two-step ldexp: `result * 2^(k/2) * 2^(k - k/2)`
- [x] 3.2 Add test for `exp(709)` (near overflow boundary) in `test/deterministic/deterministic-kernels.node.spec.ts`
- [x] 3.3 Add test for `exp(-745)` (near underflow boundary)
- [x] 3.4 Verify existing exp tests still pass (no regression for typical inputs)

## 4. Improve sinCos range reduction (Cody-Waite)

- [x] 4.1 In `src/deterministic/deterministic-kernels.ts`, add `PIO2_HI` and `PIO2_LO` split constants for Cody-Waite reduction
- [x] 4.2 Replace the naive `x % TAU` range reduction in `reduceAngle` with two-step Cody-Waite: `x - n * PIO2_HI - n * PIO2_LO`
- [x] 4.3 Add test for `sinCos(1000.0)` precision in `test/deterministic/deterministic-kernels.node.spec.ts`
- [x] 4.4 Add test for `sinCos(100000.0)` precision (accumulated angle scenario)
- [x] 4.5 Verify existing sin/cos tests still pass (no regression for |x| < 2π)
- [x] 4.6 Verify all property-based tests still pass after range reduction change

## 5. Add Safe variant suggestions to error messages

- [x] 5.1 In `src/validation/assert.ts`, update `assertFinite` error message to append `. Use ensureFinite() for a fallback value`
- [x] 5.2 Update `assertNonZero` error message to append `. Use divideSafe() for a fallback value`
- [x] 5.3 Update `assertPositive` error message to suggest appropriate Safe variant
- [x] 5.4 Update `assertNonNegative` error message to suggest appropriate Safe variant
- [x] 5.5 Update `assertRange` error message to include the valid range and actual value
- [x] 5.6 Do NOT add Safe suggestions to assertions without a corresponding Safe variant (assertVector2, assertMatrix2, etc.)
- [x] 5.7 Update assertion tests in `test/validation/assert.node.spec.ts` to verify new message format

## 6. Align Interval divide semantics

- [x] 6.1 Read `src/core/interval.ts` — document current static and instance divide signatures
- [x] 6.2 Check for internal consumers of instance `divide(Interval)` across `src/` and `test/`
- [x] 6.3 Change instance `divide` to accept `scalar: number` instead of `ReadonlyInterval`, matching static
- [x] 6.4 Update tests in `test/core/interval.node.spec.ts` for new instance divide signature
- [x] 6.5 Update any property tests that use instance divide

## 7. Re-export type guards from all core types

- [x] 7.1 Add `export { isComplexLike } from '../types'` to `src/core/complex.ts`
- [x] 7.2 Add `export { isRotation2Like } from '../types'` to `src/core/rotation2.ts`
- [x] 7.3 Add `export { isIntervalLike } from '../types'` to `src/core/interval.ts`
- [x] 7.4 Add `export { isTransform2Like } from '../types'` to `src/core/transform2.ts`
- [x] 7.5 Verify vector2, matrix2, matrix3 already re-export their type guards (no changes needed)
- [x] 7.6 Verify all type guards are accessible via `import { is*Like } from './core'`

## 8. Integration & Verification

- [x] 8.1 Run `npm run test:unit` — all tests must pass
- [x] 8.2 Run `npm run lint` — no lint errors in changed files
- [x] 8.3 Run `npm run build` — build succeeds with no type errors
- [x] 8.4 Verify coverage thresholds are still met (90% lines/statements, 85% functions, 50% branches)
