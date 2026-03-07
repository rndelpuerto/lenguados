## ADDED Requirements

### Requirement: assert*Like functions SHALL delegate to is*Like type guards

All `assert*Like` functions (`assertVector2Like`, `assertMatrix2Like`, `assertMatrix3Like`, `assertRotation2Like`, `assertComplexLike`, `assertIntervalLike`, `assertTransform2Like`) SHALL delegate their structural type checking to the corresponding `is*Like` type guard function, eliminating duplicated property-checking logic.

**IMPORTANT caveat:** The `is*Like` functions only check that properties exist and are `typeof 'number'`. They do NOT check `Number.isFinite()`. The `assert*Like` functions currently DO check for finite values. After refactoring, `assert*Like` SHALL still validate that all numeric properties are finite — this requires an additional finite check after the `is*Like` structural check passes.

#### Scenario: assertVector2Like delegates to isVector2Like

- **WHEN** `assertVector2Like` is called with a valid Vector2Like object in dev mode
- **THEN** it SHALL call `isVector2Like` internally and not throw

#### Scenario: assertVector2Like rejects invalid object

- **WHEN** `assertVector2Like({x: 1})` is called (missing `y` property)
- **THEN** it SHALL throw a `TypeError` with a message indicating the object is not Vector2Like

#### Scenario: assertMatrix3Like delegates to isMatrix3Like

- **WHEN** `assertMatrix3Like` is called with a valid Matrix3Like object
- **THEN** it SHALL call `isMatrix3Like` internally and not throw

#### Scenario: assertTransform2Like validates nested structure

- **WHEN** `assertTransform2Like({position: {x:1}, rotation: {cos:1, sin:0}, scale: {x:1, y:1}})` is called (position missing `y`)
- **THEN** it SHALL throw a `TypeError`

#### Scenario: Assertions disabled skips type guard check

- **WHEN** assertions are disabled via `setAssertionsEnabled(false)`
- **THEN** `assertVector2Like` SHALL return immediately without calling `isVector2Like`

#### Scenario: Production build eliminates assertion code

- **WHEN** the code is built with `NODE_ENV=production`
- **THEN** the `assert*Like` function bodies SHALL be eliminated by DCE (dead code elimination), verified by the `if (!DEV_MODE) return;` guard

### Requirement: Error messages SHALL provide diagnostic detail after type guard failure

When an `assert*Like` function throws because `is*Like` returned false, the error message SHALL include the type of the received value and which properties were expected.

#### Scenario: assertVector2Like error message includes type info

- **WHEN** `assertVector2Like("not an object")` is called
- **THEN** the error message SHALL include `"string"` and mention expected properties `x` and `y`

#### Scenario: assertRotation2Like error message for null

- **WHEN** `assertRotation2Like(null)` is called
- **THEN** the error message SHALL indicate a null value was received and properties `cos` and `sin` were expected
