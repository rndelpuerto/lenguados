# @lenguados/math2d/deterministic

## File

deterministic/RoundingControl.ts

## Description

Explicit rounding control for deterministic operations

## Remarks

**Design Decision**: This module uses inline validation (`sanitize*` methods)
instead of the `validation/assert` module for two reasons:

1. **Configuration errors must always fail**: Unlike assertions (which are
   disabled in production), invalid rounding parameters should always throw.
   A misconfigured rounding operation is an unrecoverable error.

2. **Semantic clarity**: The `sanitize*` methods both validate AND return
   the sanitized value, which is cleaner for this use case.

## See

validation/assert for development-only assertions

## Enumerations

- [RoundingMode](enumerations/RoundingMode.md)

## Classes

- [RoundingControl](classes/RoundingControl.md)
