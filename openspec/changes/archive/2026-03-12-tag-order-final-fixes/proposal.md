## Why

2 remaining tag order violations found after the remarks-tag-order-fix change. These are the last non-compliant blocks in the codebase against R2 (canonical tag order).

## What Changes

- **vector2.ts**: Move `@example` before `@see` in `crossScalarLeft` (line ~2156)
- **unwrapping.ts**: Move `@remarks` before `@example` in `AngleUnwrapper` class (line ~122)

Documentation-only changes. Zero runtime code modifications.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `documentation-standard`: No requirement changes. Implements existing R2 compliance.

## Impact

- **Code**: 2 files, 2 JSDoc blocks
- **APIs**: None
- **Dependencies**: None
