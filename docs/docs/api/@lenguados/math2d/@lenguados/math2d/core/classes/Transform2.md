# Class: Transform2

Defined in: [src/core/transform2.ts:92](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L92)

Decomposed 2D affine transform applied in Scale → Rotate → Translate order.

## Since

0.7.0

## Implements

- [`Transform2Like`](../../types/interfaces/Transform2Like.md)

## Constructors

### Constructor

> **new Transform2**(`position?`, `rotation?`, `scale?`): `Transform2`

Defined in: [src/core/transform2.ts:183](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L183)

#### Parameters

##### position?

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### rotation?

`number` = `0`

##### scale?

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

#### Returns

`Transform2`

## Arithmetic

### inverse()

> **inverse**(): `this`

Defined in: [src/core/transform2.ts:1603](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1603)

Inverts this transform in place.

#### Returns

`this`

This for chaining

#### Throws

If scale.x or scale.y is near zero.

#### See

- [inverseSafe](#inversesafe-2) - Sets to identity instead of throwing
- [inverseUnchecked](#inverseunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/core/transform2.ts:1633](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1633)

Inverts this transform in place, setting to identity if non-invertible.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### inverseUnchecked()

> **inverseUnchecked**(): `this`

Defined in: [src/core/transform2.ts:1653](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1653)

Inverts this transform in place without validation.

#### Returns

`this`

This for chaining

#### Remarks

**⚠️ Precondition:** `scale.x ≠ 0` and `scale.y ≠ 0`.

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/transform2.ts:1574](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1574)

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

Defined in: [src/core/transform2.ts:463](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L463)

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

#### Throws

If scale.x or scale.y is near zero (non-invertible).

#### Remarks

A transform with zero scale in any axis is not invertible.
Use [inverseSafe](#inversesafe-2) for a null-returning variant, or
[inverseUnchecked](#inverseunchecked-2) for hot paths where invertibility is guaranteed.

#### See

- [inverseSafe](#inversesafe-2) - Returns identity instead of throwing
- [inverseUnchecked](#inverseunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### inverseSafe()

> `static` **inverseSafe**(`transform`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:499](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L499)

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

#### See

- [inverse](#inverse-2) - Throws on non-invertible transform
- [inverseUnchecked](#inverseunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### inverseUnchecked()

> `static` **inverseUnchecked**(`transform`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:541](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L541)

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

**⚠️ Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.
Calling with zero scale produces `Infinity`/`NaN` in the result.

#### See

- [inverse](#inverse-2) - Throws on non-invertible transform
- [inverseSafe](#inversesafe-2) - Returns identity instead of throwing

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:423](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L423)

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

Defined in: [src/core/transform2.ts:1685](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1685)

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

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1759](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1759)

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

Defined in: [src/core/transform2.ts:1747](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1747)

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

Defined in: [src/core/transform2.ts:1702](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1702)

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

#### Default Value

`EPSILON`

#### Remarks

Position and scale use relative tolerance. Rotation uses absolute tolerance
since angles are bounded to a fixed range.

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/transform2.ts:1012](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1012)

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

Defined in: [src/core/transform2.ts:1105](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1105)

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

Defined in: [src/core/transform2.ts:1088](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1088)

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

Defined in: [src/core/transform2.ts:1170](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1170)

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

Defined in: [src/core/transform2.ts:1149](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1149)

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

Defined in: [src/core/transform2.ts:1072](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1072)

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

Defined in: [src/core/transform2.ts:1055](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1055)

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

#### Since

0.7.0

---

### isInvertible()

> `static` **isInvertible**(`transform`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1127](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1127)

Tests if transform is invertible (has non-zero scale).

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if transform can be inverted.

#### Default Value

`EPSILON`

#### Remarks

A transform is invertible when both scale components are non-zero.
This follows the Eigen C++ convention for matrix invertibility.

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1034](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1034)

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

#### Default Value

`EPSILON`

#### Remarks

Position and scale use relative tolerance. Rotation uses absolute tolerance
since angles are bounded to a fixed range.

#### Since

0.7.0

## Component

### rotation

> `readonly` **rotation**: [`Rotation2`](Rotation2.md)

Defined in: [src/core/transform2.ts:124](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L124)

The rotation component. Use rotation.angle, rotation.angleDegrees, etc.
for convenient access, or rotation.cos/sin for direct component access.

#### Remarks

## SOLID Architecture (v3)

Transform2 is a thin container. All rotation logic lives in Rotation2.
This follows Box2D's b2Transform/b2Rot separation pattern.

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

0.8.0

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`rotation`](../../types/interfaces/Transform2Like.md#rotation)

## Computed

### direction

#### Get Signature

> **get** **direction**(): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1790](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1790)

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

Defined in: [src/core/transform2.ts:1779](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1779)

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

Defined in: [src/core/transform2.ts:1802](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1802)

Returns the rotation in degrees.

##### Since

0.7.0

##### Returns

`number`

Rotation in degrees

---

### determinant()

> **determinant**(): `number`

Defined in: [src/core/transform2.ts:1285](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1285)

Returns the determinant (scale.x \* scale.y).

#### Returns

`number`

Determinant value

#### Since

0.7.0

---

### hasNegativeScale()

> **hasNegativeScale**(): `boolean`

Defined in: [src/core/transform2.ts:1274](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1274)

Tests if scale has negative components.

#### Returns

`boolean`

True if any scale component is negative

#### Since

0.7.0

---

### hasUniformScale()

> **hasUniformScale**(`epsilon`): `boolean`

Defined in: [src/core/transform2.ts:1263](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1263)

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

### determinant()

> `static` **determinant**(`transform`): `number`

Defined in: [src/core/transform2.ts:1187](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1187)

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

Defined in: [src/core/transform2.ts:161](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L161)

Number of elements when serialized to an array (x, y, angle, sx, sy).

#### Since

0.7.0

## Conversion

### toMatrix3()

> **toMatrix3**(`out?`): [`Matrix3`](Matrix3.md)

Defined in: [src/core/transform2.ts:1301](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1301)

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

### toRotation2()

> **toRotation2**(`out?`): [`Rotation2`](Rotation2.md)

Defined in: [src/core/transform2.ts:1325](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1325)

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

## Core

### FLIP_X

> `readonly` `static` **FLIP_X**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:167](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L167)

Flip horizontally (scale.x = -1).

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:175](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L175)

Flip vertically (scale.y = -1).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:154](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L154)

Identity transform (no transformation).

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:331](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L331)

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

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Transform2`

Defined in: [src/core/transform2.ts:377](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L377)

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

#### Since

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:355](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L355)

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

If offset is out of bounds.

#### Example

```typescript
Transform2.fromArray([100, 50, Math.PI / 4, 2, 2]); // pos=(100,50), rot=45°, scale=(2,2)
```

#### Since

0.7.0

---

### fromComponents()

> `static` **fromComponents**(`position`, `rotation`, `scale`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:271](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L271)

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

Defined in: [src/core/transform2.ts:238](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L238)

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

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:307](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L307)

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

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`x`, `y`, `rotation`, `scaleX`, `scaleY`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:214](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L214)

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

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/transform2.ts:1819](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1819)

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

Defined in: [src/core/transform2.ts:1838](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1838)

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

Defined in: [src/core/transform2.ts:1854](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1854)

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

Defined in: [src/core/transform2.ts:931](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L931)

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

Defined in: [src/core/transform2.ts:955](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L955)

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

Defined in: [src/core/transform2.ts:986](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L986)

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

Defined in: [src/core/transform2.ts:1227](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1227)

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

Defined in: [src/core/transform2.ts:1241](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1241)

Resets to identity transform.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`position`, `rotation`, `scale`): `this`

Defined in: [src/core/transform2.ts:1205](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1205)

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

Defined in: [src/core/transform2.ts:1337](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1337)

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

Defined in: [src/core/transform2.ts:97](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L97)

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`position`](../../types/interfaces/Transform2Like.md#position)

---

### scale

> `readonly` **scale**: [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:125](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L125)

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`scale`](../../types/interfaces/Transform2Like.md#scale)

## Serialization

### clone()

> **clone**(): `Transform2`

Defined in: [src/core/transform2.ts:1988](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1988)

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

Defined in: [src/core/transform2.ts:1908](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1908)

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

Defined in: [src/core/transform2.ts:1945](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1945)

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

### toObject()

> **toObject**(): [`Transform2Like`](../../types/interfaces/Transform2Like.md)

Defined in: [src/core/transform2.ts:1884](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1884)

Converts the transform to a plain object.

#### Returns

[`Transform2Like`](../../types/interfaces/Transform2Like.md)

Object with position, rotation, and scale properties

#### Example

```typescript
const t = new Transform2();
t.position.set(100, 50);
t.rotation = Math.PI / 4;
t.scale.set(2, 2);
const obj = t.toObject();
// {
//   position: { x: 100, y: 50 },
//   rotation: 0.785...,
//   scale: { x: 2, y: 2 }
// }
```

#### Since

0.7.0

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/transform2.ts:1967](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1967)

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
const t = new Transform2();
t.position.set(100, 50);
t.rotation = Math.PI / 4;
console.log(t.toString());
// "Transform2(pos: (100.0000, 50.0000), rot: 45.0000°, scale: (1.0000, 1.0000))"
```

