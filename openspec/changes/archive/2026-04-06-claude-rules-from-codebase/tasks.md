## 1. New Rule Files

- [x] 1.1 Create `.claude/rules/tsdoc-conventions.md` — canonical tag order, `@category` vocabulary, class member section ordering, triality cross-linking, text conventions (imperative voice, no trailing periods). Path scope: `packages/math2d/src/**/*.ts`. Reference TSDoc standard for full templates.
- [x] 1.2 Create `.claude/rules/architecture-and-layers.md` — layer dependency graph with exact import rules, deterministic function classification (fdlibm vs IEEE 754 safe), two-layer validation (assertions + safe functions), DCE policy, design philosophy (POA, no `extends` on core types, intentional loop unrolling), constructor purity. Path scope: `packages/math2d/src/**`.
- [x] 1.3 Create `.claude/rules/build-and-exports.md` — package.json exports pattern (`types` before `default`), 3-file entry point convention, module-internals.json, build output structure (`lib/cjs/`, `lib/esm/`, `lib/@types/`), `sideEffects: false`. Path scope: `**/package.json`, `**/rollup.config.*`, `scripts/**`.
- [x] 1.4 Create `.claude/rules/testing-deep-patterns.md` — property-based testing with fast-check (algebraic invariants), custom arbitraries in `test/arbitraries.ts`, tolerance constants (DIGITS=10 → EPSILON=1e-10, TEST_TOLERANCE=1e-6), angular equality via `angleDifference()`, dangerous-path testing (Unchecked → NaN not throw), `expectVecClose` helpers. Path scope: `packages/math2d/test/**`.
- [x] 1.5 Create `.claude/rules/code-style.md` — Prettier config (tabWidth=1, singleQuote, printWidth=100, trailingComma=all), import ordering (type imports separate, alphabetical, layer order), kebab-case filenames, no default exports, ESLint member ordering, conventional commits with `(math2d)` scope. Path scope: `**/*.ts`.

## 2. Update Existing Rule Files

- [x] 2.1 Update `.claude/rules/math2d-patterns.md` — add allocation control patterns (`ensureOut()`, `Object.freeze` for constants, `freezeXxx()` helpers), `apply` vs `transform` distinction with examples, `Readonly*Like` input / concrete output rule, instance method chaining contract (mutate `this`, return `this`).
- [x] 2.2 Update `.claude/rules/testing-conventions.md` — add cross-reference to `testing-deep-patterns.md` for math-specific patterns, clarify that `*.property.node.spec.ts` and `*.boundary.node.spec.ts` file types exist, add import convention (`@jest/globals` for test functions).
- [x] 2.3 Update `.claude/rules/documentation-conventions.md` — add edge case documentation requirements (failure modes, IEEE 754 behavior, safe variant reference), interoperability documentation (type escalation, rotation drift), stale API reference warning (verify method names exist before documenting).

## 3. Update CLAUDE.md and Skill

- [x] 3.1 Update `CLAUDE.md` — add all 5 new rule files to the Rules list with brief descriptions, verify existing rule descriptions are accurate.
- [x] 3.2 Update `.claude/skills/implement-math-type.md` — add references to `tsdoc-conventions.md` (for TSDoc requirements), `architecture-and-layers.md` (for layer placement), `testing-deep-patterns.md` (for property-based testing), and `math2d-patterns.md` (for allocation and triality patterns).

## 4. Verification

- [x] 4.1 Verify all rule files are under 200 lines (Claude Code best practice for adherence).
- [x] 4.2 Verify path scoping: confirm each rule's `paths:` frontmatter matches intended file scope and doesn't overlap unnecessarily with other rules.
- [x] 4.3 Cross-check rules against actual code: verify at least 3 conventions per rule file match the current codebase (not stale documentation). Fixed: class member ordering in tsdoc-conventions.md updated to match actual ESLint config and Vector2.ts pattern.
