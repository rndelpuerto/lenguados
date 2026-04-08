# Class: Rotation2

Defined in: [src/core/rotation2.ts:157](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L157)

Deterministic 2D rotation stored as cosine and sine components.

## Remarks

- **Design:** Stored as `(cos, sin)` pair. Instance methods are mutable and chainable;
  static methods are pure with alloc-free overloads via `out` parameter.
- **Numerics:** Uses deterministic `sin`/`cos`/`atan2` kernels. Renormalization
  maintains unit magnitude over accumulated rotations.
- **Safety:** "Safe" variants return identity rotation instead of throwing on
  zero-magnitude inputs.

## Example

```typescript
// Create from angle
const r = Rotation2.fromAngle(Math.PI / 4);

// Apply rotation to vector
const rotated = Rotation2.apply(r, vector);

// Instance (mutable, chainable)
rotation.multiply(other).normalize();
```

## Since

0.7.0

## Implements

- [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

## Constructors

### Constructor

> **new Rotation2**(`cos?`, `sin?`): `Rotation2`

Defined in: [src/core/rotation2.ts:182](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L182)

Creates a Rotation2 from cosine and sine components.

#### Parameters

##### cos?

`number` = `1`

Cosine of the rotation angle.

##### sin?

`number` = `0`

Sine of the rotation angle.

#### Returns

`Rotation2`

#### Remarks

**Warning:** This constructor does NOT normalize the (cos, sin) input.
A pair like `(2, 0)` will create a degenerate rotation that scales
instead of rotating. Use [fromAngle](#fromangle) for
angle-based construction or call [normalize](#normalize-1) after construction
if the input may not be unit-length.

#### Default Value

`1`

#### Default Value

`0`

## Accessor

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [src/core/rotation2.ts:1371](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1371)

Gets the angle in radians.

##### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 4);
console.log(rot.angle); // 0.785...
```

##### Since

0.7.0

##### Returns

`number`

Angle in radians

#### Set Signature

> **set** **angle**(`value`): `void`

Defined in: [src/core/rotation2.ts:1388](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1388)

Sets the angle in radians.
Zero-allocation: mutates in place.

##### Example

```typescript
const rot = new Rotation2();
rot.angle = Math.PI / 4;
```

##### Since

0.7.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### angleDegrees

#### Get Signature

> **get** **angleDegrees**(): `number`

Defined in: [src/core/rotation2.ts:1405](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1405)

Gets the angle in degrees.

##### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 2);
console.log(rot.angleDegrees); // 90
```

##### Since

0.7.0

##### Returns

`number`

Angle in degrees

#### Set Signature

> **set** **angleDegrees**(`value`): `void`

Defined in: [src/core/rotation2.ts:1420](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1420)

Sets the angle in degrees.

##### Example

```typescript
rot.angleDegrees = 45;
```

##### Since

0.7.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### angleTurns

#### Get Signature

> **get** **angleTurns**(): `number`

Defined in: [src/core/rotation2.ts:1437](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1437)

Gets the angle in turns (0-1 = one full rotation).

##### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI); // 180°
console.log(rot.angleTurns); // 0.5
```

##### Since

0.7.0

##### Returns

`number`

Angle in turns (0-1 range)

#### Set Signature

> **set** **angleTurns**(`value`): `void`

Defined in: [src/core/rotation2.ts:1452](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1452)

Sets the angle in turns (0-1 = one full rotation).

##### Example

```typescript
rot.angleTurns = 0.25; // 90°
```

##### Since

0.7.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### doubled

#### Get Signature

> **get** **doubled**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1695](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1695)

Returns the double of this rotation without modifying it.

##### Since

0.7.0

##### Returns

`Rotation2`

New rotation with double the angle

---

### inverted

#### Get Signature

> **get** **inverted**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1684](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1684)

Returns the inverse rotation without modifying this one.

##### Since

0.7.0

##### Returns

`Rotation2`

New inverted rotation

---

### negated

#### Get Signature

> **get** **negated**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1746](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1746)

Returns a new Rotation2 with both components negated.

##### Remarks

Component-wise negation `(-cos, -sin)` represents rotation by `θ + π`
(the opposite direction on the unit circle). This is distinct from
[inverted](#inverted) which returns `(cos, -sin)` (rotation by `-θ`).

##### Since

0.7.0

##### Returns

`Rotation2`

New Rotation2 with both cos and sin negated

---

### normalized

#### Get Signature

> **get** **normalized**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1762](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1762)

Returns a normalized version of this rotation (unit length cos² + sin² = 1).

##### Remarks

Since the constructor no longer auto-normalizes (Planck.js aligned),
use this getter to obtain a properly normalized rotation when needed.

##### Since

0.7.0

##### Returns

`Rotation2`

New normalized rotation

---

### perpendicular

#### Get Signature

> **get** **perpendicular**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1707](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1707)

Returns the perpendicular rotation (+90°) without modifying this one.

##### Since

0.7.0

##### Returns

`Rotation2`

New rotation rotated 90° counter-clockwise

---

### xAxis

#### Get Signature

> **get** **xAxis**(): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1718](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1718)

Returns the X-axis direction vector of this rotation.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Unit vector pointing in rotation direction

---

### yAxis

#### Get Signature

> **get** **yAxis**(): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1729](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1729)

Returns the Y-axis direction vector of this rotation.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Unit vector perpendicular to rotation direction

## Arithmetic

### conjugate()

> **conjugate**(): `this`

Defined in: [src/core/rotation2.ts:1517](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1517)

Conjugates this rotation in place (inverse for unit rotations).

#### Returns

`this`

This for chaining

#### Remarks

For unit complex numbers in SO(2), the conjugate `(cos, -sin)` is the inverse
rotation. Applying a rotation followed by its conjugate yields the identity.

#### Since

0.7.0

---

### inverse()

> **inverse**(): `this`

Defined in: [src/core/rotation2.ts:1481](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1481)

Inverts this rotation in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/rotation2.ts:1468](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1468)

Multiplies with another rotation (composition) in place.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/rotation2.ts:1499](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1499)

Negates both components of this rotation in place.

#### Returns

`this`

This for chaining

#### Remarks

Component-wise negation `(-cos, -sin)` represents rotation by `θ + π`
(the opposite direction on the unit circle). This is distinct from
[inverse](#inverse-1) which negates only sin (rotation by `-θ`).

#### Since

0.7.0

---

### relativeTo()

> **relativeTo**(`other`): `this`

Defined in: [src/core/rotation2.ts:1537](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1537)

Computes rotation relative to another in place.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Reference rotation

#### Returns

`this`

This for chaining

#### Remarks

Computes the rotation FROM this TO other (equivalent to
Rotation2.relative(this, other) = conj(this) \* other). The result,
when composed with this rotation, produces other:
this.multiply(this.relativeTo(other)) ≈ other.

#### Since

0.7.0

---

### conjugate()

> `static` **conjugate**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:857](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L857)

Returns the conjugate of a rotation (inverse for unit rotations).

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to conjugate

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Conjugated rotation

#### Remarks

For unit complex numbers in SO(2), the conjugate `(cos, -sin)` is the inverse
rotation. Applying a rotation followed by its conjugate yields the identity.

#### Since

0.7.0

---

### inverse()

> `static` **inverse**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:800](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L800)

Returns the inverse of a rotation.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to invert

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Inverted rotation

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:781](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L781)

Multiplies two rotations (composition).

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

First rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Second rotation

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Combined rotation (a then b)

#### Remarks

Repeated multiplication accumulates floating-point drift, causing the
result to deviate from unit magnitude. Call [normalize](#normalize-1) periodically
(e.g., every 60–120 frames) in physics loops to maintain accuracy.

#### Since

0.7.0

---

### negate()

> `static` **negate**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:819](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L819)

Returns the component-wise negation of a rotation.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to negate

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Negated rotation

#### Remarks

Negation `(-cos, -sin)` represents rotation by `θ + π` (the opposite
direction on the unit circle). This is distinct from [inverse](#inverse-1)
which returns `(cos, -sin)` (rotation by `-θ`).

#### Since

0.7.0

---

### relative()

> `static` **relative**(`a`, `b`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:833](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L833)

Computes the relative rotation from a to b.

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

First rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Second rotation

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Relative rotation (b relative to a)

#### Since

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/rotation2.ts:1594](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1594)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to compare

#### Returns

`boolean`

True if cos and sin are exactly identical

#### Remarks

Use [nearEquals](#nearequals-1) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/rotation2.ts:1669](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1669)

Returns true if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any ±Infinity value exists

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/rotation2.ts:1658](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1658)

Returns true if any component is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/rotation2.ts:1647](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1647)

Returns true if all components are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon?`): `boolean`

Defined in: [src/core/rotation2.ts:1624](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1624)

Tests if this rotation is identity (0°).

#### Parameters

##### epsilon?

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if identity

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isNormalized()

> **isNormalized**(`epsilon?`): `boolean`

Defined in: [src/core/rotation2.ts:1636](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1636)

Tests if this rotation is normalized (unit magnitude).

#### Parameters

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if cos² + sin² ≈ 1

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon?`): `boolean`

Defined in: [src/core/rotation2.ts:1612](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1612)

Approximate equality with wrap-around handling using relative tolerance.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to compare

##### epsilon?

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if rotations are equivalent within tolerance

#### Remarks

First tries fast component comparison with relative tolerance, then falls
back to angle comparison for edge cases near ±180°.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/rotation2.ts:1031](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1031)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

First rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Second rotation

#### Returns

`boolean`

True if cos and sin are exactly identical

#### Remarks

Use [nearEquals](#nearequals-1) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:1136](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1136)

Tests if any component is infinite (±Infinity).

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

#### Returns

`boolean`

True if cos or sin is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-1) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:1120](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1120)

Tests if any component is NaN.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

#### Returns

`boolean`

True if cos or sin is NaN

#### Since

0.7.0

---

### isFinite()

> `static` **isFinite**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:1108](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1108)

Tests if both components are finite numbers.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

#### Returns

`boolean`

True if both cos and sin are finite

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`rotation`, `epsilon?`): `boolean`

Defined in: [src/core/rotation2.ts:1082](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1082)

Tests if a rotation is the identity.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if rotation is identity

#### Remarks

Uses [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) as default tolerance. Checks cos ≈ 1 and sin ≈ 0.

#### Since

0.7.0

---

### isNormalized()

> `static` **isNormalized**(`rotation`, `epsilon?`): `boolean`

Defined in: [src/core/rotation2.ts:1095](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1095)

Tests if a rotation is normalized (unit magnitude).

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if |cos² + sin² - 1| < epsilon

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon?`): `boolean`

Defined in: [src/core/rotation2.ts:1051](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1051)

Approximate equality between two rotations using relative tolerance.

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

First rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Second rotation

##### epsilon?

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if rotations are equivalent within tolerance

#### Remarks

First tries fast component comparison with relative tolerance, then falls
back to angle comparison for edge cases near ±180°. The angle difference
is computed inline using cross/dot products (not via angleDifference).

#### Default Value

`EPSILON`

#### Since

0.7.0

## Computed

### angleTo()

> **angleTo**(`other`): `number`

Defined in: [src/core/rotation2.ts:1783](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1783)

Compute the signed angle from this rotation to another.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Target rotation

#### Returns

`number`

Signed angle in radians

#### Example

```typescript
const a = Rotation2.fromAngle(0);
const b = Rotation2.fromAngle(Math.PI / 2);
a.angleTo(b); // ≈ π/2
```

#### See

[Rotation2.angleBetween](#anglebetween) - Static equivalent

#### Since

0.7.0

---

### angle()

> `static` **angle**(`rotation`): `number`

Defined in: [src/core/rotation2.ts:1155](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1155)

Returns the angle in radians.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to get angle from

#### Returns

`number`

Angle in radians

#### Since

0.7.0

---

### angleBetween()

> `static` **angleBetween**(`a`, `b`): `number`

Defined in: [src/core/rotation2.ts:1184](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1184)

Computes the signed angle from rotation `a` to rotation `b`.

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Source rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Target rotation

#### Returns

`number`

Signed angle in radians from a to b

#### Remarks

Returns the smallest signed angle (in radians) that rotates `a` into `b`.
Equivalent to the angle of `b * inverse(a)` but avoids allocating an
intermediate Rotation2.

Positive values indicate counter-clockwise rotation, negative values
indicate clockwise rotation. The result is in the range (-π, π].

#### Example

```typescript
const a = Rotation2.fromAngle(0);
const b = Rotation2.fromAngle(Math.PI / 2);
Rotation2.angleBetween(a, b); // ≈ π/2
```

#### Since

0.7.0

## Constant

### EIGHTH_TURN

> `readonly` `static` **EIGHTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:277](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L277)

45° rotation (π/4).

#### Since

0.7.0

---

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/rotation2.ts:246](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L246)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### HALF_TURN

