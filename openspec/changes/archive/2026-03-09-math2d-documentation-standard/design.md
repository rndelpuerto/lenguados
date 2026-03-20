## Context

The math2d package contains 30+ source files across 6 architectural layers (deterministic, auxiliary, core, types, validation, utils). Documentation has evolved organically, resulting in:

- **Inconsistent file headers**: Some use `@file` + `@module` + `@description` + `@remarks`; others only `@file` + `@description`
- **Uncontrolled @category proliferation**: 25+ unique values across core types with no shared vocabulary (e.g., "Geometry & Measures" in Vector2 vs "Computed Values" in Matrix2 for equivalent concepts)
- **Non-uniform section ordering**: Constructor placement ranges from line 143 (Rotation2) to line 2544 (Vector2); Instance Properties appear at the top in some files, at the bottom in others
- **Inconsistent triality cross-links**: Some strict variants `@see` both Safe and Unchecked; others `@see` neither
- **Missing mandatory tags**: Many instance methods lack `@category` and `@since`

An exhaustive 4-agent research phase audited all source files and cross-referenced findings with TSDoc spec (29 tags), major libraries (Three.js, Babylon.js, RxJS, gl-matrix), eslint-plugin-jsdoc (50+ rules), TypeDoc conventions, and industry style guides (Google TS, Microsoft Fluid Framework).

## Goals / Non-Goals

**Goals:**

- Define a single, authoritative documentation standard that covers every symbol type in the library
- Produce 14 concrete templates with exact tag order, required/optional markers, and code examples
- Establish a controlled @category vocabulary that maximizes reuse across files
- Define class member section ordering compatible with `@typescript-eslint/member-ordering` for future linter enforcement
- Ground every decision in external industry practice (not invented conventions)

**Non-Goals:**

