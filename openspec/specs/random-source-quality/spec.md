## ADDED Requirements

### Requirement: SeededRandomSource uses xoshiro128++ algorithm

`SeededRandomSource` SHALL replace the Park-Miller LCG (multiplier 16807, modulus 2^31-1) with the xoshiro128++ algorithm (Blackman & Vigna, 2021). The new generator SHALL have:

- A period of 2^128 - 1
- 128-bit internal state (four 32-bit unsigned integers: `s0`, `s1`, `s2`, `s3`)
- Only 32-bit integer operations (addition, shift, XOR, rotate) for cross-platform determinism
- Output that passes TestU01 BigCrush (standard battery, per Blackman & Vigna 2021)
- Known weaknesses documented: low-bit linear complexity and zeroland repeats (mitigated by `++` scrambler and SplitMix32 seeding respectively)

The `next()` method SHALL produce values in [0, 1) by computing the xoshiro128++ scrambler `rotl(s0 + s3, 7) + s0` where `rotl(x, k)` denotes 32-bit left rotation defined as `(x << k) | (x >>> (32 - k))`, advancing the state via the xoshiro128 linear engine, and dividing the 32-bit result by 2^32. Note: the addition `s0 + s3` is performed first, then rotated, then `s0` is added to the rotated result.

#### Scenario: Deterministic sequence from known seed

- **GIVEN** a `SeededRandomSource` constructed with seed `12345`
- **WHEN** `next()` is called 3 times
- **THEN** the returned values SHALL be identical across V8, SpiderMonkey, and JavaScriptCore
- **AND** each value SHALL be in the range [0, 1)

#### Scenario: Period is longer than LCG

- **GIVEN** a `SeededRandomSource` constructed with any valid seed
- **WHEN** `next()` is called 2^31 times (the old LCG period)
- **THEN** the generator SHALL NOT have returned to its initial state (period > 2^31 - 2)

#### Scenario: No 64-bit operations used

- **GIVEN** the implementation of `SeededRandomSource.next()`
- **WHEN** the source code is inspected
- **THEN** it SHALL contain no `BigInt` literals, no `BigInt()` calls, and no operations that require 64-bit precision
- **AND** all arithmetic SHALL use `| 0` or `>>> 0` to remain within 32-bit integer range

#### Scenario: State size is 128 bits

- **GIVEN** a `SeededRandomSource` instance
- **WHEN** `getState()` is called
- **THEN** the returned state SHALL encode four 32-bit values sufficient to fully restore the generator

### Requirement: Seed initialization uses SplitMix32 expansion