> `readonly` `static` **HALF_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:260](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L260)

180° rotation.

#### Since

0.7.0

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:239](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L239)

Identity rotation (0°).

#### Since

0.7.0

---

### NEGATIVE_QUARTER

> `readonly` `static` **NEGATIVE_QUARTER**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:305](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L305)

-90° rotation (clockwise quarter turn).

#### See

[THREE_QUARTER_TURN](#three_quarter_turn) - Same rotation, named as 270° CCW

#### Since

0.7.0

---

### QUARTER_TURN

> `readonly` `static` **QUARTER_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:253](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L253)

90° counter-clockwise rotation.

#### Since

0.7.0

---

### SIXTEENTH_TURN

> `readonly` `static` **SIXTEENTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:295](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L295)

22.5° rotation (π/8).

#### Since

0.7.0

---

### SIXTH_TURN

> `readonly` `static` **SIXTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:312](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L312)

60° rotation (π/3).

#### Since

0.7.0

---

### THREE_QUARTER_TURN

> `readonly` `static` **THREE_QUARTER_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:268](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L268)

270° counter-clockwise rotation (90° clockwise).

#### See

[NEGATIVE_QUARTER](#negative_quarter) - Same rotation, named as clockwise quarter turn

#### Since

0.7.0

---

### TWELFTH_TURN

> `readonly` `static` **TWELFTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:286](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L286)

