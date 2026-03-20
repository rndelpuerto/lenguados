## Why

The `@lenguados/math2d` package has a comprehensive DOCUMENTATION_STANDARD.md (produced in Phase 1) and a formal OpenSpec spec (`openspec/specs/documentation-standard/spec.md`) defining 16 requirements with 40+ testable scenarios. However, the source code does not yet conform to this standard. A thorough audit of all 27 source files against the standard reveals ~1,926 trailing period violations, ~105 invalid @category values, ~57 missing @since tags on static class constants, pervasive triality cross-link gaps, and class documentation missing required Design/Numerics/Safety sections.

A previous attempt at this audit (archived: `2026-03-11-math2d-documentation-audit-failed`) introduced defects by mixing class member reordering with documentation fixes in insufficiently granular tasks, destroying @example blocks and corrupting JSDoc formatting. This second attempt applies lessons learned: documentation-only changes (NO code reordering), one concern per task, and explicit verification steps.

## What Changes

- Fix ~1,926 trailing periods on @param/@returns/@throws across all source files
- Replace ~105 invalid @category values with controlled vocabulary entries
- Add ~57 missing @since tags on static class constants
- Fix @file path inconsistencies (remove `src/` prefix) in 5 files
- Add missing @remarks Design/Numerics/Safety sections on 6 core type classes
- Add missing @example blocks on 4+ core type classes
- Fix triality cross-links: add missing @see tags, replace emoji preconditions with bold **Precondition:** format, remove @example from *Unchecked methods, remove @throws from *Safe methods
- Fix section divider widths (78→80 char) in 2 files
- Fix canonical tag order violations in ~15 functions
- Add missing @constant {type} on 1-2 constants
- Remove @category/@since from @internal symbols where present
- Fix interface documentation (remove @remarks/@example from \*Like interfaces)

## Capabilities

### New Capabilities

_(none — this change applies an existing standard, does not define new capabilities)_

### Modified Capabilities

- `documentation-standard`: No requirement changes — the spec is correct. This change implements the existing requirements.

## Impact

- **Affected code**: Every `.ts` file in `packages/math2d/src/` (documentation-only changes, zero behavioral changes)
- **Affected layers**: All 6 layers (deterministic, auxiliary, core, types, validation, utils)
- **APIs**: No API changes — no function renames, no signature changes, no new/removed exports
- **Bundle size**: Zero impact (JSDoc comments are stripped during build)
- **Tests**: All existing tests must continue to pass unchanged
- **Risk mitigation**: Each task modifies ONE concern in ONE file. No class member reordering. Verification via `npm run build && npm run test:unit` after each group of related files.
