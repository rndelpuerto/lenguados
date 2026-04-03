# Class: Matrix2

Defined in: [src/core/matrix2.ts:115](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L115)

Column-major 2×2 matrix suitable for WebGL and physics calculations.

## Remarks

- **Design:** 2×2 column-major matrix stored as `(m00, m01, m10, m11)`. Instance methods
  are mutable and chainable; static methods are pure with alloc-free overloads via `out`.
- **Numerics:** Deterministic for cross-platform reproducibility. Determinant uses
  exact floating-point arithmetic.
- **Safety:** "Safe" variants return identity/zero matrix instead of throwing on
  singular matrices.

## Example

```typescript
// Static (pure, allocation-controlled)
const product = Matrix2.multiply(a, b);
const inv = Matrix2.inverse(m);

// Instance (mutable, chainable)
matrix.multiply(other).transpose();
```

## Since

0.7.0

## Implements

- [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

## Constructors

### Constructor

> **new Matrix2**(`m00OrSource?`, `m01?`, `m10?`, `m11?`): `Matrix2`

Defined in: [src/core/matrix2.ts:2254](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2254)

Creates a new 2x2 matrix.

#### Parameters

##### m00OrSource?

First component, array, or object source

`number` | [`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md) | \[`number`, `number`, `number`, `number`\]

##### m01?

`number`

Column 0, Row 1 (when first arg is a number)

##### m10?

`number`

Column 1, Row 0 (when first arg is a number)

##### m11?

`number`

Column 1, Row 1 (when first arg is a number)

#### Returns

`Matrix2`

#### Remarks

Supports multiple construction forms:

- No arguments: creates identity matrix
- Four numbers: explicit components (m00, m01, m10, m11)
- Array of 4 numbers: [m00, m01, m10, m11]
- Object with m00, m01, m10, m11 properties

#### Throws

If array has less than 4 elements

#### Throws

If arguments are invalid

#### Example

```typescript
new Matrix2(); // Identity: [1,0,0,1]
new Matrix2(1, 2, 3, 4); // Explicit: m00=1, m01=2, m10=3, m11=4
new Matrix2([1, 2, 3, 4]); // From array
new Matrix2({ m00: 1, m01: 2, m10: 3, m11: 4 }); // From object
```

## Accessor

### column0

#### Get Signature

> **get** **column0**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2573](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2573)

Returns the first column as a new vector.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

First column vector

---

### column1

#### Get Signature

> **get** **column1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2584](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2584)

Returns the second column as a new vector.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Second column vector

---

### diagonal

#### Get Signature

> **get** **diagonal**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2617](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2617)

Returns the diagonal elements as a new vector.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Diagonal vector (m00, m11)

---

### inverted

#### Get Signature

> **get** **inverted**(): `Matrix2`

Defined in: [src/core/matrix2.ts:2539](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2539)

Returns a new inverted matrix without modifying this one.
Returns identity if matrix is singular.

##### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const inv = m.inverted;
// m × inv ≈ identity
```

##### Since

0.7.0

##### Returns

`Matrix2`

New inverted matrix

---

### negated

#### Get Signature

> **get** **negated**(): `Matrix2`

Defined in: [src/core/matrix2.ts:2562](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2562)

Returns a new negated matrix without modifying this one.

##### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
const neg = m.negated;
// neg = Matrix2(-1, -2, -3, -4), m unchanged
```

##### Since

0.7.0

##### Returns

`Matrix2`

New negated matrix

---

### row0

#### Get Signature

> **get** **row0**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2595](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2595)

Returns the first row as a new vector.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

First row vector

---

### row1

#### Get Signature

> **get** **row1**(): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2606](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2606)

Returns the second row as a new vector.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Second row vector

---

### transposed

#### Get Signature

> **get** **transposed**(): `Matrix2`

Defined in: [src/core/matrix2.ts:2520](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2520)

Returns a new transposed matrix without modifying this one.

##### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
const t = m.transposed;
// t = Matrix2(1, 3, 2, 4), m unchanged
```

##### Since

0.7.0

##### Returns

`Matrix2`

New transposed matrix

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/matrix2.ts:2634](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2634)

Adds another matrix to this one.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to add

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2712](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2712)

Adds a scalar to all components.

#### Parameters

##### scalar

`number`

Scalar to add

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2778](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2778)

Divides all components by a scalar (strict).

#### Parameters

##### scalar

`number`

Scalar divisor

#### Returns

`this`

This matrix for chaining

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Throws

If scalar is near zero

#### Example

```typescript
new Matrix2(4, 6, 8, 10).divideScalar(2); // Matrix2(2, 3, 4, 5)
new Matrix2(1, 2, 3, 4).divideScalar(0); // throws RangeError
```

#### See

- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback zero matrix for near-zero divisor
- [divideScalarUnchecked](#dividescalarunchecked-2) - No validation

#### Since

0.7.0

---

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2807](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2807)

Safe scalar division. If |scalar| ≤ EPSILON, sets all components to zero.

#### Parameters

##### scalar

`number`

Scalar divisor

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
new Matrix2(4, 6, 8, 10).divideScalarSafe(2); // Matrix2(2, 3, 4, 5)
new Matrix2(1, 2, 3, 4).divideScalarSafe(0); // Matrix2(0, 0, 0, 0)
```

#### See

[divideScalar](#dividescalar-2) - Throws for near-zero divisor

#### Since

0.7.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2834](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2834)

Unchecked scalar division for hot paths.

#### Parameters

##### scalar

`number`

Scalar divisor (must be non-zero)

#### Returns

`this`

This matrix for chaining

#### Remarks

**Precondition:** Scalar must be non-zero.

#### See

- [divideScalar](#dividescalar-2) - Throws on near-zero divisor
- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback on near-zero divisor

#### Since

0.7.0

---

### fma()

> **fma**(`scalar`, `m`): `this`

Defined in: [src/core/matrix2.ts:2747](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2747)

Fused multiply-add: `this = this * scalar + m`.

#### Parameters

##### scalar

`number`

Scalar multiplier

##### m

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to add

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/matrix2.ts:2855](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2855)

Component-wise modulo with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Divisor matrix

#### Returns

`this`

This matrix for chaining

#### Remarks

Uses the positive modulo operation (always returns positive results).

#### Since

0.7.0

---

### modScalar()

> **modScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2872](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2872)

Scalar modulo on all components.

#### Parameters

##### scalar

`number`

Scalar divisor

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/matrix2.ts:2675](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2675)

Multiplies this matrix by another (this × other).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to multiply by

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
const rot = Matrix2.fromRotation(Math.PI / 4);
const scale = Matrix2.fromScale(2);
rot.multiply(scale); // rot is now rotated then scaled
```

#### Since

0.7.0

---

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2695](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2695)

Multiplies all components by a scalar.

#### Parameters

##### scalar

`number`

Scalar multiplier

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/matrix2.ts:3007](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3007)

