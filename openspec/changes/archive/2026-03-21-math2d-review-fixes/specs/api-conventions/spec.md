## MODIFIED Requirements

### Requirement: Input parameters use ReadonlyLike interfaces

All public functions accepting geometric input parameters SHALL use `Readonly*Like` interfaces (e.g., `ReadonlyVector2Like`) rather than concrete class types (e.g., `ReadonlyVector2`). This applies to `randomOnSegment`, `randomInTriangle`, and `randomOnTriangle` in `utils/random.ts`.

#### Scenario: randomOnSegment accepts POJO input

- **WHEN** calling `randomOnSegment({ x: 0, y: 0 }, { x: 10, y: 10 }, rng)`
- **THEN** the function SHALL accept the POJO without type assertion
- **AND** return a valid Vector2 on the segment

#### Scenario: randomInTriangle accepts POJO input

- **WHEN** calling `randomInTriangle({ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 5 }, rng)`
- **THEN** the function SHALL accept the POJOs without type assertion

#### Scenario: randomOnTriangle accepts POJO input

- **WHEN** calling `randomOnTriangle({ x: 0, y: 0 }, { x: 5, y: 0 }, { x: 0, y: 5 }, rng)`
- **THEN** the function SHALL accept the POJOs without type assertion

#### Scenario: Existing concrete type inputs still work

- **WHEN** calling `randomOnSegment(Vector2.ZERO, Vector2.UNIT_X, rng)`
- **THEN** the function SHALL accept the concrete types as before (no breaking change)
