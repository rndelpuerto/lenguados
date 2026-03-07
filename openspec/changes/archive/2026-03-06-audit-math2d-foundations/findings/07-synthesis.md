# Phase 1 - Synthesis (Tasks 7.1-7.8)

## 7.1 Complete Synergy Map

### Module Import/Export Matrix

```
                    IMPORTS FROM →
                 scalar  angle  numeric  determ  core  types  valid  utils
scalar           -       -      -        -       -     -      -      -
angle            YES     -      -        YES     -     -      -      -
numeric          YES     -      -        YES     -     -      -      -
deterministic    YES(c)  -      -        -       -     -      -      -
core             YES     -      YES      YES     self  YES    YES    -
types            -       -      -        -       -     -      -      -
validation       -       -      -        -       -     -      -      -
utils            YES     -      -        YES     YES   YES    YES    self
```

Legend: YES = imports, YES(c) = imports constants only, self = intra-module

### Per-Module Detail

**scalar/ (constants, arithmetic, comparison, interpolation)**

- Imports from: NOTHING (true leaf module)
- Exports to: angle/, numeric/, deterministic/, core/, utils/
- Missed composition: None. Clean foundation.

**angle/ (conversion, normalization, operations, interpolation, unwrapping)**

- Imports from: scalar/ (constants, loop, saturate, smoothStep, EPSILON), deterministic/ (sin, cos, atan2)
- Exports to: complex/ (normalizeRadians in fromPolar), deterministic/ (SinCos type)
- Missed composition: auxiliary/sinCos should delegate to deterministic/sinCos

**numeric/ (guards, rounding, safety, wrapping)**

- Imports from: scalar/ (constants, clamp, isNearZero), deterministic/ (acosSafe, asinSafe, log, pow, sqrtSafe)
- Exports to: core/ (divideSafe, sqrtSafe, acosSafe)
- Missed composition: rounding.ts uses deterministic/log unnecessarily for roundToPowerOfTwo

**deterministic/ (deterministic-kernels)**

- Imports from: scalar/constants (PI, TAU, HALF_PI, QUARTER_PI)
- Exports to: angle/, numeric/, core/, utils/
- Note: Despite being called "L0", it depends on scalar/constants

**core/ (Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3, Transform2)**

- Imports from: scalar/ (clamp, saturate, lerp, nearEquals), numeric/ (divideSafe), deterministic/ (sin, cos, atan2, hypot, sqrt), types/ (_Like), validation/ (assert_)
- Exports to: utils/ (constructors for parse/random)
- Missed composition: Core types bypass angle/ for sin/cos, going directly to deterministic/

**types/ (interfaces, type guards)**

- Imports from: NOTHING
- Exports to: core/, validation/ (indirectly), utils/parse
- True leaf module alongside scalar/constants

**validation/ (assertions)**

- Imports from: NOTHING (self-contained)
- Exports to: core/, utils/random
- True leaf module

**utils/ (parse, random, performance)**

- Imports from: scalar/ (TAU, lerp), deterministic/ (sin, cos, log, sqrtSafe, atan2), core/ (constructors), types/, validation/
- Exports to: NOTHING (top of dependency chain)

### Circular Dependency Risk

**NONE.** The dependency graph is a strict DAG:

```
types, validation, scalar/constants (leaves)
  ↓
deterministic (imports scalar/constants)
  ↓
scalar/arithmetic,comparison,interpolation (no deps on deterministic)
  ↓
angle, numeric (import from scalar + deterministic)
  ↓
core (imports from all above)
  ↓
utils (imports from all above + core)
```

### Missed Composition Opportunities

