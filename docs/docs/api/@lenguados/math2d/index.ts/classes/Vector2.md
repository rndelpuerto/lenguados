# Class: Vector2

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

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Implements

- [`Vector2Like`](../../@lenguados/math2d/types/interfaces/Vector2Like.md)

## Constructors

### Constructor

> **new Vector2**(): `Vector2`

Creates a zero vector `(0, 0)`.

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`x`, `y`): `Vector2`

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

Creates a vector from a tuple `[x, y]`.

#### Parameters

##### array

\[`number`, `number`\]

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`object`): `Vector2`

Creates a vector from a plain object `{ x, y }`.

#### Parameters

##### object

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

#### Returns

`Vector2`

## Arithmetic

### divide()

> **divide**(`v`): `this`

Divides by v component-wise (safe).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

#### Returns

`this`

This for chaining.

#### Remarks

Uses safeDivide internally - division by zero returns 0 per component.

---

### divideScalar()

> **divideScalar**(`s`): `this`

Divides by scalar (safe).

#### Parameters

##### s

`number`

Scalar divisor (if near zero, sets to (0, 0)).

#### Returns

`this`

This for chaining.

---

### multiply()

> **multiply**(`v`): `this`

Multiplies by v component-wise (Hadamard product).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector multiplier.

#### Returns

`this`

This for chaining.

---

### scale()

> **scale**(`s`): `this`

Scales by scalar.

#### Parameters

##### s

`number`

Scale factor.

#### Returns

`this`

This for chaining.

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Vector2`

Component-wise addition `a + b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First addend.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second addend.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(a.x + b.x, a.y + b.y)`.

#### Since

0.1.0

---

### addScalar()

> `static` **addScalar**(`v`, `s`, `out?`): `Vector2`

Adds a scalar to both components `v + s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### addScaledVector()

> `static` **addScaledVector**(`base`, `scaled`, `scale`, `out?`): `Vector2`

Adds a scaled vector: `base + scale * scaled`.

#### Parameters

##### base

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Base vector.

##### scaled

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### divide()

> `static` **divide**(`a`, `b`, `out?`): `Vector2`

Component-wise division `a / b` using safe division.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Numerator vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### divideScalar()

> `static` **divideScalar**(`v`, `s`, `out?`): `Vector2`

Scalar division `v / s` using safe division.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Vector2`

Fused multiply-add: `a * scale + b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to scale.

##### scale

`number`

Scale factor.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Vector2`

Component-wise modulo operation `a % b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Dividend vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### modScalar()

> `static` **modScalar**(`v`, `s`, `out?`): `Vector2`

Scalar modulo operation `v % s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Vector2`

Component-wise multiplication `a * b` (Hadamard product).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First factor.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second factor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(a.x * b.x, a.y * b.y)`.

#### Since

0.1.0

---

### negate()

> `static` **negate**(`v`, `out?`): `Vector2`

Unary negation `(-x, -y)`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Negated vector.

#### Since

0.1.0

---

### scale()

> `static` **scale**(`v`, `s`, `out?`): `Vector2`

Scales a vector by a scalar `v * s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Vector2`

Component-wise subtraction `a - b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Minuend.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Subtrahend.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(a.x - b.x, a.y - b.y)`.

#### Since

0.1.0

---

### subtractScalar()

> `static` **subtractScalar**(`v`, `s`, `out?`): `Vector2`

Subtracts a scalar from both components `v - s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### sumComponents()

> `static` **sumComponents**(`vector`): `number`

Computes the sum of components `x + y`.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to read.

#### Returns

`number`

The scalar sum `vector.x + vector.y`.

#### Since

0.8.0

## Comparison

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

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

---

### equals()

> `static` **equals**(`a`, `b`): `boolean`

Strict component-wise equality.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second vector.

#### Returns

`boolean`

True if components are identical.

#### Since

0.8.0

---

### isFinite()

> `static` **isFinite**(`v`): `boolean`

Tests whether both components are finite numbers.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to test.

#### Returns

`boolean`

True if both components are finite.

#### Since

0.8.0

---

### isParallel()

> `static` **isParallel**(`a`, `b`, `epsilon`): `boolean`

Tests parallelism: |cross(a, b)| ≤ epsilon.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### isPerpendicular()

> `static` **isPerpendicular**(`a`, `b`, `epsilon`): `boolean`

Tests perpendicularity: |dot(a, b)| ≤ epsilon.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### isUnit()

