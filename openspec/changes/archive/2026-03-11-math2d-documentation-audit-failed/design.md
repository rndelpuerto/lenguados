## Context

Phase 1 produced `packages/math2d/DOCUMENTATION_STANDARD.md` (the authoritative reference) and `openspec/specs/documentation-standard/spec.md` (16 formal requirements). The math2d codebase has 30+ source files across 6 layers, all containing documentation that predates the standard. This phase is a systematic, file-by-file audit and correction pass.

The reference documents are:

- `packages/math2d/DOCUMENTATION_STANDARD.md` — Templates, tag order, category vocabulary, section ordering
- `openspec/specs/documentation-standard/spec.md` — Testable requirements and scenarios
- `packages/math2d/ARCHITECTURE.md` — Layer structure, key patterns, naming conventions

## Goals / Non-Goals

**Goals:**

- Every source file in `packages/math2d/src/` conforms to DOCUMENTATION_STANDARD.md
- Zero deprecated `@category` values remain
- All triality sets have correct cross-links
- All core type files follow the standard section order
- Build and tests pass after all changes

**Non-Goals:**

- Modifying the standard (Phase 1, archived)
- Configuring ESLint enforcement (Phase 3, future)
- Changing runtime behavior, public API, or test files
- Rewriting documentation prose beyond what the standard requires

## Decisions

### D1: Execution Order — Bottom-Up by Layer

**Decision:** Apply fixes in dependency order: deterministic → auxiliary → core → types → validation → utils → index files → cross-cutting verification.

**Rationale:** Lower layers have simpler documentation (standalone functions, constants) and fewer changes. Fixing them first establishes working examples for the more complex core type files. Additionally, if any documentation references lower-layer symbols via `{@link}`, those targets will already be correct.

### D2: Core Type Reordering Strategy

**Decision:** Each core type file (vector2, complex, rotation2, matrix2, matrix3, transform2, interval) gets its own task. Reordering moves entire section blocks (divider + all methods in that section) without modifying method implementations.

**Rationale:** These files are 1000-4000+ lines. Isolating each as a separate task limits blast radius. The reordering is purely structural — cutting and pasting section blocks between dividers — so no logic changes occur.

**Risk:** Large diffs may cause merge conflicts with concurrent work. Mitigated by completing all reordering in a focused branch.

### D3: Documentation-Only Changes

**Decision:** This audit SHALL NOT modify any function signatures, implementations, import statements, or export statements. Only JSDoc comments and section dividers are touched.

**Rationale:** Keeps the change reviewable and guarantees no runtime regressions. The build/test verification step at the end confirms this.

**Exception:** Class member reordering necessarily moves code blocks (methods with their implementations), but no line within any method body is modified.

### D4: Verification Strategy

**Decision:** After all file-level tasks are complete, run cross-cutting verification:

1. Search for deprecated `@category` values
2. Search for `@group`, `@alpha`, `@beta` tags
3. Verify no `@example` on `*Unchecked` methods
4. Verify no `@throws` on `*Safe` methods
5. Verify all exported constants have `@constant`
6. `npm run build` + `npm run test:unit`

**Rationale:** Per-file tasks fix known issues; cross-cutting verification catches anything missed and confirms the global invariants from the spec.

## Risks / Trade-offs

- **[Large diffs on core types]** → Each file is a separate task; no logic changes; tests verify no regressions
- **[Merge conflicts with concurrent work]** → Complete in a focused branch; coordinate with any active feature work
- **[Missing edge cases]** → Cross-cutting verification step catches global invariants that per-file tasks might miss
- **[Tedious repetitive work]** → Parallelizable by layer; each task is mechanical and well-defined by the standard
