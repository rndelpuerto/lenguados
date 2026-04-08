## Why

The `deterministic-kernels.ts` module has grown organically, mixing two concerns: **pure deterministic math kernels** (fdlibm replacements for `Math.*`) and **domain-clamping Safe wrappers** (`acosSafe`, `asinSafe`, `logKernelSafe`, `expSafe`). This creates 8 DX issues including naming inconsistencies, double-exports, fragile barrel re-exports, and an asymmetric public API.

**Industry evidence** (11 libraries surveyed: gl-matrix, Three.js, Box2D, Unity, Godot, Unreal, Rapier/nalgebra, Eigen, NumPy, GLSL, fdlibm):

- **0/11 libraries** have Safe variants of scalar math functions at the kernel level
- **fdlibm** (the explicit architectural ancestor of this module) separates `e_acos.c` (kernel, pure IEEE 754, returns NaN) from `w_acos.c` (wrapper, adds error handling). Safety is in the wrapper, not the kernel.
- **Rapier/nalgebra** (the closest Rust parallel) uses compile-time feature flags to swap `libm` kernels in/out — no Safe variants on the kernels themselves
- When libraries DO have Safe variants (Unreal `GetSafeNormal`, nalgebra `try_normalize`, Eigen `stableNormalize`), they exist at the **vector/geometry level**, not the scalar math level

**Current problems:**

1. `logKernelSafe` is the only function with a `Kernel` infix — inconsistent with `acosSafe`/`asinSafe`/`expSafe`
2. `logKernelSafe` is NOT in `index.ts` barrel but `expSafe` IS — asymmetric
3. `acosSafe`/`asinSafe` are double-exported: once from `deterministic-kernels.ts` via explicit export, AND again via `export * from './auxiliary/numeric'` (which re-exports them from `safety.ts`) — fragile
4. `logKernelSafe` (L0, single-arg) coexists with `logSafe` (L1, multi-base) — confusing name collision
5. `DeterministicKernels` namespace has 4 Safe variants but not `sqrtSafe`/`logSafe`/`powSafe` (which live in L1) — inconsistent membership rule
6. Three import paths for the same function (barrel, namespace, subpath) with no documented guidance
7. The `./deterministic` subpath exists but is undocumented
8. No `./auxiliary` subpath despite auxiliary having a strong architectural identity

## What Changes

### Kernel Purification (L0)

Remove all Safe variants from `deterministic-kernels.ts`. The kernel becomes a **pure IEEE 754 deterministic math layer** — exactly mirroring fdlibm's `e_*.c` kernel files:

- Remove `acosSafe` from deterministic-kernels.ts
- Remove `asinSafe` from deterministic-kernels.ts
- Remove `logKernelSafe` from deterministic-kernels.ts
- Remove `expSafe` from deterministic-kernels.ts
- Remove all four from the `DeterministicKernels` namespace object

### Safety Consolidation (L1)

Move all domain-clamping logic to `auxiliary/numeric/safety.ts` where the other Safe functions already live:

- Add `acosSafe(x)` to safety.ts (1-line: clamp + delegate to deterministic `acos`)
- Add `asinSafe(x)` to safety.ts (1-line: clamp + delegate to deterministic `asin`)
- Add `expSafe(x)` to safety.ts (clamp overflow to MAX_VALUE/0)
- Rename `logKernelSafe` → `logSafe` is already taken → the existing `logSafe(value, base?)` in safety.ts already handles the natural-log case (`base` defaults to `Math.E`). No new function needed; `logKernelSafe` is simply deleted.

### Export Cleanup

- Remove the explicit `acosSafe`/`asinSafe`/`expSafe` re-exports from `index.ts` (they'll be exported via `export * from './auxiliary/numeric'` — single path)
- Remove `logKernelSafe` from everywhere (superseded by existing `logSafe`)
- `DeterministicKernels` namespace becomes PURE: only `config` + 12 math kernels, zero Safe variants

### Documentation

- Document the standard in `.claude/rules/architecture-and-layers.md`: "L0 kernels are pure IEEE 754 replacements. Safe variants belong in L1 auxiliary."
- Document why `sinSafe`/`cosSafe`/`tanSafe`/`atanSafe` don't exist (domain = all reals, no guard needed)
- Document the import strategy: barrel for most users, `./deterministic` for kernel-only consumers

## Capabilities

### Modified Capabilities

- `deterministic-kernel-purification`: Remove 4 Safe functions from L0, making it a pure kernel layer
- `safety-consolidation`: Consolidate all Safe math in L1 auxiliary/numeric/safety.ts
- `export-cleanup`: Single export path for each function, no double-exports
- `api-standard-documentation`: Codify the kernel vs safety layer boundary in project rules

## Impact

- **Affected code**: `deterministic/deterministic-kernels.ts`, `auxiliary/numeric/safety.ts`, `index.ts`, `.claude/rules/architecture-and-layers.md`
- **APIs**: `logKernelSafe` removed (BREAKING — but zero internal consumers, zero barrel exports). `acosSafe`/`asinSafe`/`expSafe` remain accessible from `@lenguados/math2d` with identical signatures — only their source layer changes.
- **Breaking for subpath consumers**: Anyone importing `acosSafe` from `@lenguados/math2d/deterministic` would need to switch to `@lenguados/math2d` or `@lenguados/math2d/auxiliary`. Since the subpath is undocumented, this is low-risk.
- **Bundle size**: No change (same functions, different file)
- **Deterministic guarantees**: Unchanged (Safe functions still delegate to deterministic kernels)
- **DeterministicKernels namespace**: Shrinks from 17 to 13 entries. Becomes a pure, predictable set.