The constructor SHALL expand a single 32-bit seed into the four 32-bit state values required by xoshiro128++ using the SplitMix32 algorithm (Steele, Lea & Nishi 2014). SplitMix32 uses gamma constant `0x9e3779b9` (derived from the golden ratio), mixing multipliers `0x85ebca6b` and `0xc2b2ae35`, and shift amounts 16, 13, and 16. Each iteration advances the state by adding gamma, then applies the mixing function: `z ^= z >>> 16; z = Math.imul(z, 0x85ebca6b); z ^= z >>> 13; z = Math.imul(z, 0xc2b2ae35); z ^= z >>> 16`. This prevents correlated initial states when seeds differ by small amounts (a known weakness of direct seeding in xoshiro generators, per Blackman & Vigna's recommendation).

#### Scenario: Similar seeds produce divergent sequences

- **GIVEN** `rng1 = new SeededRandomSource(1)` and `rng2 = new SeededRandomSource(2)`
- **WHEN** `next()` is called 10 times on each
- **THEN** the two sequences SHALL differ in at least 8 of the 10 values

#### Scenario: Seed zero is valid

- **GIVEN** `rng = new SeededRandomSource(0)`
- **WHEN** `next()` is called
- **THEN** the result SHALL be a finite number in [0, 1)
- **AND** the internal state SHALL NOT be all-zeros (SplitMix32 guarantees non-zero expansion)

#### Scenario: Negative and fractional seeds are normalized

- **GIVEN** `rng = new SeededRandomSource(-42.7)`
- **WHEN** the seed is processed
- **THEN** the seed SHALL be converted to a 32-bit integer via `seed | 0` before expansion
- **AND** subsequent `next()` calls SHALL produce valid [0, 1) values

### Requirement: Default seed uses high-resolution timer

When no seed argument is provided, the constructor SHALL use `performance.now()` (sub-millisecond resolution) where available, falling back to `Date.now()` only when `performance` is undefined. This reduces the probability of seed collision from ~100% (for two instances created in the same millisecond with `Date.now()`) to negligible (microsecond or nanosecond resolution depending on platform).

#### Scenario: Two instances in same millisecond get different seeds

- **GIVEN** `performance.now()` is available and returns values with sub-millisecond resolution
- **WHEN** two `SeededRandomSource` instances are created without explicit seeds in rapid succession
- **THEN** their first `next()` values SHALL differ with high probability (>99.9%)

#### Scenario: Fallback to Date.now when performance is unavailable

- **GIVEN** `performance` is `undefined` (e.g., some embedded JS environments)
- **WHEN** `new SeededRandomSource()` is called without a seed
- **THEN** the constructor SHALL fall back to `Date.now()` without throwing

### Requirement: nextInt uses rejection sampling to eliminate modulo bias

`nextInt(max)` SHALL NOT use `Math.floor(next() * max)` which introduces modulo bias when `max` does not evenly divide the generator's output range. Instead, it SHALL use Lemire's nearly-divisionless method (Lemire, 2019) or classic rejection sampling to produce uniformly distributed integers in [0, max).

For the xoshiro128++ generator with 32-bit output range 2^32, the bias of the naive method for `nextInt(3)` is `(2^32 mod 3) / 2^32 = 2 / 2^32` per bucket, which is small but measurable in chi-squared tests over 10^8 samples. Rejection sampling eliminates this bias entirely.

#### Scenario: nextInt(3) is unbiased over large sample

- **GIVEN** a `SeededRandomSource` with a fixed seed
- **WHEN** `nextInt(3)` is called 10,000,000 times and the results are tallied
- **THEN** a chi-squared test at significance level 0.01 SHALL NOT reject the null hypothesis of uniform distribution

#### Scenario: nextInt(1) always returns 0

- **GIVEN** any `SeededRandomSource`
- **WHEN** `nextInt(1)` is called
- **THEN** the result SHALL always be `0`

#### Scenario: nextInt with power-of-two max

- **GIVEN** a `SeededRandomSource` with a fixed seed
- **WHEN** `nextInt(256)` is called 1,000,000 times
- **THEN** all 256 possible values SHALL appear, and the distribution SHALL pass a chi-squared uniformity test

#### Scenario: nextInt determinism matches next determinism

- **GIVEN** two `SeededRandomSource` instances created with the same seed
- **WHEN** one calls `nextInt(100)` and the other calls `nextInt(100)` in the same sequence position
- **THEN** both SHALL return the same integer

### Requirement: nextInt validates the max parameter

`nextInt(max)` SHALL validate that `max` is a positive integer. Invalid inputs SHALL be handled according to the library's validation tier:

- In development builds (with assertions enabled): throw a descriptive error
- The function SHALL NOT silently return misleading values for invalid inputs

The following inputs are invalid:

- `max <= 0` (no valid output range)
- Non-integer `max` (ambiguous whether to floor or ceil)
- `NaN` (no valid output range)
- `Infinity` (unbounded range)

#### Scenario: nextInt(0) throws in development

- **GIVEN** a development build with assertions enabled
- **WHEN** `nextInt(0)` is called
- **THEN** the function SHALL throw an error indicating that max must be a positive integer

#### Scenario: nextInt with negative max throws in development

- **GIVEN** a development build with assertions enabled
- **WHEN** `nextInt(-5)` is called
- **THEN** the function SHALL throw an error indicating that max must be a positive integer

#### Scenario: nextInt(NaN) throws in development

- **GIVEN** a development build with assertions enabled
- **WHEN** `nextInt(NaN)` is called
- **THEN** the function SHALL throw an error

#### Scenario: nextInt with fractional max throws in development

- **GIVEN** a development build with assertions enabled
- **WHEN** `nextInt(3.7)` is called
- **THEN** the function SHALL throw an error indicating that max must be a positive integer
- **AND** the function SHALL NOT silently return values in [0, 3]

#### Scenario: nextInt with large valid max

- **GIVEN** a `SeededRandomSource`
- **WHEN** `nextInt(2147483647)` is called (max safe 32-bit positive integer)
- **THEN** the result SHALL be a non-negative integer less than 2147483647

### Requirement: MathRandomSource.nextInt validates consistently

`MathRandomSource.nextInt(max)` SHALL apply the same validation rules as `SeededRandomSource.nextInt(max)`. The two implementations SHALL share the same contract for the `max` parameter as defined in the `RandomSource` interface.

#### Scenario: MathRandomSource.nextInt(0) throws in development

- **GIVEN** a development build with assertions enabled
- **WHEN** `new MathRandomSource().nextInt(0)` is called
- **THEN** the function SHALL throw an error, same as `SeededRandomSource`

#### Scenario: MathRandomSource.nextInt produces integers in range

- **GIVEN** `source = new MathRandomSource()`
- **WHEN** `source.nextInt(10)` is called 1000 times
- **THEN** all results SHALL be integers in [0, 10)

### Requirement: State serialization and restoration for xoshiro128++

`getState()` and `setState()` SHALL be updated to handle the 128-bit state of xoshiro128++. The state representation SHALL allow exact restoration of the generator's position in its sequence.

#### Scenario: Save and restore produces identical continuation

- **GIVEN** a `SeededRandomSource` that has called `next()` 100 times
- **WHEN** `getState()` is called, then `next()` is called 5 more times producing values `[v1, v2, v3, v4, v5]`
- **AND** a new `SeededRandomSource` is created and `setState(savedState)` is called with the saved state
- **AND** `next()` is called 5 times on the restored instance
- **THEN** the 5 values SHALL be identical to `[v1, v2, v3, v4, v5]`

#### Scenario: setState rejects invalid state

- **GIVEN** an invalid state value (e.g., all zeros, which is the sole excluded state for xoshiro)
- **WHEN** `setState(invalidState)` is called
- **THEN** the function SHALL throw a `RangeError`

#### Scenario: getState/setState round-trip is lossless

- **GIVEN** a `SeededRandomSource` in any valid state
- **WHEN** `const s = getState()` followed by `setState(s)` is called
- **THEN** the generator SHALL produce the exact same subsequent sequence as before the round-trip

### Requirement: seed() method re-initializes full xoshiro128++ state

The `seed(seed)` method SHALL re-initialize all four 32-bit state words using the same SplitMix32 expansion as the constructor. After calling `seed(n)`, the generator SHALL produce the same sequence as a freshly constructed `new SeededRandomSource(n)`.

#### Scenario: Re-seeding resets to initial sequence

- **GIVEN** `rng = new SeededRandomSource(42)` that has called `next()` 1000 times
- **WHEN** `rng.seed(42)` is called
- **AND** `next()` is called 5 times producing `[v1, v2, v3, v4, v5]`
- **THEN** a fresh `new SeededRandomSource(42)` calling `next()` 5 times SHALL produce the same `[v1, v2, v3, v4, v5]`

#### Scenario: Re-seeding with different seed changes sequence

- **GIVEN** `rng = new SeededRandomSource(42)`
- **WHEN** `rng.seed(99)` is called and `next()` is called 5 times
- **THEN** the sequence SHALL match `new SeededRandomSource(99)` called 5 times

### Requirement: randomOnTriangle handles degenerate triangles

`randomOnTriangle` SHALL guard against degenerate triangles where all three vertices coincide (perimeter = 0). When the perimeter is zero, the division `t / edgeLength` produces `NaN`. The function SHALL return one of the coincident vertices instead of `NaN` coordinates.

#### Scenario: All vertices coincide (zero-perimeter triangle)

- **GIVEN** `a = b = c = Vector2(3, 7)`
- **WHEN** `randomOnTriangle(a, b, c, out)` is called
- **THEN** `out` SHALL be set to `Vector2(3, 7)` (the coincident point)
- **AND** `out.x` and `out.y` SHALL NOT be `NaN`

#### Scenario: Two vertices coincide (one degenerate edge)

- **GIVEN** `a = Vector2(0, 0)`, `b = Vector2(0, 0)`, `c = Vector2(1, 0)`
- **WHEN** `randomOnTriangle(a, b, c, out)` is called
- **THEN** `out` SHALL be a finite point on the segment from `(0,0)` to `(1,0)`
- **AND** `out.x` SHALL be in [0, 1] and `out.y` SHALL be `0`

#### Scenario: Non-degenerate triangle is unaffected

- **GIVEN** `a = Vector2(0, 0)`, `b = Vector2(1, 0)`, `c = Vector2(0, 1)`
- **WHEN** `randomOnTriangle(a, b, c, out)` is called
- **THEN** the behavior SHALL be identical to the current implementation (uniform distribution along perimeter)

### Requirement: randomTransform2 resets scale on out parameter

`randomTransform2` SHALL explicitly set the scale of the `out` parameter to identity `(1, 1)` before returning. The current implementation sets position and rotation but preserves whatever scale the `out` transform already has, which is undocumented and produces non-rigid transforms when `out` has non-identity scale.

#### Scenario: Out parameter with non-identity scale is reset

- **GIVEN** `out = new Transform2()` with `out.scale.set(3, 5)`
- **WHEN** `randomTransform2(out)` is called
- **THEN** `out.scale.x` SHALL be `1` and `out.scale.y` SHALL be `1`
- **AND** `out.position` and `out.rotation` SHALL be randomly set as before

#### Scenario: Default out parameter has identity scale

- **GIVEN** no `out` parameter (default `new Transform2()`)
- **WHEN** `randomTransform2()` is called
- **THEN** the returned transform SHALL have `scale = (1, 1)` (identity, same as current behavior since default Transform2 has identity scale)

#### Scenario: Function produces rigid transforms (SE(2))

- **GIVEN** any `out` parameter (with or without prior scale)
- **WHEN** `randomTransform2(out, source)` is called
- **THEN** the returned transform SHALL represent a rigid body transformation: rotation + translation only, with unit scale
- **AND** this matches the JSDoc description "random rigid transform (SE(2))"
