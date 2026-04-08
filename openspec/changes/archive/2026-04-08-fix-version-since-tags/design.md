## Context

The `enhancement/lenguados` branch introduced 5 new core types (Rotation2, Complex, Interval, Matrix3, Transform2), a deterministic math kernel layer, auxiliary utilities, and a validation layer — all destined for the v0.7.0 release. During development, `@since` tags were assigned speculatively as `0.8.0` (97 occurrences) and `0.9.0` (52 occurrences), anticipating a phased release that never materialized. Two `@deprecated` notices on `Vector2.sumComponents` also reference `0.8.0` and a speculative removal target of `1.0.0`. Additionally, 3 OpenSpec archive files record these placeholder versions in historical design decisions.

The generated API documentation (`docs/docs/api/`) is produced by TypeDoc from source TSDoc. It inherits all version errors from source — fixing source and regenerating is the correct path.

## Goals / Non-Goals

**Goals:**

- Every `@since` tag referencing a version > 0.7.0 MUST be corrected to `0.7.0`
- Every `@deprecated` notice referencing versions > 0.7.0 MUST be corrected
- OpenSpec archive files referencing placeholder library versions MUST be updated
- Generated API docs MUST be regenerated after source fixes
- Existing `@since` tags for v0.6.0 and earlier MUST remain untouched

**Non-Goals:**

- Adding missing `@since` tags to symbols that lack them entirely (separate concern)
- Auditing `@since` accuracy for v0.6.0 and earlier symbols
- Changing any runtime behavior, tests, or APIs
- Editing generated API docs manually (regeneration handles this)

## Decisions

### D1: Uniform `0.7.0` for all post-0.6.0 additions

**Decision:** All `@since 0.8.0` and `@since 0.9.0` become `@since 0.7.0`.

**Rationale:** There is no v0.8.0 or v0.9.0 release. Everything introduced after v0.6.0 ships together in v0.7.0. Differentiating between "0.8.0" and "0.9.0" was an internal development signal with no consumer meaning.

**Alternative considered:** Preserving the 0.8.0/0.9.0 distinction as 0.7.0/0.7.1. Rejected — the additions are all part of one unreleased body of work with no intermediate cut point.

### D2: Remove speculative removal version from deprecation notices

**Decision:** Change `Will be removed in 1.0.0.` to remove the specific version target. The deprecation notice retains the since-version and reason.

**Rationale:** Committing to a removal version in published docs creates a binding promise. The removal timeline is undecided; the deprecation notice communicates intent without a deadline.

### D3: Bulk find-and-replace strategy

**Decision:** Use `replace_all` operations per file — `@since 0.8.0` → `@since 0.7.0` and `@since 0.9.0` → `@since 0.7.0`. The two `@deprecated` lines require targeted edits.

**Rationale:** The replacement is mechanical and unambiguous. Every instance of `@since 0.8.0` and `@since 0.9.0` in the source refers to the library version (confirmed by audit). No false positives exist in the 14 affected `.ts` files.

### D4: OpenSpec archives receive corrections

**Decision:** Update version references in 3 archive files to reflect the actual version (0.7.0).

**Rationale:** Archives are referenced by future audits and changes. Leaving incorrect version numbers creates confusion about what actually shipped when.

### D5: API docs regenerated, not manually edited

**Decision:** After source fixes, run `npm run build` followed by the TypeDoc generation step to propagate changes to `docs/docs/api/`.

**Rationale:** Manual editing of generated files is fragile and incomplete. The ~150+ occurrences in generated docs are a downstream consequence of source tags.

## Risks / Trade-offs

- **[Low] Incomplete coverage** → Mitigated by grep verification after all edits: `grep -r "0\.[89]\.\d" packages/math2d/src/` should return zero results.
- **[Low] Archive edits break historical context** → The archives document decisions, not immutable history. Correcting version numbers improves their utility without altering the decisions they record.
- **[None] Runtime risk** → Zero code changes. TSDoc comments are stripped by the build pipeline.