1. **auxiliary/angle/sinCos → deterministic/sinCos**: Double range reduction
2. **numeric/rounding/roundToPowerOfTwo → Math.log2**: Uses deterministic/log unnecessarily
3. **Core types → angle/**: Core types bypass angle/ for trigonometry, importing directly from deterministic/. This is fine architecturally (angle/ is user-facing), but means sinCosNormalized in angle/ has zero core consumers.

---

## 7.2 Facade Inventory

### Intra-Module Facades

| Facade                       | Delegates To                | Overhead | Hot-Path Safe?   | Verdict |
| ---------------------------- | --------------------------- | -------- | ---------------- | ------- |
| saturate(v)                  | clamp(v, 0, 1)              | 1 call   | Yes (inlineable) | Keep    |
| saturateSigned(v)            | clamp(v, -1, 1)             | 1 call   | Yes (inlineable) | Keep    |
| angleDistance(a, b)          | abs(angleDifference(a, b))  | 1 call   | Yes              | Keep    |
| anglesNearEqual(a, b, eps)   | angleDistance(a, b) <= eps  | 2 calls  | Yes              | Keep    |
| smoothStepAngle(from, to, t) | smoothStep + lerpAngle      | 2 calls  | Yes              | Keep    |
| lerpClamped(a, b, t)         | inline clamp + lerp formula | 0 calls  | Yes              | Keep    |

### Inter-Module Facades

| Facade                       | Delegates To                  | Overhead      | Hot-Path Safe?   | Verdict |
| ---------------------------- | ----------------------------- | ------------- | ---------------- | ------- |
| numeric/sqrtSafe (re-export) | deterministic/sqrtSafe        | 0 (re-export) | Yes              | Keep    |
| numeric/acosSafe (re-export) | deterministic/acosSafe        | 0 (re-export) | Yes              | Keep    |
| numeric/asinSafe (re-export) | deterministic/asinSafe        | 0 (re-export) | Yes              | Keep    |
| normalizeRadians(rad)        | scalar/loop(rad, -PI, PI)     | 1 call        | Yes              | Keep    |
| Instance.add(other)          | Static.add(this, other, this) | 1 call        | Yes (V8 inlines) | Keep    |

### Instance → Static Delegation Pattern

ALL 7 core types follow the pattern where instance methods delegate to static:

```typescript
add(other: ReadonlyVector2Like): this {
  return Vector2.add(this, other, this) as this;
}
```

Overhead: 1 additional function call per instance method. V8 TurboFan inlines these in hot loops. **Acceptable.**

---

## 7.3 Building-Block Primitives (3+ consumers)

### Critical Primitives (cascade risk if signature changes)

| Primitive          | Consumer Count | Key Consumers                                                    |
| ------------------ | -------------- | ---------------------------------------------------------------- |
| EPSILON (constant) | 10+            | All core types, comparison, safety, angle/ops                    |
| PI, TAU, HALF_PI   | 5+             | deterministic, angle, utils/random                               |
| divideSafe         | 5              | vector2, complex, rotation2, matrix2, matrix3                    |
| clamp              | 3+             | saturate, saturateSigned, safety, vector2, interval              |
| nearEquals         | 4+             | vector2, complex, matrix2, matrix3 (equality methods)            |
| lerp               | 5+             | all core type .lerp methods, lerpAngle, random                   |
| loop               | 4              | all 4 normalization functions                                    |
| atan2              | 7+             | vector2, complex, rotation2, matrix2, matrix3, transform2, parse |
| hypot              | 5              | vector2, complex, rotation2, matrix2, matrix3                    |
| sin, cos           | 4+             | angle/ops, vector2, utils/random, core type factories            |
| saturate           | 5              | rotation2, transform2, interval, complex, angle/interp           |
| smoothStep         | 4              | rotation2, transform2, interval, complex                         |
| assertFinite       | 5              | vector2, complex, rotation2, transform2, interval                |

### Impact Tiers

**Tier 1 (10+ consumers, maximum cascade):**

- EPSILON — Any change propagates everywhere

**Tier 2 (5-9 consumers, high cascade):**

- divideSafe, lerp, atan2, hypot, saturate, assertFinite

**Tier 3 (3-4 consumers, moderate cascade):**

- clamp, nearEquals, loop, sin, cos, smoothStep

---

## 7.4 Mathematical Completeness by Type

### Vector2 — Vector Space R^2

| Operation              | Required | Present            | Notes                    |
| ---------------------- | -------- | ------------------ | ------------------------ |
| Addition               | Yes      | Yes                |                          |
| Scalar multiplication  | Yes      | Yes (scale)        |                          |
| Zero vector            | Yes      | Yes (Vector2.zero) |                          |
| Additive inverse       | Yes      | Yes (negate)       |                          |
| Dot product            | Yes      | Yes                |                          |
| Cross product (scalar) | Yes      | Yes                | Correct for 2D           |
| Magnitude/norm         | Yes      | Yes                | Uses hypot               |
| Normalize              | Yes      | Yes                | Safe via divideSafe      |
| Projection             | Yes      | Yes                |                          |
| Rejection              | Yes      | Yes                |                          |
| Reflection             | Yes      | Yes                |                          |
| Rotation               | Yes      | Yes                | + \*CS variants          |
| Lerp                   | Yes      | Yes                |                          |
| **Slerp**              | Optional | **Missing**        | Not critical for vectors |

### Complex — Field C (restricted to 2D use)

| Operation              | Required | Present          | Notes                           |
| ---------------------- | -------- | ---------------- | ------------------------------- | --- | ----------- |
| Addition               | Yes      | Yes              |                                 |
| Multiplication         | Yes      | Yes              | Correct (ac-bd, ad+bc)          |
| Zero                   | Yes      | Yes              |                                 |
| One (identity)         | Yes      | Yes              |                                 |
| Additive inverse       | Yes      | Yes (negate)     |                                 |
| Multiplicative inverse | Yes      | Yes (via divide) |                                 |
| Conjugate              | Yes      | Yes              |                                 |
| Magnitude/modulus      | Yes      | Yes              |                                 |
| Argument               | Yes      | Yes              |                                 |
| Normalize              | Yes      | Yes              |                                 |
| From/to polar          | Partial  | fromPolar only   | **Missing toPolar**             |
| **exp(z)**             | Standard | **Missing**      | e^(a+bi) = e^a(cos b + i sin b) |
| **log(z)**             | Standard | **Missing**      | ln                              | z   | + i\*arg(z) |
| **pow(z, w)**          | Standard | **Missing**      | e^(w\*ln(z))                    |

### Rotation2 — SO(2) Group

| Operation              | Required | Present        | Notes                                     |
| ---------------------- | -------- | -------------- | ----------------------------------------- |
| Composition (multiply) | Yes      | Yes            | Complex multiply                          |
| Identity               | Yes      | Yes            | (1, 0)                                    |
| Inverse                | Yes      | Yes            | Conjugate (cos, -sin)                     |
| From angle             | Yes      | Yes            |                                           |
| To angle               | Yes      | Yes            | atan2(sin, cos)                           |
| Apply to vector        | Yes      | Yes            | rotateVector                              |
| Lerp                   | Yes      | Yes            | lerp + normalize                          |
| **Slerp**              | Yes      | **Misleading** | Identical to lerp (correct but confusing) |
| **To Matrix2**         | Standard | **Missing**    | Explicit conversion                       |
| **To Complex**         | Standard | **Missing**    | Explicit conversion                       |

### Interval — Interval Algebra

| Operation                | Required | Present          | Notes                                  |
| ------------------------ | -------- | ---------------- | -------------------------------------- |
| Union                    | Yes      | Yes              |                                        |
| Intersection             | Yes      | Yes              |                                        |
| Contains (value)         | Yes      | Yes              |                                        |
| Overlaps                 | Yes      | Yes              |                                        |
| Width                    | Yes      | Yes              |                                        |
| Center                   | Yes      | Yes              |                                        |
| Expand                   | Yes      | Yes              |                                        |
| Arithmetic (+, -, \*, /) | Yes      | Partial          | / is scalar only                       |
| **Shrink**               | Standard | **Missing**      | Negative expand works but not explicit |
| **Hull**                 | Standard | Covered by union |                                        |
| **isEmpty**              | Standard | **Missing**      | Check if min > max                     |

### Matrix2 — 2x2 Linear Transforms

| Operation        | Required | Present     | Notes                    |
| ---------------- | -------- | ----------- | ------------------------ |
| Multiply         | Yes      | Yes         |                          |
| Determinant      | Yes      | Yes         |                          |
| Inverse          | Yes      | Yes (safe)  |                          |
| Transpose        | Yes      | Yes         |                          |
| From rotation    | Yes      | Yes         |                          |
| From scale       | Yes      | Yes         |                          |
| Transform vector | Yes      | Yes         |                          |
| Identity         | Yes      | Yes         |                          |
| **Eigenvalues**  | Optional | **Missing** | Complex for general case |
| **Trace**        | Standard | **Missing** | m00 + m11                |

### Matrix3 — 2D Affine Transforms

| Operation        | Required | Present | Notes           |
| ---------------- | -------- | ------- | --------------- |
| All Matrix2 ops  | Yes      | Yes     |                 |
| From translation | Yes      | Yes     |                 |
| From TRS         | Yes      | Yes     |                 |
| Decompose        | Yes      | Yes     |                 |
| Transform point  | Yes      | Yes     | With w-divide   |
| Transform vector | Yes      | Yes     | No translate    |
| Skew             | Standard | Yes     | Rare in 2D libs |

### Transform2 — Decomposed Affine

| Operation              | Required | Present      | Notes           |
| ---------------------- | -------- | ------------ | --------------- |
| Compose                | Yes      | Yes          | Parent \* child |
| Inverse                | Yes      | Yes (strict) |                 |
| To/from Matrix3        | Yes      | Yes          |                 |
| Lerp                   | Yes      | Yes          |                 |
| Transform point/vector | Yes      | Yes          |                 |

---

## 7.5 Convention Inconsistencies

### Naming

| Inconsistency                   | Location                            | Issue                                                 |
| ------------------------------- | ----------------------------------- | ----------------------------------------------------- |
| magnitudeSquared vs magnitudeSq | Vector2 vs Complex                  | Should be uniform                                     |
| inRange vs isInRange            | scalar/comparison vs numeric/guards | Confusing: tolerant vs exact                          |
| negate ≠ inverse                | Rotation2.negate                    | Name implies (-cos,-sin) but does (cos,-sin)          |
| slerp = lerp                    | Rotation2                           | Two identical methods                                 |
| mod (always positive)           | scalar/arithmetic                   | Should be euclideanMod to distinguish from flooredMod |
| angleValue                      | Rotation2                           | Duplicates angle getter                               |
| NORMALIZED = UNIT               | Interval                            | Redundant constant                                    |

### Signatures

| Inconsistency                                                   | Location         | Issue                  |
| --------------------------------------------------------------- | ---------------- | ---------------------- |
| Static divide(Interval, scalar) vs instance divide(Interval)    | Interval         | Different semantics    |
| Matrix invert (safe behavior, no Safe suffix)                   | Matrix2, Matrix3 | Breaks triality naming |
| Instance project/reflect/reject (safe behavior, no Safe suffix) | Vector2          | Breaks triality naming |
| normalized getter returns (0,0) vs normalizeSafe returns (1,0)  | Complex          | Different fallbacks    |
| fromPolar normalizes angle, setFromPolar doesn't                | Complex          | Inconsistent policy    |
| set() normalizes, constructor doesn't                           | Rotation2        | Inconsistent policy    |

### Patterns

| Inconsistency                                      | Location             | Issue                            |
| -------------------------------------------------- | -------------------- | -------------------------------- |
| Only 3/7 types re-export type guards               | core/                | Should be all or none            |
| Auxiliary functions don't use assertions           | auxiliary/           | Validation boundary is core-only |
| Transform2 shallow freeze on nested objects        | Transform2 constants | Bug: nested objects mutable      |
| ANGLE_EPSILON defined but unused                   | scalar/constants     | Orphan constant                  |
| GOLDEN_RATIO/GOLDEN_RATIO_CONJUGATE zero consumers | scalar/constants     | Orphan constants                 |
| ITERATIVE_TOLERANCE zero consumers                 | scalar/constants     | Future-facing but unused         |

---

## 7.6 Inferred Design Rules (Unwritten Pillars)

1. **"Readonly\*Like for input, concrete type for output"** — Universal. Never violated.

2. **"Static owns the logic, instance delegates"** — All core types follow this. Static methods contain the actual algorithm; instance methods are one-line delegates.

3. **"out parameter always last, always optional"** — Universal in static methods. Enables allocation-free hot paths.

4. **"Safe returns usable value, never NaN"** — Almost universal. Exception: powSafe returns NaN for complex result (documented, justified).

5. **"Assertions guard constructors and setters, not operators"** — Core types validate on construction/mutation, not on every arithmetic operation. This keeps hot-path operations fast.

6. **"Deterministic kernels for trigonometry, Math.\* for IEEE 754 required operations"** — Clear separation. Violated only by custom sqrt (unnecessary).

7. **"Three tiers: strict (throws), safe (fallback), unchecked (no validation)"** — Widely applied but not all operations have all three tiers.

8. **"Column-major storage, CCW positive, Y-up, radians"** — Consistent throughout.

9. **"\*CS variants for pre-computed cos/sin in hot loops"** — Applied to Vector2 rotation. Could be extended to other rotation-consuming methods.

10. **"freeze\* for immutable constants"** — Applied to all static constants (zero, one, identity). Shallow freeze bug in Transform2.

---

## 7.7 Cross-Cutting Quality Checks

### SRP (Single Responsibility)

- **Good:** Each file in auxiliary/ has a clear single responsibility (constants, arithmetic, comparison, interpolation)
- **Good:** Each core type is self-contained
- **Concern:** safety.ts mixes safe wrappers, compensated arithmetic, and sanitization

### DRY (Don't Repeat Yourself)

- **Good:** Normalization functions all delegate to loop()
- **Good:** Instance methods delegate to static
- **Concern:** Rotation2.slerp duplicates Rotation2.lerp
- **Concern:** Rotation2.negate duplicates Rotation2.inverse
- **Concern:** Interval.NORMALIZED duplicates Interval.UNIT

### SOLID

- **Open/Closed:** RandomSource interface allows extension without modification
- **Liskov:** \*Like interfaces enable substitution (any conforming object works)
- **Interface Segregation:** Good — ReadonlyVector2Like is minimal (2 props)
- **Dependency Inversion:** Core types depend on abstractions (\*Like interfaces), not concretions

### No Geometry/Physics Rule

- **Strictly followed.** No circles, AABBs, collisions, rigid bodies in math2d. It's pure mathematical primitives.

### DX (Developer Experience)

- **Strong:** Fluent chaining via instance methods returning `this`
- **Strong:** Flexible input via \*Like interfaces
- **Strong:** Clear error messages with parameter names
- **Gap:** Error messages don't suggest Safe alternatives
- **Gap:** Two nearly-identical methods (slerp/lerp, negate/inverse) confuse users

---

## 7.8 Executive Summary

### Top 5 Critical Patterns to Fix

1. **Transform2 shallow freeze bug** — Nested objects in IDENTITY/FLIP_X/FLIP_Y are mutable. Real bug with mutation risk.

2. **Naming inconsistencies that confuse users** — magnitudeSquared vs magnitudeSq, slerp identical to lerp, negate identical to inverse, inRange vs isInRange. These create API confusion.

3. **Range reduction uses modulo instead of Cody-Waite** — sin/cos precision degrades for large angles. Not a bug for typical use but limits the library's precision claims.

4. **Unnecessary custom sqrt** — IEEE 754 requires sqrt to be correctly rounded. The custom implementation is less accurate, slower, and adds complexity.

5. **Safe behavior without Safe naming** — Matrix2/3.invert, Vector2 instance project/reflect/reject behave safely without the Safe suffix, violating the triality convention.

### Top 5 Design Pillars to Sustain

1. **Readonly\*Like for input, concrete for output** — Excellent interop pattern
2. **Static owns logic, instance delegates** — Clean, consistent, performant
3. **DCE-based assertions** — Zero production cost, full dev protection
4. **Three-tier validation (strict/safe/unchecked)** — Flexible for all use cases
5. **out parameter for allocation-free hot paths** — Essential for physics loops

### Missing Operations by Priority

| Priority | Operation                     | Type      | Justification             |
| -------- | ----------------------------- | --------- | ------------------------- |
| High     | ReadonlyRotation2 type alias  | Rotation2 | Gap in type system        |
| Medium   | Complex.exp/log/toPolar       | Complex   | Standard field operations |
| Medium   | Rotation2.toMatrix2/toComplex | Rotation2 | Conversion graph holes    |
| Low      | Matrix2.trace                 | Matrix2   | Standard matrix operation |
| Low      | Interval.isEmpty              | Interval  | Convenience check         |

### Orphan Entities to Address

| Entity                              | Action                                   |
| ----------------------------------- | ---------------------------------------- |
| ANGLE_EPSILON                       | Integrate into anglesNearEqual or remove |
| GOLDEN_RATIO/GOLDEN_RATIO_CONJUGATE | Remove or justify                        |
| ITERATIVE_TOLERANCE                 | Document as future-facing or remove      |
| Rotation2.angleValue                | Remove (duplicates angle getter)         |
| Interval.NORMALIZED                 | Remove (duplicates UNIT)                 |
| Rotation2.slerp                     | Remove or document as alias              |
| Rotation2.negate                    | Fix implementation or rename             |
