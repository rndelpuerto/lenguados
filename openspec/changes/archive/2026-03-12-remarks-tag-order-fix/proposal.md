## Why

336 JSDoc blocks across 23 source files in `@lenguados/math2d` place `@remarks` after `@param`/`@returns`, violating the canonical TSDoc tag order defined in DOCUMENTATION_STANDARD.md (Requirement R2) and codified in the official TSDoc emitter (`TSDocEmitter.ts`). This is the last remaining systemic documentation standard violation after the previous audit (math2d-doc-audit-v2) addressed all other categories.

## What Changes

- **Move `@remarks` before `@param`** in 336 JSDoc blocks across 23 files in `packages/math2d/src/`
- Changes are **documentation-only**: zero modifications to runtime code, type signatures, imports, or exports
- Affected layers: all layers of the architecture (auxiliary/, deterministic/, core/, utils/, validation/)
- No rollback plan needed — deterministic guarantees are unaffected (no code changes)
- No impact on tree-shaking or bundle size (JSDoc comments are stripped at build time)

## Capabilities

### New Capabilities

_None — this change implements an existing requirement, not a new capability._

### Modified Capabilities

- `documentation-standard`: No requirement changes. R2 (canonical tag order) already defines the correct order. This change implements compliance with the existing requirement.

## Impact

- **Code**: 23 `.ts` files in `packages/math2d/src/` — documentation blocks only
- **APIs**: No changes to public API surface
- **Dependencies**: None
- **Build/Tests**: No functional impact; build and full test suite must pass unchanged
