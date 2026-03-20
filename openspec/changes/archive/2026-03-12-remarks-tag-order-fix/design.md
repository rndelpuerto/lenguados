## Context

DOCUMENTATION_STANDARD.md defines a canonical tag order (R2) where `@remarks` precedes `@param`. This order is codified in TSDoc's official emitter (`TSDocEmitter.ts`) and demonstrated in all canonical examples. A mechanical scan found 336 JSDoc blocks across 23 files where `@remarks` appears after `@param`/`@returns`. The previous audit (math2d-doc-audit-v2) fixed 12 isolated tag order violations but did not perform an exhaustive REMARKS_AFTER_PARAM sweep.

All changes are documentation-only — no runtime code, type signatures, or exports are modified.

## Goals / Non-Goals

**Goals:**

- Achieve 100% compliance with R2 canonical tag order for `@remarks` placement across all source files
- Zero REMARKS_AFTER_PARAM violations remaining after completion
- Build and full test suite pass unchanged

**Non-Goals:**

- Modifying DOCUMENTATION_STANDARD.md or spec R2 (already correct)
- Addressing any other documentation issues beyond `@remarks` placement
- Changing runtime code, API surface, or test files
- Rewriting `@remarks` content (only moving its position within the JSDoc block)

## Decisions

### D1: Transformation pattern

**Decision:** For each violating block, extract the `@remarks` section (tag + all content lines until next tag or block end) and reinsert it immediately before the first `@param` tag (or `@returns` if no `@param` exists).

**Rationale:** This is the minimal mechanical transformation. The content of `@remarks` is never modified — only its position within the JSDoc block changes.

**Alternative considered:** Regex-based automated script. Rejected because JSDoc blocks have variable indentation, multi-line `@remarks` content, and edge cases (e.g., `@remarks` with code blocks containing `@` characters). Manual per-file editing with mechanical verification is safer for 336 changes across critical library code.

### D2: Execution order — bottom-up by layer

**Decision:** Process files bottom-up by architectural layer: auxiliary → deterministic → core → validation → utils.

**Rationale:** Matches the dependency hierarchy. Lower layers have fewer violations and serve as warm-up before tackling the large core files (vector2: 51, matrix2: 39, matrix3: 36).

### D3: Task granularity — one task per file

**Decision:** Each file is a separate task. Files with ≤5 violations are grouped by sublayer into batch tasks where appropriate.

**Rationale:** Isolates risk per file. If a file has an issue, only that file's task needs rework. Large files (core types with 20-50+ violations) deserve individual tasks.

### D4: Verification method

**Decision:** Use the proven Perl regex scanner after each file and a full sweep after all files.

```bash
perl -0777 -ne '...' file.ts  # per-file check: must return 0 lines
```

Final verification: full scan across all 23 files returns 0 violations + `npm run test:unit` passes.

**Rationale:** The Perl scanner was validated during the explore phase and produces zero false positives. It is the same tool that identified the 336 violations.

### D5: Code integrity proof

**Decision:** After all changes, strip JSDoc comments from both HEAD and working tree versions and diff — must produce zero differences (same method proven in math2d-doc-audit-v2).

**Rationale:** Provides irrefutable proof that no executable code was modified.

## Risks / Trade-offs

- **[Risk] Large diff volume (336 blocks)** → Mitigated by per-file verification scan and code integrity proof. Each block change is a simple reorder, not a content modification.
- **[Risk] Multi-line @remarks with embedded code blocks** → Mitigated by manual editing (not regex replacement) and per-file scan verification.
- **[Risk] Accidentally modifying @remarks content** → Mitigated by code integrity proof (strip-and-diff method) and the fact that only whitespace/position changes, not content.
