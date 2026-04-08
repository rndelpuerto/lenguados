## MODIFIED Requirements

### Requirement: Single export path per function

Every public function SHALL be exported through exactly ONE path in the barrel (`index.ts`). No function SHALL appear in both an explicit named export AND a wildcard re-export.

**Current violations:**

- `acosSafe`: exported explicitly from `deterministic-kernels.ts` at line 104 AND via `export * from './auxiliary/numeric'` (which re-exports from `safety.ts`)
- `asinSafe`: same double-export pattern

**Fix:** Remove the explicit exports of `acosSafe`/`asinSafe`/`expSafe` from the deterministic block in `index.ts`. After the kernel purification, these functions will only exist in `safety.ts` and reach the barrel through `export * from './auxiliary/numeric'`.

**Evidence:**

- ES module spec states that when a name appears in both `export *` and an explicit `export { }`, the explicit one takes priority and the wildcard's version is ambiguous. TypeScript handles this but it is fragile.
- The `sinCos` function already has a comment in `index.ts` (line 119) acknowledging this pattern must be avoided: "Explicitly re-exporting it here would shadow that export."

#### Scenario: no double-exports in barrel

- **GIVEN** `src/index.ts`
- **WHEN** all export statements are analyzed
- **THEN** no function name SHALL appear in both an explicit `export { name }` block AND be reachable through an `export *` wildcard
- **EXCEPT** for the `sinCos` case (exported via `auxiliary/angle` only, with explicit comment)

#### Scenario: acosSafe accessible from barrel

- **GIVEN** a consumer importing `import { acosSafe } from '@lenguados/math2d'`
- **THEN** the import SHALL resolve successfully
- **AND** the function SHALL originate from `auxiliary/numeric/safety.ts`

#### Scenario: expSafe accessible from barrel

- **GIVEN** a consumer importing `import { expSafe } from '@lenguados/math2d'`
- **THEN** the import SHALL resolve successfully
- **AND** the function SHALL originate from `auxiliary/numeric/safety.ts`

#### Scenario: deterministic barrel block contains only pure kernels

- **GIVEN** the deterministic re-export block in `index.ts`
- **WHEN** its named exports are listed
- **THEN** it SHALL contain exactly: `acos`, `asin`, `atan`, `atan2`, `config`, `cos`, `exp`, `hypot`, `log`, `pow`, `sin`, `tan`
- **AND** it SHALL NOT contain any `*Safe` function
