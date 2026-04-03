## Context

Five consistency issues discovered during the post-implementation review phase of `math2d-comprehensive-audit`. Each is a direct analogue of a change already made during the audit but in a sibling location.

## Goals / Non-Goals

**Goals:**

- Extend `assertNonZero` NaN fix to match the `assertPositive`/`assertNonNegative` pattern
- Bring `Transform2` constructor into full Constructor Purity compliance
- Eliminate double-normalization in `Rotation2.fromVector2`, `fromVectors2`
- Eliminate double-normalization in 4 `Transform2` static methods
- Complete GIGO test coverage for eigenvalues and solveLinearSystem

**Non-Goals:**

- Adding new public methods or changing method signatures
- Modifying `assertFinite`, `assertIsNumber`, or any other assertion functions (only `assertNonZero` is affected)
- Changing the behavior of the Safe/strict/unchecked triality (these are internal implementation fixes)
- Re-auditing any previously ratified rejected proposals

## Decisions

### Decision 1: Fix `assertNonZero` via identical pattern to `assertPositive`/`assertNonNegative`

**Root cause**: `assertNonZero` guard is `if (value === 0)`. IEEE 754: `NaN === 0` is `false`, so NaN silently passes.

**Fix**: Change to `if (value !== value || value === 0)`.

**Evidence**: `assertPositive` (line ~180) and `assertNonNegative` (line ~195) were fixed identically in audit task 1.3. `assertNonZero` (line ~209) was omitted from that fix. All three assertion functions guard against a numeric range — all three must reject NaN by the same reasoning (NaN is not in any valid numeric range).

**No impact on `assertIsFinite` or `assertIsNumber`**: These already handle NaN by different semantics (`isFinite(NaN)` returns false; `typeof NaN === 'number'` is true but `isNaN` check is separate).

---

### Decision 2: Remove `assertFinite` from `Transform2` constructor

**Root cause**: `Transform2` constructor (line ~234) calls `assertFinite(rotation, 'Transform2.constructor:rotation')` inside the constructor body.

**Constructor Purity rule** (ratified in `audit-architectural-fixes`, documented in `architecture-and-layers.md`): Constructors MUST have NO assertions. NaN/Infinity are valid IEEE 754 values in the math layer.

**Evidence**: All 6 other core types comply with this rule:

- `Vector2` constructor: pure assignment with canonical comment
- `Rotation2` constructor: pure assignment with canonical comment
- `Complex` constructor: pure assignment
- `Interval` constructor: fixed in audit, now pure
- `Matrix2` constructor: pure assignment
- `Matrix3` constructor: pure assignment

`Transform2` was an oversight — `assertFinite` was added before the Constructor Purity rule was formally ratified.

**Action**: Remove the `assertFinite` call. Add canonical comment. Remove the `assertFinite` import if it is no longer used anywhere in `transform2.ts`.

---

### Decision 3: Fix `Rotation2.fromVector2` and `fromVectors2` double-normalization

**Root cause**: Both methods compute the unit vector manually:

```typescript
const inv = 1 / Math.sqrt(x * x + y * y); // or hypot
// ...
return this.ensureOut(out).set(x * inv, y * inv); // ← set() normalizes again
```

`Rotation2.set()` normalizes the components (computes magnitude, divides). So the magnitude is computed TWICE.

**Evidence**: After the audit, `setDirect(cos, sin)` exists precisely for this pattern. All other `Rotation2` factory methods that pre-compute normalized values use `setDirect`. `fromVector2` and `fromVectors2` were overlooked.

**Fix**: Replace `.set(x * inv, y * inv)` with `.setDirect(x * inv, y * inv)` in both methods.

**Safety**: The method already validates the input vector length before computing `inv` (via strict/safe/unchecked triality). The result is mathematically guaranteed to be unit-length before `setDirect` is called.

---

### Decision 4: Fix `Transform2` double-normalization in 4 static methods

**Root cause**: `Transform2` internally stores rotation as a `Rotation2` instance. Several static methods manually compute `(cos, sin)` from an angle, then call `this.rotation.set(cos, sin)` or `result.rotation.set(cos, sin)`. Since `Rotation2.set()` normalizes, this triggers a redundant `Math.sqrt` / `hypot` on values that are already unit-length by construction.

**Affected methods** (verified by code inspection):

- `Transform2.multiply` static (~line 569)
- `Transform2.inverseUnchecked` static (~line 675)
- `Transform2.fromComponents` static (~line 357)
- `Transform2.premultiply` instance (~line 1992)

**Fix**: Replace `result.rotation.set(cos, sin)` with direct property assignment:

```typescript
result.rotation.cos = cos;
result.rotation.sin = sin;
```

This is safe because:

1. The `cos`/`sin` values are already unit-length (computed from `Math.sqrt` or existing unit rotations)
2. Direct property access bypasses `Rotation2.set()` normalization without exposing `setDirect`
3. `Rotation2.cos` and `Rotation2.sin` are public mutable properties

**Alternative considered**: Make `Rotation2.setDirect` protected or internal-only. Rejected: the existing `setDirect` pattern on Rotation2 is already private and sufficient for Rotation2's own needs. Transform2 should use direct property assignment since it already owns the result object.

---

### Decision 5: Add GIGO and edge-case tests

**Matrix2.eigenvalues** missing coverage:

- Zero matrix `[[0,0],[0,0]]` → both eigenvalues 0
- Jordan block `[[2,1],[0,2]]` → repeated eigenvalue (discriminant = 0 edge case)
- Negative diagonal `[[-1,0],[0,-2]]` → real negative eigenvalues

**Matrix2.eigendecompose** GIGO:

- Complex eigenvalue case → return type `{ type: 'complex' }` with no eigenvectors

**Matrix2.solveLinearSystemUnchecked** GIGO:

- Singular matrix → result contains NaN or Infinity (not a throw)

**Matrix3.solveLinearSystemUnchecked** GIGO:

- Singular matrix → result contains NaN or Infinity

**Rationale**: The GIGO contract for Unchecked methods is documented in `testing-deep-patterns.md`. Without explicit tests, a future refactor could accidentally add a throw to an Unchecked method without the test suite catching it.
