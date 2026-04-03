## Context

A three-phase audit of all 32 source files (~31,000 lines) in `@lenguados/math2d`:

1. **Phase 1 -- Expert audit**: 8 domain-specialist agents audited every line, contrasting against 12+ reference libraries.
2. **Phase 2 -- Verification**: 5 agents cross-checked every claim with real code execution and rule-based evidence. Eliminated 7 of 14 original proposals.
3. **Phase 3 -- Deep dive**: 2 agents investigated design pattern consistency (exhaustive `Math.sqrt`/`hypot` audit covering all 52 usages) and API belonging criteria (`moveTowards` family against 12 reference libraries + project's archived audit).

Only changes that survived all three phases are included. Each change below has specific, verifiable evidence.

## Goals / Non-Goals

**Goals:**

- Fix 1 verified bug (`ceilPowerOfTwo`) and 3 verified consistency issues
- Resolve 1 architectural violation (Interval constructor purity)
- Document and enforce the `hypot` vs `Math.sqrt` performance convention (fix 5 Unchecked violations)
- Remove 1 method that contradicts the project's ratified scope (`moveTowards`)
- Add 2 missing operations verified in 5/7 pure math libraries (eigenvalues, solveLinearSystem)
- Fix 7 documentation gaps verified against current TSDoc
- Maintain test coverage thresholds (90% lines/statements/functions)

**Non-Goals:**

- Adding simulation/gameplay operations (`moveTowardsAngle`, `smoothDamp`, scalar `moveTowards`) -- 0/7 math libs, documented rejection
- Adding `Rotation2.nlerp` -- redundant in 2D where angle-lerp IS slerp
- Adding duplicate APIs (`Matrix3.compose` = existing `fromTransform2`; `Transform2.fromRotation/etc` = existing constructor defaults; `Vector2.applyInverse*` = existing Rotation2/Transform2 methods)
- Fixing `floorPowerOfTwo`/`roundToPowerOfTwo` -- verified NOT affected by the log2 bug
- Changing deterministic kernel implementations -- fdlibm coefficients verified correct

## Decisions

### Decision 1: Fix `ceilPowerOfTwo` via snap-to-integer guard

**Choice**: Before `Math.ceil`, snap log2 to nearest integer if within `1e-10`.

**Evidence**: Executed against all exponents 1-52. Exactly 5 fail (29, 31, 39, 47, 51). Root cause: `log(2^n) / LN_2` produces tiny positive error (e.g., `29.000000000000004`). `Math.ceil` rounds up; `Math.floor` absorbs it.

**Only `ceilPowerOfTwo` is affected** -- `floorPowerOfTwo` and `roundToPowerOfTwo` verified correct for all 52 exponents.

### Decision 2: Refactor Interval constructor to be pure

**Evidence**: Rule "Constructor Purity" in `architecture-and-layers.md` lines 61-74 states constructors MUST have NO assertions. 6/7 core types follow it (with canonical comment). Only Interval violates it. Additionally, `assertOrder()` throws a production `RangeError` (not dev-only), adding overhead to every operation via the `set()` double-validation path.

**BREAKING**: `new Interval(5, 3)` will no longer throw. Use `Interval.fromValues(5, 3)`.

### Decision 3: Document and enforce hypot vs Math.sqrt convention

**Evidence**: Exhaustive audit of all 20 `Math.sqrt` + 32 `hypot` usages across every source file. Pattern is established by `normalize` vs `normalizeUnchecked` in Vector2 and Complex, but never documented.

**5 Unchecked methods violate** the pattern by using `hypot`:

- `Vector2.directionUnchecked` (line 1401)
- `Vector2.setMagnitudeUnchecked` static (line 1809) and instance (line 3681)
- `Rotation2.normalizeUnchecked` static (line 744) and instance (line 1329)

**Non-violations verified**: `frobeniusNorm` (4-9 components, can't use 2-arg `hypot`), `Complex.sqrt` (scalar results from prior `hypot`), `sqrtSafe` (scalar utility).

### Decision 4: Remove Vector2.moveTowards

**Evidence (irrefutable)**:

- 0/7 pure math libs (Eigen, NumPy, GLM, Apache Commons Math, Boost, MathNet, CGAL)
- 0/5 applied math/graphics libs (glMatrix, Three.js, p5.js, Box2D, Matter.js)
- Only game engines have it; their naming reveals simulation intent: `cpvlerpconst`, `FInterpConstantTo`
- `maxDelta` has distance-per-frame units (simulation-dependent, not mathematical)
- Composes trivially from `subtract` + `limit` + `add`
- Project's own archived audit rejected it with ratified evidence
- Unreleased API (0.8.0 tag, package at 0.6.0): zero external breakage
- No internal consumers: no other math2d method calls it

**Contrast**: `clampMagnitude`/`limit` BELONG (unary metric projection, 5+ libs). `lerp` BELONGS (dimensionless parameter). `moveTowards` does NOT (frame-rate-dependent parameter).

### Decision 5: Add eigenvalues and solveLinearSystem only

**Evidence**: Only 2 proposed additions passed the 5/7 pure math library threshold. Both create direct synergy with existing infrastructure (`determinant`, `trace`, `cofactors`).

| Proposed                      | Math libs                                   | Verdict |
| ----------------------------- | ------------------------------------------- | ------- |
| `Matrix2.eigenvalues`         | 5/7 (Eigen, NumPy, Commons, Boost, MathNet) | ADD     |
| `Matrix3.solveLinearSystem`   | 5/7 (same)                                  | ADD     |
| `moveTowardsAngle`            | 0/7                                         | REJECT  |
| `Rotation2.nlerp`             | 0/7 for 2D                                  | REJECT  |
| `Matrix3.compose`             | N/A (already exists as `fromTransform2`)    | REJECT  |
| `Transform2.fromRotation/etc` | 0/7 (constructor handles it)                | REJECT  |
| `Vector2.applyInverse*`       | N/A (already on Rotation2/Transform2)       | REJECT  |

### Decision 6: Execute as 6 independent workstreams

Each capability (bug-fixes, architectural-fixes, sqrt-hypot-consistency, movetowards-removal, missing-operations, documentation-fixes) is independent and can be implemented, reviewed, and merged separately. Highest risk (Interval constructor) should be its own commit.

## Risks / Trade-offs

| Risk                                                     | Impact    | Mitigation                                                                          |
| -------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------- |
| Interval constructor change breaks user code             | Medium    | BREAKING in changelog. Migration: `new Interval(a,b)` -> `Interval.fromValues(a,b)` |
| `moveTowards` removal breaks user code                   | None      | Unreleased (0.8.0, package at 0.6.0)                                                |
| Unchecked methods lose overflow safety after sqrt change | By design | Unchecked contract: caller guarantees non-extreme inputs. Document in rules.        |
| Eigenvalue API complexity (real vs complex)              | Low       | Discriminated union with `type` field for TypeScript narrowing                      |

## Open Questions

1. **Eigenvalue return type for complex case**: Return `Complex` instances (cross-module synergy) or plain `{realPart, imaginaryPart}` objects (no Matrix2->Complex dependency)?
2. **Should `Rotation2.normalize`/`normalizeSafe` behavioral identity be resolved?** Both silently return identity for zero magnitude. Not changing now but documented for future.
