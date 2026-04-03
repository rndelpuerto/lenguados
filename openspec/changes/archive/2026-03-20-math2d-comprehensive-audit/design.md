## Context

A comprehensive audit of all 31 source files (~997 exported items) in `@lenguados/math2d` was conducted by 10 specialized agents (8 domain experts + 2 adversarial integrators), contrasting every item against 10+ renowned libraries (glm, Box2D, Unity, Three.js, NumPy, Eigen, Godot, Rapier, Phaser, p2.js).

A subsequent adversarial review by 5 additional agents (Documentation Archaeologist, Devil's Advocate, Evidence Hunter, Source Code Analyst, Synthesizer Judge) cross-validated all findings against the project's historical decisions, actual source code, and external authoritative sources.

**Current state:** Zero mathematical formula errors were found. ~93% of the API is well-designed and industry-standard. However, ~26 items have no usage and no library precedent (API bloat from template-copying), 5 items have documentation bugs or redundancies, 1 fundamental geometric operation is missing, and 3 cross-module patterns are inconsistent.

**Constraints:**

- Zero behavioral changes to any existing public API that returns correct results
- All 3308+ existing tests must continue to pass
- Removals handled as `@deprecated` first, actual removal in next major version
- New methods follow existing patterns exactly (ReadonlyLike input, `out?` last param)
- Decisions must not contradict ratified specs from prior archived changes

## Goals / Non-Goals

**Goals:**

- Deprecate ~26 API items that have zero internal usage, zero library precedent, and no mathematical purpose
- Fix 2 documentation bugs (angleBisector example, fromCS normalization)
- Fix 1 code redundancy (smoothStep double-clamp in Complex and Interval)
- Deprecate 1 exact duplicate (Rotation2.negated = inversed)
- Add 1 missing primitive (Matrix3.fromReflection)
- Fix 3 cross-module consistency issues
- Add cross-reference documentation for confusable function pairs

**Non-Goals:**

- Performance benchmarking (recommendations are analytical only)
- Removing deprecated items (that's next major version)
- Changing any correct public API behavior (isParallel/isPerpendicular normalization deferred)
- Adding types beyond what the audit identified (Vector3, AABB, etc.)
- Overriding ratified spec decisions from prior changes

## Decisions

### D1: Deprecation-first removal strategy

**Decision:** All ~26 items marked for removal will be annotated with `@deprecated` tags pointing to alternatives. No items will be deleted in this change.

**Rationale:** The library is published on npm and may have external consumers. Removing exports is a breaking change. The deprecation-first approach:

- Gives consumers a migration path via IDE warnings
- Allows tree-shakers to eliminate unused deprecations
- Actual removal happens in the next major version bump

**Alternatives considered:**

- Immediate removal: Simpler but breaks semver contract. Rejected.
- Moving to a `legacy/` barrel: Over-engineered for items with zero known usage. Rejected.

### D2: Constants vs functions — different deprecation categories

**Decision:** Deprecated constants (21 items) get `@deprecated Use <alternative> instead` pointing to inline construction or frozen constant pattern. Deprecated functions (5 items) get `@deprecated` with rationale explaining why the operation is uncommon for the type.

**Rationale:** Constants like `EPSILON_VECTOR` can be replaced with a locally defined frozen constant. Functions like `Matrix2.floor()` lack precedent in game/physics math libraries — the deprecation message explains this and suggests component-level access as a safer alternative.

**Amendment from adversarial review:** Deprecation messages for epsilon constants should suggest `Object.freeze(new Vector2(EPSILON, EPSILON))` rather than `new Vector2(EPSILON, EPSILON)` to avoid per-call allocation in hot paths.

### D3: isParallel/isPerpendicular tolerance normalization — DEFERRED

**Decision:** DEFERRED to a separate proposal. Not included in this change.

**Rationale:** The adversarial review identified that this violates the audit's own constraint of "ZERO behavioral changes to any existing public API that returns correct results." The current absolute tolerance `|cross| <= epsilon` IS a mathematically correct definition of near-parallelism (area-based), even if it is magnitude-dependent. The normalized version (angle-based tolerance) is a DIFFERENT definition, not a bug fix. This requires a separate proposal that explicitly acknowledges the behavioral change and provides migration guidance.

### D4: New additions follow existing static+instance pattern

**Decision:** `Matrix3.fromReflection(normal, out?)` added as static factory only (factories are static-only by convention).

**Rationale:** Follows the existing codebase pattern exactly. The static method accepts `ReadonlyVector2Like` input and `out?` as last param.

**Items removed from this decision after adversarial review:**

- `moveTowards`, `Vector2.moveTowards`, `moveTowardsAngle` — REVERSED: Ratified spec at `openspec/specs/core-types-api/spec.md:649` explicitly rejected these as "game engine convenience that composes existing mathematical primitives."
- `Complex.fromAngle` — DEFERRED: Trivial one-argument alias for `fromPolar(1, angle)`. Uncertain value vs API surface cost.

### D5: Layer dependency fix — define constants locally in deterministic

**Decision:** The bidirectional dependency between `deterministic/` and `auxiliary/scalar/constants` will be resolved by having `deterministic/deterministic-kernels.ts` define its own local copies of `HALF_PI`, `PI`, and `QUARTER_PI`, eliminating the upward import.

**CORRECTION from adversarial review:** The original audit incorrectly stated the import was `EPSILON`. The actual import at `deterministic-kernels.ts:29` is `import { HALF_PI, PI, QUARTER_PI } from '../auxiliary/scalar/constants'`. Three constants must be duplicated, not one.

**Alternatives considered:**

- Create a shared `types/constants.ts` at the types layer: Would work and avoid duplication, but pollutes the types module with numeric values and introduces a new file for 3 well-known mathematical constants (π, π/2, π/4). Rejected as over-engineered.
- Move all shared constants to a new `constants/` layer below `deterministic/`: Over-engineered for 3 constants. Rejected.
- Accept the dependency: The cycle involves only constants (no function calls, no initialization order issues), but it violates the documented architecture and could mask real problems later. Rejected.

**Risk:** Duplicating 3 constants (PI, HALF_PI, QUARTER_PI) creates a minor maintenance risk. Mitigated by: these are well-known mathematical constants derived from `Math.PI` that will never change, plus cross-reference comments in both locations.

### D6: Transform2 Symbol.iterator consistency

**Decision:** Add `Symbol.iterator` to Transform2 yielding `[position.x, position.y, rotation.cos, rotation.sin, scale.x, scale.y]` — matching the pattern of all other 6 core types that yield their numeric components.

**Rationale:** 6 of 7 core types implement `Symbol.iterator`. Transform2 is the only one without it. Adding it completes the pattern. The same heterogeneity concern (different component semantics) applies equally to Matrix3 (which mixes rotation, translation, and scale in 9 components) and it already has the iterator.

**Amendment from adversarial review:** The JSDoc must extensively document the field order and explicitly note that components represent heterogeneous quantities (position, rotation, scale). Primarily useful for serialization and array-buffer interop.

### D7: Rotation2 frozen constants typing

**Decision:** Change frozen constant types from `ReadonlyRotation2Like` to `ReadonlyRotation2` to match the pattern used by Vector2, Complex, Matrix2, Matrix3, and Interval frozen constants.

**Rationale:** All other types use their full `Readonly*` type for frozen constants, providing access to methods. Using the weaker `*Like` type was likely a copy-paste oversight. This is a non-breaking change (widening the type makes more methods available).

## Risks / Trade-offs

**[D5 constant duplication]** → Defining `PI`, `HALF_PI`, `QUARTER_PI` in two places creates a minor maintenance risk. Mitigation: These are mathematical constants derived from `Math.PI` that will never change. Cross-reference comments in both locations.

**[Deprecation volume]** → ~26 deprecation annotations create some noise in IDE autocompletion. Mitigation: Deprecations are the standard mechanism; IDEs render them with strikethrough which effectively hides them. The alternative (no warning before removal) is worse.

**[D6 iterator field order]** → Transform2's iterator order must be documented and stable, and components are semantically heterogeneous. Mitigation: Document extensively in JSDoc. The order follows the logical grouping: position → rotation → scale, matching the property declaration order.

## Adversarial Review Amendments Log

| Original Decision                                          | Verdict   | Reason                                                                                    |
| ---------------------------------------------------------- | --------- | ----------------------------------------------------------------------------------------- |
| Deprecate GOLDEN_RATIO/CONJUGATE                           | REVERSED  | Ratified `performance-architecture` spec mandates them; prior audit deliberately restored |
| Deprecate isPositiveInfinity/isNegativeInfinity/isInfinity | REVERSED  | Prior foundations audit explicitly ruled "Keep" as readability helpers                    |
| Deprecate Matrix mod/modScalar                             | REVERSED  | Deliberately added 2 weeks ago by ratified API hardening change                           |
| Fix remapSafe degenerate range                             | REVERSED  | Bug doesn't exist — code already has `if (inRange === 0) return outMin`                   |
| Add moveTowards family (3 items)                           | REVERSED  | Ratified spec explicitly rejected as "game engine convenience"                            |
| Fix isParallel/isPerpendicular                             | DEFERRED  | Behavioral change violates audit's own "zero behavioral changes" constraint               |
| Add Complex.fromAngle                                      | DEFERRED  | Trivial alias; uncertain value                                                            |
| Add Matrix3 affine hot-path                                | DEFERRED  | Outside audit's benchmarking scope                                                        |
| Layer dependency fix: EPSILON                              | CORRECTED | Actual import is `HALF_PI, PI, QUARTER_PI`, not EPSILON                                   |
| smoothStep redundancy                                      | EXPANDED  | Also affects Interval static (L873) and instance (L2049), not just Complex                |
| angleBisector spec scenario                                | CORRECTED | Expected value is `-Math.PI / 2`, not `Math.PI / 2`                                       |
