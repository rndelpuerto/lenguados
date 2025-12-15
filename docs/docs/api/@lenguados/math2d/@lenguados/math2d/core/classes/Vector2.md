# Class: Vector2

Defined in: [src/core/vector2.ts:118](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L118)

Mutable, chainable two-dimensional vector with comprehensive operations for
arithmetic, geometry, transforms, comparisons and conversions.

## Remarks

- **Design:** Instance methods are mutable and chainable; static methods are pure
  with alloc-free overloads via `out` parameter.
- **Numerics:** Uses DeterministicMath for cross-platform reproducibility.
- **Safety:** "Safe" variants avoid throwing on degeneracies.

## Example

```typescript
// Static (pure, allocation-controlled)
const sum = Vector2.add(a, b);
Vector2.add(a, b, existingVector); // Reuse allocation

// Instance (mutable, chainable)
velocity.add(acceleration).scale(dt);
```

## Since

0.1.0

## Implements

- [`Vector2Like`](../../types/interfaces/Vector2Like.md)

## Constructors

### Constructor

> **new Vector2**(): `Vector2`

Defined in: [src/core/vector2.ts:1865](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1865)

Creates a zero vector `(0, 0)`.

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`x`, `y`): `Vector2`

Defined in: [src/core/vector2.ts:1867](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1867)

Creates a vector from components `(x, y)`.

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`array`): `Vector2`

Defined in: [src/core/vector2.ts:1869](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1869)

Creates a vector from a tuple `[x, y]`.

#### Parameters

##### array

\[`number`, `number`\]

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`object`): `Vector2`

Defined in: [src/core/vector2.ts:1871](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1871)

Creates a vector from a plain object `{ x, y }`.

#### Parameters

##### object

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`Vector2`

## Arithmetic

### divide()

> **divide**(`v`): `this`

Defined in: [src/core/vector2.ts:2148](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2148)

Divides by v component-wise (safe).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

#### Returns

`this`

This for chaining.

#### Remarks

Uses safeDivide internally - division by zero returns 0 per component.

#### Since

0.1.0

***

### divideScalar()

> **divideScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2163](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2163)

Divides by scalar (safe).

#### Parameters

##### s

`number`

Scalar divisor (if near zero, sets to (0, 0)).

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### divideScalarUnchecked()

> **divideScalarUnchecked**(`s`): `this`

Defined in: [src/core/vector2.ts:2209](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2209)

Unchecked scalar division for hot paths.

#### Parameters

##### s

`number`

Scalar divisor (must be non-zero).

#### Returns

`this`

This for chaining.

#### Remarks

⚠️ **Precondition:** Scalar must be non-zero.
Calling with zero scalar produces Infinity/NaN components.

Use only when you can guarantee valid input (e.g., after explicit check).
For safe division, use [divideScalarSafe](#dividescalarsafe).

#### Example

```typescript
// Only use when you know s is non-zero
if (s !== 0) {
  v.divideScalarUnchecked(s);
}
```

#### Since

1.1.0

***

### multiply()

> **multiply**(`v`): `this`

Defined in: [src/core/vector2.ts:2115](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2115)

Multiplies by v component-wise (Hadamard product).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector multiplier.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### scale()

> **scale**(`s`): `this`

Defined in: [src/core/vector2.ts:2130](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2130)

Scales by scalar.

#### Parameters

##### s

`number`

Scale factor.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### add()

> `static` **add**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:323](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L323)

Component-wise addition `a + b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First addend.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second addend.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(a.x + b.x, a.y + b.y)`.

#### Since

0.1.0

***

### addScalar()

> `static` **addScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:338](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L338)

Adds a scalar to both components `v + s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### s

`number`

Scalar addend.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(v.x + s, v.y + s)`.

#### Since

0.8.0

***

### addScaledVector()

> `static` **addScaledVector**(`base`, `scaled`, `scale`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:473](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L473)

Adds a scaled vector: `base + scale * scaled`.

#### Parameters

##### base

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Base vector.

##### scaled

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to scale and add.

##### scale

`number`

Scale factor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `base + scaled * scale`.

#### Remarks

Common in physics for velocity integration: `v = v + a * dt`

#### Example

```typescript
velocity = Vector2.addScaledVector(velocity, acceleration, dt);
```

#### Since

0.8.0

***

### divide()

> `static` **divide**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:416](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L416)

Component-wise division `a / b` using safe division.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Numerator vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with safe division per component (0 if divisor near zero).

#### Remarks

Uses safeDivide internally - division by zero returns 0 per component.

#### Since

0.1.0

***

### divideScalar()

> `static` **divideScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:431](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L431)

Scalar division `v / s` using safe division.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to divide.

##### s

`number`

Scalar divisor (if near zero, returns (0, 0)).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(v.x / s, v.y / s)` or (0, 0) if s is near zero.

#### Since

0.1.0

***

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:497](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L497)

Fused multiply-add: `a * scale + b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to scale.

##### scale

`number`

Scale factor.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to add.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `a * scale + b`.

#### Remarks

More efficient than separate multiply and add operations.

#### Since

0.8.0

***

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:521](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L521)

Component-wise modulo operation `a % b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Dividend vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with positive modulo per component.

#### Remarks

Uses the positive modulo operation from auxiliary module,
which handles negative values correctly (always returns positive).

#### Since

0.8.0

***

### modScalar()

> `static` **modScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:536](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L536)

Scalar modulo operation `v % s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector dividend.

##### s

`number`

Scalar divisor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with modulo applied to both components.

#### Since

0.8.0

***

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:383](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L383)

Component-wise multiplication `a * b` (Hadamard product).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First factor.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second factor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(a.x * b.x, a.y * b.y)`.

#### Since

0.1.0

***

### negate()

> `static` **negate**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:449](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L449)

Unary negation `(-x, -y)`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Negated vector.

#### Since

0.1.0

***

### scale()

> `static` **scale**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:398](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L398)

Scales a vector by a scalar `v * s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to scale.

##### s

`number`

Scale factor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(v.x * s, v.y * s)`.

#### Since

0.1.0

***

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:353](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L353)

Component-wise subtraction `a - b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Minuend.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Subtrahend.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(a.x - b.x, a.y - b.y)`.

#### Since

0.1.0

***

### subtractScalar()

> `static` **subtractScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:368](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L368)

Subtracts a scalar from both components `v - s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### s

`number`

