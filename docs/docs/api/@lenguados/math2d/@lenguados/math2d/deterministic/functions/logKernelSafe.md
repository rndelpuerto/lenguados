# Function: logKernelSafe()

> **logKernelSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:834](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L834)

Safe natural logarithm at the deterministic kernel level (returns 0 for non-positive values).

## Parameters

### x

`number`

Value to compute logarithm of

## Returns

`number`

ln(x) for x > 0, 0 otherwise

## Remarks

The deterministic layer's single-argument safe log, analogous to [expSafe](expSafe.md) for `exp`
and [acosSafe](acosSafe.md)/[asinSafe](asinSafe.md) for inverse trig. Intended for consumers who use
[DeterministicKernels](../variables/DeterministicKernels.md) directly without the auxiliary layer.

For multi-base support (`logSafe(x, base)`), use `auxiliary/numeric/safety.logSafe` instead,
which internally delegates to the deterministic [log](log.md) kernel with its own guard.

## Since

0.9.0
