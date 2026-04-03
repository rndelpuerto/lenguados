# Findings — math2d-comprehensive-review

**Date:** 2026-03-21
**Scope:** Every `.ts` file in `packages/math2d/src/` (32 files across 6 layers)
**Agents:** 16 (4 layer + 7 core type + 2 support + 2 cross-cutting + 1 adversarial)

---

## Summary Statistics

| Priority  | Count  | Category                   |
| --------- | ------ | -------------------------- |
| P0        | 0      | Bugs                       |
| P1        | 3      | API inconsistency          |
| P2        | 8      | Missing features / quality |
| P3        | 2      | Polish / documentation     |
| **Total** | **13** |                            |

| Verdict                       | Approved | Rejected | Status                                  |
| ----------------------------- | -------- | -------- | --------------------------------------- |
| From adversarial review       | 13       | 2        | 2 false positives filtered out          |
| From post-review verification | —        | 1        | F2 removed (L1a agent factually wrong)  |
| Reclassified by verification  | 2        | —        | F3 P1→P2, F6 P1→P2                      |
| Reinstated by verification    | 1        | —        | sqrtSafe re-export reinstated as F13 P2 |

### False Positives from Previous Audits (Corrected)

These items were flagged in prior iterations but verified as **incorrect** by this review:

1. ~~Complex.slerp instance missing zero-magnitude guard~~ — **FALSE**: both versions identical (lines 772 vs 2354)
2. ~~Complex.pow instance missing 0^(-n) validation~~ — **FALSE**: both versions identical (lines 1205 vs 2000)
3. ~~Matrix3 missing static getTranslation/getScale/getRotation~~ — **FALSE**: all exist (lines 1934, 1960, 1985)
4. ~~Transform2.multiply() allocates temp Rotation2~~ — **FALSE**: already optimized inline (comment at line 1921)
5. ~~Transform2 missing negate~~ — **INTENTIONAL**: negating an SRT transform is semantically undefined

### Adversarial Rejections (This Review)

These findings were raised by layer agents but rejected after adversarial + post-review verification:

1. ~~nearEquals epsilon validation after fast-path (original F2)~~ — **REMOVED**: L1a agent was factually wrong. Code at `comparison.ts:36-40` validates epsilon BEFORE fast-path. All 8 functions in the file follow the correct pattern. Both A1 and A2 approved this finding without verifying against actual code.
2. ~~Constants frozen object incomplete~~ — **REJECTED by A1**: all essential constants are included in the frozen object. Verified correct.
3. ~~remap() endpoint guard inconsistency with inverseLerp()~~ — **REJECTED**: remap's endpoint guards are intentional precision optimizations. **Note:** A1's reasoning was factually wrong (claimed inverseLerp doesn't exist — it does at `interpolation.ts:92` with full three-tier pattern), but the conclusion was correct: the behavioral difference is intentional design.
4. ~~Matrix3 trunc() tests missing~~ — **REJECTED by A1**: test exists in `coverage-boost.node.spec.ts:281-283`. Verified correct.

---

## Approved Findings

### P1 — API Inconsistency (Fix Before Release)

#### F1. Rotation2 `inversed` getter should be `inverted`

- **File:** `core/rotation2.ts:1586`
- **Current:** `get inversed(): Rotation2`
- **Recommended:** Rename to `get inverted(): Rotation2`
- **Justification (Completeness):** Matrix2 (line 2195), Matrix3 (line 2927), and Transform2 (line 2164) all use `inverted`. Rotation2 is the only type using `inversed`. Library-wide naming must be uniform.
- **A1:** APPROVED — API regularity required for completeness
- **A2:** DX-BLOCKED — inconsistent naming creates cognitive load and bugs
- **Breaking:** Yes

#### F4. randomOnSegment / randomInTriangle accept concrete types

- **File:** `utils/random.ts:477-479, 510-513, 554-557`
- **Current:** Parameters typed as `ReadonlyVector2` (concrete class)
- **Recommended:** Change to `ReadonlyVector2Like` (interface) for all position parameters
- **Justification (Completeness):** Library convention: all input params use `Readonly*Like`. Users with POJOs `{x, y}` cannot pass them without type assertion.
- **A1:** APPROVED — API regularity across all functions
- **A2:** DX-CONCERN — breaks ergonomics for POJO users
- **Breaking:** No (wider type accepts all existing inputs)

#### F5. formatMatrix3 'nested' format missing outer brackets

- **File:** `utils/parse.ts:537-542`
- **Current:** Outputs `[1,2,3],[4,5,6],[7,8,9]` (no outer brackets)
- **Recommended:** Output `[[1,2,3],[4,5,6],[7,8,9]]` (valid nested array)
- **Justification (Completeness):** Inconsistent with Matrix2 nested format (line 402-403) which correctly includes outer brackets. Not valid JSON array-of-arrays.
- **A1:** APPROVED — output format should match semantic intent
- **A2:** DX-APPROVED — improves parsing/formatting symmetry
- **Breaking:** Yes (output format changes, but parser accepts both)

---

### P2 — Missing Features / Quality (Plan for Next Iteration)

#### F3. assertRotation2 doesn't validate unit constraint

- **File:** `validation/assert.ts:552-587`
- **Current:** Only validates finiteness of cos and sin components. Does NOT check `cos² + sin² ≈ 1`. JSDoc at line 557 explicitly documents this: "Does NOT validate that cos² + sin² = 1 (unit constraint)."
- **Recommended:** Add new `assertRotation2Normalized(cos, sin, tolerance?)` function that validates the unit constraint.
- **Justification (Safety):** Rotation2 must maintain unit magnitude invariant. Silent creation of degenerate rotations like (2, 0) causes downstream bugs. However, this is documented intentional behavior, making it an additive feature rather than an API fix.
- **A1:** APPROVED — Safety pillar benefits from algebraic invariant enforcement
- **A2:** DX-CONCERN — silent invalid rotations cause hard-to-debug downstream issues
- **Breaking:** No (additive — new function)
- **Reclassified:** P1 → P2 (documented intentional behavior; additive feature, not a fix)

#### F6. Transform2 ELEMENT_COUNT=5 vs Symbol.iterator yields 6

- **File:** `core/transform2.ts:191, 2375-2382`
- **Current:** `ELEMENT_COUNT = 5` (toArray: px, py, angle, sx, sy). But `Symbol.iterator` yields 6 components (px, py, cos, sin, sx, sy). JSDoc at line 187 already clarifies: "Number of elements when serialized to an array (x, y, angle, sx, sy)."
- **Recommended:** Add `COMPONENT_COUNT = 6` constant and clarify JSDoc that ELEMENT_COUNT refers to `toArray()` serialization while COMPONENT_COUNT refers to raw component iteration.
- **Justification (Safety):** Developers may expect `[...transform].length === Transform2.ELEMENT_COUNT`. The difference between serialization (angle-based, 5) and iteration (cos/sin-based, 6) is intentional but could use explicit documentation.
- **A1:** APPROVED — improves API clarity
- **A2:** DX-CONCERN — `[...transform]` vs `toArray()` length mismatch is surprising
- **Breaking:** No (documentation + additive constant)
- **Reclassified:** P1 → P2 (existing JSDoc documents intent; additive clarity improvement)

#### F7. Complex missing ALL component-wise operations

- **File:** `core/complex.ts`
- **Current:** Complex has ZERO component-wise operations (abs, floor, ceil, round, trunc, sign, min, max, clamp, mod)
- **Recommended:** Add all 10 component-wise operations as both static and instance methods, following Vector2/Matrix2 patterns.
- **Justification (Completeness):** Vector2, Matrix2, Matrix3 all have these. Complex is a 2-component numeric type and should have parity. "Completeness over minimalism" pillar.
- **A1:** APPROVED — structural operations missing from a complete algebraic type
- **A2:** DX-CONCERN — missing ops force awkward extract-operate-reconstruct workarounds
- **Breaking:** No (additive — 20 new methods)

#### F8. Interval missing component-wise operations

- **File:** `core/interval.ts`
- **Current:** Only has `abs()`. Missing: floor, ceil, round, trunc, sign, min, max, clamp, mod.
- **Recommended:** Add floor/ceil/round/trunc as component-wise operations on interval bounds. E.g., `Interval.floor([-1.5, 2.7]) = [-2, 2]`.
- **Justification (Completeness):** Useful for constraint solvers and error bounds. Mathematically valid on interval bounds.
- **A1:** APPROVED — completeness principle
- **A2:** DX-CONCERN — interval arithmetic is used in constraint solvers; missing ops limit expressiveness
- **Breaking:** No (additive)

#### F9. Vector2 missing `inverted` getter

- **File:** `core/vector2.ts` (after line 2684)
- **Current:** Has static `inverse()`, instance `inverse()`, `inverseSafe()`, `inverseUnchecked()` — but no read-only `inverted` getter.
- **Recommended:** Add `get inverted(): Vector2` matching the pattern of `negated`, `absolute`, `normalized` getters.
- **Justification (Completeness):** Matrix2, Matrix3, Transform2 all have `inverted` getters. Vector2 breaks the pattern.
- **A1:** APPROVED — API regularity broken
- **A2:** DX-BLOCKED — users expect consistent getter pattern across types
- **Breaking:** No (additive)

#### F10. JSDoc documentation gaps across auxiliary layer

- **Files:** Multiple files in `auxiliary/scalar/`, `auxiliary/angle/`, `auxiliary/numeric/`
- **Current issues (aggregated from L1a, L1b, L1c agents):**
  - `angleBisector`: undocumented ambiguous case when angles are exactly π apart
  - `smoothStep`/`smootherStep`: degenerate case (edge0 === edge1) fallback undocumented
  - `compensatedProduct`: overflow risk for very large magnitudes not clearly warned
  - `sanitizeNumber`: fallback value gets clamped (undocumented behavior)
  - `ensureFinite`: non-finite fallback silently replaced with 0 (undocumented)
  - `fract`: returns NaN for non-finite inputs (undocumented)
  - `flooredMod`: uses isNearZero tolerance, not exact zero check (undocumented)
- **Recommended:** Add @remarks to each function documenting edge case behavior.
- **Justification (Completeness):** Users need to understand edge case semantics.
- **A1:** APPROVED — completeness includes documentation
- **A2:** DX-BLOCKED — missing docs prevent IDE hints
- **Breaking:** No (documentation only)

#### F13. sqrtSafe re-export violates layer architecture

- **File:** `deterministic/deterministic-kernels.ts:1002`
- **Current:** `export { sqrtSafe } from '../auxiliary/numeric/safety'` — imports from auxiliary layer
- **Context:** The file's own comments at lines 32-34 explicitly state: "Local copies of mathematical constants to avoid upward imports from `auxiliary/`. The deterministic layer must NOT depend on auxiliary (dependencies flow downward only)."
- **Recommended:** Move `sqrtSafe` implementation to `deterministic-kernels.ts` (inline the function) or re-export from auxiliary instead. The deterministic layer is the foundation — it must have zero upward dependencies.
- **Justification (Safety):** Layer architecture rule from `math2d-patterns.md`: `utils → core → auxiliary → deterministic`. The file violates its own documented constraint.
- **A1 original verdict:** REJECTED ("API convenience, not true circular dependency") — **OVERRULED by post-review verification**: the file's own JSDoc documents the constraint it violates. Not a circular dependency, but a layer violation.
- **A2:** DX-APPROVED — clean layer boundaries aid contributor understanding
- **Breaking:** No (implementation detail, no public API change)

---

### P3 — Polish (Nice to Have)

#### F11. assert\*Like type narrowing behavior undocumented

- **File:** `validation/assert.ts` (all assert\*Like functions)
- **Current:** In production builds (`DEV_MODE = false`), assert functions return without validation but TypeScript still narrows the type. This semantic mismatch is not documented.
- **Recommended:** Add JSDoc remark: "In production builds, this function is eliminated via DCE. Type narrowing only occurs at compile time. For runtime shape validation, use `is*Like()` type guards."
- **Justification (Safety):** Developers must understand when validation actually executes.
- **A1:** APPROVED
- **A2:** DX-BLOCKED — Java-background devs assume assertions always run
- **Breaking:** No (documentation only)

#### F12. Transform2.premultiply() allocates temporary

- **File:** `core/transform2.ts:1958-1964`
- **Current:** Calls `Transform2.multiply(other, this)` creating a temporary Transform2, then copies result back.
- **Recommended:** Low priority. The temp allocation is unavoidable for correctness (can't in-place premultiply SRT without intermediate storage). Document that users should prefer `multiply()` in hot paths.
- **Justification (Performance):** Minor optimization opportunity, but correctness trumps.
- **A1:** REJECTED — correct implementation more important than false optimization
- **A2:** DX-APPROVED — mutable methods are allowed to allocate; users choose static for hot paths
- **Breaking:** No

---

## Cross-Type Pattern Matrices

### Negate Triple

| Type       | Static negate() | Instance negate() | Getter negated | Status                     |
| ---------- | :-------------: | :---------------: | :------------: | -------------------------- |
| Vector2    |        ✓        |         ✓         |       ✓        | Complete                   |
| Complex    |        ✓        |         ✓         |       ✓        | Complete                   |
| Interval   |        ✓        |         ✓         |       ✓        | Complete                   |
| Rotation2  |        ✓        |         ✓         |       ✓        | Complete                   |
| Matrix2    |        ✓        |         ✓         |       ✓        | Complete                   |
| Matrix3    |        ✓        |         ✓         |       ✓        | Complete                   |
| Transform2 |        —        |         —         |       —        | N/A (SRT negate undefined) |

### Inverse Triple

| Type       | Static inverse() | Instance inverse() | Getter inverted | Status                        |
| ---------- | :--------------: | :----------------: | :-------------: | ----------------------------- |
| Vector2    |        ✓         |         ✓          |      **✗**      | **Missing getter (F9)**       |
| Complex    |  ✓ (reciprocal)  |   ✓ (reciprocal)   |        —        | Uses `reciprocal` name        |
| Interval   |  ✓ (reciprocal)  |   ✓ (reciprocal)   |        —        | Uses `reciprocal` name        |
| Rotation2  |        ✓         |         ✓          | ✓ (`inversed`)  | **Rename to `inverted` (F1)** |
| Matrix2    |        ✓         |         ✓          |        ✓        | Complete                      |
| Matrix3    |        ✓         |         ✓          |        ✓        | Complete                      |
| Transform2 |        ✓         |         ✓          |        ✓        | Complete                      |

### Component-wise Operations

| Op    | Vector2 | Complex | Interval | Rotation2 | Matrix2 | Matrix3 | Transform2 |
| ----- | :-----: | :-----: | :------: | :-------: | :-----: | :-----: | :--------: |
| abs   |    ✓    |  **✗**  |    ✓     |    N/A    |    ✓    |    ✓    |    N/A     |
| floor |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| ceil  |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| round |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| trunc |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| sign  |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| min   |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| max   |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| clamp |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |
| mod   |    ✓    |  **✗**  |  **✗**   |    N/A    |    ✓    |    ✓    |    N/A     |

**N/A reasons:**

- Rotation2: would break unit constraint (cos²+sin²=1)
- Transform2: would break affine transform properties (rotation must stay unit)

### Predicates

| Predicate   | Vec2 | Complex | Interval | Rot2 | Mat2 | Mat3 | Tf2 |
| ----------- | :--: | :-----: | :------: | :--: | :--: | :--: | :-: |
| isZero      |  ✓   |    ✓    |    ✓     |  ✓   |  ✓   |  ✓   |  ✓  |
| isNearZero  |  ✓   |    ✓    |    ✓     |  ✓   |  ✓   |  ✓   |  ✓  |
| isFinite    |  ✓   |    ✓    |    ✓     |  ✓   |  ✓   |  ✓   |  ✓  |
| hasNaN      |  ✓   |    ✓    |    ✓     |  ✓   |  ✓   |  ✓   |  ✓  |
| hasInfinity |  ✓   |    ✓    |    ✓     |  ✓   |  ✓   |  ✓   |  ✓  |
| nearEquals  |  ✓   |    ✓    |    ✓     |  ✓   |  ✓   |  ✓   |  ✓  |
| exactEquals |  ✓   |    ✓    |    —     |  ✓   |  ✓   |  ✓   |  ✓  |

### Validation Tiers (strict / Safe / Unchecked)

| Type       | Operations with all 3 tiers                                                                         |
| ---------- | --------------------------------------------------------------------------------------------------- |
| Vector2    | divide, divideScalar, inverse, normalize, direction, setMagnitude, project, reject, reflect (9 ops) |
| Complex    | divide, divideScalar, normalize, reciprocal (4 ops)                                                 |
| Interval   | divide, sqrt, reciprocal (3 ops)                                                                    |
| Rotation2  | normalize (1 op)                                                                                    |
| Matrix2    | divideScalar, inverse (2 ops)                                                                       |
| Matrix3    | divideScalar, inverse (2 ops)                                                                       |
| Transform2 | inverse (1 op)                                                                                      |

---

## Layer-by-Layer Summary

| Layer               | Files | Status | Findings                                    |
| ------------------- | ----- | ------ | ------------------------------------------- |
| deterministic/      | 1     | P2     | F13 (sqrtSafe layer violation)              |
| auxiliary/scalar/   | 5     | P2     | F10 (JSDoc gaps)                            |
| auxiliary/angle/    | 6     | P2     | F10 (minor JSDoc gap in angleBisector)      |
| auxiliary/numeric/  | 5     | P2     | F10 (JSDoc gaps for edge cases)             |
| core/vector2        | 1     | P2     | F9 (missing inverted getter)                |
| core/complex        | 1     | P2     | F7 (missing component-wise ops)             |
| core/interval       | 1     | P2     | F8 (missing component-wise ops)             |
| core/rotation2      | 1     | P1     | F1 (inversed→inverted rename)               |
| core/matrix2        | 1     | Clean  | No issues found                             |
| core/matrix3        | 1     | Clean  | No issues found                             |
| core/transform2     | 1     | P2     | F6 (ELEMENT_COUNT clarity)                  |
| types/              | 1     | Clean  | No issues found                             |
| validation/         | 1     | P2+P3  | F3 (unit constraint), F11 (production docs) |
| utils/parse         | 1     | P1     | F5 (formatMatrix3 brackets)                 |
| utils/random        | 1     | P1     | F4 (ReadonlyVector2 → \*Like)               |
| utils/random-source | 1     | Clean  | No issues found                             |
| utils/performance   | 1     | Clean  | No issues found                             |

---

## Prioritized Action Plan

### Phase 1: P1 Fixes (3 items — do first)

1. **F1** — Rename `Rotation2.inversed` → `inverted` + update tests
2. **F4** — Change random.ts parameter types to `ReadonlyVector2Like`
3. **F5** — Add outer brackets to formatMatrix3 nested format

### Phase 2: P2 Features (8 items — next iteration)

4. **F3** — Add `assertRotation2Normalized()` to validation/assert.ts
5. **F6** — Add `COMPONENT_COUNT = 6` to Transform2 + clarify JSDoc
6. **F7** — Add 10 component-wise operations to Complex (20 methods: 10 static + 10 instance)
7. **F8** — Add component-wise operations to Interval (same set)
8. **F9** — Add `inverted` getter to Vector2
9. **F10** — Fix JSDoc documentation gaps across auxiliary layer
10. **F13** — Resolve sqrtSafe layer violation in deterministic-kernels.ts

### Phase 3: P3 Polish (2 items — when convenient)

11. **F11** — Document assert\*Like production behavior
12. **F12** — Document premultiply() allocation in Transform2