Negates all elements of this matrix in place.

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
m.negate();
// m = Matrix2(-1, -2, -3, -4)
```

#### Since

0.7.0

---

### premultiply()

> **premultiply**(`other`): `this`

Defined in: [src/core/matrix2.ts:3184](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3184)

Pre-multiplies this matrix by another (other × this).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to multiply by

#### Returns

`this`

This matrix for chaining

#### Remarks

Unlike `multiply`, this applies the other transformation first.
Useful when building transformation chains in specific order.

#### Example

```typescript
const scale = Matrix2.fromScale(2);
const rot = Matrix2.fromRotation(Math.PI / 4);
scale.premultiply(rot); // scale is now rot × scale
```

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/matrix2.ts:2651](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2651)

Subtracts another matrix from this one.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to subtract

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/matrix2.ts:2729](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2729)

Subtracts a scalar from all components.

#### Parameters

##### scalar

`number`

Scalar to subtract

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:616](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L616)

Component-wise addition of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First addend

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second addend

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with components `(a.mXX + b.mXX)`

#### Since

0.7.0

---

### addScalar()

> `static` **addScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:717](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L717)

Adds a scalar to all matrix components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### scalar

`number`

Scalar to add

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with scalar added to all components

#### Since

0.7.0

---

### divideScalar()

> `static` **divideScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:800](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L800)

Divides all matrix components by a scalar (strict).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### scalar

`number`

Scalar divisor

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with all components divided by scalar

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Throws

If scalar is near zero

#### Example

```typescript
Matrix2.divideScalar(new Matrix2(4, 6, 8, 10), 2); // Matrix2(2, 3, 4, 5)
Matrix2.divideScalar(new Matrix2(1, 2, 3, 4), 0); // throws RangeError
```

#### See

- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback zero matrix for near-zero divisor
- [divideScalarUnchecked](#dividescalarunchecked-2) - No validation

#### Since

0.7.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:832](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L832)

Divides all matrix components by a scalar (safe).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### scalar

`number`

Scalar divisor

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with components divided by scalar, or zero matrix if scalar is near zero

#### Example

```typescript
Matrix2.divideScalarSafe(new Matrix2(4, 6, 8, 10), 2); // Matrix2(2, 3, 4, 5)
Matrix2.divideScalarSafe(new Matrix2(1, 2, 3, 4), 0); // Matrix2(0, 0, 0, 0)
```

#### See

[divideScalar](#dividescalar-2) - Throws for near-zero divisor

#### Since

0.7.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:866](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L866)

Divides all matrix components by a scalar (unchecked for hot paths).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### scalar

`number`

Scalar divisor (must be non-zero)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with components divided by scalar

#### Remarks

**Precondition:** Scalar must be non-zero.

#### See

- [divideScalar](#dividescalar-2) - Throws on near-zero divisor
- [divideScalarSafe](#dividescalarsafe-2) - Returns fallback on near-zero divisor

#### Since

0.7.0

---

### fma()

> `static` **fma**(`a`, `scalar`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:761](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L761)

Fused multiply-add: `a * scalar + b`.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### scalar

`number`

Scalar multiplier

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to add

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix equal to `a * scalar + b`

#### Remarks

More efficient than separate multiplyScalar and add operations.

#### Since

0.7.0

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:894](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L894)

Computes element-wise modulo of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Dividend matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Divisor matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Result matrix with element-wise modulo

#### Remarks

Uses the positive modulo operation (always returns positive results).

#### Since

0.7.0

---

### modScalar()

> `static` **modScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:914](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L914)

Computes scalar modulo on all matrix components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Dividend matrix

##### scalar

`number`

Scalar divisor

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Result matrix with each element modulo scalar

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:653](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L653)

Multiplies two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Product matrix a × b

#### Example

```typescript
const rot = Matrix2.fromRotation(Math.PI / 2); // 90° rotation
const scl = Matrix2.fromScale(2); // uniform scale
const combined = Matrix2.multiply(rot, scl); // scale then rotate
```

#### Since

0.7.0

---

### multiplyScalar()

> `static` **multiplyScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:697](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L697)

Multiplies all matrix components by a scalar.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### scalar

`number`

Scalar multiplier

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with all components multiplied by scalar

#### Since

0.7.0

---

### negate()

> `static` **negate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1181](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1181)

Negates all elements of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to negate

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Negated matrix

#### Example

```typescript
const m = new Matrix2(1, 2, 3, 4);
const neg = Matrix2.negate(m);
// neg = Matrix2(-1, -2, -3, -4)
```

#### Since

0.7.0

---

### premultiply()

> `static` **premultiply**(`left`, `right`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:678](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L678)

Multiplies two matrices in reverse order: `left * right`.

#### Parameters

##### left

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Left matrix (applied second)

##### right

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Right matrix (applied first)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

`left * right`

#### Remarks

Semantically identical to [multiply](#multiply-2)(left, right). The value
of `premultiply` is in the instance method where it reverses the
multiplication order: `this.premultiply(other)` computes `other * this`.

#### Since

0.7.0

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:631](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L631)

Component-wise subtraction of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Minuend

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Subtrahend

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with components `(a.mXX - b.mXX)`

#### Since

0.7.0

---

### subtractScalar()

> `static` **subtractScalar**(`matrix`, `scalar`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:737](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L737)

Subtracts a scalar from all matrix components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### scalar

`number`

Scalar to subtract

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with scalar subtracted from all components

#### Since

0.7.0

## Column/Row

### getColumn()

> **getColumn**(`index`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:3338](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3338)

Gets a column of the matrix as a vector.

#### Parameters

##### index

`number`

Column index (0 or 1)

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Column vector

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const col0 = m.getColumn(0); // First column
const col1 = m.getColumn(1); // Second column
```

#### Since

0.7.0

---

### getRow()

> **getRow**(`index`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:3399](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3399)

Gets a row of the matrix as a vector.

#### Parameters

##### index

`number`

Row index (0 or 1)

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Row vector

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const row0 = m.getRow(0); // First row
const row1 = m.getRow(1); // Second row
```

#### Since

0.7.0

---

### setColumn()

> **setColumn**(`index`, `column`): `this`

Defined in: [src/core/matrix2.ts:3366](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3366)

Sets a column of the matrix from a vector.

#### Parameters

##### index

`number`

Column index (0 or 1)

##### column

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to set as column

#### Returns

`this`

This matrix for chaining

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = new Matrix2();
m.setColumn(0, new Vector2(2, 0)); // Set first column
```

#### Since

0.7.0

---

### setRow()

> **setRow**(`index`, `row`): `this`

Defined in: [src/core/matrix2.ts:3427](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3427)

Sets a row of the matrix from a vector.

#### Parameters

##### index

`number`

Row index (0 or 1)

##### row

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to set as row

#### Returns

`this`

This matrix for chaining

