## ADDED Requirements

### Requirement: pow2 SHALL handle subnormal exponents via two-step scaling

The `pow2(n)` internal function in `deterministic-kernels.ts` SHALL correctly produce 2^n for all exponents in the subnormal range (n < -1022). The current implementation constructs the IEEE 754 double by setting the biased exponent to `(n + 1023) & 0x7ff`, which wraps incorrectly for n <= -1022 because subnormal floats have a biased exponent of 0 and encode the value in the mantissa alone.

For n < -1022, `pow2` SHALL use a two-step multiplication: `pow2(-1022) * pow2(n + 1022)`. The first factor produces the smallest normal double (`2.2250738585072014e-308`), and the second factor is guaranteed to have a valid biased exponent since the inputs from `exp()` keep `n + 1022` within range. This matches fdlibm's `scalbn` implementation.

#### Scenario: pow2 with exponent at subnormal boundary

- **WHEN** `pow2(-1023)` is called
- **THEN** the result SHALL be `2^-1023` (approximately `1.1125369292536007e-308`), not a corrupted value from exponent field wrapping

#### Scenario: pow2 with deep subnormal exponent

- **WHEN** `pow2(-1074)` is called (the minimum representable exponent for IEEE 754 doubles)
- **THEN** the result SHALL be `5e-324` (the smallest positive subnormal), not `0` or a corrupted value

#### Scenario: pow2 normal range unchanged

- **WHEN** `pow2(n)` is called for n in [-1022, 1023]
- **THEN** the results SHALL be identical to the current implementation (no regression for normal exponents)

#### Scenario: exp near subnormal boundary produces correct result

- **WHEN** `exp(-744)` is called (producing a result in the subnormal range)
- **THEN** the result SHALL be finite and within 2 ULP of the mathematically correct value, not `0` due to pow2 wrapping

### Requirement: atan2 SHALL distinguish signed zero in both x and y parameters (IEEE 754 Table 9.1)

The deterministic `atan2(y, x)` function SHALL comply with IEEE 754-2019 Table 9.1 signed-zero semantics for **both** the `y` and `x` parameters. JavaScript's `===` operator cannot distinguish `+0` from `-0`, and critically `-0 >= 0` evaluates to `true`, so both parameters require explicit `Object.is` detection.

The complete IEEE 754 atan2 signed-zero behavior is:

| y   | x   | atan2(y, x) |
| --- | --- | ----------- |
| +0  | +0  | +0          |
| +0  | -0  | +PI         |
| -0  | +0  | -0          |
| -0  | -0  | -PI         |
| +0  | x>0 | +0          |
| -0  | x>0 | -0          |
| +0  | x<0 | +PI         |
| -0  | x<0 | -PI         |

The implementation SHALL use `Object.is(value, -0)` for detection. fdlibm's reference uses sign-bit extraction via `(hy>>31)&1|(hx>>30)&2` — we achieve the same semantics with `Object.is` which is more idiomatic in JavaScript.

#### Scenario: atan2(-0, +0) returns -0

- **WHEN** `atan2(-0, +0)` is called
- **THEN** the result SHALL be `-0` (negative zero)
- **AND** `Object.is(result, -0)` SHALL be `true`

#### Scenario: atan2(+0, -0) returns +PI

- **WHEN** `atan2(+0, -0)` is called
- **THEN** the result SHALL be `+PI` (approximately `3.141592653589793`)

#### Scenario: atan2(-0, -0) returns -PI

- **WHEN** `atan2(-0, -0)` is called
- **THEN** the result SHALL be `-PI` (approximately `-3.141592653589793`)

#### Scenario: atan2(+0, +0) returns +0

- **WHEN** `atan2(+0, +0)` is called
- **THEN** the result SHALL be `+0`
- **AND** `Object.is(result, +0)` SHALL be `true`

#### Scenario: atan2(-0, x>0) returns -0

- **WHEN** `atan2(-0, 1)` is called
- **THEN** the result SHALL be `-0` (negative zero)

#### Scenario: atan2(+0, x>0) returns +0

- **WHEN** `atan2(+0, 1)` is called
- **THEN** the result SHALL be `+0` (positive zero, same as current behavior)

#### Scenario: atan2(-0, x<0) returns -PI

- **WHEN** `atan2(-0, -1)` is called
- **THEN** the result SHALL be `-PI`

#### Scenario: atan2(+0, x<0) returns +PI

