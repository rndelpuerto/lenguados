## Context

An exhaustive 10-agent audit of `@lenguados/math2d` (~27K lines) produced 120+ raw findings across 7 core types, 3 auxiliary modules, types, validation, and utils. Three integrator agents cross-referenced, deduplicated, validated against external sources (Box2D, nalgebra, Unity, Three.js, gl-matrix), and synthesized into 6 coherent work packages. A subsequent 4-agent adversarial review challenged all 9 design decisions against archived formal specs, external library evidence, source code verification, and academic literature.

### Current State

The library is architecturally sound with comprehensive coverage. However, the audit revealed:

- **5 correctness bugs** (threshold inconsistency in Complex.reciprocal instance, overflow in Interval.center, unsafe cast in Interval.hull, misleading lerp docs, Transform2 doc referencing nonexistent methods)
- **4 hot-path allocation sites** that create GC pressure
- **~15 type-safety inconsistencies** where instance methods use concrete types instead of `*Like` interfaces
- **~10 missing operations** that break API symmetry or are standard in competing libraries
- **2 structural issues** (misplaced functions, layering violation)

### Constraints

- All 3265 existing tests must continue to pass
- L0 determinism must be preserved (no `Math.sin`/`Math.cos` in new code)
- Bundle size impact must be minimal (all additions tree-shakeable)
- No breaking changes (the original D1 proposal to change set() has been overruled by adversarial review; see D1 verdict below)

## Goals / Non-Goals

**Goals:**

- Fix all 5 identified correctness bugs
- Eliminate all unnecessary hot-path allocations
- Achieve 100% consistency in `*Like` interface usage across all instance methods
- Add `asserts` type narrowing to all validation functions
- Fill the highest-impact API surface gaps (transformDirection, Matrix2 decomposition, cross-type round-trips)
- Establish canonical patterns document that governs all future development
- Every change backed by external evidence or cross-module verification

**Non-Goals:**

- Complex trigonometric functions (sin(z), cos(z)) — out of scope for 2D real-valued geometry
- Object pooling system — `out` parameter pattern is the correct approach (validated by V8 research)
- Eigenvalue/SVD decomposition — deferred (specialized linear algebra beyond core 2D needs)
- Semantic direction aliases (UP/DOWN/LEFT/RIGHT) — library already has `UNIT_X`/`UNIT_Y`; semantic names embed coordinate conventions
- smoothDamp — requires mutable velocity state, different paradigm; belongs in a higher-level consumer package
- Vector2.moveTowards — game engine utility (Unity/Godot), not a mathematical primitive; trivially composed from existing operations (normalize, scale, add); belongs in consumer packages
- Rotation2.slerp alias — imports 3D quaternion terminology into a 2D context; for unit complex numbers lerp IS slerp, adding the alias creates confusion about whether they differ; discoverability is better served by JSDoc on lerp noting the equivalence
- Bezier/cubic interpolation on Vector2 — belongs in a higher-level interpolation utility, not core math
- Changing Rotation2.set() semantics (overruled; see D1)

## Decisions

### D1. Rotation2.set() — KEEP Normalization (Inline)

**VERDICT: REJECT original proposal. Keep set() normalizing. No setNormalized() method.**

**Adversarial review resolved this decisively.** The original proposal to make set() raw was overruled by three independent lines of evidence:

1. **Formal spec conflict (IRREFUTABLE):** Archived spec `2026-03-08-math2d-expert-review-fixes/specs/performance-architecture/spec.md` (R-ROT-SET-INLINE) contains a formal SHALL requirement: "Rotation2.set() SHALL normalize inline without intermediate object allocation." This spec was already implemented and merged. The archived spec `2026-03-08-math2d-expert-review-fixes/specs/core-types-api/spec.md` lines 337-358 explicitly documents the constructor/set() asymmetry as **deliberate** (Planck.js alignment). Changing set() to raw assignment would contradict two ratified requirements.

2. **Performance concern already resolved:** The same archived spec mandated that set() normalize **inline** (without the intermediate `{ cos, sin }` object from `normalizeComponents()`). Agent 4 confirmed this was implemented — the current code normalizes inline at line 1075. The performance concern that motivated the original D1 proposal (intermediate object allocation) was already fixed in a prior change.