> `static` **isUnit**(`v`): `boolean`

Tests whether |length(v) - 1| ≤ EPSILON.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to test.

#### Returns

`boolean`

True if v is unit length.

#### Since

0.8.0

---

### isZero()

> `static` **isZero**(`v`): `boolean`

Tests whether v is exactly (0, 0).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to test.

#### Returns

`boolean`

True if both components are zero.

#### Since

0.8.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Approximate component-wise equality.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if both component differences are within epsilon.

#### Default Value

`EPSILON`

#### Since

0.8.0

---

### nearZero()

> `static` **nearZero**(`v`, `epsilon`): `boolean`

Tests whether both components are within epsilon of 0.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

Component-wise clamp between min and max vectors.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to clamp.

##### minV

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Per-component minima.

##### maxV

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Per-component maxima.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Clamped vector.

#### Since

0.1.0

---

### clampLength()

> `static` **clampLength**(`v`, `minLength`, `maxLength`, `out?`): `Vector2`

Clamps vector length to [minLength, maxLength].

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### clampScalar()

> `static` **clampScalar**(`v`, `min`, `max`, `out?`): `Vector2`

Clamps both components between scalar min and max.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### limit()

> `static` **limit**(`v`, `maxLength`, `out?`): `Vector2`

Limits vector length to maxLength.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Vector2`

Component-wise maximum of a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with per-component maxima.

#### Since

0.8.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Vector2`

Component-wise minimum of a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with per-component minima.

#### Since

0.8.0

## Direction

### angle()

> `static` **angle**(`v`): `number`

Heading (angle) of v from +X axis in radians ∈ [-π, π].

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

Angle in radians (CCW positive).

#### Since

0.1.0

---

### angleBetween()

> `static` **angleBetween**(`a`, `b`): `number`

Smallest unsigned angle between a and b in radians ∈ [0, π].

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second vector.

#### Returns

`number`

Unsigned angle in radians.

#### Since

0.8.0

---

### angleTo()

> `static` **angleTo**(`a`, `b`): `number`

Signed angle from a to b (positive if b is CCW from a).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

End vector.

#### Returns

`number`

Signed angle in radians.

#### Remarks

Uses `atan2(cross(a,b), dot(a,b))` for robust behavior.

#### Since

0.8.0

---

### direction()

> `static` **direction**(`from`, `to`, `out?`): `Vector2`

Unit direction from `from` to `to`. Returns (0,0) if coincident.

#### Parameters

##### from

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Start point.

##### to

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

Creates a deep copy of a vector.

#### Parameters

##### source

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to clone.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

A Vector2 with identical components.

#### Since

0.1.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Vector2`

Copies component values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### destination

`Vector2`

Target vector to receive the copy.

#### Returns

`Vector2`

The destination vector.

#### Since

0.8.0

---

### fromAngle()

> `static` **fromAngle**(`angle`, `radius`, `out?`): `Vector2`

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

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Vector2`

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
Vector2.fromArray([10, 20, 30]); // → (10, 20)
Vector2.fromArray([10, 20, 30], 1); // → (20, 30)
```

#### Since

0.1.0

---

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Vector2`

Creates a vector from a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../@lenguados/math2d/types/interfaces/ReadonlyComplexLike.md)

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

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Vector2`

Creates a vector from a plain object `{ x, y }`.

#### Parameters

##### object

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### fromValues()

> `static` **fromValues**(`x`, `y`, `out?`): `Vector2`

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

2D scalar cross product (z-component): `a.x*b.y - a.y*b.x`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First operand.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar cross product (signed area magnitude).

#### Remarks

Positive if b is CCW from a, negative if CW.

#### Since

0.8.0

---

### cross3()

> `static` **cross3**(`a`, `b`, `c`): `number`

Twice the signed area of triangle (a, b, c).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First vertex.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second vertex.

##### c

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Third vertex.

#### Returns

`number`

Twice the signed area (positive if CCW winding).

#### Since

0.8.0

---

### distance()

> `static` **distance**(`a`, `b`): `number`

Euclidean distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First point.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second point.

#### Returns

`number`

The Euclidean distance.

#### Since

0.1.0

---

### distanceSquared()

> `static` **distanceSquared**(`a`, `b`): `number`

Squared Euclidean distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First point.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second point.

#### Returns

`number`

The squared distance.

#### Since

0.1.0

---

### dot()

> `static` **dot**(`a`, `b`): `number`

Dot product `a·b = a.x*b.x + a.y*b.y`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First operand.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar dot product.

#### Since

0.8.0

---

### length()

> `static` **length**(`v`): `number`

Euclidean length `||v||`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

The Euclidean norm.

#### Since

0.8.0

---

### lengthSquared()

> `static` **lengthSquared**(`v`): `number`

Squared length `||v||²` (avoids square root).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

The squared length.

#### Since

0.8.0

---

### manhattanDistance()

> `static` **manhattanDistance**(`a`, `b`): `number`

Manhattan (L1) distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First point.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second point.

#### Returns

`number`

The Manhattan distance.

#### Since

0.8.0

---

### manhattanLength()

> `static` **manhattanLength**(`v`): `number`

Manhattan length `|x| + |y|`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to measure.

#### Returns

`number`

The Manhattan (L1) norm.

#### Since

0.1.0

## Interpolation

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Vector2`

