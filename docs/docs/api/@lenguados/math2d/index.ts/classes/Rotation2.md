# Class: Rotation2

Interface for objects that can be pooled.

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Implements

- [`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md)

## Constructors

### Constructor

> **new Rotation2**(`c`, `s`): `Rotation2`

#### Parameters

##### c

`number` = `1`

##### s

`number` = `0`

#### Returns

`Rotation2`

## Properties

### c

> **c**: `number`

#### Implementation of

[`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md).[`c`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md#c)

---

### s

> **s**: `number`

#### Implementation of

[`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md).[`s`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md#s)

---

### EIGHTH_TURN

> `readonly` `static` **EIGHTH_TURN**: `Readonly`\<`Rotation2`\>

45° rotation (π/4).

---

### HALF_TURN

> `readonly` `static` **HALF_TURN**: `Readonly`\<`Rotation2`\>

180° rotation.

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Rotation2`\>

Identity rotation (0°).

---

### NEGATIVE_QUARTER

> `readonly` `static` **NEGATIVE_QUARTER**: `Readonly`\<`Rotation2`\>

-90° rotation (clockwise quarter turn).

---

### QUARTER_TURN

> `readonly` `static` **QUARTER_TURN**: `Readonly`\<`Rotation2`\>

90° counter-clockwise rotation.

---

### SIXTEENTH_TURN

> `readonly` `static` **SIXTEENTH_TURN**: `Readonly`\<`Rotation2`\>

22.5° rotation (π/8).

---

### SIXTH_TURN

> `readonly` `static` **SIXTH_TURN**: `Readonly`\<`Rotation2`\>

60° rotation (π/3).

---

### THREE_QUARTER_TURN

> `readonly` `static` **THREE_QUARTER_TURN**: `Readonly`\<`Rotation2`\>

270° counter-clockwise rotation (90° clockwise).

---

### TWELFTH_TURN

> `readonly` `static` **TWELFTH_TURN**: `Readonly`\<`Rotation2`\>

30° rotation (π/6).

## Accessors

### angleValue

#### Get Signature

> **get** **angleValue**(): `number`

Returns the angle in radians without method call.

##### Returns

`number`

Angle in radians

---

### doubled

#### Get Signature

> **get** **doubled**(): `Rotation2`

Returns the double of this rotation without modifying it.

##### Returns

`Rotation2`

New rotation with double the angle

---

### inversed

#### Get Signature

> **get** **inversed**(): `Rotation2`

Returns the inverse rotation without modifying this one.

##### Returns

`Rotation2`

New inverted rotation

---

### negated

#### Get Signature

> **get** **negated**(): `Rotation2`

Returns the negated rotation without modifying this one.
Equivalent to rotating by the negative angle.

##### Returns

`Rotation2`

New negated rotation

---

### normalized

#### Get Signature

> **get** **normalized**(): `Rotation2`

Returns the normalized rotation without modifying this one.
Since Rotation2 is always kept normalized, this returns a clone.

##### Returns

`Rotation2`

New normalized rotation (clone)

---

### perpendicular

#### Get Signature

> **get** **perpendicular**(): `Rotation2`

Returns the perpendicular rotation (+90°) without modifying this one.

##### Returns

`Rotation2`

New rotation rotated 90° counter-clockwise

---

### xAxis

#### Get Signature

> **get** **xAxis**(): [`Vector2`](Vector2.md)

Returns the X-axis direction vector of this rotation.

##### Returns

[`Vector2`](Vector2.md)

Unit vector pointing in rotation direction

---

### yAxis

#### Get Signature

> **get** **yAxis**(): [`Vector2`](Vector2.md)

Returns the Y-axis direction vector of this rotation.

##### Returns

[`Vector2`](Vector2.md)

Unit vector perpendicular to rotation direction

## Methods

### angle()

> **angle**(): `number`

#### Returns

`number`

---

### apply()

> **apply**(`vector`, `out?`): [`Vector2`](Vector2.md)

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

[`Vector2`](Vector2.md)

#### Returns

[`Vector2`](Vector2.md)

---

### applyInverse()

> **applyInverse**(`vector`, `out?`): [`Vector2`](Vector2.md)

Applies the inverse rotation to a vector.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to rotate inversely

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Inversely rotated vector

#### Remarks

Mathematically equivalent to `Vector2.rotateCS(vector, this.c, -this.s, out)`.
Implemented inline for performance in hot paths.

---

### clone()

> **clone**(): `Rotation2`

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

---

### copy()

> **copy**(`other`): `this`

#### Parameters

##### other

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

#### Returns

`this`

---

### equals()

> **equals**(`other`, `epsilon`): `boolean`

#### Parameters

##### other

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

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

> **inverse**(`out?`): `Rotation2`

#### Parameters

##### out?

`Rotation2`

#### Returns

`Rotation2`

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

> **lerp**(`other`, `t`, `out?`): `Rotation2`

#### Parameters

##### other

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### t

`number`

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### multiply()

> **multiply**(`other`, `out?`): `Rotation2`

Multiplies with another rotation (composition).

#### Parameters

##### other

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Rotation to multiply by

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Combined rotation

---

### normalize()

> **normalize**(): `this`

#### Returns

`this`

---

### relativeTo()

> **relativeTo**(`other`, `out?`): `Rotation2`

#### Parameters

##### other

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

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

> **set**(`c`, `s`): `this`

#### Parameters

##### c

`number`

##### s

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

> **slerp**(`other`, `t`, `out?`): `Rotation2`

Spherical linear interpolation with another rotation.

#### Parameters

##### other

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Target rotation.

##### t

`number`

Interpolation factor [0, 1].

##### out?

`Rotation2`

Optional output rotation.

#### Returns

`Rotation2`

Interpolated rotation.

---

### smoothLerp()

> **smoothLerp**(`other`, `t`, `out?`): `Rotation2`

#### Parameters

##### other

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### t

`number`

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### toArray()

> **toArray**(): \[`number`, `number`\]

Converts the rotation to a tuple [c, s].

#### Returns

\[`number`, `number`\]

Tuple with cosine and sine components

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 4);
const [c, s] = r.toArray();
```

---

### toComplex()

> **toComplex**(`out?`): [`Complex`](Complex.md)

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

---

### toJSON()

> **toJSON**(): [`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md)