- **WHEN** `atan2(+0, -1)` is called
- **THEN** the result SHALL be `+PI` (same as current behavior, unchanged)

### Requirement: log SHALL adjust mantissa near sqrt(2) boundary

The deterministic `log(x)` function SHALL apply a mantissa adjustment when the normalized mantissa `1+f` falls below `sqrt(2)/2` (approximately `0.7071`). When `hx` (the high 32 bits of the normalized value) is less than `0x3FE6A09E` (the IEEE 754 representation of `sqrt(2)/2`), the implementation SHALL decrement `k` by 1 and adjust `f` accordingly, so that `1+f` is always in the range `[sqrt(2)/2, sqrt(2)]`.

This adjustment, present in fdlibm's `e_log.c`, ensures the polynomial approximation operates in the interval where its minimax error is minimized. Without it, mantissa values near 2 (at the upper end of the `[1, 2)` normalization range) produce reduced polynomial accuracy.

#### Scenario: log accuracy for values just above a power of 2

- **WHEN** `log(2.0000000001)` is called (mantissa near 2, before adjustment)
- **THEN** the result SHALL be within 1 ULP of the mathematically correct value `ln(2.0000000001)`

#### Scenario: log accuracy for values just below a power of 2

- **WHEN** `log(1.9999999999)` is called
- **THEN** the result SHALL be within 1 ULP of the mathematically correct value

#### Scenario: log of sqrt(2) boundary value

- **WHEN** `log(0.7071067811865476)` is called (approximately sqrt(2)/2)
- **THEN** the result SHALL be within 1 ULP of `-0.34657359027997264` (which is `-ln(2)/2`)

#### Scenario: log of values well within normal range unchanged

