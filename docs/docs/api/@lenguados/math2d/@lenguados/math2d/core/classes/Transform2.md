# Class: Transform2

Defined in: [src/core/transform2.ts:119](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L119)

Decomposed 2D affine transform applied in Scale → Rotate → Translate order.

## Remarks

- **Design:** Decomposed SRT (Scale → Rotate → Translate) transform. Stores
  `position` (Vector2), `rotation` (Rotation2), and `scale` (Vector2) as separate
  components. Instance methods are mutable and chainable; static methods are pure.
- **Numerics:** Inverse computation uses the SRT decomposition formula. Non-uniform
  scale inverse is an approximation; use `inverseTransformPoint` for exact results.
- **Safety:** "Safe" variants return identity transform instead of throwing on
  non-invertible transforms (zero scale).

## Example

```typescript
// Create and compose transforms
const t = new Transform2();
t.setPosition(10, 20)
 .setRotation(Math.PI / 4)
 .setScale(2, 2);

// Apply to a point
const worldPoint = Transform2.transformPoint(t, localPoint);
```

## Since

0.7.0

## Implements

- [`Transform2Like`](../../types/interfaces/Transform2Like.md)

## Constructors

### Constructor

> **new Transform2**(`position?`, `rotation?`, `scale?`): `Transform2`

Defined in: [src/core/transform2.ts:216](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L216)

Creates a new Transform2 with the given position, rotation, and scale.

#### Parameters

##### position?

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Initial translation.

##### rotation?

`number` = `0`

Initial rotation angle in radians.

##### scale?

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Initial scale factors.

#### Returns

`Transform2`

#### Default Value

`{ x: 0, y: 0 }`

#### Default Value

`0`

#### Default Value

`{ x: 1, y: 1 }`

## Accessor

### rotation

> `readonly` **rotation**: [`Rotation2`](Rotation2.md)

Defined in: [src/core/transform2.ts:151](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L151)

The rotation component. Use rotation.angle, rotation.angleDegrees, etc.
for convenient access, or rotation.cos/sin for direct component access.

#### Remarks

The rotation is stored as a separate [Rotation2](Rotation2.md) instance rather than
a raw angle. All rotation logic lives in Rotation2, following Box2D's
b2Transform/b2Rot separation pattern for clean responsibility boundaries.

#### Example

```typescript
// Convenience (delegates to Rotation2)
transform.rotation.angle = Math.PI / 4;
console.log(transform.rotation.angleDegrees); // 45

// Direct component access
const { cos, sin } = transform.rotation;

// In-place mutations (zero allocation)
transform.rotation.setAngle(Math.PI);
transform.rotation.multiply(other.rotation);
```

#### Since

0.7.0

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`rotation`](../../types/interfaces/Transform2Like.md#rotation)

---

### direction

#### Get Signature

> **get** **direction**(): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1963](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1963)

Returns the rotation as a unit Vector2 (direction).

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Direction vector

---

### inverted

#### Get Signature

> **get** **inverted**(): `Transform2`

Defined in: [src/core/transform2.ts:1952](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1952)

Returns the inverse without modifying this transform.

##### Since

0.7.0

##### Returns

`Transform2`

New inverse transform

---

### rotationDegrees

#### Get Signature

> **get** **rotationDegrees**(): `number`

Defined in: [src/core/transform2.ts:1975](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1975)

Returns the rotation in degrees.

##### Since

0.7.0

##### Returns

`number`

Rotation in degrees

## Arithmetic

### inverse()

> **inverse**(): `this`

Defined in: [src/core/transform2.ts:1770](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1770)

Inverts this transform in place.

#### Returns

`this`

This for chaining

#### Remarks

