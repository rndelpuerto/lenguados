# Phase 1 - Audit: core/ (Tasks 5.1-5.38)

## 5.1 Vector2

**File:** `src/core/vector2.ts` (~1200 lines)

### Static Methods

| Method                                    | Formula/Algorithm              | Dependencies                              |
| ----------------------------------------- | ------------------------------ | ----------------------------------------- | --- | ----------------------------------------- |
| create(x?, y?)                            | new Vector2(x, y)              | -                                         |
| fromAngle(angle)                          | (cos(a), sin(a))               | deterministic: cos, sin                   |
| fromArray(arr, offset?)                   | new Vector2(arr[o], arr[o+1])  | -                                         |
| zero/one/unitX/unitY/negUnitX/negUnitY    | Frozen constants               | freezeVector2                             |
| add(a, b, out?)                           | (a.x+b.x, a.y+b.y)             | -                                         |
| subtract(a, b, out?)                      | (a.x-b.x, a.y-b.y)             | -                                         |
| multiply(a, b, out?)                      | Component-wise                 | -                                         |
| divide(a, b, out?)                        | Component-wise with divideSafe | numeric: divideSafe                       |
| scale(v, s, out?)                         | (v.x*s, v.y*s)                 | -                                         |
| negate(v, out?)                           | (-v.x, -v.y)                   | -                                         |
| dot(a, b)                                 | a.x*b.x + a.y*b.y              | -                                         |
| cross(a, b)                               | a.x*b.y - a.y*b.x              | -                                         |
| magnitude(v)                              | sqrt(x^2+y^2)                  | deterministic: hypot                      |
| magnitudeSquared(v)                       | x^2+y^2                        | -                                         |
| distance(a, b)                            | magnitude(a-b)                 | deterministic: hypot                      |
| distanceSquared(a, b)                     | (dx^2+dy^2)                    | -                                         |
| normalize(v, out?)                        | v/                             | v                                         |     | deterministic: hypot; numeric: divideSafe |
| lerp(a, b, t, out?)                       | a + t\*(b-a)                   | -                                         |
| clamp(v, min, max, out?)                  | Component-wise clamp           | scalar: clamp                             |
| min/max(a, b, out?)                       | Component-wise                 | -                                         |
| rotate(v, angle, out?)                    | Rotation matrix                | deterministic: sin, cos                   |
| rotateCS(v, cos, sin, out?)               | Pre-computed rotation          | -                                         |
| rotateAround(v, center, angle, out?)      | Translate-rotate-translate     | deterministic: sin, cos                   |
| rotateAroundCS(v, center, cos, sin, out?) | Pre-computed variant           | -                                         |
| reflect(v, normal, out?)                  | v - 2*dot(v,n)*n               | -                                         |
| project(v, onto, out?)                    | (dot/dot)\*onto                | -                                         |
| reject(v, from, out?)                     | v - project(v, from)           | -                                         |
| angleBetween(a, b)                        | atan2(cross, dot)              | deterministic: atan2                      |
| setMagnitude(v, len, out?)                | normalize \* len               | deterministic: hypot; numeric: divideSafe |
| transformByMatrix3(v, m, out?)            | Matrix multiplication          | -                                         |

### Instance Methods

All instance methods delegate to static equivalents, mutating `this` and returning `this` for chaining.

### Analysis

- **Mathematically complete** for a 2D vector library. Covers all standard operations.
- **`magnitudeSquared` naming**: Complex uses `magnitudeSq`. Inconsistency.
- **Instance `project`/`reflect`/`reject`**: Behave as safe variants (return zero vector for degenerate inputs) despite being named as strict. This breaks the naming convention.
- **Missing `setMagnitudeUnchecked`**: Only safe version exists on instance.
- **Missing `reflectUnchecked`**: Only safe version exists on instance.
- **`*CS` variants**: Properly implemented for hot-loop optimization (rotateCS, rotateAroundCS).
- **`out` parameter**: Consistently last optional parameter across all static methods.

### Consumer Dependencies

Vector2 imports from:

- deterministic/: sin, cos, atan2, hypot
- numeric/safety: divideSafe
- scalar/arithmetic: clamp
- types/: Vector2Like, ReadonlyVector2Like
- validation/: assertVector2Like, assertFinite

### External Comparison