Scalar to subtract.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(v.x - s, v.y - s)`.

#### Since

0.8.0

***

### sumComponents()

> `static` **sumComponents**(`vector`): `number`

Defined in: [src/core/vector2.ts:308](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L308)

Computes the sum of components `x + y`.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to read.

#### Returns

`number`

The scalar sum `vector.x + vector.y`.

#### Since

0.8.0

## Comparison

### exactEquals()

> **exactEquals**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2953](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2953)

Exact equality with v (bit-identical).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

#### Returns

`boolean`

True if exactly identical.

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.8.0

***

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/vector2.ts:2982](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2982)

Tests if this vector is near zero (both components within epsilon).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance for comparison.

#### Returns

`boolean`

True if both components are within epsilon of zero.

#### Since

0.8.0

***

### nearEquals()

> **nearEquals**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:2969](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2969)

Approximate equality with v using relative tolerance.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if within scaled epsilon.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Since

0.8.0

***

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/vector2.ts:1746](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1746)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector.

#### Returns

`boolean`

True if components are exactly identical.

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.8.0

***

### hasNaN()

> `static` **hasNaN**(`v`): `boolean`

Defined in: [src/core/vector2.ts:1808](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1808)

Tests if any component is NaN.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test.

#### Returns

`boolean`

True if any component is NaN.

#### Since

0.9.0

***

### isFinite()

> `static` **isFinite**(`v`): `boolean`

Defined in: [src/core/vector2.ts:1795](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1795)

Tests whether both components are finite numbers.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test.

#### Returns

`boolean`

True if both components are finite.

#### Since

0.8.0

***

### isParallel()

> `static` **isParallel**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:1823](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1823)

Tests parallelism: |cross(a, b)| ≤ epsilon.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if vectors are parallel.

#### Default Value

`EPSILON`

#### Since

0.8.0

***

### isPerpendicular()

> `static` **isPerpendicular**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:1842](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1842)

Tests perpendicularity: |dot(a, b)| ≤ epsilon.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if vectors are perpendicular.

#### Default Value

`EPSILON`

#### Since

0.8.0

***

### isUnit()

> `static` **isUnit**(`v`): `boolean`

Defined in: [src/core/vector2.ts:1782](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1782)

Tests whether |length(v) - 1| ≤ EPSILON.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test.

#### Returns

`boolean`

True if v is unit length.

#### Since

0.8.0

***

### isZero()

> `static` **isZero**(`v`): `boolean`

Defined in: [src/core/vector2.ts:1715](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1715)

Tests whether v is exactly (0, 0).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test.

#### Returns

`boolean`

True if both components are zero.

#### Since

0.8.0

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:1765](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1765)

Approximate component-wise equality using relative tolerance.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if both component differences are within scaled epsilon.

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
This scales with value magnitude, making it robust for both small and large values.

#### Since

0.8.0

***

### nearZero()

> `static` **nearZero**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:1729](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1729)

Tests whether both components are within epsilon of 0.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if |x| ≤ epsilon and |y| ≤ epsilon.

#### Default Value

`EPSILON`

#### Since

0.8.0

## Constraint

### clamp()

> `static` **clamp**(`v`, `minV`, `maxV`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1039](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1039)

Component-wise clamp between min and max vectors.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clamp.

##### minV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component minima.

##### maxV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component maxima.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Clamped vector.

#### Since

0.1.0

***

### clampLength()

> `static` **clampLength**(`v`, `minLength`, `maxLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1081](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1081)

Clamps vector length to [minLength, maxLength].

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clamp.

##### minLength

`number`

Minimum magnitude.

##### maxLength

`number`

Maximum magnitude.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with clamped magnitude.

#### Since

0.1.0

***

### clampScalar()

> `static` **clampScalar**(`v`, `min`, `max`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1060](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1060)

Clamps both components between scalar min and max.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clamp.

##### min

`number`

Minimum scalar.

##### max

`number`

Maximum scalar.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Clamped vector.

#### Since

0.8.0

***

### limit()

