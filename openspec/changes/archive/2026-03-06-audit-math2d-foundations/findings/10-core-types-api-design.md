# Phase 2 - API Design: Core Types (Tasks 10.1-10.11)

## 10.1 Vector2 — Definitive API

### Signature Sheet

All existing methods confirmed. Changes:

| Change | From                            | To                                                                  | Rationale                |
| ------ | ------------------------------- | ------------------------------------------------------------------- | ------------------------ |
| Rename | `magnitudeSquared`              | `magnitudeSq`                                                       | Consistency with Complex |
| Fix    | Instance project/reflect/reject | Add explicit safe behavior documentation or rename with Safe suffix | Triality compliance      |

### Layer Classification

| Method                       | Layer                | Composes From         |
| ---------------------------- | -------------------- | --------------------- |
| add, subtract, scale, negate | Primitive            | None                  |
| dot, cross                   | Primitive            | None                  |
| magnitude                    | Primitive            | deterministic/hypot   |
| magnitudeSq                  | Primitive            | None                  |
| normalize                    | Primitive            | hypot + divideSafe    |
| rotate, rotateCS             | Primitive + Hot Path | deterministic/sin,cos |
| rotateAround, rotateAroundCS | Primitive + Hot Path | rotate                |
| reflect, project, reject     | Primitive            | dot                   |
| lerp                         | Primitive            | None                  |
| Instance.add(other)          | Facade               | Static.add            |

---

## 10.2 Complex — Definitive API

### Existing Methods: All Keep

### New Methods to Add

| Method       | Signature | Formula                          | Priority |
| ------------ | --------- | -------------------------------- | -------- | --------- | ------ |
| exp(z, out?) | Static    | e^z = e^re \* (cos(im), sin(im)) | Medium   |
| log(z, out?) | Static    | (ln                              | z        | , arg(z)) | Medium |
| toPolar(z)   | Static    | { magnitude, angle }             | Medium   |

### Fixes

| Fix                                  | Issue                  | Resolution                              |
| ------------------------------------ | ---------------------- | --------------------------------------- |
| normalized getter fallback           | Returns (0,0) for zero | Change to (1,0) to match normalizeSafe  |
| fromPolar/setFromPolar normalization | Inconsistent           | Both should normalize angle, or neither |

---

## 10.3 Rotation2 — Definitive API

### Existing Methods: Mostly Keep

### Removals

| Method     | Reason                  | Replacement                                    |
| ---------- | ----------------------- | ---------------------------------------------- |
| angleValue | Duplicates angle getter | Use `angle` getter                             |
| slerp      | Identical to lerp in 2D | Use `lerp` (document that lerp IS slerp in 2D) |

### Fixes

| Fix                  | Issue                                 | Resolution                                                   |
| -------------------- | ------------------------------------- | ------------------------------------------------------------ |
| negate               | Does conjugate, not negate            | Rename to `conjugate` OR fix to actually negate (-cos, -sin) |
| Normalization policy | set() normalizes, constructor doesn't | Document: constructor trusts input, set() validates          |

### New Types to Add

| Type              | Definition                       | Priority |
| ----------------- | -------------------------------- | -------- |
| ReadonlyRotation2 | `Readonly<Rotation2>` type alias | High     |

### New Methods to Add (conversions)

| Method             | Signature        | Priority |
| ------------------ | ---------------- | -------- |
| toMatrix2(r, out?) | Static → Matrix2 | Medium   |
| toComplex(r, out?) | Static → Complex | Medium   |

---

## 10.4 Interval — Definitive API

### Removals

| Entity     | Reason          | Replacement |
| ---------- | --------------- | ----------- |
| NORMALIZED | Duplicates UNIT | Use UNIT    |

### Fixes

| Fix             | Issue                               | Resolution                                 |
| --------------- | ----------------------------------- | ------------------------------------------ |
| Instance divide | Takes Interval, static takes scalar | Align: both should support scalar division |

---

## 10.5 Matrix2 — Definitive API

### Existing Methods: All Keep

### Fixes

| Fix              | Issue                             | Resolution                                                            |
| ---------------- | --------------------------------- | --------------------------------------------------------------------- |
| fromValues TSDoc | Parameter labels confusing        | Clarify: parameters are in row-reading order, storage is column-major |
| invert naming    | Safe behavior without Safe suffix | Document: "returns identity for singular matrices" prominently        |

### New Methods to Add

| Method   | Formula   | Priority |
| -------- | --------- | -------- |
| trace(m) | m00 + m11 | Low      |

---

## 10.6 Matrix3 — Definitive API

### Existing Methods: All Keep

### Fixes

| Fix                     | Issue                  | Resolution                                          |
| ----------------------- | ---------------------- | --------------------------------------------------- |
| transformPoint w-divide | Unnecessary for affine | Add fast path: skip divide when m20=0, m21=0, m22=1 |
| Orphaned TSDoc          | Leftover comments      | Remove during cleanup                               |
| invert naming           | Same as Matrix2        | Document safe behavior prominently                  |

---

## 10.7 Transform2 — Definitive API

### Existing Methods: All Keep

### Critical Fix

| Fix            | Issue                                                | Resolution                                                                                                 |
| -------------- | ---------------------------------------------------- | ---------------------------------------------------------------------------------------------------------- |
| Shallow freeze | Nested objects in IDENTITY/FLIP_X/FLIP_Y are mutable | Deep freeze: `freezeVector2(this.position)`, `freezeRotation2(this.rotation)`, `freezeVector2(this.scale)` |

### Fixes