30° rotation (π/6).

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/rotation2.ts:2019](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L2019)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding cos then sin

#### Example

```typescript
const [cos, sin] = Rotation2.fromAngle(Math.PI / 4);
```

#### Since

0.7.0

---

### clone()

> **clone**(): `Rotation2`

Defined in: [src/core/rotation2.ts:2003](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L2003)

Creates a deep copy of this rotation.

#### Returns

`Rotation2`

New Rotation2 with identical values

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 4);
const copy = r.clone();
copy.identity(); // Original unchanged
```

#### Since

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): \[`number`, `number`\] \| `T`

Defined in: [src/core/rotation2.ts:1920](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1920)

Writes to array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

#### Parameters

##### out?

`T`

Optional destination array. If not provided, returns a new tuple

##### offset?

`number` = `0`

Write offset.

#### Returns

\[`number`, `number`\] \| `T`

The output array, or a new tuple if no output was provided

#### Default Value

`0`

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 4);
const [cos, sin] = r.toArray();

// Write to existing array
const arr = new Float32Array(10);
r.toArray(arr, 4); // writes at indices 4, 5
```

#### Since

0.7.0

---

### toComplex()

> **toComplex**(`out?`): [`Complex`](Complex.md)

Defined in: [src/core/rotation2.ts:1853](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1853)