- Modifying any source file (that's Phase 2)
- Configuring ESLint rules (that's Phase 3)
- Changing any public API, runtime behavior, or bundle output
- Defining documentation standards for test files or build scripts

## Decisions

### D1: Canonical Tag Order

**Decision:** Adopt the following fixed order for all TSDoc blocks:

```
Summary (no tag, first line)
@file                    ← file headers only
@module                  ← file headers only
@description             ← file headers only
@remarks
@param name - description
@returns description
@throws {ErrorType} condition
@defaultValue
@example
@see {@link Target} - description
@internal
@constant {type}
@category Name
@since X.Y.Z
@public
```

**Rationale:** This follows the TSDoc specification's recommended grouping (description tags → parameter tags → modifier tags) and matches the order used by Three.js, Babylon.js, and RxJS. The `@category` and `@since` tags are placed at the end as "metadata" tags — they describe the symbol's classification, not its behavior.

**Alternative considered:** Alphabetical tag order (rejected — scatters related tags like @param and @returns).

### D2: Class Member Section Order

**Decision:** All class files SHALL use this section order:

```
FILE HEADER (@file, @module, @description)

═══ Type Exports ═══                    (outside class)
═══ Helper Functions ═══                (outside class)

═══ Class: TypeName ═══

  ── Instance Properties ──             instance fields
  ── Static Constants (Immutable) ──    static readonly fields
  ── Constructor ──                     after all fields
  ── Private Helpers ──                 private static methods

  ── Static Factories ──                @category Factory
  ── Static Arithmetic ──               @category Arithmetic
  ── Static Computed ──                 @category Computed
  ── Static Transforms ──               @category Transform
  ── Static Interpolation ──            @category Interpolation
  ── Static Comparison ──               @category Comparison
  ── [Static Type-Specific] ──          @category (type-specific)

  ── Instance Getters ──                @category Accessor
  ── Instance Mutators ──               @category Mutator
  ── Instance Arithmetic ──             @category Arithmetic
  ── Instance Computed ──               @category Computed
  ── Instance Transforms ──             @category Transform
  ── Instance Interpolation ──          @category Interpolation
  ── Instance Comparison ──             @category Comparison
  ── [Instance Type-Specific] ──        @category (type-specific)
  ── Instance Conversion ──             @category Conversion
```

**Rationale:** Compatible with `@typescript-eslint/member-ordering` default configuration:

- Fields (instance + static) before constructor
- Constructor before all methods
- Static methods before instance methods
- Accessors (getters) grouped together before instance methods
- Public before protected before private

**Alternative considered:** Current Vector2 order (Instance Properties + Constructor at end) — rejected because it violates `member-ordering` defaults and would fail lint when Phase 3 activates the rule.

### D3: Controlled @category Vocabulary

**Decision:** Define two tiers of categories:

**Base categories** (reused across ALL core type files):

| @category     | Purpose                                 | Examples                                    |
| ------------- | --------------------------------------- | ------------------------------------------- |
| Constant      | Static readonly frozen instances        | `ZERO`, `IDENTITY`, `UNIT_X`                |
| Factory       | Static creation methods                 | `fromValues`, `clone`, `fromAngle`          |
| Arithmetic    | Add, subtract, multiply, divide, negate | `add`, `scale`, `negate`, `fma`             |
| Computed      | Pure computations returning scalars     | `dot`, `magnitude`, `determinant`, `angle`  |
| Transform     | Shape-preserving operations             | `normalize`, `rotate`, `project`, `reflect` |
| Interpolation | Blending between values                 | `lerp`, `slerp`, `smoothStep`               |
| Comparison    | Equality, ordering, predicates          | `equals`, `isZero`, `isUnit`, `isParallel`  |
| Mutator       | Instance set/copy/reset                 | `set`, `copy`, `zero`, `setX`               |
| Accessor      | Derived getters (readonly)              | `normalized`, `negated`, `flippedX`, `xx`   |
| Conversion    | Serialization and type conversion       | `toArray`, `toJSON`, `toString`, `clone`    |

**Type-specific categories** (only where the type has unique capabilities):

| @category             | Types               | Examples                            |
| --------------------- | ------------------- | ----------------------------------- |
| Matrix Operations     | Matrix2, Matrix3    | `transpose`, `inverse`, `compose`   |
| Set Operations        | Interval            | `union`, `intersection`, `contains` |
| Column/Row            | Matrix2, Matrix3    | `getColumn`, `setRow`               |
| Transform Integration | Vector2, Transform2 | `applyRotation2`, `applyMatrix3`    |
| Direction             | Vector2             | `direction`, `perpendicular`        |
| Geometry              | Vector2             | `distance`, `cross`                 |
| Constraint            | Vector2             | `clamp`, `clampMagnitude`, `limit`  |

**Auxiliary file categories** (one per file, matching file purpose):

- `Arithmetic`, `Comparison`, `Interpolation`, `Safety`, `Wrapping`, `Guards`, `Normalization`, `Conversion`
- Constants file uses sub-categories: `Tolerance`, `Angular`, `Mathematical`, `Numeric Limits`, `Collection`

**Rationale:** Maximizes homogeneity — 10 base categories cover ~85% of all symbols. Type-specific categories are added only for capabilities that don't fit any base category. This ensures TypeDoc navigation is consistent regardless of which type the user is browsing.

**Alternative considered:** Per-file free-form categories (current state) — rejected because it produces 25+ unique values with semantic overlap (e.g., "Geometry & Measures" vs "Computed Values" for the same concept).

### D4: Section Divider Format

**Decision:** Use visually consistent comment blocks:

- **File-level** (outside class): 80 characters total width

  ```
  /* ========================================================================== */
  /* Section Name                                                               */
  /* ========================================================================== */
  ```

- **Class-level** (inside class): 78 characters total width (indented 1 space)
  ```
   /* ======================================================================== */
   /* Section Name                                                             */
   /* ======================================================================== */
  ```

**Rationale:** Established convention already used in all core type files. The width difference accounts for class-level indentation while maintaining visual alignment.

### D5: Triality Cross-Linking Convention

**Decision:**

- **Strict** variant: `@see {@link fnSafe} - Returns fallback if condition` + `@see {@link fnUnchecked} - No validation`
- **Safe** variant: `@see {@link fn} - Throws for degenerate input`. NO `@throws`. NO link to Unchecked.
- **Unchecked** variant: `@see {@link fn} - Throws on invalid input` + `@see {@link fnSafe} - Returns fallback on invalid input`. NO `@example`.

**Rationale:** The strict variant is the primary entry point — users discover safe/unchecked from there. Safe needs only a link back to strict. Unchecked links both for completeness since it's the least obvious variant. Examples on unchecked are omitted because the caller guarantees preconditions (usage is always the same pattern).

### D6: File Header Convention

**Decision:** Every `.ts` file SHALL have:

```typescript
/**
 * @file layer/module/filename.ts        ← relative from src/
 * @module @lenguados/math2d/layer/module ← full NPM path
 * @description One-sentence purpose      ← no project name suffix
 *
 * @remarks                               ← optional, recommended for core types
 * Detailed context with **bold sections** and bullet points.
 */
```

**Rationale:** `@file` gives location context when viewing a single file. `@module` gives package context for TypeDoc. `@description` is the file's purpose — the project name is already in `@module` and should not be repeated. `@remarks` is mandatory for core type files (which need design context) and optional for simple auxiliary files.

### D7: Required vs Optional Tags

**Decision:**

| Tag         | Required on                                                               | Optional on                    | Never on                                               |
| ----------- | ------------------------------------------------------------------------- | ------------------------------ | ------------------------------------------------------ |
| `@category` | All public exports                                                        | —                              | @internal symbols                                      |
| `@since`    | All public exports                                                        | —                              | @internal symbols                                      |
| `@example`  | Public functions, factories, conversion constants                         | Classes, non-trivial constants | Interfaces, type aliases, @internal, trivial constants |
| `@remarks`  | Core type file headers, constants with justification, edge-case functions | Other functions, classes       | Simple getters, interfaces                             |
| `@throws`   | Every function that can throw                                             | —                              | Safe variants, getters                                 |
| `@constant` | Every exported constant                                                   | —                              | Non-constant exports                                   |
| `@internal` | Private helpers, kernel functions                                         | —                              | Public API                                             |

## Risks / Trade-offs

- **[Large diff in Phase 2]** → Mitigated by per-file atomic commits; no behavioral changes means safe to review structurally
- **[Category renaming breaks TypeDoc bookmarks]** → Acceptable: no external consumers depend on TypeDoc anchor URLs yet
- **[Section reordering in core types creates merge conflicts]** → Mitigate by completing Phase 2 in a single focused branch; coordinate with any concurrent feature work
- **[@typescript-eslint/member-ordering may not match exactly]** → The chosen order follows the rule's default `memberTypes` array; verified against the documented default configuration