> `static` **limit**(`v`, `maxLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1109](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1109)

Limits vector length to maxLength.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to limit.

##### maxLength

`number`

Maximum allowed magnitude.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with limited magnitude.

#### Remarks

Equivalent to `clampLength(v, 0, maxLength)`.

#### Since

0.8.0

***

### max()

> `static` **max**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1144](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1144)

Component-wise maximum of a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with per-component maxima.

#### Since

0.8.0

***

### min()

> `static` **min**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1129](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1129)

Component-wise minimum of a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with per-component minima.

#### Since

0.8.0

## Conversion

### toComplexLike()

> **toComplexLike**(): `object`

Defined in: [src/core/vector2.ts:3108](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3108)

Converts this vector to a complex-like object.

#### Returns

`object`

Object with real (x) and imag (y) properties.

##### imag

> **imag**: `number`

##### real

> **real**: `number`

#### Remarks

Returns a plain object compatible with ComplexLike interface.
Does not create a Complex instance to avoid circular dependencies.

#### Since

0.9.0

***

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/vector2.ts:3084](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3084)

Returns string representation.

#### Parameters

##### precision

`number` = `4`

Decimal places.

#### Returns

`string`

Formatted string.

#### Default Value

`4`

#### Since

0.1.0

## Direction

### angle()

> `static` **angle**(`v`): `number`

Defined in: [src/core/vector2.ts:982](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L982)

Heading (angle) of v from +X axis in radians ∈ [-π, π].

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

Angle in radians (CCW positive).

#### Since

0.1.0

***

### angleBetween()

> `static` **angleBetween**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1013](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1013)

Smallest unsigned angle between a and b in radians ∈ [0, π].

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector.

#### Returns

`number`

Unsigned angle in radians.

#### Since

0.8.0

***

### angleTo()

> `static` **angleTo**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:999](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L999)

Signed angle from a to b (positive if b is CCW from a).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector.

#### Returns

`number`

Signed angle in radians.

#### Remarks

Uses `atan2(cross(a,b), dot(a,b))` for robust behavior.

#### Since

0.8.0

***

### direction()

> `static` **direction**(`from`, `to`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:959](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L959)

Unit direction from `from` to `to`. Returns (0,0) if coincident.

#### Parameters

##### from

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start point.

##### to

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End point.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Unit direction vector.

#### Since

0.8.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:210](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L210)

Creates a deep copy of a vector.

#### Parameters

##### source

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clone.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

A Vector2 with identical components.

#### Since

0.1.0

***

### copy()

> `static` **copy**(`source`, `destination`): `Vector2`

Defined in: [src/core/vector2.ts:224](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L224)

Copies component values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### destination

`Vector2`

Target vector to receive the copy.

#### Returns

`Vector2`

The destination vector.

#### Since

0.8.0

***

### fromAngle()

> `static` **fromAngle**(`angle`, `radius`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:244](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L244)

Creates a vector from polar coordinates.

#### Parameters

##### angle

`number`

Angle in radians (from +X, CCW positive).

##### radius

`number` = `1`

Magnitude.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

A Vector2 positioned at the given angle and radius.

#### Default Value

`1`

#### Example

```typescript
Vector2.fromAngle(Math.PI / 2, 2); // → (0, 2)
```

#### Since

0.1.0

***

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:284](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L284)

Creates a vector from a flat numeric array.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Numeric array with at least two elements.

##### offset

`number` = `0`

Index of the x component.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

A Vector2 initialized from the array.

#### Default Value

`0`

#### Throws

If offset is out of bounds.

#### Example

```typescript
Vector2.fromArray([10, 20, 30]);    // → (10, 20)
Vector2.fromArray([10, 20, 30], 1); // → (20, 30)
```

#### Since

0.1.0

***

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1698](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1698)

Creates a vector from a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number with real and imag components.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with x=real, y=imag.

#### Remarks

Uses interface for loose coupling with Complex class.

#### Since

0.9.0

***

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:260](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L260)

Creates a vector from a plain object `{ x, y }`.

#### Parameters

##### object

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Plain object with numeric x and y.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

A Vector2 with the object's components.

#### Throws

If x or y is not finite.

#### Since

0.1.0

***

### fromValues()

> `static` **fromValues**(`x`, `y`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:196](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L196)

Creates a vector from explicit components.

#### Parameters

##### x

`number`

X component.

##### y

`number`

Y component.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

A Vector2 with components `(x, y)`.

#### Since

0.1.0

## Geometry

### cross()

> `static` **cross**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:836](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L836)

2D scalar cross product (z-component): `a.x*b.y - a.y*b.x`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First operand.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar cross product (signed area magnitude).

#### Remarks

Positive if b is CCW from a, negative if CW.

#### Since

0.8.0

***

### cross3()

> `static` **cross3**(`a`, `b`, `c`): `number`

Defined in: [src/core/vector2.ts:851](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L851)

Twice the signed area of triangle (a, b, c).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vertex.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vertex.

##### c

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Third vertex.

#### Returns

`number`

Twice the signed area (positive if CCW winding).

#### Since

0.8.0

***

### distance()

> `static` **distance**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:908](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L908)

Euclidean distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First point.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second point.

#### Returns

`number`

The Euclidean distance.

#### Since

0.1.0

***

### distanceSquared()

> `static` **distanceSquared**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:924](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L924)

Squared Euclidean distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First point.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second point.

#### Returns

`number`

The squared distance.

#### Since

0.1.0

***

### dot()

> `static` **dot**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:819](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L819)

Dot product `a·b = a.x*b.x + a.y*b.y`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First operand.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar dot product.

#### Since

0.8.0

***

### length()

> `static` **length**(`v`): `number`

Defined in: [src/core/vector2.ts:868](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L868)

Euclidean length `||v||`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

The Euclidean norm.

#### Since

0.8.0

***

### lengthSquared()

> `static` **lengthSquared**(`v`): `number`

Defined in: [src/core/vector2.ts:881](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L881)

Squared length `||v||²` (avoids square root).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

The squared length.

#### Since

0.8.0

***

### manhattanDistance()

> `static` **manhattanDistance**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:940](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L940)

Manhattan (L1) distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First point.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second point.

#### Returns

`number`

The Manhattan distance.

#### Since

0.8.0

***

### manhattanLength()

> `static` **manhattanLength**(`v`): `number`

Defined in: [src/core/vector2.ts:894](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L894)

Manhattan length `|x| + |y|`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

The Manhattan (L1) norm.

#### Since

0.1.0

## Interpolation

### lerp()

> **lerp**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:2842](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2842)

Linear interpolation towards end.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### lerpClamped()

> **lerpClamped**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:2857](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2857)

Clamped linear interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor (clamped).

#### Returns

`this`

This for chaining.

#### Since

0.8.0

***

### lerpUnclamped()

> **lerpUnclamped**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:2871](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2871)

Linear interpolation without clamping t (alias for lerp).

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor (not clamped).

#### Returns

`this`

This for chaining.

#### Since

0.9.0

***

### slerp()

> **slerp**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:2884](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2884)

Spherical linear interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

***

### smoothStep()

> **smoothStep**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:2921](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2921)

Smooth step interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

This for chaining.

#### Since

0.8.0

***

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:694](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L694)

Linear interpolation: `a + t * (b - a)`. Factor t is not clamped.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector.

##### t

`number`

Interpolation factor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Interpolated vector.

#### Since

0.1.0

***

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:715](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L715)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector.

##### t

`number`

Interpolation factor (clamped).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Clamped interpolated vector.

#### Since

0.8.0

***

### lerpUnclamped()

> `static` **lerpUnclamped**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:740](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L740)

Linear interpolation without clamping t.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector.

##### t

`number`

Interpolation factor (not clamped, can extrapolate).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Interpolated vector.

#### Remarks

Alias for `lerp`. Provided for symmetry with `lerpClamped`.

#### Since

0.9.0

***

### slerp()

> `static` **slerp**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:765](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L765)

Spherical linear interpolation between two vectors.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector.

##### t

`number`

Interpolation factor (0 to 1).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Spherically interpolated vector.

#### Remarks

Interpolates the angle while maintaining constant angular velocity.
Falls back to linear interpolation for nearly parallel or opposite vectors.

#### Since

0.1.0

## Numeric Transform

### abs()

> `static` **abs**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:596](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L596)

Applies Math.abs to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Absolute-valued vector.

#### Since

0.8.0

***

### ceil()

> `static` **ceil**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:568](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L568)

Applies Math.ceil to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Ceiled vector.

#### Since

0.8.0

***

### floor()

> `static` **floor**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:554](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L554)

Applies Math.floor to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Floored vector.

#### Since

0.8.0

***

### inverse()

> `static` **inverse**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:625](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L625)

Component-wise reciprocal (1/x, 1/y).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Inverted vector.

#### Throws

If any component is zero.

#### Since

0.8.0

***

### inverseSafe()

> `static` **inverseSafe**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:642](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L642)

Safe reciprocal. Components near zero become 0.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Safe inverted vector.

#### Since

0.8.0

***

### round()

> `static` **round**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:582](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L582)

Applies Math.round to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rounded vector.

#### Since

0.8.0

***

### sign()

> `static` **sign**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:610](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L610)

Component-wise sign extraction: (sign(x), sign(y)).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with components -1, 0, or 1.

#### Since

0.8.0

***

### step()

> `static` **step**(`edge`, `v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:674](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L674)

