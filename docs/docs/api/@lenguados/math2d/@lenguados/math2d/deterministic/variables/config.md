# Variable: config

> `const` **config**: `object`

Defined in: [src/deterministic/deterministic-kernels.ts:78](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L78)

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

**Global mutability**: This object is a shared mutable singleton. Changing
`useNativeMath` affects ALL subsequent calls to deterministic functions
across the entire application. There is no per-context or per-thread
isolation — JavaScript is single-threaded, but Web Workers each get their
own module instance and thus their own `config`.

**Recommendation**: Set `config.useNativeMath` once at application startup,
before any math computation begins. Toggling it mid-computation may produce
inconsistent results if earlier computations used different kernels.

## Example

```typescript
import { config } from '@lenguados/math2d/deterministic';

// Disable determinism, run native C-level floats on local CPU
config.useNativeMath = true;
```

## Since

0.8.0
