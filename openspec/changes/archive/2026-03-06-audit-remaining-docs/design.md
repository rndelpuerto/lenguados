## Context

The audit cierre (findings/13-cierre.md) produced a prioritized list of documentation fixes. The code changes they reference have already been implemented (ANGLE_EPSILON removed, sqrt removed from deterministic, slerp removed from Rotation2, Transform2 freeze fixed). But the documentation still reflects the old state in several files.

These are purely documentation corrections — no code changes, no spec modifications.

## Goals / Non-Goals

**Goals:**

- Correct the architecture layer diagram to show deterministic/ at Level 1 (not Level 5)
- Fix the Claude Code rules file so dependency direction is unambiguous
- Remove all references to removed entities (ANGLE_EPSILON, deterministic/sqrt, Rotation2.slerp)

**Non-Goals:**

- Adding new documentation sections (building-block primitives, cascade impact docs — those are P2 items for a future change)
- Rewriting architecture docs from scratch
- Updating TSDoc @since/@category tags (separate effort)

## Decisions

### D1: Layer diagram fix approach

**Choice:** Fix the level numbering in core_principles.md to match the actual dependency DAG: types/constants(L0) → deterministic(L1) → scalar(L2) → angle/numeric(L3) → core(L4) → utils(L5).
**Why:** The ARCHITECTURE.md Mermaid diagram is already correct. The Spanish-language core_principles.md has the wrong numbering. Align it with reality.

### D2: Dependency arrows in math2d-patterns.md

**Choice:** Change to explicit "imports from" direction using `←` arrows, with a legend.
**Why:** The current `→` is ambiguous. Using `←` with "imports from" label makes the direction unambiguous. Matches the convention used in the audit findings.

### D3: Scope of sqrt removal from docs

**Choice:** Remove `sqrt` from lists of deterministic kernel functions, but keep mentions of `Math.sqrt` as IEEE 754 required operation.
**Why:** The distinction matters — `sqrt` is no longer a custom deterministic kernel, but `Math.sqrt` is still used and is deterministic by IEEE 754 standard.

## Risks / Trade-offs

- **[Minimal risk]** — All changes are documentation-only. No code behavior changes.
- **[core_principles.md is in Spanish]** — Edits must preserve the Spanish language of the document.
