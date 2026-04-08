## ADDED Requirements

### Requirement: L0/L1 boundary standard SHALL be documented

The file `.claude/rules/architecture-and-layers.md` SHALL include a section defining the boundary between the deterministic kernel layer (L0) and the auxiliary safety layer (L1).

**Content requirements:**

1. **L0 Kernel Rule**: "L0 contains ONLY pure deterministic replacements for non-deterministic `Math.*` functions. Each kernel accepts any IEEE 754 double and returns the IEEE 754-specified result (including NaN for domain errors). No clamping, no fallbacks, no Safe variants."

2. **L1 Safety Rule**: "ALL domain-clamping, overflow-guarding, and fallback-returning functions live in `auxiliary/numeric/safety.ts`. Named `{fn}Safe`. Import raw kernels from L0 and add guards."

3. **Safe existence criteria**: "A Safe variant exists when the underlying function has a restricted domain or produces non-finite output for finite input:
   - `acosSafe`/`asinSafe`: domain [-1, 1]
   - `logSafe`: domain (0, +inf)
   - `expSafe`: range can overflow to Infinity
   - `sqrtSafe`: domain [0, +inf)
   - `powSafe`: complex edge cases (0^neg, neg^frac)
     Functions with unrestricted real domain (`sin`, `cos`, `tan`, `atan`, `atan2`) do NOT have Safe variants."

4. **Naming standard**: "`{fn}Safe` suffix. No `Kernel` infix. No `Unsafe` prefix. No `stable` prefix. The `Safe` suffix is consistent across all layers."

5. **DeterministicKernels namespace rule**: "Contains exactly the pure L0 kernel functions plus `config`. No Safe variants. No auxiliary-layer functions."

#### Scenario: new developer adds a deterministic function

- **GIVEN** a developer adding `sinh` to the deterministic kernels
- **WHEN** they consider whether to add `sinhSafe`
- **THEN** the rules SHALL direct them to add the Safe variant in `auxiliary/numeric/safety.ts`, NOT in `deterministic-kernels.ts`
- **AND** the `DeterministicKernels` namespace SHALL include only `sinh`, not `sinhSafe`

#### Scenario: new developer adds a Safe function

- **GIVEN** a developer adding a Safe wrapper for any deterministic kernel
- **WHEN** they choose where to place it
- **THEN** the rules SHALL direct them to `auxiliary/numeric/safety.ts`
- **AND** the naming SHALL be `{kernelName}Safe` with no additional infixes

### Requirement: Document why certain Safe variants don't exist

The `architecture-and-layers.md` or the deterministic-kernels module header SHALL explain:

- `sin`/`cos`/`tan`/`atan`/`atan2` accept all real numbers as input — no domain restriction to guard
- `hypot` accepts all real numbers — no domain restriction
- `pow` has edge cases handled by `powSafe` in L1 — not in L0

#### Scenario: user searches for sinSafe

- **GIVEN** a user searching the codebase for `sinSafe`
- **WHEN** they find no match
- **THEN** the documentation SHALL explain that `sin` accepts all real inputs and needs no Safe variant
