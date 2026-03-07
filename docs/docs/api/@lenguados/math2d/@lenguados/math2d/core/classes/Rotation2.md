# Class: Rotation2

Defined in: [src/core/rotation2.ts:120](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L120)

Deterministic 2D rotation stored as cosine and sine components.

## Remarks

Instances are normalized to unit magnitude, making them efficient for rotations.
Following standard mathematical conventions, all rotations in this library are **Counter-Clockwise (CCW) Positive**.

## Since

0.7.0

## Implements

- [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

## Constructors

### Constructor

> **new Rotation2**(`cos`, `sin`): `Rotation2`

Defined in: [src/core/rotation2.ts:132](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L132)

#### Parameters

##### cos

`number` = `1`

##### sin

`number` = `0`

#### Returns

`Rotation2`

## Accessor

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [src/core/rotation2.ts:1035](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1035)

Gets the angle in radians.

##### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 4);
console.log(rot.angle); // 0.785...
```

##### Since

0.8.0

##### Returns

`number`

Angle in radians

#### Set Signature

> **set** **angle**(`value`): `void`

Defined in: [src/core/rotation2.ts:1052](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1052)

Sets the angle in radians.
Zero-allocation: mutates in place.

##### Example

```typescript
const rot = new Rotation2();
rot.angle = Math.PI / 4;
```

##### Since

0.8.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### angleDegrees

#### Get Signature

> **get** **angleDegrees**(): `number`

Defined in: [src/core/rotation2.ts:1070](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1070)

Gets the angle in degrees.
Uses auxiliary/angle/conversion for DRY compliance.

##### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI / 2);
console.log(rot.angleDegrees); // 90
```

##### Since

0.8.0

##### Returns

`number`

Angle in degrees

#### Set Signature

> **set** **angleDegrees**(`value`): `void`

Defined in: [src/core/rotation2.ts:1086](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1086)

Sets the angle in degrees.
Uses auxiliary/angle/conversion for DRY compliance.

##### Example

```typescript
rot.angleDegrees = 45;
```

##### Since

0.8.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### angleTurns

#### Get Signature

> **get** **angleTurns**(): `number`

Defined in: [src/core/rotation2.ts:1104](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1104)

Gets the angle in turns (0-1 = one full rotation).
Uses auxiliary/angle/conversion for DRY compliance.

##### Example

```typescript
const rot = Rotation2.fromAngle(Math.PI); // 180°
console.log(rot.angleTurns); // 0.5
```

##### Since

0.8.0

##### Returns

`number`

Angle in turns (0-1 range)

#### Set Signature

> **set** **angleTurns**(`value`): `void`

Defined in: [src/core/rotation2.ts:1120](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1120)

Sets the angle in turns (0-1 = one full rotation).
Uses auxiliary/angle/conversion for DRY compliance.

##### Example

```typescript
rot.angleTurns = 0.25; // 90°
```

##### Since

0.8.0

##### Parameters

###### value

`number`

##### Returns

`void`

## Arithmetic

### inverse()

> **inverse**(): `this`

Defined in: [src/core/rotation2.ts:1151](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1151)

Inverts this rotation in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/rotation2.ts:1136](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1136)

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

Defined in: [src/core/rotation2.ts:1163](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1163)

Negates this rotation in place (same as inverse for unit rotations).

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### relativeTo()

> **relativeTo**(`other`): `this`

Defined in: [src/core/rotation2.ts:1176](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1176)

Computes rotation relative to another in place.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Reference rotation

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### inverse()

> `static` **inverse**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:533](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L533)

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

Defined in: [src/core/rotation2.ts:514](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L514)

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

#### Since

0.7.0

---

### negate()

> `static` **negate**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:566](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L566)

Negates a rotation (same as rotating by -angle).

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

#### Since

0.7.0

---

### relative()

> `static` **relative**(`a`, `b`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:547](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L547)

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

Defined in: [src/core/rotation2.ts:1233](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1233)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to compare

#### Returns

`boolean`

True if cos and sin are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:1262](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1262)

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

0.7.0

---

### isNormalized()

