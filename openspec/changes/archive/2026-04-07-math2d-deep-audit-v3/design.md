## Context

A third-generation multi-agent audit of all 32 source files (~31,600 lines) in `@lenguados/math2d`, building on two prior audits. **All findings verified empirically by executing the library code.**

### Agent Architecture + Empirical Verification

```
Phase 1-6: Multi-agent investigation (11 agents)
Phase 7: EMPIRICAL VERIFICATION (code execution)
  ├── floorPowerOfTwo: 52 exponents tested → 0 failures → RETRACTED
  ├── Transform2.toMatrix3: precision diff measured → 1-2 ULP → CONFIRMED
  ├── Complex.reciprocal: 2Mx5 benchmark → 25.8% slower → CONFIRMED
  ├── Interval.fromArray: invariant test → min>max created → CONFIRMED
  └── Rotation2.normalize: behavior test → no throw → CONFIRMED
```

## Goals / Non-Goals

**Goals:**

- Fix 1 precision issue (Transform2.toMatrix3 trig roundtrip) -- 1-2 ULP measured
- Fix 1 performance inefficiency (Complex reciprocal) -- 25.8% overhead measured
- Fix 1 validation gap (Interval fromArray/fromObject) -- invariant violation demonstrated
- Document 1 triality deviation (Rotation2.normalize) -- behavior empirically confirmed
- Maintain test coverage thresholds (90% lines/statements/functions)

**Non-Goals (with irrefutable evidence):**