**Non-uniform scale warning:** See static [Transform2.inverse](#inverse-2) for
details on SRT approximation.

#### Throws

If scale.x or scale.y is near zero

#### See

- [inverseSafe](#inversesafe-2) - Sets to identity instead of throwing
- [inverseUnchecked](#inverseunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/transform2.ts:1802](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1802)

Inverts this transform in place, setting to identity if non-invertible.

#### Returns

`this`

This for chaining

#### See

[inverse](#inverse-2) - Throws on non-invertible transform

#### Since

0.7.0

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/transform2.ts:1823](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1823)

Inverts this transform in place without validation.

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `scale.x ≠ 0` and `scale.y ≠ 0`.

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/transform2.ts:1731](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1731)

Multiplies with another transform (composition) in place.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### inverse()

> `static` **inverse**(`transform`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:577](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L577)

Calculates the inverse of a transform.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to invert

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Inverse transform

#### Remarks

**Non-uniform scale warning:** This inversion is an APPROXIMATION when
`scale.x !== scale.y`. The SRT representation cannot exactly represent
the true inverse linear part `(R · S)⁻¹ = S⁻¹ · R⁻¹` because the SRT
format forces `R_inv · S_inv = R⁻¹ · S⁻¹`. For exact point inverse
transformation, use [inverseTransformPoint](#inversetransformpoint-2). For exact full inverse,
convert to Matrix3 via [toMatrix3](#tomatrix3) and use [Matrix3.inverse](Matrix3.md#inverse-2).
This is a common SRT limitation documented by engines such as DigitalRune.

#### Throws

If scale.x or scale.y is near zero (non-invertible)

#### See

- [inverseSafe](#inversesafe-2) - Returns identity instead of throwing
- [inverseUnchecked](#inverseunchecked-2) - No validation, for hot paths
- [inverseTransformPoint](#inversetransformpoint-2) - Exact point inverse (no SRT approximation)

#### Since

0.7.0

---

### inverseSafe()

> `static` **inverseSafe**(`transform`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:622](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L622)

Calculates the inverse of a transform, returning identity if non-invertible.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to invert

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Inverse transform, or identity if scale is near zero

#### Remarks

Uses [isNearZero](../../auxiliary/scalar/functions/isNearZero.md) with default [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) on each scale
component. Returns identity when either |scale.x| or |scale.y| ≤ EPSILON.

**Non-uniform scale warning:** See [inverse](#inverse-2) for details on SRT
approximation. Use [inverseTransformPoint](#inversetransformpoint-2) for exact point inverse.

#### See

- [inverse](#inverse-2) - Throws on non-invertible transform
- [inverseUnchecked](#inverseunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`transform`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:669](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L669)

Calculates the inverse of a transform without validation.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to invert (must have non-zero scale)

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Inverse transform

#### Remarks

**Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
Calling with zero scale produces `Infinity`/`NaN` in the result.

**Non-uniform scale warning:** See [inverse](#inverse-2) for details on SRT
approximation. Use [inverseTransformPoint](#inversetransformpoint-2) for exact point inverse.

#### See

- [inverse](#inverse-2) - Throws on non-invertible transform
- [inverseSafe](#inversesafe-2) - Returns identity instead of throwing

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:531](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L531)

Multiplies two transforms: applies b in the local space of a.

#### Parameters

##### a

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

First transform (parent/outer transform)

##### b

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Second transform (child/inner transform)

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Combined transform

#### Remarks

**⚠️ Non-uniform scale limitation:**
This operation assumes no shear in the transforms. When composing
transforms with non-uniform scale (scale.x ≠ scale.y) followed by
rotation, the mathematical result would include shear, which
Transform2 cannot represent (it only stores position, rotation, scale).

The resulting transform is an approximation that preserves:

- Combined rotation (a.rotation + b.rotation)
- Combined scale (a.scale \* b.scale)
- Correctly transformed position

For exact composition with non-uniform scale, use [Matrix3](Matrix3.md) instead:

```typescript
const m = Matrix3.multiply(Matrix3.fromTransform2(a), Matrix3.fromTransform2(b));
```

This limitation mirrors Box2D's design, which uses b2Transform with
only position and rotation (no scale) to avoid this issue entirely.

#### See

[Transform2.hasUniformScale](#hasuniformscale-2) to check for uniform scaling

#### Since

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/transform2.ts:1857](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1857)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to compare

#### Returns

`boolean`

True if exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/transform2.ts:1908](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1908)

Returns true if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any ±Infinity value exists

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/transform2.ts:1897](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1897)

Returns true if any component is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.7.0

---

### hasNegativeScale()

> **hasNegativeScale**(): `boolean`

Defined in: [src/core/transform2.ts:1425](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1425)

Tests if scale has negative components.

#### Returns

`boolean`

True if any scale component is negative

#### Since

0.7.0

---

### hasUniformScale()

> **hasUniformScale**(`epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1414](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1414)

Tests if scale is uniform (x equals y).

#### Parameters

##### epsilon

`number` = `EPSILON`

Relative tolerance (default: EPSILON)

#### Returns

`boolean`

True if uniform scale

#### Remarks

Uses relative tolerance for comparing scale components.

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/transform2.ts:1886](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1886)

Returns true if all components are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1932](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1932)

Tests if this transform is identity.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if identity

#### Since

0.7.0

---

### isInvertible()

> **isInvertible**(`epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1920](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1920)

Tests if this transform is invertible.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if transform can be inverted (non-zero scale)

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1875](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1875)

Approximate equality using relative tolerance for position and scale.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to compare

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if within epsilon

#### Remarks

Position and scale use relative tolerance. Rotation uses absolute tolerance
since angles are bounded to a fixed range.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/transform2.ts:1152](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1152)

Exact equality (bit-identical).

#### Parameters

##### a

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

First transform

##### b

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Second transform

#### Returns

`boolean`

True if exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`transform`): `boolean`

Defined in: [src/core/transform2.ts:1252](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1252)

Tests if any component is infinite (±Infinity).

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test

#### Returns

`boolean`

True if any component is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`transform`): `boolean`

Defined in: [src/core/transform2.ts:1234](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1234)

Tests if any component is NaN.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### hasNegativeScale()

> `static` **hasNegativeScale**(`transform`): `boolean`

Defined in: [src/core/transform2.ts:1318](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1318)

Tests if transform has negative scale components.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to test

#### Returns

`boolean`

True if any scale component is negative

#### Example

```typescript
Transform2.hasNegativeScale({ position: ..., rotation: 0, scale: { x: -1, y: 1 } }); // true
Transform2.hasNegativeScale({ position: ..., rotation: 0, scale: { x: 1, y: 1 } });  // false
```

#### Since

0.7.0

---

### hasUniformScale()

> `static` **hasUniformScale**(`transform`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1297](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1297)

Tests if transform has uniform scale.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to test

##### epsilon

`number` = `EPSILON`

Tolerance for comparison

#### Returns

`boolean`

True if scale.x ≈ scale.y

#### Remarks

Uses relative tolerance for comparing scale components.

#### Example

```typescript
Transform2.hasUniformScale({ position: ..., rotation: 0, scale: { x: 2, y: 2 } }); // true
Transform2.hasUniformScale({ position: ..., rotation: 0, scale: { x: 2, y: 3 } }); // false
```

#### Since

0.7.0

---

### isFinite()

> `static` **isFinite**(`transform`): `boolean`

Defined in: [src/core/transform2.ts:1218](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1218)

Tests if both position and scale components are finite.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test

#### Returns

`boolean`

True if all components are finite

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`transform`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1201](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1201)

Tests if a transform is the identity.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if identity

#### Remarks

Uses [EPSILON](../../auxiliary/scalar/variables/EPSILON.md) (1e-10) as default tolerance. Checks position ≈ (0,0),
rotation ≈ identity, and scale ≈ (1,1).

#### Since

0.7.0

---

### isInvertible()

> `static` **isInvertible**(`transform`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1274](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1274)

Tests if transform is invertible (has non-zero scale).

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if transform can be inverted

#### Remarks

A transform is invertible when both scale components are non-zero.
This follows the Eigen C++ convention for matrix invertibility.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1175](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1175)

Approximate equality using relative tolerance for position and scale.

#### Parameters

##### a

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

First transform

##### b

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Second transform

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if within epsilon

#### Remarks

Position and scale use relative tolerance. Rotation uses absolute tolerance
since angles are bounded to a fixed range.

#### Default Value

`EPSILON`

#### Since

0.7.0

## Computed

### determinant()

> **determinant**(): `number`

Defined in: [src/core/transform2.ts:1436](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1436)

Returns the determinant (scale.x \* scale.y).

#### Returns

`number`

Determinant value

#### Since

0.7.0

---

### determinant()

> `static` **determinant**(`transform`): `number`

Defined in: [src/core/transform2.ts:1335](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1335)

Returns the determinant (scale.x \* scale.y).

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to compute determinant for

#### Returns

`number`

Determinant of the transform

#### Example

```typescript
Transform2.determinant({ position: ..., rotation: 0, scale: { x: 2, y: 3 } }); // 6
```

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `5` = `5`

Defined in: [src/core/transform2.ts:189](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L189)

Number of elements when serialized to an array (x, y, angle, sx, sy).

#### Since

0.7.0

---

### FLIP_X

> `readonly` `static` **FLIP_X**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:196](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L196)

Flip horizontally (scale.x = -1).

#### Since

0.7.0

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:203](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L203)

Flip vertically (scale.y = -1).

#### Since

0.7.0

---

### IDENTITY

> `readonly` `static` **IDENTITY**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:182](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L182)

Identity transform (no transformation).

#### Since

0.7.0

## Conversion

### clone()

> **clone**(): `Transform2`

Defined in: [src/core/transform2.ts:2157](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L2157)

Creates a deep copy of this transform.

#### Returns

`Transform2`

New Transform2 with identical values

#### Example

```typescript
const t = new Transform2();
t.position.set(100, 50);
const copy = t.clone();
copy.identity(); // Original unchanged
```

#### Since

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): `T` \| \[`number`, `number`, `number`, `number`, `number`\]

Defined in: [src/core/transform2.ts:2079](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L2079)

Converts the transform to a flat array [px, py, rotation, sx, sy].

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

#### Parameters

##### out?

`T`

Optional output array

##### offset?

`number` = `0`

Write offset.

#### Returns

`T` \| \[`number`, `number`, `number`, `number`, `number`\]

Array with transform values

#### Default Value

`0`

#### Example

```typescript
const t = new Transform2({ x: 100, y: 50 }, Math.PI / 4, { x: 2, y: 2 });
const arr = t.toArray();
// [100, 50, 0.785..., 2, 2]
```

#### Since

0.7.0

---

### toJSON()

> **toJSON**(): [`Transform2Like`](../../types/interfaces/Transform2Like.md)

Defined in: [src/core/transform2.ts:2116](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L2116)

Converts the transform to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Transform2Like`](../../types/interfaces/Transform2Like.md)

Object suitable for JSON serialization

#### Example

```typescript
const t = new Transform2();
t.position.set(100, 50);
const json = JSON.stringify(t);
// '{"position":{"x":100,"y":50},"rotation":0,"scale":{"x":1,"y":1}}'
```

#### Since

0.7.0

---

### toMatrix3()

> **toMatrix3**(`out?`): [`Matrix3`](Matrix3.md)

Defined in: [src/core/transform2.ts:1452](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1452)

Converts this transform to a 3x3 matrix.

#### Parameters

##### out?

[`Matrix3`](Matrix3.md)

Optional output matrix

#### Returns

[`Matrix3`](Matrix3.md)

Matrix3 representation

#### Since

0.7.0

---

### toObject()

> **toObject**(): [`Transform2Like`](../../types/interfaces/Transform2Like.md)

Defined in: [src/core/transform2.ts:2055](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L2055)

Converts the transform to a plain object.

#### Returns

[`Transform2Like`](../../types/interfaces/Transform2Like.md)

Object with position, rotation, and scale properties

#### Example

```typescript
const t = Transform2.fromValues(100, 50, Math.PI / 4, 2, 2);
const obj = t.toObject();
// {
//   position: { x: 100, y: 50 },
//   rotation: { cos: 0.707..., sin: 0.707... },
//   scale: { x: 2, y: 2 }
// }
```

#### Since

0.7.0

---

### toRotation2()

> **toRotation2**(`out?`): [`Rotation2`](Rotation2.md)

Defined in: [src/core/transform2.ts:1477](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1477)

Converts this transform's rotation to a Rotation2.

#### Parameters

##### out?

[`Rotation2`](Rotation2.md)

Optional output rotation

#### Returns

[`Rotation2`](Rotation2.md)

Rotation2 representation of the transform's angle

#### Remarks

Useful for extracting the rotation component for reuse in hot paths,
avoiding repeated `sinCos()` calls.

#### Example

```typescript
const rot = transform.toRotation2();
// Reuse rot.cos, rot.sin for multiple operations
Vector2.rotateCS(v1, rot.cos, rot.sin, out1);
Vector2.rotateCS(v2, rot.cos, rot.sin, out2);
```

#### Since

0.7.0

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/transform2.ts:2136](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L2136)

Creates a human-readable string representation.
Shows position, rotation (in degrees), and scale.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

Formatted string

#### Example

```typescript
const t = Transform2.fromPose(100, 50, Math.PI / 4);
console.log(t.toString());
// "Transform2(pos: (100.0000, 50.0000), rot: 45.0000°, scale: (1.0000, 1.0000))"
```

#### Since

0.7.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:430](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L430)

Creates a deep copy of a transform.

#### Parameters

##### source

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to clone

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

A Transform2 with identical values

#### Example

```typescript
const original = Transform2.fromValues(10, 20, Math.PI / 4, 1, 1);
const cloned = Transform2.clone(original);

// Reuse existing transform to avoid allocation
const out = new Transform2();
Transform2.clone(original, out);
```

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Transform2`

Defined in: [src/core/transform2.ts:484](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L484)

Copies values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Source transform

##### destination

`Transform2`

Target transform to receive the copy

#### Returns

`Transform2`

The destination transform

#### Example

```typescript
const source = Transform2.fromPose(10, 20, Math.PI / 4);
const destination = new Transform2();
Transform2.copy(source, destination);
// destination now holds the same values as source
```

#### Since

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:454](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L454)

Creates a transform from a flat array [px, py, rotation, sx, sy].

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array with at least 5 elements

##### offset

`number` = `0`

Index offset.

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Transform from array

#### Default Value

`0`

#### Throws

If offset is out of bounds

#### Example

```typescript
Transform2.fromArray([100, 50, Math.PI / 4, 2, 2]); // pos=(100,50), rot=45°, scale=(2,2)
```

#### Since

0.7.0

---

### fromComponents()

> `static` **fromComponents**(`position`, `rotation`, `scale`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:325](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L325)

Creates a transform from components.

#### Parameters

##### position

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Position vector

##### rotation

Rotation (angle in radians or Rotation2Like object with cos/sin)

`number` | [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

##### scale

Scale (vector or uniform scalar)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Transform from components

#### Remarks

When passing a `ReadonlyRotation2Like` object, the angle is computed using
`atan2(rotation.sin, rotation.cos)`.

#### Example

```typescript
// Using angle
const t1 = Transform2.fromComponents({ x: 0, y: 0 }, Math.PI / 4, 1);

// Using Rotation2Like (e.g., from sinCosInto or Rotation2)
const rot = { cos: 0.707, sin: 0.707 };
const t2 = Transform2.fromComponents({ x: 0, y: 0 }, rot, 1);
```

#### Since

0.7.0

---

### fromMatrix3()

> `static` **fromMatrix3**(`matrix`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:291](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L291)

Creates a transform from a 3x3 matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

Source Matrix3

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Decomposed transform

#### Example

```typescript
const matrix = Matrix3.fromTransform2(someTransform);
const t = Transform2.fromMatrix3(matrix);

// Reuse existing transform to avoid allocation
const out = new Transform2();
Transform2.fromMatrix3(matrix, out);
```

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:396](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L396)

Creates a transform from a plain object.

#### Parameters

##### object

[`Transform2Like`](../../types/interfaces/Transform2Like.md)

Object with position, rotation, and scale

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Transform from object

#### Example

```typescript
const obj = { position: { x: 5, y: 10 }, rotation: { cos: 1, sin: 0 }, scale: { x: 2, y: 2 } };
const t = Transform2.fromObject(obj);

// Reuse existing transform to avoid allocation
const out = new Transform2();
Transform2.fromObject(obj, out);
```

#### Since

0.7.0

---

### fromPose()

> `static` **fromPose**(`x`, `y`, `angle`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:369](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L369)

Creates a transform from a 2D pose (position + angle, uniform scale = 1).

#### Parameters

##### x

`number`

Position X

##### y

`number`

Position Y

##### angle

`number`

Rotation angle in radians

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Transform with given position and rotation, scale (1,1)

#### Example

```typescript
const t = Transform2.fromPose(100, 50, Math.PI / 4);
// position = (100, 50), rotation = 45°, scale = (1, 1)
```

#### Since

0.8.0

---

### fromValues()

> `static` **fromValues**(`x`, `y`, `rotation`, `scaleX`, `scaleY`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:257](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L257)

Creates a transform from explicit values.

#### Parameters

##### x

`number`

X position

##### y

`number`

Y position

##### rotation

`number`

Rotation in radians

##### scaleX

`number`

X scale

##### scaleY

`number`

Y scale

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Transform with specified values

#### Example

```typescript
const t = Transform2.fromValues(10, 20, Math.PI / 2, 2, 3);
// position=(10,20), rotation=90°, scale=(2,3)

// Reuse existing transform to avoid allocation
const out = new Transform2();
Transform2.fromValues(5, 5, 0, 1, 1, out);
```

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/transform2.ts:1992](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1992)

