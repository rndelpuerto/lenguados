# Class: Transform2

Defined in: [src/core/transform2.ts:78](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L78)

Decomposed 2D affine transform applied in Scale → Rotate → Translate order.

## Implements

- [`Transform2Like`](../../types/interfaces/Transform2Like.md)

## Constructors

### Constructor

> **new Transform2**(`position?`, `rotation?`, `scale?`): `Transform2`

Defined in: [src/core/transform2.ts:143](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L143)

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

Defined in: [src/core/transform2.ts:846](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L846)

Inverts this transform in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/transform2.ts:821](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L821)

Multiplies with another transform (composition) in place.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to multiply by

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### inverse()

> `static` **inverse**(`transform`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:396](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L396)

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

#### Since

0.1.0

***

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:365](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L365)

Multiplies two transforms.

#### Parameters

##### a

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

First transform

##### b

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Second transform

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Combined transform

#### Since

0.1.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/transform2.ts:886](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L886)

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

0.1.0

***

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/transform2.ts:937](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L937)

Tests if this transform is identity.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if identity

#### Since

0.1.0

***

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:903](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L903)

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

0.9.0

***

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/transform2.ts:462](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L462)

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

0.1.0

***

### hasNaN()

> `static` **hasNaN**(`transform`): `boolean`

Defined in: [src/core/transform2.ts:536](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L536)

Tests if any component is NaN.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test

#### Returns

`boolean`

True if any component is NaN

#### Since

0.9.0

***

### isFinite()

> `static` **isFinite**(`transform`): `boolean`

Defined in: [src/core/transform2.ts:520](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L520)

Tests if both position and scale components are finite.

#### Parameters

##### transform

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Transform to test

#### Returns

`boolean`

True if all components are finite

#### Since

0.9.0

***

### isIdentity()

> `static` **isIdentity**(`transform`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:503](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L503)

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

0.1.0

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/transform2.ts:482](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L482)

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

0.9.0

## Computed

### direction

#### Get Signature

> **get** **direction**(): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:968](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L968)

Returns the rotation as a unit Vector2 (direction).

##### Since

0.1.0

##### Returns

[`Vector2`](Vector2.md)

Direction vector

***

### inverted

#### Get Signature

> **get** **inverted**(): `Transform2`

Defined in: [src/core/transform2.ts:957](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L957)

Returns the inverse without modifying this transform.

##### Since

0.1.0

##### Returns

`Transform2`

New inverse transform

***

### rotationDegrees

#### Get Signature

> **get** **rotationDegrees**(): `number`

Defined in: [src/core/transform2.ts:980](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L980)

Returns the rotation in degrees.

##### Since

0.1.0

##### Returns

`number`

Rotation in degrees

***

### determinant()

> **determinant**(): `number`

Defined in: [src/core/transform2.ts:636](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L636)

Returns the determinant (scale.x * scale.y).

#### Returns

`number`

Determinant value

#### Since

0.1.0

***

### hasNegativeScale()

> **hasNegativeScale**(): `boolean`

Defined in: [src/core/transform2.ts:625](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L625)

Tests if scale has negative components.

#### Returns

`boolean`

True if any scale component is negative

#### Since

0.1.0

***

### hasUniformScale()

> **hasUniformScale**(`epsilon`): `boolean`

Defined in: [src/core/transform2.ts:614](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L614)

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

0.1.0

## Conversion

### toMatrix()

> **toMatrix**(`out?`): [`Matrix3`](Matrix3.md)

Defined in: [src/core/transform2.ts:652](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L652)

Converts this transform to a 3x3 matrix.

#### Parameters

##### out?

[`Matrix3`](Matrix3.md)

Optional output matrix

#### Returns

[`Matrix3`](Matrix3.md)

Matrix representation

#### Since

0.1.0

## Core

### FLIP\_X

> `readonly` `static` **FLIP\_X**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:127](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L127)

Flip horizontally (scale.x = -1).

***

### FLIP\_Y

> `readonly` `static` **FLIP\_Y**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:135](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L135)

Flip vertically (scale.y = -1).

***

### IDENTITY

