## CHANGED Requirements

### Requirement: All comparison functions SHALL reject NaN epsilon

Every tolerance-accepting function in `comparison.ts` already rejects negative epsilon (throws `RangeError`). This requirement extends that guard to also reject NaN epsilon, closing the validation asymmetry.

**Root cause**: The guard `if (epsilon < 0)` silently accepts NaN because `NaN < 0` evaluates to `false` in IEEE 754. NaN epsilon causes all comparison results to silently degrade to `false` (except the `a === b` short-circuit in `nearEquals`).

**Fix**: Replace all `if (epsilon < 0)` guards with `if (!(epsilon >= 0))`. This is a single IEEE 754-correct condition that rejects both negative values and NaN.

**Scope**: All 8 tolerance-accepting functions — `nearEquals`, `isNearZero`, `isNearOne`, `relativeEquals`, `lessThan`, `greaterThan`, `inRange`, `compare`.

---

#### Scenario: nearEquals throws for NaN epsilon

- **WHEN** `nearEquals(1, 2, NaN)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: nearEquals does NOT throw for valid epsilon values

- **WHEN** `nearEquals(1, 2, 0)` is called (exact equality — valid)
- **THEN** the function SHALL NOT throw
- **WHEN** `nearEquals(1, 2, EPSILON)` is called
- **THEN** the function SHALL NOT throw
- **WHEN** `nearEquals(1, 2, Infinity)` is called (infinite tolerance — valid)
- **THEN** the function SHALL NOT throw

#### Scenario: isNearZero throws for NaN epsilon

- **WHEN** `isNearZero(0, NaN)` is called
- **THEN** the function SHALL throw `RangeError`
- **AND** the throw SHALL occur before the comparison (not silently return `false`)

#### Scenario: isNearOne throws for NaN epsilon

- **WHEN** `isNearOne(1, NaN)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: relativeEquals throws for NaN relativeEpsilon

- **WHEN** `relativeEquals(1, 2, NaN)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: lessThan throws for NaN epsilon

- **WHEN** `lessThan(1, 2, NaN)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: greaterThan throws for NaN epsilon

- **WHEN** `greaterThan(2, 1, NaN)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: inRange throws for NaN epsilon

- **WHEN** `inRange(5, 0, 10, NaN)` is called
- **THEN** the function SHALL throw `RangeError`
- **AND** the throw SHALL occur before the range comparison (not silently return `false`)

#### Scenario: compare throws for NaN epsilon

- **WHEN** `compare(1, 2, NaN)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: negative epsilon still throws (no regression)

- **WHEN** any comparison function is called with `epsilon = -0.1`
- **THEN** the function SHALL still throw `RangeError` (existing behavior preserved)
