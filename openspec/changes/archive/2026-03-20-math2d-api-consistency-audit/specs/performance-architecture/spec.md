## MODIFIED Requirements

### Requirement: R-SMITH-ALLOC — complexDivideSmith SHALL NOT allocate tuples/arrays

The `complexDivideSmith` helper function (used internally by `Complex.divide` and related methods) SHALL write its result directly to the caller's `out` parameter fields (`out.real`, `out.imag`) instead of returning a `[number, number]` tuple. The current implementation allocates a two-element array on every call, which creates GC pressure in hot paths where complex division is performed repeatedly.

The refactored signature SHALL be: `complexDivideSmith(aRe: number, aIm: number, bRe: number, bIm: number, out: Complex): void` (or equivalent that avoids intermediate allocation).

**Source:** `packages/math2d/src/core/complex.ts` (complexDivideSmith helper)

#### Scenario: WHEN complexDivideSmith is called THEN no tuple is allocated

- **GIVEN** `a = Complex(1, 2)` and `b = Complex(3, 4)` and `out = new Complex()`
- **WHEN** `complexDivideSmith(1, 2, 3, 4, out)` is called
- **THEN** `out.real` SHALL be `(1*3 + 2*4) / (3*3 + 4*4) = 11/25 = 0.44`
- **AND** `out.imag` SHALL be `(2*3 - 1*4) / (3*3 + 4*4) = 2/25 = 0.08`
- **AND** no `[number, number]` array or tuple SHALL be allocated during the operation

#### Scenario: WHEN Complex.divide is called THEN the result is bit-identical to current implementation

- **GIVEN** `a = Complex(1e100, 1e100)` and `b = Complex(1e-100, 1e-100)` (extreme scaling)
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be bit-identical to the current implementation (Smith algorithm branching logic preserved)
- **AND** no intermediate tuple SHALL be allocated

#### Scenario: WHEN Complex.divide is called in a loop THEN no per-iteration GC pressure

- **GIVEN** a loop performing 10,000 complex divisions with a reused `out` parameter
- **WHEN** the loop completes
- **THEN** the number of heap allocations from `complexDivideSmith` SHALL be zero (all results written directly to `out`)

#### Scenario: WHEN complexDivideSmith handles the scaling branch THEN results are numerically identical

- **GIVEN** `a = Complex(1, 0)` and `b = Complex(1e-200, 1e-200)` (triggers scaling branch in Smith algorithm)
- **WHEN** `Complex.divide(a, b)` is called
- **THEN** the result SHALL be numerically identical to the current tuple-returning implementation
- **AND** the Smith algorithm's overflow/underflow protection SHALL be preserved exactly

---

### Requirement: R-INT-MUL-ALLOC — Interval.multiply SHALL NOT allocate arrays

`Interval.multiply` currently creates `const products = [p1, p2, p3, p4]` and passes it to `Math.min(...products)` / `Math.max(...products)`. This allocates a 4-element array on every call. The implementation SHALL use 4 local scalar variables and compute the min/max directly: `Math.min(p1, p2, p3, p4)` and `Math.max(p1, p2, p3, p4)`.

**Source:** `packages/math2d/src/core/interval.ts` (multiply implementation)

#### Scenario: WHEN Interval.multiply is called THEN no array is allocated

- **GIVEN** `a = Interval(2, 3)` and `b = Interval(4, 5)`
- **WHEN** `Interval.multiply(a, b)` is called
- **THEN** the result SHALL be `Interval(8, 15)` (min of products, max of products)
- **AND** no `Array` SHALL be allocated during the computation
- **AND** the implementation SHALL use `Math.min(p1, p2, p3, p4)` with scalar variables

#### Scenario: WHEN Interval.multiply is called with a negative interval THEN result is correct