#### Throws

If index is not 0 or 1

#### Example

```typescript
const m = new Matrix2();
m.setRow(0, new Vector2(2, 0)); // Set first row
```

#### Since

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/matrix2.ts:3459](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3459)

Exact equality with other matrix (bit-identical).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to compare

#### Returns

`boolean`

True if all components are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/matrix2.ts:3538](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3538)

Tests if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any component is ±Infinity

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/matrix2.ts:3528](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3528)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isDiagonal()

> **isDiagonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:3577](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3577)

Tests if this matrix is diagonal.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is diagonal

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/matrix2.ts:3518](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3518)

Tests if all components are finite numbers.

#### Returns

`boolean`

True if all components are finite

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:3487](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3487)

Tests if this is the identity matrix.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is identity

#### Since

0.7.0

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2449](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2449)

Tests if this matrix is invertible.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance for determinant.

#### Returns

`boolean`

True if determinant is non-zero

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:3508](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3508)

Tests if this matrix is approximately zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if all components are within epsilon of zero

#### Since

0.7.0

---

### isOrthogonal()

> **isOrthogonal**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:2462](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2462)

Tests if this matrix is orthogonal.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if M \* M^T = I

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSkewSymmetric()

> **isSkewSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:3566](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3566)

Tests if this matrix is skew-symmetric.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is skew-symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Since

0.7.0

---

### isSymmetric()

> **isSymmetric**(`epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:3552](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3552)

Tests if this matrix is symmetric (m01 ≈ m10).

#### Parameters

##### epsilon

`number` = `EPSILON`

Relative tolerance (default: EPSILON)

#### Returns

`boolean`

True if matrix is symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Since

0.7.0

---

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/matrix2.ts:3497](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3497)

Tests if this matrix is exactly zero.

#### Returns

`boolean`

True if all components are zero

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:3476](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3476)

Approximate equality with other matrix using relative tolerance.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to compare

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if all component differences are within scaled epsilon

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/matrix2.ts:1510](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1510)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix

#### Returns

`boolean`

True if all components are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1645](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1645)

Tests if any component is infinite (±Infinity).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

#### Returns

`boolean`

True if any component is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1624](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1624)

Tests if any component is NaN.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isDiagonal()

> `static` **isDiagonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1698](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1698)

Tests if a matrix is diagonal (off-diagonal elements ≈ 0).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is diagonal

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isFinite()

> `static` **isFinite**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1606](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1606)

Tests if all components are finite numbers.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

#### Returns

`boolean`

True if all components are finite

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1556](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1556)

Tests if a matrix is the identity matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is identity

#### Remarks

Uses [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) as default tolerance. Diagonal elements are
compared to 1 via absolute tolerance; off-diagonal elements are compared to 0.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isInvertible()

> `static` **isInvertible**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1716](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1716)

Tests if a matrix is invertible (determinant ≠ 0).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is invertible (non-singular)

#### Remarks

A matrix is invertible when its determinant is non-zero.
This follows the Eigen C++ convention.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isNearZero()

> `static` **isNearZero**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1588](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1588)

Tests if a matrix is approximately zero.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if all components are within epsilon of zero

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isOrthogonal()

> `static` **isOrthogonal**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1734](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1734)

Tests if a matrix is orthogonal (M \* M^T = I).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is orthogonal

#### Remarks

An orthogonal matrix has columns that are orthonormal (unit length and perpendicular).
Orthogonal matrices represent pure rotations/reflections and preserve distances/angles.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSkewSymmetric()

> `static` **isSkewSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1680](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1680)

Tests if a matrix is skew-symmetric (m00 ≈ 0, m11 ≈ 0, m01 ≈ -m10).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if matrix is skew-symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSymmetric()

> `static` **isSymmetric**(`matrix`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1663](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1663)

Tests if a matrix is symmetric (m01 ≈ m10).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if matrix is symmetric

#### Remarks

Uses relative tolerance for comparing off-diagonal elements.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isZero()

> `static` **isZero**(`matrix`): `boolean`

Defined in: [src/core/matrix2.ts:1574](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1574)

Tests if a matrix is exactly zero.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to test

#### Returns

`boolean`

True if all components are zero

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/matrix2.ts:1529](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1529)

Approximate component-wise equality using relative tolerance.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if all component differences are within scaled epsilon

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
This scales with value magnitude, making it robust for both small and large values.

#### Default Value

`EPSILON`

#### Since

0.7.0

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/matrix2.ts:2407](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2407)

Calculates the determinant of the matrix.

#### Returns

`number`

Determinant value

#### Remarks

A determinant of 0 indicates the matrix is singular (non-invertible).
The absolute value represents the area scaling factor.

#### Since

0.7.0

---

### frobeniusNorm()

> **frobeniusNorm**(): `number`

Defined in: [src/core/matrix2.ts:2434](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2434)

Calculates the Frobenius norm.

#### Returns

`number`

Square root of sum of squared elements

#### Remarks

Uses Math.sqrt which is deterministic per IEEE 754 (correctly rounded to 0.5 ULP).

#### Since

0.7.0

---

### getRotation()

> **getRotation**(): `number`

Defined in: [src/core/matrix2.ts:2477](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2477)

Extracts rotation angle from the matrix.

#### Returns

`number`

Rotation angle in radians

#### Remarks

Assumes the matrix represents a pure rotation or rotation with uniform scale.

#### Since

0.7.0

---

### getScale()

> **getScale**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2496](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2496)

Extracts scale factors from the matrix (always positive).

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Scale factors for each axis (always ≥ 0)

#### Remarks

Returns the length of each column vector. Values are always non-negative
since `hypot` computes magnitudes. This does NOT account for determinant
sign (reflection). Use [Matrix2.decompose](#decompose-2) for signed scale that
matches the rotation convention.

#### Since

0.7.0

---

### trace()

> **trace**(): `number`

Defined in: [src/core/matrix2.ts:2419](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2419)

Calculates the trace of the matrix.

#### Returns

`number`

Sum of diagonal elements

#### Since

0.7.0

---

### determinant()

> `static` **determinant**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1760](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1760)

Calculates the determinant of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate determinant of

#### Returns

`number`

Determinant value

#### Since

0.7.0

---

### eigendecompose()

> `static` **eigendecompose**(`matrix`): [`EigendecomposeResult`](../../types/type-aliases/EigendecomposeResult.md)

Defined in: [src/core/matrix2.ts:1991](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1991)

Compute the eigendecomposition of a 2x2 matrix (eigenvalues + eigenvectors)

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix

#### Returns

[`EigendecomposeResult`](../../types/type-aliases/EigendecomposeResult.md)

Discriminated union of real eigendecomposition or complex eigenvalues

#### Remarks

For real eigenvalues, returns normalized eigenvectors computed from the
null space of `(A - lambda * I)`:

- If `b != 0`: eigenvector is `[b, lambda - a]` (normalized)
- If `c != 0`: eigenvector is `[lambda - d, c]` (normalized)
- If both `b` and `c` are 0: diagonal matrix with eigenvectors `[1,0]`, `[0,1]`

For complex eigenvalues, no real eigenvectors exist; only the eigenvalues
are returned.

Uses `Math.sqrt` which is deterministic per IEEE 754.

#### Example

```typescript
const m = new Matrix2(2, 1, 1, 2);
const result = Matrix2.eigendecompose(m);
if (result.type === 'real') {
 console.log(result.lambda1, result.v1); // 3, normalized eigenvector
}
```

#### Since

0.8.0

---

### eigenvalues()

> `static` **eigenvalues**(`matrix`): [`EigenvalueResult`](../../types/type-aliases/EigenvalueResult.md)

Defined in: [src/core/matrix2.ts:1934](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1934)

Compute the eigenvalues of a 2x2 matrix via the closed-form characteristic polynomial

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix

#### Returns

[`EigenvalueResult`](../../types/type-aliases/EigenvalueResult.md)

Discriminated union of real or complex eigenvalue results

#### Remarks

For `[[a, b], [c, d]]` the characteristic polynomial is
`lambda^2 - (a+d)*lambda + (ad - bc) = 0`.

- discriminant >= 0: two real eigenvalues `(trace +/- sqrt(discriminant)) / 2`
- discriminant < 0: complex conjugate pair with `realPart = trace / 2`,
  `imaginaryPart = sqrt(-discriminant) / 2`

Uses `Math.sqrt` which is deterministic per IEEE 754.

#### Example

```typescript
const m = new Matrix2(3, 0, 0, 5);
const result = Matrix2.eigenvalues(m);
if (result.type === 'real') {
 console.log(result.lambda1, result.lambda2); // 5, 3
}
```

#### Since

0.8.0

---

### frobeniusNorm()

> `static` **frobeniusNorm**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1789](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1789)

Calculates the Frobenius norm of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate norm of

#### Returns

`number`

Square root of sum of squared elements

#### Remarks

Uses Math.sqrt which is deterministic per IEEE 754 (correctly rounded to 0.5 ULP).

#### Since

0.7.0

---

### getRotation()

> `static` **getRotation**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1817](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1817)

Extracts rotation angle from a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix

#### Returns

`number`

Rotation angle in radians

#### Remarks

Computes the angle from the first column vector. For matrices with
non-uniform scale, the result reflects the rotation of the X axis.

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
Matrix2.getRotation(m); // ≈ PI/4
```

#### Since

0.8.0

---

### getScale()

> `static` **getScale**(`matrix`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1842](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1842)

Extracts scale factors from a matrix (always positive).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Scale factors for each axis (always ≥ 0)

#### Remarks

Returns the length of each column vector. Values are always non-negative
since `hypot` computes magnitudes. This does NOT account for determinant
sign (reflection). Use [Matrix2.decompose](#decompose-2) for signed scale.

#### Example

```typescript
const m = Matrix2.fromScale(new Vector2(2, 3));
Matrix2.getScale(m); // Vector2(2, 3)
```

#### Since

0.8.0

---

### trace()

> `static` **trace**(`matrix`): `number`

Defined in: [src/core/matrix2.ts:1773](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1773)

Calculates the trace (sum of diagonal elements) of a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate trace of

#### Returns

`number`

Sum of diagonal elements (m00 + m11)

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `4` = `4`

Defined in: [src/core/matrix2.ts:140](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L140)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### FLIP_X

> `readonly` `static` **FLIP_X**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:175](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L175)

Flip horizontally (mirror across Y axis).

#### Since

0.7.0

---

### FLIP_XY

> `readonly` `static` **FLIP_XY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:189](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L189)