Converts the rotation to a complex number.

#### Parameters

##### out?

[`Complex`](Complex.md)

Optional output complex number

#### Returns

[`Complex`](Complex.md)

Complex representation of the rotation

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 4);
const c = r.toComplex();
// c.real ≈ 0.7071, c.imag ≈ 0.7071
```

#### Since

0.7.0

---

### toJSON()

> **toJSON**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1965](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1965)

Converts the rotation to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Object suitable for JSON serialization

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 2);
const json = JSON.stringify(r);
// '{"cos":0,"sin":1}'
```

#### Since

0.7.0

---

### toMatrix2()

> **toMatrix2**(`out?`): [`Matrix2`](Matrix2.md)

Defined in: [src/core/rotation2.ts:1892](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1892)

Converts the rotation to a 2×2 rotation matrix.

#### Parameters

##### out?

[`Matrix2`](Matrix2.md)

Optional output matrix

#### Returns

[`Matrix2`](Matrix2.md)

Matrix2 representing this rotation

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 2);
const m = r.toMatrix2();
// m ≈ [0, 1, -1, 0]
```

#### Since

0.7.0

---

### toObject()

> **toObject**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1946](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1946)

Converts the rotation to a plain object.

#### Returns

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Object with cos and sin properties

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 2);
const obj = r.toObject();
// { cos: 0, sin: 1 }
```

