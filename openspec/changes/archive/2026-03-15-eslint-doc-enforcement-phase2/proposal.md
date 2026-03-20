## Why

Phase 1 of ESLint doc enforcement (archived 2026-03-12) configured `eslint-plugin-jsdoc` rules and a custom `@category` vocabulary rule. However, a comprehensive audit revealed 19 gaps where DOCUMENTATION_STANDARD.md requirements are not enforced. The most critical: the per-symbol-type tag matrix (Section 2) has zero ESLint coverage — `@category`/`@since` presence is not required, `@internal` symbols are not prevented from carrying public-facing tags, and `@example` requirements per symbol type are not enforced.

## What Changes

- **Create custom ESLint rule `enforce-required-tags`** to enforce DOCUMENTATION_STANDARD.md Section 2's per-symbol-type tag matrix: `@category` and `@since` required on public symbols, prohibited on `@internal`; `@example` required on functions/factories/triality-strict/triality-safe/classes, prohibited on `@internal`/triality-unchecked/interfaces
- **Create custom ESLint rule `enforce-see-format`** to validate `@see` tags follow the `{@link Target} - description` pattern (Section 5)
- **Create custom ESLint rule `enforce-tag-fragments`** to prohibit trailing periods on `@param`/`@returns` sentence fragments and enforce the `@param name - Description` dash format (Section 5)
- **Enhance existing `enforce-category-vocabulary` rule** to add file-scoping: type-specific categories (`Matrix Operations`, `Set Operations`, `Column/Row`, `Transform Integration`, `Direction`, `Geometry`, `Constraint`) SHALL only be valid in their designated files (Section 3)
- **Fix any new violations** surfaced by the rules (expected to be zero since Phase 2 audit brought codebase to compliance)
- **Update `eslint-doc-enforcement` spec** to remove addressed items from Limitations section

## Capabilities

### New Capabilities

_None — this extends the existing `eslint-doc-enforcement` capability._

### Modified Capabilities

- `eslint-doc-enforcement`: Adding requirements for per-symbol-type tag enforcement, file-scoped category validation, `@see` format validation, and `@param`/`@returns` fragment conventions

## Impact

- **Code**: `eslint-rules/` (3 new `.cjs` files + 1 modified), `eslint.config.js` (register new rules), minor documentation fixes in `packages/math2d/src/` if violations found
- **APIs**: None
- **Dependencies**: None (all enforcement via custom local rules, no new npm packages)
- **Build/Tests**: `npx eslint packages/math2d/src/` must exit 0 after configuration. Pre-commit hooks enforce on all future changes
