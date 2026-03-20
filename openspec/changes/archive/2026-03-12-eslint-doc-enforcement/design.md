## Context

The `@lenguados/math2d` documentation standard (DOCUMENTATION_STANDARD.md) defines 14 templates, a canonical tag order, controlled `@category` vocabulary (32 valid values), and class member section ordering. Phase 2 brought all source files into compliance. This change configures ESLint to enforce the standard automatically.

Current ESLint state:

- ESLint 9.39.0 with flat config (`eslint.config.js`)
- `eslint-plugin-jsdoc` v61.5.0 installed, only `jsdoc/require-returns: warn` active
- `@typescript-eslint/eslint-plugin` v8.49.0 installed, `member-ordering` not enabled
- Pre-commit hook (`lint-staged`) runs ESLint on staged files

## Goals / Non-Goals

**Goals:**

- Configure jsdoc rules that enforce the canonical tag order, required tags, and text conventions
- Configure `@typescript-eslint/member-ordering` for class file section ordering
- Validate controlled `@category` vocabulary
- `npm run lint` passes clean (exit 0) after all configuration
- Future non-conformant documentation is caught automatically

**Non-Goals:**

- Enforcing every nuance of the standard (triality cross-linking, @remarks content structure — these require manual review, not lint rules)
- Adding new ESLint plugins
- Modifying CI/CD pipelines
- Test file documentation enforcement
- Modifying DOCUMENTATION_STANDARD.md

## Decisions

### D1: Rule severity — `warn` for new rules, `error` for critical

**Decision:** Start most new jsdoc rules at `warn` severity. Only `jsdoc/check-tag-names` and `jsdoc/check-param-names` at `error` (these catch real bugs). Upgrade `jsdoc/require-returns` from `warn` to `error`.

**Rationale:** `warn` allows gradual adoption without blocking commits. Critical rules (`check-tag-names`, `check-param-names`) catch actual errors and should block.

**Alternative considered:** All rules at `error`. Rejected — too aggressive for initial rollout; may surface edge cases that need discussion.

### D2: `jsdoc/sort-tags` configuration

**Decision:** Configure `jsdoc/sort-tags` with a custom `tagSequence` matching our canonical order:

```
file, module, description, remarks, param, returns, throws, defaultValue, example, see, internal, constant, category, since, public
```

**Rationale:** The plugin's default ordering doesn't match our standard (e.g., `@remarks` is not in the default list). Custom sequence needed.

### D3: `@category` vocabulary enforcement

**Decision:** Use `jsdoc/check-tag-names` with a custom `definedTags` list that includes `@category`, then create a lightweight custom ESLint rule (local plugin, no npm package) that validates `@category` values against the 32 allowed values from DOCUMENTATION_STANDARD.md.

**Alternative considered:** External validation script. Rejected — wouldn't run on every commit via lint-staged.

**Alternative considered:** Regex in `jsdoc/match-description` for `@category`. Rejected — that rule targets tag descriptions, not values, and is fragile for vocabulary enforcement.

### D4: `@typescript-eslint/member-ordering` configuration

**Decision:** Use the `default` configuration (not custom). Phase 1 verified that our section ordering is compatible with the defaults:

- Fields before constructor ✓
- Constructor before methods ✓
- Static methods before instance methods ✓
- Accessors before methods ✓
- Public before protected before private ✓

**Rationale:** Minimal configuration. The standard was designed to match the defaults.

### D5: Scope — `packages/math2d/src/**/*.ts` only

**Decision:** Apply jsdoc enforcement rules only to math2d source files, not test files or other packages.

**Rationale:** Test files don't follow the documentation standard. Other packages may have different conventions.

### D6: Tags to recognize

**Decision:** Configure `jsdoc/check-tag-names` with `definedTags` including all TSDoc tags we use: `remarks`, `param`, `returns`, `throws`, `defaultValue`, `example`, `see`, `internal`, `constant`, `category`, `since`, `public`, `file`, `module`, `description`, `packageDocumentation`. Block `@group`, `@alpha`, `@beta` (prohibited in DOCUMENTATION_STANDARD.md).

## Risks / Trade-offs

- **[Risk] `jsdoc/sort-tags` may conflict with `@defaultValue` inline in `@param`** → The scanner treats inline `@defaultValue` as text, not a standalone tag. If the linter parses it differently, we may need to configure an exception. Mitigated by testing before committing.
- **[Risk] `member-ordering` may flag existing code** → Phase 1 verified compatibility, but edge cases possible. Mitigated by running lint before enabling at `error`.
- **[Risk] Custom rule maintenance burden** → Kept minimal (single file, ~50 lines, vocabulary list). Low maintenance.