- **GIVEN** `a = Interval(-3, 2)` and `b = Interval(-1, 4)`
- **WHEN** `Interval.multiply(a, b)` is called
- **THEN** the four products are: `(-3)*(-1)=3`, `(-3)*4=-12`, `2*(-1)=-2`, `2*4=8`
- **AND** the result SHALL be `Interval(-12, 8)` (min=-12, max=8)
- **AND** no intermediate array SHALL be allocated

#### Scenario: WHEN Interval.multiply is called in a tight loop THEN allocation count is zero

- **GIVEN** a loop performing 10,000 interval multiplications
- **WHEN** the loop completes
- **THEN** the number of heap allocations from the multiply computation (excluding the result Interval itself) SHALL be zero

---

### Requirement: R-T2-MUL-INLINE — Transform2.multiply (static) SHALL inline rotation computation

`Transform2.multiply(a, b, out?)` static method SHALL inline the rotation composition instead of calling `Rotation2.multiply(a.rotation, b.rotation)` which allocates a temporary `Rotation2`. The rotation SHALL be computed using direct scalar operations:

```
outCos = a.rotation.cos * b.rotation.cos - a.rotation.sin * b.rotation.sin
outSin = a.rotation.sin * b.rotation.cos + a.rotation.cos * b.rotation.sin
```

These results SHALL be written directly to `out.rotation.cos` and `out.rotation.sin`.

Similarly, the position and scale computations SHALL avoid intermediate object allocations.

**Source:** `packages/math2d/src/core/transform2.ts` (static multiply)

#### Scenario: WHEN Transform2.multiply static is called THEN no temporary Rotation2 is allocated

- **GIVEN** `a = Transform2(position=(1, 2), rotation=PI/4, scale=(1, 1))`
- **AND** `b = Transform2(position=(3, 4), rotation=PI/6, scale=(1, 1))`
- **WHEN** `Transform2.multiply(a, b)` is called
- **THEN** the rotation SHALL be computed inline using scalar variables
- **AND** no intermediate `Rotation2` object SHALL be allocated
- **AND** the result rotation SHALL be near-equal to `Rotation2.fromAngle(PI/4 + PI/6)`

#### Scenario: WHEN Transform2.multiply is compared with non-inlined version THEN results are identical

- **GIVEN** `a` and `b` as arbitrary Transform2 values
- **WHEN** `inlined = Transform2.multiply(a, b)` is computed
- **THEN** `inlined.rotation` SHALL be near-equal to `Rotation2.multiply(a.rotation, b.rotation)` within `EPSILON`
- **AND** `inlined.position` and `inlined.scale` SHALL also match the non-inlined computation

#### Scenario: WHEN Transform2.multiply is called with out parameter THEN result is written to out

- **GIVEN** `a`, `b` as Transform2 values and `out = new Transform2()`
- **WHEN** `result = Transform2.multiply(a, b, out)` is called
- **THEN** `result` SHALL be the same reference as `out`
- **AND** no temporary Rotation2, Vector2, or other objects SHALL be allocated beyond the final result

---

### Requirement: R-T2-INV-INLINE — Transform2.inverse/Safe/Unchecked (static) SHALL inline rotation inverse

`Transform2.inverse(transform, out?)`, `Transform2.inverseSafe(transform, out?)`, and `Transform2.inverseUnchecked(transform, out?)` static methods SHALL inline the rotation inverse computation instead of calling `Rotation2.inverse(transform.rotation)` which allocates a temporary `Rotation2`. The rotation inverse SHALL be computed as:

```
invCos = transform.rotation.cos
invSin = -transform.rotation.sin
```

These values SHALL be stored in local scalar variables and used directly for the subsequent position transformation, then written to the output rotation.

**Source:** `packages/math2d/src/core/transform2.ts` (static inverse, inverseSafe, inverseUnchecked)

