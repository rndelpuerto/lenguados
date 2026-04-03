## MODIFIED Requirements

### Requirement: angleBisector documentation fix

The JSDoc example for `angleBisector` SHALL be corrected. The example `angleBisector(0, Math.PI)` currently documents the result as `Math.PI / 2`, but the actual result is `-Math.PI / 2` due to the half-open `[-PI, PI)` normalization convention where `normalizeRadians(PI) = -PI`.

The corrected JSDoc SHALL either:

- Fix the example to show `angleBisector(0, Math.PI); // -Math.PI / 2`, or
- Replace the example entirely with an unambiguous case like `angleBisector(0, Math.PI / 2); // Math.PI / 4`

#### Scenario: angleBisector(0, PI) actual behavior

- **GIVEN** `a = 0` and `b = Math.PI`
- **WHEN** `angleBisector(a, b)` is called
- **THEN** the result SHALL be approximately `-Math.PI / 2` (because `angleDifference(0, PI) = normalizeRadians(PI) = -PI`, then `normalizeRadians(0 + (-PI)*0.5) = -PI/2`)

#### Scenario: JSDoc example matches implementation

- **WHEN** the JSDoc for `angleBisector` is inspected
- **THEN** all example outputs SHALL match the actual return values of the function

---

### NOTE: moveTowards, moveTowardsAngle — REVERSED

These additions were proposed but REVERSED during adversarial review. The ratified spec at `openspec/specs/core-types-api/spec.md:649` explicitly rejected `moveTowards` as "a game engine convenience that composes existing mathematical primitives. Pure math libraries (glm, nalgebra, Eigen) do not include this operation." The same reasoning applies to `moveTowardsAngle`.

### NOTE: remapSafe boundary guard — REVERSED

This modification was proposed but REVERSED during adversarial review. The audit claimed `remapSafe` "silently produces Infinity" for degenerate ranges. This is factually incorrect — the actual code at `auxiliary/scalar/arithmetic.ts:169` already contains `if (inRange === 0) return outMin;`. The function already handles degenerate input correctly.
