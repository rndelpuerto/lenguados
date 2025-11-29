# Class: Transform2

Decomposed 2D affine transform applied in Scale → Rotate → Translate order.

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Constructors

### Constructor

> **new Transform2**(`position?`, `rotation?`, `scale?`): `Transform2`

#### Parameters

##### position?

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### rotation?

`number` = `0`

##### scale?

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

#### Returns

`Transform2`

## Batch Operations

### transformPoints()

> **transformPoints**(`points`, `out`): [`Vector2`](Vector2.md)[]

Transforms multiple points efficiently (batch operation).
Calculates sin/cos once and applies to all points.

#### Parameters

##### points

readonly [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)[]

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

---

### transformVectors()

> **transformVectors**(`vectors`, `out`): [`Vector2`](Vector2.md)[]

Transforms multiple vectors efficiently (batch operation).
Calculates sin/cos once and applies to all vectors.

#### Parameters

##### vectors

readonly [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)[]

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

## Other

### position

> `readonly` **position**: [`Vector2`](Vector2.md)

---

### rotation

> **rotation**: `number`

---

### scale

> `readonly` **scale**: [`Vector2`](Vector2.md)

---

### FLIP_X

> `readonly` `static` **FLIP_X**: [`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Flip horizontally (scale.x = -1).

---

### FLIP_Y

> `readonly` `static` **FLIP_Y**: [`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Flip vertically (scale.y = -1).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: [`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Identity transform (no transformation).

---

### direction

#### Get Signature

> **get** **direction**(): [`Vector2`](Vector2.md)

Returns the rotation as a unit Vector2 (direction).

##### Returns

[`Vector2`](Vector2.md)

Direction vector

---

### inverted

#### Get Signature

> **get** **inverted**(): `Transform2`

Returns the inverse without modifying this transform.

##### Returns

`Transform2`

New inverse transform

---

### rotationDegrees

#### Get Signature

> **get** **rotationDegrees**(): `number`

Returns the rotation in degrees.

##### Returns

`number`

Rotation in degrees

---

### clone()

> **clone**(): `Transform2`

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

---

### copy()

> **copy**(`other`): `this`

#### Parameters

##### other

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

#### Returns

`this`

---

### determinant()

> **determinant**(): `number`

#### Returns

`number`

---

### equals()

> **equals**(`other`, `epsilon`): `boolean`

#### Parameters

##### other

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### fromMatrix()

> **fromMatrix**(`matrix`): `this`

#### Parameters

##### matrix

[`ReadonlyMatrix3`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix3.md)

#### Returns

`this`

---

### hasNegativeScale()

> **hasNegativeScale**(): `boolean`

#### Returns

`boolean`

---

### hasUniformScale()

> **hasUniformScale**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### identity()

> **identity**(): `this`

#### Returns

`this`

---

### inverse()

> **inverse**(`out?`): `Transform2`

Computes the inverse transform.

#### Parameters

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Inverse transform

---

### inverseTransformPoint()

> **inverseTransformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### point

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### lerp()

> **lerp**(`other`, `t`, `out?`): `Transform2`

#### Parameters

##### other

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

##### t

`number`

##### out?

`Transform2`

#### Returns

`Transform2`

---

### multiply()

> **multiply**(`other`, `out?`): `Transform2`

Multiplies with another transform (composition).

#### Parameters

##### other

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Transform to multiply by

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Combined transform

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

### set()

> **set**(`position`, `rotation`, `scale`): `this`

#### Parameters

##### position

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### rotation

`number`

##### scale

`number` | [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

#### Returns

`this`

---

### toJSON()

> **toJSON**(): [`Transform2Like`](../../@lenguados/math2d/types/interfaces/Transform2Like.md)

Converts the transform to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Transform2Like`](../../@lenguados/math2d/types/interfaces/Transform2Like.md)

Object suitable for JSON serialization

#### Example

```typescript
const t = new Transform2();
t.position.set(100, 50);
const json = JSON.stringify(t);
// '{"position":{"x":100,"y":50},"rotation":0,"scale":{"x":1,"y":1}}'
```

---

### toMatrix()

> **toMatrix**(`out?`): [`Matrix3`](Matrix3.md)

#### Parameters

##### out?

[`Matrix3`](Matrix3.md)

#### Returns

[`Matrix3`](Matrix3.md)

---

### toObject()

> **toObject**(): [`Transform2Like`](../../@lenguados/math2d/types/interfaces/Transform2Like.md)

Converts the transform to a plain object.

#### Returns

[`Transform2Like`](../../@lenguados/math2d/types/interfaces/Transform2Like.md)

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

---

### toString()

> **toString**(`precision`): `string`

Creates a human-readable string representation.
Shows position, rotation (in degrees), and scale.

#### Parameters

##### precision

`number` = `2`

Number of decimal places (default: 2)

#### Returns

`string`

Formatted string

#### Example

```typescript
const t = new Transform2();
t.position.set(100, 50);
t.rotation = Math.PI / 4;
console.log(t.toString());
// "Transform2(pos: (100.00, 50.00), rot: 45.00°, scale: (1.00, 1.00))"
```

---

### transformPoint()

> **transformPoint**(`point`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### point

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### transformVector()

> **transformVector**(`vector`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### equals()

> `static` **equals**(`a`, `b`, `epsilon`): `boolean`

Tests if two transforms are approximately equal.

#### Parameters

##### a

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

First transform

##### b

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Second transform

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if equal

---

### fromComponents()

> `static` **fromComponents**(`position`, `rotation`, `scale`, `out?`): `Transform2`

#### Parameters

##### position

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### rotation

`number` | `Readonly`\<[`Rotation2`](Rotation2.md)\>

##### scale

`number` | [`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Transform2`

#### Returns

`Transform2`

---

### fromMatrix()

> `static` **fromMatrix**(`matrix`, `out?`): `Transform2`

#### Parameters

##### matrix

[`ReadonlyMatrix3`](../../@lenguados/math2d/core/type-aliases/ReadonlyMatrix3.md)

##### out?

`Transform2`

#### Returns

`Transform2`

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Transform2`

#### Parameters

##### object

[`Transform2Like`](../../@lenguados/math2d/types/interfaces/Transform2Like.md)

##### out?

`Transform2`

#### Returns

`Transform2`

---

### fromValues()

> `static` **fromValues**(`x`, `y`, `rotation`, `scaleX`, `scaleY`, `out?`): `Transform2`

#### Parameters

##### x

`number`

##### y

`number`

##### rotation

`number`

##### scaleX

`number`

##### scaleY

`number`

##### out?

`Transform2`

#### Returns

`Transform2`

---

### inverse()

> `static` **inverse**(`transform`, `out?`): `Transform2`

Calculates the inverse of a transform.

#### Parameters

##### transform

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Transform to invert

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Inverse transform

---

### isIdentity()

> `static` **isIdentity**(`transform`, `epsilon`): `boolean`

Tests if a transform is the identity.

#### Parameters

##### transform

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Transform to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if identity

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Transform2`

Linear interpolation between two transforms.

#### Parameters

##### a

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Start transform

##### b

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

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

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Transform2`

Multiplies two transforms.

#### Parameters

##### a

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

First transform

##### b

[`ReadonlyTransform2`](../../@lenguados/math2d/core/type-aliases/ReadonlyTransform2.md)

Second transform

##### out?

`Transform2`

Optional output transform

#### Returns

`Transform2`

Combined transform