#### Scenario: WHEN Transform2.inverse static is called THEN no temporary Rotation2 is allocated

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(2, 2))`
- **WHEN** `Transform2.inverse(t)` is called
- **THEN** the inverse rotation SHALL be computed inline as `(cos, -sin)`
- **AND** no intermediate `Rotation2` object SHALL be allocated

#### Scenario: WHEN Transform2.inverse is called THEN the result is mathematically correct

- **GIVEN** `t = Transform2(position=(5, 10), rotation=PI/3, scale=(2, 2))`
- **WHEN** `inv = Transform2.inverse(t)` is computed
- **THEN** `inv.rotation.cos` SHALL equal `t.rotation.cos` (cosine is even)
- **AND** `inv.rotation.sin` SHALL equal `-t.rotation.sin` (sine is negated)

#### Scenario: WHEN Transform2.inverseSafe is called with singular scale THEN fallback is returned without allocation

- **GIVEN** `t = Transform2(position=(1, 1), rotation=0, scale=(0, 1))` (singular x-scale)
- **WHEN** `Transform2.inverseSafe(t)` is called
- **THEN** the function SHALL return the safe fallback without allocating temporary objects

#### Scenario: WHEN inverse round-trips with multiply THEN identity is recovered

- **GIVEN** `t = Transform2(position=(3, 7), rotation=PI/5, scale=(4, 4))` (uniform scale)
- **WHEN** `Transform2.multiply(t, Transform2.inverse(t))` is computed
- **THEN** the result SHALL be near-equal to `Transform2.IDENTITY` within `EPSILON`
- **AND** no temporary Rotation2 allocations SHALL occur in either the inverse or multiply calls

---

### Requirement: R-FROBENIUS — frobeniusNorm SHALL use Math.sqrt, not sqrtSafe

`frobeniusNorm` (for Matrix2 and Matrix3) computes `sqrtSafe(sum)` where `sum` is the sum of squares of all matrix elements. Since a sum of squares is always >= 0 (it can never be negative), the `sqrtSafe` guard (which returns 0 for negative inputs) is unnecessary. The implementation SHALL use `Math.sqrt(sum)` directly.

`Math.sqrt` is IEEE 754 deterministic for non-negative inputs and is faster than `sqrtSafe` which includes an additional comparison branch.

**Source:** `packages/math2d/src/core/matrix2.ts` and `packages/math2d/src/core/matrix3.ts` (frobeniusNorm implementations)

#### Scenario: WHEN frobeniusNorm is called on Matrix2 THEN Math.sqrt is used

- **GIVEN** `m = Matrix2.fromValues(1, 2, 3, 4)`
- **WHEN** `Matrix2.frobeniusNorm(m)` is called
- **THEN** the result SHALL be `Math.sqrt(1 + 4 + 9 + 16) = Math.sqrt(30)`
- **AND** the implementation SHALL use `Math.sqrt`, not `sqrtSafe`

#### Scenario: WHEN frobeniusNorm is called on Matrix3 THEN Math.sqrt is used

- **GIVEN** `m = Matrix3.IDENTITY`
- **WHEN** `Matrix3.frobeniusNorm(m)` is called
- **THEN** the result SHALL be `Math.sqrt(3)` (three 1s on the diagonal, six 0s)
- **AND** the implementation SHALL use `Math.sqrt`, not `sqrtSafe`

#### Scenario: WHEN frobeniusNorm is called on a zero matrix THEN result is zero

- **GIVEN** `m = Matrix2.fromValues(0, 0, 0, 0)`
- **WHEN** `Matrix2.frobeniusNorm(m)` is called
- **THEN** the result SHALL be `0` (`Math.sqrt(0) = 0`)

#### Scenario: WHEN frobeniusNorm is called on any matrix THEN the sum of squares is never negative

- **GIVEN** any `Matrix2` or `Matrix3` with finite elements
- **WHEN** the sum of squares `s = m00*m00 + m01*m01 + ...` is computed
- **THEN** `s >= 0` SHALL always hold (sum of squares of real numbers is non-negative)
- **AND** therefore `Math.sqrt(s)` is always well-defined and `sqrtSafe` is redundant
