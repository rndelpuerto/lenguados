## MODIFIED Requirements

### Requirement: Interval.fromArray() and Interval.fromObject() SHALL validate min <= max

`Interval.fromArray()` and `Interval.fromObject()` SHALL call `assertOrder(minValue, maxValue, callerName)` before calling `setDirect()`, consistent with `Interval.fromValues()`.

**Evidence (empirical):**

1. **Invariant violation demonstrated**:

   ```
   Interval.fromValues(5, 2) → THROWS "min (5) must be <= max (2)"
   Interval.fromArray([5, 2]) → Creates [5, 2] with min > max (SILENT!)
   Interval.fromObject({min:5, max:2}) → Creates [5, 2] with min > max (SILENT!)
   Interval.set(5, 2) → THROWS "min (5) must be <= max (2)"
   ```

2. **Invalid intervals corrupt ALL downstream operations**:
   - `width()` returns **-3** (negative width)
   - `radius()` returns **-1.5** (negative radius)
   - `contains(3)` returns **false** (3 is between 2 and 5, but interval is invalid)
   - `overlaps([3,7])` returns **false** (should overlap)
   - No `isValid()` method exists to detect the invalid state

3. **Project rule violation**: `math2d-patterns.md` lines 63-66:

   > "Where setDirect is NOT appropriate:
   >
   > - User-facing code paths (use set() which validates)
   > - Any path where the values are not already guaranteed correct"

   `fromArray` and `fromObject` are public static factory methods (`@category Factory`) receiving untrusted external data. They are definitively user-facing code paths.

4. **Migration path exists**: `Interval.fromUnsorted(a, b)` accepts values in any order and auto-sorts. Users with data of unknown ordering should use this instead.

#### Scenario: fromArray rejects reversed order

- **GIVEN** an array `[5, 2]` where element 0 > element 1
- **WHEN** `Interval.fromArray([5, 2])` is called
- **THEN** it SHALL throw `RangeError` with message containing "min" and "max"
- **AND** the message SHALL match the format used by `Interval.fromValues`

#### Scenario: fromObject rejects reversed order

- **GIVEN** an object `{ min: 5, max: 2 }` where min > max
- **WHEN** `Interval.fromObject({ min: 5, max: 2 })` is called
- **THEN** it SHALL throw `RangeError`

#### Scenario: fromArray with valid data continues to work

- **GIVEN** a valid array `[2, 5]` where element 0 <= element 1
- **WHEN** `Interval.fromArray([2, 5])` is called
- **THEN** it SHALL create an Interval with min=2, max=5 (unchanged behavior)

#### Scenario: NaN rejection is preserved

- **GIVEN** an array `[NaN, 5]`
- **WHEN** `Interval.fromArray([NaN, 5])` is called
- **THEN** it SHALL throw (NaN rejection via sanitize is unaffected)

#### BREAKING CHANGE

`Interval.fromArray([max, min])` where max > min will now throw instead of silently creating an invalid interval. Migration: use `Interval.fromUnsorted(a, b)` for data with unknown ordering.
