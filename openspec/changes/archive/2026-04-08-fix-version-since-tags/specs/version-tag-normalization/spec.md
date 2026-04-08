## ADDED Requirements

### Requirement: Source TSDoc @since tags SHALL NOT reference versions > 0.7.0

Every `@since` tag in `packages/math2d/src/**/*.ts` that references a library version MUST use a version <= 0.7.0. Specifically, all occurrences of `@since 0.8.0` and `@since 0.9.0` SHALL be replaced with `@since 0.7.0`.

#### Scenario: @since 0.8.0 tag in source file

- **WHEN** a `.ts` file in `packages/math2d/src/` contains `@since 0.8.0`
- **THEN** the tag SHALL be changed to `@since 0.7.0`

#### Scenario: @since 0.9.0 tag in source file

- **WHEN** a `.ts` file in `packages/math2d/src/` contains `@since 0.9.0`
- **THEN** the tag SHALL be changed to `@since 0.7.0`

#### Scenario: Existing @since 0.6.0 or earlier tags are preserved

- **WHEN** a `.ts` file contains `@since 0.5.0` or `@since 0.6.0`
- **THEN** the tag SHALL remain unchanged

#### Scenario: Post-fix verification

- **WHEN** all replacements are complete
- **THEN** `grep -r "@since 0\.[89]" packages/math2d/src/` SHALL return zero matches

### Requirement: Deprecation notices SHALL NOT reference versions > 0.7.0

Any `@deprecated` tag in source files that references a library version > 0.7.0 MUST be corrected. Speculative future removal version targets (e.g., "Will be removed in 1.0.0") SHALL be removed.

#### Scenario: Vector2.sumComponents static deprecation notice

- **WHEN** `packages/math2d/src/core/vector2.ts` contains `@deprecated Since 0.8.0. This method has no standard geometric meaning. Will be removed in 1.0.0.`
- **THEN** the tag SHALL be changed to `@deprecated Since 0.7.0. This method has no standard geometric meaning.`

#### Scenario: Vector2.sumComponents instance deprecation notice

- **WHEN** `packages/math2d/src/core/vector2.ts` contains the same `@deprecated` pattern on the instance method
- **THEN** the tag SHALL be changed identically to the static method fix

#### Scenario: No remaining > 0.7.0 references in deprecation text

- **WHEN** all fixes are applied
- **THEN** `grep -r "removed in [1-9]" packages/math2d/src/` SHALL return zero matches
- **AND** `grep -r "Since 0\.[89]" packages/math2d/src/` SHALL return zero matches

### Requirement: OpenSpec archive files SHALL reflect actual library versions

Version references to the library in OpenSpec archive files MUST use actual released or planned versions (<= 0.7.0), not placeholder versions.

#### Scenario: Archive design doc referencing placeholder 0.8.0

- **WHEN** `openspec/changes/archive/2026-03-12-math2d-doc-audit-v2/design.md` contains `@since 0.8.0` as the planned version
- **THEN** the reference SHALL be updated to `@since 0.7.0`

#### Scenario: Archive tasks doc referencing placeholder 0.8.0

- **WHEN** `openspec/changes/archive/2026-03-12-math2d-doc-audit-v2/tasks.md` contains `Add @since 0.8.0`
- **THEN** the reference SHALL be updated to `@since 0.7.0`

#### Scenario: Archive verdict referencing 0.8.0 and 1.0.0

- **WHEN** `openspec/changes/archive/2026-04-07-math2d-deep-audit/verdicts/vector2-rotation2-verdict.md` references `since 0.8.0; will be removed in 1.0.0`
- **THEN** the reference SHALL be updated to `since 0.7.0` with the speculative removal target removed

#### Scenario: Archive verdict referencing 0.9.0

- **WHEN** an archive file references `added in 0.9.0`
- **THEN** the reference SHALL be updated to `added in 0.7.0`

#### Scenario: Archive design doc referencing speculative v1.0.0

- **WHEN** `openspec/changes/archive/2026-04-07-math2d-deep-audit/design.md` mentions `v1.0.0` as a specific removal target
- **THEN** the version-specific reference SHALL be generalized (e.g., "a future major version")

### Requirement: Generated API docs SHALL be regenerated after source fixes

The auto-generated TypeDoc output in `docs/docs/api/` SHALL be regenerated from corrected source to propagate version fixes. Manual editing of generated files is prohibited.

#### Scenario: API docs reflect corrected @since tags

- **WHEN** all source TSDoc `@since` tags have been corrected
- **AND** TypeDoc generation is executed
- **THEN** all generated `.md` files in `docs/docs/api/` SHALL show `0.7.0` where they previously showed `0.8.0` or `0.9.0`
