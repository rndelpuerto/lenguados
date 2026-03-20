# Function: logKernelSafe()

> **logKernelSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:808](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/deterministic/deterministic-kernels.ts#L808)

**`Internal`**

Kernel-level safe natural logarithm (returns 0 for non-positive values).

## Parameters

### x

`number`

Value to compute logarithm of

## Returns

`number`

ln(x) for x > 0, 0 otherwise

## Remarks

This is the kernel-level safe variant (single-argument, no base support).
The public API `logSafe` in `auxiliary/numeric/safety` adds custom base
support and delegates to this kernel. Both return 0 for non-positive input.
Not exported from the main index to avoid naming collisions with the
richer public variant.
