## Context

`comparison.ts` contains 8 tolerance-accepting functions. All already guard against negative epsilon. None guard against NaN epsilon. This was identified during the post-audit review of `math2d-comprehensive-audit` and deferred pending verification.

Exhaustive investigation confirmed:

- 7 guards named `epsilon`, 1 named `relativeEpsilon` (in `relativeEquals`)
- All 8 are equivalent: `if (parameterName < 0) throw RangeError`
- Zero tests cover NaN epsilon
- Zero specs require NaN epsilon validation
- Zero call sites in the codebase pass dynamic epsilon (all use `EPSILON` constant or literals)

## Goals / Non-Goals

**Goals:**

- Close the asymmetry: both negative AND NaN epsilon must be rejected
- Update TSDoc `@throws` to document the complete guard condition
- Add 8 tests (one per function) verifying NaN epsilon throws

**Non-Goals:**

- Validating Infinity epsilon — `Infinity` is mathematically valid (tolerance = "everything is equal") and already handled correctly
- Adding validation to auxiliary functions outside `comparison.ts`
- Adding a new validation tier — this is purely extending the existing guard
- Changing error message wording significantly (keep existing style)

## Decision: `!(epsilon >= 0)` as the unified guard

**Choice**: Replace `if (epsilon < 0)` with `if (!(epsilon >= 0))` in all 8 guards.

**Why this condition**: `!(x >= 0)` is the canonical IEEE 754 way to test "x is negative OR x is NaN" using a single comparison:

| Value       | `x < 0`         | `!(x >= 0)`          |
| ----------- | --------------- | -------------------- |
| `0`         | false           | false (not thrown) ✓ |
| `0.1`       | false           | false (not thrown) ✓ |
| `-0.1`      | **true**        | **true** (thrown) ✓  |
| `NaN`       | false ← **BUG** | **true** (thrown) ✓  |
| `Infinity`  | false           | false (not thrown) ✓ |
| `-Infinity` | true            | true (thrown) ✓      |
| `-0`        | false           | false (not thrown) ✓ |

**Why not `Number.isNaN(epsilon) || epsilon < 0`**:

- Two comparisons vs one
- Less idiomatic for a numeric guard
- `!(x >= 0)` is the standard in numeric C/C++/IEEE-754 literature for this exact test

**Why not `epsilon !== epsilon || epsilon < 0`**:

- Equivalent to `Number.isNaN(epsilon) || epsilon < 0`
- `!(epsilon >= 0)` is more readable and has the same semantics

**Error message update**: Extend from `"must be non-negative"` to `"must be a non-negative number"`. The word "number" signals that NaN (which is technically `typeof NaN === 'number'` but is not a real number) is excluded.

## Verification

**Manual trace** for each critical input with `!(epsilon >= 0)`:

```
nearEquals(1.5, 1.5 + 1e-11, NaN):
  !(NaN >= 0) → !(false) → true → throw RangeError ✓

isNearZero(0, NaN):
  !(NaN >= 0) → true → throw RangeError ✓
  (previously: NaN < 0 → false → passes guard → Math.abs(0) <= NaN → false — WRONG)

inRange(5, 0, 10, NaN):
  !(NaN >= 0) → true → throw RangeError ✓
  (previously: NaN < 0 → false → value >= 0-NaN → false — WRONG)

nearEquals(1.5, 1.5, NaN):
  !(NaN >= 0) → true → throw RangeError ✓
  (previously: NaN < 0 → false → passes → a===b short-circuit → true — happened to be correct by coincidence)
```
