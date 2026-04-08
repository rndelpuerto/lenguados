# @lenguados/math2d/deterministic

## File

deterministic/deterministic-kernels.ts

## Description

Deterministic mathematical kernels for L0 cross-platform consistency

## Remarks

## Purpose

This module contains ONLY pure deterministic replacements for `Math.*` functions
that are NOT bit-exact across JavaScript engines. Each kernel accepts any IEEE 754
double and returns the IEEE 754-specified result (including NaN for domain errors).
No clamping, no fallbacks, no Safe variants — those belong in
`auxiliary/numeric/safety.ts` (L1).

Functions like `Math.floor`, `Math.ceil`, `Math.abs`, `Math.sqrt` ARE deterministic
per IEEE 754 and should be used directly.

## Determinism Guarantee: L0 (Bit-Exact Cross-Platform)

All functions in this module produce **identical results** on:

- Chrome (V8), Firefox (SpiderMonkey), Safari (JSC)
- Node.js, Deno, Bun
- Windows, macOS, Linux
- x86, ARM, any architecture

## Polynomial Coefficients Source

Coefficients are derived from **fdlibm** (FreeBSD Math Library), computed using
the Remez algorithm for minimax approximation.

## See

[https://www.netlib.org/fdlibm/](https://www.netlib.org/fdlibm/) - FreeBSD fdlibm reference implementation

## Arithmetic

- [acos](functions/acos.md)
- [asin](functions/asin.md)
- [atan](functions/atan.md)
- [atan2](functions/atan2.md)
- [cos](functions/cos.md)
- [exp](functions/exp.md)
- [hypot](functions/hypot.md)
- [log](functions/log.md)
- [pow](functions/pow.md)
- [sin](functions/sin.md)
- [sinCos](functions/sinCos.md)
- [tan](functions/tan.md)

## Configuration

- [config](variables/config.md)

## Helpers

- [DeterministicKernels](variables/DeterministicKernels.md)

## Other

### SinCos

Re-exports [SinCos](../types/interfaces/SinCos.md)
