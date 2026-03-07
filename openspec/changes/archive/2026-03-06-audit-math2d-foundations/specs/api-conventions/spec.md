## MODIFIED Requirements

### Requirement: Naming convention for function variants

All fallible operations SHALL use suffix-based naming for their error-handling variants:

- `op()` — strict, throws on invalid input
- `opSafe()` — returns a defined fallback value, never throws
- `opUnchecked()` — no validation, undefined behavior on invalid input

The prefix form (`safeOp`) is NOT permitted. All existing prefix-form functions
MUST be renamed to suffix form.

**AUDIT SCOPE**: The suffix naming convention SHALL be validated against:

- Rust's naming conventions (`checked_add`, `wrapping_add`, `saturating_add` — prefix-based)
- GLSL function variants (no naming convention, different functions entirely)
- C++ STL (`at()` throws, `operator[]` unchecked — no naming pattern)
- The audit SHALL justify suffix over prefix with IDE autocomplete evidence (suffix groups `normalize`, `normalizeSafe`, `normalizeUnchecked` together)

#### Scenario: Suffix naming validated against industry

- **WHEN** the audit evaluates suffix naming for triality variants
- **THEN** it SHALL document whether Rust's prefix approach (`checked_*`) or the library's suffix approach (`*Safe`) provides better discoverability in TypeScript IDEs, with specific autocomplete comparison

#### Scenario: Strict variant receives invalid input

- **WHEN** a strict function (e.g., `divide(a, 0)`) receives invalid input
- **THEN** it SHALL throw an Error with a descriptive message

#### Scenario: Safe variant receives invalid input

- **WHEN** a Safe function (e.g., `divideSafe(a, 0)`) receives invalid input
- **THEN** it SHALL return a documented fallback value (e.g., 0) without throwing

#### Scenario: Unchecked variant receives invalid input

- **WHEN** an Unchecked function (e.g., `divideUnchecked(a, 0)`) receives invalid input
- **THEN** behavior is undefined; no validation is performed

---

### Requirement: Deterministic math usage policy

Functions that use trigonometric, logarithmic, exponential, or square root operations
SHALL use the deterministic kernel functions (`sin`, `cos`, `sqrt`, `atan2`, `log`, `exp`, `pow`
from `deterministic-kernels.ts`), never `Math.*` equivalents.

Functions that use `Math.floor`, `Math.ceil`, `Math.abs`, `Math.round`, `Math.min`,
`Math.max`, `Math.trunc` MAY use them directly — these are IEEE 754 deterministic.

**AUDIT SCOPE**: The deterministic policy SHALL be re-evaluated with:

- IEEE 754-2019 section citations for each function's determinism status
- Evidence of cross-engine divergence for `Math.sqrt` (required correctly-rounded by IEEE 754, but is the JS spec guarantee sufficient?)
- Whether `Math.hypot` is deterministic (implementation-dependent per ECMAScript spec)
- The `config.useNativeMath` toggle evaluated for completeness and correctness

#### Scenario: sqrt determinism resolved

- **WHEN** the audit evaluates `Math.sqrt` vs deterministic `sqrt`
- **THEN** it SHALL cite IEEE 754-2019 section 5.4.1 and ECMAScript spec section 21.3.2.32 to determine if `Math.sqrt` is guaranteed cross-platform deterministic, and recommend whether the library should use `Math.sqrt` or the fdlibm kernel

#### Scenario: Angle computation uses deterministic atan2

- **WHEN** a function computes an angle from coordinates
- **THEN** it SHALL use `atan2(y, x)` from deterministic-kernels, not `Math.atan2(y, x)`

#### Scenario: Floor division uses Math.floor

- **WHEN** a function performs floor division
- **THEN** it MAY use `Math.floor()` directly as it is IEEE 754 deterministic

---

### Requirement: API layers by usage scenario

Each significant operation SHALL be available at up to three layers, where the usage
scenario justifies it:

1. **Primitive** — Minimal, correct, no overhead. Free functions or static methods. Used directly in hot paths.
2. **Hot path** — Zero-allocation variant using `out` parameter and/or `*CS` precomputed values. For game loops, particle systems, simulations.
3. **Facade** — Ergonomic instance method, chainable, delegates to layers above. For setup code and general DX.

**AUDIT SCOPE**: The three-layer pattern SHALL be validated against:

- gl-matrix's single-layer approach (all functional, all out — does the layer system add value over this?)
- three.js's single-layer approach (all OOP — does the layer system add value over this?)
- Unity.Mathematics hybrid (static functions + operator overloads — does this map better to TS?)
- Whether three layers creates confusion about which to use, and if documentation sufficiently guides

#### Scenario: Layer selection guidance validated

- **WHEN** the audit evaluates the three-layer documentation
- **THEN** it SHALL determine whether a typical user can immediately know which layer to use for their scenario, citing API usability studies or developer survey data from three.js/gl-matrix communities

#### Scenario: Vector rotation in game loop

- **WHEN** a developer rotates 1000 vectors by the same angle per frame
- **THEN** they can compute `sinCos(angle)` once (primitive), then call `Vector2.rotateCS(v, cos, sin, out)` per vector (hot path), avoiding per-call trig and allocation
