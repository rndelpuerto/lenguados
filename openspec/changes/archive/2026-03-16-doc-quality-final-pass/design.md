## Context

An exhaustive 7-agent parallel audit of all core type files in `@lenguados/math2d` revealed documentation content quality gaps after Phase 2 (eslint-doc-enforcement) and Phase 3 (category-grouping-consistency) completed structural coverage. Coverage metrics are excellent (~100% `@category`/`@since`), but content accuracy, cross-linking, and example coverage have gaps that prevent the documentation from meeting its own stated standard (DOCUMENTATION_STANDARD.md).

**Critical lesson from prior disaster (2026-03-11-math2d-documentation-audit-failed):** Combining member reordering with documentation fixes destroyed 106 `@example` blocks and dropped constructor bodies. The recovery design (math2d-doc-audit-v2 D1) explicitly states: _"No class member reordering in this phase... Manual reordering across 7 files (each 1000-3000 lines) is extremely error-prone."_

All changes in this phase are **documentation-only**: JSDoc comments and ASCII section headers. Zero functional code changes.

## Goals / Non-Goals

**Goals:**

- Fix all 7 CRITICAL factual errors and missing required documentation
- Resolve all HIGH category/section inconsistencies backed by the standard
- Resolve the Geometry vs Computed contradiction (DR1)
- Add all missing `@see` cross-links on triality methods (REQ per standard)
- Add all missing `@example` blocks on Factory and Triality Strict/Safe methods (REQ per standard)
- Fix ~12 MEDIUM content accuracy issues
- Fix ~7 LOW style/formatting issues
- Maintain 3225/3225 tests passing, zero ESLint errors on source

**Non-Goals:**

- Moving methods between sections (risk of code loss — per prior disaster lesson)
- Adding `@example` to instance methods (opt per Table 1 — not required)
- Adding `@example` to static methods not classified as Factory or Triality (opt per Table 1)
- Modifying ESLint rules or adding new rules
- Constructor JSDoc beyond minimal `@param` tags (no template exists in standard)
- Changing any functional code, method signatures, or exports

## Decisions

### D1: Geometry vs Computed for `dot`/`cross`/`magnitude` in vector2.ts — Amend DOCUMENTATION_STANDARD

**Problem:** DOCUMENTATION_STANDARD L452 lists `dot`, `cross`, `magnitude` as typical Computed members. Design D8 (category-grouping-consistency) assigned them Geometry in vector2.ts. D1 of that same change says "standard is authoritative." This is a contradiction.

**Decision:** Amend DOCUMENTATION_STANDARD.md Section 3 to move `dot`, `cross`, `magnitude` from the Computed typical members to the Geometry typical members, AND add `angle` to the Geometry typical members for vector2.ts. Leave `determinant`, `trace` in Computed (these are matrix-specific).

**Rationale:**

- In vector2.ts, `dot`, `cross`, `magnitude` are geometric measures of vectors — they compute geometric properties (projections, areas, lengths). They belong with `distance`, `distanceSquared`, `manhattanDistance` which are also geometric measures.
- The distinction is: `Geometry` = "measures of geometric objects" (vector2-specific), `Computed` = "algebraic properties of matrices/types" (base, all files).
- Keeping `dot`/`cross`/`magnitude` in the same section as `distance`/`distanceSquared`/`manhattanDistance` in vector2.ts is correct because they are all scalar-returning geometric computations on vectors.
- For other files (matrix2, matrix3, complex, rotation2, interval), `Computed` remains correct for scalar-returning computations (`determinant`, `trace`, `angle`, `magnitude`, etc.) since Geometry is file-scoped to vector2.ts.
- The standard's L452 Computed row will be updated to: `determinant`, `trace`, `frobeniusNorm`, `angle` (removing the vector-specific entries)
- The standard's L471 Geometry row will be updated to: `dot`, `cross`, `magnitude`, `distance`, `distanceSquared`, `manhattanDistance`

**Alternative rejected:** Change vector2.ts to use Computed for `dot`/`cross`/`magnitude`. Rejected because this would split related geometric computations across two categories in the same file (Geometry for distance, Computed for dot/cross), which is confusing and less navigable.

### D2: Static `determinant`/`trace` in matrix files — Change to Computed

**Problem:** Static `determinant` and `trace` in matrix2.ts and matrix3.ts use `@category Matrix Operations`. Instance versions correctly use `@category Computed`. Standard L452 explicitly lists `determinant`, `trace` as Computed members.

**Decision:** Change static `determinant` and `trace` from `@category Matrix Operations` to `@category Computed` in both matrix2.ts and matrix3.ts. This restores consistency between static and instance versions, and matches the standard.

**Rationale:** `determinant` and `trace` are scalar-returning pure computations, not structural matrix operations (transpose, inverse, compose, decompose). The standard explicitly classifies them as Computed. The Matrix Operations category is for operations that transform or decompose the matrix structure.

### D3: Sub-header strategy for misplaced methods — Insert delineation comments

**Problem:** Several methods are placed in sections whose header doesn't match their `@category`. Per D7 of category-grouping-consistency: "Rename the ASCII banner header, don't physically move methods."

**Decision:** When a section contains methods with 2+ categories and renaming the header alone won't resolve it, insert lightweight dashed sub-headers to delineate groups. Format:

```
  /* ------ Transform ------ */
```

This follows the strategy from the `eslint-doc-enforcement` spec L191-193: "the section SHALL be split by inserting sub-headers at category boundaries, without physically moving code."

**Cases:**