3. **The "setNormalized()" method becomes redundant:** If set() keeps normalizing, there is no need for a separate setNormalized() method. The API surface stays cleaner.

**What the external evidence actually supports:** Box2D's `b2NormalizeRot` is separate from struct assignment, and nalgebra has `from_cos_sin_unchecked`. But these libraries use value types (C structs, Rust structs) where assignment is trivially a memcopy. In a JS class with mutable fields, the constructor is the "raw assignment" path, and set() is the "safe mutation" path. The current design follows this paradigm correctly.

**Action:** Remove the R-ROT-SET and R-ROT-SETNORM requirements from the core-types-api spec. Keep set() as-is (normalizing inline). No breaking change.

**Agent challenges overruled:**

- Agent 3 (Academic Evidence Hunter): External library evidence for raw set() is valid for value-type languages but does not apply to JS class mutation patterns. The evidence was correctly reported but incorrectly interpreted as supporting the D1 proposal.
- Agent 1 (Spec Archaeologist): Correctly identified the spec conflict. This finding was the decisive evidence.

### D2. Zero-Detection Standard — Fix the Bug, Not the Pattern

**VERDICT: REVISE. Fix Complex.reciprocal instance to use `magnitude` (not magnitudeSq). Do NOT establish a blanket "never use magnitudeSq" rule.**

**Adversarial review resolved the tension between correctness and performance:**

1. **The bug is real and confirmed (IRREFUTABLE):** Agent 4 verified that static Complex.reciprocal uses `magnitude` while instance uses `magnitudeSq`, creating a 5-order-of-magnitude threshold discrepancy. Values with magnitude between 1e-10 and 3.16e-6 produce different results from static vs instance. This must be fixed.

