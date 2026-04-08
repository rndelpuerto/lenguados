## Context

Phase 1 (archived: `2026-03-09-math2d-documentation-standard`) produced a comprehensive DOCUMENTATION_STANDARD.md with 14 templates, canonical tag order, controlled @category vocabulary, and a formal OpenSpec spec with 16 requirements and 40+ testable scenarios.

A first audit attempt (archived: `2026-03-11-math2d-documentation-audit-failed`) failed catastrophically by:

1. Combining class member reordering with documentation fixes in single tasks
2. Agents dropping constructor bodies and private helper methods during reorder
3. A Python script for triality fixes corrupting JSDoc formatting (`*/public` on same line)
4. Destroying 106 @example blocks during member reordering
5. Insufficient verification between tasks

A fresh audit of HEAD (post-revert) found the following defect counts:

| Category                                        | Count  | Files Affected                                           |
| ----------------------------------------------- | ------ | -------------------------------------------------------- |
| Trailing periods on @param/@returns/@throws     | ~1,926 | All files                                                |
| Invalid @category values                        | ~105   | 14 files                                                 |
| Missing @since on static class constants        | ~57    | 6 core files                                             |
| @file path with `src/` prefix                   | 5      | utils/, validation/                                      |
| Missing class @remarks (Design/Numerics/Safety) | 6      | All core types except Vector2                            |
| Missing class @example                          | 4      | Complex, Rotation2, Interval, Transform2                 |
| Triality cross-link gaps                        | ~20    | arithmetic.ts, interpolation.ts, wrapping.ts, core types |
| Emoji preconditions instead of bold             | 5      | auxiliary files                                          |
| Tag order violations                            | ~15    | scattered                                                |
| Section divider width (78→80)                   | 2      | deterministic-kernels.ts, matrix3.ts                     |
| @internal with @category/@since                 | 2      | deterministic-kernels.ts                                 |
| Interface with @remarks/@example                | 1      | types/index.ts                                           |
| @category `Type Guards` instead of `Types`      | 7      | types/index.ts                                           |

## Goals / Non-Goals

**Goals:**

- Apply DOCUMENTATION_STANDARD.md to every source file with zero code changes
- Complete audit with zero test regressions
- Each task touches exactly ONE concern type in ONE file (or a small cohesive group)
- Produce verifiable, reviewable diffs that are pure documentation

**Non-Goals:**

- Class member reordering (DEFERRED to Phase 3 — too risky without tooling)
- ESLint rule configuration for automated enforcement (Phase 3)
- Changes to runtime behavior, public API, or type signatures
- Modifying DOCUMENTATION_STANDARD.md itself
- Adding new @example blocks where none exist on non-class symbols (only fix missing REQUIRED ones)

## Decisions

### D1: No class member reordering in this phase

**Decision:** Skip all member reordering tasks (Section 4 of the standard).
**Rationale:** The previous attempt proved that manually reordering class members across 7 files (each 1000-3000 lines) is extremely error-prone. Constructor bodies, private helpers, and @example blocks were destroyed. This risk is unacceptable for a library worth millions.
**Alternative considered:** Automated reordering via AST tooling — deferred to Phase 3 when proper tooling can be developed and tested.
**Trade-off:** Files will not match the standard's section ordering, but all OTHER documentation will be conformant.

### D2: One concern per task, one file per task

**Decision:** Each task addresses exactly ONE type of documentation defect in exactly ONE file.
**Rationale:** The failed audit combined multiple concerns (reorder + fix categories + add tags + fix triality) in single tasks, making it impossible to isolate and recover from errors.
**Exception:** Trailing period removal across a group of related files (e.g., all auxiliary/scalar/) may be grouped since it's a mechanical find-and-replace with zero ambiguity.

### D3: Fix order — safe changes first, then progressively riskier

**Decision:** Execute fixes in this order:

