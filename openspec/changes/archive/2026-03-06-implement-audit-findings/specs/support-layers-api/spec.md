## MODIFIED Requirements

### Requirement: angle/sinCos delegates to deterministic/sinCos

The `auxiliary/angle/operations.ts` `sinCos` function SHALL delegate to `deterministic/sinCos` internally, rather than calling `sin()` and `cos()` separately. This avoids performing range reduction twice for the same angle.

#### Scenario: angle/sinCos produces same results as deterministic/sinCos

- **WHEN** `sinCos(angle)` from `auxiliary/angle/operations` is called
- **THEN** the result SHALL be identical to calling `sinCos(angle)` from `deterministic/deterministic-kernels`

#### Scenario: angle/sinCos supports out parameter

- **WHEN** `sinCos(angle, existingObject)` is called with an out parameter
- **THEN** it SHALL write to the provided object and return it
