## Context

The `.claude/rules/` system uses path-scoped YAML frontmatter (`paths:`) to load rules only when Claude reads matching files. Currently 3 rules exist:

- `math2d-patterns.md` (`packages/math2d/**`) — API patterns, naming, determinism basics, layer deps
- `testing-conventions.md` (`packages/*/test/**`) — file naming, structure, coverage thresholds
- `documentation-conventions.md` (`**/*.md`) — file placement, linking, frontmatter

Analysis of the full codebase, 750-line TSDoc standard, design philosophy docs, edge cases docs, and external best practices reveals 12 convention gaps where rules are needed.

## Goals / Non-Goals

**Goals:**

- Create 5 new rule files covering: TSDoc/class conventions, architecture/layers, build system, deep testing patterns, and code style
- Update 3 existing rules to fill gaps (determinism specifics, testing details, edge case docs)
- Update CLAUDE.md to reference all rules
- Update `implement-math-type` skill to link new rules
- Every rule derived from actual code analysis, not theoretical — verifiable against the codebase
- Rules use path scoping to load only when relevant (prevent context saturation)

**Non-Goals:**

- Modifying source code, tests, or build configuration
- Creating git hooks or automated enforcement (ESLint already covers lint; rules cover AI guidance)
- Duplicating the full 750-line TSDoc standard — rules reference it and extract the enforceable subset
- Documenting external library APIs (gl-matrix, three.js) — only reference them for rationale

## Decisions

### D1: Rule File Granularity — One concern per file

Each rule file covers one domain. This matches Claude Code best practices (under 200 lines per file, path-scoped loading). Eight total files (3 updated + 5 new) is manageable.

### D2: Path Scoping Strategy

| Rule File                               | `paths:` Scope                                        | Rationale                                                   |
| --------------------------------------- | ----------------------------------------------------- | ----------------------------------------------------------- |
| `math2d-patterns.md` (update)           | `packages/math2d/**`                                  | Core API patterns                                           |
| `tsdoc-conventions.md` (new)            | `packages/math2d/src/**/*.ts`                         | TSDoc only applies to source, not tests                     |
| `architecture-and-layers.md` (new)      | `packages/math2d/src/**`                              | Layer deps, determinism, validation tiers                   |
| `build-and-exports.md` (new)            | `**/package.json`, `**/rollup.config.*`, `scripts/**` | Build system conventions                                    |
| `testing-conventions.md` (update)       | `packages/*/test/**`                                  | Existing scope, add deep patterns                           |
| `code-style.md` (new)                   | `**/*.ts`                                             | Formatting, imports, naming                                 |
| `testing-deep-patterns.md` (new)        | `packages/math2d/test/**`                             | Math-specific test patterns (narrower than general testing) |
| `documentation-conventions.md` (update) | `**/*.md`                                             | Existing scope, add edge case/interop requirements          |

### D3: Rule Language — Prescriptive with rationale

Rules use imperative "MUST", "SHOULD", "PREFER" language (RFC 2119 style) with brief rationale. Example: "MUST use deterministic `sin`/`cos` from `deterministic-kernels.ts`, never `Math.sin`/`Math.cos` — native implementations are not bit-exact across platforms."

### D4: Reference vs Inline Content

Rules inline the minimum enforceable subset. For deep content (14 TSDoc templates, algebraic invariant tables), rules reference the Docusaurus page. This keeps rules under 200 lines while maintaining authoritative sources.

### D5: Existing Rules — Update in place, don't replace

The 3 existing rules are well-structured. Updates add missing sections without reorganizing existing content. This preserves familiarity for the author.

## Risks / Trade-offs

| Risk                                       | Mitigation                                                                                                    |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------- |
| Rules too long → Claude ignores them       | Enforce 200-line cap per file; path-scope to load only when relevant                                          |
| Rules become stale as code evolves         | Rules reference patterns ("suffix convention") not specific line numbers; periodic review via `/opsx:propose` |
| Over-prescription slows creative solutions | "MUST" only for correctness (determinism, layers, triality); "PREFER" for style                               |
| Path scoping misses new file creation      | Known Claude Code limitation; mitigated by CLAUDE.md quick-reference that always loads                        |
