## Why

The previous change (`fix-version-since-tags`) corrected all `@since 0.8.0` and `@since 0.9.0` tags to `@since 0.7.0`. However, it treated every symbol uniformly — including methods, constants, and exports that already existed in v0.6.0 (Vector2, Matrix2) or v0.5.0 (scalar module). These inherited symbols were tagged `@since 0.7.0` during the full TSDoc rewrite that accompanied the modular architecture migration, but they predate v0.7.0. Publishing with incorrect `@since` tags misrepresents when each API was introduced, which matters for consumers evaluating upgrade risk and API stability.

## What Changes

- **Vector2** (`core/vector2.ts`): Change `@since 0.7.0` → `@since 0.6.0` for ~100+ methods and 11 constants that existed (same name or renamed) in v0.6.0. Genuinely new 0.7.0 methods remain untouched.
- **Matrix2** (`core/matrix2.ts`): Change `@since 0.7.0` → `@since 0.6.0` for ~45+ methods and 5 constants that existed (same name or renamed) in v0.6.0's `Mat2` class. Genuinely new 0.7.0 methods remain untouched.
- **Scalar exports** (4 files in `auxiliary/scalar/`): Change `@since 0.7.0` → `@since 0.5.0` for 13 exports that existed (same name or renamed) in the original scalar module introduced in v0.5.0. All other auxiliary exports remain `@since 0.7.0`.
- **Regenerate API docs** after source corrections.

## Capabilities

### New Capabilities

- `since-tag-historical-accuracy`: Ensure `@since` TSDoc tags accurately reflect the release version in which each symbol was first introduced, accounting for renames and module reorganization.

### Modified Capabilities

_(none — no spec-level behavior changes, metadata-only)_

## Impact

- **Source code**: 3 `.ts` source files modified (`vector2.ts`, `matrix2.ts`) + 4 auxiliary scalar files — TSDoc comments only, zero runtime changes.
- **Generated docs**: `docs/docs/api/` regenerated after source fixes.
- **Bundle size / tree-shaking**: No impact (comments stripped by SWC).
- **Deterministic guarantees**: No impact (no code changes).
- **Tests**: No changes required.
- **Risk**: Each edit is targeted per-method (not bulk replace), requiring careful identification of which `@since 0.7.0` tags to change and which to leave. An explicit allowlist of genuinely-new 0.7.0 methods serves as the safety guardrail.