#### Since

0.7.0

---

### toString()

> **toString**(`precision?`): `string`

Defined in: [src/core/rotation2.ts:1985](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1985)

Creates a human-readable string representation.
Shows the angle in degrees for clarity.

#### Parameters

##### precision?

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

Formatted string

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 2);
console.log(r.toString());
// "Rotation2(90.0000°)"
```

#### Since

0.7.0

---

### toVector2()

> **toVector2**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1873](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1873)

Converts the rotation to a unit vector.

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Vector2 pointing in the rotation direction

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 2);
const v = r.toVector2();
// v.x ≈ 0, v.y ≈ 1
```

#### Since

0.7.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:626](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L626)

Creates a deep copy of a rotation.

#### Parameters

##### source

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to clone

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

A Rotation2 with identical values

#### Remarks

Normalizes the cloned values to enforce the unit-length invariant, since the
source is a ReadonlyRotation2Like that may not be unit-length. Use instance
clone() for bit-identical copies of validated Rotation2 objects.

#### Example

```typescript
const original = Rotation2.fromAngle(Math.PI / 4);
const cloned = Rotation2.clone(original); // independent copy
const reused = Rotation2.clone(original, out); // reuse existing instance
```

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Rotation2`

Defined in: [src/core/rotation2.ts:652](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L652)

Copies values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Source rotation (must be pre-normalized)

##### destination

`Rotation2`

Target rotation to receive the copy

#### Returns

`Rotation2`

The destination rotation

#### Remarks

Unlike [clone](#clone-1) and [set()](#set), this method does NOT
normalize the input components. The source must already be unit-length.
Use [fromCS](#fromcs) or [set()](#set) if normalization is needed.

#### Example

```typescript
const source = Rotation2.fromAngle(Math.PI / 2);
const dest = new Rotation2();
Rotation2.copy(source, dest); // dest now matches source
```

#### Since

0.7.0

---

### fromAngle()

> `static` **fromAngle**(`angle`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:335](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L335)

Creates a rotation from an angle in radians.

#### Parameters

##### angle

`number`

Angle in radians

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation representing the given angle

#### Example

```typescript
const rot90 = Rotation2.fromAngle(Math.PI / 2); // 90° CCW
const rot180 = Rotation2.fromAngle(Math.PI); // 180°
```

#### Since

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset?`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:594](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L594)

Creates a rotation from a flat array [cos, sin].

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array

##### offset?

`number` = `0`

Index offset.

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from array

#### Default Value

`0`

#### Throws

If offset is out of bounds

#### Example

```typescript
Rotation2.fromArray([0.707, 0.707]); // 45° rotation
Rotation2.fromArray([0, 1, 0, -1], 2); // -90° rotation from offset 2
```

#### Since

0.7.0

---

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:472](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L472)

Creates a rotation from a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number (will be normalized)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from the complex number

#### Remarks

Zero-magnitude input produces identity rotation (cos=1, sin=0) after normalization.

#### Example

```typescript
const c = new Complex(3, 4);
const rot = Rotation2.fromComplex(c); // normalized to unit rotation
const reused = Rotation2.fromComplex(c, out); // reuse existing instance
```

#### See

