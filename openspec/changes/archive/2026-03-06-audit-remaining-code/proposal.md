## Why

The math2d audit (audit-math2d-foundations) produced a prioritized implementation checklist. Priorities P1–P4 were implemented in two prior changes (auditoria-math2d, implement-audit-findings). Priorities P5–P6 remain: 3 missing Complex operations, 1 conversion micro-fix, and 5 quality improvements — all cross-validated against current specs and confirmed as real gaps in the codebase.

## What Changes

### P5 — Missing Complex operations

- Add `Complex.exp(z, out?)` — Euler's formula: e^z = e^re \* (cos(im) + i·sin(im))
- Add `Complex.log(z, out?)` — principal logarithm: (ln|z|, arg(z))
- Add `Complex.toPolar(z)` — returns `{ magnitude, angle }`, completing the fromPolar↔toPolar symmetry

### P6 — Micro-fix

- Fix `radiansToTurns` to use `rad * RAD_TO_TURN` instead of `rad / TAU` (consistency with all other converters that use multiplication)

### P6 — Quality improvements

- Improve `deterministic/exp` 2^k scaling (replace fragile bit-manipulation with proper scalbn-style two-step multiply)
- Improve `deterministic/sinCos` range reduction (Cody-Waite split for precision on large angles, replacing naive `x % TAU`)
- Add Safe variant suggestions to validation error messages (per dx-quality spec)
- Align `Interval` static/instance `divide` semantics (currently incompatible signatures)
- Re-export type guards from all 7 core types (currently only 3/7 do)

### NOT included (invalidated during cross-validation)

- `roundToPowerOfTwo` with `Math.log2` — **rejected**: `Math.log2` is IEEE 754 recommended (not required), so using `deterministic/log` is correct for cross-platform determinism.

## Capabilities

### New Capabilities

_(none — all changes fit within existing capability specs)_

### Modified Capabilities

- `core-types-api`: Adding Complex.exp, Complex.log, Complex.toPolar; aligning Interval divide semantics
- `auxiliary-api`: Fixing radiansToTurns conversion implementation
- `determinism-guarantees`: Improving exp scaling and sinCos range reduction internals
- `dx-quality`: Adding Safe variant suggestions to error messages
- `api-conventions`: Re-exporting type guards consistently from all core types

## Impact

- **Layers affected**: deterministic/ (exp, range reduction), auxiliary/angle/ (conversion), core/ (complex, interval), validation/ (error messages), core/index (type guard re-exports)
- **API surface**: Additive only — new methods on Complex, new re-exports. No removals or renames.
- **Deterministic guarantees**: exp and range reduction changes improve precision without changing the deterministic contract (fdlibm kernels remain, Math.\* not introduced for non-required ops)
- **Bundle size**: Minimal increase (~200 LOC). Complex.exp/log are tree-shakeable.
- **Rollback**: All changes are independent. Each can be reverted without affecting others. Deterministic kernel changes can be toggled via `config.useNativeMath`.
