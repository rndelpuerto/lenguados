## MODIFIED Requirements

### Requirement: floorPowerOfTwo SHALL use comparison-based validation

The function `floorPowerOfTwo` SHALL compute a candidate power of two via `log`, then validate the candidate against the input value. If the candidate exceeds the input, the function SHALL return `candidate / 2`.

**Evidence (empirical — executed against built library):**

1. **Current behavior (51 failures)**: For every power of 2 from 2^2 through 2^52, the value 1 ULP below that power produces a result GREATER than the input:
   - `floorPowerOfTwo(3.9999999999999996) = 4` (input < 4)
   - `floorPowerOfTwo(1023.9999999999999) = 1024` (input < 1024)
   - 51/51 near-power values fail

2. **Root cause**: `log(value) / LN_2` rounds to exactly `n` for values just below `2^n`, causing `Math.floor(n) = n` and returning `2^n > value`.

3. **Fix verified (0 failures)**: Comparison-based validation `candidate > value ? candidate / 2 : candidate` passes all 51 near-power tests, all 53 exact-power tests, and all normal-value tests.

4. **Why NOT snap correction**: Empirically proven not to work — the log error for near-power values is within 1e-13 of integer, same as exact powers. The snap can't distinguish them.

#### Scenario: value just below a power of two

- **GIVEN** a value `v` that is 1 ULP below `2^n` (e.g., `3.9999999999999996` for n=2)
- **WHEN** `floorPowerOfTwo(v)` is called
- **THEN** the result SHALL be `2^(n-1)` (e.g., `2`)
- **AND** the result SHALL satisfy `result <= v`

#### Scenario: value is an exact power of two

- **GIVEN** a value `v = 2^n` for any integer n in [0, 52]
- **WHEN** `floorPowerOfTwo(v)` is called
- **THEN** the result SHALL be `v` (the value itself)

#### Scenario: normal non-power value

- **GIVEN** a value `v` that is not a power of two (e.g., `5`, `100`, `0.3`)
- **WHEN** `floorPowerOfTwo(v)` is called
- **THEN** the result SHALL be the largest power of two `<= v`
- **AND** `result * 2 > v` (next power exceeds the input)

#### Scenario: non-positive input

- **GIVEN** a value `v <= 0`
- **WHEN** `floorPowerOfTwo(v)` is called
- **THEN** the result SHALL be `0`

---

### Requirement: ceilPowerOfTwo SHALL be built on floorPowerOfTwo

The function `ceilPowerOfTwo` SHALL compute the floor power of two, then return it if it equals the input, otherwise return `floor * 2`. This replaces the current snap-correction approach.

**Evidence (empirical — executed against built library):**

1. **Current behavior (312,161 ULPs swallowed)**: The 1e-10 snap threshold incorrectly rounds down values that are meaningfully above a power of 2:
   - `ceilPowerOfTwo(1024 + 1e-8) = 1024` (input is 44,000 ULPs above 1024)
   - 312,161 ULPs above 1024 are incorrectly snapped

2. **Fix verified (0 failures, 0 ULP snap window)**: Building on floorPowerOfTwo eliminates the snap threshold entirely. All exact powers pass, all near-powers pass, all normal values pass.

3. **DRY**: Eliminates duplicated log-based computation. Ceil is defined in terms of floor.

#### Scenario: value just above a power of two

- **GIVEN** a value `v` that is 1 ULP above `2^n` (e.g., `1024 + 1024 * EPSILON`)
- **WHEN** `ceilPowerOfTwo(v)` is called
- **THEN** the result SHALL be `2^(n+1)` (e.g., `2048`)
- **AND** the result SHALL satisfy `result >= v`

#### Scenario: value is an exact power of two

- **GIVEN** a value `v = 2^n` for any integer n in [0, 52]
- **WHEN** `ceilPowerOfTwo(v)` is called
- **THEN** the result SHALL be `v` (the value itself)

#### Scenario: value just below a power of two

- **GIVEN** a value `v` that is 1 ULP below `2^n`
- **WHEN** `ceilPowerOfTwo(v)` is called
- **THEN** the result SHALL be `2^n` (the next power up)

#### Scenario: non-positive input

- **GIVEN** a value `v <= 0`
- **WHEN** `ceilPowerOfTwo(v)` is called
- **THEN** the result SHALL be `0`
