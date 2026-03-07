## MODIFIED Requirements

### Requirement: config object SHALL document mutability constraints

The `config` object exported from `deterministic-kernels.ts` SHALL include JSDoc that documents:

- Global singleton nature
- Thread-safety limitations
- Recommendation to set before computation begins

#### Scenario: config documentation exists

- **WHEN** the `config` export JSDoc is read
- **THEN** it SHALL contain warnings about global mutability

#### Scenario: config.useNativeMath defaults to false

- **WHEN** `config` is accessed without modification
- **THEN** `config.useNativeMath` SHALL be `false` (deterministic mode)

### Requirement: Deterministic safe variants SHALL be accessible from main package

All deterministic safe variants SHALL be accessible from `@lenguados/math2d`. The kernel-level `logSafe` is intentionally NOT in the barrel export to avoid naming collision with the public API `logSafe` from `auxiliary/numeric/safety.ts` (which has richer signature with base parameter). Both variants return 0 for non-positive input.

#### Scenario: acosSafe importable from main package

- **WHEN** `import { acosSafe } from '@lenguados/math2d'` is used
- **THEN** the import SHALL resolve to the `acosSafe` from `deterministic-kernels.ts`

#### Scenario: logSafe importable from main package (auxiliary version)

- **WHEN** `import { logSafe } from '@lenguados/math2d'` is used
- **THEN** the import SHALL resolve to the `logSafe` from `auxiliary/numeric/safety.ts` (with base parameter support)

#### Scenario: sqrtSafe importable from main package

- **WHEN** `import { sqrtSafe } from '@lenguados/math2d'` is used
- **THEN** it SHALL resolve to the `sqrtSafe` from `auxiliary/numeric/safety.ts` (Math.sqrt is IEEE 754 deterministic)
