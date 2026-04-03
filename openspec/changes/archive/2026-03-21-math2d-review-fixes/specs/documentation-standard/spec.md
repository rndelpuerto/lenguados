## ADDED Requirements

### Requirement: Edge case behavior documented in JSDoc

All auxiliary layer functions with non-obvious edge case behavior SHALL document that behavior in @remarks JSDoc sections. Specific functions requiring documentation:

- `angleBisector`: ambiguous case when angles are exactly π apart
- `smoothStep`/`smootherStep`: degenerate case when edge0 === edge1
- `compensatedProduct`: overflow risk for very large magnitudes
- `sanitizeNumber`: fallback value gets clamped
- `ensureFinite`: non-finite fallback silently replaced with 0
- `fract`: returns NaN for non-finite inputs
- `flooredMod`: uses isNearZero tolerance, not exact zero check

#### Scenario: angleBisector π-apart documentation

- **WHEN** reading the JSDoc for `angleBisector`
- **THEN** there SHALL be a @remarks note explaining behavior when input angles are exactly π apart

#### Scenario: smoothStep degenerate case documentation

- **WHEN** reading the JSDoc for `smoothStep`
- **THEN** there SHALL be a @remarks note explaining the fallback behavior when edge0 === edge1

#### Scenario: fract NaN documentation

- **WHEN** reading the JSDoc for `fract`
- **THEN** there SHALL be a @remarks note stating that non-finite inputs return NaN

### Requirement: assert\*Like production DCE behavior documented

All `assert*Like` functions in `validation/assert.ts` SHALL document in their JSDoc that they are eliminated via DCE in production builds, and that TypeScript type narrowing only occurs at compile time.

#### Scenario: assertVector2Like DCE documentation

- **WHEN** reading the JSDoc for `assertVector2Like`
- **THEN** there SHALL be a @remarks note stating: "In production builds, this function is eliminated via DCE. For runtime shape validation, use `isVector2Like()` type guard."

### Requirement: Transform2.premultiply allocation documented

The `Transform2.premultiply()` instance method SHALL document in its JSDoc that it allocates a temporary Transform2 internally, and that users should prefer `Transform2.multiply()` (static) in hot paths.

#### Scenario: premultiply JSDoc allocation warning

- **WHEN** reading the JSDoc for `Transform2.premultiply()`
- **THEN** there SHALL be a @remarks note about the internal temporary allocation
- **AND** it SHALL reference `Transform2.multiply()` as the allocation-free alternative for hot paths
