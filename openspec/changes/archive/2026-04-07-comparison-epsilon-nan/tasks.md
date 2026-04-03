## 1. Fix all epsilon guards in `comparison.ts`

- [x] 1.1 In `packages/math2d/src/auxiliary/scalar/comparison.ts`, replace all `if (epsilon < 0)` with `if (!(epsilon >= 0))` and update error messages from `"must be non-negative"` to `"must be a non-negative number"`. Affected lines: 36, 68, 96, 172, 197, 237, 268.
- [x] 1.2 Fix the `relativeEpsilon` guard (line ~136): replace `if (relativeEpsilon < 0)` with `if (!(relativeEpsilon >= 0))`. Update error message to `"relativeEpsilon must be a non-negative number"`.

## 2. Update TSDoc `@throws` tags

- [x] 2.1 For each function that has a `@throws` tag, update the condition description to include NaN: change `If epsilon is negative` to `If epsilon is negative or NaN`.
- [x] 2.2 For functions that do NOT yet have a `@throws` tag (check `lessThan`, `greaterThan`, `isNearZero`, `isNearOne`), add one: `@throws {RangeError} If epsilon is negative or NaN`.

## 3. Add NaN epsilon tests

- [x] 3.1 In `packages/math2d/test/auxiliary/scalar/comparison.node.spec.ts`, add NaN epsilon test cases to the existing "epsilon non-negative validation" section for each function:
  - `nearEquals`: `expect(() => nearEquals(1, 2, NaN)).toThrow(RangeError)`
  - `isNearZero`: `expect(() => isNearZero(0, NaN)).toThrow(RangeError)`
  - `isNearOne`: `expect(() => isNearOne(1, NaN)).toThrow(RangeError)`
  - `relativeEquals`: `expect(() => relativeEquals(1, 2, NaN)).toThrow(RangeError)`
  - `lessThan`: `expect(() => lessThan(1, 2, NaN)).toThrow(RangeError)`
  - `greaterThan`: `expect(() => greaterThan(2, 1, NaN)).toThrow(RangeError)`
  - `inRange`: `expect(() => inRange(5, 0, 10, NaN)).toThrow(RangeError)`
  - `compare`: `expect(() => compare(1, 2, NaN)).toThrow(RangeError)`

## 4. Final verification

- [x] 4.1 Run comparison tests: `npx jest --testPathPattern="comparison" --no-coverage`. All existing tests must pass. All 8 new NaN tests must pass.
- [x] 4.2 Run lint: `npm run lint`. Verify no style violations.
- [x] 4.3 Run full test suite: `npm run test:unit`. Verify no regressions in any core type that uses comparison functions.