Component-wise step function (GLSL-style).

#### Parameters

##### edge

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Threshold vector.

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Input vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with 0 where `v < edge`, 1 otherwise.

#### Remarks

Useful for shader-like operations and conditional masking.

#### Since

0.8.0

***

### swap()

> `static` **swap**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:656](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L656)

Swaps x and y components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with swapped components `(y, x)`.

#### Since

0.8.0

## Other

### x

> **x**: `number`

Defined in: [src/core/vector2.ts:1855](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1855)

X component.

#### Implementation of

[`Vector2Like`](../../types/interfaces/Vector2Like.md).[`x`](../../types/interfaces/Vector2Like.md#x)

***

### y

> **y**: `number`

Defined in: [src/core/vector2.ts:1858](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1858)

Y component.

#### Implementation of

[`Vector2Like`](../../types/interfaces/Vector2Like.md).[`y`](../../types/interfaces/Vector2Like.md#y)

***

### EPSILON\_VECTOR

> `readonly` `static` **EPSILON\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:143](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L143)

Epsilon vector `(ε, ε)`.

***

### NEGATIVE\_INFINITY

> `readonly` `static` **NEGATIVE\_INFINITY**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:177](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L177)

The `(-∞, -∞)` vector.

***

### NEGATIVE\_ONE

> `readonly` `static` **NEGATIVE\_ONE**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:149](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L149)

The all-negative-ones vector `(-1, -1)`.

***

### NEGATIVE\_UNIT\_DIAGONAL

> `readonly` `static` **NEGATIVE\_UNIT\_DIAGONAL**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:167](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L167)

225° diagonal unit `(-1/√2, -1/√2)`.

***

### NEGATIVE\_UNIT\_X

> `readonly` `static` **NEGATIVE\_UNIT\_X**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:158](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L158)

Unit vector along -X `(-1, 0)`.

***

### NEGATIVE\_UNIT\_Y

> `readonly` `static` **NEGATIVE\_UNIT\_Y**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:161](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L161)

Unit vector along -Y `(0, -1)`.

***

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:146](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L146)

The all-ones vector `(1, 1)`.

***

### ORIGIN

> `readonly` `static` **ORIGIN**: `Readonly`\<`Vector2`\> = `Vector2.ZERO`

Defined in: [src/core/vector2.ts:140](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L140)

Alias for ZERO - the origin vector.

***

### POSITIVE\_INFINITY

> `readonly` `static` **POSITIVE\_INFINITY**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:172](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L172)

The `(+∞, +∞)` vector.

***

### UNIT\_DIAGONAL

> `readonly` `static` **UNIT\_DIAGONAL**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:164](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L164)

45° diagonal unit `(1/√2, 1/√2)`.

***

### UNIT\_X

> `readonly` `static` **UNIT\_X**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:152](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L152)

Unit vector along +X `(1, 0)`.

***

### UNIT\_Y

> `readonly` `static` **UNIT\_Y**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:155](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L155)

Unit vector along +Y `(0, 1)`.

***

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:137](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L137)

The zero/origin vector `(0, 0)`.

***

### absolute

#### Get Signature

> **get** **absolute**(): `Vector2`

Defined in: [src/core/vector2.ts:1932](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1932)

Returns an absolute-valued copy.

##### Returns

`Vector2`

New absolute-valued vector.

***

### flippedX

#### Get Signature

> **get** **flippedX**(): `Vector2`

Defined in: [src/core/vector2.ts:3136](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3136)

Returns a copy with x negated.

##### Returns

`Vector2`

New Vector2(-x, y).

***

### flippedY

#### Get Signature

> **get** **flippedY**(): `Vector2`

Defined in: [src/core/vector2.ts:3144](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3144)

Returns a copy with y negated.

##### Returns

`Vector2`

New Vector2(x, -y).

***

### negated

#### Get Signature

> **get** **negated**(): `Vector2`

Defined in: [src/core/vector2.ts:1924](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1924)

Returns a negated copy.

##### Returns

`Vector2`

New negated vector.

***

### normalized

#### Get Signature

> **get** **normalized**(): `Vector2`

Defined in: [src/core/vector2.ts:1915](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1915)

Returns a normalized copy (or zero if this is zero).

##### Returns

`Vector2`

New unit vector.

***

### perpCCW

#### Get Signature

> **get** **perpCCW**(): `Vector2`

Defined in: [src/core/vector2.ts:3128](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3128)

Returns perpendicular vector rotated 90° counter-clockwise.

##### Returns

`Vector2`

New Vector2(-y, x).

***

### perpCW

#### Get Signature

> **get** **perpCW**(): `Vector2`

Defined in: [src/core/vector2.ts:3120](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3120)

Returns perpendicular vector rotated 90° clockwise.

##### Returns

`Vector2`

New Vector2(y, -x).

***

### xx

#### Get Signature

> **get** **xx**(): `Vector2`

Defined in: [src/core/vector2.ts:1960](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1960)

Returns a vector with both components set to x.

##### Returns

`Vector2`

New Vector2(x, x).

***

### xy

#### Get Signature

> **get** **xy**(): `Vector2`

Defined in: [src/core/vector2.ts:1944](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1944)

Returns a copy of this vector (identity swizzle).

##### Returns

`Vector2`

New Vector2(x, y).

***

### yx

#### Get Signature

> **get** **yx**(): `Vector2`

Defined in: [src/core/vector2.ts:1952](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1952)

Returns a copy with swapped components.

##### Returns

`Vector2`

New Vector2(y, x).

***

### yy

#### Get Signature

> **get** **yy**(): `Vector2`

Defined in: [src/core/vector2.ts:1968](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1968)

Returns a vector with both components set to y.

##### Returns

`Vector2`

New Vector2(y, y).

***

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/vector2.ts:3092](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3092)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding x then y.

***

### abs()

> **abs**(): `this`

Defined in: [src/core/vector2.ts:2604](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2604)

Applies Math.abs to both components.

#### Returns

`this`

This for chaining.

***

### add()

> **add**(`v`): `this`

Defined in: [src/core/vector2.ts:2067](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2067)