- **WHEN** `log(x)` is called for x in [1.5, 1.9] (comfortably within the polynomial's optimal range)
- **THEN** the results SHALL be identical to the current implementation (no regression)

### Requirement: sqrtBuffer and sqrtView SHALL be renamed and documented as shared state

The shared `ArrayBuffer` and `DataView` used for IEEE 754 bit manipulation in `deterministic-kernels.ts` SHALL be renamed from `sqrtBuffer`/`sqrtView` to `ieeeBuffer`/`ieeeView` (or equivalent descriptive name) to accurately reflect their purpose. The current names imply association with `sqrt` but the buffer is used by `pow2`, `log`, and potentially other functions.

The renamed buffer SHALL include JSDoc documenting:

- Its purpose: shared buffer for IEEE 754 double-precision bit manipulation
- Its usage: used by `pow2` and `log` for exponent/mantissa extraction and construction
- Its non-reentrancy: callers must not interleave reads and writes across function boundaries (safe in single-threaded JavaScript, but relevant for code comprehension)

#### Scenario: Buffer name reflects actual usage

- **WHEN** the source code of `deterministic-kernels.ts` is read
- **THEN** the shared buffer SHALL NOT be named `sqrtBuffer`/`sqrtView`
- **AND** the name SHALL indicate general IEEE 754 bit manipulation (e.g., `ieeeBuffer`/`ieeeView`)

#### Scenario: Buffer documentation exists

- **WHEN** the JSDoc of the shared buffer is read
- **THEN** it SHALL document that the buffer is shared across `pow2` and `log`
- **AND** it SHALL note the non-reentrant usage pattern

### Requirement: config SHALL be re-exported from the main package entry point

The `config` object from `deterministic-kernels.ts` SHALL be re-exported from `@lenguados/math2d` (the main package entry point in `index.ts`). Currently, `config` is only accessible via the deep import `@lenguados/math2d/deterministic/deterministic-kernels`, which is not part of the public API surface.

#### Scenario: config importable from main package

- **WHEN** `import { config } from '@lenguados/math2d'` is used
- **THEN** the import SHALL resolve to the `config` object from `deterministic-kernels.ts`
- **AND** `config.useNativeMath` SHALL be accessible and default to `false`

#### Scenario: config in DeterministicKernels namespace

- **WHEN** `import { DeterministicKernels } from '@lenguados/math2d'` is used
- **THEN** `DeterministicKernels.config` SHALL also be available (added to the `DeterministicKernels` const object)

### Requirement: Kernel logSafe SHALL be renamed to avoid collision with auxiliary logSafe

The kernel-level `logSafe` function in `deterministic-kernels.ts` (single-argument, natural log only) SHALL be renamed to `logKernelSafe` (or equivalent disambiguating name) to eliminate the naming collision with the public API `logSafe` from `auxiliary/numeric/safety.ts` (two-argument, supports custom base).

The renamed function SHALL remain `@internal` and SHALL NOT be re-exported from the main package entry point. The `DeterministicKernels` namespace object SHALL use the new name.

#### Scenario: No naming collision in deterministic-kernels.ts

- **WHEN** the exports of `deterministic-kernels.ts` are examined
- **THEN** there SHALL be no export named `logSafe`
- **AND** the kernel-level safe log SHALL be exported under a disambiguated name (e.g., `logKernelSafe`)

#### Scenario: DeterministicKernels namespace uses new name

- **WHEN** `DeterministicKernels` object properties are enumerated
- **THEN** it SHALL contain `logKernelSafe` (or the chosen disambiguated name) instead of `logSafe`

#### Scenario: Public logSafe remains the auxiliary version

- **WHEN** `import { logSafe } from '@lenguados/math2d'` is used
- **THEN** it SHALL resolve to the `logSafe` from `auxiliary/numeric/safety.ts` with full base parameter support

### Requirement: hypot JSDoc SHALL not claim trigonometric dependency

The module-level JSDoc comment in `deterministic-kernels.ts` and the `DeterministicKernels` namespace JSDoc SHALL NOT state that `hypot` "uses non-deterministic sin/cos internally." The `hypot` function uses only IEEE 754 basic operations (addition, subtraction, multiplication, division, comparison) and `Math.sqrt` (which is IEEE 754 required and deterministic). It does not use any trigonometric functions.

#### Scenario: Module JSDoc accuracy for hypot

- **WHEN** the `DeterministicKernels` namespace JSDoc is read
- **THEN** it SHALL NOT contain any claim that `hypot` uses sin, cos, or any trigonometric function
- **AND** the description of `hypot` SHALL accurately state it uses scaling and `Math.sqrt`

#### Scenario: hypot function JSDoc accuracy

- **WHEN** the `hypot` function JSDoc is read
- **THEN** the `@remarks` section SHALL NOT reference sin/cos dependency
- **AND** the algorithm description SHALL mention the `max * sqrt(1 + (min/max)^2)` identity

### Requirement: acos and asin SHALL explicitly handle NaN input

The deterministic `acos(x)` and `asin(x)` functions SHALL include an explicit NaN guard before the range check `x < -1 || x > 1`. Currently, NaN falls through the range guard because IEEE 754 comparisons involving NaN always return `false`, causing NaN to reach the `atan2(sqrt(1-x*x), x)` computation which coincidentally produces NaN. While the final result is correct, the path is fragile and undocumented.

The explicit guard SHALL be `if (x !== x) return NaN;` (the idiomatic NaN self-inequality check), placed before the range comparison.

#### Scenario: acos with NaN input returns NaN explicitly

- **WHEN** `acos(NaN)` is called
- **THEN** the result SHALL be `NaN`
- **AND** the function SHALL return at the explicit NaN guard, not fall through the range check

#### Scenario: asin with NaN input returns NaN explicitly

- **WHEN** `asin(NaN)` is called
- **THEN** the result SHALL be `NaN`
- **AND** the function SHALL return at the explicit NaN guard, not fall through the range check

#### Scenario: acos and asin normal behavior unchanged

- **WHEN** `acos(x)` or `asin(x)` is called for x in [-1, 1]
- **THEN** the results SHALL be identical to the current implementation

## MODIFIED Requirements

### Requirement: sinCos range reduction uses Cody-Waite splitting with documented precision boundary

The `sinCos` (and by extension `sin`, `cos`) range reduction in `deterministic-kernels.ts` SHALL use a two-constant Cody-Waite reduction as currently implemented. The reduction SHALL split PI/2 into high and low parts (`PIO2_HI` and `PIO2_LO`) and compute the reduced angle as `x - n * PIO2_HI - n * PIO2_LO` where n is the octant index.

**NEW**: The implementation SHALL document the precision boundary: two-step Cody-Waite provides approximately 106 bits of effective precision in the reduced argument (derivation: `PIO2_HI` carries 53 bits of precision as a double-precision value, and `PIO2_LO` carries an additional 53 bits representing the remainder `PI/2 - PIO2_HI`; together they represent PI/2 to 53 + 53 = 106 bits of extended precision). For `|x| > 2^20 * PI` (approximately 3,294,199 radians), the cancellation in `x - n * PIO2_HI` exceeds the available precision, and results may lose accuracy. The JSDoc SHALL include:

- The precision boundary `|x| > 2^20 * PI` where degradation begins
- The recommendation to normalize angles periodically in long-running simulations
- A note that full Payne-Hanek reduction is a non-goal for this library (see design.md D1 non-goals)

Alternatively, the implementation MAY upgrade to a three-constant or four-constant Cody-Waite split (adding `PIO2_MID` terms from fdlibm's `__rem_pio2`) to extend the precision boundary to `|x| > 2^48 * PI`. If this upgrade is chosen, the additional coefficients SHALL be sourced from fdlibm `e_rem_pio2.c`.

#### Scenario: sinCos precision for moderate angles

- **WHEN** `sinCos(1000.0)` is called
- **THEN** the result SHALL match the mathematically correct sin/cos to within 2 ULP

#### Scenario: sinCos precision for accumulated angles

- **WHEN** `sinCos(100000.0)` is called (simulating long-running physics accumulation)
- **THEN** the result SHALL be more precise than naive modulo reduction (within 4 ULP vs potential 8+ ULP degradation)

#### Scenario: sinCos produces same results for small angles

- **WHEN** `sinCos(x)` is called for |x| < 2\*PI
- **THEN** the results SHALL be identical to the previous implementation (no regression)

#### Scenario: sinCos precision boundary is documented

- **WHEN** the `reduceAngle` or `sinCos` JSDoc is read
- **THEN** it SHALL document that precision degrades for `|x| > 2^20 * PI` (~3.3M radians)
- **AND** it SHALL recommend periodic angle normalization for long-running simulations

#### Scenario: sinCos for very large angles returns finite result

- **WHEN** `sinCos(1e7)` is called (above the 2^20\*PI boundary)
- **THEN** the result SHALL be finite (sin and cos both in [-1, 1])
- **AND** the result MAY have reduced precision (more than 4 ULP error), which is acceptable given the documented limitation

### Requirement: Deterministic safe variants SHALL be accessible from main package with clear naming

All deterministic safe variants SHALL be accessible from `@lenguados/math2d`. The kernel-level safe log function SHALL be renamed (per the new "Kernel logSafe SHALL be renamed" requirement above) to eliminate the naming collision with the public API `logSafe` from `auxiliary/numeric/safety.ts`.

After renaming, the collision is fully resolved: `logSafe` unambiguously refers to the auxiliary version (with base parameter support), and the kernel version is accessible only via `DeterministicKernels.logKernelSafe` for internal use.

#### Scenario: acosSafe importable from main package

- **WHEN** `import { acosSafe } from '@lenguados/math2d'` is used
- **THEN** the import SHALL resolve to the `acosSafe` from `deterministic-kernels.ts`

#### Scenario: logSafe importable from main package (auxiliary version, no collision)

- **WHEN** `import { logSafe } from '@lenguados/math2d'` is used
- **THEN** the import SHALL resolve to the `logSafe` from `auxiliary/numeric/safety.ts` (with base parameter support)
- **AND** there SHALL be no ambiguity or TypeScript compilation error due to duplicate exports

#### Scenario: sqrtSafe importable from main package

- **WHEN** `import { sqrtSafe } from '@lenguados/math2d'` is used
- **THEN** it SHALL resolve to the `sqrtSafe` from `auxiliary/numeric/safety.ts` (Math.sqrt is IEEE 754 deterministic)

### Requirement: config object SHALL document mutability constraints and be publicly accessible

The `config` object exported from `deterministic-kernels.ts` SHALL include JSDoc that documents:

- Global singleton nature
- Thread-safety limitations (JavaScript is single-threaded, but Web Workers each get their own module instance)
- Recommendation to set before computation begins

**NEW**: The `config` object SHALL also be re-exported from the main package entry point (`index.ts`) so that users can access it via `import { config } from '@lenguados/math2d'` without needing a deep import path. The `DeterministicKernels` namespace SHALL also include `config`.

#### Scenario: config documentation exists

- **WHEN** the `config` export JSDoc is read
- **THEN** it SHALL contain warnings about global mutability

#### Scenario: config.useNativeMath defaults to false

- **WHEN** `config` is accessed without modification
- **THEN** `config.useNativeMath` SHALL be `false` (deterministic mode)

#### Scenario: config accessible from main package

- **WHEN** `import { config } from '@lenguados/math2d'` is used
- **THEN** the import SHALL resolve successfully to the `config` object from `deterministic-kernels.ts`
