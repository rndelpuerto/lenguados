# @lenguados/math2d/deterministic

## File

deterministic/trig-tables.ts

## Description

Precomputed trigonometric lookup tables for L0 determinism.

## Remarks

These tables were generated offline to ensure bit-exact cross-platform
determinism (L0 guarantee). The values are computed using Node.js Math.sin/cos
and stored with full IEEE 754 double precision (17 significant digits).

**Table specifications:**

- Size: 65536 entries (2^16)
- Range: [0, 2π)
- Step: 2π/65536 ≈ 9.587e-5 radians
- Generated: $(new Date().toISOString().split('T')[0])

## Since

0.13.0

## Variables

- [COS_TABLE](variables/COS_TABLE.md)
- [SIN_TABLE](variables/SIN_TABLE.md)
- [TRIG_TABLE_SIZE](variables/TRIG_TABLE_SIZE.md)
