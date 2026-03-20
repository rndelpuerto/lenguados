## Why

Phase 1 (`math2d-documentation-standard`, archived 2026-03-09) defined a comprehensive TSDoc documentation standard with 14 templates, canonical tag order, controlled `@category` vocabulary, and class member section ordering — but the 30+ source files in math2d still contain the old, inconsistent documentation. An initial audit identified 35+ gaps: missing `@category`/`@since` tags on instance methods, non-standard category values (25+ unique vs 10 base), inconsistent triality cross-links, scattered section ordering in classes (constructor placement varies by 2400 lines across files), and file headers missing `@remarks` on core types. This phase applies the standard systematically to every file.

## What Changes

- **File headers**: Fix all `@file`, `@module`, `@description` tags; add `@remarks` to core type files; remove project name suffixes
- **Tag order**: Reorder tags in every JSDoc block to match canonical sequence (summary → @remarks → @param → @returns → @throws → @example → @see → @category → @since)
- **Mandatory tags**: Add missing `@category` and `@since` to all public exports; add `@constant {type}` to all exported constants
- **Category vocabulary**: Replace all deprecated category values with controlled vocabulary (e.g., "Geometry & Measures" → `Computed`/`Geometry`, "Serialization" → `Conversion`, "Predicate" → `Comparison`)
- **Triality cross-links**: Ensure strict variants `@see` safe+unchecked, safe variants `@see` strict only (no `@throws`), unchecked variants `@see` both (no `@example`, bold precondition)
- **Section dividers**: Standardize all dividers to 80-char (file-level) / 78-char (class-level) format
- **Class member reordering**: Reorder all 7 core type files to match standard section order (Instance Props → Static Constants → Constructor → Private Helpers → Static methods → Instance Getters → Instance methods → Conversion)
- **Transversal rules**: Fix imperative voice summaries, sentence fragment `@param`/`@returns`, `@see` format, remove `@group`/`@alpha`/`@beta` tags

## Capabilities

### New Capabilities

_(none — this is an implementation phase, applying the existing documentation-standard spec)_

### Modified Capabilities

- `documentation-standard`: No requirement changes — this change implements the existing spec requirements. Delta spec captures verification scenarios for the audit pass.

## Impact

- **All 6 architectural layers affected**: deterministic/, auxiliary/, core/, types/, validation/, utils/
- **No runtime impact**: Documentation-only changes — no API signatures, behavior, or bundle output modified
- **No breaking changes**: Public API remains identical
- **High diff volume**: Core type files (vector2.ts, matrix3.ts) will have large diffs due to section reordering, but no logic changes
- **Build/test verification**: `npm run build` and `npm run test:unit` must pass after all changes to confirm no regressions from reordering
