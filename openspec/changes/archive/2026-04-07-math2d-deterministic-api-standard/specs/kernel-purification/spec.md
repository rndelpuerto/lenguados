## REMOVED Requirements

### Requirement: deterministic-kernels SHALL NOT contain Safe variants

The following functions SHALL be removed from `deterministic-kernels.ts`:

- `acosSafe`
- `asinSafe`
- `logKernelSafe`
- `expSafe`

The `DeterministicKernels` namespace object SHALL NOT contain any Safe variant entries.

**Evidence:**

1. **fdlibm precedent**: fdlibm separates `e_acos.c` (kernel, pure, returns NaN for domain errors) from `w_acos.c` (wrapper, adds POSIX error handling). lenguados' L0 layer corresponds to fdlibm's `e_*.c` kernels.

2. **Industry consensus**: 0/11 surveyed libraries (gl-matrix, Three.js, Box2D, Unity, Godot, Unreal, Rapier, Eigen, NumPy, GLSL, fdlibm) have Safe variants at the scalar math kernel level.

3. **Module's own stated purpose**: The file header says "This module contains ONLY functions that are NOT deterministic in native JavaScript." Domain clamping (`x <= -1 ? PI : acos(x)`) uses only deterministic operations — it does not need to be in L0.

4. **`logKernelSafe`** has zero internal consumers and is not in the barrel export.

#### Scenario: deterministic-kernels exports only pure math

- **GIVEN** the `deterministic-kernels.ts` module
- **WHEN** a developer inspects its exports
- **THEN** every exported function SHALL be a pure deterministic replacement for a `Math.*` function
- **AND** no function with `Safe` in its name SHALL be exported

#### Scenario: DeterministicKernels namespace is pure

- **GIVEN** the `DeterministicKernels` namespace object
- **WHEN** its entries are enumerated
- **THEN** it SHALL contain exactly: `config`, `hypot`, `sin`, `cos`, `sinCos`, `tan`, `atan`, `atan2`, `acos`, `asin`, `log`, `exp`, `pow`
- **AND** it SHALL NOT contain `acosSafe`, `asinSafe`, `logKernelSafe`, or `expSafe`

#### Scenario: logKernelSafe is fully removed

- **GIVEN** the codebase
- **WHEN** searching for `logKernelSafe`
- **THEN** zero matches SHALL be found in any source file
