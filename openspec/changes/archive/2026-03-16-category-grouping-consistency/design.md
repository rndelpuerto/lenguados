## Context

Phase 2 ESLint doc enforcement added @category/@since tags to ~280 instance methods using the principle "instance @category = static @category". However, many static @category tags from the "Add partial enhancements" commit (ab49e33) were themselves incorrect per DOCUMENTATION_STANDARD.md Section 3. This propagated errors from static → instance.

DOCUMENTATION_STANDARD.md Section 3 provides an authoritative mapping of method names to categories, and Section 4 defines the canonical section ordering with explicit `@category` labels per section. Both are the single source of truth.

Current state (7 core files, ~383 @category tags total):

- **vector2.ts**: Mostly correct. floor/ceil/round correctly use Transform. Some getters missing Accessor tags.
- **matrix2.ts**: Systematic errors — floor/ceil/round tagged Arithmetic (should be Transform), transpose/inverse tagged Arithmetic (should be Matrix Operations), instance getters missing @category entirely.
- **matrix3.ts**: Same Arithmetic-vs-Transform error as matrix2. Additionally, Static Matrix Operations section has 4 incompatible categories mixed together.
- **rotation2.ts**: Most consistent file. Minor section naming issues.
- **complex.ts**: Mixed categories in comparison section. conjugate in wrong section.
- **interval.ts**: Set Operations mixed with Comparison.
- **transform2.ts**: Conversion section mixes Conversion with Mutator.

## Goals / Non-Goals

**Goals:**

- Every @category tag matches DOCUMENTATION_STANDARD.md Section 3 definitions
- Same conceptual operation uses same @category across all files (where the category is valid for that file)
- Section headers match or have clear affinity with @category tags within them
- Missing @category tags added (instance getters → Accessor, etc.)
- Zero ESLint warnings, zero test failures after changes

**Non-Goals:**

- Physical reordering of methods within files (risk of code loss, ESLint member-ordering violations)
- Adding new categories to the controlled vocabulary (unless absolutely necessary)
- Modifying functional code
- Changing method signatures or behavior

## Decisions

### D1: Category Assignment — DOCUMENTATION_STANDARD.md Section 3 Is Authoritative

The base category table in Section 3 defines which methods belong to which category:

| Category          | Typical Members (per standard)                                       |
| ----------------- | -------------------------------------------------------------------- |
| Arithmetic        | `add`, `subtract`, `multiply`, `divide`, `scale`, `negate`, `fma`    |
| Transform         | `normalize`, `rotate`, `project`, `reflect`, `floor`, `ceil`, `abs`  |
| Matrix Operations | `transpose`, `inverse`, `compose`, `decompose`                       |
| Constraint        | `clamp`, `clampMagnitude`, `limit`, `min`, `max` (vector2 only)      |
| Accessor          | `normalized`, `negated`, `flippedX`, `xx`, `xy` (instance getters)   |
| Conversion        | `toArray`, `toJSON`, `toString`, `clone` (instance), `toComplexLike` |
| Factory           | `fromValues`, `clone` (static), `copy`, `fromAngle`                  |

When in doubt, the standard's "Typical Members" column resolves ambiguity.

**Alternative considered**: Continue with "instance = static" principle from Phase 2. Rejected because the static tags themselves were wrong in many cases, and the standard is more authoritative than any single file's conventions.

### D2: floor/ceil/round/trunc/abs/sign → @category Transform (all files)

DOCUMENTATION_STANDARD Section 3 explicitly lists `floor`, `ceil`, `abs` under Transform ("Shape-preserving operations"). Vector2 already uses this correctly. Matrix2 and Matrix3 must change from Arithmetic → Transform.

Methods affected: `floor`, `ceil`, `round`, `trunc`, `abs`, `sign` — static and instance in matrix2.ts and matrix3.ts.

### D3: transpose/inverse/adjugate → @category Matrix Operations (matrix2, matrix3)

DOCUMENTATION_STANDARD Section 3 Type-Specific table explicitly lists `transpose`, `inverse`, `compose`, `decompose` under Matrix Operations. Currently tagged Arithmetic in both files.

Methods affected: `transpose`, `inverse`, `inverseSafe`, `inverseUnchecked`, `adjugate` — static and instance in matrix2.ts and matrix3.ts.

**Note**: `negate` stays as Arithmetic per the standard's base category table (explicitly listed).

### D4: min/max/clamp/clampScalar → @category Transform (matrix2, matrix3)

Constraint is file-scoped to vector2.ts only. In matrix/matrix3 files, these operations are closest to Transform ("shape-preserving" — values are constrained but structure is preserved). Currently tagged Arithmetic.

### D5: Instance getters → @category Accessor

DOCUMENTATION_STANDARD Section 4: "Instance Getters → @category Accessor (ALL accessors)".

Affected: matrix2 instance getters (transposed, inverted, negated, column0, column1, row0, row1, diagonal). Check all other files for similar missing tags.

### D6: clone() — Dual Category by Context

The standard lists `clone` under BOTH Factory and Conversion:

- Static `clone()` → @category Factory (creates new instance from input)
- Instance `clone()` → @category Conversion (converts `this` to independent copy)

This overrides the Phase 2 "instance = static" rule for this specific method. Instance clone() should be @category Conversion, consistent with Section 4's "Instance Conversion" section placement.

### D7: Section Headers — Rename to Match Categories, Don't Move Code

When a section header doesn't match the @category of methods within it:

1. Rename the ASCII banner header to match the category name
2. If a section contains methods with multiple categories, insert sub-headers to delineate groups
3. Do NOT physically move methods between sections

Example: "Static Numeric Transforms" → "Static Transforms" (matches @category Transform).

If a section must be split (e.g., matrix3 "Static Matrix Operations" has 4 categories), insert new ASCII banners at the boundary between category groups.

### D8: Computed vs Geometry/Direction Disambiguation

For methods like `dot`, `cross`, `magnitude`, `determinant`, `trace`:

- In vector2.ts: `dot`, `cross`, `magnitude` → @category Geometry (type-specific, per standard)
- In matrix2/matrix3.ts: `determinant`, `trace`, `frobeniusNorm` → @category Computed (base category)
- In rotation2/complex/interval: scalar-returning computations → @category Computed

The standard's base Computed category ("Pure computations returning scalars") is the default. Vector2-specific geometric measures use the type-specific Geometry category.

### D9: Verification Strategy

Each file will be processed by a dedicated agent with maximum rigor:

1. Read entire file before any changes
2. Catalog every method with current @category
3. Apply DOCUMENTATION_STANDARD mappings
4. Change @category tags (JSDoc comment edits only)
5. Rename section headers as needed
6. Re-read changed sections to verify no code was lost
7. Run ESLint on the specific file
8. Run tests for the specific file

After all files: full ESLint pass + full test suite.

## Risks / Trade-offs

**[Risk] Section headers diverge from physical grouping** → Mitigation: Headers are renamed to match categories, not the other way around. Methods stay in place.

**[Risk] TypeDoc navigation changes for users** → Mitigation: Changes align with the documented standard, so API docs become MORE consistent with published documentation. This is a correction, not a breaking change.

**[Risk] Code loss during comment edits** → Mitigation: Each file processed by dedicated agent with pre/post method count verification. Full test suite as final gate.

**[Risk] ESLint member-ordering violations from section splits** → Mitigation: No physical code movement. Only header comments and @category tags change. member-ordering checks code structure, not comments.

**Rollback**: Single `git revert` — all changes are JSDoc comments and ASCII banner headers.
