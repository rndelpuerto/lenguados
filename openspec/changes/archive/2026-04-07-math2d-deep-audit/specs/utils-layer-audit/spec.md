## ADDED Requirements

### Requirement: Parse/format pairs exist for all core types

`utils/parse` SHALL export a `parse<Type>` and `format<Type>` function pair for every core type: `parseVector2`/`formatVector2`, `parseRotation2`/`formatRotation2`, `parseMatrix2`/`formatMatrix2`, `parseMatrix3`/`formatMatrix3`, `parseTransform2`/`formatTransform2`, `parseComplex`/`formatComplex`, `parseInterval`/`formatInterval`. Every pair SHALL be round-trip consistent: `parse(format(value))` SHALL equal the original value. Format functions SHALL accept an optional precision parameter.

#### Scenario: Round-trip consistency for all core types

- **WHEN** `parseVector2(formatVector2({x:1.5, y:-2.3}))` is called
- **THEN** result SHALL equal `{x:1.5, y:-2.3}` within EPSILON

#### Scenario: `formatVector2` accepts precision parameter

- **WHEN** `formatVector2({x:Math.PI, y:0}, 3)` is called
- **THEN** result SHALL contain the string "3.142" (3 decimal places)

---

### Requirement: Random generation covers all core types

`utils/random` SHALL export random generation functions for all core types: `randomVector2`, `randomUnitVector2`, `randomOnCircle`, `randomInUnitCircle`, `randomInCircle`, `randomRotation2`, `randomRotationMatrix2`, `randomTransform2`, `randomInRectangle`, `randomOnRectangle`, `randomComplex`, `randomUnitComplex`, `randomInterval`. All random functions SHALL accept an optional `source` parameter for seeded/deterministic generation. The `out` parameter pattern SHALL be available for functions returning concrete types.

#### Scenario: `randomUnitVector2` returns a unit-length vector

- **WHEN** `randomUnitVector2()` is called 1000 times
- **THEN** every result SHALL have length within EPSILON of 1.0

#### Scenario: Random functions are reproducible with seeded source

- **WHEN** `randomVector2({source: new SeededRandomSource(42)})` is called twice with the same seed
- **THEN** both calls SHALL return identical values

---

### Requirement: SeededRandomSource provides stateful reproducible generation

`utils/random-source` SHALL export: `MathRandomSource` (wraps `Math.random()`), `SeededRandomSource` (deterministic LCG or PCG seeded generator), `getDefaultRandomSource`, `setDefaultRandomSource`. `SeededRandomSource` SHALL support state save/restore for snapshot-based determinism (useful for testing and networked games). `nextInt(min, max)` SHALL use an unbiased rejection sampling algorithm.

#### Scenario: SeededRandomSource state save/restore works

- **WHEN** the state of a `SeededRandomSource` is saved after N draws, then restored, then the next draw is made
- **THEN** the result SHALL equal the (N+1)th value from the original sequence

#### Scenario: `nextInt` distribution is unbiased

- **WHEN** `nextInt(0, 3)` is called 10000 times with a SeededRandomSource
- **THEN** the distribution of 0, 1, 2, 3 SHALL be approximately uniform (chi-square test within p=0.001)

---

### Requirement: Performance utilities are audited for scope fit

`utils/performance` exports (`timestamp`, `measure`, `measureAsync`, `recordMeasurement`, `summarizeMeasurements`, `MeasurementCollector`) SHALL be evaluated for whether they belong in a pure math core. The audit SHALL determine:

- If these utilities are used by any core math function internally → KEEP
- If they are standalone tools with no math dependency → RESTRUCTURE to `@lenguados/common`
- If `@lenguados/common` would be the correct home, a migration path SHALL be defined

#### Scenario: Performance utils have no math dependency

- **WHEN** the audit reads all imports in `utils/performance.ts`
- **THEN** if no import from `deterministic/`, `auxiliary/`, or `core/` exists, the module is a candidate for RESTRUCTURE to `@lenguados/common`

#### Scenario: `MeasurementCollector` does not appear in core methods

- **WHEN** the audit greps for `MeasurementCollector`, `measure`, `measureAsync` across all non-test non-utils source files
- **THEN** if zero results are found in `core/`, `auxiliary/`, or `deterministic/`, the performance module has no math core dependency and SHALL receive RESTRUCTURE verdict

---

### Requirement: Utils layer does not import from validation

`utils/` files SHALL NOT import from `validation/`. If a utils function needs to validate inputs it SHALL either perform inline finite checks or route through a helper that does not use the conditional-export assertion system. Importing validation in utils would make production-bundle assertions non-tree-shakeable.

#### Scenario: No validation imports in utils

- **WHEN** the audit scans all import statements in `utils/` source files
- **THEN** no import from `../validation` SHALL be found
