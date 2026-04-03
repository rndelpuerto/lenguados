# Function: flushDenormal()

> **flushDenormal**(`value`): `number`

Defined in: [src/auxiliary/numeric/guards.ts:126](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/guards.ts#L126)

Flushes denormal (subnormal) values to zero.

## Parameters

### value

`number`

Value to flush

## Returns

`number`

The value unchanged if normal, or 0 if denormal

## Remarks

Denormal numbers cause 10–100x performance penalties on some CPUs
(x86 without FTZ/DAZ flags). This function is a numerical hygiene
utility for physics loops that may produce denormal intermediates.

## Example

```typescript
flushDenormal(5e-324); // 0 (denormal flushed)
flushDenormal(1.5); // 1.5 (normal, unchanged)
flushDenormal(0); // 0 (zero is not denormal)
```

## See

[isDenormal](isDenormal.md) - For testing without flushing

## Since

0.9.0
