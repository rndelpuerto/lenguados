## ADDED Requirements

### Requirement: Error messages validated for actionability

All assertion functions and strict-mode error throws SHALL produce error messages that:

1. Identify WHAT went wrong (which value, which constraint violated)
2. Identify WHERE it went wrong (parameter name via `name?` parameter)
3. Suggest HOW to fix it (use Safe variant, check input, normalize first)

These SHALL be validated against:

- zod's error messages (structured, path-aware, actionable)
- Rust's compiler error messages (explain the problem and suggest fixes)
- React's error messages (link to documentation, suggest specific actions)

#### Scenario: Assertion error includes parameter name

- **WHEN** `assertFinite(NaN, 'velocity.x')` is called
- **THEN** the error message SHALL include `'velocity.x'`, the invalid value, and the constraint violated (e.g., "Expected finite number for 'velocity.x', got NaN")

#### Scenario: Assertion error suggests Safe variant

- **WHEN** `normalize(Vector2.ZERO)` throws (zero-length vector)
- **THEN** the error message SHALL suggest: "Use normalizeSafe() for a fallback value, or normalizeUnchecked() to skip validation"

#### Scenario: Error messages are grep-friendly

- **WHEN** the audit evaluates all error message strings
- **THEN** each SHALL contain the function name or a unique identifier that allows finding the source with a text search, NOT generic messages like "Invalid input"

---

### Requirement: TypeScript strict mode integration validated

The library's TypeScript integration SHALL be validated under `strict: true` with
`exactOptionalPropertyTypes` and `noUncheckedIndexedAccess`:

1. **No `any` escapes**: No function SHALL accept or return `any` in its public API
2. **Correct readonly**: Input parameters typed as `Readonly*Like` prevent accidental mutation at compile time
3. **Return type inference**: All public functions SHALL have explicit return types (no inference dependency)
4. **Overload clarity**: If overloads exist, they SHALL be ordered from most specific to least
5. **Generic constraints**: Any generic parameters SHALL be constrained (no unbounded `<T>`)

These SHALL be validated against the TypeScript team's guidelines for library authors,
Microsoft's API design guidelines for TypeScript, and the patterns used by zod, drizzle-orm,
and effect-ts.

#### Scenario: No any in public API

- **WHEN** the audit scans all exported function signatures
- **THEN** zero `any` types SHALL appear in parameters, return types, or generic constraints

#### Scenario: Readonly input parameters

- **WHEN** a consumer passes a `Vector2` to a function expecting `ReadonlyVector2Like`
- **THEN** TypeScript SHALL prevent the consumer from mutating the parameter through the function's reference, enforced by `readonly` modifiers on the interface

#### Scenario: exactOptionalPropertyTypes compatibility

- **WHEN** the library is compiled with `exactOptionalPropertyTypes: true`
- **THEN** zero type errors SHALL occur, and optional properties SHALL correctly distinguish between `undefined` and missing

---

### Requirement: API discoverability evaluated for IDE experience

The library's API surface SHALL be evaluated for IDE discoverability:

1. **Autocomplete grouping**: Related methods group together alphabetically (e.g., `lerp`, `lerpAngle`, `lerpClamped`)
2. **JSDoc presence**: All exported functions SHALL have JSDoc with `@param`, `@returns`, and `@example`
3. **Consistent naming**: A developer who knows `Vector2.lerp` SHALL be able to guess `Rotation2.lerp` and `Complex.lerp` exist
4. **No name collisions**: No two exported symbols SHALL have the same name with different behavior

These SHALL be validated against the API design principles in Martin Reddy's "API Design for C++"
(chapter on naming), Google's API Design Guide, and the TypeScript handbook on declaration files.

#### Scenario: Autocomplete groups related operations

- **WHEN** a developer types `Vector2.` in an IDE
- **THEN** related operations SHALL group together: `normalize`, `normalizeSafe`, `normalizeUnchecked` appear consecutively, validating the suffix naming convention for discoverability

#### Scenario: Cross-type method prediction

- **WHEN** a developer knows `Vector2.lerp(a, b, t)` exists
- **THEN** they SHALL correctly predict that `Rotation2.lerp(a, b, t)` and `Complex.lerp(a, b, t)` exist with the same parameter pattern

#### Scenario: No ambiguous overloads

