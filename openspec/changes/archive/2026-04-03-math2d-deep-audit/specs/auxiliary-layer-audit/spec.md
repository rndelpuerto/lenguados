## ADDED Requirements

### Requirement: powSafe IEEE 754 compliance (P2)

The `powSafe` function SHALL return 1 for `powSafe(NaN, 0)` per IEEE 754-2019 §9.2.1 `pow` semantics.

**Evidence:** IEEE 754-2019 defines three power functions: `pow`, `pown`, and `powr`. Both `pow` and `pown` specify `x^0 = 1` for ANY x including NaN. Only `powr` (which JavaScript does NOT implement) treats NaN^0 as invalid. C99 §7.12.7.4 confirms: `pow(base, ±0) = 1` for any base including NaN. ECMAScript spec mandates `Math.pow(NaN, 0) = 1`.

**Implementation:** Swap line ordering in `safety.ts:210-212` so `exponent === 0` is checked before the NaN check. Add comment: `// IEEE 754 pow semantics (not powr): x^0 = 1 for any x including NaN`.

**Priority rationale:** Downgraded from P0 to P2 after adversarial review. The scenario `powSafe(NaN, 0)` is unlikely in physics code, and there exists a legitimate alternative semantic (IEEE 754 `powr`), but JavaScript follows `pow` semantics so the fix is correct.

#### Scenario: NaN base with zero exponent

- **WHEN** `powSafe(NaN, 0)` is called
- **THEN** it SHALL return `1` (matching IEEE 754 `pow` and `Math.pow(NaN, 0)`)

#### Scenario: NaN propagation preserved for non-zero exponents

- **WHEN** `powSafe(NaN, 2)` is called
- **THEN** it SHALL return `NaN`

### Requirement: sinCosNormalized retention (completeness principle)

The `sinCosNormalized` function SHALL be KEPT, not removed.

