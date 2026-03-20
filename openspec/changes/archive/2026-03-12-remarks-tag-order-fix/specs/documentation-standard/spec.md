## UNCHANGED Requirements

All requirements from `openspec/specs/documentation-standard/spec.md` remain unchanged. This change implements full compliance with existing Requirement R2 (Canonical tag order) — it does not modify any requirements.

Reference: `openspec/specs/documentation-standard/spec.md`
Standard: `packages/math2d/DOCUMENTATION_STANDARD.md`

## Implementation Constraints (additive to existing spec)

### Constraint: Documentation-only changes

All modifications SHALL be limited to reordering tags within JSDoc comment blocks. No `@remarks` content SHALL be modified — only its position within the block. No function bodies, type signatures, import/export statements, or runtime code SHALL be modified.

#### Scenario: Content preservation

- **WHEN** a `@remarks` section is moved within a JSDoc block
- **THEN** the text content of the `@remarks` section SHALL be identical before and after the move
- **AND** no other tags or content in the block SHALL be added, removed, or modified

#### Scenario: Code integrity verification

- **WHEN** all file modifications are complete
- **THEN** stripping all JSDoc comments (`/** ... */`) from both HEAD and working tree versions of each modified file SHALL produce identical output
- **AND** `diff -rq` between the stripped versions SHALL return zero differences

### Constraint: Zero remaining violations

After all changes, a mechanical scan for REMARKS_AFTER_PARAM violations SHALL return zero results across all `.ts` files in `packages/math2d/src/`.

#### Scenario: Full compliance scan

- **WHEN** the Perl tag order scanner runs against all source files
- **THEN** zero instances of `@remarks` appearing after `@param` or `@returns` SHALL be found
- **AND** the total violation count SHALL be 0 (down from 336)

### Constraint: Test suite passes

The full test suite SHALL pass with zero regressions after all changes.

#### Scenario: Test verification

- **WHEN** `npm run test:unit` is executed from the repository root
- **THEN** all tests SHALL pass (3225/3225 expected)
- **AND** zero test failures or errors SHALL be introduced
