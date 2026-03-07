## 1. Deterministic Layer — Config Documentation

- [x] 1.1 Add JSDoc to `config` object in `src/deterministic/deterministic-kernels.ts` documenting global mutability, thread-safety constraints, and recommendation to set before computation

## 2. Auxiliary Layer Fixes

- [x] 2.1 Add `if (!Number.isFinite(value)) return value;` guard to `roundToPlaces` in `src/auxiliary/numeric/rounding.ts`
- [x] 2.2 Add `if (!Number.isFinite(value)) return value;` guard to `roundToMultiple` in `src/auxiliary/numeric/rounding.ts`
- [x] 2.3 Add `if (!Number.isFinite(value)) return value;` guard to `snapToGrid` in `src/auxiliary/numeric/rounding.ts`
- [x] 2.4 Fix `logSafe` one-line JSDoc description in `src/auxiliary/numeric/safety.ts` line 123: change "Safe logarithm (returns -Infinity for <= 0)" to "Safe logarithm (returns 0 for non-positive values)"
- [x] 2.5 Add tests for rounding functions with NaN/Infinity inputs in `test/auxiliary/numeric/rounding.node.spec.ts`
- [x] 2.6 Fix `unwrapAngles` JSDoc example in `src/auxiliary/angle/unwrapping.ts` line 28: documented output `[0, PI, 2*PI]` is wrong, actual output is `[0, -PI, -2*PI]`

## 3. Core Types — Vector2 Consistency Fixes

- [x] 3.1 Convert instance `angle()` method (line 3204) to `get angle()` getter (BREAKING: callers using `v.angle()` must change to `v.angle`; matches Complex/Rotation2 pattern)
- [x] 3.2 Add `set angle(radians: number)` setter: `this.setAngle(radians)` (matches Complex.set angle, Rotation2.set angle)
- [x] 3.3 Fix instance `reject()` at line 3610 to throw `RangeError` on near-zero axis (currently silently returns `this`; static version already throws correctly)
- [x] 3.4 Add instance `rejectSafe()` method to Vector2 class (static version already exists at line 1847)
- [x] 3.5 Add instance `rejectUnchecked()` method to Vector2 class (static version already exists at line 1874)
- [x] 3.6 Fix instance `project()` (line ~3495) to throw `RangeError` on near-zero axis (currently returns (0,0) silently; static version throws; same pattern as reject)
- [x] 3.7 Add instance `projectSafe()` and `projectUnchecked()` methods (static versions already exist)
- [x] 3.8 Fix instance `reflect()` (line ~3519) to validate unit-normal (static version validates; instance does not)
- [x] 3.9 Add tests for Vector2 `get angle` / `set angle` in `test/core/vector2.node.spec.ts`
- [x] 3.10 Add tests for Vector2 instance reject/project/reflect triality in `test/core/vector2.node.spec.ts`

## 4. Core Types — Normalize Optimization

- [x] 4.1 In static `Complex.normalize()` (line 735), replace `divideSafe(1, mag)` with direct `1 / mag` (magnitude already validated non-zero)
- [x] 4.2 In instance `Complex.normalize()` (line 1469), replace `divideSafe(1, mag)` with `1 / mag`
- [x] 4.3 In instance `Complex.normalizeSafe()` (line 1489), replace `divideSafe(1, mag)` with `1 / mag`
- [x] 4.4 In getter `get normalized` (line 1894), replace `divideSafe(1, mag)` with `1 / mag` (isNearZero already checked)
- [x] 4.5 In `Rotation2.normalizeComponents()` (line 163), replace `divideSafe(1, magnitude)` with `1 / magnitude` (isNearZero already checked)
- [x] 4.6 Note: Complex `get reciprocated` (line 1918) correctly uses `divideSafe(1, magSq)` — do NOT change (no prior validation)
- [x] 4.7 Verify existing Complex and Rotation2 normalize tests still pass

## 5. Validation Layer — Assertion Composition

- [x] 5.1 Refactor `assertVector2Like` to delegate to `isVector2Like` for structure check, then add finite validation for x/y (note: `isVector2Like` does NOT check isFinite)
- [x] 5.2 Refactor `assertMatrix2Like` to delegate to `isMatrix2Like` + finite checks
- [x] 5.3 Refactor `assertMatrix3Like` to delegate to `isMatrix3Like` + finite checks
- [x] 5.4 Refactor `assertRotation2Like` to delegate to `isRotation2Like` + finite checks
- [x] 5.5 Refactor `assertComplexLike` to delegate to `isComplexLike` + finite checks
- [x] 5.6 Refactor `assertIntervalLike` to delegate to `isIntervalLike` + finite checks
- [x] 5.7 Refactor `assertTransform2Like` to delegate to `isTransform2Like` + finite checks (currently uses nested assertVector2Like/assertRotation2Like)
- [x] 5.8 Verify all existing assertion tests pass after refactoring
- [x] 5.9 Add test verifying error messages include type information on failure