> `readonly` `static` **IDENTITY**: [`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Defined in: [src/core/transform2.ts:121](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L121)

Identity transform (no transformation).

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:290](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L290)

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

0.9.0

***

### copy()

> `static` **copy**(`source`, `destination`): `Transform2`

Defined in: [src/core/transform2.ts:344](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L344)

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

0.9.0

***

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:314](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L314)

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
Transform2.fromArray([100, 50, Math.PI/4, 2, 2]); // pos=(100,50), rot=45°, scale=(2,2)
```

#### Since

0.9.0

***

### fromComponents()

> `static` **fromComponents**(`position`, `rotation`, `scale`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:225](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L225)

Creates a transform from components.

#### Parameters

##### position

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Position vector

##### rotation

Rotation (angle or Rotation2)

`number` | `Readonly`\<[`Rotation2`](Rotation2.md)\>

##### scale

Scale (vector or uniform scalar)

`number` | [`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Transform from components

#### Since

0.1.0

***

### fromMatrix()

> `static` **fromMatrix**(`matrix`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:206](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L206)

Creates a transform from a 3x3 matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

Source matrix

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Decomposed transform

#### Since

0.1.0

***

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:259](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L259)

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

0.1.0

***

### fromValues()

> `static` **fromValues**(`x`, `y`, `rotation`, `scaleX`, `scaleY`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:174](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L174)

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

0.1.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/transform2.ts:997](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L997)

Linear interpolation towards another transform in place.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Target transform

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Transform2`

Defined in: [src/core/transform2.ts:429](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L429)

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

0.1.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/transform2.ts:578](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L578)

Copies values from another transform.

#### Parameters

##### other

[`ReadonlyTransform2`](../type-aliases/ReadonlyTransform2.md)

Source transform

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### fromMatrix()

> **fromMatrix**(`matrix`): `this`

Defined in: [src/core/transform2.ts:664](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L664)

Sets this transform from a 3x3 matrix.

#### Parameters

##### matrix

[`ReadonlyMatrix3`](../type-aliases/ReadonlyMatrix3.md)

Source matrix

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### identity()

> **identity**(): `this`

Defined in: [src/core/transform2.ts:592](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L592)

Resets to identity transform.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### set()

> **set**(`position`, `rotation`, `scale`): `this`

Defined in: [src/core/transform2.ts:556](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L556)

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

0.1.0

## Other

### position

> `readonly` **position**: [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:83](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L83)

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`position`](../../types/interfaces/Transform2Like.md#position)

***

### rotation

> **rotation**: `number`

Defined in: [src/core/transform2.ts:84](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L84)

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`rotation`](../../types/interfaces/Transform2Like.md#rotation)

***

### scale

> `readonly` **scale**: [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:85](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L85)

#### Implementation of

[`Transform2Like`](../../types/interfaces/Transform2Like.md).[`scale`](../../types/interfaces/Transform2Like.md#scale)

## Serialization

### clone()

> **clone**(): `Transform2`

Defined in: [src/core/transform2.ts:1134](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L1134)

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

0.1.0

***

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): `T` \| \[`number`, `number`, `number`, `number`, `number`\]

Defined in: [src/core/transform2.ts:1060](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L1060)

Converts the transform to a flat array [px, py, rotation, sx, sy].

#### Type Parameters

##### T

`T` *extends* `ArrayLike`\<`number`\> & `object`

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

0.9.0

***

### toJSON()

> **toJSON**(): [`Transform2Like`](../../types/interfaces/Transform2Like.md)

Defined in: [src/core/transform2.ts:1091](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L1091)

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

0.1.0

***

### toObject()

> **toObject**(): [`Transform2Like`](../../types/interfaces/Transform2Like.md)

Defined in: [src/core/transform2.ts:1036](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L1036)

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

0.1.0

***

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/transform2.ts:1113](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L1113)

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

0.1.0

## Transform

### inverseTransformPoint()

> **inverseTransformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:718](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L718)

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

0.1.0

***

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:682](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L682)

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

0.1.0

***

### transformPoints()

> **transformPoints**(`points`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/transform2.ts:751](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L751)

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
[transformPoint](#transformpoint).

#### Example

```typescript
const vertices = [new Vector2(0, 0), new Vector2(1, 0), new Vector2(1, 1)];
const worldVertices = transform.transformPoints(vertices);
```

#### Since

0.9.0

***

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/transform2.ts:702](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L702)

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

0.1.0

***

### transformVectors()

> **transformVectors**(`vectors`, `out`): [`Vector2`](Vector2.md)[]

Defined in: [src/core/transform2.ts:788](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L788)

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

0.9.0

## Validation

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/transform2.ts:925](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L925)

Returns true if any component is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.9.0

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/transform2.ts:914](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/transform2.ts#L914)

Returns true if all components are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.9.0
