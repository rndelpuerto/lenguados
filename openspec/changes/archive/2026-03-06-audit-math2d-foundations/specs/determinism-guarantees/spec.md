## ADDED Requirements

### Requirement: fdlibm kernel accuracy validated against reference implementation

The deterministic kernel functions (sin, cos, tan, asin, acos, atan, atan2, sqrt, exp, log, pow,
hypot) SHALL be validated against the original Sun/Oracle fdlibm C source code to confirm:

1. The polynomial coefficients match the fdlibm source exactly
2. The argument reduction strategy is identical
3. The output matches fdlibm to within 1 ULP for a representative test suite

#### Scenario: sin kernel coefficients match fdlibm

- **WHEN** the audit compares the polynomial coefficients in `deterministic-kernels.ts` sin implementation
- **THEN** they SHALL match the coefficients in Sun's `__kernel_sin` (fdlibm e_sin.c) bit-for-bit

#### Scenario: cos argument reduction matches fdlibm

- **WHEN** the audit traces the argument reduction in the cos implementation
- **THEN** it SHALL follow the same strategy as fdlibm's `__ieee754_rem_pio2` for range reduction, or document any deviation with justification

#### Scenario: Output accuracy within 1 ULP

- **WHEN** the audit tests each kernel function against fdlibm reference values at 1000+ sample points (including edge cases: 0, PI/4, PI/2, PI, 2\*PI, denormals, near-overflow)
- **THEN** all results SHALL match within 1 ULP, or deviations SHALL be documented with error bounds

---

### Requirement: Cross-platform determinism guarantees documented with evidence

The L0 determinism claim (bit-exact results across all JS engines, OSes, and CPU architectures)
SHALL be validated by documenting:

1. Which operations are IEEE 754 deterministic by specification (add, sub, mul, div, sqrt, floor, ceil, trunc, round, abs, min, max)
2. Which operations are NOT IEEE 754 deterministic (sin, cos, tan, exp, log, pow, atan2) and why fdlibm replacements are necessary
3. The specific JS engines and platforms where `Math.sin` etc. are known to differ
4. Evidence from Glenn Fiedler's "Floating Point Determinism" (Gaffer On Games), GGPO documentation, and Photon Engine's determinism model

#### Scenario: IEEE 754 deterministic operations identified

- **WHEN** the audit catalogs all basic arithmetic operations used in the library
- **THEN** operations guaranteed deterministic by IEEE 754 (correctly-rounded) SHALL be listed, citing IEEE 754-2019 section 5.1

#### Scenario: Non-deterministic Math.\* operations cataloged

- **WHEN** the audit identifies operations that vary across platforms
- **THEN** each SHALL be documented with specific examples of divergence (e.g., V8 vs SpiderMonkey vs JavaScriptCore for `Math.sin(1e15)`), citing browser bug trackers or engine documentation

#### Scenario: Determinism policy completeness

- **WHEN** the audit checks that no `Math.sin`, `Math.cos`, `Math.tan`, `Math.exp`, `Math.log`, `Math.pow`, `Math.atan2` calls exist outside deterministic-kernels.ts
- **THEN** zero direct `Math.*` calls for non-deterministic functions SHALL be found in any layer other than the deterministic kernel (or behind the `config.useNativeMath` toggle)

---

### Requirement: config.useNativeMath toggle evaluated for correctness

The `config.useNativeMath` toggle that switches between fdlibm and native `Math.*` SHALL be
evaluated for:

1. Whether it correctly applies to ALL kernel functions (no partial switching)
2. The performance delta between fdlibm and native Math (benchmarked)
3. The use cases where native Math is acceptable (non-networked games, single-player, tools)
4. Whether this pattern exists in reference engines (Rapier's determinism toggle, Photon Engine's deterministic mode)

#### Scenario: Toggle applies globally

- **WHEN** `config.useNativeMath = true` is set
- **THEN** ALL kernel functions (sin, cos, sqrt, atan2, etc.) SHALL use `Math.*` — no partial switching