[fromComplexSafe](#fromcomplexsafe) - Returns identity on zero magnitude

#### Since

0.7.0

---

### fromComplexSafe()

> `static` **fromComplexSafe**(`complex`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:500](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L500)

Creates a rotation from a complex number (safe).

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from the complex, or identity if magnitude is near zero

#### Example

```typescript
const c = new Complex(3, 4);
const rot = Rotation2.fromComplexSafe(c); // normalized to unit rotation

const zero = new Complex(0, 0);
const fallback = Rotation2.fromComplexSafe(zero); // identity (cos=1, sin=0)
const reused = Rotation2.fromComplexSafe(c, out); // reuse existing instance
```

#### See

[fromComplex](#fromcomplex) - Strict variant (also returns identity for zero magnitude)

#### Since

0.7.0

---

### fromCS()

> `static` **fromCS**(`cos`, `sin`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:371](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L371)

Creates a rotation from pre-computed cos/sin values.

#### Parameters

##### cos

`number`

Pre-computed cosine of the angle

##### sin

`number`

Pre-computed sine of the angle

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation with the given cos/sin

#### Remarks

Internally calls [set()](#set), which normalizes the (cos, sin) pair
to unit length. If you need exact cos/sin values without normalization, use the
constructor directly: `new Rotation2(cos, sin)`.

#### Example

```typescript
const { cos, sin } = sinCos(Math.PI / 4);
const rot = Rotation2.fromCS(cos, sin); // 45° rotation
const reused = Rotation2.fromCS(cos, sin, out); // reuse existing instance
```

#### Since

0.7.0

---

### fromMatrix2()

> `static` **fromMatrix2**(`matrix`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:527](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L527)

Creates a rotation from a 2×2 matrix by extracting the rotation components.

#### Parameters

##### matrix

[`ReadonlyMatrix2Like`](../../types/interfaces/ReadonlyMatrix2Like.md)

Source matrix

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation extracted from the matrix

#### Remarks

Extracts the rotation via `set(m00, m01)` which normalizes using hypot,
not atan2. This is the inverse of [Rotation2.prototype.toMatrix2](#tomatrix2).

#### Example

```typescript
const m = Matrix2.fromRotation(Math.PI / 4);
const r = Rotation2.fromMatrix2(m); // ≈ 45° rotation
```

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:546](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L546)

Creates a rotation from a plain object.

#### Parameters

##### object

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Object with cos and sin properties

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from the object

#### Example

```typescript
const rot = Rotation2.fromObject({ cos: 0, sin: 1 }); // 90° rotation
const reused = Rotation2.fromObject({ cos: 0, sin: 1 }, out); // reuse existing instance
```

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`cos`, `sin`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:573](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L573)

Creates a rotation from individual cos and sin values.

#### Parameters

##### cos

`number`

Cosine component

##### sin

`number`

Sine component

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from the values

#### Remarks

Internally calls [set](#set), which normalizes the (cos, sin) pair to unit length.
For creating a rotation from an angle, use [fromAngle](#fromangle).

#### Example

```typescript
Rotation2.fromValues(1, 0); // Identity (0°)
Rotation2.fromValues(0, 1); // 90° rotation
Rotation2.fromValues(0.707, 0.707); // ~45° rotation
```

#### Since

0.7.0

---

### fromVector2()

> `static` **fromVector2**(`direction`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:391](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L391)

Creates a rotation from a direction vector.

#### Parameters

##### direction

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Direction vector (will be normalized)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation pointing in the direction of the vector

#### Example

```typescript
const dir = { x: 3, y: 4 };
const rot = Rotation2.fromVector2(dir); // rotation toward (3,4)
const reused = Rotation2.fromVector2(dir, out); // reuse existing instance
```

#### Since

0.7.0

---

### fromVectors2()

> `static` **fromVectors2**(`from`, `to`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:422](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L422)

Creates a rotation that transforms one direction to another.

#### Parameters

##### from

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Starting direction (Vector2)

##### to

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target direction (Vector2)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation that transforms 'from' to 'to'

#### Example

```typescript
const from = { x: 1, y: 0 };
const to = { x: 0, y: 1 };
const rot = Rotation2.fromVectors2(from, to); // 90° CCW
const reused = Rotation2.fromVectors2(from, to, out); // reuse existing instance
```

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1800](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1800)

Linear interpolation towards another rotation in place.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Target rotation

##### t

`number`

Interpolation factor (not clamped, allows extrapolation)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1817](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1817)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Target rotation

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

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1830](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1830)

Smooth step interpolation towards another rotation in place.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Target rotation

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:952](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L952)

