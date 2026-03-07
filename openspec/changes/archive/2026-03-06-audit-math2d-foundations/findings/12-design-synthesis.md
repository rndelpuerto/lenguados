# Phase 2 - Design Synthesis (Tasks 12.1-12.5)

## 12.1 Justified Design Decisions

### D1: EPSILON = 1e-10

**Alternatives:** 1e-6 (gl-matrix), 1e-12 (Eigen), 2.22e-16 (machine epsilon)
**Choice:** 1e-10
**Justification:** Provides ~5 orders of magnitude margin over typical 20-operation chains (20 \* 1.11e-16 ~ 2.2e-15). More precise than game engines, less than scientific computing. Matches the 2D physics use case where robustness > precision.
**Source:** Higham, "Accuracy and Stability of Numerical Algorithms", Chapter 1.

### D2: fdlibm Polynomial Coefficients

**Alternatives:** Custom minimax polynomials, CORDIC, lookup tables
**Choice:** fdlibm (Sun/Oracle) coefficients
**Justification:** Proven minimax approximations with decades of validation. Used by multiple JS engines historically. No need to reinvent.
**Source:** fdlibm k_sin.c, k_cos.c, s_atan.c, e_log.c, e_exp.c (Cody & Waite, 1980).

### D3: Unit Complex for Rotation2

**Alternatives:** Angle only (Godot), rotation matrix (3x3 submatrix), quaternion slice
**Choice:** Unit complex number (cos, sin)
**Justification:** Composition is a single complex multiply (4 mul, 2 add). Avoids trig for composition. Matches Rapier and Box2D (internal representation). Memory: 2 floats vs 4 for matrix.
**Source:** Rapier physics engine, Box2D internal Rot type.

### D4: Column-Major Matrices

**Alternatives:** Row-major (C convention), flat array
**Choice:** Named properties in column-major order
**Justification:** Column-major matches GLSL convention. Named properties (m00, m01...) provide better IDE support than array indices. Object properties allow V8 hidden class optimization.
**Source:** GLSL ES 3.0 specification, section 5.4.2.

### D5: Duck-Typing via \*Like Interfaces

**Alternatives:** Concrete class only (three.js), typed arrays (gl-matrix), generic base
**Choice:** ReadonlyXLike / XLike interface pairs
**Justification:** Enables interop with plain objects, JSON deserialization, cross-frame compatibility. No instanceof issues. TypeScript structural typing makes this natural.
**Source:** TypeScript handbook, structural typing philosophy.

### D6: DCE-Based Assertions