Linear interpolation towards another transform in place.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Target transform

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

Defined in: [src/core/transform2.ts:2011](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L2011)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Target transform

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

Defined in: [src/core/transform2.ts:2028](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L2028)

Smooth interpolation with another transform in place.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Target transform

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This for chaining

#### Remarks

Uses Hermite smoothStep for ease-in-out effect.

#### Since

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:1069](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1069)

Linear interpolation between two transforms.

#### Parameters

##### a

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Start transform

##### b

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

End transform

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Interpolated transform

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:1093](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1093)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Start transform

##### b

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

End transform

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Interpolated transform

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:1125](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1125)

Smooth interpolation between two transforms using smoothStep easing.

#### Parameters

##### a

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Source transform

##### b

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Target transform

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Smoothly interpolated transform

#### Remarks

Uses Hermite smoothStep for ease-in-out effect on all components.
Position and scale use linear smoothStep, rotation uses angular smoothStep.

#### Example

```typescript
const a = Transform2.IDENTITY;
const b = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
const smooth = Transform2.smoothStep(a, b, 0.5); // Smooth transition
```

#### Since

0.7.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/transform2.ts:1375](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1375)

Copies values from another transform.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Source transform

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### identity()

> **identity**(): `this`

Defined in: [src/core/transform2.ts:1389](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1389)

