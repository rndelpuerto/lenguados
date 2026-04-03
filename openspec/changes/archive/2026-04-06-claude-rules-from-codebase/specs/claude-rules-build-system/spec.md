## ADDED Requirements

### Requirement: Package.json exports pattern

Rule file `.claude/rules/build-and-exports.md` MUST document the conditional exports structure used across all packages.

#### Scenario: Claude modifies package.json exports

- **WHEN** Claude adds a subpath export to any package.json
- **THEN** `types` condition precedes `default` for TypeScript resolution
- **THEN** `development` condition precedes `default` for dev/prod split
- **THEN** the structure matches: `{ types, development: { require, import }, default: { require, import } }`

### Requirement: Entry point conventions

The rule MUST document the 3-file entry point pattern: `main.js` (CJS with NODE_ENV detection), `main.mjs` (production ESM), `dev-main.mjs` (development ESM).

#### Scenario: Claude creates a new package

- **WHEN** Claude scaffolds a new workspace package
- **THEN** it creates `main.js`, `main.mjs`, and `dev-main.mjs` following the existing pattern
- **THEN** `main.js` uses runtime `process.env.NODE_ENV` detection to switch between `.development.js` and `.production.js`

### Requirement: Module internals registration

The rule MUST document `module-internals.json` — the file that controls which internal modules get separate entry points.

#### Scenario: Claude adds a new internal module that needs a subpath export

- **WHEN** a new directory under `src/` needs to be importable via `@lenguados/math2d/new-module`
- **THEN** the directory name is added to `module-internals.json`
- **THEN** corresponding exports entries are added to `package.json`

### Requirement: Build output structure

The rule MUST document the `lib/` output directory structure: `lib/cjs/` (CommonJS), `lib/esm/` (ES Modules), `lib/@types/` (declarations).

#### Scenario: Claude references build outputs

- **WHEN** Claude writes paths in package.json exports or entry files
- **THEN** CJS files use `.development.js` / `.production.js` suffix in `lib/cjs/`
- **THEN** ESM files use `.development.js` / `.production.js` suffix in `lib/esm/` (or `module.js` for production root)
- **THEN** type declarations are in `lib/@types/`

### Requirement: sideEffects declaration

The rule MUST specify that all packages declare `"sideEffects": false` for tree-shaking.

#### Scenario: Claude creates or modifies a package.json

- **WHEN** Claude edits a workspace package's package.json
- **THEN** `"sideEffects": false` is present

### Requirement: Path scoping

The rule MUST use `paths: ['**/package.json', '**/rollup.config.*', 'scripts/**']`.

#### Scenario: Claude edits source code

- **WHEN** Claude edits `packages/math2d/src/core/Vector2.ts`
- **THEN** the build-and-exports rule is NOT loaded