Flip both axes (same as ROTATE_180).

#### Since

0.7.0

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:182](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L182)

Flip vertically (mirror across X axis).

#### Since

0.7.0

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:133](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L133)

Identity matrix (no transformation).

#### Since

0.7.0

---

### ROTATE_180

> `readonly` `static` **ROTATE_180**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:161](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L161)

180° rotation (same as FLIP_XY).

#### Since

0.7.0

---

### ROTATE_270

> `readonly` `static` **ROTATE_270**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:168](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L168)

270° counter-clockwise rotation (same as 90° clockwise).

#### Since

0.7.0

---

### ROTATE_90

> `readonly` `static` **ROTATE_90**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:154](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L154)

90° counter-clockwise rotation.

#### Since

0.7.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Matrix2`\>

Defined in: [src/core/matrix2.ts:147](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L147)

Zero matrix.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/matrix2.ts:3797](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3797)

Iterator for array destructuring (column-major order).

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding m00, m01, m10, m11

#### Example

```typescript
const [m00, m01, m10, m11] = Matrix2.IDENTITY;
```

#### Since

0.7.0

---

### clone()

> **clone**(): `Matrix2`

Defined in: [src/core/matrix2.ts:3781](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3781)

Creates a clone of this matrix.

#### Returns

`Matrix2`

New matrix with same components

#### Since

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`, `columnMajor?`): \[`number`, `number`, `number`, `number`\] \| `T`

Defined in: [src/core/matrix2.ts:3662](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3662)

Writes the matrix to an array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

Array type (number[], Float32Array, Float64Array, etc.)

#### Parameters

##### out?

`T`

Optional output array. If not provided, returns a new tuple

##### offset?

`number` = `0`

Write offset.

##### columnMajor?

`boolean` = `true`

Use column-major order.

#### Returns

\[`number`, `number`, `number`, `number`\] \| `T`

The output array, or a new tuple if no output was provided

#### Remarks

Follows the same pattern as [Vector2.toArray](Vector2.md#toarray) for API consistency.
Accepts any array-like type that supports indexed assignment.

#### Default Value

`0`

#### Default Value

`true`

#### Since

0.7.0

---

### toJSON()

> **toJSON**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:3705](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3705)

Alias for toObject (JSON serialization).

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with matrix components

#### Since

0.7.0

---

### toMatrix3Like()

