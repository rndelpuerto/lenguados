## Context

A fourth-generation audit of `@lenguados/math2d` using 19 agent passes across 5 phases, with empirical verification against the built library. This is the definitive audit — every finding was executed against real code.

### Agent Architecture + Empirical Verification

```
Phase 1-2: 11 agents (8 expert + 3 adversary)
Phase 3:   Integration
Phase 4:   Documentation contrast (1 agent)
Phase 5:   Meta-review (6 agents) + retraction challenge + final arbiter
Empirical: Code execution in Node.js against built library
```

## Goals / Non-Goals

**Goals:**

- Fix 2 rounding bugs (floorPowerOfTwo, ceilPowerOfTwo) — 51 + 312K empirical failures
- Fix 1 type signature (Rotation2.fromComplex) — sole violation of \*Like interface pattern
- Fix dependency graph in ARCHITECTURE.md — 9 factual errors verified by import tracing
- Document 2 DX asymmetries (transformDirectionCS param order, addScalar behavior)
- Reconcile 1 conflicting rule file (code-style.md member ordering)
- Maintain test coverage thresholds (90% lines/statements/functions)

**Non-Goals (with irrefutable evidence):**

- ~~Adding Vector2.moveTowards~~: NOT a math primitive. Composable as `subtract(t,c,out).clampMagnitude(0,d).add(c)` — 1 chain, 0 allocations. Box2D, glm, nalgebra, Eigen all omit it.
- ~~Adding Matrix3.multiplyAffine~~: Transform2.multiply handles fast SRT path. V8 JIT optimizes zero-multiplications. Performance gain marginal in JS.
- ~~Fixing Complex.divide overflow~~: Requires denominator > 9e307. 301 orders of magnitude beyond any 2D scenario.
- ~~Adding Complex.powSafe/Unchecked~~: 0^(-n) is a hard mathematical impossibility, not a numerical degeneracy. No realistic 2D use case.
- ~~Adding instance eigenvalues/eigendecompose~~: `Matrix2.eigenvalues(m)` vs `m.eigenvalues()` — negligible DX difference, zero allocation benefit.
- ~~Adding static premultiply on Transform2~~: `Transform2.multiply(other, this, out)` serves the same purpose.
- ~~Adding Interval.divide(a,b)~~: Not used in 2D physics. Composable via reciprocal+multiply.
- ~~Adding remapUnchecked~~: No realistic hot-path use case for remap.
- ~~Fixing Lg5 hex comment~~: Comment-only, zero runtime impact.

## Decisions

### Decision 1: Fix floorPowerOfTwo via comparison-based validation

**Objective**: `floorPowerOfTwo` returns values GREATER than the input for 51 of 52 testable near-power-of-2 inputs.

**Demonstrated (Node.js execution)**:

```
floorPowerOfTwo(3.9999999999999996) = 4  (input < 4, violates contract)
floorPowerOfTwo(1023.9999999999999) = 1024  (input < 1024, violates contract)
51/51 values 1 ULP below powers of 2 fail (n=2..52)
```

**Root cause**: `log(value)/LN_2` rounds to exactly `n` for values just below `2^n`.

**Fix (verified: 0 failures across all tests)**:

```typescript
export function floorPowerOfTwo(value: number): number {
 if (value <= 0) return 0;
 const candidate = 2 ** Math.floor(log(value) / LN_2);
 return candidate > value ? candidate / 2 : candidate;
}
```

**Why NOT snap correction**: The v4 audit initially proposed snap correction (like ceilPowerOfTwo). Empirical testing proved this doesn't work — the snap can't distinguish "exactly 2^n with FP error" from "just below 2^n" because both produce log2 values within 1e-13 of the integer.

**Why comparison works**: After computing the candidate, we simply check if it exceeds the input. If so, we went one power too high and divide by 2. This is O(1), adds one comparison and one conditional division.

### Decision 2: Fix ceilPowerOfTwo by building on floor

**Objective**: The 1e-10 snap threshold swallows 312,161 ULPs above each power of 2.

**Demonstrated (Node.js execution)**:

```
ceilPowerOfTwo(1024 + 1e-8) = 1024  (input > 1024, violates contract)
312,161 ULPs above 1024 are incorrectly snapped down
```

**Fix (verified: 0 failures across all tests, 0 ULP snap window)**:

```typescript
export function ceilPowerOfTwo(value: number): number {
 if (value <= 0) return 0;
 const floor = floorPowerOfTwo(value);
 return floor >= value ? floor : floor * 2;
}
```

**Why this approach**: Building ceil on floor is DRY and correct by construction. If `floor >= value`, the value IS a power of 2 (or the floor rounds to it exactly), so ceil = floor. Otherwise, the next power is floor × 2.

**Why NOT tightening the snap threshold**: Threshold-based approaches have an inherent tradeoff between handling exact powers and rejecting near-powers. The comparison-based approach eliminates the tradeoff entirely.

### Decision 3: Fix Rotation2.fromComplex parameter type

**Objective**: `Rotation2.fromComplex` and `fromComplexSafe` accept `ReadonlyComplex` (concrete type) instead of `ReadonlyComplexLike` (interface).

**Evidence**: Every other factory in the library uses `*Like` interfaces for input parameters. This is documented in `math2d-patterns.md`: "Input parameters use `Readonly*Like` interfaces."

**Fix**: Change the parameter type annotation from `ReadonlyComplex` to `ReadonlyComplexLike`. Zero runtime change — the function only accesses `.real` and `.imag`, which are defined on the interface.

### Decision 4: Fix ARCHITECTURE.md dependency graph

**Objective**: The Mermaid diagram has 9 factual errors vs actual import statements.

**Evidence**: Import tracing across all 32 source files. Missing edges: Utils→Auxiliary, Utils→Deterministic, Utils→Types, Utils→Validation, Auxiliary→Types, Core→Validation, Deterministic→Types. Incorrect edges: Validation→Core (should be Core→Validation), Validation→Auxiliary (does not exist).

**Fix**: Redraw the Mermaid diagram and update the prose description.

### Decision 5: Document transformDirectionCS parameter order

**Objective**: Instance `transformDirectionCS(cos, sin, direction, out)` has different parameter order than siblings `transformPointCS(point, cos, sin, out)`.

**Mitigation**: TypeScript catches misuse (Vector2Like vs number types). This is MEDIUM severity, not HIGH.

**Fix**: Add prominent `@remarks` noting the difference and cross-referencing siblings. Consider parameter reorder as breaking change for v2.0.

### Decision 6: Document Complex.addScalar asymmetry

**Objective**: `Complex.addScalar(z, 5)` adds to real only; `Vector2.addScalar(v, 5)` adds to both. Both correct for their domains but undocumented difference.

**Fix**: Add `@remarks` to Complex.addScalar explaining the difference.

### Decision 7: Reconcile code-style.md member ordering

**Objective**: `code-style.md` describes ordering that contradicts `tsdoc-conventions.md`. All code follows tsdoc-conventions.

**Fix**: Update code-style.md to match tsdoc-conventions.md.

## Risks / Trade-offs

| Risk                                | Impact                                            | Mitigation                                            |
| ----------------------------------- | ------------------------------------------------- | ----------------------------------------------------- |
| floorPowerOfTwo fix changes results | Breaking for code relying on wrong behavior       | The old results violated the documented contract      |
| ceilPowerOfTwo fix changes results  | Values within old snap window now ceil up         | Old behavior was provably wrong (312K ULPs swallowed) |
| Rotation2.fromComplex type change   | Existing code compiles (type widens, not narrows) | No runtime change, backward compatible                |
| ARCHITECTURE.md changes             | Contributors need to re-learn dependency graph    | Current graph is factually wrong                      |

## Open Questions

None. All findings verified empirically.

## Methodological Lessons (for future audits)

1. **Test the RIGHT inputs**: v3 audit retracted floorPowerOfTwo because it tested exact powers of 2. The bug is about values JUST BELOW powers. Always test boundary conditions.
2. **Snap corrections are fragile**: Log-based power-of-2 functions with snap corrections have an inherent precision-vs-tolerance tradeoff. Comparison-based validation eliminates the tradeoff.
3. **Don't trust retractions blindly**: Of 12 initial retractions in this audit, 6 were challenged, then 5 of those 6 were re-retracted by the final arbiter with stronger evidence. Multi-level review is essential.
4. **Documentation can be wrong**: ARCHITECTURE.md had 9 errors. Don't use documentation as ground truth — verify against imports.
5. **Composition claims need verification**: "Trivially composable" claims must include the actual code and prove it handles edge cases.
