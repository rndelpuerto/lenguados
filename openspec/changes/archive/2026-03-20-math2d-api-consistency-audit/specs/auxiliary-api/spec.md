## MODIFIED Requirements

### Requirement: R-SINCOS-TYPE — SinCos interface SHALL be defined in types/index.ts

The `SinCos` interface (containing `cos: number` and `sin: number` fields) SHALL be defined in `types/index.ts`, not in `auxiliary/angle/operations.ts`. This resolves a layering issue: the `types/` layer is the canonical location for all structural interfaces, and moving `SinCos` there ensures that lower layers (like `deterministic/`) can import it without depending on higher layers (like `auxiliary/`).

The `auxiliary/angle/operations.ts` module MAY re-export `SinCos` from `types/` for backward compatibility.

#### Scenario: WHEN SinCos is imported from types THEN it resolves

- **GIVEN** the `types/index.ts` module
- **WHEN** `import { SinCos } from './types'` is used
- **THEN** the import SHALL resolve correctly
- **AND** `SinCos` SHALL be an interface with `cos: number` and `sin: number`

#### Scenario: WHEN SinCos is imported from auxiliary/angle/operations THEN it still resolves

- **GIVEN** the `auxiliary/angle/operations.ts` module
- **WHEN** `import { SinCos } from './auxiliary/angle/operations'` is used
- **THEN** the import SHALL resolve correctly (re-export from types)

#### Scenario: WHEN an object conforming to SinCos is created THEN it type-checks

- **GIVEN** `const sc: SinCos = { cos: 0.5, sin: 0.866 }`
- **WHEN** the TypeScript compiler checks this assignment
- **THEN** it SHALL NOT produce an error

#### Scenario: WHEN the types barrel export is inspected THEN SinCos is among the exports

- **GIVEN** the `types/index.ts` module
- **WHEN** the exported types are inspected
- **THEN** `SinCos` SHALL be exported alongside `Vector2Like`, `ComplexLike`, `Rotation2Like`, and other `*Like` interfaces

---

### Requirement: R-SINCOS-IMPORT — deterministic-kernels.ts SHALL import SinCos from types/

The `deterministic-kernels.ts` module SHALL import the `SinCos` interface from `types/`, not from `auxiliary/angle/operations.ts`. This corrects a layering violation where the `deterministic/` layer (L0, zero dependencies) imports a type from the `auxiliary/` layer (L1). Since `types/` is a sibling dependency-free layer, this import does not create a circular or upward dependency.

#### Scenario: WHEN deterministic-kernels.ts imports are inspected THEN SinCos comes from types

- **GIVEN** the `deterministic/deterministic-kernels.ts` source file
- **WHEN** the import statements are inspected
- **THEN** `SinCos` SHALL be imported from a path resolving to `types/` (e.g., `import type { SinCos } from '../types'`)
- **AND** there SHALL be no import of `SinCos` from `auxiliary/angle/operations`

#### Scenario: WHEN the deterministic layer dependencies are analyzed THEN no auxiliary dependency exists

- **GIVEN** the `deterministic/` module
- **WHEN** all import paths are traced
- **THEN** no import SHALL resolve to a file in `auxiliary/`
- **AND** the layer dependency constraint (deterministic depends only on types and itself) SHALL be satisfied

#### Scenario: WHEN the sinCos function in deterministic-kernels.ts is called THEN it returns a valid SinCos

- **GIVEN** the `sinCos` function from `deterministic-kernels.ts`
- **WHEN** `sinCos(PI / 4)` is called
- **THEN** the result SHALL conform to the `SinCos` interface from `types/`
- **AND** `result.cos` SHALL be approximately `cos(PI / 4)` and `result.sin` SHALL be approximately `sin(PI / 4)`

---

## NOTE: lerpSafe Relocation — REJECTED by Adversarial Review

The original proposal (R-LERPSAFE-LOC) to move `lerpSafe` from `numeric/safety.ts` to `scalar/interpolation.ts` has been **rejected**. `lerpSafe` is a safety function whose defining characteristic is the divisor guard, not the interpolation operation. Its peers are `sqrtSafe`, `divideSafe`, and other `*Safe` functions in `numeric/safety.ts`. Moving it would break the safety-family module cohesion. The function remains in its current location with no changes.
