# @lenguados/math2d/deterministic

## File

deterministic/deterministic-kernels.ts

## Description

Deterministic mathematical kernels for L0 cross-platform consistency

## Remarks

## Purpose

This module contains ONLY functions that are NOT deterministic in native JavaScript.
Functions like `Math.floor`, `Math.ceil`, `Math.abs` ARE deterministic per IEEE 754
and should be used directly.

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
- [acosSafe](functions/acosSafe.md)
- [asin](functions/asin.md)
- [asinSafe](functions/asinSafe.md)
- [atan](functions/atan.md)
- [atan2](functions/atan2.md)
- [cos](functions/cos.md)
- [exp](functions/exp.md)
- [expSafe](functions/expSafe.md)
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

Re-exports [SinCos](../auxiliary/angle/interfaces/SinCos.md)

---

### sqrtSafe

Re-exports [sqrtSafe](../auxiliary/numeric/functions/sqrtSafe.md)