#### Since

0.7.0

## Transform

### inverseTransformPoint()

> **inverseTransformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1421](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1421)

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

#### Since

0.7.0

---

### inverseTransformPointCS()

> **inverseTransformPointCS**(`point`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1436](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1436)

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

Defined in: [src/core/transform2.ts:1458](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1458)

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

#### Since

0.7.0

---

### inverseTransformVectorCS()

> **inverseTransformVectorCS**(`vector`, `cos`, `sin`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:1473](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1473)

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

Defined in: [src/core/transform2.ts:1355](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1355)

Transforms a point (applies translation).

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

Defined in: [src/core/transform2.ts:1377](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1377)

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

Defined in: [src/core/transform2.ts:1504](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1504)

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

Defined in: [src/core/transform2.ts:1390](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1390)

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

Defined in: [src/core/transform2.ts:1408](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1408)

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

Defined in: [src/core/transform2.ts:1541](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1541)

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

Defined in: [src/core/transform2.ts:723](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L723)

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

#### Throws

If scale.x or scale.y is near zero.

#### Remarks

Applies the inverse of the transform: Translate⁻¹ → Rotate⁻¹ → Scale⁻¹.
Useful for converting world coordinates to local coordinates.

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

Defined in: [src/core/transform2.ts:795](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L795)

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

