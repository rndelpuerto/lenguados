## Why

The math2d library has grown to 30+ source files with inconsistent documentation patterns: file headers vary from minimal (`@file` + `@description`) to rich (with `@remarks` sections), `@category` tags proliferate without a controlled vocabulary (16+ unique values across core types alone), class member sections appear in different orders across files (constructor placement ranges from line 143 to line 2544), and triality cross-links (`@see` between strict/safe/unchecked) are applied inconsistently. An exhaustive audit revealed 35+ documentation gaps across all layers. Without a formal standard, every new file or contributor introduces further drift — and Phase 3 linter enforcement becomes impossible without a spec to enforce against.

## What Changes

- Define a **canonical TSDoc tag order** mandatory for every public export (summary → @remarks → @param → @returns → @throws → @example → @see → @category → @since)
- Establish **14 documentation templates** covering every symbol type: file header, constant, function, triality (strict/safe/unchecked), class, interface, static constant, factory method, instance method, @internal, type alias, section divider
- Standardize a **@category vocabulary** with ~10 base categories reused across all class files and ~7 type-specific categories used only where needed
- Define a **class member section order** compatible with `@typescript-eslint/member-ordering`: fields → constructor → static methods → instance accessors → instance methods
- Establish **transversal rules**: when @remarks/@example/@throws are required vs optional, @constant on all exported constants, imperative voice summaries, sentence fragment @param/@returns, Unicode symbols permitted (no LaTeX)
- Remove redundant patterns (e.g., "for the Lenguado 2-D physics-engine family" suffix in @description)

## Capabilities

### New Capabilities

- `documentation-standard`: Comprehensive TSDoc documentation standard defining templates, tag order, category vocabulary, section ordering, and transversal rules for all math2d source files

### Modified Capabilities

_(none — this change introduces a new standard without modifying existing behavioral requirements)_

## Impact

- **All layers affected**: deterministic/, auxiliary/, core/, types/, validation/, utils/ — every source file must conform to the standard
- **No runtime impact**: This is a documentation-only standard; no API signatures, behavior, or bundle output changes
- **No breaking changes**: Existing public API remains identical
- **TypeDoc output**: Standardized @category values will produce cleaner, more navigable generated documentation
- **Linter readiness**: The section ordering and tag requirements are designed for future enforcement via `eslint-plugin-jsdoc` and `@typescript-eslint/member-ordering` (Phase 3, separate change)
- **Tree-shaking/bundle size**: Unaffected — JSDoc comments are stripped by Rollup in production builds