Resets to identity transform.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`position`, `rotation`, `scale`): `this`

Defined in: [src/core/transform2.ts:1353](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1353)

Sets all transform components.

#### Parameters

##### position

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Position vector

##### rotation

`number`

Rotation in radians

##### scale

Scale (vector or uniform scalar)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setFromMatrix3()

> **setFromMatrix3**(`matrix`): `this`

Defined in: [src/core/transform2.ts:1491](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1491)

Sets this transform from a 3x3 matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

Source Matrix3

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### position

> `readonly` **position**: [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:124](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L124)

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`position`](../../types/interfaces/Transform2Like.md#position)

---

### scale

> `readonly` **scale**: [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:152](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L152)

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`scale`](../../types/interfaces/Transform2Like.md#scale)

## Transform

### inverseTransformPoint()

> **inverseTransformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1576](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1576)

Inverse transforms a point.

#### Parameters

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to inverse transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed point

#### Throws

If transform is not invertible

#### Since

0.7.0

---

### inverseTransformPointCS()

> **inverseTransformPointCS**(`point`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1591](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1591)

Inverse transforms a point using precomputed cos/sin values.

#### Parameters

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to inverse transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed point

#### Since

0.7.0

---

### inverseTransformVector()

> **inverseTransformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1615](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1615)

