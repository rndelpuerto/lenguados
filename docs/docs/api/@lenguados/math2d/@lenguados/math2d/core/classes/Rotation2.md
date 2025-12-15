# Class: Rotation2

Defined in: [src/core/rotation2.ts:111](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L111)

Mutable interface for 2D rotation represented as cosine/sine components.

## See

[ReadonlyRotation2Like](../../types/interfaces/ReadonlyRotation2Like.md) for detailed property documentation.

## Implements

- [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

## Constructors

### Constructor

> **new Rotation2**(`cos`, `sin`): `Rotation2`

Defined in: [src/core/rotation2.ts:123](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L123)

#### Parameters

##### cos

`number` = `1`

##### sin

`number` = `0`

#### Returns

`Rotation2`

## Arithmetic

### inverse()

> **inverse**(): `this`

Defined in: [src/core/rotation2.ts:722](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L722)

Inverts this rotation in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/rotation2.ts:707](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L707)

Multiplies with another rotation (composition) in place.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to multiply by

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### negate()

> **negate**(): `this`

Defined in: [src/core/rotation2.ts:734](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L734)

Negates this rotation in place (same as inverse for unit rotations).

#### Returns

`this`

This for chaining

#### Since

0.9.0

***

### relativeTo()

> **relativeTo**(`other`): `this`

Defined in: [src/core/rotation2.ts:747](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L747)

Computes rotation relative to another in place.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Reference rotation

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### inverse()

> `static` **inverse**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:389](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L389)

Returns the inverse of a rotation.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to invert

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Inverted rotation

#### Since

0.1.0

***

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:374](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L374)

Multiplies two rotations (composition).

#### Parameters

##### a

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

First rotation

##### b

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Second rotation

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Combined rotation (a then b)

#### Since

0.1.0

***

### negate()

> `static` **negate**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:418](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L418)

Negates a rotation (same as rotating by -angle).

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to negate

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Negated rotation

#### Since

0.1.0

***

### relative()

> `static` **relative**(`a`, `b`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:403](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L403)

Computes the relative rotation from a to b.

#### Parameters

##### a

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

First rotation

##### b

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Second rotation

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Relative rotation (b relative to a)

#### Since

0.1.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/rotation2.ts:808](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L808)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to compare

#### Returns

`boolean`

True if cos and sin are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.1.0

***

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:837](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L837)

Tests if this rotation is identity (0°).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if identity

#### Default Value

`EPSILON`

#### Since

0.1.0

***

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:825](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L825)

Approximate equality with wrap-around handling using relative tolerance.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to compare

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if rotations are equivalent within tolerance

#### Default Value

`EPSILON`

#### Remarks

First tries fast component comparison with relative tolerance, then falls
back to angle comparison for edge cases near ±180°.

#### Since

0.9.0

***

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/rotation2.ts:516](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L516)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

First rotation

##### b

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Second rotation

#### Returns

`boolean`

True if cos and sin are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.1.0

***

### hasNaN()

> `static` **hasNaN**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:581](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L581)

Tests if any component is NaN.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to test

#### Returns

`boolean`

True if cos or sin is NaN

#### Since

0.9.0

***

### isFinite()

> `static` **isFinite**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:569](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L569)

Tests if both components are finite numbers.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to test

#### Returns

`boolean`

True if both cos and sin are finite

#### Since

0.9.0

***

### isIdentity()

> `static` **isIdentity**(`rotation`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:557](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L557)

Tests if a rotation is the identity.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if rotation is identity

#### Since

0.1.0

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:534](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L534)

Approximate equality between two rotations using relative tolerance.

#### Parameters

##### a

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

First rotation

##### b

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Second rotation

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if rotations are equivalent within tolerance

#### Default Value

`EPSILON`

#### Remarks

First tries fast component comparison with relative tolerance, then falls
back to angle comparison using [angleDifference](../../auxiliary/angle/functions/angleDifference.md) for edge cases near ±180°.

#### Since

0.9.0

## Computed

### angleValue

#### Get Signature

> **get** **angleValue**(): `number`

Defined in: [src/core/rotation2.ts:954](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L954)

Returns the angle in radians without method call.

##### Since

0.1.0

##### Returns

`number`

Angle in radians

***

### doubled

#### Get Signature

> **get** **doubled**(): `Rotation2`

Defined in: [src/core/rotation2.ts:885](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L885)

Returns the double of this rotation without modifying it.

##### Since

0.1.0

##### Returns

`Rotation2`

New rotation with double the angle

