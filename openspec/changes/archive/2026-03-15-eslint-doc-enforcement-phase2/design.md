## Context

Phase 1 of ESLint doc enforcement (eslint-doc-enforcement, archived 2026-03-12) configured `eslint-plugin-jsdoc` rules and a custom `enforce-category-vocabulary` rule. An exhaustive audit identified 19 gaps where DOCUMENTATION_STANDARD.md is not enforced. This change closes the gaps that can be reliably automated.

Current state:

- ESLint 9.39.0 with flat config, `eslint-plugin-jsdoc` v61.5.0
- Custom rule `enforce-category-vocabulary.cjs` in `eslint-rules/`, registered as `local` plugin
- `"type": "module"` in package.json — custom rules must use `.cjs` extension
- All source files compliant with DOCUMENTATION_STANDARD.md (Phase 2 audit)
- Pre-commit hook (`lint-staged`) runs ESLint on staged files

## Goals / Non-Goals

**Goals:**

- Enforce per-symbol-type tag requirements from DOCUMENTATION_STANDARD.md Section 2 (the tag matrix)
- Enforce file-scoped category validation from Section 3
- Enforce `@see` format convention from Section 5
- Enforce `@param`/`@returns` fragment conventions from Section 5
- `npx eslint packages/math2d/src/` passes clean (exit 0) after all configuration
- Future non-conformant documentation caught automatically by pre-commit hooks

**Non-Goals:**

- Imperative voice enforcement (unreliable to automate — requires NLP)
- LaTeX prohibition (extremely rare, not worth a rule)
- Triality `@see` cross-linking validation (complex pattern-matching across files, better as manual review)
- Structural class member reordering (code change, not doc enforcement)
- Modifying DOCUMENTATION_STANDARD.md

## Decisions

### D1: Rule architecture — one rule per concern

**Decision:** Create three new custom rules, each handling one concern. Enhance the existing vocabulary rule for file-scoping.

- `enforce-required-tags.cjs` — Section 2 tag matrix (per-symbol-type tag presence/prohibition)
- `enforce-see-format.cjs` — Section 5 `@see` format
- `enforce-tag-fragments.cjs` — Section 5 `@param`/`@returns` fragment conventions

**Rationale:** Separation of concerns. Each rule has a clear, testable scope. Users can disable individual rules if needed.

### D2: Symbol type detection for `enforce-required-tags`

**Decision:** Use AST node types from the ESLint parser to determine symbol type. The rule walks the AST and for each node with a JSDoc comment, classifies it:

| AST Pattern                                                                    | Symbol Type                              |
| ------------------------------------------------------------------------------ | ---------------------------------------- |
| `FunctionDeclaration` / `ExportNamedDeclaration > FunctionDeclaration`         | Function                                 |
| `MethodDefinition[kind="method"][static=true]` with name ending in `Safe`      | Triality Safe                            |
| `MethodDefinition[kind="method"][static=true]` with name ending in `Unchecked` | Triality Unchecked                       |
| `MethodDefinition[kind="method"][static=true]` (other)                         | Triality Strict / Static method          |
| `MethodDefinition[kind="constructor"]`                                         | Constructor (skip — no tag requirements) |
| `MethodDefinition[kind="get"\|"set"]`                                          | Accessor (treated as Instance Method)    |
| `MethodDefinition[kind="method"][static=false]`                                | Instance Method                          |
| `ClassDeclaration`                                                             | Class                                    |
| `TSInterfaceDeclaration`                                                       | Interface                                |
| `VariableDeclaration` with `const` and frozen/readonly initializer             | Constant                                 |
| Any with `@internal` in JSDoc                                                  | @internal (overrides above)              |

**Rationale:** AST-based detection is reliable and maintainable. The `Safe`/`Unchecked` suffix convention is already formalized in DOCUMENTATION_STANDARD.md and enforced project-wide.

**Triality detection detail:** Static methods whose names end in `Safe` are classified as Triality Safe; those ending in `Unchecked` as Triality Unchecked. The corresponding "base" name (without suffix) is Triality Strict. Factory methods (names: `from*`, `clone`, `copy`) are excluded from triality classification.

### D3: Tag presence vs prohibition enforcement

**Decision:** For each symbol type, the rule checks:

- **Required tags** (`@category`, `@since`, `@example`): report `warn` if missing
- **Prohibited tags** (`@category`/`@since` on `@internal`, `@example` on Unchecked/Interface, `@throws` on Safe): report `warn` if present

**Rationale:** `warn` severity allows gradual adoption. The codebase is already compliant, so no warnings are expected. Future violations will be caught.

### D4: File-scope enhancement for category vocabulary

**Decision:** Enhance `enforce-category-vocabulary.cjs` to add a `FILE_SCOPE_MAP` that maps type-specific categories to allowed filename patterns:

```
'Matrix Operations' → ['matrix2.ts', 'matrix3.ts']
'Set Operations'    → ['interval.ts']
'Column/Row'        → ['matrix2.ts', 'matrix3.ts']
'Transform Integration' → ['vector2.ts', 'transform2.ts']
'Direction'         → ['vector2.ts']
'Geometry'          → ['vector2.ts']
'Constraint'        → ['vector2.ts']
```

**Rationale:** Minimal change to existing rule. File-based scoping is simpler and more reliable than AST-based class detection.

### D5: `@see` format validation

**Decision:** The rule checks that every `@see` tag matches the pattern `{@link <identifier>}` optionally followed by ` - <description>`. Bare URLs or plain text `@see` tags will warn.

**Rationale:** The standard requires `@see {@link Target} - description`. This is a mechanical check.

### D6: Fragment conventions for `@param` and `@returns`

**Decision:** The rule checks:

1. No trailing period on `@param` or `@returns` descriptions (sentence fragments, not sentences)
2. `@param` follows `@param name - Description` format (dash separator after name)

**Rationale:** These are mechanical text pattern checks that prevent documentation drift.

### D7: Scope — `packages/math2d/src/**/*.ts` only

**Decision:** All new rules apply only to math2d source files via the existing `files: ['**/*.ts']` config block. Test files are excluded by the existing Jest override which doesn't load the `local` plugin.

**Rationale:** Same scoping as Phase 1. Test files don't follow the documentation standard.

## Risks / Trade-offs

- **[Risk] Triality detection by suffix may produce false positives** — If a non-triality method happens to end in `Safe` or `Unchecked`, it would be misclassified. Mitigated: review all method names; the suffix convention is strict in this codebase.
- **[Risk] `enforce-required-tags` may flag @internal functions for missing @example** — Mitigated: @internal detection takes priority over symbol-type classification.
- **[Risk] Fragment convention checks may conflict with inline `@defaultValue`** — The `@param` description may contain embedded `@defaultValue` after the fragment text. Mitigated: the trailing-period check only looks at the last character before any embedded tags.