**Evidence:** The devil's advocate identified that removing sinCosNormalized contradicts the library's own "completeness over minimalism" pillar (D-AF-03, 2026-03-21). The function is tree-shakeable (zero cost in production bundles that don't use it). The archaeologist discovered hidden rationale D-F1-07: the deterministic kernel uses `x % TAU` range reduction instead of Cody-Waite, which loses precision for angles >2^20 radians. `sinCosNormalized` pre-normalizes to `[-PI, PI)` before entering the kernel, providing genuinely better precision for very large accumulated angles — a real scenario in long-running physics simulations.

**Priority:** No action needed (KEEP as-is). The previous removal recommendation is REVERSED.

#### Scenario: Completeness principle upheld

- **WHEN** `sinCosNormalized` is evaluated for removal
- **THEN** it SHALL be KEPT — it provides precision value for large angles and follows the all-or-nothing completeness principle at zero bundle cost

### Requirement: remapSafe boundary precision (P3)

The `remapSafe` function SHALL include boundary early-returns matching `remap` behavior for exact endpoint mapping.

**Evidence:** Code verification confirmed (line-by-line in `arithmetic.ts:161-172`) that `remap()` has `if (value === inMin) return outMin` and `if (value === inMax) return outMax` early-returns, but `remapSafe()` does NOT. The 2026-03-20 audit claimed "REVERSED (bug does not exist)" but that claim was about degenerate-range handling (which IS correct), not boundary precision. The precision issue is distinct: without early-returns, `remapSafe(inMax, inMin, inMax, outMin, outMax)` computes `(inMax - inMin) / (inMax - inMin)` which may not equal exactly 1.0 due to floating-point arithmetic, producing a result ≠ `outMax`.

#### Scenario: Exact boundary mapping in remapSafe

- **WHEN** `remapSafe(inMin, inMin, inMax, outMin, outMax)` is called
- **THEN** it SHALL return exactly `outMin` (not a floating-point approximation)

#### Scenario: Exact upper boundary

- **WHEN** `remapSafe(inMax, inMin, inMax, outMin, outMax)` is called
- **THEN** it SHALL return exactly `outMax`

### Requirement: clampAngle JSDoc correction (P3)

The `clampAngle` JSDoc SHALL accurately describe the CCW arc semantics inherited from `isAngleBetween`.

**Evidence:** Code verification confirmed at `operations.ts:229` the JSDoc says "shortest arc" but the implementation delegates to `isAngleBetween()` which uses CCW arc semantics (documented at line 179).

#### Scenario: Documentation accuracy

- **WHEN** a developer reads the `clampAngle` `@remarks`
- **THEN** it SHALL say "CCW arc from min to max" instead of "shortest arc between min and max"

### Requirement: Vector2.angleTo DRY delegation (P2)

`Vector2.angleTo` SHALL delegate to `angleFromVectors` to eliminate duplicated cross/dot/atan2 logic.

**Evidence:** Code verification confirmed `Vector2.angleTo` (line 1396-1398) computes `atan2(Vector2.cross(a, b), Vector2.dot(a, b))` inline, which is identical to `angleFromVectors` in `operations.ts:285-289`. Per the "static owns logic" principle (D-F1-21), the computation should live in one place.

#### Scenario: Delegation correctness

- **WHEN** `Vector2.angleTo(a, b)` is called
- **THEN** it SHALL produce the same result as `angleFromVectors(a.x, a.y, b.x, b.y)`

### Requirement: unwrapAngles DRY refactor (P2)

The `unwrapAngles` and `unwrapAnglesInPlace` functions SHALL share internal iteration logic via a private helper.

**Evidence:** Code verification confirmed nearly identical loop logic in `unwrapping.ts:37-67` and `91-120`, differing only in output destination.

#### Scenario: Shared logic extraction

- **WHEN** the unwrap functions are refactored
- **THEN** both SHALL produce identical results to pre-refactor behavior for all inputs

### Requirement: roundToMultiple/snapToGrid documentation (P3)

The `roundToMultiple` function SHALL document its equivalence with `snapToGrid(value, multiple, 0)`.

#### Scenario: Cross-reference documentation

- **WHEN** a developer reads the `roundToMultiple` JSDoc
- **THEN** it SHALL include a `@see snapToGrid` reference explaining the equivalence

### Requirement: sign return type narrowing (P5)

The `sign` function SHALL return the type `-1 | 0 | 1` instead of `number`.

#### Scenario: Type-safe sign usage

- **WHEN** `sign(value)` is called
- **THEN** the return type SHALL be `-1 | 0 | 1`

### Requirement: flushDenormal addition (P4)

A `flushDenormal(value)` function SHALL be added as a companion to `isDenormal`.

**Evidence:** Denormal numbers cause 10-100x performance penalties on x86 CPUs without FTZ/DAZ flags. Physics engines running tight loops need this hygiene function. It is a pure numerical utility, not a physics algorithm.

#### Scenario: Denormal flushing

- **WHEN** `flushDenormal(5e-324)` is called (denormal value)
- **THEN** it SHALL return `0`
- **WHEN** `flushDenormal(1.5)` is called (normal value)
- **THEN** it SHALL return `1.5`

### Requirement: ceilPowerOfTwo and floorPowerOfTwo addition (P4)

`ceilPowerOfTwo` and `floorPowerOfTwo` functions SHALL be added to rounding.ts.

**Evidence:** three.js MathUtils includes both (DEFINITIVE from source code). Used for texture/buffer sizing and spatial hash grids.

#### Scenario: ceilPowerOfTwo behavior

- **WHEN** `ceilPowerOfTwo(5)` is called
- **THEN** it SHALL return `8`

#### Scenario: floorPowerOfTwo behavior

- **WHEN** `floorPowerOfTwo(5)` is called
- **THEN** it SHALL return `4`

### Requirement: powSafe 0^negative documentation (P3)

`powSafe` SHALL document that `powSafe(0, -n)` returns 0 (not Infinity).

**Evidence:** Expert review D-E1-04 established the formal \*Safe contract: "finite-in/finite-out." `0^(-1)` is mathematically Infinity, but Safe functions return finite fallbacks. This is intentional but must be documented.

#### Scenario: Documentation of 0^negative

- **WHEN** a developer reads `powSafe` JSDoc
- **THEN** it SHALL document that `powSafe(0, -2)` returns `0` (finite fallback, not `Infinity`)

### Requirement: isAngleBetween full-circle documentation (P3)

`isAngleBetween` SHALL document the edge case where `start === end` after normalization.

#### Scenario: Full-circle edge case

- **WHEN** a developer reads `isAngleBetween` `@remarks`
- **THEN** it SHALL note that when `start === end` (after normalization), the arc is a single point, not a full circle
