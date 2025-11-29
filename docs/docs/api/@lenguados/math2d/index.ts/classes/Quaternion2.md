# Class: Quaternion2

Mutable interface for 2D quaternions.

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Implements

- [`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md)

## Constructors

### Constructor

> **new Quaternion2**(`w`, `z`): `Quaternion2`

#### Parameters

##### w

`number` = `1`

##### z

`number` = `0`

#### Returns

`Quaternion2`

## Properties

### w

> **w**: `number`

#### Implementation of

[`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md).[`w`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md#w)

---

### z

> **z**: `number`

#### Implementation of

[`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md).[`z`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md#z)

---

### HALF_TURN

> `readonly` `static` **HALF_TURN**: `Readonly`\<`Quaternion2`\>

180° rotation (half turn).

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Quaternion2`\>

Identity quaternion (no rotation).

---

### QUARTER_TURN

> `readonly` `static` **QUARTER_TURN**: `Readonly`\<`Quaternion2`\>

90° rotation (quarter turn).

---

### THREE_QUARTER_TURN

> `readonly` `static` **THREE_QUARTER_TURN**: `Readonly`\<`Quaternion2`\>

270° rotation (three quarter turn).

## Accessors

### conjugated

#### Get Signature

> **get** **conjugated**(): `Quaternion2`

Returns the conjugate without modifying this quaternion.

##### Returns

`Quaternion2`

New conjugate quaternion

---

### doubled

#### Get Signature

> **get** **doubled**(): `Quaternion2`

Returns the double rotation without modifying this quaternion.

##### Returns

`Quaternion2`

New quaternion with double the angle

---

### inversed

#### Get Signature

> **get** **inversed**(): `Quaternion2`

Returns the inverse without modifying this quaternion.

##### Returns

`Quaternion2`

New inverse quaternion

## Methods

### angle()

> **angle**(): `number`

#### Returns

`number`

---

### clone()

> **clone**(): `Quaternion2`

Creates a deep copy of this quaternion.

#### Returns

`Quaternion2`

New Quaternion2 with identical values

#### Example

```typescript
const q = Quaternion2.fromAngle(Math.PI / 4);
const copy = q.clone();
copy.identity(); // Original unchanged
```

---

### conjugate()

> **conjugate**(`out?`): `Quaternion2`

#### Parameters

##### out?

`Quaternion2`

#### Returns

`Quaternion2`

---

### copy()

> **copy**(`other`): `this`

#### Parameters

##### other

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

#### Returns

`this`

---

### equals()

> **equals**(`other`, `epsilon`): `boolean`

#### Parameters

##### other

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

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

> **inverse**(`out?`): `Quaternion2`

Returns the inverse of this quaternion.

#### Parameters

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Inverse quaternion

#### Remarks

Delegates to [Quaternion2.inverse](#inverse-2) for the computation.

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

> **lerp**(`other`, `t`, `out?`): `Quaternion2`

Linear interpolation with another quaternion.

#### Parameters

##### other

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Target quaternion

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Interpolated quaternion (normalized)

---

### magnitude()

> **magnitude**(): `number`

#### Returns

`number`

---

### magnitudeSq()

> **magnitudeSq**(): `number`

#### Returns

`number`

---

### multiply()

> **multiply**(`other`, `out?`): `Quaternion2`

Multiplies with another quaternion (composition).

#### Parameters

##### other

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion to multiply by

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Product quaternion

---

### normalize()

> **normalize**(): `this`

#### Returns

`this`

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

> **set**(`w`, `z`): `this`

#### Parameters

##### w

`number`

##### z

`number`

#### Returns

`this`

---

### setAngle()

> **setAngle**(`angle`): `this`

#### Parameters

##### angle

`number`

#### Returns

`this`

---

### slerp()

> **slerp**(`other`, `t`, `out?`): `Quaternion2`

Spherical linear interpolation with another quaternion.
Uses deterministic math functions.

#### Parameters

##### other

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Target quaternion

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Interpolated quaternion

---

### toArray()

> **toArray**(): \[`number`, `number`\]

Converts the quaternion to a tuple [w, z].

#### Returns

\[`number`, `number`\]

Tuple with w and z components

#### Example

```typescript
const q = Quaternion2.fromAngle(Math.PI / 2);
const [w, z] = q.toArray();
```

---

### toComplex()

> **toComplex**(`out?`): [`Complex`](Complex.md)

#### Parameters

##### out?

[`Complex`](Complex.md)

#### Returns

[`Complex`](Complex.md)

---

### toJSON()

> **toJSON**(): [`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md)

Converts the quaternion to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md)

Object suitable for JSON serialization

#### Example

```typescript
const q = Quaternion2.fromAngle(Math.PI / 2);
const json = JSON.stringify(q);
// '{"w":0.7071,"z":0.7071}'
```

---

### toMatrix2()

> **toMatrix2**(`out?`): [`Matrix2`](Matrix2.md)

Converts the quaternion to a 2D rotation matrix.

#### Parameters

##### out?

[`Matrix2`](Matrix2.md)

Optional output matrix

#### Returns

[`Matrix2`](Matrix2.md)

Rotation matrix

---

### toObject()

> **toObject**(): [`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md)

Converts the quaternion to a plain object.

#### Returns

[`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md)

Object with w and z properties

#### Example

```typescript
const q = Quaternion2.fromAngle(Math.PI / 2);
const obj = q.toObject();
// { w: 0.7071, z: 0.7071 }
```

---

### toRotation2()

> **toRotation2**(`out?`): [`Rotation2`](Rotation2.md)

#### Parameters

##### out?

[`Rotation2`](Rotation2.md)

#### Returns

[`Rotation2`](Rotation2.md)

---

### toString()

> **toString**(`precision`): `string`

Creates a human-readable string representation.
Shows angle in degrees and raw w, z components.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

Formatted string

#### Example

```typescript
const q = Quaternion2.fromAngle(Math.PI / 2);
console.log(q.toString());
// "Quaternion2(90.0000° | w: 0.7071, z: 0.7071)"
```

---

### angle()

> `static` **angle**(`quaternion`): `number`

Returns the angle in radians.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion to get angle from

#### Returns

`number`

Angle in radians

---

### conjugate()

> `static` **conjugate**(`quaternion`, `out?`): `Quaternion2`

Returns the conjugate of a quaternion.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion to conjugate

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Conjugate

---

### dot()

> `static` **dot**(`a`, `b`): `number`

Returns the dot product of two quaternions.

#### Parameters

##### a

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

First quaternion

##### b

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Second quaternion

#### Returns

`number`

Dot product

---

### equals()

> `static` **equals**(`a`, `b`, `epsilon`): `boolean`

Tests if two quaternions are approximately equal.

#### Parameters

##### a

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

First quaternion

##### b

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Second quaternion

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if equal

---

### fromAngle()

> `static` **fromAngle**(`angle`, `out?`): `Quaternion2`

#### Parameters

##### angle

`number`

##### out?

`Quaternion2`

#### Returns

`Quaternion2`

---

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Quaternion2`

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

##### out?

`Quaternion2`

#### Returns

`Quaternion2`

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Quaternion2`

#### Parameters

##### object

[`Quaternion2Like`](../../@lenguados/math2d/types/interfaces/Quaternion2Like.md)

##### out?

`Quaternion2`

#### Returns

`Quaternion2`

---

### fromRotation2()

> `static` **fromRotation2**(`rotation`, `out?`): `Quaternion2`

#### Parameters

##### rotation

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### out?

`Quaternion2`

#### Returns

`Quaternion2`

---

### inverse()

> `static` **inverse**(`quaternion`, `out?`): `Quaternion2`

Calculates the inverse of a quaternion.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion to invert

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Inverse

---

### isIdentity()

> `static` **isIdentity**(`quaternion`, `epsilon`): `boolean`

Tests if a quaternion is the identity.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if identity

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Quaternion2`

Linear interpolation between two quaternions.

#### Parameters

##### a

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Start quaternion

##### b

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

End quaternion

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Interpolated quaternion (normalized)

---

### magnitude()

> `static` **magnitude**(`quaternion`): `number`

Returns the magnitude of a quaternion.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion

#### Returns

`number`

Magnitude

---

### magnitudeSq()

> `static` **magnitudeSq**(`quaternion`): `number`

Returns the squared magnitude of a quaternion.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion

#### Returns

`number`

Squared magnitude

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Quaternion2`

Multiplies two quaternions.

#### Parameters

##### a

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

First quaternion

##### b

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Second quaternion

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Product

---

### negate()

> `static` **negate**(`quaternion`, `out?`): `Quaternion2`

Negates a quaternion.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Negated quaternion

---

### normalize()

> `static` **normalize**(`quaternion`, `out?`): `Quaternion2`

Normalizes a quaternion to unit length.

#### Parameters

##### quaternion

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Quaternion

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Normalized quaternion

---

### slerp()

> `static` **slerp**(`a`, `b`, `t`, `out?`): `Quaternion2`

Spherical linear interpolation between two quaternions.
Uses deterministic math functions.

#### Parameters

##### a

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

Start quaternion

##### b

[`ReadonlyQuaternion2`](../../@lenguados/math2d/core/type-aliases/ReadonlyQuaternion2.md)

End quaternion

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Quaternion2`

Optional output quaternion

#### Returns

`Quaternion2`

Interpolated quaternion
