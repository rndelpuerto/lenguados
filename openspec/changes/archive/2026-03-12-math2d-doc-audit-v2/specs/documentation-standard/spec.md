## UNCHANGED Requirements

All 20 requirements from `openspec/specs/documentation-standard/spec.md` remain unchanged. This change implements them — it does not modify them.

This includes the 4 audit verification requirements (synced from the failed audit's delta spec):

- Audit verification — no deprecated categories remain
- Audit verification — no prohibited tags remain
- Audit verification — triality invariants hold
- Audit verification — build and tests pass

Reference: `openspec/specs/documentation-standard/spec.md`
Standard: `packages/math2d/DOCUMENTATION_STANDARD.md`

## Implementation Constraints (additive to existing spec)

### Constraint: Documentation-only changes

All modifications SHALL be limited to JSDoc comment blocks. No function bodies, type signatures, import/export statements, class member ordering, or runtime code SHALL be modified.

#### Scenario: Diff verification

- **WHEN** a task is completed
- **THEN** `git diff HEAD` SHALL show changes ONLY within `/** ... */` comment blocks and `/* ... */` section divider comments
- **AND** no lines outside comment blocks SHALL be added, removed, or modified

### Constraint: @example preservation

All existing @example blocks SHALL be preserved exactly as-is. No @example content SHALL be deleted, modified, or moved.

#### Scenario: @example count verification

- **WHEN** a file is modified
- **THEN** the count of `@example` tags in the file SHALL be greater than or equal to the count before modification
- **AND** the only permitted change is ADDING new required @example blocks (e.g., on classes missing them)