Linear interpolation between two rotations.

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Start rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

End rotation

##### t

`number`

Interpolation factor (not clamped; allows extrapolation which is linear in angle space and may wrap for large |t|)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Interpolated rotation

#### Remarks

For unit complex numbers in 2D (SO(2)), lerp via angle interpolation IS
equivalent to slerp. Unlike 3D quaternions where lerp and slerp differ,
in 2D the shortest-path angular interpolation produces the same result
as spherical interpolation on the unit circle.

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:973](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L973)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Start rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

End rotation

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Interpolated rotation

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`from`, `to`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:1005](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1005)

Smooth interpolation between two rotations using smoothStep easing.

#### Parameters

##### from

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Source rotation

##### to

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Target rotation

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Smoothly interpolated rotation

#### Remarks

Uses Hermite smoothStep for ease-in-out effect.
Equivalent to `lerp(from, to, smoothStep(0, 1, clamp(t, 0, 1)))`.

#### Example

```typescript
const r1 = Rotation2.fromAngle(0);
const r2 = Rotation2.fromAngle(Math.PI / 2);
const smooth = Rotation2.smoothStep(r1, r2, 0.5); // Smooth interpolation
```

#### Since

0.7.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/rotation2.ts:1239](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1239)

Copies values from another rotation.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Source rotation

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### identity()

> **identity**(): `this`

Defined in: [src/core/rotation2.ts:1252](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1252)

Resets to identity rotation (0°).

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`cos`, `sin`): `this`

Defined in: [src/core/rotation2.ts:1201](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1201)

Sets the cos and sin components (will be normalized).

#### Parameters

##### cos

`number`

Cosine component

##### sin

`number`

Sine component

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setAngle()

> **setAngle**(`angle`): `this`

Defined in: [src/core/rotation2.ts:1223](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1223)

Sets the rotation from an angle.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### cos

> **cos**: `number`

Defined in: [src/core/rotation2.ts:162](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L162)

Cosine component of the rotation.
For a rotation of angle θ, this equals cos(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`cos`](../../types/interfaces/Rotation2Like.md#cos)

---

### sin

> **sin**: `number`

Defined in: [src/core/rotation2.ts:163](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L163)

Sine component of the rotation.
For a rotation of angle θ, this equals sin(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`sin`](../../types/interfaces/Rotation2Like.md#sin)

## Transform

### apply()

> **apply**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1556](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1556)

Applies this rotation to a vector.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Rotated vector

#### Since

0.7.0

---

### applyInverse()

> **applyInverse**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1574](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1574)

Applies the inverse rotation to a vector.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate inversely

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inversely rotated vector

#### Remarks

Mathematically equivalent to `Vector2.rotateCS(vector, this.cos, -this.sin, out)`.
Implemented inline for performance in hot paths.

#### Since

0.7.0

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/rotation2.ts:1283](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1283)

Normalizes this rotation to unit length.

#### Returns

`this`

This for chaining

#### Remarks

