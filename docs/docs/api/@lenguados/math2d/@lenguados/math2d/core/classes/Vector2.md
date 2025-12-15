# Class: Vector2

Defined in: [src/core/vector2.ts:122](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L122)

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

Defined in: [src/core/vector2.ts:2523](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2523)

Creates a zero vector `(0, 0)`.

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`x`, `y`): `Vector2`

Defined in: [src/core/vector2.ts:2525](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2525)

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

Defined in: [src/core/vector2.ts:2527](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2527)

Creates a vector from a tuple `[x, y]`.

#### Parameters

##### array

\[`number`, `number`\]

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`object`): `Vector2`

Defined in: [src/core/vector2.ts:2529](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2529)

Creates a vector from a plain object `{ x, y }`.

#### Parameters

##### object

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`Vector2`

## Arithmetic

### add()

> **add**(`v`): `this`

Defined in: [src/core/vector2.ts:2772](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2772)

Adds v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to add.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

---

### addScalar()

> **addScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2787](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2787)

Adds scalar to both components.

#### Parameters

##### s

`number`

Scalar to add.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

---

### divide()

> **divide**(`v`): `this`

Defined in: [src/core/vector2.ts:2866](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2866)

Divides by v component-wise (strict).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

#### Returns

`this`

This for chaining.

#### Throws

If any component of v is near zero.

#### See

- [divideSafe](#dividesafe-2) - Sets to 0 per component instead of throwing
- [divideUnchecked](#divideunchecked-2) - No validation

#### Since

0.1.0

---

### divideSafe()

> **divideSafe**(`v`): `this`

Defined in: [src/core/vector2.ts:2884](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2884)

Divides by v component-wise (safe).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

#### Returns

`this`

This for chaining (0 if divisor near zero).

#### Since

0.13.0

---

### divideScalar()

> **divideScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2922](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2922)

Divides by scalar (strict).

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

This for chaining.

#### Throws

If scalar is near zero.

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Since

0.1.0

---

### divideScalarSafe()

> **divideScalarSafe**(`s`): `this`

Defined in: [src/core/vector2.ts:2940](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2940)

Safe scalar division. If |s| ≤ EPSILON, sets to (0, 0).

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

This for chaining.

#### Since

0.11.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`s`): `this`

Defined in: [src/core/vector2.ts:2974](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2974)

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
For safe division, use [divideScalarSafe](#dividescalarsafe-2).

#### Example

```typescript
// Only use when you know s is non-zero
if (s !== 0) {
 v.divideScalarUnchecked(s);
}
```

#### Since

0.14.0

---

### divideUnchecked()

> **divideUnchecked**(`v`): `this`

Defined in: [src/core/vector2.ts:2902](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2902)

Divides by v component-wise (unchecked).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector (must have non-zero components).

#### Returns

`this`

This for chaining.

#### Remarks

**⚠️ Precondition:** `v.x ≠ 0` and `v.y ≠ 0`.

#### Since

0.13.0

---

### multiply()

> **multiply**(`v`): `this`

Defined in: [src/core/vector2.ts:2832](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2832)

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

---

### negate()

> **negate**(): `this`

Defined in: [src/core/vector2.ts:2989](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2989)

Negates both components.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

---

### scale()

> **scale**(`s`): `this`

Defined in: [src/core/vector2.ts:2847](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2847)

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

---

### subtract()

> **subtract**(`v`): `this`

Defined in: [src/core/vector2.ts:2802](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2802)

Subtracts v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to subtract.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

---

### subtractScalar()

> **subtractScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2817](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2817)

Subtracts scalar from both components.

#### Parameters

##### s

`number`

Scalar to subtract.

#### Returns

`this`

This for chaining.

#### Since

0.1.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:370](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L370)

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

---

### addScalar()

> `static` **addScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:385](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L385)

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

---

### addScaledVector()

> `static` **addScaledVector**(`base`, `scaled`, `scale`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:607](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L607)

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

---

### divide()

> `static` **divide**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:464](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L464)

Component-wise division `a / b` (strict).

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

Vector equal to `(a.x / b.x, a.y / b.y)`.

#### Throws

If any component of b is near zero.

#### See

- [divideSafe](#dividesafe-2) - Returns 0 per component instead of throwing
- [divideUnchecked](#divideunchecked-2) - No validation, for hot paths

#### Since

0.1.0

---

### divideSafe()

> `static` **divideSafe**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:484](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L484)

Component-wise division `a / b` (safe).

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

#### See

[divide](#divide-2) - Throws on near-zero component

#### Since

0.13.0

---

### divideScalar()

> `static` **divideScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:526](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L526)

Scalar division `v / s` (strict).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to divide.

##### s

`number`

Scalar divisor.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(v.x / s, v.y / s)`.

#### Throws

If scalar is near zero.

#### Remarks

For safe division that returns zeros instead of throwing, use [divideScalarSafe](#dividescalarsafe-2).
For hot paths where you've already validated the input, use [divideScalarUnchecked](#dividescalarunchecked-2).

#### Since

0.1.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:545](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L545)

Scalar division `v / s` (safe).

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

0.11.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:568](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L568)

Scalar division `v / s` (unchecked for hot paths).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to divide.

##### s

`number`

Scalar divisor (must be non-zero).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(v.x / s, v.y / s)`.

#### Remarks

⚠️ **Precondition:** Scalar must be non-zero.
Calling with zero scalar produces Infinity/NaN components.

#### Since

0.11.0

---

### divideUnchecked()

> `static` **divideUnchecked**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:502](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L502)

Component-wise division `a / b` (unchecked for hot paths).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Numerator vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector (must have non-zero components).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector equal to `(a.x / b.x, a.y / b.y)`.

#### Remarks

**⚠️ Precondition:** `b.x ≠ 0` and `b.y ≠ 0`. Calling with zero produces Infinity/NaN.

#### Since

0.13.0

---

### fma()

> `static` **fma**(`a`, `scale`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:631](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L631)

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

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:655](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L655)

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