> **toMatrix3Like**(`out?`): [`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Defined in: [src/core/matrix2.ts:3739](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3739)

Converts this matrix to a Matrix3Like (embeds in homogeneous coordinates).

#### Parameters

##### out?

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Optional output object to populate

#### Returns

[`Matrix3Like`](../../types/interfaces/Matrix3Like.md)

Matrix3Like representation (plain object or provided out)

#### Remarks

Returns a `Matrix3Like` object, not a `Matrix3` instance, to avoid
circular dependencies. If you need a full `Matrix3` instance, use:

```typescript
const mat3 = Matrix3.fromMatrix2(this);
```

The 2×2 matrix is embedded in the upper-left corner:

```
[ m00  m10  0 ]
[ m01  m11  0 ]
[  0    0   1 ]
```

#### Example

```typescript
const m2 = Matrix2.fromRotation(Math.PI / 4);
const m3Like = m2.toMatrix3Like();
// m3Like represents the same rotation in homogeneous coordinates
```

#### Since

0.9.0

---

### toObject()

> **toObject**(): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/matrix2.ts:3695](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3695)

Converts to a plain object.

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Object with m00, m01, m10, m11 properties

#### Since

0.7.0

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/matrix2.ts:3770](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3770)

Converts to string representation.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

String representation

#### Since

0.7.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:248](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L248)

Creates a deep copy of a matrix.

#### Parameters

##### source

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to clone

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

A Matrix2 with identical components

#### Example

```typescript
const original = Matrix2.fromValues(1, 2, 3, 4);
const cloned = Matrix2.clone(original);

// Reuse an existing matrix
const out = new Matrix2();
Matrix2.clone(original, out);
```

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Matrix2`

Defined in: [src/core/matrix2.ts:269](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L269)

Copies component values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix

##### destination

`Matrix2`

Target matrix to receive the copy

#### Returns

`Matrix2`

The destination matrix

#### Example

```typescript
const source = Matrix2.fromValues(1, 2, 3, 4);
const destination = new Matrix2();
Matrix2.copy(source, destination); // destination now holds (1, 2, 3, 4)
```

#### Since

0.7.0

---

### fromAngleScale()

> `static` **fromAngleScale**(`angle`, `scaleX`, `scaleY`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:380](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L380)

Creates a combined rotation + scale matrix in a single pass.

#### Parameters

##### angle

`number`

Rotation angle in radians

##### scaleX

`number`

Horizontal scale factor

##### scaleY

`number`

Vertical scale factor

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Combined rotation and scale matrix

#### Remarks

Equivalent to `Matrix2.multiply(Matrix2.fromRotation(angle), Matrix2.fromScale({x: scaleX, y: scaleY}))`
but avoids intermediate allocation and is more precise.
Result: `[cos*sx, -sin*sy; sin*sx, cos*sy]`

#### Example

```typescript
const mat = Matrix2.fromAngleScale(Math.PI / 4, 2, 3);
```

#### Since

0.8.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `columnMajor`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:498](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L498)

Creates a matrix from an array.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Array with matrix elements

##### offset

`number` = `0`

Starting index.

##### columnMajor

`boolean` = `true`

If true, array is column-major.

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with components from the array

#### Default Value

`0`

#### Default Value

`true`

#### Throws

If offset is out of bounds

#### Example

```typescript
// Column-major array (default)
const m = Matrix2.fromArray([1, 0, 0, 1]); // identity matrix

// Row-major array with offset
const out = new Matrix2();
Matrix2.fromArray([0, 0, 2, 0, 0, 3], 2, false, out);
```

#### Since

0.7.0

---

### fromColumns()

> `static` **fromColumns**(`col0`, `col1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:437](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L437)

Creates a matrix from column vectors.

#### Parameters

##### col0

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First column

##### col1

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second column

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with specified columns

#### Example

```typescript
const col0 = { x: 1, y: 0 };
const col1 = { x: 0, y: 1 };
const m = Matrix2.fromColumns(col0, col1); // identity matrix

// Reuse an existing matrix
const out = new Matrix2();
Matrix2.fromColumns(col0, col1, out);
```

#### Since

0.7.0

---

### fromDiagonal()

> `static` **fromDiagonal**(`diagonal`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:567](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L567)

Creates a diagonal matrix from a vector.

#### Parameters

##### diagonal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Diagonal elements as a vector

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Diagonal matrix

#### Remarks

Produces the matrix `[diagonal.x, 0; 0, diagonal.y]`.
This is equivalent to [fromScale](#fromscale) with a vector argument but
provides a more explicit name for linear-algebra contexts.

#### Example

```typescript
const m = Matrix2.fromDiagonal({ x: 2, y: 3 });
// → [2, 0; 0, 3]
```

#### Since

0.9.0

---

### fromMatrix2()

> `static` **fromMatrix2**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:542](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L542)

Creates a matrix from another matrix-like object.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with copied components

#### Example

```typescript
const source: Matrix2Like = { m00: 1, m01: 2, m10: 3, m11: 4 };
const m = Matrix2.fromMatrix2(source);

// Reuse an existing matrix
const out = new Matrix2();
Matrix2.fromMatrix2(source, out);
```

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:293](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L293)

Creates a matrix from a plain object `{ m00, m01, m10, m11 }`.

#### Parameters

##### object

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Plain object with matrix components

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

A Matrix2 with the object's components

#### Throws

If any component is not finite

#### Example

```typescript
const m = Matrix2.fromObject({ m00: 1, m01: 0, m10: 0, m11: 1 }); // identity matrix

// Reuse an existing matrix
const out = new Matrix2();
Matrix2.fromObject({ m00: 2, m01: 0, m10: 0, m11: 3 }, out);
```

#### Since

0.7.0

---

### fromReflection()

> `static` **fromReflection**(`unitNormal`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:595](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L595)

Creates a reflection (Householder) matrix about a line through the origin.

#### Parameters

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit normal of the reflection line (must be normalized)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Reflection matrix

#### Remarks

Uses the Householder formula `I - 2nnᵀ` where `n` is the unit normal of
the reflection line. The caller must ensure `unitNormal` is normalized;
no internal normalization is performed.

#### Example

```typescript
// Reflect about Y-axis (normal = (1, 0)) — negates x-coordinates
const reflectY = Matrix2.fromReflection({ x: 1, y: 0 });

// Reflect about X-axis (normal = (0, 1)) — negates y-coordinates
const reflectX = Matrix2.fromReflection({ x: 0, y: 1 });
```

#### Since

0.9.0

---

### fromRotation()

> `static` **fromRotation**(`rotation`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:325](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L325)

Creates a matrix from a rotation.

#### Parameters

##### rotation

Rotation object (with cos/sin properties) or angle in radians

`number` | [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Rotation matrix

#### Remarks

Accepts any object with `cos` and `sin` properties, including:

- Rotation2 instances
- Plain objects `{ cos, sin }`
- Results from `sinCos(angle)`

#### Example

```typescript
// From angle
const mat1 = Matrix2.fromRotation(Math.PI / 3);

// From Rotation2Like
const mat2 = Matrix2.fromRotation({ cos: 0.5, sin: 0.866 });

// From sinCos result
const mat3 = Matrix2.fromRotation(sinCos(Math.PI / 4));
```

#### Since

0.7.0

---

### fromRows()

> `static` **fromRows**(`row0`, `row1`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:467](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L467)

Creates a matrix from row vectors.

#### Parameters

##### row0

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First row

##### row1

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second row

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with specified rows

#### Example

```typescript
const row0 = { x: 1, y: 0 };
const row1 = { x: 0, y: 1 };
const m = Matrix2.fromRows(row0, row1); // identity matrix

// Reuse an existing matrix
const out = new Matrix2();
Matrix2.fromRows(row0, row1, out);
```

#### Since

0.7.0

---

### fromScale()

> `static` **fromScale**(`scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:350](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L350)

