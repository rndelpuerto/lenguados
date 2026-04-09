# Class: Vector2

Defined in: [src/core/vector2.ts:119](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L119)

Mutable, chainable two-dimensional vector with comprehensive operations for
arithmetic, geometry, transforms, comparisons and conversions.

## Remarks

- **Design:** Instance methods are mutable and chainable; static methods are pure
  with alloc-free overloads via `out` parameter.
- **Numerics:** Uses deterministic kernels for cross-platform reproducibility.
- **Safety:** "Safe" variants avoid throwing on degeneracies.

## Example

```typescript
// Static (pure, allocation-controlled)
const sum = Vector2.add(a, b);
Vector2.add(a, b, existingVector); // Reuse allocation

// Instance (mutable, chainable)
velocity.add(acceleration).multiplyScalar(dt);
```

## Since

0.6.0

## Implements

- [`Vector2Like`](../../types/interfaces/Vector2Like.md)

## Constructors

### Constructor

> **new Vector2**(): `Vector2`

Defined in: [src/core/vector2.ts:2658](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2658)

Creates a zero vector `(0, 0)`.

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`x`, `y`): `Vector2`

Defined in: [src/core/vector2.ts:2660](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2660)

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

Defined in: [src/core/vector2.ts:2662](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2662)

Creates a vector from a tuple `[x, y]`.

#### Parameters

##### array

\[`number`, `number`\]

#### Returns

`Vector2`

### Constructor

> **new Vector2**(`object`): `Vector2`

Defined in: [src/core/vector2.ts:2664](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2664)

Creates a vector from a plain object `{ x, y }`.

#### Parameters

##### object

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`Vector2`

## Accessor

### absolute

#### Get Signature

> **get** **absolute**(): `Vector2`

Defined in: [src/core/vector2.ts:2738](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2738)

Returns an absolute-valued copy.

##### Since

0.6.0

##### Returns

`Vector2`

New absolute-valued vector

---

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [src/core/vector2.ts:3491](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3491)

Heading angle from +X axis.

##### Since

0.6.0

##### Returns

`number`

Angle in radians from +X axis

#### Set Signature

> **set** **angle**(`radians`): `void`

Defined in: [src/core/vector2.ts:3502](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3502)

Sets the direction angle while preserving magnitude.

##### Since

0.6.0

##### Parameters

###### radians

`number`

Angle in radians (CCW positive)

##### Returns

`void`

---

### flippedX

#### Get Signature

> **get** **flippedX**(): `Vector2`

Defined in: [src/core/vector2.ts:4471](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4471)

Returns a copy with x negated.

##### Since

0.6.0

##### Returns

`Vector2`

New Vector2(-x, y)

---

### flippedY

#### Get Signature

> **get** **flippedY**(): `Vector2`

Defined in: [src/core/vector2.ts:4481](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4481)

Returns a copy with y negated.

##### Since

0.6.0

##### Returns

`Vector2`

New Vector2(x, -y)

---

### inverted

#### Get Signature

> **get** **inverted**(): `Vector2`

Defined in: [src/core/vector2.ts:2754](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2754)

Returns a component-wise inverted copy (1/x, 1/y).

##### Remarks

A zero component produces ±Infinity (IEEE 754: 1/0 = Infinity).
Use [inverse](#inverse-1) or [inverseSafe](#inversesafe-1) for validated alternatives
that guard against near-zero divisors.

##### Since

0.6.0

##### Returns

`Vector2`

New inverted vector

---

### negated

#### Get Signature

> **get** **negated**(): `Vector2`

Defined in: [src/core/vector2.ts:2728](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2728)

Returns a negated copy.

##### Since

0.6.0

##### Returns

`Vector2`

New negated vector

---

### normalized

#### Get Signature

> **get** **normalized**(): `Vector2`

Defined in: [src/core/vector2.ts:2713](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2713)

Returns a normalized copy (or zero if this is zero).

##### Since

0.6.0

##### Returns

`Vector2`

New unit vector

---

### xx

#### Get Signature

> **get** **xx**(): `Vector2`

Defined in: [src/core/vector2.ts:2788](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2788)

Returns a vector with both components set to x.

##### Since

0.6.0

##### Returns

`Vector2`

New Vector2(x, x)

---

### xy

#### Get Signature

> **get** **xy**(): `Vector2`

Defined in: [src/core/vector2.ts:2768](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2768)

Returns a copy of this vector (identity swizzle).

##### Since

0.6.0

##### Returns

`Vector2`

New Vector2(x, y)

---

### yx

#### Get Signature

> **get** **yx**(): `Vector2`

Defined in: [src/core/vector2.ts:2778](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2778)

Returns a copy with swapped components.

##### Since

0.6.0

##### Returns

`Vector2`

New Vector2(y, x)

---

### yy

#### Get Signature

> **get** **yy**(): `Vector2`

Defined in: [src/core/vector2.ts:2798](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2798)

Returns a vector with both components set to y.

##### Since

0.6.0

##### Returns

`Vector2`

New Vector2(y, y)

---

### getComponent()

> **getComponent**(`index`): `number`

Defined in: [src/core/vector2.ts:2927](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2927)

Returns a component by index.

#### Parameters

##### index

`0` \| `1`

0 for x, 1 for y

#### Returns

`number`

The component value

#### Since

0.6.0

## Arithmetic

### add()

> **add**(`v`): `this`

Defined in: [src/core/vector2.ts:2961](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2961)

Adds v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to add

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### addScalar()

> **addScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2976](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2976)

Adds scalar to both components.

#### Parameters

##### s

`number`

Scalar to add

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### addScaledVector()

> **addScaledVector**(`v`, `scale`): `this`

Defined in: [src/core/vector2.ts:3197](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3197)

Adds a scaled vector: this += scale \* v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to scale and add

##### scale

`number`

Scale factor

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### divide()

> **divide**(`v`): `this`

Defined in: [src/core/vector2.ts:3055](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3055)

Divides by v component-wise (strict).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector

#### Returns

`this`

This for chaining

#### Throws

If any component of v is near zero

#### See

