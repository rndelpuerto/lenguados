## Why

An exhaustive audit of all 7 core type files in `@lenguados/math2d` (layer 3: `core/`) revealed 7 CRITICAL factual errors, 5 HIGH category/section inconsistencies, ~35 missing `@see` cross-links on triality methods, ~40 missing `@example` blocks on Factory and Triality methods, 1 unresolved internal contradiction (Geometry vs Computed for `dot`/`cross`/`magnitude`), and ~15 LOW formatting/style issues. While `@category` and `@since` coverage is at ~100%, the **content quality** — accuracy of descriptions, correctness of examples, completeness of cross-links — has gaps that undermine the library's documentation standard, which aims to exceed commercial libraries like Three.js, gl-matrix, and Box2D.

## What Changes

### CRITICAL — Factual Errors & Missing Required Documentation

- Fix `set angle` setter in vector2.ts: completely undocumented (missing `@param`, `@category`, `@since`)
- Fix `getComponent` in vector2.ts: incorrectly tagged `@category Mutator` instead of `Accessor`
- Fix two `@example` blocks in transform2.ts containing invalid code (`t.rotation = Math.PI / 4` on `readonly Rotation2`)
- Fix misleading `transformPoint` summary in transform2.ts (says "applies translation" but applies full SRT)
- Add missing `@throws {RangeError}` to `ortho` in matrix3.ts
- Merge duplicate `@remarks` blocks on `normalized` getter in complex.ts (TSDoc violation)
- Fix wrong property references (`this.c`/`this.s` → `this.cos`/`this.sin`) in rotation2.ts `applyInverse`

### HIGH — Category/Section Inconsistencies

- Fix static `determinant`/`trace` in matrix2.ts + matrix3.ts: `Matrix Operations` → `Computed` (DOCUMENTATION_STANDARD L452)
- Fix instance `isInvertible`/`isAffine` in matrix3.ts: `Computed` → `Comparison` (predicate pattern)
- Add sub-headers for misplaced methods in transform2.ts, matrix2.ts, interval.ts, complex.ts (per D7 strategy: rename headers, never move code)

### DECISION REQUIRED — Geometry vs Computed Contradiction

- Resolve contradiction between DOCUMENTATION_STANDARD L452 (lists `dot`/`cross`/`magnitude` under Computed) and Design D8 (assigns them to Geometry in vector2.ts). D1 says standard is authoritative.

### MEDIUM — Systematic Gaps

- Add `@see` cross-links to all ~35 triality method families (DOCUMENTATION_STANDARD Section 5 L648-720)
- Add `@example` to all ~40 Factory methods (REQ per Table 1, Template 10)
- Add `@example` to all Triality Strict/Safe methods lacking them (REQ per Table 1, Templates 4-5)
- Fix ~8 specific content issues: misleading `@param` descriptions, leaked implementation details in summaries, missing `@throws`, missing constructor JSDoc

### LOW — Style & Formatting

- Standardize `@see` format (em-dash → hyphen)
- Evaluate non-canonical section header suffixes
- Rename "Instance Predicates" → "Instance Comparison" in complex.ts
- Evaluate `@defaultValue` inline pattern
- Address duplicate section headers in vector2.ts

## Capabilities

### New Capabilities

_(none)_

### Modified Capabilities

- `eslint-doc-enforcement`: Delta spec to formalize the Geometry-vs-Computed resolution for `dot`/`cross`/`magnitude` in vector2.ts, and to document the `@example` REQ enforcement gap discovered during audit

## Impact

- **Affected code**: 7 core type files in `packages/math2d/src/core/` (vector2.ts, matrix2.ts, matrix3.ts, rotation2.ts, complex.ts, interval.ts, transform2.ts)
- **Affected documentation**: DOCUMENTATION_STANDARD.md Section 3 (if Geometry vs Computed resolution amends the standard)
- **Zero functional code changes**: Only JSDoc comments and ASCII section headers modified
- **No API changes**: No method signatures, behavior, or exports affected
- **No bundle size impact**: JSDoc is stripped during build
- **Rollback**: Safe — `git checkout` restores all files; no deterministic guarantees affected
