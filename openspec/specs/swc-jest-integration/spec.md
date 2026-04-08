## ADDED Requirements

### Requirement: SWC-based test transpilation

The test runner SHALL use `@swc/jest` with `@swc/core` to transpile TypeScript test files instead of `ts-jest`. The SWC transform MUST be configured for both Jest project environments (node and jsdom).

#### Scenario: Node environment tests pass with SWC transpiler

- **WHEN** `npx jest --selectProjects node --no-coverage` is executed
- **THEN** all `*.node.spec.ts` tests SHALL pass with identical results as under ts-jest

#### Scenario: JSDOM environment tests pass with SWC transpiler

- **WHEN** `npx jest --selectProjects jsdom --no-coverage` is executed
- **THEN** all `*.dom.spec.ts` tests SHALL pass with identical results as under ts-jest, including DOM polyfills from `jest.dom.setup.ts`

#### Scenario: Full test suite with coverage

- **WHEN** `npm run test:unit` is executed
- **THEN** all tests SHALL pass and coverage thresholds (90% lines/statements, 85% functions, 50% branches) SHALL be met

### Requirement: SWC configuration targets Node 22

The SWC `jsc.target` MUST be set to `es2022` to match the Node 24.14.1 runtime. The parser MUST use `typescript` syntax mode with decorators disabled.

#### Scenario: SWC target is es2022

- **WHEN** the jest.config.ts SWC transform options are inspected
- **THEN** `jsc.target` SHALL equal `"es2022"` and `jsc.parser.syntax` SHALL equal `"typescript"`

#### Scenario: No unnecessary downleveling

- **WHEN** a test file uses ES2022+ features (class fields, private methods, optional chaining, nullish coalescing)
- **THEN** SWC SHALL pass them through without transformation since Node 22 supports them natively

### Requirement: ts-jest removal

The `ts-jest` package MUST be removed from devDependencies after migration. The `globals['ts-jest']` configuration block MUST be removed from jest.config.ts.

#### Scenario: ts-jest is not in dependencies

- **WHEN** `npm ls ts-jest` is executed at the workspace root
- **THEN** ts-jest SHALL NOT appear as a direct dependency (it may remain as a transitive dependency of other packages)

#### Scenario: No ts-jest configuration remains

- **WHEN** jest.config.ts is inspected
- **THEN** there SHALL be no `globals['ts-jest']` block and no import from `ts-jest`

### Requirement: Jest config type safety

The jest.config.ts MUST use a valid Jest configuration type. After removing `ts-jest`, the `JestConfigWithTsJest` type import MUST be replaced with the standard `Config` type from `@jest/types` or `jest` itself.

#### Scenario: Config type compiles without ts-jest

- **WHEN** `tsc --noEmit jest.config.ts` is run (or equivalent type check)
- **THEN** the file SHALL compile without errors using only `@jest/types` or `jest` type definitions

### Requirement: Property-based tests work under SWC

The fast-check property-based tests MUST execute correctly under SWC transpilation, producing identical deterministic results.

#### Scenario: Property-based tests with fast-check

- **WHEN** `npx jest --testPathPattern="properties" --no-coverage` is executed
- **THEN** all property-based tests SHALL pass with the same seed-deterministic behavior as under ts-jest