- [divideSafe](../../auxiliary/numeric/functions/divideSafe.md) - Sets to 0 per component instead of throwing
- [divideUnchecked](#divideunchecked-1) - No validation

#### Since

0.6.0

---

### divideSafe()

> **divideSafe**(`v`): `this`

Defined in: [src/core/vector2.ts:3075](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3075)

Divides by v component-wise (safe).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector

#### Returns

`this`

This for chaining (0 if divisor near zero)

#### See

[divide](#divide-1) - Throws on near-zero component

#### Since

0.6.0

---

### divideScalar()

> **divideScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3119](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3119)

Divides by scalar (strict).

#### Parameters

##### s

`number`

Scalar divisor

#### Returns

`this`

This for chaining

#### Remarks

For safe division that returns zeros, use [divideScalarSafe](#dividescalarsafe-1).
For hot paths, use [divideScalarUnchecked](#dividescalarunchecked-1).

#### Throws

If scalar is near zero

#### See

- [divideScalarSafe](#dividescalarsafe-1) - Returns zero vector on near-zero divisor
- [divideScalarUnchecked](#dividescalarunchecked-1) - No validation

#### Since

0.6.0

---

### divideScalarSafe()

> **divideScalarSafe**(`s`): `this`

Defined in: [src/core/vector2.ts:3139](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3139)

Safe scalar division. If |s| ≤ EPSILON, sets to (0, 0).

#### Parameters

##### s

`number`

Scalar divisor

#### Returns

`this`

This for chaining

#### See

[divideScalar](#dividescalar-1) - Throws for zero divisor

#### Since

0.6.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`s`): `this`

Defined in: [src/core/vector2.ts:3168](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3168)

Unchecked scalar division for hot paths.

#### Parameters

##### s

`number`

Scalar divisor (must be non-zero)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Scalar must be non-zero.
Calling with zero scalar produces Infinity/NaN components.

Use only when you can guarantee valid input (e.g., after explicit check).
For safe division, use [divideScalarSafe](#dividescalarsafe-1).

#### See

- [divideScalar](#dividescalar-1) - Throws for zero divisor
- [divideScalarSafe](#dividescalarsafe-1) - Returns zero vector for zero divisor

#### Since

0.7.0

---

### divideUnchecked()

> **divideUnchecked**(`v`): `this`

Defined in: [src/core/vector2.ts:3096](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3096)

Divides by v component-wise (unchecked).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector (must have non-zero components)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `v.x ≠ 0` and `v.y ≠ 0`.

#### See

- [divide](#divide-1) - Throws on near-zero component
- [divideSafe](../../auxiliary/numeric/functions/divideSafe.md) - Returns 0 per component on near-zero divisor

#### Since

0.7.0

---

### fma()

> **fma**(`scalar`, `v`): `this`

Defined in: [src/core/vector2.ts:3211](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3211)

Fused multiply-add: this = this \* scalar + v.

#### Parameters

##### scalar

`number`

Scalar multiplier

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### mod()

> **mod**(`v`): `this`

Defined in: [src/core/vector2.ts:3224](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3224)

Component-wise modulo.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### modScalar()

> **modScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3237](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3237)

Scalar modulo on both components.

#### Parameters

##### s

`number`

Scalar divisor

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### multiply()

> **multiply**(`v`): `this`

Defined in: [src/core/vector2.ts:3021](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3021)

Multiplies by v component-wise (Hadamard product).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector multiplier

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### multiplyScalar()

> **multiplyScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3036](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3036)

Multiplies all components by a scalar.

#### Parameters

##### s

`number`

Scalar multiplier

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/vector2.ts:3183](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3183)

Negates both components.

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### subtract()

> **subtract**(`v`): `this`

Defined in: [src/core/vector2.ts:2991](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2991)

Subtracts v component-wise.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to subtract

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### subtractScalar()

> **subtractScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3006](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3006)

Subtracts scalar from both components.

#### Parameters

##### s

`number`

Scalar to subtract

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### sumComponents()

> **sumComponents**(): `number`

Defined in: [src/core/vector2.ts:3436](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3436)

Returns the sum of components x + y.

#### Returns

`number`

Scalar sum

#### Remarks

A fundamental scalar reduction used as a building block for Manhattan norms,
barycentric coordinate validation, diagonal matrix traces, and divergence
approximations. Retained as a core primitive for downstream consumers.

#### Since

0.6.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:411](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L411)

Component-wise addition `a + b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First addend

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second addend

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(a.x + b.x, a.y + b.y)`

#### Since

0.6.0

---

### addScalar()

> `static` **addScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:426](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L426)

Adds a scalar to both components `v + s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### s

`number`

Scalar addend

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(v.x + s, v.y + s)`

#### Since

0.6.0

---

### addScaledVector()

> `static` **addScaledVector**(`base`, `scaled`, `scale`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:659](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L659)

Adds a scaled vector: `base + scale * scaled`.

#### Parameters

##### base

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Base vector

##### scaled

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to scale and add

##### scale

`number`

Scale factor

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `base + scaled * scale`

#### Remarks

Common in physics for velocity integration: `v = v + a * dt`

#### Example

```typescript
velocity = Vector2.addScaledVector(velocity, acceleration, dt);
```

#### Since

0.6.0

---

### divide()

> `static` **divide**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:505](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L505)

Component-wise division `a / b` (strict).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Numerator vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(a.x / b.x, a.y / b.y)`

#### Throws

If any component of b is near zero

#### See

- [divideSafe](../../auxiliary/numeric/functions/divideSafe.md) - Returns 0 per component instead of throwing
- [divideUnchecked](#divideunchecked-1) - No validation, for hot paths

#### Since

0.6.0

---

### divideSafe()

> `static` **divideSafe**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:525](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L525)

Component-wise division `a / b` (safe).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Numerator vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with safe division per component (0 if divisor near zero)

#### See

[divide](#divide-1) - Throws on near-zero component

#### Since

0.6.0

---

### divideScalar()

> `static` **divideScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:573](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L573)

Scalar division `v / s` (strict).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to divide

##### s

`number`

Scalar divisor

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(v.x / s, v.y / s)`

#### Remarks

For safe division that returns zeros instead of throwing, use [divideScalarSafe](#dividescalarsafe-1).
For hot paths where you've already validated the input, use [divideScalarUnchecked](#dividescalarunchecked-1).

#### Throws

If scalar is near zero

#### See

- [divideScalarSafe](#dividescalarsafe-1) - Returns zero vector on near-zero divisor
- [divideScalarUnchecked](#dividescalarunchecked-1) - No validation

#### Since

0.6.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:594](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L594)

Scalar division `v / s` (safe).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to divide

##### s

`number`

Scalar divisor (if near zero, returns (0, 0))

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(v.x / s, v.y / s)` or (0, 0) if s is near zero

#### See

[divideScalar](#dividescalar-1) - Throws for zero divisor

#### Since

0.6.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:620](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L620)

Scalar division `v / s` (unchecked for hot paths).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to divide

##### s

`number`

Scalar divisor (must be non-zero)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(v.x / s, v.y / s)`

#### Remarks

**Precondition:** Scalar must be non-zero.
Calling with zero scalar produces Infinity/NaN components.

#### See

- [divideScalar](#dividescalar-1) - Throws for zero divisor
- [divideScalarSafe](#dividescalarsafe-1) - Returns zero vector for zero divisor

#### Since

0.7.0

---

### divideUnchecked()

> `static` **divideUnchecked**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:546](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L546)

Component-wise division `a / b` (unchecked for hot paths).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Numerator vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector (must have non-zero components)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(a.x / b.x, a.y / b.y)`

#### Remarks

**Precondition:** `b.x ≠ 0` and `b.y ≠ 0`. Calling with zero produces Infinity/NaN.

#### See

- [divide](#divide-1) - Throws on near-zero component
- [divideSafe](../../auxiliary/numeric/functions/divideSafe.md) - Returns 0 per component on near-zero divisor

#### Since

0.7.0

---

### fma()

> `static` **fma**(`a`, `scalar`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:683](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L683)

Fused multiply-add: `a * scale + b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Input vector

##### scalar

`number`

Scalar multiplier

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to add

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `a * scalar + b`

#### Remarks

More efficient than separate multiply and add operations.

#### Since

0.7.0

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:707](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L707)

Component-wise modulo operation `a % b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Dividend vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Divisor vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with positive modulo per component

#### Remarks

Uses the positive modulo operation from auxiliary module,
which handles negative values correctly (always returns positive).

#### Since

0.6.0

---

### modScalar()

> `static` **modScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:722](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L722)

Scalar modulo operation `v % s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector dividend

##### s

`number`

Scalar divisor

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with modulo applied to both components

#### Since

0.6.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:471](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L471)

Component-wise multiplication `a * b` (Hadamard product).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First factor

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second factor

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(a.x * b.x, a.y * b.y)`

#### Since

0.6.0

---

### multiplyScalar()

> `static` **multiplyScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:486](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L486)

Multiplies all vector components by a scalar `v * s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Input vector

##### s

`number`

Scalar multiplier

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(v.x * s, v.y * s)`

#### Since

0.6.0

---

### negate()

> `static` **negate**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:635](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L635)

Unary negation `(-x, -y)`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Negated vector

#### Since

0.6.0

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:441](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L441)

Component-wise subtraction `a - b`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Minuend

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Subtrahend

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(a.x - b.x, a.y - b.y)`

#### Since

0.6.0

---

### subtractScalar()

> `static` **subtractScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:456](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L456)

Subtracts a scalar from both components `v - s`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### s

`number`

Scalar to subtract

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector equal to `(v.x - s, v.y - s)`

#### Since

0.6.0

---

### sumComponents()

> `static` **sumComponents**(`vector`): `number`

Defined in: [src/core/vector2.ts:396](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L396)

Computes the sum of components `x + y`.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to read

#### Returns

`number`

The scalar sum `vector.x + vector.y`

#### Remarks

A fundamental scalar reduction used as a building block for Manhattan norms,
barycentric coordinate validation, diagonal matrix traces, and divergence
approximations. Retained as a core primitive for downstream consumers.

#### Since

0.6.0

## Comparison

### exactEquals()

> **exactEquals**(`v`): `boolean`

Defined in: [src/core/vector2.ts:4268](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4268)

Exact equality with v (bit-identical).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare

#### Returns

`boolean`

True if exactly identical

#### Remarks

Use [nearEquals](#nearequals-1) for comparing results of floating-point operations.

#### Since

0.6.0

---

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/vector2.ts:4338](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4338)

Tests if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any component is ±Infinity

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/vector2.ts:4328](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4328)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/vector2.ts:4318](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4318)

Tests if both components are finite.

#### Returns

`boolean`

True if finite

#### Since

0.6.0

---

### isNearZero()

> **isNearZero**(`epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:4298](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4298)

Tests if this vector is near zero (both components within epsilon).

#### Parameters

##### epsilon?

`number` = `EPSILON`

Tolerance for comparison

#### Returns

`boolean`

True if both components are within epsilon of zero

#### Since

0.6.0

---

### isParallelTo()

> **isParallelTo**(`v`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:4351](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4351)

Tests parallelism with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare

##### epsilon?

`number` = `EPSILON`

Tolerance

#### Returns

`boolean`

True if parallel

#### Remarks

See [Vector2.isParallel](#isparallel) for scale-dependence note.

#### Since

0.6.0

---

### isPerpendicularTo()

> **isPerpendicularTo**(`v`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:4364](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4364)

Tests perpendicularity with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare

##### epsilon?

`number` = `EPSILON`

Tolerance

#### Returns

`boolean`

True if perpendicular

#### Remarks

See [Vector2.isPerpendicular](#isperpendicular) for scale-dependence note.

#### Since

0.6.0

---

### isUnit()

> **isUnit**(): `boolean`

Defined in: [src/core/vector2.ts:4308](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4308)

Tests if unit length.

#### Returns

`boolean`

True if |magnitudeSq - 1| ≤ EPSILON

#### Since

0.6.0

---

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/vector2.ts:4252](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4252)

Tests if exactly zero.

#### Returns

`boolean`

True if both components are zero

#### See

[isNearZero](../../auxiliary/scalar/functions/isNearZero.md) For tolerance-based comparison.

#### Since

0.6.0

---

### nearEquals()

> **nearEquals**(`v`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:4285](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4285)

Approximate equality with v using relative tolerance.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to compare

##### epsilon?

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if within scaled epsilon

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Default Value

`EPSILON`

#### Since

0.6.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/vector2.ts:2507](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2507)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector

#### Returns

`boolean`

True if components are exactly identical

#### Remarks

Use [nearEquals](#nearequals-1) for comparing results of floating-point operations.

#### Since

0.6.0

---

### hasInfinity()

> `static` **hasInfinity**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2587](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2587)

Tests if any component is infinite (±Infinity).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test

#### Returns

`boolean`

True if any component is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-1) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2571](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2571)

Tests if any component is NaN.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isFinite()

> `static` **isFinite**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2558](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2558)

Tests whether both components are finite numbers.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test

#### Returns

`boolean`

True if both components are finite

#### Since

0.6.0

---

### isNearZero()

> `static` **isNearZero**(`v`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:2490](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2490)

Tests whether both components are within epsilon of 0.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test

##### epsilon?

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if |x| ≤ epsilon and |y| ≤ epsilon

#### Default Value

`EPSILON`

#### Since

0.6.0

---

### isParallel()

> `static` **isParallel**(`a`, `b`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:2609](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2609)

Tests parallelism: |cross(a, b)| ≤ epsilon.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector

##### epsilon?

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if vectors are parallel

#### Remarks

The epsilon is applied to the raw cross product, not normalized by
vector magnitudes. For scale-invariant comparison, normalize both
vectors first.

#### Default Value

`EPSILON`

#### Since

0.6.0

---

### isPerpendicular()

> `static` **isPerpendicular**(`a`, `b`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:2634](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2634)

Tests perpendicularity: |dot(a, b)| ≤ epsilon.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector

##### epsilon?

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if vectors are perpendicular

#### Remarks

The epsilon is applied to the raw dot product, not normalized by
vector magnitudes. For scale-invariant comparison, normalize both
vectors first.

#### Default Value

`EPSILON`

#### Since

0.6.0

---

### isUnit()

> `static` **isUnit**(`v`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:2544](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2544)

Tests whether |length(v) - 1| ≤ EPSILON.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test

##### epsilon?

`number` = `EPSILON`

Tolerance for comparison.

#### Returns

`boolean`

True if v is unit length

#### Default Value

`EPSILON`

#### Since

0.6.0

---

### isZero()

> `static` **isZero**(`v`): `boolean`

Defined in: [src/core/vector2.ts:2476](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2476)

Tests whether v is exactly (0, 0).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to test

#### Returns

`boolean`

True if both components are zero

#### Since

0.6.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon?`): `boolean`