- ~~Fixing floorPowerOfTwo~~: **RETRACTED.** Empirical execution of `floorPowerOfTwo(2**n)` for n=1..52 produces 0 failures. Prior audit's mathematical proof was verified correct: `log(2^n)/LN_2` error is always >=0, so `Math.floor` absorbs it. Our agents' theoretical argument was wrong.
- Adding Complex.toRotation2(): No project rule mandates conversion symmetry (doc contrast verified)
- Fixing Rotation2.normalize() triality: Prior audit explicitly chose to document, not fix (design.md open question #2). The project rationale is defensible (identity is always a valid safe rotation).
- Adding Rotation2.slerp/slerpClamped: In 2D, angle-lerp IS slerp. Prior audit rejected nlerp for same reason.
- Adding Transform2 inverseTransformPointUnchecked: CS variants serve as hot-path alternative.
- Re-investigating any of the 14 retracted findings from prior deep-audit.

## Decisions

### Decision 1: Fix Transform2.toMatrix3() via fromTransform2Like

**Objective**: Transform2 stores cos/sin directly. `toMatrix3()` extracts angle via atan2 then reconstructs cos/sin via sinCos. This is unnecessary.

**Verifiable**: Execute both paths and compare matrix entries.

**Demonstrated**:

```
Method 1 (current): m00=1.7320508075688776, m11=2.5980762113533165
Method 2 (direct):  m00=1.7320508075688774, m11=2.598076211353316
Difference: m00=+2.22e-16 (1 ULP), m11=+4.44e-16 (2 ULP)
```

**Irrefutable**: The direct path `Matrix3.fromTransform2Like(this, out)` already exists (line 568 of matrix3.ts). It reads `transform.rotation.cos` and `.sin` directly. No trig needed. Transform2 implements `ReadonlyTransform2Like`.

**Aligned with project objectives**:

- README: "High-performance" -- fewer trig calls = faster
- `math2d-patterns.md` Transform2 pattern: "use direct property assignment" for cos/sin
- `architecture-and-layers.md`: "guarantee cross-platform reproducibility" -- fewer fdlibm calls = fewer precision loss opportunities

### Decision 2: Fix Complex instance reciprocal via magnitudeSq

**Objective**: Static `reciprocal()` uses `magnitudeSq()`. Instance uses `magnitude()` then squares. Inconsistency.

**Verifiable**: Run both paths and measure performance.

**Demonstrated**:

```
Static  (magnitudeSq): 175.6ms avg (2M iterations, 5 rounds)
Instance (magnitude²):  220.9ms avg
Ratio: 1.258x (instance is 25.8% slower)
Correctness: Results are bit-identical (0 difference in real and imag components)
```

**Irrefutable**: Instance `reciprocalUnchecked()` (line 2407) already correctly uses `this.magnitudeSq()`, proving the pattern is established within the same class. Static reciprocal (line 1364) also uses `magnitudeSq()`. Only instance `reciprocal()` and `reciprocalSafe()` deviate.

**Aligned with project objectives**:

- README: "High-performance" -- 25.8% faster
- `math2d-patterns.md`: Static/instance methods should implement the same math
- `architecture-and-layers.md` line 53: duplication between variants is intentional for performance, but the MATH should be consistent

### Decision 3: Add order validation to Interval.fromArray/fromObject

**Objective**: `fromArray` and `fromObject` allow creating intervals with `min > max`.

**Verifiable**: Execute `Interval.fromArray([5, 2])` and check the result.

**Demonstrated**:

```
fromValues(5, 2): THROWS "Interval.fromValues: min (5) must be <= max (2)"
fromArray([5, 2]): Creates [5, 2] — min > max — INVARIANT VIOLATED
fromObject({min:5, max:2}): Creates [5, 2] — min > max — INVARIANT VIOLATED
fromUnsorted(5, 2): Creates [2, 5] — correctly auto-sorted
```

**Irrefutable**: `math2d-patterns.md` lines 63-66:

> "Where setDirect is NOT appropriate:
>
> - User-facing code paths (use set() which validates)
> - Any path where the values are not already guaranteed correct"

`fromArray` and `fromObject` are `@category Factory`, public static methods = user-facing code paths. They receive untrusted external data. `fromValues()` in the same class correctly validates. This is an inconsistency with the project's own documented rule.

**Aligned with project objectives**:

- `math2d-patterns.md` setDirect rules
- `architecture-and-layers.md`: Validation tiering (Layer 2 -- Safe functions for production safety)
- README: "Strict/Safe/Unchecked triality" -- strict factories should validate

**BREAKING**: `Interval.fromArray([5, 2])` will throw. Migration: use `Interval.fromUnsorted(5, 2)`.

### Decision 4: Document Rotation2.normalize() triality deviation (no code change)

**Objective**: `normalize()` does not throw for zero-magnitude, unlike every other strict variant.

**Verifiable**: Call `new Rotation2(0, 0).normalize()`.

**Demonstrated**:

```
normalize():         Returns (cos=1, sin=0) — no throw
normalizeSafe():     Returns (cos=1, sin=0) — identical behavior
normalizeUnchecked(): Returns (cos=NaN, sin=NaN) — undefined behavior (correct)
```

**Rules violated**:

- `math2d-patterns.md` line 14: "op() -- strict, throws on error (default)"
- README line 118: "normalize() throws on zero-length vectors"
- ARCHITECTURE.md line 90: "op(): Strict, throws on error"

**Why NOT fixing (documented by prior audit)**:

- Prior comprehensive audit design.md open question #2: "Should Rotation2.normalize/normalizeSafe behavioral identity be resolved? Not changing now but documented for future."
- Rationale: For Rotation2, identity (cos=1, sin=0) is ALWAYS a valid rotation. Unlike Vector2.normalize (where zero vector has no meaningful direction), a "zero rotation" has a natural identity. Throwing would force error handling with only one sensible recovery (use identity).
- Complex.normalize() DOES throw because Complex is a general algebraic type where zero has no natural normalization.

**Action**: Add explicit `@remarks` to Rotation2.normalize() TSDoc documenting this as an intentional exception to the triality pattern, with cross-reference to normalizeSafe.

### Decision 5: RETRACT floorPowerOfTwo finding

**Evidence (irrefutable)**:

```
$ node -e "for(let n=1;n<=52;n++) { if(floorPowerOfTwo(2**n) !== 2**n) console.log('FAIL at n='+n) }"
// Output: (empty — zero failures)
```

Prior audit's mathematical proof was verified correct by execution:

- `log(2^n) / LN_2` produces error that is ALWAYS >= 0
- Only exponent where error > 0: n=51 → raw=51.000000000000007105 → floor(51.0...07) = 51 ✓
- `Math.floor` absorbs positive error. `Math.ceil` does not (hence the prior ceilPowerOfTwo fix).
- Our agents' theoretical argument ("error could be negative") was incorrect.

## Risks / Trade-offs

| Risk                                          | Impact     | Mitigation                                                       |
| --------------------------------------------- | ---------- | ---------------------------------------------------------------- |
| Transform2.toMatrix3 changes matrix by ~1 ULP | Negligible | Precision improves, not degrades                                 |
| Complex reciprocal threshold change           | None       | `isNearZero(magSq, EPSILON²)` ≡ `isNearZero(mag)` mathematically |
| Interval.fromArray breaking change            | Medium     | Document in CHANGELOG; use `fromUnsorted()` as migration path    |

## Open Questions

None. All findings verified empirically.
