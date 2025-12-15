# Class: Rotation2

Defined in: [src/core/rotation2.ts:123](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L123)

Deterministic 2D rotation stored as cosine and sine components.

## Remarks

Instances are normalized to unit magnitude, making them efficient for rotations.

## Since

0.1.0

## Implements

- [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

## Constructors

### Constructor

> **new Rotation2**(`cos`, `sin`): `Rotation2`

Defined in: [src/core/rotation2.ts:135](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L135)

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

Defined in: [src/core/rotation2.ts:1026](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1026)

Inverts this rotation in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/rotation2.ts:1011](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1011)

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

---

### negate()

> **negate**(): `this`

Defined in: [src/core/rotation2.ts:1038](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1038)

Negates this rotation in place (same as inverse for unit rotations).

#### Returns

`this`

This for chaining

#### Since

0.9.0

---

### relativeTo()

> **relativeTo**(`other`): `this`

Defined in: [src/core/rotation2.ts:1051](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1051)

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

---

### inverse()

> `static` **inverse**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:521](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L521)

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

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:506](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L506)

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

---

### negate()

> `static` **negate**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:550](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L550)

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

---

### relative()

> `static` **relative**(`a`, `b`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:535](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L535)

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

Defined in: [src/core/rotation2.ts:1108](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1108)

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

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:1137](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1137)

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

---

### isNormalized()

> **isNormalized**(`epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:1149](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1149)

Tests if this rotation is normalized (unit magnitude).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if cos² + sin² ≈ 1

#### Since

0.14.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:1125](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1125)

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

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/rotation2.ts:754](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L754)

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

---

### hasNaN()

> `static` **hasNaN**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:833](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L833)

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

---

### isFinite()

> `static` **isFinite**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:821](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L821)

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

---

### isIdentity()

> `static` **isIdentity**(`rotation`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:795](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L795)

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

---

### isNormalized()

> `static` **isNormalized**(`rotation`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:808](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L808)

Tests if a rotation is normalized (unit magnitude).

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if |cos² + sin² - 1| < epsilon

#### Since

0.14.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:772](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L772)

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

Defined in: [src/core/rotation2.ts:1266](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1266)

Returns the angle in radians without method call.

##### Since

0.1.0

##### Returns

`number`

Angle in radians

---

### doubled

#### Get Signature

> **get** **doubled**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1197](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1197)

Returns the double of this rotation without modifying it.

##### Since

0.1.0

##### Returns

`Rotation2`

New rotation with double the angle

---

### inversed

#### Get Signature

> **get** **inversed**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1186](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1186)

Returns the inverse rotation without modifying this one.

##### Since

0.1.0

##### Returns

`Rotation2`

New inverted rotation

---

### negated

#### Get Signature

> **get** **negated**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1243](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1243)

Returns the negated rotation without modifying this one.
Equivalent to rotating by the negative angle.

##### Since

0.1.0

##### Returns

`Rotation2`

New negated rotation

---

### normalized

#### Get Signature

> **get** **normalized**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1255](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1255)

Returns the normalized rotation without modifying this one.
Since Rotation2 is always kept normalized, this returns a clone.

##### Since

0.1.0

##### Returns

`Rotation2`

New normalized rotation (clone)

---

### perpendicular

#### Get Signature

> **get** **perpendicular**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1209](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1209)

Returns the perpendicular rotation (+90°) without modifying this one.

##### Since

0.1.0

##### Returns

`Rotation2`

New rotation rotated 90° counter-clockwise

---

### xAxis

#### Get Signature

> **get** **xAxis**(): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1220](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1220)

Returns the X-axis direction vector of this rotation.

##### Since

0.1.0

##### Returns

[`Vector2`](Vector2.md)

Unit vector pointing in rotation direction

---

### yAxis

#### Get Signature

> **get** **yAxis**(): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1231](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1231)

Returns the Y-axis direction vector of this rotation.

##### Since

0.1.0

##### Returns

[`Vector2`](Vector2.md)

Unit vector perpendicular to rotation direction

---

### angle()

> **angle**(): `number`

Defined in: [src/core/rotation2.ts:995](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L995)

Returns the angle in radians.

#### Returns

`number`

Angle in radians

#### Since

0.1.0

---

### angle()

> `static` **angle**(`rotation`): `number`

Defined in: [src/core/rotation2.ts:849](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L849)

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

Defined in: [src/core/rotation2.ts:1500](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1500)

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

---

### toComplex()

> **toComplex**(`out?`): [`Complex`](Complex.md)

Defined in: [src/core/rotation2.ts:1367](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1367)

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

---

### toVector2()

> **toVector2**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1387](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1387)

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

0.1.0

## Core

### EIGHTH_TURN

> `readonly` `static` **EIGHTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:192](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L192)

45° rotation (π/4).

---

### HALF_TURN

> `readonly` `static` **HALF_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:178](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L178)

180° rotation.

---

### IDENTITY

> `readonly` `static` **IDENTITY**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:166](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L166)

Identity rotation (0°).

---

### NEGATIVE_QUARTER

> `readonly` `static` **NEGATIVE_QUARTER**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:216](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L216)

-90° rotation (clockwise quarter turn).

---

### QUARTER_TURN

> `readonly` `static` **QUARTER_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:172](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L172)

90° counter-clockwise rotation.

---

### SIXTEENTH_TURN

> `readonly` `static` **SIXTEENTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:208](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L208)

22.5° rotation (π/8).

---

### SIXTH_TURN

> `readonly` `static` **SIXTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:222](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L222)

60° rotation (π/3).

---

### THREE_QUARTER_TURN

> `readonly` `static` **THREE_QUARTER_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:184](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L184)

270° counter-clockwise rotation (90° clockwise).

---

### TWELFTH_TURN

> `readonly` `static` **TWELFTH_TURN**: `Readonly`\<`Rotation2`\>

Defined in: [src/core/rotation2.ts:200](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L200)

30° rotation (π/6).

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:395](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L395)

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

---

### copy()

> `static` **copy**(`source`, `destination`): `Rotation2`

Defined in: [src/core/rotation2.ts:408](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L408)

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

---

### fromAngle()

> `static` **fromAngle**(`angle`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:239](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L239)

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

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:375](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L375)

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
Rotation2.fromArray([0.707, 0.707]); // 45° rotation
Rotation2.fromArray([0, 1, 0, -1], 2); // -90° rotation from offset 2
```

#### Since

0.9.0

---

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:297](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L297)

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