Creates a scaling matrix.

#### Parameters

##### scale

Scale factors as Vector2 or uniform scale

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Scale matrix

#### Example

```typescript
const mat1 = Matrix2.fromScale(new Vector2(2, 3));
const mat2 = Matrix2.fromScale(2); // Uniform scale
```

#### Since

0.7.0

---

### fromShear()

> `static` **fromShear**(`shear`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:411](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L411)

Creates a shearing matrix.

#### Parameters

##### shear

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Shear factors as Vector2 (x=horizontal, y=vertical)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Shear matrix

#### Example

```typescript
const mat = Matrix2.fromShear(new Vector2(0.5, 0));
```

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`m00`, `m01`, `m10`, `m11`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:218](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L218)

Creates a matrix from explicit components.

#### Parameters

##### m00

`number`

Component at row 0, column 0

##### m01

`number`

Component at row 1, column 0

##### m10

`number`

Component at row 0, column 1

##### m11

`number`

Component at row 1, column 1

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

A Matrix2 with the specified components

#### Example

```typescript
// Column-major: (m00, m01, m10, m11)
const m = Matrix2.fromValues(1, 0, 0, 1); // identity matrix

// Reuse an existing matrix to avoid allocation
const out = new Matrix2();
Matrix2.fromValues(2, 0, 0, 3, out);
```

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:3600](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3600)

Linear interpolation with another matrix in place (unclamped).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Target matrix

##### t

`number`

Interpolation factor (unclamped, allows extrapolation)

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
const a = Matrix2.IDENTITY.clone();
const b = Matrix2.fromRotation(Math.PI / 2);
a.lerp(b, 0.5); // a is now halfway between identity and b
```

#### Since

0.7.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:3618](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3618)

Clamped linear interpolation (alias for lerp).

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Target matrix

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/matrix2.ts:3632](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3632)

Smooth step interpolation with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Target matrix

##### t

`number`

Interpolation factor [0, 1]

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1424](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1424)

Linear interpolation between two matrices (unclamped).

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Start matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

End matrix

##### t

`number`

Interpolation factor (unclamped, allows extrapolation)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Interpolated matrix

#### Remarks

The interpolation factor `t` is NOT clamped — values outside [0, 1] will
extrapolate beyond the input matrices. Use [lerpClamped](#lerpclamped-2) to clamp.
Component-wise lerp between rotation matrices does not produce a valid
rotation matrix. Use Rotation2.lerp for interpolating rotations.

#### Example

```typescript
const a = Matrix2.IDENTITY;
const b = Matrix2.fromRotation(Math.PI / 2);
const mid = Matrix2.lerp(a, b, 0.5);
```

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1453](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1453)

Clamped linear interpolation.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Start matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

End matrix

##### t

`number`

Interpolation factor (clamped to [0, 1] before interpolation)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Interpolated matrix

#### Remarks

Clamps `t` to [0, 1] before delegating to [lerp](../../auxiliary/scalar/functions/lerp.md).

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1477](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1477)

Smooth step interpolation between two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Start matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

End matrix

##### t

`number`

Interpolation factor [0, 1]

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Smoothly interpolated matrix

#### Remarks

Uses the smoothstep formula: 3t² - 2t³

#### Since

0.7.0

## Matrix Operations

### adjugate()

> **adjugate**(): `this`

Defined in: [src/core/matrix2.ts:2986](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2986)

Calculates the adjugate (adjoint) matrix in place.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### compose()

> **compose**(`rotation`, `scale`): `this`

Defined in: [src/core/matrix2.ts:3204](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3204)

Sets this matrix to a rotation-scale composition in place.

#### Parameters

##### rotation

`number`

Rotation angle in radians

##### scale

Uniform scale factor or per-axis scale

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### decompose()

> **decompose**(): `object`

Defined in: [src/core/matrix2.ts:3227](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3227)

Decomposes this matrix into rotation and scale components.

#### Returns

`object`

Object with rotation (radians) and scale (Vector2)

##### rotation

> **rotation**: `number`

##### scale

> **scale**: [`Vector2`](Vector2.md)

#### Since

0.7.0

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/matrix2.ts:2914](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2914)

Inverts the matrix in place.

#### Returns

`this`

This matrix for chaining

#### Throws

If matrix is singular (determinant ≈ 0)

#### Example

```typescript
new Matrix2(1, 0, 0, 1).inverse(); // Matrix2(1, 0, 0, 1) (identity)
new Matrix2(1, 1, 1, 1).inverse(); // throws RangeError (singular)
```

#### See

- [inverseSafe](#inversesafe-2) - Returns fallback identity for singular matrices
- [inverseUnchecked](#inverseunchecked-2) - No validation

#### Since

0.7.0

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/matrix2.ts:2943](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2943)

Safe inversion in place. Sets to identity if singular.

#### Returns

`this`

This matrix for chaining

#### Example

```typescript
new Matrix2(1, 0, 0, 1).inverseSafe(); // Matrix2(1, 0, 0, 1) (identity)
new Matrix2(1, 1, 1, 1).inverseSafe(); // Matrix2(1, 0, 0, 1) (fallback)
```

#### See

[inverse](#inverse-2) - Throws for singular matrices

#### Since

0.7.0

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/matrix2.ts:2971](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2971)

Unchecked inversion for hot paths.

**Precondition:** Matrix must be invertible (det ≠ 0).
Calling with a singular matrix produces NaN/Infinity components.

#### Returns

`this`

This matrix for chaining

#### See

- [inverse](#inverse-2) - Throws on singular matrices
- [inverseSafe](#inversesafe-2) - Returns fallback on singular matrices

#### Since

0.7.0

---

### transpose()

> **transpose**(): `this`

Defined in: [src/core/matrix2.ts:2890](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2890)

Transposes the matrix in place.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### adjugate()

> `static` **adjugate**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1051](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1051)

Calculates the adjugate (adjoint) matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to calculate adjugate of

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Adjugate matrix

#### Remarks

The adjugate is the transpose of the cofactor matrix.
For a 2x2 matrix [a b; c d], the adjugate is [d -b; -c a].

#### Since

0.7.0

---

### compose()

> `static` **compose**(`rotation`, `scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1862](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1862)

Composes a matrix from rotation angle and scale.

#### Parameters

##### rotation

`number`

Rotation angle in radians

##### scale

