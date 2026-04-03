## ADDED Requirements

### Requirement: All L0 deterministic kernels are present and correctly classified

`deterministic/` SHALL contain fdlibm-based implementations of: `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `sqrt`, `exp`, `log`, `pow`, `hypot`. A combined `sinCos` kernel SHALL exist for hot-path use (avoids two separate calls). The `expSafe` and `logSafe` safe variants SHALL handle domain edge cases (negative input for log, overflow for exp). The `config` export SHALL allow switching between deterministic and native Math.\* for benchmarking purposes only.

#### Scenario: All standard trig functions are present

- **WHEN** the audit enumerates exports from `deterministic/`
- **THEN** sin, cos, tan, asin, acos, atan, atan2, sqrt, exp, log, pow, hypot SHALL all be present

#### Scenario: `sinCos` returns a SinCos object atomically

- **WHEN** `sinCos(θ)` is called
- **THEN** result SHALL have `cos` and `sin` fields matching `cos(θ)` and `sin(θ)` independently within L0 tolerance

#### Scenario: `config` does not affect L0 contract when deterministic mode is active

- **WHEN** deterministic mode is enabled via `config`
- **THEN** all kernel results SHALL be bit-exact regardless of JS engine (V8, SpiderMonkey, JSC)

---

### Requirement: fdlibm polynomial coefficients are not modified

The fdlibm polynomial coefficients used in sin, cos, atan2, etc. SHALL NOT be changed as part of this audit. Any finding related to the deterministic layer SHALL be limited to: naming, placement, missing functions, or missing safe variants. Changes to polynomial coefficients require a dedicated L0 validation campaign.

#### Scenario: Audit findings are structural only

- **WHEN** the audit produces verdicts for `deterministic/` exports
- **THEN** no verdict SHALL be "modify the polynomial coefficients" — only KEEP/ADD/REMOVE/RENAME/RESTRUCTURE are valid

---

### Requirement: `sinCos` in auxiliary/angle/operations routes through deterministic kernels

The `sinCos` function exported from `auxiliary/angle/operations.ts` SHALL call the deterministic `sin` and `cos` from `deterministic/`, not `Math.sin`/`Math.cos`. If the current implementation uses the native `Math.*` functions, this is a **RESTRUCTURE** finding requiring a fix before any physics-layer package can guarantee determinism.

#### Scenario: Determinism propagation audit

- **WHEN** the audit traces the call chain from `auxiliary/angle/operations.sinCos`
- **THEN** the call chain SHALL reach `deterministic/sin` and `deterministic/cos`

---

### Requirement: Deterministic kernels have no external dependencies

All files in `deterministic/` SHALL have zero imports from other layers (`auxiliary/`, `core/`, `types/`, `validation/`, `utils/`). They MAY import from each other (e.g., internal helper constants). This is the L0 isolation invariant.

#### Scenario: Zero-dependency check

- **WHEN** the audit scans import statements in all `deterministic/` source files
- **THEN** no import from `../auxiliary`, `../core`, `../types`, `../validation`, or `../utils` SHALL exist

---

### Requirement: `pow` and `hypot` deterministic variants are justified

`pow` (deterministic) and `hypot` (deterministic) SHALL be present in the layer. The audit SHALL verify that they are actually bit-exact (not just wrappers around `Math.pow`/`Math.hypot`). If a kernel is a direct wrapper with no polynomial correction, it SHALL be documented with the reason (e.g., "native Math.hypot is already deterministic in V8/SpiderMonkey/JSC for 2D inputs").

#### Scenario: `pow(x, 0.5)` equals `sqrt(x)` deterministically

- **WHEN** `pow(4.0, 0.5)` and `sqrt(4.0)` are called
- **THEN** both SHALL return exactly 2.0 and SHALL be bit-identical across engines

#### Scenario: `hypot(3, 4)` returns exactly 5

- **WHEN** `hypot(3, 4)` is called
- **THEN** result SHALL be 5.0 (exact IEEE-754 result for this Pythagorean triple)

---

### Requirement: Safe variants handle all domain errors

`expSafe` and `logSafe` SHALL be the only safe variants in `deterministic/`. All other safe wrappers belong in `auxiliary/numeric/safety.ts`. `acosSafe` and `asinSafe` SHALL live in `auxiliary/numeric/safety.ts` (they clamp the input, not correct polynomial approximations).

#### Scenario: `logSafe(0)` returns a finite fallback

- **WHEN** `logSafe(0, -Infinity)` is called
- **THEN** result SHALL be -Infinity (or the provided fallback) without throwing

#### Scenario: `acosSafe` lives in numeric/safety not deterministic/

- **WHEN** the audit checks the location of `acosSafe`
- **THEN** it SHALL be in `auxiliary/numeric/safety.ts`, importing the deterministic `acos` kernel
