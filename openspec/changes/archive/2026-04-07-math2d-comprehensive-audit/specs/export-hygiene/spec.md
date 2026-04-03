## ADDED Requirements

### Requirement: Package.json exports MUST only reference existing modules

Every subpath export entry in `packages/math2d/package.json` SHALL point to source/built files that exist in the repository. Phantom exports that reference non-existent modules SHALL be removed.

#### Scenario: Remove phantom precision-math export

WHEN the package.json exports map is evaluated
THEN there SHALL be no entry for `./deterministic/precision-math`
AND there SHALL be no entry for `./deterministic/rounding-control`

#### Scenario: Verify all remaining exports resolve

WHEN every subpath in the package.json exports map is resolved
THEN each path SHALL point to an existing file in the `lib/` directory after build
AND each conditional export (development/default) SHALL resolve to the correct variant

### Requirement: Deterministic kernels MUST have a proper subpath export

The actual deterministic math module SHALL be accessible via a clean subpath import with proper dev/prod conditional exports, matching the pattern used by other subpath exports.

#### Scenario: Add deterministic subpath export

WHEN a consumer imports from `@lenguados/math2d/deterministic`
THEN the import SHALL resolve to the `deterministic-kernels` module
AND the `development` condition SHALL resolve to the development build
AND the `default` condition SHALL resolve to the production build
AND the `types` condition SHALL resolve to the TypeScript declarations

### Requirement: Internal helper functions MUST NOT be part of public API

Functions that are implementation details of other exported functions SHALL be marked with `@internal` TSDoc tag and SHALL NOT appear in the main barrel export.

#### Scenario: pow2 marked as internal

WHEN reviewing `deterministic-kernels.ts`
THEN the `pow2` function SHALL have an `@internal` TSDoc tag
AND `pow2` SHALL NOT be included in the `DeterministicKernels` namespace object
AND `pow2` SHALL NOT be re-exported from the main `index.ts` barrel

### Requirement: sinCos barrel export MUST resolve unambiguously

The main barrel (`index.ts`) SHALL export exactly one `sinCos` function. The auxiliary/angle wrapper (which delegates to the deterministic kernel) SHALL be the one that flows through the barrel via `export * from './auxiliary/angle'`.

#### Scenario: Remove explicit sinCos re-export from deterministic

WHEN reviewing `index.ts`
THEN the named re-export `export { sinCos } from './deterministic/deterministic-kernels'` SHALL be removed
AND `sinCos` SHALL still be accessible via `export * from './auxiliary/angle'`
AND the runtime behavior SHALL be identical (auxiliary sinCos delegates to deterministic sinCos)

### Requirement: ReadonlySinCos MUST be documented for forward use

The `ReadonlySinCos` interface in `types/index.ts` SHALL include a `@remarks` tag explaining its intended use for future angle lookup table support, preventing premature removal.

#### Scenario: ReadonlySinCos has forward-use documentation

WHEN reviewing the `ReadonlySinCos` interface TSDoc
THEN there SHALL be a `@remarks` section explaining: "Reserved for future use in angle lookup tables and cached trigonometric computations. Follows the Readonly\*/mutable pattern established by all other type interfaces."