Scale factors (Vector2 or uniform number)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix2`

Optional output object

#### Returns

`Matrix2`

Composed transformation matrix

#### Example

```typescript
const m = Matrix2.compose(Math.PI / 4, new Vector2(2, 1));
```

#### Since

0.7.0

---

### decompose()

> `static` **decompose**(`matrix`): `object`

Defined in: [src/core/matrix2.ts:1890](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1890)

Decomposes a matrix into rotation and scale components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to decompose

#### Returns

`object`

Object with rotation (radians) and scale (Vector2)

##### rotation

> **rotation**: `number`

##### scale

> **scale**: [`Vector2`](Vector2.md)

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4).scaleBy(new Vector2(2, 1));
const { rotation, scale } = Matrix2.decompose(m);
```

#### Since

0.7.0

---

### inverse()

> `static` **inverse**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:959](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L959)

Inverts a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to invert

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Inverted matrix

#### Throws

If matrix is singular (determinant ≈ 0)

#### Example

```typescript
Matrix2.inverse(new Matrix2(1, 0, 0, 1)); // Matrix2(1, 0, 0, 1) (identity)
Matrix2.inverse(new Matrix2(1, 1, 1, 1)); // throws RangeError (singular)
```

#### See

- [inverseSafe](#inversesafe-2) - Returns fallback identity for singular matrices
- [inverseUnchecked](#inverseunchecked-2) - No validation

#### Since

0.7.0

---

### inverseSafe()

> `static` **inverseSafe**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:996](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L996)

Safe inversion. Returns identity if matrix is singular.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to invert

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Inverted matrix, or identity if singular

#### Remarks

Uses [isNearZero](../../auxiliary/scalar/functions/isNearZero.md) with default [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) to test the
determinant. Returns identity when |det| ≤ EPSILON.

#### Example

```typescript
const singular = new Matrix2(1, 1, 1, 1); // det = 0
const inv = Matrix2.inverseSafe(singular); // Returns IDENTITY
```

#### See

[inverse](#inverse-2) - Throws for singular matrices

#### Since

0.7.0

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1027](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1027)

Unchecked inversion for hot paths.

**Precondition:** Matrix must be invertible (det ≠ 0).
Calling with a singular matrix produces NaN/Infinity components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to invert (must be non-singular)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Inverted matrix

#### See

- [inverse](#inverse-2) - Throws on singular matrices
- [inverseSafe](#inversesafe-2) - Returns fallback on singular matrices

#### Since

0.7.0

---

### solveLinearSystem()

> `static` **solveLinearSystem**(`matrix`, `b`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1082](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1082)

Solves the 2×2 linear system `Ax = b` using Cramer's rule.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Coefficient matrix A

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Right-hand side vector

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Solution vector x

#### Remarks

Matches the Box2D `b2Solve22` pattern. Computes
`x = (1/det(A)) * [A₁₁·bx − A₁₀·by, A₀₀·by − A₀₁·bx]`.

#### Throws

If matrix is singular (determinant near zero)

#### Example

```typescript
// Solve [2 1; 1 3] * x = [5, 7]
const A = new Matrix2(2, 1, 1, 3);
const b = new Vector2(5, 7);
const x = Matrix2.solveLinearSystem(A, b); // → (1.6, 1.8)
```

#### See

- [solveLinearSystemSafe](#solvelinearsystemsafe) - Returns (0,0) instead of throwing
- [solveLinearSystemUnchecked](#solvelinearsystemunchecked) - No validation, for hot paths

#### Since

0.9.0

---

### solveLinearSystemSafe()

> `static` **solveLinearSystemSafe**(`matrix`, `b`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1116](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1116)

Safe linear system solve. Returns (0,0) if matrix is singular.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Coefficient matrix A

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Right-hand side vector

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Solution vector, or (0,0) if singular

#### Remarks

Uses [isNearZero](../../auxiliary/scalar/functions/isNearZero.md) with default [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) to test the
determinant. Returns the zero vector when |det| ≤ EPSILON.

#### See

[solveLinearSystem](#solvelinearsystem) - Throws for singular matrices

#### Since

0.9.0

---

### solveLinearSystemUnchecked()

> `static` **solveLinearSystemUnchecked**(`matrix`, `b`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:1151](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1151)

Unchecked linear system solve for hot paths.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Coefficient matrix A (must be non-singular)

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Right-hand side vector

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Solution vector

#### Remarks

**Precondition:** Matrix must be non-singular (det ≠ 0).
Calling with a singular matrix produces NaN/Infinity components.

#### See

- [solveLinearSystem](#solvelinearsystem) - Throws on singular matrices
- [solveLinearSystemSafe](#solvelinearsystemsafe) - Returns fallback on singular matrices

#### Since

0.9.0

---

### transpose()

> `static` **transpose**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:935](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L935)

Transposes a matrix (swaps rows and columns).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to transpose

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Transposed matrix

#### Since

0.7.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/matrix2.ts:2332](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2332)

Copies components from another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2`](../type-aliases/ReadonlyMatrix2.md)

Matrix to copy from

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### identity()

> **identity**(): `this`

Defined in: [src/core/matrix2.ts:2367](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2367)

Sets this matrix to identity.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### set()

> **set**(`m00`, `m01`, `m10`, `m11`): `this`

Defined in: [src/core/matrix2.ts:2315](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2315)

Sets the matrix components.

#### Parameters

##### m00

`number`

Column 0, Row 0

##### m01

`number`

Column 0, Row 1

##### m10

`number`

Column 1, Row 0

##### m11

`number`

Column 1, Row 1

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/matrix2.ts:2350](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2350)

Sets this matrix from array values (column-major order).

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array [m00, m01, m10, m11]

##### offset

`number` = `0`

Starting index (default 0)

#### Returns

`this`

This for chaining

#### Throws

If array has insufficient length

#### Since

0.7.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/matrix2.ts:2383](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2383)

Resets all components to zero.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

## Other

### m00

> **m00**: `number`

Defined in: [src/core/matrix2.ts:2208](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2208)

Column 0, Row 0 (typically cosine for rotation, x-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m00`](../../types/interfaces/Matrix2Like.md#m00)

---

### m01

> **m01**: `number`

Defined in: [src/core/matrix2.ts:2213](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2213)

Column 0, Row 1 (typically sine for rotation, y-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m01`](../../types/interfaces/Matrix2Like.md#m01)

---

### m10

> **m10**: `number`

Defined in: [src/core/matrix2.ts:2218](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2218)

Column 1, Row 0 (typically -sine for rotation, x-shear for shear).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m10`](../../types/interfaces/Matrix2Like.md#m10)

---

### m11

> **m11**: `number`

Defined in: [src/core/matrix2.ts:2223](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2223)

Column 1, Row 1 (typically cosine for rotation, y-scale for scale).

#### Implementation of

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md).[`m11`](../../types/interfaces/Matrix2Like.md#m11)

## Transform

### abs()

> **abs**(): `this`

Defined in: [src/core/matrix2.ts:3081](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3081)

Applies absolute value to all elements.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/matrix2.ts:3039](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3039)

Applies Math.ceil to all elements.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### clamp()

> **clamp**(`minM`, `maxM`): `this`

Defined in: [src/core/matrix2.ts:3141](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3141)

Clamps all components between min and max matrices.

#### Parameters

##### minM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component minima

##### maxM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component maxima

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### clampScalar()

> **clampScalar**(`min`, `max`): `this`

Defined in: [src/core/matrix2.ts:3157](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3157)

Clamps all components between scalar bounds.

#### Parameters

##### min

`number`

Minimum scalar

##### max

`number`

Maximum scalar

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### floor()

> **floor**(): `this`

Defined in: [src/core/matrix2.ts:3025](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3025)

Applies Math.floor to all elements.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### max()

> **max**(`other`): `this`

Defined in: [src/core/matrix2.ts:3125](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3125)

Component-wise maximum with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Other matrix

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### min()

> **min**(`other`): `this`

Defined in: [src/core/matrix2.ts:3110](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3110)

Component-wise minimum with another matrix.

#### Parameters

##### other

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Other matrix

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/matrix2.ts:3262](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3262)

Rotates this matrix by an angle in place.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### rotateCS()

> **rotateCS**(`cos`, `sin`): `this`

Defined in: [src/core/matrix2.ts:3288](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3288)

Rotates this matrix using precomputed cosine and sine values in place.

#### Parameters

##### cos

`number`

Cosine of the rotation angle

##### sin

`number`

Sine of the rotation angle

#### Returns

`this`

This matrix for chaining

#### Remarks

Use this method in hot paths where the same rotation is applied to multiple
matrices. Precompute `cos` and `sin` once and reuse them.

#### Example

```typescript
const rotation = Rotation2.fromAngle(Math.PI / 4);
const m = new Matrix2();
m.rotateCS(rotation.cos, rotation.sin);
```

#### Since

0.7.0

---

### round()

> **round**(): `this`

Defined in: [src/core/matrix2.ts:3053](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3053)

Applies Math.round to all elements.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### scaleBy()

> **scaleBy**(`scale`): `this`

Defined in: [src/core/matrix2.ts:3305](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3305)

Scales this matrix by per-axis factors.

#### Parameters

##### scale

Scale factors (Vector2 or uniform number)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### sign()

> **sign**(): `this`

Defined in: [src/core/matrix2.ts:3095](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3095)

Applies sign function to all elements.

#### Returns

`this`

This matrix for chaining

#### Since

0.7.0

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:3250](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3250)

Transforms a vector by this matrix.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### out?

[`Vector2`](Vector2.md)

Optional output object

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Example

```typescript
const mat = Matrix2.fromRotation(Math.PI / 2);
const v = new Vector2(1, 0);
const rotated = mat.transformVector(v); // Vector2(0, 1)
```

#### Since

0.7.0

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/matrix2.ts:3067](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L3067)

Applies Math.trunc to all elements (rounds towards zero).

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### abs()

> `static` **abs**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1275](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1275)

Applies absolute value to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with absolute values

#### Since

0.7.0

---

### ceil()

> `static` **ceil**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1218](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1218)

Applies Math.ceil to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with ceiled elements

#### Since

0.7.0

---

### clamp()

> `static` **clamp**(`matrix`, `minM`, `maxM`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1355](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1355)

Clamps all matrix components between min and max matrices.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to clamp

##### minM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component minima

##### maxM

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Per-component maxima

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Clamped matrix

#### Since

0.7.0

---

### clampScalar()

> `static` **clampScalar**(`matrix`, `min`, `max`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1381](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1381)

Clamps all matrix components between scalar min and max.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to clamp

##### min

`number`

Minimum scalar

##### max

`number`

Maximum scalar

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Clamped matrix

#### Since

0.7.0

---

### floor()

> `static` **floor**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1199](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1199)

