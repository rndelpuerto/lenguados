## ADDED Requirements

### Requirement: Per-symbol-type required tag enforcement

A custom ESLint rule (`local/enforce-required-tags`) SHALL enforce that public symbols include `@category`, `@since`, and `@example` tags as specified by DOCUMENTATION_STANDARD.md Section 2.

The rule SHALL classify symbols by AST node type and apply the tag matrix:

| Symbol Type        | `@category` | `@since` | `@example` |
| ------------------ | ----------- | -------- | ---------- |
| Function           | REQ         | REQ      | REQ        |
| Triality Strict    | REQ         | REQ      | REQ        |
| Triality Safe      | REQ         | REQ      | REQ        |
| Triality Unchecked | REQ         | REQ      | NO         |
| Class              | REQ         | REQ      | REQ        |
| Interface          | REQ         | REQ      | NO         |
| Constant           | REQ         | REQ      | opt        |
| Factory            | REQ         | REQ      | REQ        |
| Instance Method    | REQ         | REQ      | opt        |
| @internal          | NO          | NO       | NO         |

**REQ** = warn if missing, **NO** = warn if present, **opt** = no enforcement.

#### Scenario: Public function missing @category

- **WHEN** an exported function lacks a `@category` tag
- **THEN** ESLint SHALL report a warning

#### Scenario: @internal with @category blocked

- **WHEN** a function marked `@internal` has a `@category` tag
- **THEN** ESLint SHALL report a warning that `@category` is prohibited on `@internal` symbols

#### Scenario: @internal with @since blocked

- **WHEN** a function marked `@internal` has a `@since` tag
- **THEN** ESLint SHALL report a warning that `@since` is prohibited on `@internal` symbols

#### Scenario: Triality Unchecked with @example blocked

- **WHEN** a static method with name ending in `Unchecked` has an `@example` tag
- **THEN** ESLint SHALL report a warning that `@example` is prohibited on Unchecked variants

#### Scenario: Interface with @example blocked

- **WHEN** an interface declaration has an `@example` tag
- **THEN** ESLint SHALL report a warning

#### Scenario: Compliant public function passes

- **WHEN** an exported function has `@category`, `@since`, and `@example` tags
- **THEN** ESLint SHALL not report any required-tag warnings

### Requirement: File-scoped category validation

The existing `enforce-category-vocabulary` rule SHALL be enhanced to validate that type-specific categories are only used in their designated files as defined in DOCUMENTATION_STANDARD.md Section 3.

| Category                | Valid Files               |
| ----------------------- | ------------------------- |
| `Matrix Operations`     | matrix2.ts, matrix3.ts    |
| `Set Operations`        | interval.ts               |
| `Column/Row`            | matrix2.ts, matrix3.ts    |
| `Transform Integration` | vector2.ts, transform2.ts |
| `Direction`             | vector2.ts                |
| `Geometry`              | vector2.ts                |
| `Constraint`            | vector2.ts                |

#### Scenario: Type-specific category in wrong file

- **WHEN** `@category Direction` appears in `matrix3.ts`
- **THEN** ESLint SHALL report a warning that `Direction` is only valid in vector2.ts

#### Scenario: Type-specific category in correct file

- **WHEN** `@category Matrix Operations` appears in `matrix2.ts`
- **THEN** ESLint SHALL not report any file-scope warnings

### Requirement: @see format enforcement

A custom ESLint rule (`local/enforce-see-format`) SHALL validate that `@see` tags follow the `{@link Target}` pattern, optionally followed by ` - description`.

#### Scenario: Plain text @see blocked

- **WHEN** a `@see` tag contains plain text without `{@link}`
- **THEN** ESLint SHALL report a warning

#### Scenario: Valid @see passes

- **WHEN** a `@see` tag contains `{@link Vector2.add} - Adds two vectors`
- **THEN** ESLint SHALL not report any `@see` format warnings

### Requirement: Tag fragment conventions

A custom ESLint rule (`local/enforce-tag-fragments`) SHALL enforce that `@param` and `@returns` descriptions are sentence fragments (no trailing period) and that `@param` uses dash separator format.

#### Scenario: Trailing period on @param blocked

- **WHEN** a `@param` description ends with a period (e.g., `@param x - The x coordinate.`)
- **THEN** ESLint SHALL report a warning

#### Scenario: Trailing period on @returns blocked

- **WHEN** a `@returns` description ends with a period (e.g., `@returns The computed value.`)
- **THEN** ESLint SHALL report a warning

#### Scenario: Missing dash in @param blocked

- **WHEN** a `@param` tag uses format `@param x The x coordinate` (no dash)
- **THEN** ESLint SHALL report a warning

#### Scenario: Correct fragment passes

- **WHEN** `@param x - The x coordinate` (no trailing period, dash present)
- **THEN** ESLint SHALL not report any fragment warnings

### Requirement: Clean lint baseline maintained

After all new rules are configured, `npx eslint packages/math2d/src/` SHALL exit with code 0 on the current codebase.

#### Scenario: Full lint pass

- **WHEN** `npx eslint packages/math2d/src/` is executed
- **THEN** the command SHALL exit with code 0
- **AND** no errors or warnings SHALL be reported for `packages/math2d/src/**/*.ts` files

## MODIFIED Limitations

The following items from the Phase 1 Limitations section are addressed by this change and SHALL be removed:

- ~~`@category` and `@since` presence is not required~~ → Addressed by `enforce-required-tags`
- ~~`@example` is not required/prohibited per symbol type~~ → Addressed by `enforce-required-tags`
- ~~`@internal` symbols are not prevented from having `@category`/`@since`~~ → Addressed by `enforce-required-tags`
- ~~Type-specific categories are not file-scoped~~ → Addressed by `enforce-category-vocabulary` enhancement
- ~~`@see` format is not validated~~ → Addressed by `enforce-see-format`
- ~~Trailing period prohibition is not enforced~~ → Addressed by `enforce-tag-fragments`
- ~~`@param` dash format is not enforced~~ → Addressed by `enforce-tag-fragments`

The following items remain as Limitations (not addressed by this change):

- `@throws` requirement for triality-strict / prohibition for triality-safe (deferred — requires deeper analysis of which functions throw)
- `@constant` requirement on exported constants (deferred — requires distinguishing const from readonly)
- `@see` cross-linking for triality variants (complex cross-file pattern, manual review)
- Imperative voice enforcement (requires NLP)
- LaTeX prohibition (extremely rare)
- Fine-grained member section ordering within static/instance groups