**Alternatives:** Runtime-only (zod), compile-time strip (#ifdef), no validation
**Choice:** process.env.NODE_ENV guard + DCE
**Justification:** Zero cost in production (bundler eliminates). Full validation in dev. Industry standard for JS libraries (React uses same pattern).
**Source:** React production build model, Vite/Rollup DCE documentation.

### D7: Three-Tier Validation (strict/safe/unchecked)

**Alternatives:** Single tier (always validate or never), two-tier (strict/unchecked)
**Choice:** Three tiers with naming convention
**Justification:** Different callers have different needs. Physics step loop needs unchecked speed. User-facing API needs safe fallbacks. Debug needs strict throws. Rapier uses similar pattern.
**Source:** Rapier physics engine API design.

### D8: TRS Decomposed Transform

**Alternatives:** Matrix-only (no decomposition), position + angle + scale (scalar rotation)
**Choice:** Position (Vector2) + Rotation (Rotation2) + Scale (Vector2)
**Justification:** Direct access to transform components without decomposition. Scene graph hierarchy via compose(). Lerp-friendly (component-wise interpolation). Standard in Unity, Godot.
**Source:** Unity Transform component, Godot Transform2D.

---

## 12.2 Eliminated Entities

| Entity               | Reason                             | Replacement                                   |
| -------------------- | ---------------------------------- | --------------------------------------------- |
| ANGLE_EPSILON        | Zero consumers, causes confusion   | Use EPSILON with eps? parameter               |
| GOLDEN_RATIO         | Zero consumers, not math-core      | Compute if needed: 1 + GOLDEN_RATIO_CONJUGATE |
| Rotation2.angleValue | Duplicates angle getter            | Rotation2.angle                               |
| Interval.NORMALIZED  | Duplicates UNIT                    | Interval.UNIT                                 |
| Rotation2.slerp      | Identical to lerp in 2D            | Rotation2.lerp (document that it IS slerp)    |
| deterministic/sqrt   | Unnecessary (IEEE 754 required op) | Math.sqrt                                     |

### Why Not To Reintroduce

- **ANGLE_EPSILON:** If tighter angular tolerance is needed, pass it as an `eps` parameter to anglesNearEqual. A separate constant creates confusion about which epsilon to use.
- **sqrt in deterministic/:** Math.sqrt is correctly rounded (0.5 ULP) by IEEE 754 standard. Any JS engine implementing it differently would be non-conformant. Custom sqrt is LESS accurate.
- **slerp on Rotation2:** In 2D, slerp of unit complex numbers degenerates to lerp+normalize. Keeping a separate method misleads users into thinking it's "better". Document this equivalence in lerp's TSDoc.

---

## 12.3 Final Synergy Map

### Critical Composition Chains

```
1. divideSafe chain:
   scalar/EPSILON → numeric/MIN_SAFE_DIVISOR → numeric/divideSafe → core/Vector2.normalize, Matrix2.invert, etc.
   Impact: EPSILON change cascades through ALL safe division in the library

2. Normalization chain:
   scalar/loop → angle/normalizeRadians → angle/angleDifference → angle/lerpAngle, angleDistance, etc.
   Impact: loop behavior change affects all angular operations

3. Deterministic trig chain:
   scalar/constants(PI,TAU) → deterministic/(reduceAngle,sin,cos) → core/(fromAngle,rotate,etc.)
   Impact: Range reduction precision affects all rotation operations

4. Validation chain:
   validation/assert → core/ constructors → user code
   Impact: DCE toggle affects all development-time validation
```

### Building-Block Dependency Depth

```
Most shallow (0 deps):  scalar/constants, types/, validation/
1 dep:                  deterministic/ (← scalar/constants)
2 deps:                 scalar/arithmetic,comparison (no external deps but exist at this level)
3 deps:                 angle/ (← scalar + deterministic)
                        numeric/ (← scalar + deterministic)
4 deps:                 core/ (← scalar + numeric + deterministic + types + validation)
5 deps:                 utils/ (← everything)
```

---

## 12.4 Final Facade Map

### Intra-Module Facades (Keep All)

| Facade                 | Delegates To    | Cost           |
| ---------------------- | --------------- | -------------- | ------ | ---------- |
| saturate → clamp       | 1 call          | Inlineable     |
| saturateSigned → clamp | 1 call          | Inlineable     |
| angleDistance →        | angleDifference |                | 1 call | Inlineable |
| All instance → static  | 1 call each     | All inlineable |

### Inter-Module Facades (Keep All)

| Facade                               | Delegates To                  | Cost   |
| ------------------------------------ | ----------------------------- | ------ |
| numeric/sqrtSafe, acosSafe, asinSafe | Re-export from deterministic/ | Zero   |
| normalizeRadians/Positive/Degrees    | scalar/loop                   | 1 call |

### Facades to Fix

| Facade       | Issue                                       | Fix                              |
| ------------ | ------------------------------------------- | -------------------------------- |
| angle/sinCos | Calls sin+cos separately (double reduction) | Delegate to deterministic/sinCos |

---

## 12.5 Implementation Checklist

### Priority 1 — Bug Fixes

- [ ] Deep freeze Transform2.IDENTITY, FLIP_X, FLIP_Y (freeze nested Vector2/Rotation2)

### Priority 2 — Naming/Consistency

- [ ] Rename Vector2.magnitudeSquared → magnitudeSq
- [ ] Fix Rotation2.negate (rename to conjugate or fix implementation)
- [ ] Remove Rotation2.angleValue (duplicate of angle getter)
- [ ] Remove Rotation2.slerp (document lerp equivalence)
- [ ] Remove Interval.NORMALIZED (duplicate of UNIT)
- [ ] Add ReadonlyRotation2 type alias

### Priority 3 — Deterministic Module

- [ ] Remove custom sqrt, use Math.sqrt
- [ ] Move sqrtSafe to numeric/safety
- [ ] Add out parameter to deterministic/sinCos
- [ ] Fix angle/sinCos to delegate to deterministic/sinCos

### Priority 4 — Constants Cleanup

- [ ] Remove ANGLE_EPSILON
- [ ] Remove GOLDEN_RATIO (keep GOLDEN_RATIO_CONJUGATE)

### Priority 5 — Missing Operations

- [ ] Add Complex.exp, Complex.log, Complex.toPolar
- [ ] Add Rotation2.toMatrix2, Rotation2.toComplex
- [ ] Add Matrix2.trace

### Priority 6 — Quality Improvements

- [ ] Fix radiansToTurns to use multiplication by RAD_TO_TURN
- [ ] Fix roundToPowerOfTwo to use Math.log2 instead of deterministic/log
- [ ] Improve deterministic/exp 2^k scaling
- [ ] Improve range reduction (Cody-Waite for large angles)
- [ ] Add Safe variant suggestions to error messages
- [ ] Align Interval static/instance divide semantics
- [ ] Re-export type guards consistently from all 7 core types

### Priority 7 — Documentation

- [ ] Document Matrix2/3.invert safe behavior prominently
- [ ] Document Vector2 instance project/reflect/reject safe behavior
- [ ] Document Complex normalized/normalizeSafe fallback difference
- [ ] Document mod vs flooredMod distinction
- [ ] Document isInRange (exact) vs inRange (tolerant) distinction