***

### inversed

#### Get Signature

> **get** **inversed**(): `Rotation2`

Defined in: [src/core/rotation2.ts:874](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L874)

Returns the inverse rotation without modifying this one.

##### Since

0.1.0

##### Returns

`Rotation2`

New inverted rotation

***

### negated

#### Get Signature

> **get** **negated**(): `Rotation2`

Defined in: [src/core/rotation2.ts:931](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L931)

Returns the negated rotation without modifying this one.
Equivalent to rotating by the negative angle.

##### Since

0.1.0

##### Returns

`Rotation2`

New negated rotation

***

### normalized

#### Get Signature

> **get** **normalized**(): `Rotation2`

Defined in: [src/core/rotation2.ts:943](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L943)

Returns the normalized rotation without modifying this one.
Since Rotation2 is always kept normalized, this returns a clone.

##### Since

0.1.0

##### Returns

`Rotation2`

New normalized rotation (clone)

***

### perpendicular

#### Get Signature

> **get** **perpendicular**(): `Rotation2`

Defined in: [src/core/rotation2.ts:897](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L897)

Returns the perpendicular rotation (+90°) without modifying this one.

##### Since

0.1.0

##### Returns

`Rotation2`

New rotation rotated 90° counter-clockwise

***

### xAxis

#### Get Signature

> **get** **xAxis**(): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:908](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L908)

Returns the X-axis direction vector of this rotation.

##### Since

0.1.0

##### Returns

[`Vector2`](Vector2.md)

Unit vector pointing in rotation direction

***

### yAxis

#### Get Signature

> **get** **yAxis**(): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:919](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L919)

Returns the Y-axis direction vector of this rotation.

##### Since

0.1.0

##### Returns

[`Vector2`](Vector2.md)

Unit vector perpendicular to rotation direction

***

### angle()

> **angle**(): `number`

Defined in: [src/core/rotation2.ts:691](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L691)

Returns the angle in radians.

#### Returns

`number`

Angle in radians

#### Since

0.1.0

***

### angle()

> `static` **angle**(`rotation`): `number`

Defined in: [src/core/rotation2.ts:597](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L597)

Returns the angle in radians.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to get angle from

#### Returns

`number`

Angle in radians

#### Since

0.1.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/rotation2.ts:1164](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1164)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding cos then sin.

#### Example

```typescript
const [cos, sin] = Rotation2.fromAngle(Math.PI / 4);
```

#### Since

0.9.0

***

### toComplex()

> **toComplex**(`out?`): [`Complex`](Complex.md)

Defined in: [src/core/rotation2.ts:1031](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1031)

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

0.1.0

***

### toVector()

> **toVector**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1051](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1051)

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

#### Since

0.1.0

## Core

### EIGHTH\_TURN

> `readonly` `static` **EIGHTH\_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:180](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L180)

45° rotation (π/4).

***

### HALF\_TURN

> `readonly` `static` **HALF\_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:166](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L166)

180° rotation.

***

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:154](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L154)

Identity rotation (0°).

***

### NEGATIVE\_QUARTER

> `readonly` `static` **NEGATIVE\_QUARTER**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:204](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L204)

-90° rotation (clockwise quarter turn).

***

### QUARTER\_TURN

> `readonly` `static` **QUARTER\_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:160](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L160)

90° counter-clockwise rotation.

***

### SIXTEENTH\_TURN

> `readonly` `static` **SIXTEENTH\_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:196](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L196)

22.5° rotation (π/8).

***

### SIXTH\_TURN

> `readonly` `static` **SIXTH\_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:210](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L210)

60° rotation (π/3).

***

### THREE\_QUARTER\_TURN

> `readonly` `static` **THREE\_QUARTER\_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:172](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L172)

270° counter-clockwise rotation (90° clockwise).

***

### TWELFTH\_TURN

> `readonly` `static` **TWELFTH\_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:188](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L188)

30° rotation (π/6).

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:341](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L341)

Creates a deep copy of a rotation.

#### Parameters

##### source

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to clone

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

A Rotation2 with identical values

#### Since

0.9.0

***

### copy()

> `static` **copy**(`source`, `destination`): `Rotation2`

Defined in: [src/core/rotation2.ts:354](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L354)

Copies values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Source rotation

##### destination

`Rotation2`

Target rotation to receive the copy

#### Returns

`Rotation2`

The destination rotation

#### Since

0.9.0

***

### fromAngle()

> `static` **fromAngle**(`angle`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:227](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L227)

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