Defined in: [src/core/vector2.ts:2526](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2526)

Approximate component-wise equality using relative tolerance.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector

##### epsilon?

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if both component differences are within scaled epsilon

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.
This scales with value magnitude, making it robust for both small and large values.

#### Default Value

`EPSILON`

#### Since

0.6.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/vector2.ts:144](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L144)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### NEGATIVE_INFINITY

> `readonly` `static` **NEGATIVE_INFINITY**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:216](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L216)

The `(-∞, -∞)` vector.

#### Since

0.6.0

---

### NEGATIVE_ONE

> `readonly` `static` **NEGATIVE_ONE**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:158](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L158)

The all-negative-ones vector `(-1, -1)`.

#### Since

0.6.0

---

### NEGATIVE_UNIT_DIAGONAL

> `readonly` `static` **NEGATIVE_UNIT_DIAGONAL**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:200](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L200)

225° diagonal unit `(-1/√2, -1/√2)` - direction from origin at 225° from +X.

#### Since

0.6.0

---

### NEGATIVE_UNIT_X

> `readonly` `static` **NEGATIVE_UNIT_X**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:179](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L179)

Unit vector along -X `(-1, 0)`.

#### Since

0.6.0

---

### NEGATIVE_UNIT_Y

> `readonly` `static` **NEGATIVE_UNIT_Y**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:186](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L186)

Unit vector along -Y `(0, -1)`.

#### Since

0.6.0

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:151](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L151)

The all-ones vector `(1, 1)`.

#### Since

0.6.0

---

### POSITIVE_INFINITY

> `readonly` `static` **POSITIVE_INFINITY**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:207](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L207)

The `(+∞, +∞)` vector.

#### Since

0.6.0

---

### UNIT_DIAGONAL

> `readonly` `static` **UNIT_DIAGONAL**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:193](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L193)

45° diagonal unit `(1/√2, 1/√2)` - direction from origin at 45° from +X.

#### Since

0.6.0

---

### UNIT_X

> `readonly` `static` **UNIT_X**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:165](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L165)

Unit vector along +X `(1, 0)`.

#### Since

0.6.0

---

### UNIT_Y

> `readonly` `static` **UNIT_Y**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:172](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L172)

Unit vector along +Y `(0, 1)`.

#### Since

0.6.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Vector2`\>

Defined in: [src/core/vector2.ts:137](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L137)

The zero/origin vector `(0, 0)`.

#### Since

0.6.0

## Constraint

### clamp()

> **clamp**(`minV`, `maxV`): `this`

Defined in: [src/core/vector2.ts:3678](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3678)

Clamps components between min and max vectors.

#### Parameters

##### minV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component minima

##### maxV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component maxima

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### clampMagnitude()

> **clampMagnitude**(`minLength`, `maxLength`): `this`

Defined in: [src/core/vector2.ts:3706](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3706)

Clamps length to range.

#### Parameters

##### minLength

`number`

Minimum magnitude

##### maxLength

`number`

Maximum magnitude

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### clampScalar()

> **clampScalar**(`min`, `max`): `this`

Defined in: [src/core/vector2.ts:3692](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3692)

Clamps components between scalar bounds.

#### Parameters

##### min

`number`

Minimum scalar

##### max

`number`

Maximum scalar

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### limit()

> **limit**(`maxLength`): `this`

Defined in: [src/core/vector2.ts:3720](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3720)

Limits length to maximum.

#### Parameters

##### maxLength

`number`

Maximum allowed magnitude

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### max()

> **max**(`v`): `this`

Defined in: [src/core/vector2.ts:3750](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3750)

Component-wise maximum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Other vector

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### maxScalar()

> **maxScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3778](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3778)

Component-wise maximum with scalar.

#### Parameters

##### s

`number`

Scalar bound

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### min()

> **min**(`v`): `this`

Defined in: [src/core/vector2.ts:3737](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3737)

Component-wise minimum with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Other vector

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### minScalar()

> **minScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:3764](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3764)

Component-wise minimum with scalar.

#### Parameters

##### s

`number`

Scalar bound

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### clamp()

> `static` **clamp**(`v`, `minV`, `maxV`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1431](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1431)

Component-wise clamp between min and max vectors.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clamp

##### minV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component minima

##### maxV

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Per-component maxima

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Clamped vector

#### Since

0.6.0

---

### clampMagnitude()

> `static` **clampMagnitude**(`v`, `minLength`, `maxLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1473](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1473)

Clamps vector length to [minLength, maxLength].

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clamp

##### minLength

`number`

Minimum magnitude

##### maxLength

`number`

Maximum magnitude

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with clamped magnitude

#### Since

0.6.0

---

### clampScalar()

> `static` **clampScalar**(`v`, `min`, `max`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1452](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1452)

Clamps both components between scalar min and max.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clamp

##### min

`number`

Minimum scalar

##### max

`number`

Maximum scalar

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Clamped vector

#### Since

0.6.0

---

### limit()

> `static` **limit**(`v`, `maxLength`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1501](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1501)

Limits vector length to maxLength.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to limit

##### maxLength

`number`

Maximum allowed magnitude

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with limited magnitude

#### Remarks

Equivalent to `clampMagnitude(v, 0, maxLength)`.

#### Since

0.6.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1537](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1537)

Component-wise maximum of a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with per-component maxima

#### Since

0.6.0

---

### maxScalar()

> `static` **maxScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1567](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1567)

Component-wise maximum of v and scalar s.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector

##### s

`number`

Scalar bound

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with each component ≥ s

#### Since

0.7.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1522](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1522)

Component-wise minimum of a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with per-component minima

#### Since

0.6.0

---

### minScalar()

> `static` **minScalar**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1552](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1552)

Component-wise minimum of v and scalar s.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector

##### s

`number`

Scalar bound

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with each component ≤ s

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/vector2.ts:4440](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4440)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding x then y

#### Since

0.7.0

---

### clone()

> **clone**(): `Vector2`

Defined in: [src/core/vector2.ts:4378](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4378)

Returns a shallow clone.

#### Returns

`Vector2`

New Vector2 with same components

#### Since

0.6.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): \[`number`, `number`\] \| `T`

Defined in: [src/core/vector2.ts:4390](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4390)

Writes to array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

#### Parameters

##### out?

`T`

Destination array

##### offset?

`number` = `0`

Write offset

#### Returns

\[`number`, `number`\] \| `T`

The output array

#### Since

0.6.0

---

### toComplexLike()

> **toComplexLike**(): `object`

Defined in: [src/core/vector2.ts:4457](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4457)

Converts this vector to a complex-like object.

#### Returns

`object`

Object with real (x) and imag (y) properties

##### imag

> **imag**: `number`

##### real

> **real**: `number`

#### Remarks

Returns a plain object compatible with ComplexLike interface.
Does not create a Complex instance to avoid circular dependencies.

#### Since

0.7.0

---

### toJSON()

> **toJSON**(): `object`

Defined in: [src/core/vector2.ts:4418](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4418)

Alias for toObject (JSON serialization).

#### Returns

`object`

Object with x and y properties

##### x

> **x**: `number`

##### y

> **y**: `number`

#### Since

0.6.0

---

### toObject()

> **toObject**(): `object`

Defined in: [src/core/vector2.ts:4408](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4408)

Returns plain object { x, y }.

#### Returns

`object`

Object with x and y properties

##### x

> **x**: `number`

##### y

> **y**: `number`

#### Since

0.6.0

---

### toString()

> **toString**(`precision?`): `string`

Defined in: [src/core/vector2.ts:4430](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4430)

Returns string representation.

#### Parameters

##### precision?

`number` = `4`

Decimal places.

#### Returns

`string`

Formatted string

#### Default Value

`4`

#### Since

0.6.0

## Direction

### angleBetween()

> **angleBetween**(`v`): `number`

Defined in: [src/core/vector2.ts:3524](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3524)

Unsigned angle between this and v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`number`

Unsigned angle in radians

#### Since