Inverse transforms a vector (ignores translation).

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to inverse transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed vector

#### Remarks

Applies the inverse of the transform's rotation and scale only.
Useful for converting world directions to local directions.

#### Throws

If transform is not invertible

#### Since

0.7.0

---

### inverseTransformVectorCS()

> **inverseTransformVectorCS**(`vector`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1630](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1630)

Inverse transforms a vector using precomputed cos/sin values.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to inverse transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed vector

#### Since

0.7.0

---

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1509](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1509)

Transforms a point by applying scale, rotation, and translation.

#### Parameters

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed point

#### Since

0.7.0

---

### transformPointCS()

> **transformPointCS**(`point`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1531](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1531)

Transforms a point using precomputed cos/sin values.

#### Parameters

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed point

#### Since

0.7.0

---

### transformPoints()

> **transformPoints**(`points`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/transform2.ts:1661](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1661)

Transforms multiple points efficiently (batch operation).
Calculates sin/cos once and applies to all points.

#### Parameters

##### points

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of points to transform

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed)

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed points

#### Remarks

More efficient than calling transformPoint multiple times because
sin/cos are calculated only once. Internally uses the same math as
[transformPoint](#transformpoint-2).

#### Example

```typescript
const vertices = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)];
const worldVertices = transform.transformPoints(vertices);
```

#### Since

0.7.0

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1544](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1544)

