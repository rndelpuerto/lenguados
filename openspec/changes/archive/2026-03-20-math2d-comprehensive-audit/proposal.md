# Proposal: math2d Comprehensive Audit

## Problem Statement

The `@lenguados/math2d` package serves as the core mathematical foundation for the entire lenguados engine ecosystem. As a base library from which all future packages (physics, geometry, rendering) will extend via composition, extension, and facade patterns, every constant, function, and method must be mathematically correct, well-justified, synergistic within its module, and consistent across the entire API surface.

No comprehensive cross-library validation has been performed to date. Without this, the library risks:

- **Mathematical errors** that compound through downstream packages
- **API bloat** from template-copied operations that lack mathematical meaning for certain types
- **Missing primitives** that force consumers to reimplement common operations incorrectly
- **Naming inconsistencies** that confuse users moving between types
- **Layer dependency violations** that undermine the architectural integrity

## Proposed Solution

A line-by-line audit of all 31 source files (~997 exported items) across every module of math2d, validated against 10+ renowned libraries (glm, Box2D, Unity, Three.js, NumPy, Eigen, Godot, Rapier, Phaser, p2.js) using an adversarial multi-expert methodology.

The audit covers:

1. **Mathematical correctness** — every formula, edge case, branch cut
2. **Industry comparison** — each item contrasted against 10+ reference libraries
3. **API consistency** — static/instance symmetry, naming, validation tiers
4. **Cross-module coherence** — layer dependencies, pattern uniformity, hot-path readiness
5. **Synergy assessment** — does each item enable composition within and across modules?
6. **Over-engineering detection** — items with no library precedent and zero internal usage

## Methodology

10 specialized agents conducted independent audits:

- **8 Domain Experts**: Scalar+Numeric, Angle, Vector2, Complex, Matrix2+Matrix3, Rotation2+Transform2, Interval, Deterministic+Types+Validation+Utils
- **2 Adversarial Integrators**: One challenged all 90+ recommendations (removals, modifications, additions), the other verified cross-module consistency across all 7 core types

Each expert read every line of their assigned files and searched the web for comparison against renowned libraries. The adversary challenged every recommendation, arguing the opposite position, and only confirmed findings that survived scrutiny.

## Scope

### In Scope

- All 31 .ts source files in `packages/math2d/src/`
- All exported constants, functions, classes, methods, types, type guards
- Mathematical correctness of every formula
- API design patterns across all 7 core types
- Layer dependency integrity
- Hot-path allocation analysis

### Out of Scope

- Test files (audited indirectly via coverage of source)
- Build configuration
- Documentation standard compliance (covered by prior audits)
- Performance benchmarking (recommendations are analytical, not measured)

## Key Findings Summary

| Category                         | Count        | Details                                     |
| -------------------------------- | ------------ | ------------------------------------------- |
| Items audited                    | ~997         | Constants, methods, types across 31 files   |
| Mathematically correct           | 997/997      | Zero formula errors in any module           |
| Keep as-is                       | ~930 (93.3%) | Well-designed, industry-standard            |
| Remove (API bloat)               | ~26 (2.6%)   | No usage, no library precedent              |
| Modify (bugs/improvements)       | 5 (0.5%)     | Doc bugs, redundancy, duplicates            |
| Add (missing primitives)         | 1-2 (0.1%)   | Fundamental operations absent               |
| Cross-module issues              | 3            | Dependency cycle, missing iterator, typing  |
| Documentation bugs               | 2            | angleBisector example, fromCS normalization |
| Deferred for separate evaluation | ~8           | Behavioral changes, borderline additions    |

### Items for Removal (~26)

**Constants (21):**

- ~~Scalar: `GOLDEN_RATIO`, `GOLDEN_RATIO_CONJUGATE`~~ — **REVERSED**: Ratified `performance-architecture` spec mandates these. Prior audit deliberately restored them.
- Vector2: `EPSILON_VECTOR`, `NEGATIVE_ONE`, `UNIT_DIAGONAL`, `NEGATIVE_UNIT_DIAGONAL`
- Complex: `EPSILON_COMPLEX`, `SQRT2`, `SQRT2_INV`, `PI`, `E`
- Matrix2: `ONE`, `EPSILON_MATRIX`, `SCALE_2`, `SCALE_HALF`
- Matrix3: `ONE`, `EPSILON_MATRIX`, `SCALE_2`, `SCALE_HALF`
- Interval: `PERCENT`, `DEGREES`, `RADIANS`

