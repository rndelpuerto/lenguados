# @lenguados/math2d/auxiliary/numeric

## File

auxiliary/numeric/wrapping.ts

## Description

Specialized value wrapping and modulo operations.

## Remarks

This module provides different modulo and wrapping behaviors:

- **`flooredMod`**: Result has same sign as divisor (Python-style)
- **`truncatedMod`**: Result has same sign as dividend (JavaScript `%`)
- **`mirror`**: Ping-pong reflection around a center point
- **`repeat`**: Always positive wrapping for tiling patterns

For basic looping and modulo, use loop and mod
from @lenguados/math2d/auxiliary/scalar/arithmetic.

**Note:** `truncatedMod` is identical to `%` but included for
semantic clarity when comparing different modulo behaviors.

## Wrapping

- [flooredMod](functions/flooredMod.md)
- [flooredModSafe](functions/flooredModSafe.md)
- [flooredModUnchecked](functions/flooredModUnchecked.md)
- [mirror](functions/mirror.md)
- [mirrorSafe](functions/mirrorSafe.md)
- [mirrorUnchecked](functions/mirrorUnchecked.md)
- [repeat](functions/repeat.md)
- [repeatSafe](functions/repeatSafe.md)
- [repeatUnchecked](functions/repeatUnchecked.md)
- [truncatedMod](functions/truncatedMod.md)
