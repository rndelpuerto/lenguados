## Why

The `.claude/rules/` directory currently has 3 rule files covering API patterns, testing naming, and documentation placement. However, exhaustive line-by-line analysis of the codebase reveals **12 major convention gaps** where institutional knowledge lives only in Docusaurus deep-dives or is implicit in code patterns — invisible to Claude during development. This causes repeated mistakes (wrong tag order, stale API references, missing triality variants, wrong deterministic imports) and slows down development with correction cycles.

Creating comprehensive, path-scoped rules derived directly from the actual code and cross-validated against external standards (gl-matrix, three.js, TSDoc spec, fast-check docs) will eliminate these recurring issues.

## What Changes

- **Create 5 new rule files** in `.claude/rules/` covering: TSDoc/class-member conventions, code architecture and layers, build/export system, testing deep patterns, and code style enforcement
- **Update 3 existing rule files** (`math2d-patterns.md`, `testing-conventions.md`, `documentation-conventions.md`) to fill identified gaps and remove contradictions
- **Update `CLAUDE.md`** to reference all new rules and add missing quick-reference conventions
- **Update `implement-math-type` skill** to reference new rules for TSDoc, triality, and testing requirements

## Capabilities

### New Capabilities

- `claude-rules-tsdoc`: TSDoc tag order, `@category` vocabulary, class member ordering, triality cross-linking, text conventions — extracted from the 750-line TSDoc standard and verified against actual code
- `claude-rules-architecture`: Layer dependency enforcement, determinism rules (fdlibm vs IEEE 754 safe functions), DCE policy, validation tiers, design philosophy (POA, intentional SOLID violations, loop unrolling) — derived from architecture docs and source code analysis
- `claude-rules-build-system`: Package.json exports pattern, entry point conventions, Rollup build flags, conditional exports (dev/prod), `sideEffects: false`, module-internals.json — derived from rollup.config.mjs and package.json analysis
- `claude-rules-testing-deep`: Property-based testing requirements, algebraic invariant categories, tolerance constants and their values, angular equality rules, dangerous-path testing (Unchecked → NaN not throw), custom arbitrary patterns — derived from test/ analysis and fast-check best practices
- `claude-rules-code-style`: Prettier config (tabWidth=1, singleQuote, printWidth=100), ESLint flat config key rules, member ordering enforcement, import ordering, filename conventions (kebab-case), commit message format — derived from config files

### Modified Capabilities

- `documentation-standard`: Adding edge case documentation requirements, interoperability pattern rules, and type escalation documentation needs
- `api-conventions`: Adding allocation control patterns (`ensureOut`, `Object.freeze`, `*Like` input/concrete output), `apply` vs `transform` distinction with examples, and `*CS` variant documentation requirements

## Impact

- **Affected code**: `.claude/rules/*.md` (3 updated + 5 new), `.claude/skills/implement-math-type.md`, `CLAUDE.md`
- **No source code changes** — this is purely AI guidance infrastructure
- **No API changes** — rules document existing patterns, they don't create new ones
- **Risk**: Overly prescriptive rules could slow development. Mitigation: rules use "prefer" language for style, "must" only for correctness-critical conventions (determinism, layer deps, triality)
- **Bundle size**: Zero impact (rules are not shipped)
- **Deterministic guarantees**: Unaffected (rules document, not modify, the deterministic pipeline)
