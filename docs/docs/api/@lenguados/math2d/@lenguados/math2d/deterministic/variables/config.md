# Variable: config

> `const` **config**: `object`

Defined in: [src/deterministic/deterministic-kernels.ts:56](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/deterministic/deterministic-kernels.ts#L56)

Global configuration for deterministic math execution.

## Type Declaration

### useNativeMath

> **useNativeMath**: `boolean` = `false`

## Remarks

By default, this module uses `fdlibm` bit-exact polynomial algorithms
(L0 Determinism) for perfect network lockstep sync across browsers/CPUs.
However, this is significantly slower than native assembly floats.

Set `config.useNativeMath = true` to bypass deterministic kernels and use
native `Math.*` functions instead, recovering maximum CPU performance for
single-player or non-networked scenarios.

## Example

```typescript
import { config } from '@lenguados/math2d/deterministic';

// Disable determinism, run native C-level floats on local CPU
config.useNativeMath = true;
```
