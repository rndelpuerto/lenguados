## Why

Phase 2 ESLint doc enforcement added @category/@since tags to ~280 instance methods across all core types. Post-implementation audit revealed systematic inconsistencies: the same conceptual operations use different @category values across files (e.g., `floor()` is Transform in vector2.ts but Arithmetic in matrix2/matrix3), section headers don't match the @category tags within them, some methods are missing @category tags entirely, and instance-static category mismatches exist within the same file. These inconsistencies undermine TypeDoc navigation, violate the DOCUMENTATION_STANDARD.md principle of consistent categorization, and create confusion about the semantic intent of each method grouping.

## What Changes

- **Standardize cross-file categories**: Same conceptual operations (floor/ceil/round/trunc/abs/sign, min/max/clamp, negate, transpose, inverse, etc.) will use the same @category across all core files where they appear
- **Fix instance-static mismatches**: Instance methods will match their static counterpart's @category within each file (e.g., matrix2 instance `rotateCS()` "Matrix Operations" → "Transform" to match static)
- **Add missing @category tags**: matrix2 `static transformVector()`, matrix2 instance getters (transposed, inverted, negated, column0/1, row0/1, diagonal), vector2 derived/swizzle getters
- **Align section headers**: Rename ASCII banner headers to match the @category tags of methods within each section (rename headers, not move code)
- **Split mixed-category sections**: Where a single section contains 3-4 incompatible categories (matrix3 Static Matrix Operations has Arithmetic+Comparison+Matrix Operations+Transform), split into coherent subsections
- **Resolve Conversion/Factory confusion**: Standardize `clone()` placement — either consistently Factory or Conversion across all files

All changes are documentation-only (JSDoc comments and ASCII section headers). Zero functional code modifications.

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `eslint-doc-enforcement`: The VALID_CATEGORIES set and FILE_SCOPE_MAP may need updates if the standardization reveals categories that should be added, removed, or re-scoped. The Limitations section documents gaps that this change partially addresses (category consistency across files).

## Impact

- **Affected code**: All 7 core type files in `packages/math2d/src/core/` (vector2.ts, matrix2.ts, matrix3.ts, rotation2.ts, complex.ts, interval.ts, transform2.ts)
- **Affected layers**: Core layer only (layer 3 in architecture)
- **TypeDoc output**: Category groupings in generated documentation will change — methods may move between category sections in the API docs
- **ESLint**: Must pass all 4 custom rules (enforce-category-vocabulary, enforce-required-tags, enforce-see-format, enforce-tag-fragments) with zero warnings after changes
- **Tests**: 3225 tests must continue passing (no functional code changes)
- **Bundle size**: Zero impact (comments are stripped in production builds)
- **Rollback**: `git revert` of the commit — all changes are in JSDoc comments and ASCII headers
