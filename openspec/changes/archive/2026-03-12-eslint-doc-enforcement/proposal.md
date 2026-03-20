## Why

Phase 2 brought the entire `@lenguados/math2d` codebase into compliance with DOCUMENTATION_STANDARD.md. However, without automated enforcement, documentation drift is inevitable as new code is written. Phase 3 closes the loop by configuring ESLint rules that make non-conformant documentation a lint error, caught automatically by pre-commit hooks and CI.

Currently only 1 jsdoc rule is active (`jsdoc/require-returns: warn`). All necessary plugins are already installed (`eslint-plugin-jsdoc` v61.5.0, `@typescript-eslint/eslint-plugin` v8.49.0).

## What Changes

- **Enable `eslint-plugin-jsdoc` rules** in `eslint.config.js` to enforce: tag order (`jsdoc/sort-tags`), required tags (`jsdoc/require-param`, `jsdoc/require-returns`), param name matching (`jsdoc/check-param-names`), valid tag names (`jsdoc/check-tag-names`), `@see` format, and tag line spacing
- **Enable `@typescript-eslint/member-ordering`** for class member section ordering (Phase 1 verified compatibility with defaults)
- **Create a custom ESLint rule or lint script** for controlled `@category` vocabulary validation (32 valid values defined in DOCUMENTATION_STANDARD.md)
- **Fix any violations** surfaced by the new rules (expected to be minimal)
- **Upgrade `jsdoc/require-returns`** from `warn` to `error`

## Capabilities

### New Capabilities

- `eslint-doc-enforcement`: ESLint rule configuration for automated documentation standard enforcement

### Modified Capabilities

_None — no existing spec requirements change._

## Impact

- **Code**: `eslint.config.js` (primary), potentially a custom rule file, minor fixes in source files
- **APIs**: None
- **Dependencies**: None (all plugins already installed)
- **Build/Tests**: `npm run lint` must exit 0 after configuration. Pre-commit hooks (`lint-staged`) will enforce on all future changes