0.6.0

---

### angleTo()

> **angleTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3513](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3513)

Signed angle to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`number`

Signed angle in radians

#### Since

0.6.0

---

### directionTo()

> **directionTo**(`target`): `Vector2`

Defined in: [src/core/vector2.ts:3447](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3447)

Unit direction from this to target.

#### Parameters

##### target

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`Vector2`

New unit direction vector

#### Since

0.6.0

---

### directionToSafe()

> **directionToSafe**(`target`): `Vector2`

Defined in: [src/core/vector2.ts:3461](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3461)

Unit direction from this to target, returning (0, 0) if coincident.

#### Parameters

##### target

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`Vector2`

Unit direction vector, or (0, 0) if coincident

#### See

[directionTo](#directionto) - Throws on coincident points

#### Since

0.7.0

---

### directionToUnchecked()

> **directionToUnchecked**(`target`): `Vector2`

Defined in: [src/core/vector2.ts:3481](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3481)

Unit direction from this to target without validation.

#### Parameters

##### target

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector (must differ from this)

#### Returns

`Vector2`

Unit direction vector

#### Remarks

**Precondition:** `this` and `target` must not be coincident.
Calling with coincident points produces Infinity/NaN.

#### See

- [directionTo](#directionto) - Throws on coincident points
- [directionToSafe](#directiontosafe) - Returns (0,0) on coincident points

#### Since

0.7.0

---

### angle()

> `static` **angle**(`v`): `number`

Defined in: [src/core/vector2.ts:1374](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1374)

Heading (angle) of v from +X axis in radians ∈ [-π, π].

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure

#### Returns

`number`

Angle in radians (CCW positive)

#### Since

0.6.0

---

### angleBetween()

> `static` **angleBetween**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1405](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1405)

Smallest unsigned angle between a and b in radians ∈ [0, π].

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vector

#### Returns

`number`

Unsigned angle in radians

#### Since

0.6.0

---

### angleTo()

> `static` **angleTo**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1391](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1391)

Signed angle from a to b (positive if b is CCW from a).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector

#### Returns

`number`

Signed angle in radians

#### Remarks

Uses `atan2(cross(a,b), dot(a,b))` for robust behavior.

#### Since

0.6.0

---

### direction()

> `static` **direction**(`from`, `to`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1295](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1295)

Unit direction from `from` to `to`.

#### Parameters

##### from

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start point

##### to

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End point

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Unit direction vector

#### Throws

If from and to are coincident

#### See

- [directionSafe](#directionsafe) - Returns (0,0) instead of throwing
- [directionUnchecked](#directionunchecked) - No validation, for hot paths

#### Since

0.6.0

---

### directionSafe()

> `static` **directionSafe**(`from`, `to`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1322](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1322)

Unit direction from `from` to `to`, returning (0,0) if coincident.

#### Parameters

##### from

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start point

##### to

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End point

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Unit direction vector, or (0,0) if coincident

#### See

[direction](#direction) - Throws on coincident points

#### Since

0.7.0

---

### directionUnchecked()

> `static` **directionUnchecked**(`from`, `to`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1354](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1354)

Unit direction without validation (hot path).

#### Parameters

##### from

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start point

##### to

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End point (must be different from `from`)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Unit direction vector

#### Remarks

**Precondition:** `from ≠ to`.
Calling with identical points produces NaN/Infinity.

#### See

- [direction](#direction) - Throws on coincident points
- [directionSafe](#directionsafe) - Returns (0,0) on coincident points

#### Since

0.7.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:262](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L262)

Creates a deep copy of a vector.

#### Parameters

##### source

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to clone

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

A Vector2 with identical components

#### Example

```typescript
const v = Vector2.fromValues(1, 2);
const w = Vector2.clone(v); // → (1, 2), new instance
```

#### Since

0.6.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Vector2`

Defined in: [src/core/vector2.ts:283](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L283)

Copies component values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### destination

`Vector2`

Target vector to receive the copy

#### Returns

`Vector2`

The destination vector

#### Example

```typescript
const src = Vector2.fromValues(5, 10);
const dst = new Vector2();
Vector2.copy(src, dst); // dst → (5, 10)
```

#### Since

0.6.0

---

### fromAngle()

> `static` **fromAngle**(`angle`, `radius?`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:303](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L303)

Creates a vector from polar coordinates.

#### Parameters

##### angle

`number`

Angle in radians (from +X, CCW positive)

##### radius?

`number` = `1`

Magnitude.

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

A Vector2 positioned at the given angle and radius

#### Default Value

`1`

#### Example

```typescript
Vector2.fromAngle(Math.PI / 2, 2); // → (0, 2)
```

#### Since

0.6.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset?`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:347](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L347)

Creates a vector from a flat numeric array.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Numeric array with at least two elements

##### offset?

`number` = `0`

Index of the x component.

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

A Vector2 initialized from the array

#### Default Value

`0`

#### Throws

If offset is out of bounds

#### Example

```typescript
Vector2.fromArray([10, 20, 30]); // → (10, 20)
Vector2.fromArray([10, 20, 30], 1); // → (20, 30)
```

#### Since

0.6.0

---

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:374](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L374)

Creates a vector from a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number with real and imag components

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with x=real, y=imag

#### Remarks

Uses interface for loose coupling with Complex class.

#### Example

```typescript
Vector2.fromComplex({ real: 3, imag: 4 }); // → (3, 4)
```

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:325](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L325)

Creates a vector from a plain object `{ x, y }`.

#### Parameters

##### object

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Plain object with numeric x and y

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

A Vector2 with the object's components

#### Example

```typescript
Vector2.fromObject({ x: 7, y: -3 }); // → (7, -3)
```

#### Since

0.6.0

---

### fromValues()

> `static` **fromValues**(`x`, `y`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:242](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L242)

Creates a vector from explicit components.

#### Parameters

##### x

`number`

X component

##### y

`number`

Y component

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

A Vector2 with components `(x, y)`

#### Example

```typescript
Vector2.fromValues(3, 4); // → (3, 4)
const out = new Vector2();
Vector2.fromValues(3, 4, out); // reuses `out` → (3, 4)
```

#### Since

0.6.0

## Geometry

### chebyshevDistanceTo()

> **chebyshevDistanceTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3419](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3419)

Chebyshev (L∞) distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`number`

The Chebyshev distance

#### Since

0.7.0

---

### chebyshevLength()

> **chebyshevLength**(): `number`

Defined in: [src/core/vector2.ts:3375](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3375)

Chebyshev length (L∞ norm).

#### Returns

`number`

The Chebyshev norm

#### Since

0.7.0

---

### cross()

> **cross**(`v`): `number`

Defined in: [src/core/vector2.ts:3334](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3334)

2D scalar cross product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand

#### Returns

`number`

Scalar cross product

#### Since

0.6.0

---

### distanceSquaredTo()

> **distanceSquaredTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3397](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3397)

Squared distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`number`

The squared distance

#### Since

0.6.0

---

### distanceTo()

> **distanceTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3386](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3386)

Euclidean distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`number`

The Euclidean distance

#### Since

0.6.0

---

### dot()

> **dot**(`v`): `number`

Defined in: [src/core/vector2.ts:3323](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3323)

Dot product with v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand

#### Returns

`number`

Scalar dot product

#### Since

0.6.0

---

### magnitude()

> **magnitude**(): `number`

Defined in: [src/core/vector2.ts:3345](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3345)

Euclidean magnitude (length).

#### Returns

`number`

The Euclidean norm

#### Since

0.6.0

---

### magnitudeSq()

> **magnitudeSq**(): `number`

Defined in: [src/core/vector2.ts:3355](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3355)

Squared length.

#### Returns

`number`

The squared length

#### Since

0.6.0

---

### manhattanDistanceTo()

> **manhattanDistanceTo**(`v`): `number`

Defined in: [src/core/vector2.ts:3408](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3408)

Manhattan (L1) distance to v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

#### Returns

`number`

The Manhattan distance

#### Since

0.6.0

---

### manhattanLength()

> **manhattanLength**(): `number`

Defined in: [src/core/vector2.ts:3365](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3365)

Manhattan length.

#### Returns

`number`

The Manhattan norm

#### Since

0.6.0

---

### chebyshevDistance()

> `static` **chebyshevDistance**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1272](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1272)

Chebyshev (L∞) distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First point

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second point

#### Returns

`number`

The Chebyshev distance

#### Remarks

Also known as the chessboard distance. Returns the maximum absolute
difference across components: `max(|ax - bx|, |ay - by|)`.

#### Since

0.7.0

---

### chebyshevLength()

> `static` **chebyshevLength**(`v`): `number`

Defined in: [src/core/vector2.ts:1201](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1201)

Chebyshev length `max(|x|, |y|)` (L∞ norm).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure

#### Returns

`number`

The Chebyshev (L∞) norm

#### Remarks

Also known as the L-infinity norm or chessboard norm. Returns the largest
absolute component value, corresponding to the minimum number of king moves
on a chessboard.

#### Since

0.7.0

---

### cross()

> `static` **cross**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1125](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1125)

2D scalar cross product (z-component): `a.x*b.y - a.y*b.x`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First operand

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand

#### Returns

`number`

Scalar cross product (signed area magnitude)

#### Remarks

Positive if b is CCW from a, negative if CW.

#### Example

```typescript
const a = new Vector2(1, 0);
const b = new Vector2(0, 1);
Vector2.cross(a, b); // 1 - b is CCW from a
Vector2.cross(b, a); // -1 - a is CW from b
```

#### Since

0.6.0

---

### cross3()

> `static` **cross3**(`a`, `b`, `c`): `number`