---

### modScalar()

> `static` **modScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:670](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L670)

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

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:430](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L430)

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

---

### negate()

> `static` **negate**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:583](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L583)

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

---

### scale()

> `static` **scale**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:445](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L445)

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

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:400](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L400)

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

---

### subtractScalar()

> `static` **subtractScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:415](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L415)

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

---

### sumComponents()

> `static` **sumComponents**(`vector`): `number`

Defined in: [src/core/vector2.ts:355](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L355)

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

Defined in: [src/core/vector2.ts:3792](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3792)

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

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/vector2.ts:3821](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3821)

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

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/vector2.ts:3777](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3777)

Tests if exactly zero.

#### Returns

`boolean`

True if both components are zero.

#### See

[isNearZero](../../auxiliary/scalar/functions/isNearZero.md) For tolerance-based comparison.

#### Since

0.8.0

---

### nearEquals()

> **nearEquals**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:3808](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3808)

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

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/vector2.ts:2404](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2404)

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

---

### hasNaN()

> `static` **hasNaN**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2466](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2466)

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

---

### isFinite()

> `static` **isFinite**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2453](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2453)

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

---

### isNearZero()

> `static` **isNearZero**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:2387](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2387)

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

---

### isParallel()

> `static` **isParallel**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:2481](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2481)

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

---

### isPerpendicular()

> `static` **isPerpendicular**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:2500](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2500)

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

---

### isUnit()

> `static` **isUnit**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2440](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2440)

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

---

### isZero()

> `static` **isZero**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2373](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2373)

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

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:2423](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2423)

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

## Constant

### EPSILON_VECTOR

> `readonly` `static` **EPSILON_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:152](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L152)

Epsilon vector `(ε, ε)`.

#### Since

0.8.0

---

### NEGATIVE_INFINITY

> `readonly` `static` **NEGATIVE_INFINITY**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:224](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L224)

The `(-∞, -∞)` vector.

#### Since

0.8.0

---

### NEGATIVE_ONE

> `readonly` `static` **NEGATIVE_ONE**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:166](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L166)

The all-negative-ones vector `(-1, -1)`.

#### Since

0.8.0

---

### NEGATIVE_UNIT_DIAGONAL

> `readonly` `static` **NEGATIVE_UNIT_DIAGONAL**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:208](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L208)

225° diagonal unit `(-1/√2, -1/√2)` - direction from origin at 225° from +X.

#### Since

0.8.0

---

### NEGATIVE_UNIT_X

> `readonly` `static` **NEGATIVE_UNIT_X**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:187](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L187)

Unit vector along -X `(-1, 0)`.

#### Since

0.8.0

---

### NEGATIVE_UNIT_Y

> `readonly` `static` **NEGATIVE_UNIT_Y**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:194](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L194)

Unit vector along -Y `(0, -1)`.

#### Since

0.8.0

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:159](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L159)

The all-ones vector `(1, 1)`.

#### Since

0.1.0

---

### POSITIVE_INFINITY

> `readonly` `static` **POSITIVE_INFINITY**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:215](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L215)

The `(+∞, +∞)` vector.

#### Since

0.8.0

---

### UNIT_DIAGONAL

> `readonly` `static` **UNIT_DIAGONAL**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:201](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L201)

45° diagonal unit `(1/√2, 1/√2)` - direction from origin at 45° from +X.

#### Since

0.8.0

---

### UNIT_X

> `readonly` `static` **UNIT_X**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:173](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L173)

Unit vector along +X `(1, 0)`.

#### Since

0.1.0

---

### UNIT_Y

> `readonly` `static` **UNIT_Y**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:180](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L180)

Unit vector along +Y `(0, 1)`.

#### Since

0.1.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:145](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L145)

The zero/origin vector `(0, 0)`.

#### Since

0.1.0

## Constraint

### maxScalar()

> **maxScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3412](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3412)

Component-wise maximum with scalar.

#### Parameters

##### s

`number`

Scalar bound.

#### Returns

`this`

This for chaining.

#### Since

0.14.0

---

### minScalar()

> **minScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3398](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3398)

Component-wise minimum with scalar.

#### Parameters

##### s

`number`

Scalar bound.

#### Returns

`this`

This for chaining.

#### Since

0.14.0

---

### clamp()

> `static` **clamp**(`v`, `minV`, `maxV`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1301](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1301)

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

---

### clampMagnitude()

> `static` **clampMagnitude**(`v`, `minLength`, `maxLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1343](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1343)

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

---

### clampScalar()

> `static` **clampScalar**(`v`, `min`, `max`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1322](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1322)

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

---

### limit()

> `static` **limit**(`v`, `maxLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1371](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1371)

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

Equivalent to `clampMagnitude(v, 0, maxLength)`.

#### Since

0.8.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1406](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1406)

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

---

### maxScalar()

> `static` **maxScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1436](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1436)

Component-wise maximum of v and scalar s.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector.

##### s

`number`

Scalar bound.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with each component ≥ s.

#### Since

0.14.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1391](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1391)

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

---

### minScalar()

> `static` **minScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1421](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1421)

Component-wise minimum of v and scalar s.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector.

##### s

`number`

Scalar bound.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with each component ≤ s.

#### Since

0.14.0

## Conversion

### toComplexLike()

> **toComplexLike**(): `object`

Defined in: [src/core/vector2.ts:3947](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3947)

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

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/vector2.ts:3923](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3923)

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

Defined in: [src/core/vector2.ts:1244](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1244)

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

---

### angleBetween()

> `static` **angleBetween**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1275](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1275)

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

---

### angleTo()

> `static` **angleTo**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1261](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1261)

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

---

### direction()

> `static` **direction**(`from`, `to`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1165](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1165)

Unit direction from `from` to `to`.

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

#### Throws

If from and to are coincident.

#### See

