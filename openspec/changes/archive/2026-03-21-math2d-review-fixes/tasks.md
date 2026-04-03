# Tasks — math2d-review-fixes

## 1. P1 Fix: Rotation2 inversed → inverted (F1)

- [x] 1.1 Rename `get inversed()` to `get inverted()` in `core/rotation2.ts:1586`
- [x] 1.2 Update all internal usages of `.inversed` to `.inverted` across the codebase
- [x] 1.3 Update tests in `test/core/rotation2.node.spec.ts` referencing `inversed`
- [x] 1.4 Run `npm run test:unit` — verify all tests pass

## 2. P1 Fix: random.ts ReadonlyVector2 → ReadonlyVector2Like (F4)

- [x] 2.1 Change `randomOnSegment` params from `ReadonlyVector2` to `ReadonlyVector2Like` in `utils/random.ts:477-479`
- [x] 2.2 Change `randomInTriangle` params from `ReadonlyVector2` to `ReadonlyVector2Like` in `utils/random.ts:510-513`
- [x] 2.3 Change `randomOnTriangle` params from `ReadonlyVector2` to `ReadonlyVector2Like` in `utils/random.ts:554-557`
- [x] 2.4 Add `ReadonlyVector2Like` import if not already present
- [x] 2.5 Run `npm run test:unit` — verify all tests pass

## 3. P1 Fix: formatMatrix3 nested brackets (F5)

- [x] 3.1 Fix `formatMatrix3` nested case in `utils/parse.ts:537-542` to wrap with outer brackets `[[ ]]`
- [x] 3.2 Update/add test for formatMatrix3 nested format in test suite
- [x] 3.3 Run `npm run test:unit` — verify all tests pass

## 4. P2: assertRotation2Normalized (F3)

- [x] 4.1 Add `assertRotation2Normalized(cos, sin, tolerance?)` function in `validation/assert.ts` after `assertRotation2`
- [x] 4.2 Add tests for valid unit rotation, non-unit rotation (throws), near-unit within tolerance, NaN (throws), DEV_MODE=false (no-op)
- [x] 4.3 Export from `validation/index.ts` barrel if not auto-exported
- [x] 4.4 Run `npm run test:unit` — verify all tests pass

## 5. P2: Transform2 COMPONENT_COUNT (F6)

- [x] 5.1 Add `public static readonly COMPONENT_COUNT = 6` to `core/transform2.ts` near ELEMENT_COUNT
- [x] 5.2 Update ELEMENT_COUNT JSDoc to clarify: "Number of elements when serialized via toArray() (x, y, angle, sx, sy). See COMPONENT_COUNT for raw component count."
- [x] 5.3 Add JSDoc to COMPONENT_COUNT: "Number of raw components yielded by Symbol.iterator (px, py, cos, sin, sx, sy)."
- [x] 5.4 Add test verifying `[...transform].length === Transform2.COMPONENT_COUNT`
- [x] 5.5 Add test verifying `transform.toArray().length === Transform2.ELEMENT_COUNT`
- [x] 5.6 Run `npm run test:unit` — verify all tests pass

## 6. P2: Complex component-wise operations (F7)

- [x] 6.1 Add static `abs(z, out?)`, `floor(z, out?)`, `ceil(z, out?)`, `round(z, out?)`, `trunc(z, out?)` to `core/complex.ts`
- [x] 6.2 Add static `sign(z, out?)`, `min(a, b, out?)`, `max(a, b, out?)`, `clamp(z, min, max, out?)`, `mod(a, b, out?)` to `core/complex.ts`
- [x] 6.3 Add instance `abs()`, `floor()`, `ceil()`, `round()`, `trunc()`, `sign()` to Complex
- [x] 6.4 Add instance `min(other)`, `max(other)`, `clamp(min, max)`, `mod(other)` to Complex
- [x] 6.5 Add tests for all 10 static operations (representative values + NaN + Infinity + out param)
- [x] 6.6 Add tests for all 10 instance operations (mutation + chaining)
- [x] 6.7 Run `npm run test:unit` — verify all tests pass

## 7. P2: Interval component-wise operations (F8)

- [x] 7.1 Add static `floor(i, out?)`, `ceil(i, out?)`, `round(i, out?)`, `trunc(i, out?)`, `sign(i, out?)` to `core/interval.ts`
- [x] 7.2 Add static `min(a, b, out?)`, `max(a, b, out?)`, `clamp(i, min, max, out?)`, `mod(a, b, out?)` to `core/interval.ts`
- [x] 7.3 Add instance `floor()`, `ceil()`, `round()`, `trunc()`, `sign()` to Interval
- [x] 7.4 Add instance `clamp(min, max)`, `mod(other)` to Interval (min/max instance methods skipped — name collision with `min`/`max` properties)
- [x] 7.5 Add tests for all 9 static operations (representative values + out param)
- [x] 7.6 Add tests for 7 instance operations (mutation + chaining)
- [x] 7.7 Run `npm run test:unit` — verify all tests pass

## 8. P2: Vector2 inverted getter (F9)

- [x] 8.1 Add `get inverted(): Vector2` to `core/vector2.ts` after the `absolute` getter
- [x] 8.2 Add tests for `inverted` getter (normal values, zero component → Infinity)
- [x] 8.3 Run `npm run test:unit` — verify all tests pass

## 9. P2: sqrtSafe layer violation fix (F13)

- [x] 9.1 Remove `export { sqrtSafe } from '../auxiliary/numeric/safety'` from `deterministic/deterministic-kernels.ts:1002`
- [x] 9.2 Verify `sqrtSafe` is already exported from `auxiliary/numeric/index.ts`
- [x] 9.3 Verify `sqrtSafe` is accessible from the package barrel `src/index.ts`
- [x] 9.4 Fix `random.ts` import to use `auxiliary/numeric/safety` instead of `deterministic-kernels`
- [x] 9.5 Run `npm run test:unit` — verify no import breakage

## 10. P2: JSDoc edge case documentation (F10)

- [x] 10.1 Add @remarks to `angleBisector` documenting π-apart ambiguity
- [x] 10.2 Add @remarks to `smoothStep` documenting edge0 === edge1 degenerate case
- [x] 10.3 Already documented — `compensatedProduct` already has overflow @remarks (lines 297-300)
- [x] 10.4 Add @remarks to `sanitizeNumber` documenting fallback clamping behavior
- [x] 10.5 Add @remarks to `ensureFinite` documenting non-finite fallback replacement with 0
- [x] 10.6 Add @remarks to `fract` documenting NaN for non-finite inputs
- [x] 10.7 Add @remarks to `flooredMod` documenting isNearZero tolerance usage

## 11. P3: assert\*Like DCE documentation (F11)

- [x] 11.1 Add @remarks to each `assert*Like` function in `validation/assert.ts` documenting DCE elimination in production and recommending `is*Like()` for runtime validation

## 12. P3: premultiply allocation documentation (F12)

- [x] 12.1 Add @remarks to `Transform2.premultiply()` documenting internal temporary allocation and referencing `Transform2.multiply()` for hot paths

## 13. Final Verification

- [x] 13.1 Run `npm run test:unit` — all tests pass
- [x] 13.2 Run `npm run lint` — zero errors, zero warnings (10 pre-existing warnings in complex.ts/interval.ts)