| Feature           | lenguados | gl-matrix   | three.js           | Box2D  |
| ----------------- | --------- | ----------- | ------------------ | ------ |
| Static + Instance | Yes       | Static only | Instance only      | Struct |
| `out` parameter   | Yes       | Yes         | No                 | N/A    |
| `*CS` variants    | Yes       | No          | No                 | No     |
| Safe division     | Yes       | No          | No                 | No     |
| Reflect           | Yes       | No          | Yes                | No     |
| Project/Reject    | Yes       | No          | Yes (project only) | No     |

**Verdict:** Complete, well-designed. Minor naming inconsistencies noted.

---

## 5.2 Complex

**File:** `src/core/complex.ts` (~900 lines)

### Static Methods

| Method                            | Formula                              | Dependencies            |
| --------------------------------- | ------------------------------------ | ----------------------- | --- | ----------------------------------------- |
| create(real?, imag?)              | new Complex                          | -                       |
| fromPolar(magnitude, angle)       | (m*cos(a), m*sin(a))                 | deterministic: sin, cos |
| fromAngle(angle)                  | (cos(a), sin(a))                     | deterministic: sin, cos |
| identity()                        | (1, 0)                               | -                       |
| zero()                            | (0, 0)                               | -                       |
| add/subtract/multiply(a, b, out?) | Standard complex arithmetic          | -                       |
| divide(a, b, out?)                | (ac+bd)/(c^2+d^2), (bc-ad)/(c^2+d^2) | numeric: divideSafe     |
| conjugate(z, out?)                | (re, -im)                            | -                       |
| negate(z, out?)                   | (-re, -im)                           | -                       |
| magnitude(z)                      | hypot(re, im)                        | deterministic: hypot    |
| magnitudeSq(z)                    | re^2 + im^2                          | -                       |
| normalize(z, out?)                | z /                                  | z                       |     | deterministic: hypot; numeric: divideSafe |
| argument(z)                       | atan2(im, re)                        | deterministic: atan2    |
| lerp(a, b, t, out?)               | Component-wise lerp                  | -                       |
| dot(a, b)                         | re1*re2 + im1*im2                    | -                       |

### Instance Methods

Mirror static methods. `normalized` getter returns (0,0) for zero-magnitude complex.

### Algebraic Completeness

| Field Operation       | Implemented      | Notes                              |
| --------------------- | ---------------- | ---------------------------------- | --- | ------------- |
| Addition              | Yes              | Commutative, associative           |
| Subtraction           | Yes              |                                    |
| Multiplication        | Yes              | Correct (ac-bd, ad+bc)             |
| Division              | Yes              | Safe (uses divideSafe)             |
| Conjugate             | Yes              |                                    |
| Magnitude             | Yes              |                                    |
| Argument (angle)      | Yes              |                                    |
| Normalize             | Yes              |                                    |
| Inverse               | Yes (via divide) | 1/z = conjugate(z)/                | z   | ^2            |
| **exp**               | **Missing**      | e^z = e^re * (cos(im) + i*sin(im)) |
| **log**               | **Missing**      | ln(z) = ln(                        | z   | ) + i\*arg(z) |
| **pow (complex exp)** | **Missing**      | z^w = e^(w\*ln(z))                 |
| **toPolar**           | **Missing**      | Explicit (magnitude, angle) pair   |

### Critical Findings

1. **`normalized` getter vs `normalizeSafe`**: `normalized` returns (0,0) for zero magnitude, `normalizeSafe` returns (1,0). Inconsistent fallback behavior.
2. **`fromPolar` normalizes angle**: Uses `normalizeRadians(angle)` before computing. But `setFromPolar` does NOT normalize. Inconsistency.
3. **Missing `exp`/`log`/`toPolar`**: These are standard complex number operations. Their absence limits the algebraic completeness.

### External Comparison

| Feature          | lenguados      | mathjs    | numeric.js |
| ---------------- | -------------- | --------- | ---------- |
| Basic arithmetic | Yes            | Yes       | Yes        |
| exp/log          | No             | Yes       | Yes        |
| pow (complex)    | No             | Yes       | Yes        |
| Polar form       | fromPolar only | Both ways | Both ways  |

**Verdict:** Good for 2D geometry use case. Missing transcendental operations limit general-purpose complex number use.

---

## 5.3 Rotation2

**File:** `src/core/rotation2.ts` (~750 lines)

