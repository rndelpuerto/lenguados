## ADDED Requirements

### Requirement: deterministic-kernels acos/asin — NEVER IMPROVE the kernel in isolation

The current `acos(x) = atan2(sqrt(1-x*x), x)` kernel SHALL NOT be replaced with fdlibm's half-angle substitution. The decision is grounded in information theory.

**Three distinct error sources (must NOT be conflated):**

1. **Source A — Representation loss (inherent to IEEE 754):** `cos(θ)` stored as `double` loses bits: `bits_of_θ ≈ 52 - 2*⌈log₂(1/θ)⌉`. At θ=1e-6, only ~12 bits survive. This is an information-theoretic limit of the representation, not a computation bug.
2. **Source B — Dot product computation error (~1.5 ULP):** Negligible relative to Source A.
3. **Source C — acos `1-x*x` cancellation (~1 extra bit):** Fixable with half-angle `(1-x)/2` (exact by Sterbenz's lemma for 0.5 ≤ x ≤ 1). But dominated by Source A.

**Why fixing Source C alone doesn't help:** Eliminating the ~1 extra bit from Source C while Source A loses ~12-35 bits yields only a 1.07-1.17× improvement for realistic inputs. The physical worst-case error is 0.016 nanopixels.

**The versine alternative EXISTS but belongs at the caller level:** An algorithm `θ = 2*asin(|a-b|/2)` avoids `cos(θ)` entirely, preserving full 52-bit precision. This WOULD justify a precision-preserving `asin`. But it requires a NEW algorithm (`angleBetweenPrecise`), not a kernel fix. The library already handles small angles via `atan2(cross, dot)` for signed angles and slerp→lerp fallback for interpolation.

**Risk of kernel change:** L0 determinism breaking change, 38 tests affected, all replay/sync systems invalidated.

**References:** Higham (2002) Ch.1, Sterbenz (1974), fdlibm e_acos.c, IEEE 754-2019, Kahan (1996), Box2D source.

#### Scenario: Kernel improvement rejected

- **WHEN** the acos kernel precision is evaluated in any future audit
- **THEN** it SHALL NOT be modified — Source A (representation) dominates Source C (computation) by orders of magnitude

#### Scenario: No `angleBetweenPrecise` method SHALL be added

- **WHEN** a versine-based high-precision angle method is considered
- **THEN** it SHALL NOT be added to math2d — it fails 3 of 4 selection criteria (no Box2D equivalent, no family completion, no physics need), composes trivially (4 lines), the name `*Precise` violates naming conventions (established suffixes: `Safe`/`Unchecked`/`CS`), and no 2D physics scenario requires sub-nanopixel angle precision. Consumers can compose the formula from existing primitives.

#### Scenario: Current architecture is already correct

- **WHEN** signed angles: `angleFromVectors` uses `atan2(cross, dot)` — well-conditioned at all scales (cross ≈ θ for small θ, full precision)
- **WHEN** slerp at small angles: falls back to `lerp` — exact first-order Taylor approximation
- **WHEN** unsigned angle: `angleBetween` produces 0.016-nanopixel worst-case error

### Requirement: deterministic-kernels ieeeBuffer documentation (P3)

The shared `ieeeBuffer` SHALL have documentation of the call-graph invariant.

**Evidence:** Code verification confirmed at `deterministic-kernels.ts:178-180` there IS a reentrancy warning comment, but it does NOT trace the actual call graph. The archaeologist found that `pow` calls both `log` and `exp` sequentially (safe), but this is fragile to future changes.

#### Scenario: Call-graph documentation

- **WHEN** a developer reads the `ieeeBuffer` declaration
- **THEN** it SHALL include the verified call chain: "Used by `log` and `pow2`. `pow` calls `log` then `exp` (sequential, safe). `exp` calls `pow2`. No nesting occurs in the current call graph."

### Requirement: deterministic-kernels expSafe semantics documentation (P3)

`expSafe` SHALL document its overflow/underflow return semantics.

**Evidence:** Code verification confirmed at `deterministic-kernels.ts:883-897`: positive overflow returns `Number.MAX_VALUE` (not `Infinity`), negative overflow returns `0`. This is unusual — most "safe" functions return the nearest representable value.

#### Scenario: Overflow behavior documented

- **WHEN** a developer reads `expSafe` JSDoc
- **THEN** it SHALL state: "Returns `Number.MAX_VALUE` for positive overflow (not `Infinity`) and `0` for negative overflow. This matches the Safe contract (finite-in/finite-out per D-E1-04)."

### Requirement: types ReadonlySinCos consideration (P5)

The types module SHALL consider adding a `ReadonlySinCos` interface.

**Evidence:** All other value types have Readonly variants. `SinCos` at `types/index.ts:436-441` has mutable fields. For cached angle lookup tables (a real physics scenario), readonly protection would match the pattern.

#### Scenario: Readonly consistency

- **WHEN** `SinCos` values are stored in a lookup table
- **THEN** `ReadonlySinCos` with `readonly sin: number; readonly cos: number` SHALL be available

### Requirement: validation assert tree-shakeability confirmed

All assertion functions correctly implement the DCE pattern. No changes needed.

**Evidence:** Code verification confirmed `DEV_MODE` check at lines 79-82, and all assertion functions use `if (!DEV_MODE) return;` as first statement. The pattern matches React's DCE approach (D-F1-22).

#### Scenario: Production elimination

- **WHEN** built with `NODE_ENV=production`
- **THEN** all assertion bodies SHALL be dead-code-eliminated by Rollup/bundler

### Requirement: utils barrel file consideration (P5)

Consider adding `utils/index.ts` for simplified imports.

#### Scenario: Simplified path

- **WHEN** a user wants to import `parseVector2`
- **THEN** they could import from `@lenguados/math2d/utils` (in addition to the specific sub-path)

### Requirement: SeededRandomSource deterministic compliance confirmed

The xoshiro128++ PRNG is well-validated for physics simulation.

**Evidence:** Blackman & Vigna, "Scrambled Linear PRNGs" (ACM TOMS 2021). The ++ scrambler passes all known statistical tests. It is the authors' "first choice for 32-bit all-purpose generation." Rust's `rand` crate uses it as `SmallRng`. The rejection sampling in `nextInt` correctly eliminates modulo bias (D-E1-06 replaced Park-Miller LCG which failed SmallCrush).

#### Scenario: Deterministic reproducibility

- **WHEN** `new SeededRandomSource(42)` is created on different platforms
- **THEN** the sequence SHALL be bit-identical (only uses integer arithmetic, `Math.imul`, bitwise ops, and division by 2^32)

### Requirement: main barrel export completeness confirmed

The main barrel correctly re-exports all public layers. No changes needed.

**Evidence:** Code verification confirmed `src/index.ts` exports types, all three auxiliary modules, core, deterministic functions, and validation.

#### Scenario: Complete exports

- **WHEN** importing from `@lenguados/math2d`
- **THEN** all public types, core classes, auxiliary functions, deterministic functions, and assertion functions SHALL be available

### Requirement: Documentation additions (P3)

Multiple documentation improvements across the infrastructure layer.

#### Scenario: roundToPlaces overflow documentation

- **WHEN** a developer reads `roundToPlaces` JSDoc
- **THEN** it SHALL document that extreme `places` values (>308) cause overflow to NaN

#### Scenario: sanitizeNumber NaN fallback documentation

- **WHEN** a developer reads `sanitizeNumber` JSDoc
- **THEN** it SHALL document that a NaN fallback produces NaN output (unlike `ensureFinite` which guards the fallback)
