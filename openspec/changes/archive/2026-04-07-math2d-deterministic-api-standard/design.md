## Context

The `deterministic-kernels.ts` module (L0) currently exports 16 functions + 1 namespace. Four of those are domain-clamping "Safe" wrappers (`acosSafe`, `asinSafe`, `logKernelSafe`, `expSafe`). This investigation analyzed 11 reference libraries and the complete Safe function inventory (73 functions across 3 layers) to determine the optimal architecture.

### Evidence Base

**11 libraries surveyed**: gl-matrix, Three.js, Box2D/Planck.js, Unity Mathf, Godot, Unreal FMath, Rapier/nalgebra, Eigen, NumPy, GLSL spec, fdlibm/libm.

**Key findings:**

- 0/11 have Safe variants of scalar trig/log/exp at the kernel level
- fdlibm (our architectural ancestor) separates `e_*.c` (pure kernel) from `w_*.c` (wrapper with error handling)
- Safe variants in the industry exist ONLY at vector/geometry level (Unreal `GetSafeNormal`, nalgebra `try_normalize`, Eigen `stableNormalize`)

**Complete internal inventory**: 73 Safe functions total. L0 has 4, L1 has 15 (including 2 re-exports from L0), L2 has 54 (27 unique operations x static+instance). All 31 trialities in L2 are complete and consistent.

## Goals / Non-Goals

**Goals:**

- Make L0 a pure deterministic kernel layer (IEEE 754 behavior, no domain clamping)
- Consolidate ALL Safe math functions in L1 (`auxiliary/numeric/safety.ts`)
- Eliminate the `logKernelSafe` naming anomaly (only function with `Kernel` infix)
- Eliminate double-exports of `acosSafe`/`asinSafe`
- Make `DeterministicKernels` namespace predictable (pure kernels only)
- Document the standard so it scales without ambiguity

**Non-Goals:**

- Changing L2 (core type) triality patterns — those are correct and complete
- Adding missing Safe variants where they're not needed (`sinSafe`, `cosSafe`, etc.)
- Removing the `DeterministicKernels` namespace — it serves tree-shaking-hostile environments
- Changing the `config.useNativeMath` toggle mechanism
- Adding `./auxiliary` subpath export (separate change if desired)

## Decisions

### Decision 1: L0 kernel = pure IEEE 754 deterministic math

**Choice**: Remove all 4 Safe functions from `deterministic-kernels.ts`.

**Evidence (irrefutable)**:

1. fdlibm (our documented source) separates kernels (`e_acos.c`) from wrappers (`w_acos.c`). The kernel returns NaN for domain errors. The wrapper adds POSIX error handling. lenguados' L0 should mirror fdlibm's kernels, not its wrappers.
2. 0/11 surveyed libraries have Safe scalar math at the kernel level.
3. The `architecture-and-layers.md` already states L0 "contains ONLY functions that are NOT deterministic in native JavaScript." Domain clamping IS deterministic — `x <= -1 ? PI : acos(x)` uses only IEEE 754 operations. It does not belong in L0 by the module's own stated purpose.
4. The deterministic-kernels.ts file header says: "This module contains ONLY functions that are NOT deterministic in native JavaScript." Safe wrappers are deterministic compositions of deterministic operations — they don't need to be in L0.

**What the kernel retains** (12 pure functions + 1 config):
`sin`, `cos`, `sinCos`, `tan`, `atan`, `atan2`, `acos`, `asin`, `log`, `exp`, `pow`, `hypot`, `config`

### Decision 2: Consolidate Safety in L1

**Choice**: Move `acosSafe`, `asinSafe`, `expSafe` to `auxiliary/numeric/safety.ts`. Delete `logKernelSafe` (already superseded by `logSafe`).

**Evidence**:

1. `safety.ts` already contains `sqrtSafe`, `divideSafe`, `reciprocalSafe`, `logSafe`, `powSafe`, `lerpSafe`, `sanitizeNumber`, `ensureFinite` — it IS the canonical location for Safe math.
2. `acosSafe`/`asinSafe` are already re-exported from `safety.ts` (lines 129, 140). This change makes the re-exports become the definitions — cleaner, no duplication.
3. `logKernelSafe(x)` is functionally identical to `logSafe(x)` when called with default base (`Math.E`). The existing `logSafe(value, base?)` already handles the natural-log case. Zero internal consumers of `logKernelSafe`. Deletion is clean.
4. `expSafe` has zero internal consumers. Moving it to L1 follows the pattern of `powSafe` (also a deterministic-kernel wrapper in L1).

**Implementation detail for `acosSafe`/`asinSafe`**: These become standalone functions in `safety.ts` that import `acos`/`asin` from the deterministic kernel:

```typescript
import { acos, asin } from '../../deterministic/deterministic-kernels';

export function acosSafe(x: number): number {
 if (x <= -1) return PI;
 if (x >= 1) return 0;
 return acos(x);
}
```

This is identical to the current implementation — only the file location changes.

### Decision 3: Clean export surface

**Choice**: Single export path per function. No double-exports.

**Current state** (problematic):

```
acosSafe exported from:
  1. deterministic-kernels.ts (export function)
  2. safety.ts (re-export from deterministic)
  3. index.ts (explicit export from deterministic)
  4. index.ts (wildcard export from auxiliary/numeric)
```

**New state** (clean):

```
acosSafe exported from:
  1. safety.ts (definition)
  2. index.ts (via export * from './auxiliary/numeric')
```

### Decision 4: DeterministicKernels namespace = pure kernels only

**Choice**: Remove all Safe entries. The namespace becomes a predictable, complete set of pure deterministic replacements for `Math.*`.

**Before** (17 entries, inconsistent):

```
config, hypot, sin, cos, sinCos, tan, atan, atan2,
acos, asin, acosSafe, asinSafe, log, logKernelSafe, exp, expSafe, pow
```

**After** (13 entries, clean rule: "every non-deterministic Math.\* equivalent"):

```
config, hypot, sin, cos, sinCos, tan, atan, atan2,
acos, asin, log, exp, pow
```

**Rule**: `DeterministicKernels` contains exactly the functions that replace non-deterministic `Math.*` calls, plus `config` and `sinCos` (combined kernel). Nothing else.

### Decision 5: Document the standard

**Choice**: Add a section to `architecture-and-layers.md` codifying:

1. **L0 Kernel Rule**: Pure IEEE 754 deterministic replacements only. Returns NaN for domain errors (matching `Math.*` behavior). No clamping, no fallbacks, no "Safe" variants.
2. **L1 Safety Rule**: ALL domain-clamping, overflow-guarding, and fallback functions live here. Named `{fn}Safe`. Import raw kernels from L0 and add guards.
3. **Why no `sinSafe`/`cosSafe`/`tanSafe`/`atanSafe`**: Domain = all reals. No guard needed. Only functions with restricted domains (`acos` [-1,1], `asin` [-1,1], `log` (0,+inf), `exp` (overflow risk)) have Safe variants.
4. **Naming standard**: `{fn}Safe` suffix. No `Kernel` infix. No `Unsafe` prefix.

## Risks / Trade-offs

| Risk                                                                    | Impact   | Mitigation                                                                                        |
| ----------------------------------------------------------------------- | -------- | ------------------------------------------------------------------------------------------------- |
| `logKernelSafe` removal is BREAKING                                     | Very low | Zero internal consumers, not in barrel, only in DeterministicKernels namespace                    |
| `acosSafe` import from `@lenguados/math2d/deterministic` subpath breaks | Low      | Subpath is undocumented; consumer can switch to barrel import                                     |
| `DeterministicKernels.acosSafe` access breaks                           | Low      | Namespace consumers are rare (tree-shaking-hostile envs). Safety functions accessible via barrel. |
| `expSafe` moves from L0 to L1                                           | None     | Same function, same signature, same barrel export. Only source file changes.                      |

## Open Questions

None. All decisions are backed by industry evidence + internal consistency analysis.