## 6. Support Layer — Serialization Fixes

- [x] 6.1 Update `formatTransform2` in `src/utils/parse.ts` to include scale in JSON output (`{p, r, s}`)
- [x] 6.2 Update `formatTransform2` flat format to output 6 components (`px,py,cos,sin,sx,sy`)
- [x] 6.3 Update `parseTransform2` to extract scale from JSON `s` field (default to `(1,1)` if absent)
- [x] 6.4 Update `parseTransform2` to handle 6-component flat format (with 4-component legacy fallback)
- [x] 6.5 Fix `parseTransform2` flat path (line 611) to avoid lossy `atan2` round-trip: directly set cos/sin on rotation instead of converting to angle and back
- [x] 6.6 Fix `parseInterval` to validate `min <= max` after JSON parse path (line 820 calls `out.set()` without validating min<=max; move validation before return)

## 7. Support Layer — RandomSource Encapsulation

- [x] 7.1 Remove `export let defaultRandomSource` from `src/utils/random-source.ts`; keep as module-private `let`
- [x] 7.2 Ensure `getDefaultRandomSource()` and `setDefaultRandomSource()` use the private variable
- [x] 7.3 Update `src/utils/random.ts` to use `getDefaultRandomSource()` instead of direct `defaultRandomSource` access
- [x] 7.4 Verify `defaultRandomSource` is NOT accessible via main barrel (confirmed: utils are not barrel-exported)
- [x] 7.5 Add tests verifying `getDefaultRandomSource` / `setDefaultRandomSource` work correctly

## 8. Edge Case Test Coverage

- [x] 8.1 Add NaN/Infinity tests for angle conversion functions (`degreesToRadians`, `radiansToDegrees`, `turnsToRadians`, `radiansToTurns`) in `test/auxiliary/angle/conversion.node.spec.ts`
- [x] 8.2 Add NaN/Infinity tests for angle normalization functions in `test/auxiliary/angle/normalization.node.spec.ts`
- [x] 8.3 Add NaN/Infinity tests for angle operations (`sinCos`, `angleDifference`, `angleDistance`, `lerpAngle`) in `test/auxiliary/angle/operations.node.spec.ts` and `test/auxiliary/angle/interpolation.node.spec.ts`
- [x] 8.4 Add NaN/Infinity tests for angle unwrapping in `test/auxiliary/angle/unwrapping.node.spec.ts`
- [x] 8.5 Add tests for `sign(NaN)`, `compare(1e308, 1e308)`, `inRange(NaN, ...)` in `test/auxiliary/scalar/scalar.node.spec.ts`
- [x] 8.6 Add NaN/Infinity property-based tests for Vector2 arithmetic in `test/properties/vector2.property.node.spec.ts`
- [x] 8.7 Add NaN/Infinity tests for Rotation2.fromAngle and Complex.magnitude in `test/core/rotation2.node.spec.ts` and `test/core/complex.node.spec.ts`

## 9. Parse/Format Round-Trip Test Suite

- [x] 9.1 Create `test/utils/parse.node.spec.ts` with round-trip tests for Vector2 (all 4 formats)
- [x] 9.2 Add round-trip tests for Rotation2 (radians, degrees, components, json)
- [x] 9.3 Add round-trip tests for Matrix2 (flat, nested, json)
- [x] 9.4 Add round-trip tests for Matrix3 (flat, nested, json)
- [x] 9.5 Add round-trip tests for Transform2 (flat, json) including scale preservation
- [x] 9.6 Add round-trip tests for Complex (math, csv, json)
- [x] 9.7 Add round-trip tests for Interval (brackets, csv, json)
- [x] 9.8 Add tests for parse error cases (malformed input, NaN-producing input)

## 10. Documentation & Normalization Fallback

- [x] 10.1 Add JSDoc `@remarks` to `Vector2.normalizeSafe` documenting `(0,0)` fallback rationale
- [x] 10.2 Add JSDoc `@remarks` to `Complex.normalizeSafe` documenting `(1,0)` fallback rationale (multiplicative identity)
- [x] 10.3 Add JSDoc `@remarks` to `Rotation2.normalizeSafe` documenting `(1,0)` fallback rationale (identity rotation)
- [x] 10.4 Document that Complex `get normalized` returns `(0,0)` for zero-magnitude (differs from `normalizeSafe` which returns `(1,0)` — inconsistency to consider)

## 11. Final Verification

- [x] 11.1 Run full test suite (`npm test`) and verify all tests pass
- [x] 11.2 Run build (`npm run build`) and verify no compilation errors
- [x] 11.3 Verify coverage thresholds still met (90% lines/statements/functions, 50% branches)