**Functions/Methods (~5):**

- ~~Guards: `isPositiveInfinity`, `isNegativeInfinity`, `isInfinity`~~ — **REVERSED**: Prior foundations audit (2026-03-06) explicitly ruled "Keep" as readability helpers.
- Matrix2/3 (×2): `floor`, `ceil`, `round`, `trunc`, `sign` (component-wise — uncommon for matrices in game/physics libraries)
- ~~Matrix2/3 (×2): `mod`, `modScalar`~~ — **REVERSED**: Deliberately added by ratified API hardening change (2026-03-07) to complete static/instance triality.
- Matrix2/3 (×2): `addScalar`, `subtractScalar` — **DEFERRED**: Not part of API hardening; need further evaluation.
- Rotation2: `negated` getter (exact duplicate of `inversed`)

### Items for Modification (5)

1. ~~**remapSafe** — Add boundary-exact guards matching `remap`~~ — **REVERSED**: Function already handles degenerate input at L169: `if (inRange === 0) return outMin;`. The bug claim was factually incorrect.
2. **inRange/isInRange** — Add cross-references to disambiguate
3. **angleBisector** — Fix incorrect doc example (returns `-PI/2` not `PI/2` for `angleBisector(0, PI)`)
4. **Rotation2.fromCS** — Document that `set()` normalizes, or add `fromCSUnchecked`
5. ~~**Vector2.isParallel/isPerpendicular** — Normalize cross/dot by magnitude product~~ — **DEFERRED**: This is a behavioral change, violating the audit's own "ZERO behavioral changes" constraint. The current absolute tolerance is a correct (if different) definition. Requires separate proposal.
6. **Complex.smoothStep + Interval.smoothStep** (instance) — Remove redundant `saturate` call. Also affects `Interval.smoothStep` static (L873) and instance (L2049), which were missed in the original audit.
7. **Rotation2.negated** — Deprecate (duplicate of `inversed`)

### Items to Add (1-2)

1. ~~**moveTowards(current, target, maxDelta)** — Scalar interpolation~~ — **REVERSED**: Ratified spec at `core-types-api/spec.md:649` explicitly rejected this as "game engine convenience that composes existing mathematical primitives."
2. ~~**Vector2.moveTowards(current, target, maxDelta)** — Vector version~~ — **REVERSED**: Same ratified spec rejection.
3. ~~**moveTowardsAngle(current, target, maxDelta)** — Angular version~~ — **REVERSED**: Same reasoning applies to the angular version.
4. **Matrix3.fromReflection(normal)** — Fundamental Householder reflector `I - 2nn^T`. Mathematical primitive, not a convenience composition.
5. ~~**Complex.fromAngle(angle)** — Discoverable alias for `fromPolar(1, angle)`~~ — **DEFERRED**: Trivial one-argument alias. Uncertain value vs API surface cost.

### Cross-Module Issues (3)

1. **Layer dependency violation** — `deterministic/` imports `{ HALF_PI, PI, QUARTER_PI }` from `auxiliary/scalar/constants`, creating bidirectional dependency. (**NOTE**: Original audit incorrectly stated the import was `EPSILON`; the actual constants are `HALF_PI`, `PI`, `QUARTER_PI`.)
2. **Transform2 missing Symbol.iterator** — Only type without it (6/7 have it)
3. **Rotation2 frozen constants inconsistent typing** — Uses `ReadonlyRotation2Like` instead of `ReadonlyRotation2`
4. ~~**Matrix3 lacks affine hot-path methods**~~ — **DEFERRED**: Outside audit scope (performance benchmarking excluded). Should be proposed separately with benchmarks.

## Constraints

- **ZERO behavioral changes** to any existing public API that returns correct results
- All 3308+ existing tests must continue to pass
- Removals must be handled as deprecations first (mark `@deprecated` with removal in next major version)
- New methods must follow existing patterns exactly (ReadonlyLike input, out? last param)
- Layer dependency fix must not introduce circular imports at file level
- Hot-path additions must produce bit-identical results to existing methods

## Success Criteria

1. Every removal is justified by: zero internal usage + zero library precedent + no mathematical purpose
2. Every modification fixes a verified bug or measurable inconsistency
3. Every addition is present in 3+ renowned libraries and non-trivially composable
4. Cross-module patterns achieve 100% consistency across all 7 core types
5. All existing tests pass, new tests cover all changes
