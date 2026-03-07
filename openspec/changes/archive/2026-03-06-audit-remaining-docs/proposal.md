## Why

The math2d audit cierre (section 13.6) identified documentation that contradicts the implemented code. Two implementation phases have since changed the codebase (removed sqrt from deterministic, removed ANGLE_EPSILON, removed Rotation2.slerp, etc.), but several docs still reference the old state. These stale references mislead contributors and Claude Code rules.

## What Changes

### P0 — Critical doc fixes

- Fix layer diagram in `packages/math2d/docs/architecture/core_principles.md` — deterministic/ is shown at Level 5 (top) but should be Level 1 (base)
- Fix dependency arrows in `.claude/rules/math2d-patterns.md` — arrow direction is ambiguous/incorrect

### P1 — Stale reference cleanup

- Remove `ANGLE_EPSILON = 1e-12` from `CLAUDE.md` line 87 (constant was removed)
- Remove `sqrt` from deterministic kernel lists in `CONTRIBUTING.md` (lines 12, 41) and `core_principles.md` (line 145)
- Fix `Rotation2.slerp` → `Rotation2.lerp` in `docs/research/decisions_and_benchmarks.md` (line 31-34)

## Capabilities

### New Capabilities

_(none — documentation-only changes, no new capabilities)_

### Modified Capabilities

_(none — no spec-level behavior changes, only documentation corrections)_

## Impact

- **Files affected**: 4 documentation files + 1 Claude Code rules file
- **Code impact**: Zero — no source code changes
- **Contributor impact**: Corrects misleading architecture diagram and stale API references that could cause contributors to use removed APIs
- **Claude Code impact**: Fixes `.claude/rules/math2d-patterns.md` so AI-assisted development follows correct conventions