Adds v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to add.

#### Returns

`this`

This for chaining.

***

### addScalar()

> **addScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2078](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2078)

Adds scalar to both components.

#### Parameters

##### s

`number`

Scalar to add.

#### Returns

`this`

This for chaining.

***

### addScaledVector()

> **addScaledVector**(`v`, `scale`): `this`

Defined in: [src/core/vector2.ts:2232](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2232)

Adds a scaled vector: this += scale * v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to scale and add.

##### scale

`number`

Scale factor.

#### Returns

`this`

This for chaining.

***

### angle()

> **angle**(): `number`

Defined in: [src/core/vector2.ts:2401](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2401)

Heading angle from +X axis.

#### Returns

`number`

Angle in radians.

***

### angleBetween()

> **angleBetween**(`v`): `number`

Defined in: [src/core/vector2.ts:2419](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2419)

Unsigned angle between this and v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

Unsigned angle in radians.

***

### angleTo()

> **angleTo**(`v`): `number`

Defined in: [src/core/vector2.ts:2410](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2410)

Signed angle to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

Signed angle in radians.

***

### applyMatrix2()

> **applyMatrix2**(`matrix`): `this`

Defined in: [src/core/vector2.ts:3207](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3207)

Transforms this vector by a 2x2 matrix in place.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix with m00, m01, m10, m11 components.

#### Returns

`this`

This for chaining.

***

### applyRotation()

> **applyRotation**(`rotation`): `this`

Defined in: [src/core/vector2.ts:3196](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3196)

Applies a rotation (unit complex) to this vector in place.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation with c (cos) and s (sin) components.

#### Returns

`this`

This for chaining.

***

### applyTransform()

> **applyTransform**(`transform`): `this`

Defined in: [src/core/vector2.ts:3218](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3218)

Applies a full 2D transform (scale → rotate → translate) in place.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform with position, rotation, and scale.

#### Returns

`this`

This for chaining.

***

### ceil()

> **ceil**(): `this`

Defined in: [src/core/vector2.ts:2634](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2634)

Applies Math.ceil to both components.

#### Returns

`this`

This for chaining.

***

### clamp()

> **clamp**(`minV`, `maxV`): `this`

Defined in: [src/core/vector2.ts:2533](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2533)

Clamps components between min and max vectors.

#### Parameters

##### minV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component minima.

##### maxV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component maxima.

#### Returns

`this`

This for chaining.

***

### clampLength()

> **clampLength**(`minLength`, `maxLength`): `this`

Defined in: [src/core/vector2.ts:2557](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2557)

Clamps length to range.

#### Parameters

##### minLength

`number`

Minimum magnitude.

##### maxLength

`number`

Maximum magnitude.

#### Returns

`this`

This for chaining.

***

### clampScalar()

> **clampScalar**(`min`, `max`): `this`

Defined in: [src/core/vector2.ts:2545](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2545)

Clamps components between scalar bounds.

#### Parameters

##### min

`number`

Minimum scalar.

##### max

`number`

Maximum scalar.

#### Returns

`this`

This for chaining.

***

### clone()

> **clone**(): `Vector2`

Defined in: [src/core/vector2.ts:3038](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3038)

Returns a shallow clone.

#### Returns

`Vector2`

New Vector2 with same components.

***

### copy()

> **copy**(`v`): `this`

Defined in: [src/core/vector2.ts:1993](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1993)

Copies from another vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

#### Returns

`this`

This for chaining.

***

### cross()

> **cross**(`v`): `number`

Defined in: [src/core/vector2.ts:2325](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2325)

2D scalar cross product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar cross product.

***

### crossScalarLeft()

> **crossScalarLeft**(`s`): `this`

Defined in: [src/core/vector2.ts:2823](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2823)

Cross product: scalar × vector = (-s*y, s*x).

#### Parameters

##### s

`number`

Scalar factor.

#### Returns

`this`

This for chaining.

***

### crossScalarRight()

> **crossScalarRight**(`s`): `this`

Defined in: [src/core/vector2.ts:2812](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2812)

Cross product: vector × scalar = (s*y, -s*x).

#### Parameters

##### s

`number`

Scalar factor.

#### Returns

`this`

This for chaining.

***

### directionTo()

> **directionTo**(`target`): `Vector2`

Defined in: [src/core/vector2.ts:2393](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2393)

Unit direction from this to target.

#### Parameters

##### target

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`Vector2`

New unit direction vector.

***

### distanceSquaredTo()

> **distanceSquaredTo**(`v`): `number`

Defined in: [src/core/vector2.ts:2367](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2367)

Squared distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The squared distance.

***

### distanceTo()

> **distanceTo**(`v`): `number`

Defined in: [src/core/vector2.ts:2358](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2358)

Euclidean distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The Euclidean distance.

***

### divideScalarSafe()

> **divideScalarSafe**(`s`): `this`

Defined in: [src/core/vector2.ts:2178](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2178)

Safe scalar division. If |s| ≤ EPSILON, sets to (0, 0).

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

This for chaining.

***

### dot()

> **dot**(`v`): `number`

Defined in: [src/core/vector2.ts:2316](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2316)

Dot product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar dot product.

***

### floor()

> **floor**(): `this`

Defined in: [src/core/vector2.ts:2624](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2624)

Applies Math.floor to both components.

#### Returns

`this`

This for chaining.

***

### fma()

> **fma**(`scale`, `v`): `this`

Defined in: [src/core/vector2.ts:2244](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2244)

Fused multiply-add: this = this * scale + v.

#### Parameters

##### scale

`number`

Scale factor.

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to add.

#### Returns

`this`

This for chaining.

***

### getComponent()

> **getComponent**(`index`): `number`

Defined in: [src/core/vector2.ts:2039](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2039)

Returns a component by index.

#### Parameters

##### index

0 for x, 1 for y.

`0` | `1`

#### Returns

`number`

The component value.

***

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/vector2.ts:3006](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3006)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN.

***

### inverse()

> **inverse**(): `this`

Defined in: [src/core/vector2.ts:2277](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2277)

Component-wise reciprocal.

#### Returns

`this`

This for chaining.

#### Throws

If any component is zero.

***

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/vector2.ts:2290](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2290)

Safe reciprocal. Components near zero become 0.

#### Returns

`this`

This for chaining.

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/vector2.ts:2998](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2998)

Tests if both components are finite.

#### Returns

`boolean`

True if finite.

***

### isParallelTo()

> **isParallelTo**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:3016](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3016)