Applies Math.floor to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with floored elements

#### Since

0.7.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1334](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1334)

Component-wise maximum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with per-component maxima

#### Since

0.7.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1314](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1314)

Component-wise minimum of two matrices.

#### Parameters

##### a

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

First matrix

##### b

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Second matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with per-component minima

#### Since

0.7.0

---

### rotate()

> `static` **rotate**(`matrix`, `angle`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:2116](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2116)

Rotates a matrix by an angle.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to rotate

##### angle

`number`

Angle in radians

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Rotated matrix

#### Remarks

Equivalent to `Matrix2.multiply(matrix, Matrix2.fromRotation(angle), out)`
but more efficient as it avoids creating an intermediate matrix.

#### Example

```typescript
const m = Matrix2.fromScale({ x: 2, y: 1 });
const rotated = Matrix2.rotate(m, Math.PI / 4);
```

#### Since

0.7.0

---

### rotateCS()

> `static` **rotateCS**(`matrix`, `cos`, `sin`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:2147](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2147)

Rotates a matrix using precomputed cosine and sine values.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to rotate

##### cos

`number`

Cosine of the rotation angle

##### sin

`number`

Sine of the rotation angle

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Rotated matrix

#### Remarks

Use this method in hot paths where the same rotation is applied to multiple
matrices. Precompute `cos` and `sin` once and reuse them.

#### Example

```typescript
const rotation = Rotation2.fromAngle(Math.PI / 4);
const m1 = Matrix2.fromScale({ x: 2, y: 1 });
const m2 = Matrix2.fromScale({ x: 1, y: 2 });
// Apply same rotation to both matrices efficiently
const r1 = Matrix2.rotateCS(m1, rotation.cos, rotation.sin);
const r2 = Matrix2.rotateCS(m2, rotation.cos, rotation.sin);
```

#### Since

0.7.0

---

### round()

> `static` **round**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1237](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1237)

Applies Math.round to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with rounded elements

#### Since

0.7.0

---

### scaleBy()

> `static` **scaleBy**(`matrix`, `scale`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:2184](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2184)

Scales a matrix by per-axis factors.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to scale

##### scale

Scale factors (Vector2 or uniform number)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Scaled matrix

#### Remarks

Unlike [scale](#scaleby-3) which multiplies all elements by a scalar,
this method applies non-uniform scaling using a Vector2.

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const scaled = Matrix2.scaleBy(m, { x: 2, y: 0.5 });
```

#### Since

0.7.0

---

### sign()

> `static` **sign**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1294](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1294)

Applies sign function to all matrix elements.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Matrix with signs (-1, 0, or 1)

#### Since

0.7.0

---

### transformVector()

> `static` **transformVector**(`matrix`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/matrix2.ts:2083](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L2083)

Transforms a vector by a matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix to transform by

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Since

0.7.0

---

### trunc()

> `static` **trunc**(`matrix`, `out?`): `Matrix2`

Defined in: [src/core/matrix2.ts:1256](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/matrix2.ts#L1256)

Applies Math.trunc to all matrix elements (rounds towards zero).

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Input matrix

##### out?

`Matrix2`

Optional output matrix

#### Returns

`Matrix2`

Truncated matrix

#### Since

0.7.0