---

### fromComplexSafe()

> `static` **fromComplexSafe**(`complex`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:312](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L312)

Creates a rotation from a complex number (safe).

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Rotation from the complex, or identity if magnitude is near zero

#### See

[fromComplex](#fromcomplex) - May produce invalid rotation if magnitude is zero

#### Since

0.13.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:325](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L325)

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

---

### fromValues()

> `static` **fromValues**(`cos`, `sin`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:352](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L352)

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

The values are used directly without normalization.
For normalized rotations, use [fromAngle](#fromangle).

#### Example

```typescript
Rotation2.fromValues(1, 0); // Identity (0°)
Rotation2.fromValues(0, 1); // 90° rotation
Rotation2.fromValues(0.707, 0.707); // ~45° rotation
```

#### Since

0.14.0

---

### fromVector2()

> `static` **fromVector2**(`direction`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:255](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L255)

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

---

### fromVectors2()

> `static` **fromVectors2**(`from`, `to`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:278](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L278)

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

#### Since

0.1.0

---

### normalize()

> `static` **normalize**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:423](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L423)

Normalizes a rotation to ensure cos² + sin² = 1.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to normalize

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Normalized rotation

#### Since

0.9.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:451](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L451)

Safe normalization that handles zero-magnitude rotations.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to normalize

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Normalized rotation, or identity if input has zero magnitude

#### Remarks

Unlike [normalize](#normalize-2), this method returns the identity rotation
instead of throwing when the input has zero magnitude. This is useful
for accumulated rotations that may drift due to floating-point errors.

#### Example

```typescript
const drifted = new Rotation2(0.0000001, 0); // Nearly zero
const safe = Rotation2.normalizeSafe(drifted); // Returns IDENTITY
```

#### Since

0.10.0

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:483](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L483)

Unchecked normalization for hot paths.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Rotation to normalize (must have non-zero magnitude)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Normalized rotation

#### Remarks

**⚠️ Precondition:** Rotation must have non-zero magnitude.
Calling with zero-magnitude produces Infinity/NaN.

Use in performance-critical code where rotation validity is guaranteed.

#### See

- [normalize](#normalize-2) - Throws on zero magnitude
- [normalizeSafe](#normalizesafe-2) - Returns identity on zero magnitude

#### Since

0.13.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1283](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1283)

Linear interpolation towards another rotation in place.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Target rotation

##### t

`number`

Interpolation factor (not clamped, allows extrapolation)

#### Returns

`this`

This for chaining

#### Since

0.1.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1300](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1300)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Target rotation

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This for chaining

#### Since

0.9.0

---

### slerp()

> **slerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1327](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1327)

Spherical linear interpolation with another rotation in place.

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Target rotation

##### t

`number`

Interpolation factor (not clamped, allows extrapolation)

#### Returns

`this`