Linear interpolation: `a + t * (b - a)`. Factor t is not clamped.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Vector2`

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### slerp()

> `static` **slerp**(`a`, `b`, `t`, `out?`): `Vector2`

Spherical linear interpolation between two vectors.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

## Other

### x

> **x**: `number`

X component.

#### Implementation of

[`Vector2Like`](../../@lenguados/math2d/types/interfaces/Vector2Like.md).[`x`](../../@lenguados/math2d/types/interfaces/Vector2Like.md#x)

---

### y

> **y**: `number`

Y component.

#### Implementation of

[`Vector2Like`](../../@lenguados/math2d/types/interfaces/Vector2Like.md).[`y`](../../@lenguados/math2d/types/interfaces/Vector2Like.md#y)

---

### EPSILON_VECTOR

> `readonly` `static` **EPSILON_VECTOR**: `Readonly`\<`Vector2`\>

Epsilon vector `(ε, ε)`.

---

### NEGATIVE_INFINITY

> `readonly` `static` **NEGATIVE_INFINITY**: `Readonly`\<`Vector2`\>

The `(-∞, -∞)` vector.

---

### NEGATIVE_ONE

> `readonly` `static` **NEGATIVE_ONE**: `Readonly`\<`Vector2`\>

The all-negative-ones vector `(-1, -1)`.

---

### NEGATIVE_UNIT_DIAGONAL

> `readonly` `static` **NEGATIVE_UNIT_DIAGONAL**: `Readonly`\<`Vector2`\>

225° diagonal unit `(-1/√2, -1/√2)`.

---

### NEGATIVE_UNIT_X

> `readonly` `static` **NEGATIVE_UNIT_X**: `Readonly`\<`Vector2`\>

Unit vector along -X `(-1, 0)`.

---

### NEGATIVE_UNIT_Y

> `readonly` `static` **NEGATIVE_UNIT_Y**: `Readonly`\<`Vector2`\>

Unit vector along -Y `(0, -1)`.

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Vector2`\>

The all-ones vector `(1, 1)`.

---

### ORIGIN

> `readonly` `static` **ORIGIN**: `Readonly`\<`Vector2`\> = `Vector2.ZERO`

Alias for ZERO - the origin vector.

---

### POSITIVE_INFINITY

> `readonly` `static` **POSITIVE_INFINITY**: `Readonly`\<`Vector2`\>

The `(+∞, +∞)` vector.

---

### UNIT_DIAGONAL

> `readonly` `static` **UNIT_DIAGONAL**: `Readonly`\<`Vector2`\>

45° diagonal unit `(1/√2, 1/√2)`.

---

### UNIT_X

> `readonly` `static` **UNIT_X**: `Readonly`\<`Vector2`\>

Unit vector along +X `(1, 0)`.

---

### UNIT_Y

> `readonly` `static` **UNIT_Y**: `Readonly`\<`Vector2`\>

