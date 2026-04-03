## ADDED Requirements

### Requirement: Prettier configuration awareness

Rule file `.claude/rules/code-style.md` MUST document the project's Prettier settings so Claude generates conforming code.

#### Scenario: Claude writes TypeScript code

- **WHEN** Claude creates or edits any `.ts` file
- **THEN** it uses single quotes (not double), semicolons, trailing commas in multiline, 100-char print width, 1-space indentation (tabWidth=1)

### Requirement: Import ordering

The rule MUST document the import order convention enforced by ESLint `import/order`.

#### Scenario: Claude adds imports to a source file

- **WHEN** Claude writes imports in a `packages/math2d/src/` file
- **THEN** imports are grouped: (1) type imports (`import type { ... }`) separate from value imports, (2) alphabetical within groups, (3) blank line between groups
- **THEN** layer ordering: deterministic → auxiliary → core → types → validation

### Requirement: File naming

The rule MUST specify kebab-case for all filenames, enforced by ESLint `unicorn/filename-case`.

#### Scenario: Claude creates a new source file

- **WHEN** Claude creates a new `.ts` file
- **THEN** the filename is kebab-case (e.g., `angle-operations.ts`, not `angleOperations.ts`)

### Requirement: No default exports

The rule MUST specify that all modules use named exports exclusively.

#### Scenario: Claude creates a new module

- **WHEN** Claude writes an export statement
- **THEN** it uses `export { name }` or `export function name()`, never `export default`

### Requirement: Class member ordering (ESLint enforcement)

The rule MUST document the `@typescript-eslint/member-ordering` rule: fields → constructor → static methods → instance methods/getters/setters.

#### Scenario: Claude adds a getter to a class

- **WHEN** Claude adds a getter or setter to a core class
- **THEN** it places it after instance methods (per ESLint member-ordering config)

### Requirement: Commit message format

The rule MUST reference conventional commits with `(math2d)` scope for math package changes.

#### Scenario: Claude creates a commit

- **WHEN** Claude composes a commit message for math2d changes
- **THEN** it uses conventional format: `type(math2d): description` (e.g., `feat(math2d): add AABB type`)

### Requirement: Path scoping

The rule MUST use `paths: ['**/*.ts']`.

#### Scenario: Claude edits markdown files only

- **WHEN** Claude only edits `.md` files in a session
- **THEN** the code-style rule is NOT loaded