This for chaining

#### Since

0.1.0

---

### slerpClamped()

> **slerpClamped**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1344](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1344)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Target rotation

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This for chaining

#### Since

0.9.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1313](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1313)

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

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:635](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L635)

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

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:656](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L656)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Start rotation

##### b

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

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

0.9.0

---

### slerp()

> `static` **slerp**(`from`, `to`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:676](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L676)

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

Interpolation factor (not clamped, allows extrapolation)

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Interpolated rotation

#### Since

0.1.0

---

### slerpClamped()

> `static` **slerpClamped**(`from`, `to`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:697](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L697)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### from

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Start rotation

##### to

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

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

0.9.0

---

### smoothStep()

> `static` **smoothStep**(`from`, `to`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:728](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L728)

Smooth interpolation between two rotations using smoothStep easing.

#### Parameters

##### from

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

Source rotation

##### to

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

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

0.11.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/rotation2.ts:899](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L899)

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

---

### identity()

> **identity**(): `this`

Defined in: [src/core/rotation2.ts:912](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L912)

Resets to identity rotation (0°).

#### Returns

`this`

This for chaining

#### Since

0.1.0

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/rotation2.ts:925](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L925)

Normalizes this rotation to unit length.

#### Returns

`this`

This for chaining

#### Since

0.1.0

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/rotation2.ts:950](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L950)

Safe normalization that handles zero-magnitude rotations.

#### Returns

`this`

This for chaining

#### Remarks

Unlike [normalize](#normalize-2), this method sets the rotation to identity
instead of throwing when it has zero magnitude. This is useful for
accumulated rotations that may drift due to floating-point errors.

#### Example

```typescript
const rot = new Rotation2(0.9999, 0.0001);
rot.normalizeSafe(); // Safely normalizes
```

#### Since

0.10.0

---

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/rotation2.ts:976](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L976)

Unchecked normalization for hot paths.

#### Returns

`this`

This for chaining

#### Remarks

**⚠️ Precondition:** Rotation must have non-zero magnitude.

#### See

- [normalize](#normalize-2) - Throws on zero magnitude
- [normalizeSafe](#normalizesafe-2) - Returns identity on zero magnitude

#### Since

0.13.0

---

### set()

> **set**(`cos`, `sin`): `this`

Defined in: [src/core/rotation2.ts:866](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L866)

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

---

### setAngle()

> **setAngle**(`angle`): `this`

Defined in: [src/core/rotation2.ts:883](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L883)

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

Defined in: [src/core/rotation2.ts:128](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L128)

Cosine component of the rotation.
For a rotation of angle θ, this equals cos(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`cos`](../../types/interfaces/Rotation2Like.md#cos)

---

### sin

> **sin**: `number`

Defined in: [src/core/rotation2.ts:129](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L129)

Sine component of the rotation.
For a rotation of angle θ, this equals sin(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`sin`](../../types/interfaces/Rotation2Like.md#sin)

## Serialization

### clone()

> **clone**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1484](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1484)

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

---

### toArray()

> **toArray**(): \[`number`, `number`\]

Defined in: [src/core/rotation2.ts:1408](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1408)

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

---

### toJSON()

> **toJSON**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1445](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1445)

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

---

### toObject()

> **toObject**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1426](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1426)

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

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/rotation2.ts:1465](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1465)

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

Defined in: [src/core/rotation2.ts:1072](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1072)

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

---

### applyInverse()

> **applyInverse**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1089](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1089)

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

---

### apply()

> `static` **apply**(`rotation`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:579](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L579)

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

Mathematically equivalent to `Vector2.rotateCS(vector, rotation.cos, rotation.sin, out)`.
Implemented inline for performance in hot paths.

#### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 4);
const v = { x: 1, y: 0 };
const rotated = Rotation2.apply(rot, v); // (0.707, 0.707)
```

#### Since

0.1.0

---

### applyInverse()

> `static` **applyInverse**(`rotation`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:610](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L610)

Applies the inverse rotation to a vector.

#### Parameters

##### rotation

[`ReadonlyRotation2`](../type-aliases/ReadonlyRotation2.md)

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

Mathematically equivalent to rotating by the negated angle.
Uses the conjugate: `(cos, -sin)` instead of `(cos, sin)`.
Implemented inline for performance in hot paths.

#### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 4);
const v = { x: 0.707, y: 0.707 };
const original = Rotation2.applyInverse(rot, v); // ≈ (1, 0)
```

#### Since

0.10.0

## Validation

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/rotation2.ts:1171](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1171)

Returns true if any component is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.9.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/rotation2.ts:1160](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/rotation2.ts#L1160)

Returns true if all components are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.9.0
