## Why

`comparison.ts` already validates that epsilon is non-negative — all 8 tolerance-accepting functions throw `RangeError` when `epsilon < 0`. However, the same guard **silently accepts NaN epsilon** because `NaN < 0` evaluates to `false` in IEEE 754.

This is a demonstrable, verifiable asymmetry:

```
epsilon < 0   → ✓ RangeError thrown
epsilon = NaN → ✗ silently accepted, all comparisons return false
```

**Why NaN epsilon is dangerous**: The silent failure mode is not "throw at the call site" — it is "every comparison returns `false` for the rest of the call chain":

| Call with NaN epsilon       | Result                           | Risk                       |
| --------------------------- | -------------------------------- | -------------------------- |
| `isNearZero(0, NaN)`        | `false` (zero not detected)      | Normalize guard bypassed   |
| `inRange(5, 0, 10, NaN)`    | `false` (always out of range)    | Logic inversion, invisible |
| `lessThan(1, 2, NaN)`       | `false` (always false)           | Ordering breaks silently   |
| `nearEquals(1.5, 1.5, NaN)` | `true` (short-circuits on `===`) | Only safe by luck          |

**Why now**: `comparison.ts` is the only auxiliary module that validates its configuration parameter (epsilon) at all. The validation is already half-done. Completing it is a single-condition change across 8 guards with zero impact on any valid input.

## What Changes

Replace all 8 `if (epsilon < 0)` / `if (relativeEpsilon < 0)` guards with `if (!(epsilon >= 0))` — a single IEEE 754-correct condition that rejects both negative values and NaN in one comparison. No new branches, no overhead for valid inputs.

Update the `@throws` TSDoc tag on each function to document that NaN epsilon also triggers the error.

Add tests verifying NaN epsilon throws in all 8 functions.

## Capabilities

### Modified Capabilities

- `comparison-epsilon-validation`: Extends the existing epsilon validation from "rejects negative" to "rejects negative or NaN", closing the asymmetry without adding a new validation tier.

## Impact

- **Affected code**: `packages/math2d/src/auxiliary/scalar/comparison.ts` (8 guard conditions), `packages/math2d/test/auxiliary/scalar/comparison.node.spec.ts` (8 new test cases)
- **APIs**: No behavior change for any valid epsilon input. Breaking only for code explicitly passing NaN as epsilon — which produces broken results today and should throw instead.
- **Performance**: Zero — `!(epsilon >= 0)` has identical instruction count to `epsilon < 0`. Both compile to a single `fcomi`/`jae` branch.
- **Dependencies**: None.