Unit vector along +Y `(0, 1)`.

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Vector2`\>

The zero/origin vector `(0, 0)`.

---

### absolute

#### Get Signature

> **get** **absolute**(): `Vector2`

Returns an absolute-valued copy.

##### Returns

`Vector2`

New absolute-valued vector.

---

### flippedX

#### Get Signature

> **get** **flippedX**(): `Vector2`

Returns a copy with x negated.

##### Returns

`Vector2`

New Vector2(-x, y).

---

### flippedY

#### Get Signature

> **get** **flippedY**(): `Vector2`

Returns a copy with y negated.

##### Returns

`Vector2`

New Vector2(x, -y).

---

### negated

#### Get Signature

> **get** **negated**(): `Vector2`

Returns a negated copy.

##### Returns

`Vector2`

New negated vector.

---

### normalized

#### Get Signature

> **get** **normalized**(): `Vector2`

Returns a normalized copy (or zero if this is zero).

##### Returns

`Vector2`

New unit vector.

---

### perpCCW

#### Get Signature

> **get** **perpCCW**(): `Vector2`

Returns perpendicular vector rotated 90° counter-clockwise.

##### Returns

`Vector2`

New Vector2(-y, x).

---

### perpCW

#### Get Signature

> **get** **perpCW**(): `Vector2`

Returns perpendicular vector rotated 90° clockwise.

##### Returns

`Vector2`

New Vector2(y, -x).

---

### xx

#### Get Signature

> **get** **xx**(): `Vector2`

Returns a vector with both components set to x.

##### Returns

`Vector2`

New Vector2(x, x).

---

### xy

#### Get Signature

> **get** **xy**(): `Vector2`

Returns a copy of this vector (identity swizzle).

##### Returns

`Vector2`

New Vector2(x, y).

---

### yx

#### Get Signature

> **get** **yx**(): `Vector2`

Returns a copy with swapped components.

##### Returns

`Vector2`

New Vector2(y, x).

---

### yy

#### Get Signature

> **get** **yy**(): `Vector2`

Returns a vector with both components set to y.

##### Returns

`Vector2`

New Vector2(y, y).

---

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding x then y.

---

### abs()

> **abs**(): `this`

Applies Math.abs to both components.

#### Returns

`this`

This for chaining.

---

### add()

> **add**(`v`): `this`

Adds v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to add.

#### Returns

`this`

This for chaining.

---

### addScalar()

> **addScalar**(`s`): `this`

Adds scalar to both components.

#### Parameters

##### s

`number`

Scalar to add.

#### Returns

`this`

This for chaining.

---

### addScaledVector()

> **addScaledVector**(`v`, `scale`): `this`

Adds a scaled vector: this += scale \* v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to scale and add.

##### scale

`number`

Scale factor.

#### Returns

`this`

This for chaining.

---

### angle()

> **angle**(): `number`

Heading angle from +X axis.

#### Returns

`number`

Angle in radians.

---

### angleBetween()

> **angleBetween**(`v`): `number`

Unsigned angle between this and v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

Unsigned angle in radians.

---

### angleTo()

> **angleTo**(`v`): `number`

Signed angle to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

Signed angle in radians.

---

### applyMatrix2()

> **applyMatrix2**(`matrix`): `this`

Transforms this vector by a 2x2 matrix in place.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

Matrix with m00, m01, m10, m11 components.

#### Returns

`this`

This for chaining.

---

### applyRotation()

> **applyRotation**(`rotation`): `this`

Applies a rotation (unit complex) to this vector in place.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyRotation2Like.md)

Rotation with c (cos) and s (sin) components.

#### Returns

`this`

This for chaining.

---

### applyTransform()

> **applyTransform**(`transform`): `this`

Applies a full 2D transform (scale → rotate → translate) in place.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyTransform2Like.md)

Transform with position, rotation, and scale.

#### Returns

`this`

This for chaining.

---

### ceil()

> **ceil**(): `this`

Applies Math.ceil to both components.

#### Returns

`this`

This for chaining.

---

### clamp()

> **clamp**(`minV`, `maxV`): `this`

Clamps components between min and max vectors.

#### Parameters

##### minV

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Per-component minima.

##### maxV

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Per-component maxima.

#### Returns

`this`

This for chaining.

---

### clampLength()

> **clampLength**(`minLength`, `maxLength`): `this`

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

---

### clampScalar()

> **clampScalar**(`min`, `max`): `this`

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

---

### clone()

> **clone**(): `Vector2`

Returns a shallow clone.

#### Returns

`Vector2`

New Vector2 with same components.

---

### copy()

> **copy**(`v`): `this`

Copies from another vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

#### Returns

`this`

This for chaining.

---

### cross()

> **cross**(`v`): `number`

2D scalar cross product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar cross product.

---

### crossScalarLeft()

> **crossScalarLeft**(`s`): `this`

Cross product: scalar × vector = (-s*y, s*x).

#### Parameters

##### s

`number`

Scalar factor.

#### Returns

`this`

This for chaining.

---

### crossScalarRight()

> **crossScalarRight**(`s`): `this`

Cross product: vector × scalar = (s*y, -s*x).

#### Parameters

##### s

`number`

Scalar factor.

#### Returns

`this`

This for chaining.

---

### directionTo()

> **directionTo**(`target`): `Vector2`

Unit direction from this to target.

#### Parameters

##### target

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`Vector2`

New unit direction vector.

---

### distanceSquaredTo()

> **distanceSquaredTo**(`v`): `number`

Squared distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The squared distance.

---

### distanceTo()

> **distanceTo**(`v`): `number`

Euclidean distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The Euclidean distance.

---

### divideScalarSafe()

> **divideScalarSafe**(`s`): `this`

Safe scalar division. If |s| ≤ EPSILON, sets to (0, 0).

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

This for chaining.

---

### dot()

> **dot**(`v`): `number`

Dot product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar dot product.

---

### equals()

> **equals**(`v`): `boolean`

Strict equality with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

#### Returns

`boolean`

True if identical.

---

### floor()

> **floor**(): `this`

Applies Math.floor to both components.

#### Returns

`this`

This for chaining.

---

### fma()

> **fma**(`scale`, `v`): `this`

Fused multiply-add: this = this \* scale + v.

#### Parameters

##### scale

`number`

Scale factor.

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to add.

#### Returns

`this`

This for chaining.

---

### getComponent()

> **getComponent**(`index`): `number`

Returns a component by index.

#### Parameters

##### index

0 for x, 1 for y.

`0` | `1`

#### Returns

`number`

The component value.

---

### hasNaN()

> **hasNaN**(): `boolean`

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN.

---

### inverse()

> **inverse**(): `this`

Component-wise reciprocal.

#### Returns

`this`

This for chaining.

#### Throws

If any component is zero.

---

### inverseSafe()

> **inverseSafe**(): `this`

Safe reciprocal. Components near zero become 0.

#### Returns

`this`

This for chaining.

---

### isFinite()

> **isFinite**(): `boolean`

Tests if both components are finite.

#### Returns

`boolean`

True if finite.

---

### isParallelTo()

> **isParallelTo**(`v`, `epsilon`): `boolean`

Tests parallelism with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if parallel.

---

### isPerpendicularTo()

> **isPerpendicularTo**(`v`, `epsilon`): `boolean`

Tests perpendicularity with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if perpendicular.

---

### isUnit()

> **isUnit**(): `boolean`

Tests if unit length.

#### Returns

`boolean`

True if |length - 1| ≤ EPSILON.

---

### isZero()

> **isZero**(`epsilon`): `boolean`

Tests if exactly zero.

#### Parameters

##### epsilon

`number` = `0`

#### Returns

`boolean`

True if both components are zero.

---

### length()

> **length**(): `number`

Euclidean length.

#### Returns

`number`

The Euclidean norm.

---

### lengthSquared()

> **lengthSquared**(): `number`

Squared length.

#### Returns

`number`

The squared length.

---

### lerp()

> **lerp**(`end`, `t`): `this`

Linear interpolation towards end.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

This for chaining.

---

### lerpClamped()

> **lerpClamped**(`end`, `t`): `this`

Clamped linear interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor (clamped).

#### Returns

`this`

This for chaining.

---

### limit()

> **limit**(`maxLength`): `this`

Limits length to maximum.

#### Parameters

##### maxLength

`number`

Maximum allowed magnitude.

#### Returns

`this`

This for chaining.

---

### manhattanDistanceTo()

> **manhattanDistanceTo**(`v`): `number`

Manhattan (L1) distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The Manhattan distance.

---

### manhattanLength()

> **manhattanLength**(): `number`

Manhattan length.

#### Returns

`number`

The Manhattan norm.

---

### max()

> **max**(`v`): `this`

Component-wise maximum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Other vector.

#### Returns

`this`

This for chaining.

---

### midpointTo()

> **midpointTo**(`other`): `Vector2`

Returns midpoint between this and other as a new vector.

#### Parameters

##### other

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second endpoint.

#### Returns

`Vector2`

New midpoint vector.

---

### min()

> **min**(`v`): `this`

Component-wise minimum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Other vector.

#### Returns

`this`

This for chaining.

---

### mod()

> **mod**(`v`): `this`

Component-wise modulo.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

#### Returns

`this`

This for chaining.

---

### modScalar()

> **modScalar**(`s`): `this`

Scalar modulo on both components.

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

This for chaining.

---

### nearEquals()

> **nearEquals**(`v`, `tolerance`): `boolean`

Approximate equality with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to compare.

##### tolerance

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if within tolerance.

---

### negate()

> **negate**(): `this`

Negates both components.

#### Returns

`this`

This for chaining.

---

### normalize()

> **normalize**(): `this`

Normalizes to unit length.

#### Returns

`this`

This for chaining.

#### Throws

If zero length.

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Safe normalization. Sets to (0, 0) if zero length.

#### Returns

`this`

This for chaining.

---

### perpendicular()

> **perpendicular**(`clockwise`): `this`

Rotates by ±90°.

#### Parameters

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

#### Returns

`this`

This for chaining.

---

### project()

> **project**(`axis`): `this`

Projects onto axis.

#### Parameters

##### axis

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Projection axis.

#### Returns

`this`

This for chaining.

---

### projectOnUnit()

> **projectOnUnit**(`unitAxis`): `this`

Projects onto unit axis.

#### Parameters

##### unitAxis

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Unit-length axis.

#### Returns

`this`

This for chaining.

---

### reflect()

> **reflect**(`unitNormal`): `this`

Reflects about unit normal.

#### Parameters

##### unitNormal

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Unit-length normal.

#### Returns

`this`

This for chaining.

---

### reflectSafe()

> **reflectSafe**(`normal`): `this`

Safe reflection.

#### Parameters

##### normal

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Normal (need not be unit).

#### Returns

`this`

This for chaining.

---

### reject()

> **reject**(`onto`): `this`

Vector rejection: removes projection onto axis.

#### Parameters

##### onto

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Axis to reject from.

#### Returns

`this`

This for chaining.

---

### reset()

> **reset**(): `void`

Resets the object to its initial state.
Called when the object is returned to the pool.

#### Returns

`void`

#### Inherited from

[`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md).[`reset`](../../@lenguados/math2d/pool/interfaces/Poolable.md#reset)

---

### rotate()

> **rotate**(`angle`): `this`

Rotates by angle.

#### Parameters

##### angle

`number`

Rotation angle.

#### Returns

`this`

This for chaining.

---

### rotateAround()

> **rotateAround**(`center`, `angle`): `this`

Rotates around center.

#### Parameters

##### center

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Pivot point.

##### angle

`number`

Rotation angle.

#### Returns

`this`

This for chaining.

---

### rotateAroundCS()

> **rotateAroundCS**(`center`, `c`, `s`): `this`

Rotates around center using precomputed cos/sin.

#### Parameters

##### center

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### rotateCS()

> **rotateCS**(`c`, `s`): `this`

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

---

### round()

> **round**(): `this`

Applies Math.round to both components.

#### Returns

`this`

This for chaining.

---

### set()

> **set**(`x`, `y`): `this`

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

---

### setComponent()

> **setComponent**(`index`, `value`): `this`

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

---

### setHeading()

> **setHeading**(`angle`): `this`

Sets heading while preserving length.

#### Parameters

##### angle

`number`

New heading in radians.

#### Returns

`this`

This for chaining.

---

### setLength()

> **setLength**(`newLength`): `this`

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

---

### setLengthSafe()

> **setLengthSafe**(`newLength`): `this`

Safe setLength. Zero vectors become (newLength, 0).

#### Parameters

##### newLength

`number`

Desired magnitude.

#### Returns

`this`

This for chaining.

---

### setScalar()

> **setScalar**(`s`): `this`

Sets both components to the same scalar.

#### Parameters

##### s

`number`

Scalar value.

#### Returns

`this`

This for chaining.

---

### setX()

> **setX**(`x`): `this`

Sets the x component.

#### Parameters

##### x

`number`

New x value.

#### Returns

`this`

This for chaining.

---

### setY()

> **setY**(`y`): `this`

Sets the y component.

#### Parameters

##### y

`number`

New y value.

#### Returns

`this`

This for chaining.

---

### sign()

> **sign**(): `this`

Component-wise sign.

#### Returns

`this`

This for chaining.

---

### slerp()

> **slerp**(`end`, `t`): `this`

Spherical linear interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

This for chaining.

---

### smoothStep()

> **smoothStep**(`end`, `t`): `this`

Smooth step interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

This for chaining.

---

### stepBy()

> **stepBy**(`edge`): `this`

Applies step function: sets components to 0 where < edge, else 1.

#### Parameters

##### edge

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Threshold vector.

#### Returns

`this`

This for chaining.

---

### subtract()

> **subtract**(`v`): `this`

Subtracts v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to subtract.

#### Returns

`this`

This for chaining.

---

### subtractScalar()

> **subtractScalar**(`s`): `this`

Subtracts scalar from both components.

#### Parameters

##### s

`number`

Scalar to subtract.

#### Returns

`this`

This for chaining.

---

### sumComponents()

> **sumComponents**(): `number`

Returns the sum of components x + y.

#### Returns

`number`

Scalar sum.

---

### swap()

> **swap**(): `this`

Swaps x and y components.

#### Returns

`this`

This for chaining.

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): \[`number`, `number`\] \| `T`