### Design

Represents 2D rotation as a unit complex number (cos, sin). This is the SO(2) representation.

### Static Methods

| Method                   | Formula                                 | Dependencies                              |
| ------------------------ | --------------------------------------- | ----------------------------------------- |
| create(angle?)           | (cos(a), sin(a))                        | deterministic: cos, sin                   |
| fromAngle(angle)         | (cos(a), sin(a))                        | deterministic: cos, sin                   |
| fromDirection(x, y)      | normalize(x, y)                         | deterministic: hypot; numeric: divideSafe |
| identity()               | (1, 0)                                  | -                                         |
| multiply(a, b, out?)     | Complex multiply (rotation composition) | -                                         |
| inverse(r, out?)         | (cos, -sin) = conjugate                 | -                                         |
| lerp(a, b, t, out?)      | Component lerp + normalize              | deterministic: hypot; numeric: divideSafe |
| slerp(a, b, t, out?)     | Same as lerp (!)                        | Same                                      |
| angleBetween(a, b)       | atan2(cross, dot)                       | deterministic: atan2                      |
| rotateVector(r, v, out?) | Apply rotation to vector                | -                                         |

### Instance API

| Member         | Type   | Notes                     |
| -------------- | ------ | ------------------------- |
| angle (getter) | number | atan2(sin, cos)           |
| angleValue     | number | Duplicates `angle` getter |
| set(angle)     | method | Normalizes via cos/sin    |
| inverse()      | method | Negates sin component     |
| negate()       | method | Same as inverse (!)       |

### SO(2) Group Properties