#### Scenario: Toggle documented with use cases

- **WHEN** the audit evaluates the toggle
- **THEN** it SHALL document when to use native Math (performance-sensitive single-player) vs fdlibm (networked lockstep), citing Rapier's approach and Glenn Fiedler's recommendations

---

### Requirement: sinCos optimization evaluated against alternatives

The `sinCos(angle)` function that computes both sin and cos simultaneously SHALL be evaluated
against:

1. Whether it uses a shared computation path (as in GLSL `sincos`, or Cephes library)
2. Whether computing sin+cos together is actually faster than separate calls in JS
3. How reference libraries handle this (GLSL built-in, Unity.Mathematics math.sincos, Godot's Vector2.from_angle)
4. Whether the SinCos interface and out parameter pattern is optimal for DX

#### Scenario: sinCos performance justified

- **WHEN** the audit benchmarks `sinCos(x)` vs `{ sin: sin(x), cos: cos(x) }`
- **THEN** it SHALL document whether the combined function provides measurable benefit in JS, noting that unlike GLSL/C, JS has no hardware sincos instruction

#### Scenario: sinCos interface design evaluated

- **WHEN** the audit evaluates the `SinCos` interface `{ sin: number; cos: number }`
- **THEN** it SHALL compare against alternatives (tuple `[sin, cos]`, destructured return, out parameter with typed array) and justify the current choice vs DX and allocation cost

---

### Requirement: Deterministic kernel scope boundaries defined

The audit SHALL produce a definitive classification of which operations MUST use deterministic
kernels and which MAY use native Math, with justification from IEEE 754:

**MUST use deterministic kernel (implementation-dependent in IEEE 754):**

- sin, cos, tan, asin, acos, atan, atan2
- exp, log, pow
- hypot (due to intermediate overflow handling)

**MAY use native Math (correctly-rounded by IEEE 754):**

- sqrt (required correctly-rounded by IEEE 754-2019 section 5.4.1)
- floor, ceil, round, trunc (integer conversions, exact)
- abs, min, max (exact operations)
- fma (if available, correctly-rounded)

**Requires analysis:**

- sqrt: IEEE 754 requires correctly-rounded, but JS engines may differ in edge case handling
- hypot: The specification says "implementation-dependent" but some engines use correctly-rounded

#### Scenario: sqrt classification resolved

- **WHEN** the audit evaluates whether `sqrt` needs a deterministic kernel
- **THEN** it SHALL cite IEEE 754-2019 section 5.4.1 (sqrt is a required operation, correctly-rounded) and test across V8, SpiderMonkey, and JavaScriptCore to confirm cross-platform agreement

#### Scenario: All kernel functions classified

- **WHEN** the audit completes the classification
- **THEN** every mathematical function used in the library SHALL be classified as MUST/MAY/SHOULD-NOT use deterministic kernel, with IEEE 754 section citations

---

### Requirement: Error propagation through composite operations analyzed

The audit SHALL analyze how errors propagate through composite operations that chain multiple
kernel calls, producing documented error bounds for:

1. `Rotation2.fromAngle(angle)` — involves sin(angle), cos(angle)
2. `Vector2.rotate(angle)` — involves sinCos + multiply + add
3. `Matrix3.multiply(a, b)` — involves 9 multiply-add chains
4. `Transform2.compose(a, b)` — involves rotation composition + scale + translation

#### Scenario: Rotation2 error bound documented

- **WHEN** the audit analyzes `Rotation2.fromAngle(angle)`
- **THEN** it SHALL document the maximum deviation of `cos^2 + sin^2` from 1.0 using fdlibm kernels, citing the individual kernel error bounds

#### Scenario: Matrix3 multiply error accumulation

- **WHEN** the audit analyzes `Matrix3.multiply` error propagation
- **THEN** it SHALL document the condition number sensitivity and recommend normalization frequency, citing Higham's backward error analysis for matrix multiplication