Tests parallelism with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if parallel.

***

### isPerpendicularTo()

> **isPerpendicularTo**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:3026](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3026)

Tests perpendicularity with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if perpendicular.

***

### isUnit()

> **isUnit**(): `boolean`

Defined in: [src/core/vector2.ts:2990](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2990)

Tests if unit length.

#### Returns

`boolean`

True if |length - 1| ≤ EPSILON.

***

### isZero()

> **isZero**(`epsilon`): `boolean`

Defined in: [src/core/vector2.ts:2935](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2935)

Tests if exactly zero.

#### Parameters

##### epsilon

`number` = `0`

#### Returns

`boolean`

True if both components are zero.

***

### length()

> **length**(): `number`

Defined in: [src/core/vector2.ts:2333](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2333)

Euclidean length.

#### Returns

`number`

The Euclidean norm.

***

### lengthSquared()

> **lengthSquared**(): `number`

Defined in: [src/core/vector2.ts:2341](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2341)

Squared length.

#### Returns

`number`

The squared length.

***

### limit()

> **limit**(`maxLength`): `this`

Defined in: [src/core/vector2.ts:2569](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2569)

Limits length to maximum.

#### Parameters

##### maxLength

`number`

Maximum allowed magnitude.

#### Returns

`this`

This for chaining.

***

### manhattanDistanceTo()

> **manhattanDistanceTo**(`v`): `number`

Defined in: [src/core/vector2.ts:2376](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2376)

Manhattan (L1) distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The Manhattan distance.

***

### manhattanLength()

> **manhattanLength**(): `number`

Defined in: [src/core/vector2.ts:2349](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2349)

Manhattan length.

#### Returns

`number`

The Manhattan norm.

***

### max()

> **max**(`v`): `this`

Defined in: [src/core/vector2.ts:2594](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2594)

Component-wise maximum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Other vector.

#### Returns

`this`

This for chaining.

***

### midpointTo()

> **midpointTo**(`other`): `Vector2`

Defined in: [src/core/vector2.ts:3157](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3157)

Returns midpoint between this and other as a new vector.

#### Parameters

##### other

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second endpoint.

#### Returns

`Vector2`

New midpoint vector.

***

### min()

> **min**(`v`): `this`

Defined in: [src/core/vector2.ts:2583](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2583)

Component-wise minimum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Other vector.

#### Returns

`this`

This for chaining.

***

### mod()

> **mod**(`v`): `this`

Defined in: [src/core/vector2.ts:2255](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2255)

Component-wise modulo.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

#### Returns

`this`

This for chaining.

***

### modScalar()

> **modScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2266](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2266)

Scalar modulo on both components.

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

This for chaining.

***

### negate()

> **negate**(): `this`

Defined in: [src/core/vector2.ts:2220](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2220)

Negates both components.

#### Returns

`this`

This for chaining.

***

### normalize()

> **normalize**(): `this`

Defined in: [src/core/vector2.ts:2432](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2432)

Normalizes to unit length.

#### Returns

`this`

This for chaining.

#### Throws

If zero length.

***

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/vector2.ts:2444](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2444)

Safe normalization. Sets to (0, 0) if zero length.

#### Returns

`this`

This for chaining.

***

### perpendicular()

> **perpendicular**(`clockwise`): `this`

Defined in: [src/core/vector2.ts:2706](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2706)

Rotates by ±90°.

#### Parameters

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

#### Returns

`this`

This for chaining.

***

### project()

> **project**(`axis`): `this`

Defined in: [src/core/vector2.ts:2655](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2655)

Projects onto axis.

#### Parameters

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis.

#### Returns

`this`

This for chaining.

***

### projectOnUnit()

> **projectOnUnit**(`unitAxis`): `this`

Defined in: [src/core/vector2.ts:2669](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2669)

Projects onto unit axis.

#### Parameters

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis.

#### Returns

`this`

This for chaining.

***

### reflect()

> **reflect**(`unitNormal`): `this`

Defined in: [src/core/vector2.ts:2679](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2679)

Reflects about unit normal.

#### Parameters

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal.

#### Returns

`this`

This for chaining.

***

### reflectSafe()

> **reflectSafe**(`normal`): `this`

Defined in: [src/core/vector2.ts:2689](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2689)

Safe reflection.

#### Parameters

##### normal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Normal (need not be unit).

#### Returns

`this`

This for chaining.

***

### reject()

> **reject**(`onto`): `this`

Defined in: [src/core/vector2.ts:2798](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2798)

Vector rejection: removes projection onto axis.

#### Parameters

##### onto

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis to reject from.

#### Returns

`this`

This for chaining.

***

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/vector2.ts:2751](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2751)

Rotates by angle.

#### Parameters

##### angle

`number`

Rotation angle.

#### Returns

`this`

This for chaining.

***

### rotateAround()

> **rotateAround**(`center`, `angle`): `this`

Defined in: [src/core/vector2.ts:2774](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2774)

Rotates around center.

#### Parameters

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Pivot point.

##### angle

`number`

Rotation angle.

#### Returns

`this`

This for chaining.

***

### rotateAroundCS()

> **rotateAroundCS**(`center`, `c`, `s`): `this`

Defined in: [src/core/vector2.ts:2785](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2785)

Rotates around center using precomputed cos/sin.

#### Parameters

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Pivot point.

##### c

`number`

Cosine of angle.

##### s

`number`

Sine of angle.

#### Returns

`this`

This for chaining.

***

### rotateCS()

> **rotateCS**(`c`, `s`): `this`

Defined in: [src/core/vector2.ts:2762](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2762)

Rotates using precomputed cos/sin.

#### Parameters

##### c

`number`

Cosine.

##### s

`number`

Sine.

#### Returns

`this`

This for chaining.

***

### round()

> **round**(): `this`

Defined in: [src/core/vector2.ts:2644](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2644)

Applies Math.round to both components.

#### Returns

`this`

This for chaining.

***

### set()

> **set**(`x`, `y`): `this`

Defined in: [src/core/vector2.ts:1982](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1982)

Assigns both components.

#### Parameters

##### x

`number`

New x component.

##### y

`number`

New y component.

#### Returns

`this`

This for chaining.

***

### setComponent()

> **setComponent**(`index`, `value`): `this`

Defined in: [src/core/vector2.ts:2049](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2049)

Sets a component by index.

#### Parameters

##### index

0 for x, 1 for y.

`0` | `1`

##### value

`number`

New value.

#### Returns

`this`

This for chaining.

***

