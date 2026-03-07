## Context

The math2d audit (audit-math2d-foundations) produced findings across all layers. Two prior changes implemented P1–P4 priorities. This change covers the remaining validated items: 3 Complex operations, 1 micro-fix, and 5 quality improvements. All items were cross-validated against current specs and code — 9 of 10 original items survived validation (roundToPowerOfTwo with Math.log2 was invalidated because Math.log2 is IEEE 754 recommended, not required).

Current state:

- Complex has `fromPolar` but no `toPolar` — asymmetric conversion API
- Complex lacks `exp` and `log` — required by core-types-api and algebraic-correctness specs
- `radiansToTurns` uses division where all other converters use multiplication
- `deterministic/exp` has fragile 2^k bit-manipulation scaling
- `deterministic/sinCos` range reduction uses naive modulo `x % TAU`
- Validation error messages lack actionable guidance (no Safe variant suggestions)
- Interval static/instance `divide` have incompatible signatures
- Only 3/7 core types re-export their type guards

## Goals / Non-Goals

**Goals:**

- Complete Complex field operations (exp, log, toPolar)
- Fix conversion inconsistency in radiansToTurns
- Improve deterministic kernel robustness (exp scaling, range reduction)
- Improve DX via actionable error messages and consistent type guard re-exports
- Align Interval divide API

**Non-Goals:**

- Adding Complex.pow (can be derived from exp+log; not in spec as required)
- Cody-Waite for ALL operations (only sinCos range reduction)
- Payne-Hanek for very large angles (|x| > 2^20 radians is not a realistic 2D physics case)
- Changing any existing public API signatures (additive only)

## Decisions

### D1: Complex.exp implementation

**Choice:** Euler's formula: `e^(a+bi) = e^a * (cos(b) + i*sin(b))`
**Why:** Direct, mathematically standard. Uses existing `deterministic/exp` for `e^a` and `deterministic/sinCos` for trig part. No new dependencies.
**Alternative:** Taylor series of e^z in complex domain — rejected (unnecessary complexity, less precise for large imaginary parts).

### D2: Complex.log implementation

**Choice:** Principal branch: `log(z) = (ln|z|, arg(z))` = `(log(magnitude), argument)`
**Why:** Standard principal logarithm. Reuses existing `Complex.magnitude()` and `Complex.argument()` methods. Uses `deterministic/log` for the real part.
**Alternative:** Multi-valued log — rejected (not useful for 2D math; users who need branch cuts can compute manually).

### D3: Complex.toPolar return type

**Choice:** Return `{ magnitude: number; angle: number }` as a plain object.
**Why:** Lightweight struct, no allocation pressure. Matches the convention of `SinCos` interface. A Complex `out` param would be semantically wrong (polar coords aren't a complex number).
**Alternative:** Return a tuple `[r, θ]` — rejected (less readable, no named access). Return a dedicated PolarForm class — rejected (over-engineering for a simple pair).

### D4: Range reduction strategy

**Choice:** Two-step Cody-Waite using split PI/2 constants (high + low parts).
**Why:** fdlibm standard approach. Maintains ~1 ULP accuracy for |x| up to ~2^30. Simple to implement with two pre-computed constants. The naive `x % TAU` loses ~4 bits of precision for |x| > 1000.
**Alternative:** Payne-Hanek for arbitrary precision — rejected (complex, 2D physics angles rarely exceed 100 radians of accumulation).

### D5: Exp 2^k scaling fix

**Choice:** Replace bit-manipulation with two-step `ldexp`-style multiply: `result * 2^(k/2) * 2^(k - k/2)`.
**Why:** Handles edge cases where k pushes exponent outside representable range. fdlibm uses this two-step approach for exactly this reason. Avoids corrupting the low 32 bits.
**Alternative:** Keep bit manipulation but add bounds checking — rejected (still fragile, two-step multiply is simpler and proven).

### D6: Interval divide alignment

**Choice:** Make instance `divide` take a scalar (matching static signature), not another Interval.
**Why:** Static signature is `divide(interval, scalar, out?)`. Instance should mirror it as `divide(scalar): this`. Interval-by-interval division already exists as `divideInterval` or can be composed.
**Alternative:** Rename static to `divideByScalar` — rejected (breaks naming convention; other types' static/instance divide are consistent).

### D7: Error message Safe suggestions

**Choice:** Append `. Use <opSafe>() for a fallback value` to assertion error messages where a Safe variant exists.
**Why:** Required by dx-quality spec. Directly actionable for developers who hit the error.
**Alternative:** Add a URL link to documentation — rejected (over-engineering, docs may not exist yet).

## Risks / Trade-offs

- **[Range reduction changes affect all sin/cos consumers]** → Mitigated by: extensive property-based tests, deterministic toggle still works, changes only affect the internal reduction not the kernel polynomials
- **[Complex.exp overflow for large real parts]** → Mitigated by: `deterministic/exp` already handles overflow (returns Infinity). No special handling needed in Complex.exp.
- **[Interval divide semantic change is breaking]** → Mitigated by: the instance `divide(Interval)` form is unlikely to have external consumers since the library is pre-1.0. Check for internal usage before changing.
- **[Error message changes increase string bundle size]** → Mitigated by: messages are in assertion code which is DCE-stripped in production builds.