Converts the rotation to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md)

Object suitable for JSON serialization

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 2);
const json = JSON.stringify(r);
// '{"c":0,"s":1}'
```

---

### toObject()

> **toObject**(): [`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md)

Converts the rotation to a plain object.

#### Returns

[`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md)

Object with c (cosine) and s (sine) properties

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 2);
const obj = r.toObject();
// { c: 0, s: 1 }
```

---

### toString()

> **toString**(`precision`): `string`

Creates a human-readable string representation.
Shows the angle in degrees for clarity.

#### Parameters

##### precision

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

---

### toVector()

> **toVector**(`out?`): [`Vector2`](Vector2.md)

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
const v = r.toVector();
// v.x ≈ 0, v.y ≈ 1
```

---

### angle()

> `static` **angle**(`rotation`): `number`

Returns the angle in radians.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Rotation to get angle from

#### Returns

`number`

Angle in radians

---

### applyToVector()

> `static` **applyToVector**(`rotation`, `vector`, `out?`): [`Vector2`](Vector2.md)

Applies a rotation to a vector.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Rotation to apply

##### vector

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

Vector to rotate

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Rotated vector

#### Remarks

Mathematically equivalent to `Vector2.rotateCS(vector, rotation.c, rotation.s, out)`.
Implemented inline for performance in hot paths.

---

### equals()

> `static` **equals**(`a`, `b`, `epsilon`): `boolean`

Tests if two rotations are approximately equal.

#### Parameters

##### a

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

First rotation

##### b

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Second rotation

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if rotations are equivalent

#### Remarks

First tries fast component comparison, then falls back to angle comparison
using [angleDifference](../../@lenguados/math2d/auxiliary/angle/functions/angleDifference.md) for edge cases near ±180°.

---

### fromAngle()

> `static` **fromAngle**(`angle`, `out?`): `Rotation2`

#### Parameters

##### angle

`number`

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Rotation2`

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Rotation2`

#### Parameters

##### object

[`Rotation2Like`](../../@lenguados/math2d/core/interfaces/Rotation2Like.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### fromVector()

> `static` **fromVector**(`direction`, `out?`): `Rotation2`

#### Parameters

##### direction

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### fromVectors()

> `static` **fromVectors**(`from`, `to`, `out?`): `Rotation2`

#### Parameters

##### from

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### to

[`ReadonlyVector2Like`](../../@lenguados/math2d/types/interfaces/ReadonlyVector2Like.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### inverse()

> `static` **inverse**(`rotation`, `out?`): `Rotation2`

#### Parameters

##### rotation

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### isIdentity()

> `static` **isIdentity**(`rotation`, `epsilon`): `boolean`

Tests if a rotation is the identity.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Rotation to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if rotation is identity

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Rotation2`

Linear interpolation between two rotations.

#### Parameters

##### a

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Start rotation

##### b

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

End rotation

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Interpolated rotation

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Rotation2`

#### Parameters

##### a

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### b

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### negate()

> `static` **negate**(`rotation`, `out?`): `Rotation2`

Negates a rotation (same as rotating by -angle).

#### Parameters

##### rotation

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

Rotation to negate

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Negated rotation

---

### relative()

> `static` **relative**(`a`, `b`, `out?`): `Rotation2`

#### Parameters

##### a

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### b

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### out?

`Rotation2`

#### Returns

`Rotation2`

---

### slerp()

> `static` **slerp**(`from`, `to`, `t`, `out?`): `Rotation2`

#### Parameters

##### from

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### to

[`ReadonlyRotation2`](../../@lenguados/math2d/core/type-aliases/ReadonlyRotation2.md)

##### t

`number`

##### out?

`Rotation2`

#### Returns

`Rotation2`