1. **Trailing periods** (mechanical, zero ambiguity, bulk of defects)
2. **@category replacements** (mechanical, lookup table)
3. **@since additions** (mechanical, add tag)
4. **@file path fixes** (mechanical, remove prefix)
5. **Tag order corrections** (requires reading and rearranging within JSDoc blocks)
6. **Triality cross-links** (requires understanding method relationships)
7. **Class documentation** (requires writing new content — @remarks, @example)
8. **@internal fixes** (small, targeted)
9. **Interface/divider/misc fixes** (small, targeted)
   **Rationale:** Front-loading mechanical changes reduces the defect count early and ensures the most numerous issues are fixed with minimal risk. Content-creation tasks (class @remarks, @example) come last as they require the most judgment.

### D4: Verification checkpoints

**Decision:** Run `npm run build && npm run test:unit` after completing each layer (deterministic, auxiliary, core, types, validation, utils).
**Rationale:** Catches any accidental code changes immediately. Documentation-only changes should never break build or tests — if they do, something went wrong.

### D5: Explicit guardrails in task descriptions

**Decision:** Every task SHALL include these constraints:

- "DOCUMENTATION ONLY — do NOT modify any code (function bodies, signatures, imports, exports)"
- "Do NOT reorder class members or move code blocks"
- "Do NOT add or remove functions/methods/properties"
- "Preserve ALL existing @example blocks unchanged"
  **Rationale:** The failed audit's agents interpreted tasks too broadly and made code changes. Explicit prohibition prevents this.

### D6: @category replacement lookup table

Exact replacements to use (no judgment needed):

| Current                      | Replacement               | Files                                                          |
| ---------------------------- | ------------------------- | -------------------------------------------------------------- |
| `Trigonometry`               | `Arithmetic`              | deterministic-kernels.ts                                       |
| `Deterministic`              | `Helpers`                 | deterministic-kernels.ts                                       |
| `Predicate`                  | `Comparison`              | complex.ts                                                     |
| `Serialization`              | `Conversion`              | complex.ts, rotation2.ts, interval.ts, transform2.ts, parse.ts |
| `Validation` (as @category)  | `Comparison`              | rotation2.ts, interval.ts, transform2.ts                       |
| `Core` (on static constants) | `Constant`                | complex.ts, rotation2.ts, interval.ts, transform2.ts           |
| `Type Guards`                | `Types`                   | types/index.ts                                                 |
| `Component`                  | `Accessor`                | transform2.ts                                                  |
| `Utility`                    | per-function assignment\* | random-source.ts, performance.ts                               |

*For `Utility` in random-source.ts: interface methods → `Accessor`, `setDefaultRandomSource`/`getDefaultRandomSource` → `Configuration`, class methods → `Accessor`/`Factory`.
*For `Utility` in performance.ts: `measureTime`/`measureAsync` → `Helpers`, `MeasurementCollector` methods → per-method assignment.

### D7: @since version for missing tags

**Decision:** Use `@since 0.7.0` for all missing @since tags on static class constants.
**Rationale:** These constants were introduced in the current enhancement branch. The exact version will be confirmed at release time, but 0.7.0 is the planned next version.

## Risks / Trade-offs

| Risk                                 | Mitigation                                                             |
| ------------------------------------ | ---------------------------------------------------------------------- |
| Agent modifies code instead of docs  | Explicit "DOCUMENTATION ONLY" guardrail in every task + diff review    |
| @example blocks accidentally deleted | Guardrail "Preserve ALL existing @example blocks" + count verification |
| Build/test regression                | Checkpoint after each layer                                            |
| Inconsistent @category assignment    | Lookup table in D6 — no judgment calls                                 |
| Missing edge cases in class @remarks | Use Vector2 (gold standard) as template, adapt per type                |
| Scope creep into member reordering   | Explicit non-goal + guardrail "Do NOT reorder class members"           |
| Large diff obscures problems         | One concern per task keeps diffs focused and reviewable                |
