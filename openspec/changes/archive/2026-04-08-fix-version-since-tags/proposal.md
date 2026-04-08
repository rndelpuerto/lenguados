## Why

During development on the `enhancement/lenguados` branch, placeholder versions `0.8.0` and `0.9.0` were assigned to `@since` TSDoc tags and deprecation notices across all math2d source files. The library's actual next release is **0.7.0** (current released: 0.6.0). Shipping with phantom future versions in public documentation would confuse consumers, break changelog traceability, and misrepresent the release history.

## What Changes

- **Replace all `@since 0.8.0` and `@since 0.9.0` TSDoc tags** with `@since 0.7.0` across 14 source files in `packages/math2d/src/` (149 occurrences). Everything introduced after v0.6.0 ships in v0.7.0 — there is no intermediate release.
- **Fix 2 `@deprecated` notices** in `vector2.ts` that reference "Since 0.8.0" and "Will be removed in 1.0.0" — correct the since version and remove the speculative removal target.
- **Update 6 version references** in 3 OpenSpec archive files that document decisions using the placeholder versions.
- **Regenerate API docs** (`docs/docs/api/`) — auto-generated from TypeDoc; fixing source propagates to ~150+ generated files without manual edits.

## Capabilities

### New Capabilities

- `version-tag-normalization`: Audit and correct all library version references (`@since`, `@deprecated`, prose mentions) to ensure no version > 0.7.0 appears in source, documentation, or archive files.

### Modified Capabilities

_(none — no spec-level behavior changes, this is metadata-only)_

## Impact

- **Source code** (L0–L3 layers): 14 `.ts` files across `deterministic/`, `auxiliary/`, `core/`, `types/`, `validation/` — TSDoc metadata only, zero runtime changes.
- **Generated docs**: `docs/docs/api/` regenerated after source fixes — ~40+ markdown files updated automatically.
- **OpenSpec archives**: 3 historical files corrected to reflect actual version numbers.
- **Bundle size / tree-shaking**: No impact (comments stripped by SWC minification).
- **Deterministic guarantees**: No impact (no code changes, only TSDoc metadata).
- **Tests**: No changes required — `@since` tags are not tested.
