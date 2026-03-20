## Context

Final 2 tag order violations remaining after the remarks-tag-order-fix sweep. Both are simple reorderings within JSDoc blocks.

## Goals / Non-Goals

**Goals:**

- Fix the 2 remaining tag order violations
- Achieve 0 total tag order violations across entire codebase

**Non-Goals:**

- Any other documentation changes
- Runtime code modifications

## Decisions

### D1: Direct fix

Both fixes are trivial block-internal reorderings. No script needed — manual edit with verification scan.

## Risks / Trade-offs

None. Two blocks, two swaps, documentation-only.