| Property      | Status                                             |
| ------------- | -------------------------------------------------- |
| Closure       | Yes (multiply returns unit complex)                |
| Associativity | Yes (complex multiplication)                       |
| Identity      | Yes (1, 0)                                         |
| Inverse       | Yes (conjugate = (cos, -sin))                      |
| Normalization | Partial (set() normalizes, constructor/copy don't) |

### Critical Findings

1. **`slerp` identical to `lerp`**: In 2D, slerp of unit complex numbers reduces to lerp+normalize. Mathematically correct, but having two identically-implemented methods is misleading. Users might expect slerp to be "better" somehow.
2. **`negate` identical to `inverse`**: For unit complex numbers, negate(cos,sin) = (-cos,-sin) which is NOT the inverse. The inverse is (cos,-sin) = conjugate. But the implementation of `negate` actually does conjugate, matching `inverse`. The NAME is wrong — it should be `conjugate` or the implementation should actually negate.
3. **`angleValue` duplicates `angle` getter**: Unnecessary duplication.
4. **`set()` normalizes but constructor/copy don't**: Inconsistent normalization policy. If you construct with `new Rotation2()` and then manually set cos/sin, it might not be unit.
5. **Missing `ReadonlyRotation2` type alias**: Other core types have Readonly aliases (ReadonlyVector2, ReadonlyComplex, etc.). Rotation2 is missing this.

### External Comparison

| Feature        | lenguados        | Rapier           | Box2D           | Godot      |
| -------------- | ---------------- | ---------------- | --------------- | ---------- |
| Representation | Unit complex     | Unit complex     | Angle + sin/cos | Angle      |
| Composition    | Complex multiply | Complex multiply | Angle add       | Angle add  |
| Interpolation  | lerp+normalize   | lerp+normalize   | Angle lerp      | Angle lerp |

**Verdict:** Correct SO(2) representation. Naming issues (negate vs inverse, slerp vs lerp). Missing ReadonlyRotation2.

---

## 5.4 Interval

**File:** `src/core/interval.ts` (~600 lines)

### Design

1D interval [min, max] for range queries, overlap tests, and interval arithmetic.

### Static Methods

| Method                           | Formula                          | Dependencies        |
| -------------------------------- | -------------------------------- | ------------------- |
| create(min?, max?)               | new Interval                     | -                   |
| fromValues(min, max)             | Validates min <= max             | -                   |
| fromCenterExtent(c, e)           | [c-e/2, c+e/2]                   | -                   |
| EMPTY / ZERO / UNIT / NORMALIZED | Constants                        | freezeInterval      |
| add/subtract(a, b, out?)         | [a.min+b.min, a.max+b.max]       | -                   |
| multiply(a, b, out?)             | All 4 products, take min/max     | -                   |
| divide(a, scalar, out?)          | Scalar division                  | numeric: divideSafe |
| scale(a, s, out?)                | [min*s, max*s] with swap if s<0  | -                   |
| intersect(a, b, out?)            | [max(mins), min(maxes)]          | -                   |
| union(a, b, out?)                | [min(mins), max(maxes)]          | -                   |
| contains(a, value)               | min <= v <= max                  | -                   |
| overlaps(a, b)                   | a.min <= b.max && b.min <= a.max | -                   |
| width(a)                         | max - min                        | -                   |
| center(a)                        | (min+max)/2                      | -                   |
| expand(a, amount, out?)          | [min-amt, max+amt]               | -                   |
| lerp(a, b, t, out?)              | Component-wise                   | -                   |
| clamp(a, range, out?)            | Clamp to range                   | scalar: clamp       |

### Instance API

Mirrors static methods. Instance `divide` takes an Interval (not scalar), unlike static `divide`.

### Critical Findings

1. **`NORMALIZED` duplicates `UNIT`**: Both are [0, 1]. Redundant.
2. **Static `divide` takes scalar but instance `divide` takes Interval**: API inconsistency. Static: `Interval.divide(interval, scalar, out?)`. Instance: `interval.divide(other)` where other is IntervalLike.
3. **Completely isolated**: No other core type depends on Interval. It's a self-contained utility type.
4. **Interval arithmetic**: Multiplication correctly handles all sign combinations. Division by scalar uses divideSafe.

### External Comparison

| Feature        | lenguados        | Boost.Interval | Arb           |
| -------------- | ---------------- | -------------- | ------------- |
| Arithmetic     | Basic            | Full           | Full          |
| Set ops        | intersect, union | Same + hull    | Same          |
| Width/Center   | Yes              | Yes            | Yes           |
| Empty handling | EMPTY constant   | Special state  | Special state |

**Verdict:** Adequate for 2D physics (AABB projections). Static/instance divide inconsistency should be resolved.

---

## 5.5 Matrix2

**File:** `src/core/matrix2.ts` (~700 lines)

### Design

2x2 matrix stored as 4 components (m00, m01, m10, m11) in column-major order.

### Static Methods

| Method                         | Formula                  | Dependencies            |
| ------------------------------ | ------------------------ | ----------------------- |
| create()                       | Identity matrix          | -                       |
| fromValues(m00, m01, m10, m11) | Direct construction      | -                       |
| fromAngle(angle)               | Rotation matrix          | deterministic: cos, sin |
| fromScale(sx, sy)              | Diagonal matrix          | -                       |
| identity/zero()                | Constants                | freezeMatrix2           |
| add/subtract(a, b, out?)       | Component-wise           | -                       |
| multiply(a, b, out?)           | Matrix multiplication    | -                       |
| multiplyScalar(a, s, out?)     | Scale all components     | -                       |
| transpose(a, out?)             | Swap m01/m10             | -                       |
| determinant(a)                 | m00*m11 - m01*m10        | -                       |
| invert(a, out?)                | Classical adjugate / det | numeric: divideSafe     |
| transformVector(m, v, out?)    | Matrix \* vector         | -                       |
| rotate(m, angle, out?)         | Premultiply by rotation  | deterministic: cos, sin |
| scale(m, sx, sy, out?)         | Premultiply by scale     | -                       |
| lerp(a, b, t, out?)            | Component-wise           | -                       |

### Critical Findings

1. **`fromValues` parameter docs**: TSDoc labels parameters as (row0col0, row0col1, row1col0, row1col1) but storage is column-major. The parameter ORDER matches mathematical convention (row-major reading order) but STORAGE is column-major. This is documented but could confuse users.
2. **Missing `premultiply` static**: Only `multiply(a, b)` exists (a _ b). No explicit `premultiply(a, b)` = b _ a. Users must swap arguments.
3. **`invert` uses divideSafe**: Returns identity for singular matrices (det ~ 0). This follows the Safe convention but the method name doesn't have "Safe" suffix.

### External Comparison

| Feature    | lenguados         | gl-matrix    | three.js             |
| ---------- | ----------------- | ------------ | -------------------- |
| Storage    | Column-major      | Column-major | Row-major (elements) |
| 2x2 matrix | Yes               | mat2         | No (Matrix3 minimum) |
| Inversion  | Safe (divideSafe) | Standard     | Standard             |

**Verdict:** Solid implementation. Minor doc issue with parameter labeling.

---

## 5.6 Matrix3

**File:** `src/core/matrix3.ts` (~1400 lines)

### Design

3x3 matrix for 2D affine transformations. Column-major storage (9 components). Supports full affine transform pipeline: translate, rotate, scale, skew.

### Static Methods (comprehensive)

Core operations: create, fromValues, identity, zero, add, subtract, multiply, multiplyScalar, transpose, determinant, invert, adjugate.

Transform construction: fromTranslation, fromRotation, fromScale, fromSkew, fromTRS (translate-rotate-scale).

Transform application: translate, rotate, scale, skew (all premultiply).

Point/vector transform: transformPoint (with perspective divide), transformVector (no translate).

Decomposition: decompose (returns translation, rotation, scale).

### Critical Findings

1. **`transformPoint` always does perspective divide**: Divides by w = m20*x + m21*y + m22 for ALL cases, even affine matrices where w is always 1. Minor performance cost for the common case.
2. **Orphaned TSDoc blocks**: Some TSDoc comments exist without corresponding methods (leftover from refactoring).
3. **`decompose` extracts rotation via atan2**: Correctly handles negative scale (det < 0 → negate scaleX).
4. **`invert` uses divideSafe**: Same Safe-without-Safe-name pattern as Matrix2.

### Algebraic Completeness for 2D Affine Group

| Operation              | Status              |
| ---------------------- | ------------------- |
| Composition (multiply) | Yes                 |
| Identity               | Yes                 |
| Inverse                | Yes (safe)          |
| Decompose (TRS)        | Yes                 |
| Determinant            | Yes                 |
| Adjugate               | Yes                 |
| Transpose              | Yes                 |
| Point transform        | Yes (with w-divide) |
| Vector transform       | Yes (no translate)  |

### External Comparison

| Feature    | lenguados | gl-matrix | three.js     | Rapier    |
| ---------- | --------- | --------- | ------------ | --------- |
| 3x3 for 2D | Yes       | mat3 (3D) | Matrix3 (3D) | Isometry2 |
| Decompose  | Yes       | No        | Yes (3D)     | No        |
| Skew       | Yes       | No        | No           | No        |
| fromTRS    | Yes       | No        | Yes          | No        |

**Verdict:** Most comprehensive Matrix3 for 2D among compared libraries. Well-implemented.

---

## 5.7 Transform2

**File:** `src/core/transform2.ts` (~800 lines)

### Design

Decomposed 2D transform: position (Vector2) + rotation (Rotation2) + scale (Vector2). This is the "TRS" representation, more user-friendly than raw Matrix3.

### Static Methods

| Method                       | Formula                      | Dependencies                 |
| ---------------------------- | ---------------------------- | ---------------------------- |
| create(pos?, rot?, scale?)   | Compose from components      | Vector2, Rotation2           |
| fromMatrix3(m)               | Decompose matrix             | Matrix3.decompose            |
| identity()                   | pos(0,0), rot(0), scale(1,1) | -                            |
| IDENTITY / FLIP_X / FLIP_Y   | Constants                    | Object.freeze                |
| compose(parent, child, out?) | Hierarchical combine         | -                            |
| invert(t, out?)              | Inverse transform            | Rotation2.inverse            |
| lerp(a, b, t, out?)          | Component lerp               | Vector2.lerp, Rotation2.lerp |
| transformPoint(t, p, out?)   | Scale→Rotate→Translate       | -                            |
| transformVector(t, v, out?)  | Scale→Rotate (no translate)  | -                            |
| toMatrix3(t, out?)           | Build matrix from TRS        | -                            |

### Instance API

Component access via `.position`, `.rotation`, `.scale` properties.

### Critical Findings

1. **SHALLOW FREEZE BUG**: Static constants (`IDENTITY`, `FLIP_X`, `FLIP_Y`) use `Object.freeze()` but the nested `position`, `rotation`, and `scale` objects are NOT frozen. This means:

   ```typescript
   Transform2.IDENTITY.position.x = 999; // SUCCEEDS! Mutates the "constant"
   ```

   This is a real bug. The freeze should be deep, or the nested objects should be separately frozen.

2. **`inverted` getter throws (strict)**: Unlike Matrix3's safe inversion, Transform2's `inverted` throws for zero-scale. Inconsistent severity convention across types.

3. **`compose` order**: parent \* child (standard scene graph convention). Correct.

4. **`lerp` uses Rotation2.lerp**: Which is lerp+normalize. Correct for smooth interpolation.

### External Comparison

| Feature       | lenguados     | Godot Transform2D | Unity Transform       | Rapier Isometry2   |
| ------------- | ------------- | ----------------- | --------------------- | ------------------ |
| Components    | pos+rot+scale | Origin + 2 axes   | pos+rot+scale         | pos+rot (no scale) |
| Hierarchical  | compose       | \* operator       | parent.TransformPoint | \* operator        |
| Interpolation | lerp          | interpolate_with  | N/A                   | N/A                |
| To matrix     | toMatrix3     | Implicit          | localToWorldMatrix    | N/A                |

**Verdict:** Good design. The shallow freeze bug is the most critical finding in all core types.

---

## 5.8 core/index.ts

**File:** `src/core/index.ts`

Barrel exports all core types and their freeze utilities:

```typescript
export { Vector2, freezeVector2 } from './vector2';
export { Complex, freezeComplex } from './complex';
export { Rotation2, freezeRotation2 } from './rotation2';
export { Interval, freezeInterval } from './interval';
export { Matrix2, freezeMatrix2 } from './matrix2';
export { Matrix3, freezeMatrix3 } from './matrix3';
export { Transform2, freezeTransform2 } from './transform2';
```

Also exports Readonly type aliases:

- ReadonlyVector2, ReadonlyComplex, ReadonlyInterval, ReadonlyMatrix2, ReadonlyMatrix3, ReadonlyTransform2
- **Missing: ReadonlyRotation2** (confirmed from Rotation2 analysis)

**Verdict:** Clean barrel export. Missing ReadonlyRotation2.

---

## 5.9 Cross-Type Dependency Map

```
Transform2 depends on:
  - Vector2 (position, scale)
  - Rotation2 (rotation)
  - Matrix3 (toMatrix3, fromMatrix3)

Matrix3 depends on:
  - deterministic/ (sin, cos, atan2)
  - numeric/ (divideSafe)

Matrix2 depends on:
  - deterministic/ (sin, cos)
  - numeric/ (divideSafe)

Vector2 depends on:
  - deterministic/ (sin, cos, atan2, hypot)
  - numeric/ (divideSafe)
  - scalar/ (clamp)

Complex depends on:
  - deterministic/ (sin, cos, atan2, hypot)
  - numeric/ (divideSafe)
  - angle/ (normalizeRadians) — only in fromPolar

Rotation2 depends on:
  - deterministic/ (sin, cos, atan2, hypot)
  - numeric/ (divideSafe)

Interval depends on:
  - numeric/ (divideSafe)
  - scalar/ (clamp)
```

### Observations

- **All core types depend on deterministic/ and numeric/divideSafe**: These are the true foundation primitives.
- **Only Transform2 has inter-core-type dependencies**: It's the composition layer.
- **Interval is isolated**: No core type uses it. No core type depends on it.
- **Complex is only used indirectly**: No other core type imports Complex directly.

---

## 5.10 Freeze Utilities

Each core type has a `freeze*` function that creates an immutable version using `Object.freeze()`.

| Type       | Freeze Function  | Deep?                        |
| ---------- | ---------------- | ---------------------------- |
| Vector2    | freezeVector2    | N/A (no nested objects)      |
| Complex    | freezeComplex    | N/A                          |
| Rotation2  | freezeRotation2  | N/A                          |
| Interval   | freezeInterval   | N/A                          |
| Matrix2    | freezeMatrix2    | N/A                          |
| Matrix3    | freezeMatrix3    | N/A                          |
| Transform2 | freezeTransform2 | **Should be deep but isn't** |

The freeze functions work correctly for flat types. Only Transform2 has nested mutable objects, and its freeze is shallow (the bug noted in 5.7).

---

## 5.11 Naming Consistency Across Core Types

| Operation         | Vector2               | Complex               | Rotation2             | Matrix2            | Matrix3            |
| ----------------- | --------------------- | --------------------- | --------------------- | ------------------ | ------------------ |
| Squared magnitude | magnitudeSquared      | magnitudeSq           | N/A                   | N/A                | N/A                |
| Safe inversion    | divideSafe (internal) | divideSafe (internal) | divideSafe (internal) | invert (safe impl) | invert (safe impl) |
| Angle extraction  | angleBetween          | argument              | angle                 | N/A                | decompose          |
| Normalize         | normalize             | normalize             | N/A (always unit)     | N/A                | N/A                |
| Lerp              | lerp                  | lerp                  | lerp + slerp          | lerp               | lerp               |

**Key inconsistencies:**

1. `magnitudeSquared` vs `magnitudeSq` — should be uniform
2. Matrix invert is safe without "Safe" suffix
3. Rotation2 has `slerp` identical to `lerp`

---

## 5.12 Diagnostic by Entity

### Vector2

| Entity                          | Verdict  | Justification                                        |
| ------------------------------- | -------- | ---------------------------------------------------- |
| All static methods              | Keep     | Mathematically complete                              |
| magnitudeSquared                | Redefine | Rename to `magnitudeSq` for consistency with Complex |
| Instance project/reflect/reject | Redefine | Should follow strict naming or be renamed to \*Safe  |
| \*CS variants                   | Keep     | Correct hot-loop optimization pattern                |
| `out` parameter convention      | Keep     | Consistent allocation-free pattern                   |

### Complex

| Entity                 | Verdict  | Justification                                      |
| ---------------------- | -------- | -------------------------------------------------- |
| Basic arithmetic       | Keep     | Correct field operations                           |
| normalized getter      | Redefine | Inconsistent fallback (0,0) vs normalizeSafe (1,0) |
| fromPolar/setFromPolar | Redefine | Inconsistent normalization                         |
| exp/log/toPolar        | Add      | Missing standard complex operations                |
| magnitudeSq            | Keep     | Good naming (Vector2 should match this)            |

### Rotation2

| Entity               | Verdict  | Justification                                          |
| -------------------- | -------- | ------------------------------------------------------ |
| SO(2) representation | Keep     | Correct unit complex approach                          |
| slerp                | Redefine | Identical to lerp, misleading name                     |
| negate               | Redefine | Name implies (-cos,-sin) but does conjugate (cos,-sin) |
| angleValue           | Remove   | Duplicates angle getter                                |
| ReadonlyRotation2    | Add      | Missing type alias                                     |
| Normalization policy | Redefine | Inconsistent (set normalizes, construct doesn't)       |

### Interval

| Entity          | Verdict  | Justification                                           |
| --------------- | -------- | ------------------------------------------------------- |
| All arithmetic  | Keep     | Correct interval math                                   |
| NORMALIZED      | Remove   | Duplicates UNIT                                         |
| Instance divide | Redefine | Takes Interval while static takes scalar — inconsistent |
| Isolation       | Keep     | Clean separation, no forced dependencies                |

### Matrix2

| Entity          | Verdict  | Justification                           |
| --------------- | -------- | --------------------------------------- |
| All operations  | Keep     | Complete 2x2 matrix                     |
| fromValues docs | Redefine | Parameter labels confusing (row/column) |
| invert naming   | Redefine | Safe behavior without Safe suffix       |

### Matrix3

| Entity                  | Verdict  | Justification                    |
| ----------------------- | -------- | -------------------------------- |
| All operations          | Keep     | Most comprehensive 2D matrix     |
| transformPoint w-divide | Redefine | Unnecessary for pure affine case |
| Orphaned TSDoc          | Remove   | Cleanup needed                   |
| invert naming           | Redefine | Same as Matrix2                  |

### Transform2

| Entity                  | Verdict  | Justification                               |
| ----------------------- | -------- | ------------------------------------------- |
| TRS design              | Keep     | Standard decomposed transform               |
| Static constants freeze | **Fix**  | Shallow freeze bug — nested objects mutable |
| inverted throws         | Redefine | Inconsistent with Matrix3 safe inversion    |
| compose/lerp            | Keep     | Correct implementations                     |

### Summary

| Category | Count                                    |
| -------- | ---------------------------------------- |
| Keep     | 28                                       |
| Redefine | 14                                       |
| Remove   | 2 (angleValue, NORMALIZED)               |
| Add      | 4 (exp, log, toPolar, ReadonlyRotation2) |
| Fix      | 1 (Transform2 shallow freeze)            |