### setHeading()

> **setHeading**(`angle`): `this`

Defined in: [src/core/vector2.ts:2521](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2521)

Sets heading while preserving length.

#### Parameters

##### angle

`number`

New heading in radians.

#### Returns

`this`

This for chaining.

***

### setLength()

> **setLength**(`newLength`): `this`

Defined in: [src/core/vector2.ts:2491](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2491)

Sets the length.

#### Parameters

##### newLength

`number`

Desired magnitude.

#### Returns

`this`

This for chaining.

#### Throws

If zero length or negative.

***

### setLengthSafe()

> **setLengthSafe**(`newLength`): `this`

Defined in: [src/core/vector2.ts:2507](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2507)

Safe setLength. Zero vectors become (newLength, 0).

#### Parameters

##### newLength

`number`

Desired magnitude.

#### Returns

`this`

This for chaining.

***

### setScalar()

> **setScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2010](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2010)

Sets both components to the same scalar.

#### Parameters

##### s

`number`

Scalar value.

#### Returns

`this`

This for chaining.

***

### setX()

> **setX**(`x`): `this`

Defined in: [src/core/vector2.ts:2019](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2019)

Sets the x component.

#### Parameters

##### x

`number`

New x value.

#### Returns

`this`

This for chaining.

***

### setY()

> **setY**(`y`): `this`

Defined in: [src/core/vector2.ts:2029](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2029)

Sets the y component.

#### Parameters

##### y

`number`

New y value.

#### Returns

`this`

This for chaining.

***

### sign()

> **sign**(): `this`

Defined in: [src/core/vector2.ts:2614](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2614)

Component-wise sign.

#### Returns

`this`

This for chaining.

***

### stepBy()

> **stepBy**(`edge`): `this`

Defined in: [src/core/vector2.ts:3181](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3181)

Applies step function: sets components to 0 where < edge, else 1.

#### Parameters

##### edge

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Threshold vector.

#### Returns

`this`

This for chaining.

***

### subtract()

> **subtract**(`v`): `this`

Defined in: [src/core/vector2.ts:2089](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2089)

Subtracts v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to subtract.

#### Returns

`this`

This for chaining.

***

### subtractScalar()

> **subtractScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2100](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2100)

Subtracts scalar from both components.

#### Parameters

##### s

`number`

Scalar to subtract.

#### Returns

`this`

This for chaining.

***

### sumComponents()

> **sumComponents**(): `number`

Defined in: [src/core/vector2.ts:2384](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2384)

Returns the sum of components x + y.

#### Returns

`number`

Scalar sum.

***

### swap()

> **swap**(): `this`

Defined in: [src/core/vector2.ts:2300](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2300)

Swaps x and y components.

#### Returns

`this`

This for chaining.

***

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): \[`number`, `number`\] \| `T`

Defined in: [src/core/vector2.ts:3048](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3048)

Writes to array or typed array.

#### Type Parameters

##### T

`T` *extends* `ArrayLike`\<`number`\> & `object`

#### Parameters

##### out?

`T`

Destination array.

##### offset?

`number` = `0`

Write offset.

#### Returns

\[`number`, `number`\] \| `T`

The output array.

***

### toJSON()

> **toJSON**(): `object`

Defined in: [src/core/vector2.ts:3072](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3072)

Alias for toObject (JSON serialization).

#### Returns

`object`

Object with x and y properties.

##### x

> **x**: `number`

##### y

> **y**: `number`

***

### toObject()

> **toObject**(): `object`

Defined in: [src/core/vector2.ts:3064](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3064)

Returns plain object { x, y }.

#### Returns

`object`

Object with x and y properties.

##### x

> **x**: `number`

##### y

> **y**: `number`

***

### zero()

> **zero**(): `this`

Defined in: [src/core/vector2.ts:2001](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2001)

Resets both components to zero.

#### Returns

`this`

This for chaining.

## Transform

### midpoint()

> **midpoint**(`v`): `this`

Defined in: [src/core/vector2.ts:3170](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L3170)

Sets this vector to the midpoint between itself and v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

The other vector.

#### Returns

`this`

This for chaining.

#### Since

0.8.0

***

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/vector2.ts:2477](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2477)

Unchecked normalization for hot paths.

#### Returns

`this`

This for chaining.

#### Remarks

⚠️ **Precondition:** Vector must have non-zero length.
Calling with zero-length vector produces NaN/Infinity components.

