## MODIFIED Requirements

### Requirement: Deterministic exp uses robust 2^k scaling

The `exp` function in `deterministic-kernels.ts` SHALL use a two-step ldexp-style multiplication for the final 2^k scaling step, instead of direct IEEE 754 bit manipulation of the high 32 bits.

The two-step approach SHALL compute `result * 2^(k/2) * 2^(k - k/2)` to avoid exponent overflow corruption when k is near the representable exponent range boundaries.

#### Scenario: exp near overflow boundary

- **WHEN** `exp(709)` is called (near the double-precision overflow threshold)
- **THEN** the result SHALL be finite and within 1 ULP of the mathematically correct value

#### Scenario: exp produces same results as before for typical inputs

- **WHEN** `exp(x)` is called for x in [-10, 10]
- **THEN** the results SHALL match the previous implementation to within 1 ULP

### Requirement: sinCos range reduction uses Cody-Waite splitting

The `sinCos` (and by extension `sin`, `cos`) range reduction in `deterministic-kernels.ts` SHALL use a two-constant Cody-Waite reduction instead of naive modulo (`x % TAU`).

The reduction SHALL split π/2 into high and low parts (`PIO2_HI` and `PIO2_LO`) and compute the reduced angle as `x - n * PIO2_HI - n * PIO2_LO` where n is the octant index.

#### Scenario: sinCos precision for moderate angles

- **WHEN** `sinCos(1000.0)` is called
- **THEN** the result SHALL match the mathematically correct sin/cos to within 2 ULP

#### Scenario: sinCos precision for accumulated angles

- **WHEN** `sinCos(100000.0)` is called (simulating long-running physics accumulation)
- **THEN** the result SHALL be more precise than the naive modulo reduction (within 4 ULP vs potential 8+ ULP degradation)

#### Scenario: sinCos produces same results for small angles

- **WHEN** `sinCos(x)` is called for |x| < 2π
- **THEN** the results SHALL be identical to the previous implementation (no regression)