Writes to array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

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

---

### toComplexLike()

> **toComplexLike**(): `object`

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

---

### toJSON()

> **toJSON**(): `object`

Alias for toObject (JSON serialization).

#### Returns

`object`

Object with x and y properties.

##### x

> **x**: `number`

##### y

> **y**: `number`

---

### toObject()

> **toObject**(): `object`

Returns plain object { x, y }.

#### Returns

`object`

Object with x and y properties.

##### x

> **x**: `number`

##### y

> **y**: `number`

---

### toString()

> **toString**(`precision?`): `string`

Returns string representation.

#### Parameters

##### precision?

`number`

Optional decimal places.

#### Returns

`string`

Formatted string.

---

### zero()

> **zero**(): `this`

Resets both components to zero.

#### Returns

`this`

This for chaining.

## Physics

### angularToLinearVelocity()

> `static` **angularToLinearVelocity**(`omega`, `r`, `out?`): `Vector2`

Converts angular velocity to linear velocity at a position.
Useful in physics for calculating velocity at a point on a rotating body.

#### Parameters

##### omega

`number`

Angular velocity in radians per second.

##### r

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Position vector from center of rotation.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Linear velocity v = ω × r = (-ω*r.y, ω*r.x).

#### Remarks

In 2D, angular velocity ω is a scalar (perpendicular to the plane).
The cross product ω × r produces a tangent velocity.
Equivalent to `Vector2.crossSV(omega, r, out)`.