**⚠️ Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.

Use this method in hot paths where cos/sin are already computed.

#### Since

0.7.0

---

### inverseTransformPointSafe()

> `static` **inverseTransformPointSafe**(`transform`, `point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:759](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L759)

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

Defined in: [src/core/transform2.ts:836](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L836)

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

#### Throws

If scale.x or scale.y is near zero.

#### Remarks

Applies the inverse of the transform's rotation and scale only.
Useful for converting world directions to local directions.

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

Defined in: [src/core/transform2.ts:901](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L901)

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

**⚠️ Precondition:** `transform.scale.x ≠ 0` and `transform.scale.y ≠ 0`.

Use this method in hot paths where cos/sin are already computed.

#### Since

0.7.0

---

### inverseTransformVectorSafe()

> `static` **inverseTransformVectorSafe**(`transform`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:867](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L867)

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

Defined in: [src/core/transform2.ts:584](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L584)

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

Defined in: [src/core/transform2.ts:623](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L623)

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

Defined in: [src/core/transform2.ts:660](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L660)

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

Defined in: [src/core/transform2.ts:687](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L687)

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

## Validation

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/transform2.ts:1735](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1735)

Returns true if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any ±Infinity value exists

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/transform2.ts:1724](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1724)

Returns true if any component is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/transform2.ts:1713](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/transform2.ts#L1713)

Returns true if all components are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.7.0