- **WHEN** the audit checks all exported function names
- **THEN** no name SHALL be overloaded with semantically different behavior across modules (e.g., `normalize` always means "make unit length" regardless of the type)

---

### Requirement: Import ergonomics validated

The library's import structure SHALL be validated for developer ergonomics:

1. **Main entry is lean**: The main import provides core types + essential functions without utils
2. **Subpath imports**: Utils available via `@lenguados/math2d/utils/random` etc.
3. **Tree-shaking friendly**: Unused exports are eliminated from bundles
4. **No barrel file bloat**: The main index re-exports only what's needed, not deep re-exports

These SHALL be validated against the import patterns of lodash (per-function import disaster),
date-fns (per-function success), and three.js (single import, tree-shakeable).

#### Scenario: Main import bundle size

- **WHEN** `import { Vector2, sin } from '@lenguados/math2d'` is bundled
- **THEN** only Vector2, sin, and their transitive dependencies SHALL be included (not the entire library), validated by bundle analysis

#### Scenario: Subpath imports work correctly

- **WHEN** `import { parseVector2 } from '@lenguados/math2d/utils/parse'` is used
- **THEN** it SHALL resolve correctly in Node.js (CJS + ESM), TypeScript, and bundlers (Webpack, Vite, esbuild), verified against the `exports` field in package.json

#### Scenario: No circular import warnings

- **WHEN** the library is bundled with Rollup or Webpack
- **THEN** zero circular dependency warnings SHALL be produced, and the audit SHALL verify the DAG property of the module graph

---

### Requirement: Error recovery patterns evaluated

The library's approach to error recovery (triality) SHALL be evaluated for real-world physics
engine scenarios:

1. **NaN propagation**: What happens when NaN enters the system and flows through operations?
2. **Infinity handling**: What happens when overflow produces Infinity in intermediate calculations?
3. **Recovery strategy**: Can a physics engine detect and recover from numerical errors?

These SHALL be validated against Box2D's approach (assertion + continue with clamped values),
Rapier's approach (Rust Result type, explicit error handling), and three.js's approach (silent NaN
propagation → visual glitches).

#### Scenario: NaN propagation traced

- **WHEN** the audit traces NaN through a typical chain: `normalize(Vector2.ZERO).scale(2).add(offset)`
- **THEN** it SHALL document at which point the strict variant catches the error, what the Safe variant produces, and what the Unchecked variant propagates, evaluating which behavior is most useful for a physics engine

#### Scenario: Physics engine recovery pattern

- **WHEN** a physics engine encounters a numerical error (e.g., division by zero in collision response)
- **THEN** the audit SHALL document a recommended recovery pattern using the library's API (e.g., use Safe variants in collision code, strict in setup code, Unchecked in verified hot paths)

#### Scenario: Debugging NaN origin

- **WHEN** a developer encounters NaN in their physics simulation
- **THEN** the library SHALL provide tools to trace the origin: assertion messages identify the first function that received invalid input, with parameter names pointing to the source

---

### Requirement: Documentation patterns evaluated for completeness

The TSDoc patterns in the library SHALL be evaluated against:

1. **@example coverage**: Every exported function SHALL have at least one @example
2. **@remarks for edge cases**: Functions with non-obvious behavior SHALL document edge cases
3. **@see for related functions**: Functions in the same family SHALL cross-reference each other
4. **@throws documentation**: Strict variants SHALL document what they throw and when
5. **Determinism annotation**: Functions using deterministic kernels SHALL note this

These SHALL be validated against the TSDoc specification, TypeScript handbook on JSDoc, and the
documentation quality of three.js (excellent examples), Eigen (excellent mathematical rigor),
and zod (excellent error documentation).

#### Scenario: @example present on all exports

- **WHEN** the audit checks TSDoc for every exported function
- **THEN** each SHALL have at least one `@example` showing typical usage, and the audit SHALL count functions missing examples

#### Scenario: @throws documented on strict variants

- **WHEN** the audit checks TSDoc for strict functions (e.g., `normalize`, `inverseLerp`, `divide`)
- **THEN** each SHALL have `@throws {Error}` with a description of when the throw occurs

#### Scenario: Cross-references between related functions

- **WHEN** the audit checks TSDoc for `normalizeSafe`
- **THEN** it SHALL contain `@see normalize` and `@see normalizeUnchecked` for discoverability