#### Example

```typescript
const omega = Math.PI; // 180°/s
const r = new Vector2(1, 0); // 1 unit from center
const v = Vector2.angularToLinearVelocity(omega, r);
// v ≈ (0, π) - moving tangentially
```

#### Since

0.9.0

## Transform

### midpoint()

> **midpoint**(`v`): `this`

Sets this vector to the midpoint between itself and v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

The other vector.

#### Returns

`this`

This for chaining.

#### Since

0.8.0

---

### unitPerpendicular()

> **unitPerpendicular**(`clockwise`): `this`

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

---

### unitPerpendicularSafe()

> **unitPerpendicularSafe**(`clockwise`): `this`

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

---

### abs()

> `static` **abs**(`v`, `out?`): `Vector2`

Applies Math.abs to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Absolute-valued vector.

#### Since

0.8.0

---

### ceil()

> `static` **ceil**(`v`, `out?`): `Vector2`

Applies Math.ceil to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Ceiled vector.

#### Since

0.8.0

---

### crossSV()

> `static` **crossSV**(`s`, `v`, `out?`): `Vector2`

Box2D-style cross: scalar × vector = (-s*y, s*x).

#### Parameters

##### s

`number`

Scalar factor.

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Perpendicular scaled vector (CCW rotation).

#### Since