Unlike other strict-tier operations, this method does not throw for
zero-magnitude input. Instead, it returns the identity rotation (cos=1, sin=0),
matching the behavior of [normalizeSafe](#normalizesafe-1). This is an intentional exception
to the triality pattern: for rotations, identity is always a mathematically
valid fallback, and throwing would force error handling where the only sensible
recovery is using identity.

#### Example

```typescript
const rot = new Rotation2(0.998, 0.065);
rot.normalize(); // cos² + sin² ≈ 1
```

#### See

- [normalizeSafe](#normalizesafe-1) - Functionally identical for zero-magnitude input
- [normalizeUnchecked](#normalizeunchecked-1) - No validation

#### Since

0.7.0

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/rotation2.ts:1319](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1319)

Safe normalization that handles zero-magnitude rotations.

#### Returns

`this`

This for chaining

#### Remarks

Both [normalize](#normalize-1) and `normalizeSafe` return the identity rotation
`(cos=1, sin=0)` for zero-magnitude input. The difference is that
`normalizeSafe` makes the fallback behavior explicit via its API contract,
whereas `normalize` delegates to an internal helper that silently returns identity.
This is useful for accumulated rotations that may drift due to floating-point errors.

#### Example

```typescript
const rot = new Rotation2(0.9999, 0.0001);
rot.normalizeSafe(); // Safely normalizes
```

#### See

[normalize](#normalize-1) - Strict variant (also returns identity for zero magnitude)

#### Since

0.7.0

---

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/rotation2.ts:1346](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L1346)

Unchecked normalization for hot paths.

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Rotation must have non-zero magnitude.

#### See

- [normalize](#normalize-1) - Strict variant (also returns identity for zero magnitude)
- [normalizeSafe](#normalizesafe-1) - Returns identity on zero magnitude

#### Since

0.7.0

---

### apply()

> `static` **apply**(`rotation`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:888](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L888)

Applies a rotation to a vector.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to apply

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Rotated vector

#### Remarks

- Use `Rotation2.apply` for pure rotation (operator semantics).
- Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
- Mathematically equivalent to `Vector2.rotateCS(vector, rotation.cos, rotation.sin, out)`.

#### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 4);
const v = { x: 1, y: 0 };
const rotated = Rotation2.apply(rot, v); // (0.707, 0.707)
```

#### Since

0.7.0

---

### applyInverse()

> `static` **applyInverse**(`rotation`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:920](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L920)

Applies the inverse rotation to a vector.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation whose inverse to apply

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate inversely

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inversely rotated vector

#### Remarks

- Use `Rotation2.applyInverse` for pure rotation (operator semantics).
- Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
- Mathematically equivalent to rotating by the negated angle.

#### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 4);
const v = { x: 0.707, y: 0.707 };
const original = Rotation2.applyInverse(rot, v); // ≈ (1, 0)
```

#### Since

0.7.0

---

### normalize()

> `static` **normalize**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:684](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L684)

Normalizes a rotation to ensure cos² + sin² = 1.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to normalize

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Normalized rotation

#### Remarks

Unlike other strict-tier operations, this method does not throw for
zero-magnitude input. Instead, it returns the identity rotation (cos=1, sin=0),
matching the behavior of [normalizeSafe](#normalizesafe-1). This is an intentional exception
to the triality pattern: for rotations, identity is always a mathematically
valid fallback.

#### Example

```typescript
const drifted = new Rotation2(0.998, 0.065);
const unit = Rotation2.normalize(drifted); // cos² + sin² ≈ 1
```

#### See

- [normalizeSafe](#normalizesafe-1) - Functionally identical for zero-magnitude input
- [normalizeUnchecked](#normalizeunchecked-1) - No validation

#### Since

0.7.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:719](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L719)

Safe normalization that handles zero-magnitude rotations.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to normalize

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Normalized rotation, or identity if input has zero magnitude

#### Remarks

Both [normalize](#normalize-1) and `normalizeSafe` return the identity rotation
`(cos=1, sin=0)` for zero-magnitude input. The difference is that
`normalizeSafe` makes the fallback behavior explicit via its API contract,
whereas `normalize` delegates to an internal helper that silently returns identity.
The identity rotation is the neutral element for rotation composition —
applying it leaves vectors unchanged. This is useful for accumulated
rotations that may drift due to floating-point errors.

#### Example

```typescript
const drifted = new Rotation2(0.0000001, 0); // Nearly zero
const safe = Rotation2.normalizeSafe(drifted); // Returns IDENTITY
```

#### See

[normalize](#normalize-1) - Strict variant (also returns identity for zero magnitude)

#### Since

0.7.0

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:752](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/rotation2.ts#L752)

Unchecked normalization for hot paths.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to normalize (must have non-zero magnitude)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Normalized rotation

#### Remarks

**Precondition:** Rotation must have non-zero magnitude.
Calling with zero-magnitude produces Infinity/NaN.

Use in performance-critical code where rotation validity is guaranteed.

#### See

- [normalize](#normalize-1) - Strict variant (also returns identity for zero magnitude)
- [normalizeSafe](#normalizesafe-1) - Returns identity on zero magnitude

#### Since

0.7.0