Transforms a vector (ignores translation).

#### Parameters

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

### transformVectorCS()

> **transformVectorCS**(`vector`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1562](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1562)

Transforms a vector using precomputed cos/sin values.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Since

0.7.0

---

### transformVectors()

> **transformVectors**(`vectors`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/transform2.ts:1698](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1698)

Transforms multiple vectors efficiently (batch operation).
Calculates sin/cos once and applies to all vectors.

#### Parameters

##### vectors

readonly [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)[]

Array of vectors to transform

##### out

[`Vector2`](Vector2.md)[] = `[]`

Optional output array (will be filled/extended as needed)

#### Returns

[`Vector2`](Vector2.md)[]

Array of transformed vectors

#### Remarks

Unlike points, vectors are not affected by translation.
More efficient than calling transformVector multiple times.

#### Since

0.7.0

---

### inverseTransformPoint()

> `static` **inverseTransformPoint**(`transform`, `point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:857](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L857)

Inverse transforms a point.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply inversely

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to inverse transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed point

#### Remarks

Applies the inverse of the transform: Translate⁻¹ → Rotate⁻¹ → Scale⁻¹.
Useful for converting world coordinates to local coordinates.

#### Throws

If scale.x or scale.y is near zero

#### Example

```typescript
const t = new Transform2({ x: 10, y: 0 }, 0, { x: 2, y: 2 });
const worldPoint = { x: 12, y: 4 };
const local = Transform2.inverseTransformPoint(t, worldPoint); // (1, 2)
```

#### See

[inverseTransformPointSafe](#inversetransformpointsafe) - Returns (0,0) instead of throwing

#### Since

0.7.0

---

### inverseTransformPointCS()

> `static` **inverseTransformPointCS**(`transform`, `point`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:931](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L931)

Inverse transforms a point using precomputed cos/sin values (unchecked).

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply inversely (position and scale)

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to inverse transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed point

#### Remarks

**Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.

Use this method in hot paths where cos/sin are already computed.

#### Since

0.7.0

---

### inverseTransformPointSafe()

> `static` **inverseTransformPointSafe**(`transform`, `point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:894](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L894)