2. **The fix direction was wrong:** The original D2 proposed "always use magnitude, never magnitudeSq." Agent 2 (Devil's Advocate) and Agent 3 (Academic Evidence Hunter) both demonstrated this is overly broad:
   - Archived spec `2026-03-08-math2d-expert-review-fixes/specs/api-consistency-triality/spec.md` lines 109-146 **explicitly chose** `magnitudeSq` for `isUnit` checks and mandated that `Vector2.isUnit` be updated to match `Complex.isUnit`'s `magnitudeSq` approach. A blanket "never magnitudeSq" rule directly contradicts this ratified decision.
   - Using `magnitudeSq` for `isUnit` is correct because the comparison is `|magnitudeSq - 1| < EPSILON`, not `isNearZero(magnitudeSq)`. The threshold is meaningful (comparing against 1, not against 0).
   - Agent 3 provided the correct academic rule: "Do not compare magnitudeSq against EPSILON directly for zero-detection — always a bug. If magnitudeSq is used for zero-detection, compare against EPSILON \* EPSILON."

3. **The correct rule is nuanced:**
   - For **zero-detection** (is this vector/complex effectively zero?): Use `isNearZero(magnitude)` with `EPSILON`. Using `isNearZero(magnitudeSq)` with `EPSILON` is always a bug because the threshold is wrong by sqrt.
   - For **unit-length checks** (`isUnit`): `|magnitudeSq - 1| < EPSILON` is correct and preferred (avoids sqrt).
   - For **any other magnitudeSq comparison**: the threshold must be squared too (`EPSILON * EPSILON` or `EPSILON_SQ`).

**Action:** Fix Complex.reciprocal instance and reciprocalSafe instance to use `magnitude` for zero-detection. Update the api-consistency-patterns spec to document the correct zero-detection rule (not a blanket ban on magnitudeSq). Remove the overly broad R7 requirement from the spec.

**Agent challenges overruled:**

- Original D2 proposal: The blanket "never magnitudeSq" rule contradicts the ratified isUnit spec. Overruled.

**Agent challenges accepted:**

- Agent 2 (Devil's Advocate): Correctly identified that D2's blanket rule would force regression in isUnit. Accepted.
- Agent 3 (Academic Evidence Hunter): Correctly formulated the nuanced rule. Accepted.
- Agent 1 (Spec Archaeologist): Correctly identified the conflict with api-consistency-triality spec. Accepted.

### D3. \*Like Interface Usage — Canonical Rule

**VERDICT: ACCEPT. Unanimous agreement across all 4 agents.**

Every method parameter accepting a math object as input MUST use `Readonly*Like` (the structural interface from `types/`), never `Readonly*` (the branded alias) or the concrete class.

**Exception:** When the implementation must access nested objects (e.g., `transform.rotation.cos`), the parameter type may use `ReadonlyTransform2Like` which already defines the nested structure.

**Why not keep concrete types on instance methods?** The documented convention (CLAUDE.md: "Input params use Readonly\*Like") already mandates this. The Interval instance methods violate it, preventing interop with plain `{min, max}` objects. Widening the type is fully backward-compatible.

### D4. Hot-Path Allocation Elimination Strategy

**VERDICT: ACCEPT with D1 interaction resolved.**

Replace all intermediate allocations with scalar local variables. Do NOT introduce object pools or reusable buffers.

**complexDivideSmith:** Refactor from returning `[number, number]` tuple to writing directly into the caller's `out` parameter. The function becomes `complexDivideSmith(aRe, aIm, bRe, bIm, out: Complex): void`.

**Interval.multiply:** Replace `const products = [p1, p2, p3, p4]` with 4 local variables and `Math.min(p1, p2, p3, p4)`.

**Transform2 static multiply/inverse:** Inline the rotation computation. For inverse: `invCos = rotation.cos; invSin = -rotation.sin` instead of `Rotation2.inverse(rotation)`. The instance version already does this (line 1732 comment confirms intent).

**frobeniusNorm:** Replace `sqrtSafe(sumOfSquares)` with `Math.sqrt(sumOfSquares)`. Sum of squares is always >= 0. `Math.sqrt` is IEEE 754 deterministic (confirmed in project rules).

**D4/D1 interaction resolution:** Since D1 is now REJECTED (set() keeps normalizing), the Transform2 static multiply inlining creates no behavioral change. The current static path calls `Rotation2.multiply()` which returns a new Rotation2 via raw constructor (no normalization). The inlined path computes cos/sin scalars and writes them to `out.rotation.cos`/`out.rotation.sin` directly, also without normalization. Both paths bypass set(). The existing instance multiply (line 1732) already does this direct assignment. There is no behavioral divergence.

**Evidence:** Agent 4 confirmed that instance multiply already inlines rotation math with direct field assignment (comment at line 1732). Agent 2 confirmed frobeniusNorm equivalence for all IEEE 754 edge cases.

### D5. lerp Documentation — Unclamped is Correct Default

**VERDICT: ACCEPT. Unanimous agreement across all 4 agents. Pure doc fix, zero risk.**

Fix documentation in Matrix2, Matrix3, Interval to say `t` is unclamped. Do NOT add clamping to the implementation.

**Evidence:** Three.js had the identical documentation bug (issue #17035). gl-matrix, GLSL `mix()`, and the lenguados scalar `lerp` are all unclamped. The separate `lerpClamped` variants exist precisely for the clamped case. The `lerpClamped` JSDoc in Matrix2/Matrix3 incorrectly says "alias for lerp which already clamps" — this must also be fixed to say "clamps t before delegating to lerp".

### D6. New Methods — Follow Existing Patterns Exactly

**VERDICT: ACCEPT with refinements from adversarial review.**

**transformDirection:** Static `Transform2.transformDirection(transform, direction, out?)` + instance. Extracts and applies only the rotation component of the affine transform, ignoring scale and translation. This is a standard linear algebra operation: extracting the orthogonal (rotational) part of a transform and applying it to a vector. JSDoc SHALL explicitly state "applies rotation only, ignores scale and translation." The formula is `Rotation2.apply(transform.rotation, direction, out)`. Also add `transformDirectionCS` variant.

**premultiply:** `Transform2.premultiply(other)` computes `this = other × this` (reverse multiplication order). Since transform composition is non-commutative, both `multiply` (`this × other`) and `premultiply` (`other × this`) are required for algebraic completeness. Delegates to static `Transform2.multiply(other, this, this)` — safe because multiply reads all inputs before writing.

**Matrix2.getRotation / getScale:** Follow Matrix3 pattern exactly. `getRotation(matrix: ReadonlyMatrix2Like): number` returns `atan2(m01, m00)`. `getScale(matrix: ReadonlyMatrix2Like, out?: Vector2): Vector2` returns `(hypot(m00, m01), hypot(m10, m11))`.

**Rotation2.fromMatrix2:** `Rotation2.fromMatrix2(matrix: ReadonlyMatrix2Like, out?)` extracts rotation via `atan2(m01, m00) -> fromAngle`. This completes the Rotation2 <-> Matrix2 round-trip conversion (Matrix2 already has `fromRotation`). The `atan2` approach is standard in linear algebra (glm, Eigen) and handles scaled matrices correctly.

**Complex.divideScalar:** Three tiers following the exact pattern of Vector2.divideScalar. `divideScalar(z, s, out?)`, `divideScalarSafe(z, s, out?)`, `divideScalarUnchecked(z, s, out?)`.

**Interval.abs:** Follow Moore's interval arithmetic definition. Three cases: all-positive (identity), crosses zero ([0, max(|min|, |max|)]), all-negative (flip and negate).

**Interval.fromUnsorted:** `fromUnsorted(a, b, out?) = fromValues(Math.min(a, b), Math.max(a, b), out)`.

### D7. TypeScript asserts — Zero-Cost Type Narrowing

**VERDICT: ACCEPT. Unanimous agreement across all 4 agents.**

Add `asserts value is *Like` return types to all 7 `assert*Like` functions.

```typescript
// Before
export function assertVector2Like(value: unknown, name?: string): void;
// After
export function assertVector2Like(value: unknown, name?: string): asserts value is Vector2Like;
```

This is a type-signature-only change with zero runtime impact. The emitted JavaScript is identical.

Per Agent 2: production unsoundness is inherent to the DCE pattern (assertions are removed from production builds, so the narrowing is not backed by runtime checks). This is an accepted trade-off of the tree-shaking design and is not a regression.

### D8. SinCos Interface — Move to types/

**VERDICT: ACCEPT. Unanimous agreement across all 4 agents.**

Move the `SinCos` interface from `auxiliary/angle/operations.ts` to `types/index.ts`. This resolves the layering violation where `deterministic-kernels.ts` imports a type from auxiliary.

The wrapper function `sinCos` in `auxiliary/angle/operations.ts` remains as-is (it is the user-facing convenience API). The `deterministic-kernels.ts` implementation imports `SinCos` from `types/` instead of `auxiliary/`.

### D9. lerpSafe — KEEP in numeric/safety.ts

**VERDICT: REJECT original proposal to move. Keep lerpSafe where it is.**

**Adversarial review resolved this against the original proposal:**

1. **Agent 2 (Devil's Advocate) argument accepted:** `lerpSafe` is a **safety function** — its defining characteristic is the safe divisor guard, not the interpolation operation. Its peers are `sqrtSafe`, `divideSafe`, and other `*Safe` functions in `numeric/safety.ts`. Moving it to `scalar/interpolation.ts` would break the module's cohesion: `interpolation.ts` contains pure mathematical operations, while `lerpSafe` is a guarded variant with different semantics (it has a divisor guard against `b - a` being near zero).

2. **Discoverability argument is weak:** Users looking for "lerp" will find `lerp` and `lerpClamped` in `scalar/interpolation.ts`. Users looking for "safe" variants look in `numeric/safety.ts`. The current placement is semantically correct.

3. **Moving would set a bad precedent:** If `lerpSafe` moves to interpolation, should `sqrtSafe` move to wherever `sqrt` is? The `*Safe` pattern is a cross-cutting concern that correctly lives in its own module.

**Action:** Remove the R-LERPSAFE-LOC requirement from the auxiliary-api spec. Keep lerpSafe in `numeric/safety.ts`. No relocation, no deprecation notice.

**Agent challenges overruled:**

- Original D9 proposal: "Discoverability is maximized when functions live with their operation family." This is true for the base operations but not for safety wrappers which have their own family.
- Agent 3 (Academic Evidence Hunter): Supported the move based on operation-family cohesion. Overruled by the stronger safety-family cohesion argument.

## Risks / Trade-offs

### [RISK] Transform2.multiply inlining may diverge from Rotation2.multiply

After inlining, the Transform2 static path no longer routes through `Rotation2.multiply`. If `Rotation2.multiply`'s formula changes in the future, `Transform2` must be updated manually. Mitigate with a shared property-based test: `Transform2.multiply(a, b).rotation ~ Rotation2.multiply(a.rotation, b.rotation)`.

### [RISK] complexDivideSmith refactor may introduce subtle numerical differences

The refactored function must produce bit-identical results. The Smith algorithm's branching logic (scaling for underflow) must be preserved exactly. Existing tests with extreme values validate this.

### [TRADE-OFF] \*Like widening exposes invalid objects to instance methods

Widening `ReadonlyInterval` to `ReadonlyIntervalLike` on instance methods means a plain `{min: 5, max: 2}` (invalid ordering) could be passed. However, the static API already accepts `ReadonlyIntervalLike` and handles this via `assertOrder`. The instance methods should be equally permissive.

### [TRADE-OFF] Many new methods increase API surface

~14 new logical operations (~25 method definitions including static, instance, and CS variants) across 6 types. Each is justified by either: (a) completing an existing symmetry (Matrix2.getRotation/getScale), (b) completing a round-trip conversion (Rotation2.fromMatrix2), (c) completing an algebraic operation set (Complex.divideScalar, Transform2.premultiply), or (d) completing a validation tier (Vector2.setMagnitudeUnchecked). No speculative or domain-specific additions — only mathematical primitives and structural consistency completions.

### [TRADE-OFF] D2 nuanced rule is harder to enforce than blanket ban

The correct zero-detection rule (use magnitude for zero-checks, magnitudeSq is ok for unit-checks) requires developers to think about what they are comparing against. A blanket "never magnitudeSq" would be simpler but incorrect. Mitigate by documenting the rule clearly in the patterns spec and adding a code review checklist item.

## Open Questions

1. **Transform2 doc example references non-existent `setPosition`/`setRotation`/`setScale` methods.** Should we: (a) fix the doc to use the actual API (`t.position.set(10, 20)`), or (b) add the convenience methods? Recommendation: (a) fix the doc — the direct sub-object access is the intended API and adding wrappers would duplicate functionality.

2. **Rotation2.fromMatrix2 implementation strategy:** Direct column extraction (`cos = m00/hypot, sin = m01/hypot`) vs `atan2 -> fromAngle`. Agent 2 recommends direct extraction to avoid trig round-trip error. However, if the matrix has non-uniform scale, the first column's direction may differ from the rotation. Need to verify that the `atan2(m01, m00)` approach is standard (it is: this is how glm and standard linear algebra texts extract rotation from 2x2). Decision: Use `atan2(m01, m00) -> fromAngle` for correctness with scaled matrices, matching the formula already documented in the spec. The trig round-trip error is within EPSILON for all practical inputs.

## Adversarial Review Summary

Four adversarial agents reviewed all 9 decisions. Key outcomes:

| Decision | Original Verdict      | Adversarial Outcome                       | Agents Who Challenged       |
| -------- | --------------------- | ----------------------------------------- | --------------------------- |
| D1       | Raw set()             | **OVERRULED** -> Keep normalizing         | Agent 1, Agent 2            |
| D2       | Never magnitudeSq     | **REVISED** -> Fix bug only, nuanced rule | Agent 1, Agent 2, Agent 3   |
| D3       | Widen to \*Like       | Confirmed                                 | None                        |
| D4       | Eliminate allocations | Confirmed (D1 interaction resolved)       | Agent 2 (interaction noted) |
| D5       | Fix lerp docs         | Confirmed                                 | None                        |
| D6       | Add methods           | Confirmed with refinements                | Agent 2 (refinements)       |
| D7       | Add asserts types     | Confirmed                                 | None                        |
| D8       | Move SinCos           | Confirmed                                 | None                        |
| D9       | Move lerpSafe         | **OVERRULED** -> Keep in place            | Agent 2                     |
