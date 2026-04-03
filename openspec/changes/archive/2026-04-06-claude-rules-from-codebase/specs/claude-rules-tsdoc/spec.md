## ADDED Requirements

### Requirement: TSDoc tag order enforcement

Rule file `.claude/rules/tsdoc-conventions.md` MUST specify the canonical tag order derived from ESLint `jsdoc/sort-tags` config and the TSDoc standard document.

#### Scenario: Claude adds TSDoc to a new method

- **WHEN** Claude writes or modifies a TSDoc block in `packages/math2d/src/**/*.ts`
- **THEN** tags appear in this order: `@file`, `@module`, `@description`, `@remarks`, `@template`, `@param`, `@returns`, `@throws`, `@defaultValue`, `@example`, `@see`, `@internal`, `@constant`, `@category`, `@since`, `@public`

### Requirement: Controlled @category vocabulary

The rule MUST list the valid `@category` values extracted from ESLint `enforce-category-vocabulary` and TSDoc standard.

#### Scenario: Claude assigns a category to a new function

- **WHEN** Claude writes `@category` in a TSDoc block
- **THEN** the value is one of the approved vocabulary: `Constant`, `Factory`, `Arithmetic`, `Computed`, `Transform`, `Interpolation`, `Comparison`, `Mutator`, `Accessor`, `Conversion`, `Normalization`, `Configuration`, `Safety`, `Helpers`, `Types`, `Core`, `Assertion` (plus type-specific categories)

### Requirement: Class member section ordering

The rule MUST specify the 10-section ordering for class members, matching the TSDoc standard section 4.

#### Scenario: Claude adds a new method to Vector2

- **WHEN** Claude adds a method to a core class
- **THEN** the method is placed in the correct section: (1) Instance Properties, (2) Static Constants, (3) Constructor, (4) Private Helpers, (5) Static Factories, (6) Static Arithmetic/Transform/etc, (7) Static Comparison, (8) Instance Mutators, (9) Instance Accessors, (10) Instance Conversion

### Requirement: Triality cross-linking documentation

The rule MUST specify cross-linking requirements for strict/safe/unchecked variants.

#### Scenario: Claude creates a new `divideSafe()` method

- **WHEN** Claude writes TSDoc for a `*Safe` variant
- **THEN** the `@see` tag links to the strict variant and the `*Unchecked` variant
- **WHEN** Claude writes TSDoc for the strict variant
- **THEN** the `@see` tag links to both `*Safe` and `*Unchecked` variants

### Requirement: Text conventions

The rule MUST specify: imperative voice for summaries, sentence fragments (no trailing period on single-line descriptions), Unicode symbols permitted, LaTeX prohibited.

#### Scenario: Claude writes a summary line

- **WHEN** Claude writes the first line of a TSDoc block
- **THEN** it uses imperative voice (e.g., "Compute the dot product" not "Computes the dot product" or "This method computes...")

### Requirement: Path scoping

The rule file MUST use `paths: ['packages/math2d/src/**/*.ts']` frontmatter to load only for source files, not test files.

#### Scenario: Claude edits a test file

- **WHEN** Claude reads `packages/math2d/test/core/vector2.node.spec.ts`
- **THEN** the TSDoc rule is NOT loaded (tests don't require full TSDoc compliance)