- [directionSafe](#directionsafe) - Returns (0,0) instead of throwing
- [directionUnchecked](#directionunchecked) - No validation, for hot paths

#### Since

0.8.0

---

### directionSafe()

> `static` **directionSafe**(`from`, `to`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1193](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1193)

Unit direction from `from` to `to`, returning (0,0) if coincident.

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

Unit direction vector, or (0,0) if coincident.

#### See

- [direction](#direction) - Throws on coincident points
- [directionUnchecked](#directionunchecked) - No validation, for hot paths

#### Since

0.15.0

---

### directionUnchecked()

> `static` **directionUnchecked**(`from`, `to`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1224](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1224)

Unit direction without validation (hot path).

#### Parameters

##### from

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start point.

##### to

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End point (must be different from `from`).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Unit direction vector.

#### Remarks

⚠️ **Precondition:** `from ≠ to`.
Calling with identical points produces NaN/Infinity.

#### See

[direction](#direction) - Handles identical points gracefully

#### Since

0.14.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:257](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L257)

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

---

### copy()

> `static` **copy**(`source`, `destination`): `Vector2`

Defined in: [src/core/vector2.ts:271](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L271)

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

---

### fromAngle()

> `static` **fromAngle**(`angle`, `radius`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:291](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L291)

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

Defined in: [src/core/vector2.ts:331](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L331)

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

Defined in: [src/core/vector2.ts:2315](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2315)

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

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:307](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L307)

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

---

### fromValues()

> `static` **fromValues**(`x`, `y`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:243](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L243)

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

### magnitude()

> **magnitude**(): `number`

Defined in: [src/core/vector2.ts:3123](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3123)

Euclidean magnitude (length).

#### Returns

`number`

The Euclidean norm.

#### Since

0.1.0

---

### cross()

> `static` **cross**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1038](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1038)

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

---

### cross3()

> `static` **cross3**(`a`, `b`, `c`): `number`

Defined in: [src/core/vector2.ts:1053](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1053)

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

---

### distance()

> `static` **distance**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1110](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1110)

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

---

### distanceSquared()

> `static` **distanceSquared**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1126](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1126)

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

---

### dot()

> `static` **dot**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1021](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1021)

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

---

### magnitude()

> `static` **magnitude**(`v`): `number`

Defined in: [src/core/vector2.ts:1070](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1070)

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

---

### magnitudeSquared()

> `static` **magnitudeSquared**(`v`): `number`

Defined in: [src/core/vector2.ts:1083](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1083)

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

---

### manhattanDistance()

> `static` **manhattanDistance**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1142](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1142)

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

---

### manhattanLength()

> `static` **manhattanLength**(`v`): `number`

Defined in: [src/core/vector2.ts:1096](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1096)

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

## Initialization

### setFromAngle()

> **setFromAngle**(`angle`, `radius`): `this`

Defined in: [src/core/vector2.ts:2668](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2668)

Sets this vector from polar coordinates.

#### Parameters

##### angle

`number`

Angle in radians (CCW from +X).

##### radius

`number` = `1`

Distance from origin (default 1).

#### Returns

`this`

This for chaining.

#### Since

0.14.0

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/vector2.ts:2682](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2682)

Sets this vector from array values.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array.

##### offset

`number` = `0`

Starting index (default 0).

#### Returns

`this`

This for chaining.

#### Since

0.14.0

---

### setFromComplex()

> **setFromComplex**(`complex`): `this`

Defined in: [src/core/vector2.ts:2694](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2694)

Sets this vector from a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Source complex (real→x, imag→y).

#### Returns

`this`

This for chaining.

#### Since

0.14.0

## Interpolation

### lerp()

> **lerp**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:3704](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3704)

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

---

### lerpClamped()

> **lerpClamped**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:3719](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3719)

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

---

### slerp()

> **slerp**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:3732](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3732)

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

---

### slerpClamped()

> **slerpClamped**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:3746](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3746)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

##### t

`number`

Interpolation factor (clamped to [0, 1]).

#### Returns

`this`

This for chaining.

#### Since

0.9.0

---

### smoothStep()

> **smoothStep**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:3759](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3759)

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

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:860](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L860)

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

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:881](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L881)

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

---

### slerp()

> `static` **slerp**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:914](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L914)

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

#### Example

```typescript
const a = new Vector2(1, 0); // pointing right
const b = new Vector2(0, 1); // pointing up
const mid = Vector2.slerp(a, b, 0.5); // ~(0.707, 0.707) - 45° between
```

#### Since

0.1.0

---

### slerpClamped()

> `static` **slerpClamped**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:966](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L966)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector.

##### t

`number`

Interpolation factor (clamped to [0, 1]).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Interpolated vector.

#### Since

0.9.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:997](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L997)

Smooth Hermite interpolation between two vectors.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Smoothly interpolated vector

#### Remarks

Uses Hermite smoothStep for ease-in-out effect.
Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.

#### Example

```typescript
const a = { x: 0, y: 0 };
const b = { x: 10, y: 10 };
const smooth = Vector2.smoothStep(a, b, 0.5); // Smooth interpolation
```

#### Since

0.11.0

## Numeric Transform

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/vector2.ts:3077](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3077)

Unchecked reciprocal for hot paths.

#### Returns

`this`

This for chaining.

#### Remarks

**⚠️ Precondition:** Both components must be non-zero.
Calling with zero produces Infinity.

#### Since

0.14.0

---

### abs()

> `static` **abs**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:744](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L744)

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

---

### ceil()

> `static` **ceil**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:702](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L702)

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

---

### floor()

> `static` **floor**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:688](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L688)

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

---

### inverse()

> `static` **inverse**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:773](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L773)

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

---

### inverseSafe()

> `static` **inverseSafe**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:790](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L790)

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

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:808](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L808)

Unchecked reciprocal for hot paths.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector (must have non-zero components).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Inverted vector.

#### Remarks

**⚠️ Precondition:** Both components must be non-zero.
Calling with zero produces Infinity.

#### Since

0.14.0

---

### round()

> `static` **round**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:716](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L716)

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

---

### sign()