Use only when you can guarantee valid input (e.g., after explicit check).
For safe normalization, use [normalizeSafe](#normalizesafe-2).
For normalization with error throwing, use [normalize](#normalize-2).

#### Example

```typescript
// Only use when you know the vector is non-zero
if (v.lengthSquared() > 0) {
  v.normalizeUnchecked();
}
```

#### Since

1.1.0

***

### unitPerpendicular()

> **unitPerpendicular**(`clockwise`): `this`

Defined in: [src/core/vector2.ts:2727](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2727)

Makes this vector a unit perpendicular.

#### Parameters

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

#### Returns

`this`

This for chaining.

#### Since

0.8.0

***

### unitPerpendicularSafe()

> **unitPerpendicularSafe**(`clockwise`): `this`

Defined in: [src/core/vector2.ts:2741](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L2741)

Safe unit perpendicular. Sets to (0, 0) if this is near zero.

#### Parameters

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

#### Returns

`this`

This for chaining.

#### Since

0.8.0

***

### angularToLinearVelocity()

> `static` **angularToLinearVelocity**(`omega`, `r`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1595](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1595)

Computes tangent vector from scalar rotation rate and radius vector.

#### Parameters

##### omega

`number`

Scalar rotation rate (radians per unit time).

##### r

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Radius vector from rotation center.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Tangent vector `(-ω*r.y, ω*r.x)`.

#### Remarks

Mathematically equivalent to `crossSV(omega, r)`.
In 2D, a scalar "angular rate" crossed with a position vector
yields the perpendicular (tangent) velocity at that position.

#### Example

```typescript
const omega = Math.PI;
const r = new Vector2(1, 0);
const tangent = Vector2.angularToLinearVelocity(omega, r);
// tangent ≈ (0, π)
```

#### Since

0.9.0

***

### crossSV()

> `static` **crossSV**(`s`, `v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1567](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1567)

Box2D-style cross: scalar × vector = (-s*y, s*x).

#### Parameters

##### s

`number`

Scalar factor.

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Perpendicular scaled vector (CCW rotation).

#### Since

0.8.0

***

### crossVS()

> `static` **crossVS**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1552](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1552)

Box2D-style cross: vector × scalar = (s*y, -s*x).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### s

`number`

Scalar factor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Perpendicular scaled vector (CW rotation).

#### Since

0.8.0

***

### midpoint()

> `static` **midpoint**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1537](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1537)

Midpoint between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First endpoint.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second endpoint.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Midpoint vector.

#### Since

0.8.0

***

### normalize()

> `static` **normalize**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1170](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1170)

Normalizes v to unit length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to normalize.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Unit vector.

#### Throws

If v has zero length.

#### Remarks

**Numerical Limits:** For vectors with extremely small components
(magnitude < ~1e-154), intermediate calculations may underflow to zero
due to IEEE 754 double precision limits, causing a RangeError even if
the vector is technically non-zero. Use [normalizeSafe](#normalizesafe-2) for
graceful handling of such edge cases.

#### Since

0.1.0

***

### normalizeSafe()

> `static` **normalizeSafe**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1189](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1189)

Safe normalization. Returns (0,0) if v has zero length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to normalize.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Normalized vector or zero vector.

#### Since

0.1.0

***

### perpendicular()

> `static` **perpendicular**(`v`, `clockwise`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1397](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1397)

Perpendicular vector (±90°) with unchanged length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### clockwise

`boolean` = `false`

CW (-90°) if true, CCW (+90°) if false.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Perpendicular vector.

#### Default Value

`false`

#### Remarks

- CCW (+90°): `(-y, x)`
- CW (-90°): `(y, -x)`

#### Since

0.8.0

***

### project()

> `static` **project**(`v`, `axis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1278](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1278)

Projects v onto axis.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to project.

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Projection of v onto axis.

#### Remarks

If axis is zero, returns (0, 0).

#### Since

0.8.0

***

### projectOnUnit()

> `static` **projectOnUnit**(`v`, `unitAxis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1298](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1298)

Projects v onto a unit axis (optimized).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to project.

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Projection of v onto unitAxis.

#### Since

0.8.0

***

### reflect()

> `static` **reflect**(`v`, `unitNormal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1346](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1346)

Reflection of v about a unit normal: `r = v - 2(v·n)n`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Incident vector.

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Reflected vector.

#### Remarks

Implements the reflection formula: `r = v - 2 * dot(v, n) * n`.
Uses [Vector2.dot](#dot-2) internally.
For physics bounces, the incident velocity reflects off surfaces using this formula.

#### Since

0.8.0

***

### reflectSafe()

> `static` **reflectSafe**(`v`, `normal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1366](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1366)

Safe reflection. Normalizes the normal; near-zero normal returns v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Incident vector.

##### normal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Normal (need not be unit).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Reflected vector.

#### Since

0.8.0

***

### reject()

> `static` **reject**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1321](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1321)

Vector rejection: component of a perpendicular to b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to decompose.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis of projection.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rejection of a from b.

#### Remarks

`reject(a, b) = a - project(a, b)`

#### Since

0.8.0

***

### rotate()

> `static` **rotate**(`v`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1453](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1453)

Rotates v by angle radians.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate.

##### angle

`number`

Rotation angle (CCW positive).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rotated vector.

#### Since

0.1.0

***

### rotateAround()

> `static` **rotateAround**(`v`, `center`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1486](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1486)

Rotates v around center by angle.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate.

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Rotation pivot.

##### angle

`number`

Rotation angle.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rotated vector.

#### Since

0.8.0

***

### rotateAroundCS()

> `static` **rotateAroundCS**(`v`, `center`, `c`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1514](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1514)

Rotates v around center using precomputed cos/sin.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate.

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Rotation pivot.

##### c

`number`

Cosine of angle.

##### s

`number`

Sine of angle.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rotated vector.

#### Remarks

Optimal when rotating many points around the same center.

#### Since

0.8.0

***

### rotateCS()

> `static` **rotateCS**(`v`, `c`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1470](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1470)

Rotates v using precomputed cos/sin (optimal for batches).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate.

##### c

`number`

Cosine of angle.

##### s

`number`

Sine of angle.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rotated vector.

#### Since

0.8.0

***

### setHeading()

> `static` **setHeading**(`v`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1254](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1254)

Returns vector with same magnitude but new heading.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### angle

`number`

New heading in radians.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with rotated heading.

#### Since

0.8.0

***

### setLength()

> `static` **setLength**(`v`, `newLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1210](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1210)

Returns a copy of v with the requested length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### newLength

`number`

Desired magnitude.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with specified length.

#### Throws

If newLength < 0 or v has zero length.

#### Since

0.8.0

***

### setLengthSafe()

> `static` **setLengthSafe**(`v`, `newLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1233](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1233)

Safe setLength. Zero vectors become (newLength, 0).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### newLength

`number`

Desired magnitude (clamped to 0 if negative).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with specified length.

#### Since

0.8.0

***

### unitPerpendicular()

> `static` **unitPerpendicular**(`v`, `clockwise`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1413](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1413)

Unit perpendicular. Throws if v is zero.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Unit perpendicular vector.

#### Throws

If v has zero length.

#### Since

0.8.0

***

### unitPerpendicularSafe()

> `static` **unitPerpendicularSafe**(`v`, `clockwise`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1433](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1433)

Safe unit perpendicular. Returns (0, 0) if v is zero.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Unit perpendicular vector or zero.

#### Since

0.8.0

## Transform Integration

### applyMatrix2()

> `static` **applyMatrix2**(`v`, `matrix`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1645](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1645)

Transforms a vector by a 2x2 matrix.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix with m00, m01, m10, m11 components.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Transformed vector.

#### Remarks

Computes: [m00*x + m10*y, m01*x + m11*y] (column-major convention).
Uses interface for loose coupling.

#### Since

0.9.0

***

### applyRotation()

> `static` **applyRotation**(`v`, `rotation`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1622](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1622)

Applies a Rotation2 (unit complex) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation with c (cos) and s (sin) components.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rotated vector.

#### Remarks

Equivalent to `rotateCS(v, rotation.cos, rotation.sin, out)`.
Uses interface for loose coupling.

#### Since

0.9.0

***

### applyTransform()

> `static` **applyTransform**(`v`, `transform`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1671](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/vector2.ts#L1671)

Applies a full 2D transform (scale → rotate → translate) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform with position, rotation (angle), and scale.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Transformed vector.

#### Remarks

Transform order: Scale first, then rotate, then translate.
Uses interface for loose coupling.

#### Since

0.9.0