0.8.0

---

### crossVS()

> `static` **crossVS**(`v`, `s`, `out?`): `Vector2`

Box2D-style cross: vector × scalar = (s*y, -s*x).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### floor()

> `static` **floor**(`v`, `out?`): `Vector2`

Applies Math.floor to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Floored vector.

#### Since

0.8.0

---

### inverse()

> `static` **inverse**(`v`, `out?`): `Vector2`

Component-wise reciprocal (1/x, 1/y).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### inverseSafe()

> `static` **inverseSafe**(`v`, `out?`): `Vector2`

Safe reciprocal. Components near zero become 0.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Safe inverted vector.

#### Since

0.8.0

---

### midpoint()

> `static` **midpoint**(`a`, `b`, `out?`): `Vector2`

Midpoint between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

First endpoint.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Second endpoint.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Midpoint vector.

#### Since

0.8.0

---

### normalize()

> `static` **normalize**(`v`, `out?`): `Vector2`

Normalizes v to unit length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to normalize.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Unit vector.

#### Throws

If v has zero length.

#### Since

0.1.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`v`, `out?`): `Vector2`

Safe normalization. Returns (0,0) if v has zero length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to normalize.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Normalized vector or zero vector.

#### Since

0.1.0

---

### perpendicular()

> `static` **perpendicular**(`v`, `clockwise`, `out?`): `Vector2`