Defined in: [src/core/vector2.ts:1140](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1140)

Twice the signed area of triangle (a, b, c).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First vertex

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second vertex

##### c

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Third vertex

#### Returns

`number`

Twice the signed area (positive if CCW winding)

#### Since

0.6.0

---

### distance()

> `static` **distance**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1222](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1222)

Euclidean distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First point

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second point

#### Returns

`number`

The Euclidean distance

#### Example

```typescript
const a = new Vector2(0, 0);
const b = new Vector2(3, 4);
Vector2.distance(a, b); // 5 - the 3-4-5 triangle
```

#### Since

0.6.0

---

### distanceSquared()

> `static` **distanceSquared**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1238](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1238)

Squared Euclidean distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First point

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second point

#### Returns

`number`

The squared distance

#### Since

0.6.0

---

### dot()

> `static` **dot**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1100](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1100)

Dot product `a·b = a.x*b.x + a.y*b.y`.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First operand

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second operand

#### Returns

`number`

Scalar dot product

#### Example

```typescript
const a = new Vector2(1, 0);
const b = new Vector2(0, 1);
Vector2.dot(a, b); // 0 - perpendicular vectors
Vector2.dot(a, a); // 1 - parallel vectors (self dot = magnitude²)
```

#### Since

0.6.0

---

### magnitude()

> `static` **magnitude**(`v`): `number`

Defined in: [src/core/vector2.ts:1157](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1157)

Euclidean length `||v||`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure

#### Returns

`number`

The Euclidean norm

#### Since

0.6.0

---

### magnitudeSq()

> `static` **magnitudeSq**(`v`): `number`

Defined in: [src/core/vector2.ts:1170](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1170)

Squared length `||v||²` (avoids square root).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure

#### Returns

`number`

The squared length

#### Since

0.6.0

---

### manhattanDistance()

> `static` **manhattanDistance**(`a`, `b`): `number`

Defined in: [src/core/vector2.ts:1254](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1254)

Manhattan (L1) distance between a and b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

First point

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Second point

#### Returns

`number`

The Manhattan distance

#### Since

0.6.0

---

### manhattanLength()

> `static` **manhattanLength**(`v`): `number`

Defined in: [src/core/vector2.ts:1183](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1183)

Manhattan length `|x| + |y|`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to measure

#### Returns

`number`

The Manhattan (L1) norm

#### Since

0.6.0

## Interpolation

### lerp()

> **lerp**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:4179](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4179)

Linear interpolation towards end.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

##### t

`number`

Interpolation factor

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### lerpClamped()

> **lerpClamped**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:4194](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4194)

Clamped linear interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

##### t

`number`

Interpolation factor (clamped)

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### slerp()

> **slerp**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:4207](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4207)

Spherical linear interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

##### t

`number`

Interpolation factor

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### slerpClamped()

> **slerpClamped**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:4221](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4221)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### smoothStep()

> **smoothStep**(`end`, `t`): `this`

Defined in: [src/core/vector2.ts:4234](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4234)

Smooth step interpolation.

#### Parameters

##### end

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target vector

##### t

`number`

Interpolation factor

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:924](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L924)

Linear interpolation: `a + t * (b - a)`. Factor t is not clamped.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector

##### t

`number`

Interpolation factor

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Interpolated vector

#### Since

0.6.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:945](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L945)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector

##### t

`number`

Interpolation factor (clamped)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Clamped interpolated vector

#### Since

0.6.0

---

### slerp()

> `static` **slerp**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:978](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L978)

Spherical linear interpolation between two vectors.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Start vector

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

End vector

##### t

`number`

Interpolation factor (0 to 1)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Spherically interpolated vector

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

0.7.0

---

### slerpClamped()

> `static` **slerpClamped**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1036](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1036)

Spherical linear interpolation with t clamped to [0, 1].

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

Interpolated vector

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1068](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1068)

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

0.7.0

## Mutator

### copy()

> **copy**(`v`): `this`

Defined in: [src/core/vector2.ts:2827](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2827)

Copies from another vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### set()

> **set**(`x`, `y`): `this`

Defined in: [src/core/vector2.ts:2814](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2814)

Assigns both components.

#### Parameters

##### x

`number`

New x component

##### y

`number`

New y component

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### setComponent()

> **setComponent**(`index`, `value`): `this`

Defined in: [src/core/vector2.ts:2939](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2939)

Sets a component by index.

#### Parameters

##### index

`0` \| `1`

0 for x, 1 for y

##### value

`number`

New value

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### setFromAngle()

> **setFromAngle**(`angle`, `radius?`): `this`

Defined in: [src/core/vector2.ts:2840](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2840)

Sets this vector from polar coordinates.

#### Parameters

##### angle

`number`

Angle in radians (CCW from +X)

##### radius?

`number` = `1`

Distance from origin (default 1)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setFromArray()

> **setFromArray**(`array`, `offset?`): `this`

Defined in: [src/core/vector2.ts:2854](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2854)

Sets this vector from array values.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array

##### offset?

`number` = `0`

Starting index (default 0)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setFromComplex()

> **setFromComplex**(`complex`): `this`

Defined in: [src/core/vector2.ts:2871](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2871)

Sets this vector from a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Source complex (real→x, imag→y)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setScalar()

> **setScalar**(`s`): `this`

Defined in: [src/core/vector2.ts:2892](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2892)

Sets both components to the same scalar.

#### Parameters

##### s

`number`

Scalar value

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### setX()

> **setX**(`x`): `this`

Defined in: [src/core/vector2.ts:2903](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2903)

Sets the x component.

#### Parameters

##### x

`number`

New x value

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### setY()

> **setY**(`y`): `this`

Defined in: [src/core/vector2.ts:2915](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2915)

Sets the y component.

#### Parameters

##### y

`number`

New y value

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/vector2.ts:2881](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2881)

Resets both components to zero.

#### Returns

`this`

This for chaining

#### Since

0.6.0

## Other

### x

> **x**: `number`

Defined in: [src/core/vector2.ts:2648](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2648)

X component.

#### Implementation of