> **isNormalized**(`epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:1274](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1274)

Tests if this rotation is normalized (unit magnitude).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if cos² + sin² ≈ 1

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:1250](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1250)

Approximate equality with wrap-around handling using relative tolerance.

#### Parameters

##### other

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

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

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/rotation2.ts:771](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L771)

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

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:865](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L865)

Tests if any component is infinite (±Infinity).

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

#### Returns

`boolean`

True if cos or sin is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`rotation`): `boolean`

Defined in: [src/core/rotation2.ts:850](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L850)

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

Defined in: [src/core/rotation2.ts:838](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L838)

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

> `static` **isIdentity**(`rotation`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:812](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L812)

Tests if a rotation is the identity.

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if rotation is identity

#### Since

0.7.0

---

### isNormalized()

> `static` **isNormalized**(`rotation`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:825](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L825)

Tests if a rotation is normalized (unit magnitude).

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if |cos² + sin² - 1| < epsilon

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/rotation2.ts:789](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L789)

Approximate equality between two rotations using relative tolerance.

#### Parameters

##### a

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

First rotation

##### b

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

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

0.7.0

## Computed

### angleValue

#### Get Signature

> **get** **angleValue**(): `number`

Defined in: [src/core/rotation2.ts:1407](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1407)

Returns the angle in radians without method call.

##### Since

0.7.0

##### Returns

`number`

Angle in radians

---

### doubled

#### Get Signature

> **get** **doubled**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1333](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1333)

Returns the double of this rotation without modifying it.

##### Since

0.7.0

##### Returns

`Rotation2`

New rotation with double the angle

---

### inversed

#### Get Signature

> **get** **inversed**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1322](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1322)

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

Defined in: [src/core/rotation2.ts:1379](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1379)

Returns the negated rotation without modifying this one.
Equivalent to rotating by the negative angle.

##### Since

0.7.0

##### Returns

`Rotation2`

New negated rotation

---

### normalized

#### Get Signature

> **get** **normalized**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1395](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1395)

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

Defined in: [src/core/rotation2.ts:1345](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1345)

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

Defined in: [src/core/rotation2.ts:1356](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1356)

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

Defined in: [src/core/rotation2.ts:1367](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1367)

Returns the Y-axis direction vector of this rotation.

##### Since

0.7.0

##### Returns

[`Vector2`](Vector2.md)

Unit vector perpendicular to rotation direction

---

### angle()

> `static` **angle**(`rotation`): `number`

Defined in: [src/core/rotation2.ts:884](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L884)

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

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/rotation2.ts:170](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L170)

Number of elements when serialized to an array.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/rotation2.ts:1656](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1656)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding cos then sin.

#### Example

```typescript
const [cos, sin] = Rotation2.fromAngle(Math.PI / 4);
```

#### Since

0.7.0

---

### toComplex()

> **toComplex**(`out?`): [`Complex`](Complex.md)

Defined in: [src/core/rotation2.ts:1508](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1508)

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

### toVector2()

> **toVector2**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1528](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1528)

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

## Core

### EIGHTH_TURN

> `readonly` `static` **EIGHTH_TURN**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:196](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L196)

45° rotation (π/4).

---

### HALF_TURN

> `readonly` `static` **HALF_TURN**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:182](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L182)

180° rotation.

---

### IDENTITY

> `readonly` `static` **IDENTITY**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:163](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L163)

Identity rotation (0°).

---

### NEGATIVE_QUARTER

> `readonly` `static` **NEGATIVE_QUARTER**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:220](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L220)

-90° rotation (clockwise quarter turn).

---

### QUARTER_TURN

> `readonly` `static` **QUARTER_TURN**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:176](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L176)

90° counter-clockwise rotation.

---

### SIXTEENTH_TURN

> `readonly` `static` **SIXTEENTH_TURN**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:212](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L212)

22.5° rotation (π/8).

---

### SIXTH_TURN

> `readonly` `static` **SIXTH_TURN**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:228](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L228)

60° rotation (π/3).

---

### THREE_QUARTER_TURN

> `readonly` `static` **THREE_QUARTER_TURN**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:188](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L188)

270° counter-clockwise rotation (90° clockwise).

---

### TWELFTH_TURN

> `readonly` `static` **TWELFTH_TURN**: [`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Defined in: [src/core/rotation2.ts:204](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L204)

30° rotation (π/6).

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:403](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L403)

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

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Rotation2`

Defined in: [src/core/rotation2.ts:416](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L416)

Copies values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Source rotation

##### destination

`Rotation2`

Target rotation to receive the copy

#### Returns

`Rotation2`

The destination rotation

#### Since

0.7.0

---

### fromAngle()

> `static` **fromAngle**(`angle`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:251](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L251)

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

> `static` **fromArray**(`array`, `offset`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:384](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L384)

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

0.7.0

---

### fromComplex()

> `static` **fromComplex**(`complex`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:308](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L308)

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

0.7.0

---

### fromComplexSafe()

> `static` **fromComplexSafe**(`complex`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:323](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L323)

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

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:336](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L336)

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

0.7.0

---

### fromValues()

> `static` **fromValues**(`cos`, `sin`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:362](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L362)

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

0.7.0

---

### fromVector2()

> `static` **fromVector2**(`direction`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:267](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L267)

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

0.7.0

---

### fromVectors2()

> `static` **fromVectors2**(`from`, `to`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:289](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L289)

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

0.7.0

---

### normalize()

> `static` **normalize**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:431](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L431)

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

#### Since

0.7.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:459](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L459)

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

Unlike [normalize](#normalize-2), this method returns the identity rotation
instead of throwing when the input has zero magnitude. This is useful
for accumulated rotations that may drift due to floating-point errors.

#### Example

```typescript
const drifted = new Rotation2(0.0000001, 0); // Nearly zero
const safe = Rotation2.normalizeSafe(drifted); // Returns IDENTITY
```

#### Since

0.7.0

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`rotation`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:491](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L491)

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

**⚠️ Precondition:** Rotation must have non-zero magnitude.
Calling with zero-magnitude produces Infinity/NaN.

Use in performance-critical code where rotation validity is guaranteed.

#### See

- [normalize](#normalize-2) - Throws on zero magnitude
- [normalizeSafe](#normalizesafe-2) - Returns identity on zero magnitude

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1424](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1424)

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

Defined in: [src/core/rotation2.ts:1441](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1441)

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

### slerp()

> **slerp**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1468](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1468)

Spherical linear interpolation with another rotation in place.

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

### slerpClamped()

> **slerpClamped**(`other`, `t`): `this`

Defined in: [src/core/rotation2.ts:1485](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1485)

Spherical linear interpolation with t clamped to [0, 1].

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

Defined in: [src/core/rotation2.ts:1454](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1454)

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

Defined in: [src/core/rotation2.ts:652](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L652)

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

Interpolation factor [0, 1], clamped

##### out?

`Rotation2`

Optional output rotation

#### Returns

`Rotation2`

Interpolated rotation

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:673](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L673)

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

### slerp()

> `static` **slerp**(`from`, `to`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:693](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L693)

Spherical linear interpolation between two rotations.

#### Parameters

##### from

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Start rotation

##### to

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

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

0.7.0

---

### slerpClamped()

> `static` **slerpClamped**(`from`, `to`, `t`, `out?`): `Rotation2`

Defined in: [src/core/rotation2.ts:714](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L714)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### from

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Start rotation

##### to

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

Defined in: [src/core/rotation2.ts:745](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L745)

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

Defined in: [src/core/rotation2.ts:933](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L933)

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

Defined in: [src/core/rotation2.ts:946](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L946)

Resets to identity rotation (0°).

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/rotation2.ts:959](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L959)

Normalizes this rotation to unit length.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/rotation2.ts:984](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L984)

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

0.7.0

---

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/rotation2.ts:1010](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1010)

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

0.7.0

---

### set()

> **set**(`cos`, `sin`): `this`

Defined in: [src/core/rotation2.ts:901](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L901)

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

Defined in: [src/core/rotation2.ts:917](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L917)

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

Defined in: [src/core/rotation2.ts:125](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L125)

Cosine component of the rotation.
For a rotation of angle θ, this equals cos(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`cos`](../../types/interfaces/Rotation2Like.md#cos)

---

### sin

> **sin**: `number`

Defined in: [src/core/rotation2.ts:126](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L126)

Sine component of the rotation.
For a rotation of angle θ, this equals sin(θ).

#### Implementation of

[`Rotation2Like`](../../types/interfaces/Rotation2Like.md).[`sin`](../../types/interfaces/Rotation2Like.md#sin)

## Serialization

### clone()

> **clone**(): `Rotation2`

Defined in: [src/core/rotation2.ts:1640](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1640)

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

Defined in: [src/core/rotation2.ts:1556](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1556)

Writes to array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

#### Parameters

##### out?

`T`

Optional destination array. If not provided, returns a new tuple.

##### offset?

`number` = `0`

Write offset.

#### Returns

\[`number`, `number`\] \| `T`

The output array, or a new tuple if no output was provided.

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

### toJSON()

> **toJSON**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1601](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1601)

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

### toObject()

> **toObject**(): [`Rotation2Like`](../../types/interfaces/Rotation2Like.md)

Defined in: [src/core/rotation2.ts:1582](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1582)

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

> **toString**(`precision`): `string`

Defined in: [src/core/rotation2.ts:1621](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1621)

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

0.7.0

## Transform

### apply()

> **apply**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:1197](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1197)

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

Defined in: [src/core/rotation2.ts:1214](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1214)

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

0.7.0

---

### apply()

> `static` **apply**(`rotation`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/rotation2.ts:596](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L596)

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

Defined in: [src/core/rotation2.ts:627](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L627)

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

## Validation

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/rotation2.ts:1307](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1307)

Returns true if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any ±Infinity value exists

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/rotation2.ts:1296](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1296)

Returns true if any component is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/rotation2.ts:1285](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/rotation2.ts#L1285)

Returns true if all components are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.7.0