Perpendicular vector (±90°) with unchanged length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### project()

> `static` **project**(`v`, `axis`, `out?`): `Vector2`

Projects v onto axis.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to project.

##### axis

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### projectOnUnit()

> `static` **projectOnUnit**(`v`, `unitAxis`, `out?`): `Vector2`

Projects v onto a unit axis (optimized).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to project.

##### unitAxis

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Unit-length axis.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Projection of v onto unitAxis.

#### Since

0.8.0

---

### reflect()

> `static` **reflect**(`v`, `unitNormal`, `out?`): `Vector2`

Reflection of v about a unit normal: `r = v - 2(v·n)n`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Incident vector.

##### unitNormal

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### reflectSafe()

> `static` **reflectSafe**(`v`, `normal`, `out?`): `Vector2`

Safe reflection. Normalizes the normal; near-zero normal returns v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Incident vector.

##### normal

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Normal (need not be unit).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Reflected vector.

#### Since

0.8.0

---

### reject()

> `static` **reject**(`a`, `b`, `out?`): `Vector2`

Vector rejection: component of a perpendicular to b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to decompose.

##### b

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### rotate()

> `static` **rotate**(`v`, `angle`, `out?`): `Vector2`

Rotates v by angle radians.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### rotateAround()

> `static` **rotateAround**(`v`, `center`, `angle`, `out?`): `Vector2`

Rotates v around center by angle.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to rotate.

##### center

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### rotateAroundCS()

> `static` **rotateAroundCS**(`v`, `center`, `c`, `s`, `out?`): `Vector2`

Rotates v around center using precomputed cos/sin.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to rotate.

##### center

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### rotateCS()

> `static` **rotateCS**(`v`, `c`, `s`, `out?`): `Vector2`

Rotates v using precomputed cos/sin (optimal for batches).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### round()

> `static` **round**(`v`, `out?`): `Vector2`

Applies Math.round to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rounded vector.

#### Since

0.8.0

---

### setHeading()

> `static` **setHeading**(`v`, `angle`, `out?`): `Vector2`

Returns vector with same magnitude but new heading.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### setLength()

> `static` **setLength**(`v`, `newLength`, `out?`): `Vector2`

Returns a copy of v with the requested length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### setLengthSafe()

> `static` **setLengthSafe**(`v`, `newLength`, `out?`): `Vector2`

Safe setLength. Zero vectors become (newLength, 0).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### sign()

> `static` **sign**(`v`, `out?`): `Vector2`

Component-wise sign extraction: (sign(x), sign(y)).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with components -1, 0, or 1.

#### Since

0.8.0

---

### step()

> `static` **step**(`edge`, `v`, `out?`): `Vector2`

Component-wise step function (GLSL-style).

#### Parameters

##### edge

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Threshold vector.

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### swap()

> `static` **swap**(`v`, `out?`): `Vector2`

Swaps x and y components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with swapped components `(y, x)`.

#### Since

0.8.0

---

### unitPerpendicular()

> `static` **unitPerpendicular**(`v`, `clockwise`, `out?`): `Vector2`

Unit perpendicular. Throws if v is zero.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

---

### unitPerpendicularSafe()

> `static` **unitPerpendicularSafe**(`v`, `clockwise`, `out?`): `Vector2`

Safe unit perpendicular. Returns (0, 0) if v is zero.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

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

Transforms a vector by a 2x2 matrix.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### matrix

[`ReadonlyMatrix2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyMatrix2Like.md)

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

---

### applyRotation()

> `static` **applyRotation**(`v`, `rotation`, `out?`): `Vector2`

Applies a Rotation2 (unit complex) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### rotation

[`ReadonlyRotation2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyRotation2Like.md)

Rotation with c (cos) and s (sin) components.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rotated vector.

#### Remarks

Equivalent to `rotateCS(v, rotation.c, rotation.s, out)`.
Uses interface for loose coupling.

#### Since

0.9.0

---

### applyTransform()

> `static` **applyTransform**(`v`, `transform`, `out?`): `Vector2`

Applies a full 2D transform (scale → rotate → translate) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### transform

[`ReadonlyTransform2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyTransform2Like.md)

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