Inverse transforms a point, returning (0,0) if scale is near zero.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply inversely

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to inverse transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed point, or (0,0) if scale is near zero

#### Remarks

Use when transform may have degenerate scale and you want graceful fallback.

#### See

[inverseTransformPoint](#inversetransformpoint-2) - Throws on near-zero scale

#### Since

0.7.0

---

### inverseTransformVector()

> `static` **inverseTransformVector**(`transform`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:973](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L973)

Inverse transforms a vector (ignores translation).

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply inversely

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to inverse transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed vector

#### Remarks

Applies the inverse of the transform's rotation and scale only.
Useful for converting world directions to local directions.

#### Throws

If scale.x or scale.y is near zero

#### Example

```typescript
const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
const worldDir = { x: 0, y: 2 };
const local = Transform2.inverseTransformVector(t, worldDir); // (1, 0)
```

#### See

[inverseTransformVectorSafe](#inversetransformvectorsafe) - Returns (0,0) instead of throwing

#### Since

0.7.0

---

### inverseTransformVectorCS()

> `static` **inverseTransformVectorCS**(`transform`, `vector`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1039](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1039)

Inverse transforms a vector using precomputed cos/sin values (unchecked).

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply inversely (scale only)

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to inverse transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed vector

#### Remarks

**Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.

Use this method in hot paths where cos/sin are already computed.

#### Since

0.7.0

---

### inverseTransformVectorSafe()

> `static` **inverseTransformVectorSafe**(`transform`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1004](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L1004)

Inverse transforms a vector, returning (0,0) if scale is near zero.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply inversely

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to inverse transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inverse transformed vector, or (0,0) if scale is near zero

#### See

[inverseTransformVector](#inversetransformvector-2) - Throws on near-zero scale

#### Since

0.7.0

---

### transformPoint()

> `static` **transformPoint**(`transform`, `point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:714](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L714)

Transforms a point by a transform (applies scale, rotation, then translation).

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed point

#### Remarks

Points are affected by all components: scale, rotation, and translation.
Order of operations: Scale → Rotate → Translate.

#### Example

```typescript
const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
const p = { x: 1, y: 0 };
const result = Transform2.transformPoint(t, p); // (10, 2)
```

#### Since

0.7.0

---

### transformPointCS()

> `static` **transformPointCS**(`transform`, `point`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:754](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L754)

Transforms a point using precomputed cos/sin values.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply (position and scale only)

##### point

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Point to transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed point

#### Remarks

Use this method in hot paths where cos/sin are already computed.
Avoids redundant trigonometric calculations in loops.

#### Example

```typescript
const { cos, sin } = transform.rotation;
for (const point of points) {
 Transform2.transformPointCS(transform, point, cos, sin, out);
}
```

#### Since

0.7.0

---

### transformVector()

> `static` **transformVector**(`transform`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:792](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L792)

Transforms a vector by a transform (applies scale and rotation, no translation).

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Remarks

Vectors are NOT affected by translation (they represent directions, not positions).
Only scale and rotation are applied.

#### Example

```typescript
const t = new Transform2({ x: 10, y: 0 }, Math.PI / 2, { x: 2, y: 2 });
const v = { x: 1, y: 0 };
const result = Transform2.transformVector(t, v); // (0, 2)
```

#### Since

0.7.0

---

### transformVectorCS()

> `static` **transformVectorCS**(`transform`, `vector`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:820](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/transform2.ts#L820)

Transforms a vector using precomputed cos/sin values.

#### Parameters

##### transform

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to apply (scale only)

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to transform

##### cos

`number`

Precomputed cosine of rotation

##### sin

`number`

Precomputed sine of rotation

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Transformed vector

#### Remarks

Use this method in hot paths where cos/sin are already computed.
Avoids redundant trigonometric calculations in loops.

#### Since

0.7.0