[`Vector2Like`](../../types/interfaces/Vector2Like.md).[`x`](../../types/interfaces/Vector2Like.md#x)

---

### y

> **y**: `number`

Defined in: [src/core/vector2.ts:2651](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2651)

Y component.

#### Implementation of

[`Vector2Like`](../../types/interfaces/Vector2Like.md).[`y`](../../types/interfaces/Vector2Like.md#y)

## Transform

### abs()

> **abs**(): `this`

Defined in: [src/core/vector2.ts:3790](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3790)

Applies Math.abs to both components.

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### ceil()

> **ceil**(): `this`

Defined in: [src/core/vector2.ts:3826](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3826)

Applies Math.ceil to both components.

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### crossScalarLeft()

> **crossScalarLeft**(`s`): `this`

Defined in: [src/core/vector2.ts:4160](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4160)

Cross product: scalar × vector = (-s*y, s*x).

#### Parameters

##### s

`number`

Scalar factor

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### crossScalarRight()

> **crossScalarRight**(`s`): `this`

Defined in: [src/core/vector2.ts:4147](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4147)

Cross product: vector × scalar = (s*y, -s*x).

#### Parameters

##### s

`number`

Scalar factor

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### floor()

> **floor**(): `this`

Defined in: [src/core/vector2.ts:3814](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3814)

Applies Math.floor to both components.

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/vector2.ts:3254](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3254)

Component-wise reciprocal.

#### Returns

`this`

This for chaining

#### Throws

If any component is zero

#### See

- [inverseSafe](#inversesafe-1) - Returns 0 per component on near-zero value
- [inverseUnchecked](#inverseunchecked-1) - No validation

#### Since

0.6.0

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/vector2.ts:3272](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3272)

Safe reciprocal. Components near zero become 0.

#### Returns

`this`

This for chaining

#### See

[inverse](#inverse-1) - Throws on near-zero component

#### Since

0.6.0

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/vector2.ts:3293](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3293)

Unchecked reciprocal for hot paths.

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Both components must be non-zero.
Calling with zero produces Infinity.

#### See

- [inverse](#inverse-1) - Throws on near-zero component
- [inverseSafe](#inversesafe-1) - Returns 0 per component on near-zero value

#### Since

0.7.0

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/vector2.ts:3543](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3543)

Normalizes to unit length.

#### Returns

`this`

This for chaining

#### Throws

If zero length

#### See

- [normalizeSafe](#normalizesafe-1) - Returns (0,0) on zero-length vector
- [normalizeUnchecked](#normalizeunchecked-1) - No validation

#### Since

0.6.0

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/vector2.ts:3560](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3560)

Safe normalization. Sets to (0, 0) if zero length.

#### Returns

`this`

This for chaining

#### See

[normalize](#normalize-1) - Throws on zero-length vector

#### Since

0.6.0

---

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/vector2.ts:3587](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3587)

Unchecked normalization for hot paths.

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Vector must have non-zero length.
Calling with zero-length vector produces NaN/Infinity components.

Use only when you can guarantee valid input (e.g., after explicit check).
For safe normalization, use [normalizeSafe](#normalizesafe-1).
For normalization with error throwing, use [normalize](#normalize-1).

#### See

- [normalize](#normalize-1) - Throws on zero-length vector
- [normalizeSafe](#normalizesafe-1) - Returns (0,0) on zero-length vector

#### Since

0.7.0

---

### perpendicular()

> **perpendicular**(`clockwise?`): `this`

Defined in: [src/core/vector2.ts:3999](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3999)

Rotates by ±90°.

#### Parameters

##### clockwise?

`boolean` = `false`

CW if true, CCW if false

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### project()

> **project**(`axis`): `this`

Defined in: [src/core/vector2.ts:3868](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3868)

Projects onto axis.

#### Parameters

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis

#### Returns

`this`

This for chaining

#### Throws

If axis has zero length

#### See

- [projectSafe](#projectsafe-1) - Returns (0,0) on zero-length axis
- [projectUnchecked](#projectunchecked-1) - No validation

#### Since

0.6.0

---

### projectOnUnit()

> **projectOnUnit**(`unitAxis`): `this`

Defined in: [src/core/vector2.ts:3920](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3920)

Projects onto unit axis.

#### Parameters

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### projectSafe()

> **projectSafe**(`axis`): `this`

Defined in: [src/core/vector2.ts:3887](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3887)

Safe projection onto axis. Returns (0,0) if axis has zero length.

#### Parameters

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis

#### Returns

`this`

This for chaining

#### See

[project](#project-1) - Throws on zero-length axis

#### Since

0.6.0

---

### projectUnchecked()

> **projectUnchecked**(`axis`): `this`

Defined in: [src/core/vector2.ts:3907](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3907)

Unchecked projection onto axis (hot path).

#### Parameters

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis (must have non-zero length)

#### Returns

`this`

This for chaining

#### See

- [project](#project-1) - Throws on zero-length axis
- [projectSafe](#projectsafe-1) - Returns (0,0) on zero-length axis

#### Since

0.7.0

---

### reflect()

> **reflect**(`unitNormal`): `this`

Defined in: [src/core/vector2.ts:3940](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3940)

Reflects about unit normal.

#### Parameters

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal

#### Returns

`this`

This for chaining

#### Throws

If unitNormal is not unit length

#### See

[reflectSafe](#reflectsafe-1) - Normalizes normal first

#### Since

0.6.0

---

### reflectSafe()

> **reflectSafe**(`normal`): `this`

Defined in: [src/core/vector2.ts:3959](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3959)

Safe reflection.

#### Parameters

##### normal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Normal (need not be unit)

#### Returns

`this`

This for chaining

#### See

[reflect](#reflect-1) - Throws if normal is not unit length

#### Since

0.6.0

---

### reflectUnchecked()

> **reflectUnchecked**(`unitNormal`): `this`

Defined in: [src/core/vector2.ts:3987](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3987)

Reflection without validation (hot path).

#### Parameters

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal (must be unit)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `unitNormal` must be unit length.
If not unit, the result will be geometrically incorrect but not NaN.

#### See

- [reflect](#reflect-1) - Throws if normal is not unit
- [reflectSafe](#reflectsafe-1) - Normalizes normal first

#### Since

0.7.0

---

### reject()

> **reject**(`onto`): `this`

Defined in: [src/core/vector2.ts:4078](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4078)

Vector rejection: removes projection onto axis.

#### Parameters

##### onto

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis to reject from

#### Returns

`this`

This for chaining

#### Throws

If onto has zero length

#### See

- [rejectSafe](#rejectsafe-1) - Returns copy of this on zero-length axis
- [rejectUnchecked](#rejectunchecked-1) - No validation

#### Since

0.6.0

---

### rejectOnUnit()

> **rejectOnUnit**(`unitAxis`): `this`

Defined in: [src/core/vector2.ts:4135](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4135)

Rejection onto a unit axis (hot path).

#### Parameters

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis

#### Returns

`this`

This for chaining

#### Remarks

Use when you know the axis is already normalized.

#### Since

0.7.0

---

### rejectSafe()

> **rejectSafe**(`onto`): `this`

Defined in: [src/core/vector2.ts:4097](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4097)

Safe rejection. Returns copy of this if onto has zero length.

#### Parameters

##### onto

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis to reject from

#### Returns

`this`

This for chaining

#### See

[reject](#reject-1) - Throws on zero-length axis

#### Since

0.7.0

---

### rejectUnchecked()

> **rejectUnchecked**(`onto`): `this`

Defined in: [src/core/vector2.ts:4117](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4117)

Unchecked rejection (hot path).

#### Parameters

##### onto

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis to reject from (must have non-zero length)

#### Returns

`this`

This for chaining

#### See

- [reject](#reject-1) - Throws on zero-length axis
- [rejectSafe](#rejectsafe-1) - Returns copy of this on zero-length axis

#### Since

0.7.0

---

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/core/vector2.ts:4018](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4018)

Rotates by angle.

#### Parameters

##### angle

`number`

Rotation angle

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### rotateAround()

> **rotateAround**(`center`, `angle`): `this`

Defined in: [src/core/vector2.ts:4045](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4045)

Rotates around center.

#### Parameters

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Pivot point

##### angle

`number`

Rotation angle

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### rotateAroundCS()

> **rotateAroundCS**(`center`, `c`, `s`): `this`

Defined in: [src/core/vector2.ts:4058](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4058)

Rotates around center using precomputed cos/sin.

#### Parameters

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Pivot point

##### c

`number`

Cosine of angle

##### s

`number`

Sine of angle

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### rotateCS()

> **rotateCS**(`c`, `s`): `this`

Defined in: [src/core/vector2.ts:4031](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4031)

Rotates using precomputed cos/sin.

#### Parameters

##### c

`number`

Cosine

##### s

`number`

Sine

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### round()

> **round**(): `this`

Defined in: [src/core/vector2.ts:3838](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3838)

Applies Math.round to both components.

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### setAngle()

> **setAngle**(`angle`): `this`

Defined in: [src/core/vector2.ts:3664](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3664)

Sets angle (direction) while preserving length.

#### Parameters

##### angle

`number`

New heading in radians

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### setMagnitude()

> **setMagnitude**(`newMagnitude`): `this`

Defined in: [src/core/vector2.ts:3606](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3606)

Sets the length.

#### Parameters

##### newMagnitude

`number`

Desired magnitude

#### Returns

`this`

This for chaining

#### Throws

If zero length or negative

#### See

[setMagnitudeSafe](#setmagnitudesafe-1) - Returns fallback on zero-length vector

#### Since

0.6.0

---

### setMagnitudeSafe()

> **setMagnitudeSafe**(`newMagnitude`): `this`

Defined in: [src/core/vector2.ts:3627](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3627)

Safe setMagnitude. Zero vectors become (newMagnitude, 0).

#### Parameters

##### newMagnitude

`number`

Desired magnitude

#### Returns

`this`

This for chaining

#### See

[setMagnitude](#setmagnitude-1) - Throws on zero-length vector or negative magnitude

#### Since

0.6.0

---

### setMagnitudeUnchecked()

> **setMagnitudeUnchecked**(`newMagnitude`): `this`

Defined in: [src/core/vector2.ts:3652](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3652)

Sets magnitude without validation (hot path).

#### Parameters

##### newMagnitude

`number`

Desired magnitude (must be non-negative)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `newMagnitude >= 0` and this vector has non-zero length.
Zero-length vectors produce NaN. Negative magnitudes scale backwards.

#### See

- [setMagnitude](#setmagnitude-1) - Throws on invalid input
- [setMagnitudeSafe](#setmagnitudesafe-1) - Handles edge cases gracefully

#### Since

0.7.0

---

### sign()

> **sign**(): `this`

Defined in: [src/core/vector2.ts:3802](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3802)

Component-wise sign.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### step()

> **step**(`edge`): `this`

Defined in: [src/core/vector2.ts:4496](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4496)

Applies step function: sets components to 0 where < edge, else 1.

#### Parameters

##### edge

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Threshold vector

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### swap()

> **swap**(): `this`

Defined in: [src/core/vector2.ts:3305](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3305)

Swaps x and y components.

#### Returns

`this`

This for chaining

#### Since

0.6.0

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/vector2.ts:3850](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L3850)

Applies Math.trunc to both components (rounds towards zero).

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### abs()

> `static` **abs**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:796](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L796)

Applies Math.abs to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Absolute-valued vector

#### Since

0.6.0

---

### ceil()

> `static` **ceil**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:754](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L754)

Applies Math.ceil to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Ceiled vector

#### Since

0.6.0

---

### crossScalarLeft()

> `static` **crossScalarLeft**(`s`, `v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2269](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2269)

2D cross product: scalar × vector = (-s*y, s*x).
Scalar is on the LEFT side of the cross product.

#### Parameters

##### s

`number`

Scalar factor (on left)

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Perpendicular scaled vector (CCW rotation)

#### Example

```typescript
const v = new Vector2(1, 0);
const perp = Vector2.crossScalarLeft(1, v); // (0, 1) - CCW perpendicular
```

#### See

[crossScalarRight](#crossscalarright-1) - For scalar on right side

#### Since

0.6.0

---

### crossScalarRight()

> `static` **crossScalarRight**(`v`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2245](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2245)

2D cross product: vector × scalar = (s*y, -s*x).
Scalar is on the RIGHT side of the cross product.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### s

`number`

Scalar factor (on right)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Perpendicular scaled vector (CW rotation)

#### See

[crossScalarLeft](#crossscalarleft-1) - For scalar on left side

#### Since

0.6.0

---

### floor()

> `static` **floor**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:740](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L740)

Applies Math.floor to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Floored vector

#### Since

0.6.0

---

### getLengthAndNormalize()

> `static` **getLengthAndNormalize**(`v`, `out?`): `object`

Defined in: [src/core/vector2.ts:1681](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1681)

Computes length and unit vector in a single operation.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to process

##### out?

`Vector2`

Optional output vector for the unit vector

#### Returns

`object`

Object with length and unit vector

##### length

> **length**: `number`

##### unit

> **unit**: `Vector2`

#### Remarks

More efficient than calling length() and normalize() separately
when both values are needed, as it avoids computing sqrt twice.

#### Since

0.7.0

---

### inverse()

> `static` **inverse**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:828](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L828)

Component-wise reciprocal (1/x, 1/y).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Inverted vector

#### Throws

If any component is zero

#### See

- [inverseSafe](#inversesafe-1) - Returns 0 per component on near-zero value
- [inverseUnchecked](#inverseunchecked-1) - No validation

#### Since

0.6.0

---

### inverseSafe()

> `static` **inverseSafe**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:851](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L851)

Safe reciprocal. Components near zero become 0.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Safe inverted vector

#### Remarks

Uses [isNearZero](../../auxiliary/scalar/functions/isNearZero.md) with default [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) per component.
Components with |value| ≤ EPSILON become 0 instead of Infinity.

#### See

[inverse](#inverse-1) - Throws on near-zero component

#### Since

0.6.0

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:872](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L872)

Unchecked reciprocal for hot paths.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector (must have non-zero components)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Inverted vector

#### Remarks

**Precondition:** Both components must be non-zero.
Calling with zero produces Infinity.

#### See

- [inverse](#inverse-1) - Throws on near-zero component
- [inverseSafe](#inversesafe-1) - Returns 0 per component on near-zero value

#### Since

0.7.0

---

### normalize()

> `static` **normalize**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1602](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1602)

Normalizes v to unit length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to normalize

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Unit vector

#### Remarks

**Numerical Limits:** For vectors with extremely small components
(magnitude < ~1e-154), intermediate calculations may underflow to zero
due to IEEE 754 double precision limits, causing a RangeError even if
the vector is technically non-zero. Use [normalizeSafe](#normalizesafe-1) for
graceful handling of such edge cases.

#### Throws

If v has zero length

#### Example

```typescript
const v = new Vector2(3, 4);
const unit = Vector2.normalize(v); // (0.6, 0.8) - unit vector
```

#### See

- [normalizeSafe](#normalizesafe-1) - Returns (0,0) on zero-length vector
- [normalizeUnchecked](#normalizeunchecked-1) - No validation

#### Since

0.6.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1629](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1629)

Safe normalization. Returns (0,0) if v has zero length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to normalize

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Normalized vector or zero vector

#### Remarks

Returns `(0,0)` for zero-length vectors because there is no meaningful
unit direction to preserve. Unlike Complex and Rotation2 which use `(1,0)`
as their identity element, vectors have no algebraic identity for
normalization — the zero vector is the least surprising fallback.

#### See

[normalize](#normalize-1) - Throws on zero-length vector

#### Since

0.6.0

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1661](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1661)

Normalizes a vector without validation (for hot paths).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to normalize (must have non-zero length)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Normalized vector

#### Remarks

**WARNING:** This method performs no validation.

- If v is zero, the result will be (NaN, NaN).
- Use only when you can guarantee the vector has non-zero length.

Uses `Math.sqrt(x*x + y*y)` for magnitude, which is faster than `Math.hypot`
but overflows to `Infinity` for components larger than ~1e154 (since squaring
exceeds `Number.MAX_VALUE`). For vectors with very large components, prefer
[normalize](#normalize-1) or [normalizeSafe](#normalizesafe-1) which use overflow-safe magnitude.

#### See

- [normalize](#normalize-1) - Throws on zero-length vectors
- [normalizeSafe](#normalizesafe-1) - Returns (0,0) on zero-length vectors

#### Since

0.7.0

---

### perpendicular()

> `static` **perpendicular**(`v`, `clockwise?`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2130](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2130)

Perpendicular vector (±90°) with unchanged length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### clockwise?

`boolean` = `false`

CW (-90°) if true, CCW (+90°) if false.

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Perpendicular vector

#### Remarks

- CCW (+90°): `(-y, x)`
- CW (-90°): `(y, -x)`

#### Default Value

`false`

#### Since

0.6.0

---

### project()

> `static` **project**(`v`, `axis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1818](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1818)

Projects v onto axis.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to project

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Projection of v onto axis

#### Remarks

Mathematically equivalent to `axis * (dot(v, axis) / magnitudeSq(axis))`.

#### Throws

If axis has zero length

#### Example

```typescript
const v = new Vector2(3, 4);
const axis = new Vector2(1, 0);
const proj = Vector2.project(v, axis); // (3, 0) - projection onto X axis
```

#### See

- [projectSafe](#projectsafe-1) - Returns (0,0) instead of throwing
- [projectUnchecked](#projectunchecked-1) - No validation, for hot paths
- [projectOnUnit](#projectonunit-1) - Optimized for unit vectors

#### Since

0.6.0

---

### projectOnUnit()

> `static` **projectOnUnit**(`v`, `unitAxis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1894](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1894)

Projects v onto a unit axis (optimized).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to project

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Projection of v onto unitAxis

#### Since

0.6.0

---

### projectSafe()

> `static` **projectSafe**(`v`, `axis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1841](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1841)

Projects v onto axis, returning (0,0) if axis has zero length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to project

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Projection of v onto axis, or (0,0) if axis is zero

#### See

- [project](#project-1) - Throws on zero-length axis
- [projectOnUnit](#projectonunit-1) - Optimized for unit vectors

#### Since

0.6.0

---

### projectUnchecked()

> `static` **projectUnchecked**(`v`, `axis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1873](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1873)

Projects v onto axis without validation (hot path).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to project

##### axis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Projection axis (must have non-zero length)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Projection of v onto axis

#### Remarks

**Precondition:** `axis` must have non-zero length.
If axis is zero, result will be (NaN, NaN).

#### See

- [project](#project-1) - Throws on zero-length axis
- [projectSafe](#projectsafe-1) - Returns (0,0) on zero-length axis
- [projectOnUnit](#projectonunit-1) - Optimized for unit vectors

#### Since

0.7.0

---

### reflect()

> `static` **reflect**(`v`, `unitNormal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2046](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2046)

Reflection of v about a unit normal: `r = v - 2(v·n)n`.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Incident vector

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Reflected vector

#### Remarks

Implements the reflection formula: `r = v - 2 * dot(v, n) * n`.
Uses [Vector2.dot](#dot-1) internally.
For physics bounces, the incident velocity reflects off surfaces using this formula.

#### Throws

If unitNormal is not unit length

#### Example

```typescript
const v = new Vector2(1, -1); // incoming at 45°
const normal = new Vector2(0, 1); // horizontal surface
const r = Vector2.reflect(v, normal); // (1, 1) - bounces off
```

#### See

- [reflectSafe](#reflectsafe-1) - Normalizes normal first
- [reflectUnchecked](#reflectunchecked-1) - No validation, for hot paths

#### Since

0.6.0

---

### reflectSafe()

> `static` **reflectSafe**(`v`, `normal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2072](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2072)

Safe reflection. Normalizes the normal; near-zero normal returns v.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Incident vector

##### normal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Normal (need not be unit)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Reflected vector

#### See

[reflect](#reflect-1) - Throws if normal is not unit length

#### Since

0.6.0

---

### reflectUnchecked()

> `static` **reflectUnchecked**(`v`, `unitNormal`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2106](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2106)

Reflection without validation (hot path).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Incident vector

##### unitNormal

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length normal (must be unit)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Reflected vector

#### Remarks

**Precondition:** `unitNormal` must have unit length.
If not unit, result will be incorrect but not NaN.

#### See

- [reflect](#reflect-1) - Throws if normal is not unit
- [reflectSafe](#reflectsafe-1) - Normalizes normal first

#### Since

0.7.0

---

### reject()

> `static` **reject**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1933](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1933)

Vector rejection: component of a perpendicular to b.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to decompose

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis of projection

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rejection of a from b

#### Remarks

`reject(a, b) = a - project(a, b)`

#### Throws

If b has zero length

#### Example

```typescript
const v = new Vector2(3, 4);
const axis = new Vector2(1, 0);
const rej = Vector2.reject(v, axis); // (0, 4) - the perpendicular component
```

#### See

- [rejectSafe](#rejectsafe-1) - Returns copy of a instead of throwing
- [rejectUnchecked](#rejectunchecked-1) - No validation, for hot paths
- [rejectOnUnit](#rejectonunit-1) - Optimized for unit vectors

#### Since

0.6.0

---

### rejectOnUnit()

> `static` **rejectOnUnit**(`a`, `unitAxis`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2009](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2009)

Vector rejection onto a unit axis (optimized hot path).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to decompose

##### unitAxis

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Unit-length axis

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rejection of a from unitAxis

#### Remarks

`rejectOnUnit(a, unitAxis) = a - projectOnUnit(a, unitAxis)`
Use when you know the axis is already normalized.

#### Since

0.7.0

---

### rejectSafe()

> `static` **rejectSafe**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1956](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1956)

Vector rejection, returning copy of a if b has zero length.

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to decompose

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis of projection

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rejection of a from b, or copy of a if b is zero

#### See

- [reject](#reject-1) - Throws on zero-length axis
- [rejectOnUnit](#rejectonunit-1) - Optimized for unit vectors

#### Since

0.7.0

---

### rejectUnchecked()

> `static` **rejectUnchecked**(`a`, `b`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1984](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1984)

Vector rejection without validation (hot path).

#### Parameters

##### a

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to decompose

##### b

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Axis of projection (must have non-zero length)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rejection of a from b

#### Remarks

**Precondition:** `b` must have non-zero length.
If b is zero, result will be (NaN, NaN).

#### See

- [reject](#reject-1) - Throws on zero-length axis
- [rejectSafe](#rejectsafe-1) - Returns copy of input on zero-length axis
- [rejectOnUnit](#rejectonunit-1) - Optimized for unit vectors

#### Since

0.7.0

---

### rotate()

> `static` **rotate**(`v`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2151](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2151)

Rotates v by angle radians.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate

##### angle

`number`

Rotation angle (CCW positive)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rotated vector

#### Example

```typescript
const v = new Vector2(1, 0);
const rotated = Vector2.rotate(v, Math.PI / 2); // (0, 1) - 90° CCW
```

#### Since

0.6.0

---

### rotateAround()

> `static` **rotateAround**(`v`, `center`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2191](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2191)

Rotates v around center by angle.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Rotation pivot

##### angle

`number`

Rotation angle

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rotated vector

#### Example

```typescript
const point = new Vector2(2, 0);
const center = new Vector2(1, 0);
const rotated = Vector2.rotateAround(point, center, Math.PI); // (0, 0)
```

#### Since

0.6.0

---

### rotateAroundCS()

> `static` **rotateAroundCS**(`v`, `center`, `c`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2219](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2219)

Rotates v around center using precomputed cos/sin.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate

##### center

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Rotation pivot

##### c

`number`

Cosine of angle

##### s

`number`

Sine of angle

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rotated vector

#### Remarks

Optimal when rotating many points around the same center.

#### Since

0.6.0

---

### rotateCS()

> `static` **rotateCS**(`v`, `c`, `s`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2168](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2168)

Rotates v using precomputed cos/sin (optimal for batches).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate

##### c

`number`

Cosine of angle

##### s

`number`

Sine of angle

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rotated vector

#### Since

0.6.0

---

### round()

> `static` **round**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:768](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L768)

Applies Math.round to both components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rounded vector

#### Since

0.6.0

---

### setAngle()

> `static` **setAngle**(`v`, `angle`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1786](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1786)

Returns vector with same magnitude but new angle.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### angle

`number`

New heading in radians

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with new angle

#### Since

0.6.0

---

### setMagnitude()

> `static` **setMagnitude**(`v`, `newMagnitude`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1708](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1708)

Returns a copy of v with the requested length.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### newMagnitude

`number`

Desired magnitude

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with specified length

#### Throws

If newMagnitude < 0 or v has zero length

#### See

- [setMagnitudeSafe](#setmagnitudesafe-1) - Returns fallback on zero-length vector
- [setMagnitudeUnchecked](#setmagnitudeunchecked-1) - No validation

#### Since

0.6.0

---

### setMagnitudeSafe()

> `static` **setMagnitudeSafe**(`v`, `newMagnitude`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1733](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1733)

Safe setMagnitude. Zero vectors become (newMagnitude, 0).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### newMagnitude

`number`

Desired magnitude (clamped to 0 if negative)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with specified length

#### See

[setMagnitude](#setmagnitude-1) - Throws on zero-length vector or negative magnitude

#### Since

0.6.0

---

### setMagnitudeUnchecked()

> `static` **setMagnitudeUnchecked**(`v`, `newMagnitude`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:1765](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L1765)

Sets length without validation (hot path).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector (must have non-zero length)

##### newMagnitude

`number`

Desired magnitude (must be non-negative)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with specified length

#### Remarks

**Preconditions:** `v` must have non-zero length, `newMagnitude >= 0`.
Calling with zero-length vector produces NaN/Infinity.

#### See

- [setMagnitude](#setmagnitude-1) - Throws on invalid input
- [setMagnitudeSafe](#setmagnitudesafe-1) - Handles edge cases gracefully

#### Since

0.7.0

---

### sign()

> `static` **sign**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:810](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L810)

Component-wise sign extraction: (sign(x), sign(y)).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with components -1, 0, or 1

#### Since

0.7.0

---

### step()

> `static` **step**(`edge`, `v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:904](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L904)

Component-wise step function (GLSL-style).

#### Parameters

##### edge

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Threshold vector

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Input vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with 0 where `v < edge`, 1 otherwise

#### Remarks

Useful for shader-like operations and conditional masking.

#### Since

0.7.0

---

### swap()

> `static` **swap**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:886](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L886)

Swaps x and y components.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Vector with swapped components `(y, x)`

#### Since

0.6.0

---

### trunc()

> `static` **trunc**(`v`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:782](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L782)

Applies Math.trunc to both components (rounds towards zero).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Truncated vector

#### Since

0.7.0

## Transform Integration

### applyComplex()

> **applyComplex**(`complex`): `this`

Defined in: [src/core/vector2.ts:4613](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4613)

Applies a complex number as a rotation to this vector in place.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number (will be normalized first)

#### Returns

`this`

This for chaining

#### Remarks

- Use `Complex.apply` semantics (pure operator).
- The complex number is normalized before applying to ensure
  a pure rotation without scaling.

#### Example

```typescript
const c = { real: Math.SQRT1_2, imag: Math.SQRT1_2 }; // 45° rotation
const v = new Vector2(1, 0);
v.applyComplex(c); // v ≈ (0.707, 0.707)
```

#### Since

0.7.0

---

### applyMatrix2()

> **applyMatrix2**(`matrix`): `this`

Defined in: [src/core/vector2.ts:4537](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4537)

Transforms this vector by a 2x2 matrix in place.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix with m00, m01, m10, m11 components

#### Returns

`this`

This for chaining

#### Remarks

- Use `Matrix2.transformVector` semantics (spatial transform).
- Use for chaining operations.

#### Since

0.7.0

---

### applyMatrix3()

> **applyMatrix3**(`matrix`): `this`

Defined in: [src/core/vector2.ts:4557](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4557)

Transforms this vector by a 3x3 matrix in place (includes translation and perspective).

#### Parameters

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

3x3 transformation matrix

#### Returns

`this`

This for chaining

#### Remarks

- Use `Matrix3.transformPoint` semantics (spatial transform + translation).
- Treats this vector as a point (applies translation).
- For projective matrices, divides by the homogeneous coordinate w.

#### Since

0.7.0

---

### applyRotation2()

> **applyRotation2**(`rotation`): `this`

Defined in: [src/core/vector2.ts:4519](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4519)

Applies a Rotation2 (unit complex) to this vector in place.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation2 with cos and sin components

#### Returns

`this`

This for chaining

#### Remarks

- Use `Rotation2.apply` semantics (pure operator).
- Use for chaining operations.

#### Since

0.7.0

---

### applyTransform2()

> **applyTransform2**(`transform`): `this`

Defined in: [src/core/vector2.ts:4583](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L4583)

Applies a full 2D transform (scale → rotate → translate) in place.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform2 with position, rotation, and scale

#### Returns

`this`

This for chaining

#### Remarks

- Use `Transform2.transformPoint` semantics (spatial transform).
- Transform order: Scale first, then rotate, then translate.

#### Since

0.7.0

---

### applyComplex()

> `static` **applyComplex**(`v`, `complex`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2448](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2448)

Applies a complex number as a rotation to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number (will be normalized first)

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rotated vector

#### Remarks

- Use `Complex.apply` semantics (pure operator).
- The complex number is normalized before applying to ensure
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

0.7.0

---

### applyMatrix2()

> `static` **applyMatrix2**(`v`, `matrix`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2324](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2324)

Transforms a vector by a 2x2 matrix.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Matrix with m00, m01, m10, m11 components

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Transformed vector

#### Remarks

- Use `Matrix2.transformVector` semantics (spatial transform).
- Computes: [m00*x + m10*y, m01*x + m11*y] (column-major convention).
- Uses interface for loose coupling.

#### Example

```typescript
const v = new Vector2(1, 0);
const mat = Matrix2.fromRotation(Math.PI / 2); // 90° rotation
const result = Vector2.applyMatrix2(v, mat); // (0, 1)
```

#### Since

0.7.0

---

### applyMatrix3()

> `static` **applyMatrix3**(`v`, `matrix`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2366](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2366)

Transforms a vector by a 3x3 matrix (includes translation and perspective).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform (treated as a point)

##### matrix

[`ReadonlyMatrix3Like`](../../types/interfaces/ReadonlyMatrix3Like.md)

3x3 transformation matrix

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Transformed vector

#### Remarks

- Use `Matrix3.transformPoint` semantics (spatial transform + translation).
- For affine matrices (m02=0, m12=0, m22=1), computes:
  `[m00*x + m10*y + m20, m01*x + m11*y + m21]`

For projective matrices, divides by the homogeneous coordinate w.
When w ≈ 0, the point collapses to origin via `divideSafe` (returns 0).

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

0.7.0

---

### applyRotation2()

> `static` **applyRotation2**(`v`, `rotation`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2293](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2293)

Applies a Rotation2 (unit complex) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation2 with cos and sin components

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Rotated vector

#### Remarks

- Use `Rotation2.apply` semantics (pure operator).
- Equivalent to `rotateCS(v, rotation.cos, rotation.sin, out)`.
- Uses interface for loose coupling.

#### Since

0.7.0

---

### applyTransform2()

> `static` **applyTransform2**(`v`, `transform`, `out?`): `Vector2`

Defined in: [src/core/vector2.ts:2407](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/core/vector2.ts#L2407)

Applies a full 2D transform (scale → rotate → translate) to a vector.

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform2 with position, rotation (angle), and scale

##### out?

`Vector2`

Optional output vector

#### Returns

`Vector2`

Transformed vector

#### Remarks

- Use `Transform2.transformPoint` semantics (spatial transform).
- Transform order: Scale first, then rotate, then translate.
- Uses interface for loose coupling.

#### Example

```typescript
const v = new Vector2(1, 0);
const t = Transform2.fromValues(10, 0, Math.PI, 2, 2); // pos(10,0), rot=180°, scale=2
const result = Vector2.applyTransform2(v, t); // scaled, rotated, translated
```

#### Since

0.7.0