#### Since

0.1.0

***

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:321](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L321)

Creates a rotation from a flat array [cos, sin].

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array

##### offset

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

If offset is out of bounds.

#### Example

```typescript
Rotation2.fromArray([0.707, 0.707]);     // 45° rotation
Rotation2.fromArray([0, 1, 0, -1], 2);   // -90° rotation from offset 2
```

#### Since

0.9.0

***

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:285](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L285)

Creates a rotation from a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number (will be normalized)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from the complex number

#### Since

0.1.0

***

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:298](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L298)

Creates a rotation from a plain object.

#### Parameters

##### object

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Object with cos and sin properties

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from the object

#### Since

0.1.0

***

### fromVector()

> `static` **fromVector**(`direction`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:243](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L243)

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

#### Since

0.1.0

***

### fromVectors()

> `static` **fromVectors**(`from`, `to`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:266](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L266)

Creates a rotation that transforms one direction to another.

#### Parameters

##### from

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Starting direction

##### to

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Target direction

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation that transforms 'from' to 'to'

#### Since

0.1.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:971](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L971)

Linear interpolation towards another rotation in place.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Target rotation

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### slerp()

> **slerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1003](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1003)

Spherical linear interpolation with another rotation in place.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Target rotation

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### smoothLerp()

> **smoothLerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:989](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L989)

Smooth step interpolation towards another rotation in place.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Target rotation

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

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:467](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L467)

Linear interpolation between two rotations.

#### Parameters

##### a

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Start rotation

##### b

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

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

#### Since

0.1.0

***

### slerp()

> `static` **slerp**(`from`, `to`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:489](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L489)

Spherical linear interpolation between two rotations.

#### Parameters

##### from

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Start rotation

##### to

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

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

#### Since

0.1.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/rotation2.ts:647](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L647)

Copies values from another rotation.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Source rotation

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### identity()

> **identity**(): `this`

Defined in: [src/core/rotation2.ts:660](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L660)

Resets to identity rotation (0°).

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### normalize()

> **normalize**(): `this`

Defined in: [src/core/rotation2.ts:673](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L673)

Normalizes this rotation to unit length.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### set()

> **set**(`cos`, `sin`): `this`

Defined in: [src/core/rotation2.ts:614](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L614)

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

0.1.0

***

### setAngle()

> **setAngle**(`angle`): `this`

Defined in: [src/core/rotation2.ts:631](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L631)

Sets the rotation from an angle.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`this`

This for chaining

#### Since

0.1.0

## Other

### cos

> **cos**: `number`

Defined in: [src/core/rotation2.ts:116](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L116)

Cosine component of the rotation.
For a rotation of angle θ, this equals cos(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`cos`](../../types/interfaces/Rotation2Like.md#cos)

***

### sin

> **sin**: `number`

Defined in: [src/core/rotation2.ts:117](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L117)

Sine component of the rotation.
For a rotation of angle θ, this equals sin(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`sin`](../../types/interfaces/Rotation2Like.md#sin)

## Serialization

### clone()

> **clone**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1148](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1148)

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

0.1.0

***

### toArray()

> **toArray**(): \[`number`, `number`\]

Defined in: [src/core/rotation2.ts:1072](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1072)

Converts the rotation to a tuple [cos, sin].

#### Returns

\[`number`, `number`\]

Tuple with cosine and sine components

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 4);
const [cos, sin] = r.toArray();
```

#### Since

0.1.0

***

### toJSON()

> **toJSON**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1109](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1109)

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

0.1.0

***

### toObject()

> **toObject**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1090](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1090)

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

0.1.0

***

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/rotation2.ts:1129](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L1129)

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

#### Since

0.1.0

## Transform

### apply()

> **apply**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:768](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L768)

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

0.1.0

***

### applyInverse()

> **applyInverse**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:785](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L785)

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

Mathematically equivalent to `Vector2.rotateCS(vector, this.c, -this.s, out)`.
Implemented inline for performance in hot paths.

#### Since

0.1.0

***

### applyToVector()

> `static` **applyToVector**(`rotation`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:440](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L440)

Applies a rotation to a vector.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

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

Mathematically equivalent to `Vector2.rotateCS(vector, rotation.c, rotation.s, out)`.
Implemented inline for performance in hot paths.

#### Since

0.1.0

## Validation

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/rotation2.ts:859](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L859)

Returns true if any component is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.9.0

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/rotation2.ts:848](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/rotation2.ts#L848)

Returns true if all components are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.9.0