| Fix             | Issue                          | Resolution                                                      |
| --------------- | ------------------------------ | --------------------------------------------------------------- |
| inverted throws | Inconsistent with Matrix3 safe | Document as intentional: Transform2 strict requires valid scale |

---

## 10.8 Type Conversion Graph

### Current Conversions

```
Vector2  ←→  (no direct conversions to other types)
Complex  ←→  Rotation2 (implicit via unit complex, no explicit methods)
Complex  →   Vector2 (via .real/.imag = .x/.y but no explicit conversion)
Rotation2 →  angle (via .angle getter)
angle    →   Rotation2 (via fromAngle)
Matrix2  ←   Rotation2 (via Matrix2.fromRotation)
Matrix3  ←   Transform2 (via Transform2.toMatrix3)
Matrix3  →   Transform2 (via Transform2.fromMatrix3 / Matrix3.decompose)
```

### Proposed Additions (Closing Graph Holes)

```
Rotation2 → Matrix2   (Rotation2.toMatrix2)       — close conversion gap
Rotation2 → Complex   (Rotation2.toComplex)        — make equivalence explicit
Complex   → Rotation2 (Complex.toRotation2 or normalize+reinterpret)
```

### Round-Trip Safety

| Conversion                              | Round-Trip                | Safe?                 |
| --------------------------------------- | ------------------------- | --------------------- |
| Rotation2 → angle → Rotation2           | fromAngle(r.angle)        | Yes (within EPSILON)  |
| Transform2 → Matrix3 → Transform2       | fromMatrix3(toMatrix3(t)) | Yes for TRS (no skew) |
| Matrix3 → Transform2 → Matrix3          | toMatrix3(fromMatrix3(m)) | Lossy if m has skew   |
| Rotation2 → Matrix2 → angle → Rotation2 | Multi-step                | Accumulates error     |

---

## 10.9 Inter-Type Facades

### Current Inter-Type Delegations

| Facade                   | Owner      | Canonical Implementation          | Keep? |
| ------------------------ | ---------- | --------------------------------- | ----- |
| Vector2 instance methods | Vector2    | Vector2 static methods            | Yes   |
| Transform2.toMatrix3     | Transform2 | Builds Matrix3 from TRS           | Yes   |
| Transform2.fromMatrix3   | Transform2 | Uses Matrix3.decompose internally | Yes   |
| Matrix3.fromTRS          | Matrix3    | Composes translate*rotate*scale   | Yes   |

**No cross-type facades exist** (e.g., no `Vector2.applyRotation2`). Core types import from deterministic/ and auxiliary/ directly, not from each other (except Transform2 → Vector2/Rotation2/Matrix3).

This is architecturally clean: each type is self-contained, and Transform2 is the only composition type.

---

## 10.10 Cross-Type Consistency Matrix

| Method Family     | Vector2 | Complex  | Rotation2 | Interval | Matrix2  | Matrix3  | Transform2 |
| ----------------- | ------- | -------- | --------- | -------- | -------- | -------- | ---------- |
| create/fromValues | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| clone             | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| copy              | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| set               | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| exactEquals       | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| nearEquals        | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| toArray           | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | No         |
| fromArray         | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | No         |
| toString          | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| lerp              | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| add               | Yes     | Yes      | No        | Yes      | Yes      | Yes      | No         |
| subtract          | Yes     | Yes      | No        | Yes      | Yes      | Yes      | No         |
| negate            | Yes     | Yes      | Yes\*     | Yes      | Yes      | Yes      | No         |
| scale             | Yes     | Yes      | No        | Yes      | Yes      | Yes      | No         |
| multiply          | No      | Yes      | Yes       | Yes      | Yes      | Yes      | No         |
| inverse           | No      | Yes(div) | Yes       | No       | Yes      | Yes      | Yes        |
| identity          | No      | Yes      | Yes       | No       | Yes      | Yes      | Yes        |
| isIdentity        | No      | No       | No        | No       | No       | No       | No         |
| magnitude         | Yes     | Yes      | No        | No       | No       | No       | No         |
| normalize         | Yes     | Yes      | No        | No       | No       | No       | No         |
| determinant       | No      | No       | No        | No       | Yes      | Yes      | No         |
| transpose         | No      | No       | No        | No       | Yes      | Yes      | No         |
| compose           | No      | No       | Yes(mul)  | No       | Yes(mul) | Yes(mul) | Yes        |
| freeze\*          | Yes     | Yes      | Yes       | Yes      | Yes      | Yes      | Yes        |
| Readonly type     | Yes     | Yes      | **No**    | Yes      | Yes      | Yes      | Yes        |

\*Rotation2.negate is misnamed (does conjugate)

### Gaps Worth Closing

- **ReadonlyRotation2**: Missing type alias (all other types have it)
- **isIdentity**: Not present on any type. Could be useful.
- **Transform2.toArray/fromArray**: Missing, but justified (complex nested structure)

---

## 10.11 Module Dependency Graph (DAG Verification)

```
Level 0 (leaves):  types/  scalar/constants  validation/
Level 1:           deterministic/ (imports scalar/constants)
Level 2:           scalar/arithmetic,comparison,interpolation
Level 3:           angle/ (imports scalar + deterministic)
                   numeric/ (imports scalar + deterministic)
Level 4:           core/ (imports all above)
Level 5:           utils/ (imports all above + core)
Level 6:           index.ts (re-exports all)
```

**Zero cycles confirmed.** The dependency graph is a strict DAG. No module at level N imports from level N+1 or higher.

**Note:** deterministic/ at Level 1 is a slight anomaly — it's documented as "L0" but imports from scalar/constants (also Level 0). In practice, scalar/constants is a pure-value module with no behavior, so this dependency is benign.
