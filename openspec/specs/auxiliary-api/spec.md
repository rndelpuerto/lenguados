## MODIFIED Requirements

### Requirement: Angle conversion functions use consistent multiplication pattern

All angle conversion functions SHALL use pre-computed multiplication constants rather than division. Specifically, `radiansToTurns` SHALL use `radians * RAD_TO_TURN` (not `radians / TAU`), consistent with `degreesToRadians` using `* DEG_TO_RAD`, `radiansToDegrees` using `* RAD_TO_DEG`, and `turnsToRadians` using `* TURN_TO_RAD`.

#### Scenario: radiansToTurns uses multiplication

- **WHEN** the implementation of `radiansToTurns` is inspected
- **THEN** it SHALL use `radians * RAD_TO_TURN` where `RAD_TO_TURN = 1 / TAU`

#### Scenario: radiansToTurns produces correct results

- **WHEN** `radiansToTurns(2 * Math.PI)` is called
- **THEN** the result SHALL be `1` within EPSILON tolerance

### Requirement: Rounding functions SHALL validate non-finite inputs

`roundToPlaces`, `roundToMultiple`, and `snapToGrid` SHALL return the input unchanged when the value is not finite (NaN or Infinity), matching IEEE 754 propagation semantics and aligning with `roundToInt`'s validation pattern.

#### Scenario: roundToPlaces with NaN returns NaN

- **WHEN** `roundToPlaces(NaN, 2)` is called
- **THEN** it SHALL return `NaN`

#### Scenario: roundToPlaces with Infinity returns Infinity

- **WHEN** `roundToPlaces(Infinity, 2)` is called
- **THEN** it SHALL return `Infinity`

#### Scenario: roundToMultiple with NaN returns NaN

- **WHEN** `roundToMultiple(NaN, 5)` is called
- **THEN** it SHALL return `NaN`

#### Scenario: roundToMultiple with negative Infinity returns negative Infinity

- **WHEN** `roundToMultiple(-Infinity, 5)` is called
- **THEN** it SHALL return `-Infinity`

#### Scenario: snapToGrid with NaN returns NaN

- **WHEN** `snapToGrid(NaN, 1)` is called
- **THEN** it SHALL return `NaN`

#### Scenario: snapToGrid with Infinity returns Infinity

- **WHEN** `snapToGrid(Infinity, 1)` is called
- **THEN** it SHALL return `Infinity`

#### Scenario: Normal values remain unaffected

- **WHEN** `roundToPlaces(3.14159, 2)` is called
- **THEN** it SHALL return `3.14` (existing behavior unchanged)

### Requirement: logSafe JSDoc one-line summary SHALL match implementation

The `logSafe` function in `auxiliary/numeric/safety.ts` has a one-line description at line 123 that says "Safe logarithm (returns -Infinity for <= 0)". This is INCORRECT — the function returns `0`, not `-Infinity`. The `@returns` tag and `@remarks` section are already correct. Only the one-line summary needs fixing.

#### Scenario: logSafe returns 0 for zero

- **WHEN** `logSafe(0)` is called
- **THEN** it SHALL return `0`

#### Scenario: logSafe returns 0 for negative values

- **WHEN** `logSafe(-5)` is called
- **THEN** it SHALL return `0`

#### Scenario: logSafe one-line JSDoc summary

- **WHEN** the one-line JSDoc description for `logSafe` is inspected
- **THEN** it SHALL state "Safe logarithm (returns 0 for non-positive values)"

---

## API Consistency Audit — Merged Requirements (2026-03-20)

_Synced from delta spec: `openspec/changes/math2d-api-consistency-audit/specs/auxiliary-api`_

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

---

## Changes from math2d-comprehensive-audit (2026-03-20)

## MODIFIED Requirements

### Requirement: angleBisector documentation fix

The JSDoc example for `angleBisector` SHALL document the correct result. With the `(-PI, PI]` convention (matching IEEE 754, MATLAB, Unity, Box2D), `angleBisector(0, Math.PI)` returns `Math.PI / 2` because `angleDifference(0, PI) = PI` (CCW half-turn), giving bisector at `0 + PI*0.5 = PI/2`.

#### Scenario: angleBisector(0, PI) actual behavior

- **GIVEN** `a = 0` and `b = Math.PI`
- **WHEN** `angleBisector(a, b)` is called
- **THEN** the result SHALL be approximately `Math.PI / 2` (because `angleDifference(0, PI) = PI`, then `normalizeRadians(0 + PI*0.5) = PI/2`)

#### Scenario: JSDoc example matches implementation

- **WHEN** the JSDoc for `angleBisector` is inspected
- **THEN** all example outputs SHALL match the actual return values of the function

---

### NOTE: moveTowards, moveTowardsAngle — REVERSED

These additions were proposed but REVERSED during adversarial review. The ratified spec at `openspec/specs/core-types-api/spec.md:649` explicitly rejected `moveTowards` as "a game engine convenience that composes existing mathematical primitives. Pure math libraries (glm, nalgebra, Eigen) do not include this operation." The same reasoning applies to `moveTowardsAngle`.

### NOTE: remapSafe boundary guard — REVERSED

This modification was proposed but REVERSED during adversarial review. The audit claimed `remapSafe` "silently produces Infinity" for degenerate ranges. This is factually incorrect — the actual code at `auxiliary/scalar/arithmetic.ts:169` already contains `if (inRange === 0) return outMin;`. The function already handles degenerate input correctly.