> `static` **sign**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:758](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L758)

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

---

### step()

> `static` **step**(`edge`, `v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:840](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L840)

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

---

### swap()

> `static` **swap**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:822](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L822)

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

---

### trunc()

> `static` **trunc**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:730](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L730)

Applies Math.trunc to both components (rounds towards zero).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Truncated vector.

#### Since

0.14.0

## Other

### x

> **x**: `number`

Defined in: [src/core/vector2.ts:2513](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2513)

X component.

#### Implementation of

[`Vector2Like`](../../types/interfaces/Vector2Like.md).[`x`](../../types/interfaces/Vector2Like.md#x)

---

### y

> **y**: `number`

Defined in: [src/core/vector2.ts:2516](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2516)

Y component.

#### Implementation of

[`Vector2Like`](../../types/interfaces/Vector2Like.md).[`y`](../../types/interfaces/Vector2Like.md#y)

---

### absolute

#### Get Signature

> **get** **absolute**(): `Vector2`

Defined in: [src/core/vector2.ts:2594](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2594)

Returns an absolute-valued copy.

##### Returns

`Vector2`

New absolute-valued vector.

---

### flippedX

#### Get Signature

> **get** **flippedX**(): `Vector2`

Defined in: [src/core/vector2.ts:3975](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3975)

Returns a copy with x negated.

##### Returns

`Vector2`

New Vector2(-x, y).

---

### flippedY

#### Get Signature

> **get** **flippedY**(): `Vector2`

Defined in: [src/core/vector2.ts:3983](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3983)

Returns a copy with y negated.

##### Returns

`Vector2`

New Vector2(x, -y).

---

### negated

#### Get Signature

> **get** **negated**(): `Vector2`

Defined in: [src/core/vector2.ts:2586](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2586)

Returns a negated copy.

##### Returns

`Vector2`

New negated vector.

---

### normalized

#### Get Signature

> **get** **normalized**(): `Vector2`

Defined in: [src/core/vector2.ts:2573](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2573)

Returns a normalized copy (or zero if this is zero).

##### Returns

`Vector2`

New unit vector.

---

### perpCCW

#### Get Signature

> **get** **perpCCW**(): `Vector2`

Defined in: [src/core/vector2.ts:3967](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3967)

Returns perpendicular vector rotated 90° counter-clockwise.

##### Returns

`Vector2`

New Vector2(-y, x).

---

### perpCW

#### Get Signature

> **get** **perpCW**(): `Vector2`

Defined in: [src/core/vector2.ts:3959](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3959)

Returns perpendicular vector rotated 90° clockwise.

##### Returns

`Vector2`

New Vector2(y, -x).

---

### xx

#### Get Signature

> **get** **xx**(): `Vector2`

Defined in: [src/core/vector2.ts:2622](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2622)

Returns a vector with both components set to x.

##### Returns

`Vector2`

New Vector2(x, x).

---

### xy

#### Get Signature

> **get** **xy**(): `Vector2`

Defined in: [src/core/vector2.ts:2606](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2606)

Returns a copy of this vector (identity swizzle).

##### Returns

`Vector2`

New Vector2(x, y).

---

### yx

#### Get Signature

> **get** **yx**(): `Vector2`

Defined in: [src/core/vector2.ts:2614](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2614)

Returns a copy with swapped components.

##### Returns

`Vector2`

New Vector2(y, x).

---

### yy

#### Get Signature

> **get** **yy**(): `Vector2`

Defined in: [src/core/vector2.ts:2630](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2630)

Returns a vector with both components set to y.

##### Returns

`Vector2`

New Vector2(y, y).

---

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/vector2.ts:3931](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3931)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding x then y.

---

### abs()

> **abs**(): `this`

Defined in: [src/core/vector2.ts:3422](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3422)

Applies Math.abs to both components.

#### Returns

`this`

This for chaining.

---

### addScaledVector()

> **addScaledVector**(`v`, `scale`): `this`

Defined in: [src/core/vector2.ts:3001](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3001)

Adds a scaled vector: this += scale \* v.

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

---

### angle()

> **angle**(): `number`

Defined in: [src/core/vector2.ts:3191](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3191)

Heading angle from +X axis.

#### Returns

`number`

Angle in radians.

---

### angleBetween()

> **angleBetween**(`v`): `number`

Defined in: [src/core/vector2.ts:3209](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3209)

Unsigned angle between this and v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

Unsigned angle in radians.

---

### angleTo()

> **angleTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3200](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3200)

Signed angle to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

Signed angle in radians.

---

### applyMatrix2()

> **applyMatrix2**(`matrix`): `this`

Defined in: [src/core/vector2.ts:4025](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L4025)

Transforms this vector by a 2x2 matrix in place.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix with m00, m01, m10, m11 components.

#### Returns

`this`

This for chaining.

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/vector2.ts:3452](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3452)

Applies Math.ceil to both components.

#### Returns

`this`

This for chaining.

---

### clamp()

> **clamp**(`minV`, `maxV`): `this`

Defined in: [src/core/vector2.ts:3323](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3323)

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

---

### clampMagnitude()

> **clampMagnitude**(`minLength`, `maxLength`): `this`

Defined in: [src/core/vector2.ts:3347](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3347)

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

Defined in: [src/core/vector2.ts:3335](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3335)

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

Defined in: [src/core/vector2.ts:3877](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3877)

Returns a shallow clone.

#### Returns

`Vector2`

New Vector2 with same components.

---

### copy()

> **copy**(`v`): `this`

Defined in: [src/core/vector2.ts:2655](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2655)

Copies from another vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

#### Returns

`this`

This for chaining.

---

### cross()

> **cross**(`v`): `number`

Defined in: [src/core/vector2.ts:3112](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3112)

2D scalar cross product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar cross product.

---

### crossScalarLeft()

> **crossScalarLeft**(`s`): `this`

Defined in: [src/core/vector2.ts:3685](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3685)

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

Defined in: [src/core/vector2.ts:3674](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3674)

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

Defined in: [src/core/vector2.ts:3183](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3183)

Unit direction from this to target.

#### Parameters

##### target

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`Vector2`

New unit direction vector.

---

### distanceSquaredTo()

> **distanceSquaredTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3157](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3157)

Squared distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The squared distance.

---

### distanceTo()

> **distanceTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3148](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3148)

Euclidean distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The Euclidean distance.

---

### dot()

> **dot**(`v`): `number`

Defined in: [src/core/vector2.ts:3103](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3103)

Dot product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand.

#### Returns

`number`

Scalar dot product.

---

### floor()

> **floor**(): `this`

Defined in: [src/core/vector2.ts:3442](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3442)

Applies Math.floor to both components.

#### Returns

`this`

This for chaining.

---

### fma()

> **fma**(`scale`, `v`): `this`

Defined in: [src/core/vector2.ts:3013](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3013)

Fused multiply-add: this = this \* scale + v.

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

---

### getComponent()

> **getComponent**(`index`): `number`

Defined in: [src/core/vector2.ts:2740](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2740)

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

Defined in: [src/core/vector2.ts:3845](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3845)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN.

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/vector2.ts:3046](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3046)

Component-wise reciprocal.

#### Returns

`this`

This for chaining.

#### Throws

If any component is zero.

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/vector2.ts:3059](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3059)

Safe reciprocal. Components near zero become 0.

#### Returns

`this`

This for chaining.

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/vector2.ts:3837](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3837)

Tests if both components are finite.

#### Returns

`boolean`

True if finite.

---

### isParallelTo()

> **isParallelTo**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:3855](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3855)

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

---

### isPerpendicularTo()

> **isPerpendicularTo**(`v`, `epsilon`): `boolean`

Defined in: [src/core/vector2.ts:3865](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3865)

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

---

### isUnit()

> **isUnit**(): `boolean`

Defined in: [src/core/vector2.ts:3829](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3829)

Tests if unit length.

#### Returns

`boolean`

True if |length - 1| ≤ EPSILON.

---

### limit()

> **limit**(`maxLength`): `this`

Defined in: [src/core/vector2.ts:3359](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3359)

Limits length to maximum.

#### Parameters

##### maxLength

`number`

Maximum allowed magnitude.

#### Returns

`this`

This for chaining.

---

### magnitudeSquared()

> **magnitudeSquared**(): `number`

Defined in: [src/core/vector2.ts:3131](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3131)

Squared length.

#### Returns

`number`

The squared length.

---

### manhattanDistanceTo()

> **manhattanDistanceTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3166](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3166)

Manhattan (L1) distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector.

#### Returns

`number`

The Manhattan distance.

---

### manhattanLength()

> **manhattanLength**(): `number`

Defined in: [src/core/vector2.ts:3139](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3139)

Manhattan length.

#### Returns

`number`

The Manhattan norm.

---

### max()

> **max**(`v`): `this`

Defined in: [src/core/vector2.ts:3384](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3384)

Component-wise maximum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Other vector.

#### Returns

`this`

This for chaining.

---

### min()

> **min**(`v`): `this`

Defined in: [src/core/vector2.ts:3373](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3373)

Component-wise minimum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Other vector.

#### Returns

`this`

This for chaining.

---

### mod()

> **mod**(`v`): `this`

Defined in: [src/core/vector2.ts:3024](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3024)

Component-wise modulo.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector.

#### Returns

`this`

This for chaining.

---

### modScalar()

> **modScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3035](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3035)

Scalar modulo on both components.

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

This for chaining.

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/vector2.ts:3222](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3222)

Normalizes to unit length.

#### Returns

`this`

This for chaining.

#### Throws

If zero length.

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/vector2.ts:3234](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3234)

Safe normalization. Sets to (0, 0) if zero length.

#### Returns

`this`

This for chaining.

---

### perpendicular()

> **perpendicular**(`clockwise`): `this`

Defined in: [src/core/vector2.ts:3534](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3534)

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

Defined in: [src/core/vector2.ts:3483](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3483)

Projects onto axis.

#### Parameters

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis.

#### Returns

`this`

This for chaining.

---

### projectOnUnit()

> **projectOnUnit**(`unitAxis`): `this`

Defined in: [src/core/vector2.ts:3497](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3497)

Projects onto unit axis.

#### Parameters

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis.

#### Returns

`this`

This for chaining.

---

### reflect()

> **reflect**(`unitNormal`): `this`

Defined in: [src/core/vector2.ts:3507](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3507)

Reflects about unit normal.

#### Parameters

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal.

#### Returns

`this`

This for chaining.

---

### reflectSafe()

> **reflectSafe**(`normal`): `this`

Defined in: [src/core/vector2.ts:3517](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3517)

Safe reflection.

#### Parameters

##### normal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Normal (need not be unit).

#### Returns

`this`

This for chaining.

---

### reject()

> **reject**(`onto`): `this`

Defined in: [src/core/vector2.ts:3643](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3643)

Vector rejection: removes projection onto axis.

#### Parameters

##### onto

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis to reject from.

#### Returns

`this`

This for chaining.

---

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/vector2.ts:3596](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3596)

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

Defined in: [src/core/vector2.ts:3619](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3619)

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

---

### rotateAroundCS()

> **rotateAroundCS**(`center`, `c`, `s`): `this`

Defined in: [src/core/vector2.ts:3630](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3630)

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

---

### rotateCS()

> **rotateCS**(`c`, `s`): `this`

Defined in: [src/core/vector2.ts:3607](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3607)

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

Defined in: [src/core/vector2.ts:3462](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3462)

Applies Math.round to both components.

#### Returns

`this`

This for chaining.

---

### set()

> **set**(`x`, `y`): `this`

Defined in: [src/core/vector2.ts:2644](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2644)

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

### setAngle()

> **setAngle**(`angle`): `this`

Defined in: [src/core/vector2.ts:3311](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3311)

Sets angle (direction) while preserving length.

#### Parameters

##### angle

`number`

New heading in radians.

#### Returns

`this`

This for chaining.

---

### setComponent()

> **setComponent**(`index`, `value`): `this`

Defined in: [src/core/vector2.ts:2750](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2750)

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

### setMagnitude()

> **setMagnitude**(`newMagnitude`): `this`

Defined in: [src/core/vector2.ts:3281](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3281)

Sets the length.

#### Parameters

##### newMagnitude

`number`

Desired magnitude.

#### Returns

`this`

This for chaining.

#### Throws

If zero length or negative.

---

### setMagnitudeSafe()

> **setMagnitudeSafe**(`newMagnitude`): `this`

Defined in: [src/core/vector2.ts:3297](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3297)

Safe setMagnitude. Zero vectors become (newMagnitude, 0).

#### Parameters

##### newMagnitude

`number`

Desired magnitude.

#### Returns

`this`

This for chaining.

---

### setScalar()

> **setScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2711](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2711)

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

Defined in: [src/core/vector2.ts:2720](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2720)

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

Defined in: [src/core/vector2.ts:2730](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2730)

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

Defined in: [src/core/vector2.ts:3432](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3432)

Component-wise sign.

#### Returns

`this`

This for chaining.

---

### step()

> **step**(`edge`): `this`

Defined in: [src/core/vector2.ts:3996](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3996)

Applies step function: sets components to 0 where < edge, else 1.

#### Parameters

##### edge

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Threshold vector.

#### Returns

`this`

This for chaining.

---

### sumComponents()

> **sumComponents**(): `number`

Defined in: [src/core/vector2.ts:3174](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3174)

Returns the sum of components x + y.

#### Returns

`number`

Scalar sum.

---

### swap()

> **swap**(): `this`

Defined in: [src/core/vector2.ts:3087](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3087)

Swaps x and y components.

#### Returns

`this`

This for chaining.

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): \[`number`, `number`\] \| `T`

Defined in: [src/core/vector2.ts:3887](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3887)

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

### toJSON()

> **toJSON**(): `object`

Defined in: [src/core/vector2.ts:3911](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3911)

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

Defined in: [src/core/vector2.ts:3903](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3903)

Returns plain object { x, y }.

#### Returns

`object`

Object with x and y properties.

##### x

> **x**: `number`

##### y

> **y**: `number`

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/vector2.ts:3472](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3472)

Applies Math.trunc to both components (rounds towards zero).

#### Returns

`this`

This for chaining.

---

### zero()

> **zero**(): `this`

Defined in: [src/core/vector2.ts:2702](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2702)

Resets both components to zero.

#### Returns

`this`

This for chaining.

## Transform

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/vector2.ts:3267](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3267)

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
if (v.magnitudeSquared() > 0) {
 v.normalizeUnchecked();
}
```

#### Since

0.14.0

---

### rejectOnUnit()

> **rejectOnUnit**(`unitAxis`): `this`

Defined in: [src/core/vector2.ts:3664](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3664)

Rejection onto a unit axis (hot path).

#### Parameters

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis.

#### Returns

`this`

This for chaining.

#### Remarks

Use when you know the axis is already normalized.

#### Since

0.14.0

---

### unitPerpendicular()

> **unitPerpendicular**(`clockwise`): `this`

Defined in: [src/core/vector2.ts:3555](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3555)

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

Defined in: [src/core/vector2.ts:3569](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3569)

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

### unitPerpendicularUnchecked()

> **unitPerpendicularUnchecked**(`clockwise`): `this`

Defined in: [src/core/vector2.ts:3586](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L3586)

Unit perpendicular without validation (hot path).

#### Parameters

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

#### Returns

`this`

This for chaining.

#### Remarks

⚠️ **Precondition:** This vector must have non-zero magnitude.

#### Since

0.14.0

---

### crossScalarLeft()

> `static` **crossScalarLeft**(`s`, `v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2169](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2169)

Box2D-style cross: scalar × vector = (-s*y, s*x).
Scalar is on the LEFT side of the cross product.

#### Parameters

##### s

`number`

Scalar factor (on left).

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Perpendicular scaled vector (CCW rotation).

#### See

[crossScalarRight](#crossscalarright-2) - For scalar on right side

#### Example

```typescript
const v = new Vector2(1, 0);
const perp = Vector2.crossScalarLeft(1, v); // (0, 1) - CCW perpendicular
```

#### Since

0.8.0

---

### crossScalarRight()

> `static` **crossScalarRight**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2145](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2145)

Box2D-style cross: vector × scalar = (s*y, -s*x).
Scalar is on the RIGHT side of the cross product.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### s

`number`

Scalar factor (on right).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Perpendicular scaled vector (CW rotation).

#### See

[crossScalarLeft](#crossscalarleft-2) - For scalar on left side

#### Since

0.8.0

---

### getLengthAndNormalize()

> `static` **getLengthAndNormalize**(`v`, `out?`): `object`

Defined in: [src/core/vector2.ts:1528](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1528)

Computes length and unit vector in a single operation.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to process.

##### out?

`Vector2`

Optional output vector for the unit vector.

#### Returns

`object`

Object with length and unit vector.

##### length

> **length**: `number`

##### unit

> **unit**: `Vector2`

#### Remarks

More efficient than calling length() and normalize() separately
when both values are needed, as it avoids computing sqrt twice.

#### Since

0.14.0

---

### normalize()

> `static` **normalize**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1462](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1462)

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

---

### normalizeSafe()

> `static` **normalizeSafe**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1481](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1481)

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

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1508](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1508)

Normalizes a vector without validation (for hot paths).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to normalize (must have non-zero length).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Normalized vector.

#### Remarks

**WARNING:** This method performs no validation.

- If v is zero, the result will be (NaN, NaN).
- Use only when you can guarantee the vector has non-zero length.

#### See

- [normalize](#normalize-2) - Throws on zero-length vectors
- [normalizeSafe](#normalizesafe-2) - Returns (0,0) on zero-length vectors

#### Since

0.14.0

---

### perpendicular()

> `static` **perpendicular**(`v`, `clockwise`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1968](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1968)

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

---

### project()

> `static` **project**(`v`, `axis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1661](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1661)

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

#### Throws

If axis has zero length.

#### Remarks

Mathematically equivalent to `axis * (dot(v, axis) / magnitudeSquared(axis))`.

#### Example

```typescript
const v = new Vector2(3, 4);
const axis = new Vector2(1, 0);
const proj = Vector2.project(v, axis); // (3, 0) - projection onto X axis
```

#### See

- [projectSafe](#projectsafe) - Returns (0,0) instead of throwing
- [projectUnchecked](#projectunchecked) - No validation, for hot paths
- [projectOnUnit](#projectonunit-2) - Optimized for unit vectors

#### Since

0.8.0

---

### projectOnUnit()

> `static` **projectOnUnit**(`v`, `unitAxis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1737](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1737)

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

---

### projectSafe()

> `static` **projectSafe**(`v`, `axis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1685](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1685)

Projects v onto axis, returning (0,0) if axis has zero length.

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

Projection of v onto axis, or (0,0) if axis is zero.

#### See

- [project](#project-2) - Throws on zero axis
- [projectUnchecked](#projectunchecked) - No validation, for hot paths
- [projectOnUnit](#projectonunit-2) - Optimized for unit vectors

#### Since

0.15.0

---

### projectUnchecked()

> `static` **projectUnchecked**(`v`, `axis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1716](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1716)

Projects v onto axis without validation (hot path).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to project.

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis (must have non-zero length).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Projection of v onto axis.

#### Remarks

**⚠️ Precondition:** `axis` must have non-zero length.
If axis is zero, result will be (NaN, NaN).

#### See

- [project](#project-2) - Safe version with zero check
- [projectOnUnit](#projectonunit-2) - Optimized for unit vectors

#### Since

0.15.0

---

### reflect()

> `static` **reflect**(`v`, `unitNormal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1883](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1883)

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

#### Example

```typescript
const v = new Vector2(1, -1); // incoming at 45°
const normal = new Vector2(0, 1); // horizontal surface
const r = Vector2.reflect(v, normal); // (1, 1) - bounces off
```

#### See

- [reflectSafe](#reflectsafe-2) - Normalizes normal first
- [reflectUnchecked](#reflectunchecked) - No validation, for hot paths

#### Since

0.8.0

---

### reflectSafe()

> `static` **reflectSafe**(`v`, `normal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1910](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1910)

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

#### See

- [reflect](#reflect-2) - Throws if normal is not unit
- [reflectUnchecked](#reflectunchecked) - No validation, for hot paths

#### Since

0.8.0

---

### reflectUnchecked()

> `static` **reflectUnchecked**(`v`, `unitNormal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1944](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1944)

Reflection without validation (hot path).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Incident vector.

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal (must be unit).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Reflected vector.

#### Remarks

**⚠️ Precondition:** `unitNormal` must have unit length.
If not unit, result will be incorrect but not NaN.

#### See

- [reflect](#reflect-2) - Throws if normal is not unit
- [reflectSafe](#reflectsafe-2) - Normalizes normal first

#### Since

0.15.0

---

### reject()

> `static` **reject**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1772](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1772)

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

#### Throws

If b has zero length.

#### Remarks

`reject(a, b) = a - project(a, b)`

#### Example

```typescript
const v = new Vector2(3, 4);
const axis = new Vector2(1, 0);
const rej = Vector2.reject(v, axis); // (0, 4) - the perpendicular component
```

#### See

- [rejectSafe](#rejectsafe) - Returns copy of a instead of throwing
- [rejectUnchecked](#rejectunchecked) - No validation, for hot paths
- [rejectOnUnit](#rejectonunit-2) - Optimized for unit vectors

#### Since

0.8.0

---

### rejectOnUnit()

> `static` **rejectOnUnit**(`a`, `unitAxis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1848](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1848)

Vector rejection onto a unit axis (optimized hot path).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to decompose.

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rejection of a from unitAxis.

#### Remarks

`rejectOnUnit(a, unitAxis) = a - projectOnUnit(a, unitAxis)`
Use when you know the axis is already normalized.

#### Since

0.14.0

---

### rejectSafe()

> `static` **rejectSafe**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1796](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1796)

Vector rejection, returning copy of a if b has zero length.

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

Rejection of a from b, or copy of a if b is zero.

#### See

- [reject](#reject-2) - Throws on zero b
- [rejectUnchecked](#rejectunchecked) - No validation, for hot paths
- [rejectOnUnit](#rejectonunit-2) - Optimized for unit vectors

#### Since

0.15.0

---

### rejectUnchecked()

> `static` **rejectUnchecked**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1823](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1823)

Vector rejection without validation (hot path).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to decompose.

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis of projection (must have non-zero length).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rejection of a from b.

#### Remarks

**⚠️ Precondition:** `b` must have non-zero length.
If b is zero, result will be (NaN, NaN).

#### See

- [reject](#reject-2) - Safe version with zero check
- [rejectOnUnit](#rejectonunit-2) - Optimized for unit vectors

#### Since

0.15.0

---

### rotate()

> `static` **rotate**(`v`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2051](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2051)

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

---

### rotateAround()

> `static` **rotateAround**(`v`, `center`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2091](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2091)

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

#### Example

```typescript
const point = new Vector2(2, 0);
const center = new Vector2(1, 0);
const rotated = Vector2.rotateAround(point, center, Math.PI); // (0, 0)
```

#### Since

0.8.0

---

### rotateAroundCS()

> `static` **rotateAroundCS**(`v`, `center`, `c`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2119](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2119)

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

---

### rotateCS()

> `static` **rotateCS**(`v`, `c`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2068](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2068)

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

---

### setAngle()

> `static` **setAngle**(`v`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1629](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1629)

Returns vector with same magnitude but new angle.

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

Vector with new angle.

#### Since

0.8.0

---

### setMagnitude()

> `static` **setMagnitude**(`v`, `newMagnitude`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1553](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1553)

Returns a copy of v with the requested length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### newMagnitude

`number`

Desired magnitude.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with specified length.

#### Throws

If newMagnitude < 0 or v has zero length.

#### Since

0.8.0

---

### setMagnitudeSafe()

> `static` **setMagnitudeSafe**(`v`, `newMagnitude`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1576](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1576)

Safe setMagnitude. Zero vectors become (newMagnitude, 0).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

##### newMagnitude

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

### setMagnitudeUnchecked()

> `static` **setMagnitudeUnchecked**(`v`, `newMagnitude`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1608](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1608)

Sets length without validation (hot path).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector (must have non-zero length).

##### newMagnitude

`number`

Desired magnitude (must be non-negative).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Vector with specified length.

#### Remarks

⚠️ **Preconditions:** `v` must have non-zero length, `newMagnitude >= 0`.
Calling with zero-length vector produces NaN/Infinity.

#### See

- [setMagnitude](#setmagnitude-2) - Throws on invalid input
- [setMagnitudeSafe](#setmagnitudesafe-2) - Handles edge cases gracefully

#### Since

0.14.0

---

### unitPerpendicular()

> `static` **unitPerpendicular**(`v`, `clockwise`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1984](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L1984)

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

---

### unitPerpendicularSafe()

> `static` **unitPerpendicularSafe**(`v`, `clockwise`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2004](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2004)

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

---

### unitPerpendicularUnchecked()

> `static` **unitPerpendicularUnchecked**(`v`, `clockwise`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2031](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2031)

Unit perpendicular without validation (hot path).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector (must have non-zero magnitude).

##### clockwise

`boolean` = `false`

CW if true, CCW if false.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Unit perpendicular vector.

#### Remarks

⚠️ **Precondition:** `v` must have non-zero magnitude.
Calling with zero vector produces NaN/Infinity.

#### See

- [unitPerpendicular](#unitperpendicular-2) - Throws on zero
- [unitPerpendicularSafe](#unitperpendicularsafe-2) - Returns zero

#### Since

0.14.0

## Transform Integration

### applyComplex()

> **applyComplex**(`complex`): `this`

Defined in: [src/core/vector2.ts:4092](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L4092)

Applies a complex number as a rotation to this vector in place.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number (will be normalized first).

#### Returns

`this`

This for chaining.

#### Remarks

The complex number is normalized before applying to ensure
a pure rotation without scaling.

#### Example

```typescript
const c = { real: Math.SQRT1_2, imag: Math.SQRT1_2 }; // 45° rotation
const v = new Vector2(1, 0);
v.applyComplex(c); // v ≈ (0.707, 0.707)
```

#### Since

0.11.0

---

### applyMatrix3()

> **applyMatrix3**(`matrix`): `this`

Defined in: [src/core/vector2.ts:4043](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L4043)

Transforms this vector by a 3x3 matrix in place (includes translation and perspective).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

3x3 transformation matrix.

#### Returns

`this`

This for chaining.

#### Remarks

Treats this vector as a point (applies translation).
For projective matrices, divides by the homogeneous coordinate w.

#### Since

0.12.0

---

### applyRotation2()

> **applyRotation2**(`rotation`): `this`

Defined in: [src/core/vector2.ts:4014](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L4014)

Applies a Rotation2 (unit complex) to this vector in place.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation2 with cos and sin components.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

---

### applyTransform2()

> **applyTransform2**(`transform`): `this`

Defined in: [src/core/vector2.ts:4064](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L4064)

Applies a full 2D transform (scale → rotate → translate) in place.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform2 with position, rotation, and scale.

#### Returns

`this`

This for chaining.

#### Since

0.9.0

---

### applyComplex()

> `static` **applyComplex**(`v`, `complex`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2345](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2345)

Applies a complex number as a rotation to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number (will be normalized first).

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Rotated vector.

#### Remarks

The complex number is normalized before applying to ensure
a pure rotation without scaling. For unit complex numbers,
this is equivalent to complex multiplication.

Mathematically equivalent to treating the vector as a complex number
and multiplying: (v.x + i*v.y) * (c.real + i\*c.imag) / |c|

#### Example

```typescript
const c = { real: Math.SQRT1_2, imag: Math.SQRT1_2 }; // 45° rotation
const v = { x: 1, y: 0 };
const rotated = Vector2.applyComplex(v, c); // ≈ (0.707, 0.707)
```

#### Since

0.11.0

---

### applyMatrix2()

> `static` **applyMatrix2**(`v`, `matrix`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2215](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2215)

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

---

### applyMatrix3()

> `static` **applyMatrix3**(`v`, `matrix`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2255](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2255)

Transforms a vector by a 3x3 matrix (includes translation and perspective).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform (treated as a point).

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

3x3 transformation matrix.

##### out?

`Vector2`

Optional output vector.

#### Returns

`Vector2`

Transformed vector.

#### Remarks

For affine matrices (m02=0, m12=0, m22=1), computes:
`[m00*x + m10*y + m20, m01*x + m11*y + m21]`

For projective matrices, divides by the homogeneous coordinate w.

This treats the vector as a point (applies translation).
For direction vectors (no translation), use Matrix3.transformVector.

Uses interface for loose coupling to avoid circular dependencies.

#### Example

```typescript
const m = { m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 10, m21: 20, m22: 1 };
const v = { x: 1, y: 2 };
const result = Vector2.applyMatrix3(v, m); // (11, 22)
```

#### Since

0.12.0

---

### applyRotation2()

> `static` **applyRotation2**(`v`, `rotation`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2192](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2192)

Applies a Rotation2 (unit complex) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation2 with cos and sin components.

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

---

### applyTransform2()

> `static` **applyTransform2**(`v`, `transform`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2288](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/vector2.ts#L2288)

Applies a full 2D transform (scale → rotate → translate) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform.

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform2 with position, rotation (angle), and scale.

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