- transform2.ts "Instance Computed": contains Comparison methods → rename header to "Instance Computed & Comparison" or insert sub-header
- transform2.ts "Instance Conversion (Matrix)": contains a Mutator (`setFromMatrix3`) → insert sub-header
- matrix2.ts "Instance Conversion": contains `trunc()` (Transform) → insert sub-header
- interval.ts "Instance Comparison": contains Set Operations methods → insert sub-header
- complex.ts orphaned `negate()`/`zero()`: insert sub-headers for Arithmetic/Mutator

### D4: `clampValue` in interval.ts — Keep as Interpolation

**Problem:** `clampValue` uses `@category Interpolation` but semantically clamps a value. Should it be a different category?

**Decision:** Keep as `@category Interpolation`.

**Rationale:** In interval.ts, `clampValue` is placed alongside `lerp`, `sample`, `inverseLerp` in the "Static Interpolation" section. These methods collectively handle "mapping values relative to an interval range" — `lerp` maps [0,1] → interval, `inverseLerp` maps interval → [0,1], `clampValue` maps any value → interval. They form a coherent sampling/mapping family. The `Constraint` category is file-scoped to vector2.ts only (per FILE_SCOPE_MAP). Changing to `Transform` would isolate it from its logical family. The current placement is defensible.

### D5: `@example` authoring strategy — Batch by file, follow templates exactly

**Problem:** ~40 Factory methods and ~10 Triality Strict/Safe methods lack `@example` blocks that the standard requires.

**Decision:** Author `@example` blocks following Templates 10 (Factory), 4 (Strict), and 5 (Safe) exactly:

- **Factory (Template 10):** Show creation with and without `out` parameter
- **Strict (Template 4):** Show normal case + the case that triggers the throw
- **Safe (Template 5):** Show normal case + fallback case

Each `@example` will use realistic values consistent with the type's domain (e.g., rotation angles in radians, matrices with recognizable values like identity or rotation matrices).

### D6: `@see` cross-linking strategy — Batch by triality family

**Problem:** ~35 triality methods across 5 files lack the required `@see` cross-links.

**Decision:** Process one triality family at a time (e.g., `divide`/`divideSafe`/`divideUnchecked`), adding all cross-links for that family before moving to the next. This ensures completeness per family.

Format per DOCUMENTATION_STANDARD Section 5:

- **Strict:** `@see {@link fnSafe} - Returns fallback if <condition>` + `@see {@link fnUnchecked} - No validation`
- **Safe:** `@see {@link fn} - Throws for <condition>`
- **Unchecked:** `@see {@link fn} - Throws on <condition>` + `@see {@link fnSafe} - Returns fallback on <condition>`

### D7: Non-canonical section header suffixes — Keep where they aid readability

**Problem:** Several section headers use parenthetical suffixes not in the canonical order: "(Angle)", "(Readonly)", "(Swizzle)", "(Geometric)", "(Application)", "(Serialization)", "(Matrix)".

**Decision:** Keep suffixes that disambiguate genuinely distinct sub-groups within the same base category. Remove suffixes that add no value.

**Keep:** "(Geometric)", "(Application)" in matrix3.ts (different Transform semantics), "(Angle)" in rotation2.ts (distinct from other Accessors)
**Simplify:** "(Readonly)" and "(Swizzle)" in vector2.ts → merge conceptually into "Instance Accessors" via sub-headers if needed
**Rename:** "Instance Predicates" in complex.ts → "Instance Comparison" (all members use `@category Comparison`)

### D8: Duplicate section headers in vector2.ts — Merge via sub-headers

**Problem:** "Static Transforms" appears at L692 and L1493. "Instance Transforms" appears at L3321 and L4185.

**Decision:** Rename the second occurrence to include a clarifying suffix: "Static Transforms (Normalize & Project)" and "Instance Transforms (Step)". This preserves code position while eliminating true duplicates.

**Alternative rejected:** Merging by physically moving code. Too risky per prior disaster lesson.

### D9: `rotation2.ts normalize` strict triality behavior

**Problem:** `normalize` is labeled as a strict triality variant but delegates to `normalizeComponents` which returns identity for zero-length input (doesn't throw).

**Decision:** Document the actual behavior accurately. If `normalize` does not throw, its JSDoc should NOT have `@throws` and should not be cross-linked as a strict variant. Instead, document it as a standalone Transform method. If `normalizeSafe` exists as a separate method, investigate whether both normalize and normalizeSafe have identical behavior (in which case, document the equivalence in `@remarks`).

### D10: `@defaultValue` inline in `@param` — Accept current pattern

**Problem:** Many methods embed `@defaultValue` inside `@param` text rather than as a separate tag.

**Decision:** Accept the inline pattern as-is. The standard does not explicitly demonstrate standalone `@defaultValue` usage in any template. The inline pattern (`@param offset - Starting index. @defaultValue \`0\``) is consistent across all files and readable. No change needed.

## Risks / Trade-offs

| Risk                                                                       | Mitigation                                                                                                                                         |
| -------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
| `@example` blocks with incorrect code (like the transform2 readonly issue) | Every `@example` must be mentally executable: verify types, readonly constraints, and return types match                                           |
| Agents adding out-of-scope changes (as happened in Phase 3)                | Tasks specify exact scope per method; verification step after each file                                                                            |
| DOCUMENTATION_STANDARD amendment creates inconsistency with ESLint         | D1 amendment only changes "Typical Members" column text — ESLint rule validates category names, not typical member lists. No ESLint change needed. |
| Breaking lint by changing `@category` values                               | All replacement categories are in VALID_CATEGORIES. Run `npm run lint` after each file.                                                            |
| Accidentally modifying functional code while editing JSDoc                 | After each file, run `npm run test:unit` to verify 3225/3225 pass. For extra safety: diff only `/** ... */` blocks to confirm no code touched.     |
