## Context

The modular architecture migration rewrote all TSDoc from scratch, assigning `@since 0.7.0` (or higher, now corrected) to every symbol — including those that existed in earlier releases under the same or a different name. The v0.6.0 release contained `Vector2` (class with ~150 public members), `Mat2` (class with ~90 public members), and a `scalar` module (14 exports, first introduced in v0.5.0). In the current codebase, these map to `core/vector2.ts`, `core/matrix2.ts`, and 4 files under `auxiliary/scalar/`.

The previous change (`fix-version-since-tags`, archived 2026-04-08) corrected 0.8.0/0.9.0 → 0.7.0 with bulk `replace_all`. This change requires **targeted, per-method edits** because within each file, some `@since 0.7.0` tags are correct (genuinely new) and some must change.

## Goals / Non-Goals

**Goals:**

- Every method, constant, or export that existed in v0.6.0 (Vector2, Matrix2) MUST have `@since 0.6.0`
- Every export that existed in v0.5.0 (scalar module) MUST have `@since 0.5.0`
- Renamed symbols inherit the version of their predecessor (the concept existed, only the name changed)
- Genuinely new 0.7.0 symbols MUST remain `@since 0.7.0` — not be accidentally downgraded
- API docs regenerated after all source edits

**Non-Goals:**

- Modifying any code, signatures, imports, or exports
- Auditing files that are entirely new in 0.7.0 (complex, interval, matrix3, rotation2, transform2, deterministic, types, validation, auxiliary/numeric, auxiliary/angle)
- Tracking where removed methods went (parse → utils, random → utils, etc.)

## Decisions

### D1: Targeted edits using method-name context, not bulk replace

**Decision:** Each `@since 0.7.0` tag is edited individually by locating the method's TSDoc block and changing only the `@since` line. No bulk `sed` or `replace_all`.

**Rationale:** Within `vector2.ts`, approximately 60% of `@since 0.7.0` tags are correct and must be preserved. A bulk replace would corrupt genuinely new methods. The implementer must read each method name and check it against the allowlists defined in this change.

**Alternative considered:** Replacing all to `0.6.0` and then re-tagging new methods to `0.7.0`. Rejected — more error-prone and touches more lines.

### D2: Explicit "DO NOT TOUCH" allowlists

**Decision:** The proposal defines explicit lists of genuinely new 0.7.0 methods for Vector2 and Matrix2. Any method NOT on the allowlist that currently has `@since 0.7.0` should be changed.

**Rationale:** It is safer to enumerate what is NEW (smaller list, well-defined) than to enumerate everything that is OLD (larger list, easy to miss one).

### D3: Renamed symbols get the predecessor's version

**Decision:** A method renamed in 0.7.0 (e.g., `length` → `magnitude`) gets `@since 0.6.0` because the concept and behavior existed in that release.

**Rationale:** `@since` tracks when a capability was introduced to consumers, not when the current name was assigned. The CHANGELOG documents the rename; the `@since` documents lineage.

### D4: Scalar exports get `@since 0.5.0`

**Decision:** The scalar module was introduced in v0.5.0 and unchanged in v0.6.0. All 13 inherited exports get `@since 0.5.0`.

**Rationale:** git history confirms scalar.ts was added in the v0.5.0 release commit with identical content to v0.6.0.

### D5: Implementation order — scalar first, then matrix2, then vector2

**Decision:** Implement in ascending file complexity: scalar (13 edits across 4 small files), matrix2 (~55 edits in 1 file), vector2 (~110+ edits in 1 file).

**Rationale:** Scalar is the simplest and validates the approach. Matrix2 is medium. Vector2 is the largest and benefits from lessons learned on the smaller files.

## Risks / Trade-offs

- **[Medium] Missed method in Vector2** → Mitigated by the explicit "DO NOT TOUCH" allowlist: any method not on the new-in-0.7.0 list should be changed. Post-edit grep verification confirms no stale tags remain on old methods.
- **[Low] Accidentally downgrading a new method** → Mitigated by verifying each method name against the allowlist before editing.
- **[None] Runtime risk** → Zero code changes. TSDoc comments are stripped by the build pipeline.
