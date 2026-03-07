# Class: Complex

Defined in: [src/core/complex.ts:118](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L118)

Mutable complex number with deterministic arithmetic and transforms.

## Remarks

- Instance methods mutate `this` for fluent chaining.
- Static methods are pure and accept an optional `out` parameter.

## Since

0.7.0

## Implements

- [`ComplexLike`](../../types/interfaces/ComplexLike.md)

## Constructors

### Constructor

> **new Complex**(`real`, `imag`): `Complex`

Defined in: [src/core/complex.ts:211](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L211)

#### Parameters

##### real

`number` = `0`

##### imag

`number` = `0`

#### Returns

`Complex`

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/complex.ts:1261](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1261)

Adds another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### conjugate()

> **conjugate**(): `this`

Defined in: [src/core/complex.ts:1395](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1395)

Conjugates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### divide()

> **divide**(`other`): `this`

Defined in: [src/core/complex.ts:1311](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1311)

Divides by another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to divide by

#### Returns

`this`

This for chaining

#### Throws

If denominator magnitude is near zero.

#### See

- [divideSafe](#dividesafe-2) - Sets to (0,0) instead of throwing
- [divideUnchecked](#divideunchecked-2) - No validation

#### Since

0.7.0

---

### divideSafe()

> **divideSafe**(`other`): `this`

Defined in: [src/core/complex.ts:1334](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1334)

Divides by another complex number in place (safe).

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to divide by

#### Returns

`this`

This for chaining (sets to (0,0) if denominator near zero)

#### Since

0.7.0

---

### divideUnchecked()

> **divideUnchecked**(`other`): `this`

Defined in: [src/core/complex.ts:1362](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1362)

Divides by another complex number in place (unchecked).

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to divide by (must have non-zero magnitude)

#### Returns

`this`

This for chaining

#### Remarks

**⚠️ Precondition:** `|other| ≠ 0`.

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/complex.ts:1289](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1289)

Multiplies with another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/complex.ts:1757](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1757)

Negates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/complex.ts:1382](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1382)

Scales this complex number by a scalar in place.

#### Parameters

##### scalar

`number`

Scale factor

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/complex.ts:1275](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1275)

Subtracts another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to subtract

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:332](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L332)

Adds two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

First complex number

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Second complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Sum

#### Since

0.7.0

---

### conjugate()

> `static` **conjugate**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:473](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L473)

Returns the conjugate of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Conjugate

#### Since

0.7.0

---

### divide()

> `static` **divide**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:388](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L388)

Divides two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Numerator

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Denominator

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Quotient

#### Throws

If denominator magnitude is near zero.

#### See

- [divideSafe](#dividesafe-2) - Returns (0,0) instead of throwing
- [divideUnchecked](#divideunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### divideSafe()

> `static` **divideSafe**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:413](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L413)

Divides two complex numbers, returning (0,0) if denominator is near zero.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Numerator

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Denominator

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Quotient, or (0,0) if denominator magnitude is near zero.

#### See

- [divide](#divide-2) - Throws on zero denominator
- [divideUnchecked](#divideunchecked-2) - No validation

#### Since

0.7.0

---

### divideUnchecked()

> `static` **divideUnchecked**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:441](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L441)

Divides two complex numbers without validation.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Numerator

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Denominator (must have non-zero magnitude)

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Quotient

#### Remarks

**⚠️ Precondition:** `|b| ≠ 0`. Calling with zero denominator produces Infinity/NaN.

#### See

- [divide](#divide-2) - Throws on zero denominator
- [divideSafe](#dividesafe-2) - Returns (0,0) on zero denominator

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:367](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L367)

Multiplies two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

First complex number

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Second complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Product

#### Example

```typescript
const a = new Complex(1, 2); // 1 + 2i
const b = new Complex(3, 4); // 3 + 4i
const result = Complex.multiply(a, b); // -5 + 10i
```

#### Since

0.7.0

---

### negate()

> `static` **negate**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:486](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L486)

Negates a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Negated complex

#### Since

0.7.0

---

### scale()

> `static` **scale**(`complex`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:460](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L460)

Scales a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to scale

##### scalar

`number`

Scale factor

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Scaled complex

#### Since

0.7.0

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:346](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L346)

Subtracts two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

First complex number

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Second complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Difference

#### Since

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/complex.ts:1622](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1622)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to compare

#### Returns

`boolean`

True if exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:1638](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1638)

Approximate equality using relative tolerance.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to compare

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if within scaled epsilon

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/complex.ts:620](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L620)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

First complex

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Second complex

#### Returns

`boolean`

True if real and imaginary parts are exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`complex`): `boolean`

Defined in: [src/core/complex.ts:1042](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1042)

Tests if any component is infinite (±Infinity).

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to test

#### Returns

`boolean`

True if any component is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`complex`): `boolean`

Defined in: [src/core/complex.ts:1027](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1027)

Tests if any component is NaN.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to test

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isFinite()

> `static` **isFinite**(`complex`): `boolean`

Defined in: [src/core/complex.ts:1015](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1015)

Tests if both components are finite numbers.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to test

#### Returns

`boolean`

True if both components are finite

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:672](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L672)

Tests if a complex number is the multiplicative identity (1 + 0i).

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if z ≈ 1 + 0i

#### Remarks

The multiplicative identity in ℂ is 1 + 0i, where z \* 1 = z for all z.
This is equivalent to Rotation2.isIdentity() (0° rotation).

#### Since

0.7.0

---

### isImaginary()

> `static` **isImaginary**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:1003](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1003)

Tests if a complex number is purely imaginary.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if real part is near zero

#### Since

0.7.0

---

### isNearZero()

> `static` **isNearZero**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:977](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L977)

Tests if a complex number is near zero within tolerance.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to test.

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON).

#### Returns

`boolean`

True if both components are within epsilon of zero.

#### Since

0.7.0

---

### isReal()

> `static` **isReal**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:990](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L990)

Tests if a complex number is purely real.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if imaginary part is near zero

#### Since

0.7.0

---

### isUnit()

> `static` **isUnit**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:654](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L654)

Tests if a complex number has unit magnitude.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if |z| ≈ 1

#### Since

0.7.0

---

### isZero()

> `static` **isZero**(`complex`): `boolean`

Defined in: [src/core/complex.ts:963](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L963)

Tests if a complex number is exactly zero.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to test.

#### Returns

`boolean`

True if both real and imaginary parts are exactly 0.

#### Remarks

For tolerance-based comparison, use [isNearZero](../../auxiliary/scalar/functions/isNearZero.md).

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:637](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L637)

Approximate equality between two complex numbers using relative tolerance.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

First complex

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Second complex

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if within scaled epsilon

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Since

0.7.0

## Computed

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [src/core/complex.ts:1166](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1166)

Gets the phase angle in radians.
Symmetric with Rotation2.angle getter.

##### Since

0.8.0

##### Returns

`number`

Angle in radians

#### Set Signature

> **set** **angle**(`value`): `void`

Defined in: [src/core/complex.ts:1190](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1190)

Sets the phase angle in radians.
Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
Symmetric with Rotation2.angle setter.

##### Remarks

Unlike immutable libraries (complex.js, math.js), we provide mutable setters
for zero-allocation hot paths in game loops and physics simulations.

##### Example

```typescript
const c = Complex.fromPolar(2, 0);
c.angle = Math.PI / 4;
c.magnitude(); // Still 2
c.angle; // ≈ Math.PI / 4
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

Defined in: [src/core/complex.ts:1206](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1206)

Gets the phase angle in degrees.
Uses auxiliary/angle/conversion for DRY compliance.
Symmetric with Rotation2.angleDegrees getter.

##### Since

0.8.0

##### Returns

`number`

Angle in degrees

#### Set Signature

> **set** **angleDegrees**(`value`): `void`

Defined in: [src/core/complex.ts:1219](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1219)

Sets the phase angle in degrees.
Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
Uses auxiliary/angle/conversion for DRY compliance.
Symmetric with Rotation2.angleDegrees setter.

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

Defined in: [src/core/complex.ts:1232](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1232)

Gets the phase angle in turns (0-1 = one full rotation).
Uses auxiliary/angle/conversion for DRY compliance.
Symmetric with Rotation2.angleTurns getter.

##### Since

0.8.0

##### Returns

`number`

Angle in turns (0-1 range)

#### Set Signature

> **set** **angleTurns**(`value`): `void`

Defined in: [src/core/complex.ts:1245](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1245)

Sets the phase angle in turns.
Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
Uses auxiliary/angle/conversion for DRY compliance.
Symmetric with Rotation2.angleTurns setter.

##### Since

0.8.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### conjugated

#### Get Signature

> **get** **conjugated**(): `Complex`

Defined in: [src/core/complex.ts:1787](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1787)

Returns the conjugate without modifying this number.

##### Since

0.7.0

##### Returns

`Complex`

New conjugate complex

---

### negated

#### Get Signature

> **get** **negated**(): `Complex`

Defined in: [src/core/complex.ts:1814](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1814)

Returns the negated complex without modifying this number.

##### Since

0.7.0

##### Returns

`Complex`

New negated complex

---

### normalized

#### Get Signature

> **get** **normalized**(): `Complex`

Defined in: [src/core/complex.ts:1798](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1798)

Returns the normalized (unit) complex without modifying this number.

##### Since

0.7.0

##### Returns

`Complex`

New unit complex

---

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Complex`

Defined in: [src/core/complex.ts:1825](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1825)

Returns the reciprocal without modifying this number.

##### Since

0.7.0

##### Returns

`Complex`

New reciprocal complex

---

### argument()

> **argument**(): `number`

Defined in: [src/core/complex.ts:1154](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1154)

Returns the argument (phase angle) of this complex number.

#### Returns

`number`

Angle in radians

#### Since

0.7.0

---

### magnitude()

> **magnitude**(): `number`

Defined in: [src/core/complex.ts:1132](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1132)

Returns the magnitude of this complex number.

#### Returns

`number`

Magnitude

#### Since

0.7.0

---

### magnitudeSq()

> **magnitudeSq**(): `number`

Defined in: [src/core/complex.ts:1143](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1143)

Returns the squared magnitude of this complex number.

#### Returns

`number`

Squared magnitude

#### Since

0.7.0

---

### argument()

> `static` **argument**(`complex`): `number`

Defined in: [src/core/complex.ts:696](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L696)

Returns the argument (phase angle) of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Angle in radians

#### Since

0.7.0

---

### magnitude()

> `static` **magnitude**(`complex`): `number`

Defined in: [src/core/complex.ts:684](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L684)

Returns the magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Magnitude

#### Since

0.7.0

---

### magnitudeSq()

> `static` **magnitudeSq**(`complex`): `number`

Defined in: [src/core/complex.ts:708](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L708)

Returns the squared magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Squared magnitude

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/complex.ts:149](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L149)

Number of elements when serialized to an array.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/complex.ts:2078](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L2078)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding real then imag.

#### Example

```typescript
const [real, imag] = new Complex(3, 4);
```

#### Since

0.7.0

## Core

### E

> `readonly` `static` **E**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:205](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L205)

Euler's number as a real complex (e + 0i).

---

### EPSILON_COMPLEX

> `readonly` `static` **EPSILON_COMPLEX**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:179](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L179)

Epsilon complex for tolerance comparison.

---

### I

> `readonly` `static` **I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:161](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L161)

Imaginary unit (0 + 1i).

---

### NEG_I

> `readonly` `static` **NEG_I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:167](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L167)

Negative imaginary unit (0 - 1i).

---

### NEG_ONE

> `readonly` `static` **NEG_ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:173](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L173)

Negative real unit (-1 + 0i).

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:155](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L155)

Real unit (1 + 0i).

---

### PI

> `readonly` `static` **PI**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:199](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L199)

Pi as a real complex (π + 0i).

---

### SQRT2

> `readonly` `static` **SQRT2**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:187](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L187)

Square root of 2 as a real complex (√2 + 0i).

---

### SQRT2_INV

> `readonly` `static` **SQRT2_INV**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:193](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L193)

Inverse of square root of 2 as a real complex (1/√2 + 0i).

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:142](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L142)

Zero complex (0 + 0i).

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Complex`

Defined in: [src/core/complex.ts:301](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L301)

Creates a deep copy of a complex number.

#### Parameters

##### source

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to clone

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

A Complex with identical values

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Complex`

Defined in: [src/core/complex.ts:314](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L314)

Copies values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Source complex

##### destination

`Complex`

Target complex to receive the copy

#### Returns

`Complex`

The destination complex

#### Since

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Complex`

Defined in: [src/core/complex.ts:249](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L249)

Creates a complex number from an array [real, imag].

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array

##### offset

`number` = `0`

Index offset (default: 0)

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex number

#### Throws

If offset is out of bounds

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Complex`

Defined in: [src/core/complex.ts:267](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L267)

Creates a complex number from an object { real, imag }.

#### Parameters

##### object

[`ComplexLike`](../../types/interfaces/ComplexLike.md)

Source object

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex number

#### Since

0.7.0

---

### fromPolar()

> `static` **fromPolar**(`magnitude`, `angle`, `out?`): `Complex`

Defined in: [src/core/complex.ts:231](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L231)

Creates a complex number from polar coordinates (magnitude and angle).

#### Parameters

##### magnitude

`number`

Length of the complex vector

##### angle

`number`

Angle in radians

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex number (magnitude * e^(i*angle))

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`real`, `imag`, `out?`): `Complex`

Defined in: [src/core/complex.ts:288](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L288)

Creates a complex number from individual real and imaginary values.

#### Parameters

##### real

`number`

Real component

##### imag

`number`

Imaginary component

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex number

#### Example

```typescript
Complex.fromValues(1, 0); // Real unit (1 + 0i)
Complex.fromValues(0, 1); // Imaginary unit (0 + 1i)
Complex.fromValues(3, 4); // 3 + 4i
```

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/complex.ts:1844](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1844)

Linear interpolation towards another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Target complex

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/complex.ts:1859](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1859)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Target complex

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

Defined in: [src/core/complex.ts:1872](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1872)

Spherical linear interpolation towards another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Target complex

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

Defined in: [src/core/complex.ts:1894](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1894)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Target complex

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

Defined in: [src/core/complex.ts:1910](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1910)

Smooth interpolation with another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Target complex number

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

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Complex`

Defined in: [src/core/complex.ts:505](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L505)

Linear interpolation between two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Start complex

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

End complex

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Interpolated complex

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Complex`

Defined in: [src/core/complex.ts:520](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L520)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Start complex

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

End complex

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Interpolated complex

#### Since

0.7.0

---

### slerp()

> `static` **slerp**(`a`, `b`, `t`, `out?`): `Complex`

Defined in: [src/core/complex.ts:541](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L541)

Spherical linear interpolation between two complex numbers.
Interpolates both magnitude and angle.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Start complex

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

End complex

##### t

`number`

Interpolation factor (not clamped, allows extrapolation)

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Interpolated complex

#### Since

0.7.0

---

### slerpClamped()

> `static` **slerpClamped**(`a`, `b`, `t`, `out?`): `Complex`

Defined in: [src/core/complex.ts:563](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L563)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Start complex

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

End complex

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Interpolated complex

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Complex`

Defined in: [src/core/complex.ts:594](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L594)

Smooth interpolation between two complex numbers using smoothStep easing.

#### Parameters

##### a

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Source complex number

##### b

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Target complex number

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Smoothly interpolated complex number

#### Remarks

Uses Hermite smoothStep for ease-in-out effect.
Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.

#### Example

```typescript
const a = Complex.fromPolar(1, 0);
const b = Complex.fromPolar(1, Math.PI / 2);
const smooth = Complex.smoothStep(a, b, 0.5); // Smooth interpolation
```

#### Since

0.7.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/complex.ts:1076](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1076)

Copies values from another complex number.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Source complex

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`real`, `imag`): `this`

Defined in: [src/core/complex.ts:1062](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1062)

Sets the real and imaginary parts.

#### Parameters

##### real

`number`

Real part

##### imag

`number`

Imaginary part

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/complex.ts:1105](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1105)

Sets from array values.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array [real, imag].

##### offset

`number` = `0`

Starting index (default 0).

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### setFromPolar()

> **setFromPolar**(`magnitude`, `angle`): `this`

Defined in: [src/core/complex.ts:1091](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1091)

Sets from polar coordinates.

#### Parameters

##### magnitude

`number`

Distance from origin.

##### angle

`number`

Angle in radians.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### setFromVector2()

> **setFromVector2**(`v`): `this`

Defined in: [src/core/complex.ts:1117](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1117)

Sets from a Vector2 (x→real, y→imag).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector.

#### Returns

`this`

This for chaining.

#### Since

0.7.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/complex.ts:1770](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1770)

Resets this complex number to zero.

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### imag

> **imag**: `number`

Defined in: [src/core/complex.ts:124](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L124)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`imag`](../../types/interfaces/ComplexLike.md#imag)

---

### real

> **real**: `number`

Defined in: [src/core/complex.ts:123](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L123)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`real`](../../types/interfaces/ComplexLike.md#real)

## Predicate

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/complex.ts:1722](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1722)

Tests if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any component is ±Infinity

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/complex.ts:1711](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1711)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/complex.ts:1700](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1700)

Tests if both components are finite numbers.

#### Returns

`boolean`

True if both components are finite

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:1746](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1746)

Tests if this complex number is the multiplicative identity (1 + 0i).

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if z ≈ 1 + 0i

#### Since

0.7.0

---

### isImaginary()

> **isImaginary**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:1689](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1689)

Tests if this complex number is purely imaginary.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if real part is near zero

#### Since

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:1665](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1665)

Tests if this complex number is near zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if near zero

#### Since

0.7.0

---

### isReal()

> **isReal**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:1677](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1677)

Tests if this complex number is purely real.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if imaginary part is near zero

#### Since

0.7.0

---

### isUnit()

> **isUnit**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:1734](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1734)

Tests if this complex number has unit magnitude.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if |z| ≈ 1

#### Since

0.7.0

---

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/complex.ts:1653](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1653)

Tests if this complex number is exactly zero.

#### Returns

`boolean`

True if both real and imag are exactly 0.

#### Since

0.7.0

## Serialization

### clone()

> **clone**(): `Complex`

Defined in: [src/core/complex.ts:2062](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L2062)

Creates a deep copy of this complex number.

#### Returns

`Complex`

New Complex with identical values

#### Example

```typescript
const c = new Complex(3, 4);
const copy = c.clone();
copy.set(0, 0); // Original unchanged
```

#### Since

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): \[`number`, `number`\] \| `T`

Defined in: [src/core/complex.ts:1972](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1972)

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
const c = new Complex(3, 4);
const [real, imag] = c.toArray();

// Write to existing array
const arr = new Float32Array(10);
c.toArray(arr, 4); // writes at indices 4, 5
```

#### Since

0.7.0

---

### toJSON()

> **toJSON**(): [`ComplexLike`](../../types/interfaces/ComplexLike.md)

Defined in: [src/core/complex.ts:2017](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L2017)

Converts the complex number to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`ComplexLike`](../../types/interfaces/ComplexLike.md)

Object suitable for JSON serialization

#### Example

```typescript
const c = new Complex(3, 4);
const json = JSON.stringify(c);
// '{"real":3,"imag":4}'
```

#### Since

0.7.0

---

### toObject()

> **toObject**(): [`ComplexLike`](../../types/interfaces/ComplexLike.md)

Defined in: [src/core/complex.ts:1998](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1998)

Converts the complex number to a plain object.

#### Returns

[`ComplexLike`](../../types/interfaces/ComplexLike.md)

Object with real and imag properties

#### Example

```typescript
const c = new Complex(3, 4);
const obj = c.toObject();
// { real: 3, imag: 4 }
```

#### Since

0.7.0

---

### toRotationMatrix2()

> **toRotationMatrix2**(`out?`): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/complex.ts:1942](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1942)

Converts the complex number to a 2D rotation matrix.
The complex number is normalized before conversion.

#### Parameters

##### out?

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Optional output matrix object to populate

#### Returns

[`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Rotation matrix as Matrix2Like (plain object or provided out)

#### Remarks

Returns a `Matrix2Like` object, not a `Matrix2` instance, to avoid
circular dependencies. If you need a full `Matrix2` instance, use:

```typescript
const mat = Matrix2.fromObject(complex.toRotationMatrix2());
```

#### Example

```typescript
const c = Complex.fromPolar(1, Math.PI / 4);
const m = c.toRotationMatrix2();
// m represents a 45° rotation: { m00: cos, m01: sin, m10: -sin, m11: cos }
```

#### Since

0.7.0

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/complex.ts:2041](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L2041)

Creates a human-readable string representation.
Uses standard mathematical notation: a + bi or a - bi.

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

Formatted string

#### Example

```typescript
const c = new Complex(3, 4);
console.log(c.toString());
// "3.0000 + 4.0000i"

const c2 = new Complex(1, -2);
console.log(c2.toString());
// "1.0000 - 2.0000i"
```

#### Since

0.7.0

## Transform

### apply()

> **apply**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:1486](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1486)

Applies this complex number as a rotation to a vector.

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

#### Remarks

The complex number is normalized before applying to ensure
a pure rotation without scaling.

#### Example

```typescript
const c = Complex.fromPolar(1, Math.PI / 4);
const v = { x: 1, y: 0 };
const rotated = c.apply(v); // (0.707, 0.707)
```

#### Since

0.7.0

---

### applyInverse()

> **applyInverse**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:1513](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1513)

Applies the inverse rotation of this complex number to a vector.

#### Parameters

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate inversely

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Rotated vector (in the opposite direction)

#### Remarks

Uses the conjugate of the normalized complex number.
For a complex representing angle θ, this rotates by -θ.

Relationship: `c.applyInverse(c.apply(v)) ≈ v`

#### Example

```typescript
const c = Complex.fromPolar(1, Math.PI / 4);
const v = { x: 1, y: 0 };
const rotated = c.apply(v); // ≈ (0.707, 0.707)
const back = c.applyInverse(rotated); // ≈ (1, 0)
```

#### Since

0.7.0

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/complex.ts:1412](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1412)

Normalizes this complex number to unit length in place.

#### Returns

`this`

This for chaining

#### Throws

If magnitude is near zero

#### Since

0.7.0

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/complex.ts:1430](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1430)

Safe normalization. Sets to (1, 0) if magnitude is near zero.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/complex.ts:1458](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1458)

Normalizes this complex number without validation (for hot paths).

#### Returns

`this`

This for chaining

#### Remarks

**WARNING:** This method performs no validation.

- If magnitude is zero, this will become (NaN, NaN).
- Use only when you can guarantee non-zero magnitude.

#### See

- [normalize](#normalize-2) - Throws on zero-magnitude
- [normalizeSafe](#normalizesafe-2) - Sets to (1, 0) on zero-magnitude

#### Since

0.7.0

---

### pow()

> **pow**(`exponent`): `this`

Defined in: [src/core/complex.ts:1585](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1585)

Raises this complex number to a power in place.

#### Parameters

##### exponent

`number`

Exponent

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### reciprocal()

> **reciprocal**(): `this`

Defined in: [src/core/complex.ts:1528](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1528)

Computes the reciprocal of this complex number in place.

#### Returns

`this`

This for chaining

#### Throws

If magnitude is near zero.

#### See

- [reciprocalSafe](#reciprocalsafe-2) - Sets to (0,0) instead of throwing
- [reciprocalUnchecked](#reciprocalunchecked-2) - No validation

#### Since

0.7.0

---

### reciprocalSafe()

> **reciprocalSafe**(): `this`

Defined in: [src/core/complex.ts:1546](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1546)

Computes the reciprocal of this complex number in place (safe).

#### Returns

`this`

This for chaining (sets to (0,0) if magnitude near zero)

#### Since

0.7.0

---

### reciprocalUnchecked()

> **reciprocalUnchecked**(): `this`

Defined in: [src/core/complex.ts:1569](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1569)

Computes the reciprocal of this complex number in place (unchecked).

#### Returns

`this`

This for chaining

#### Remarks

**⚠️ Precondition:** Magnitude must be non-zero.

#### Since

0.7.0

---

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/complex.ts:1603](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L1603)

Computes the square root of this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### apply()

> `static` **apply**(`complex`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:804](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L804)

Applies a complex number as a rotation to a vector.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number (will be normalized first)

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

- Use `Complex.apply` for pure rotation (operator semantics).
- Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
- The complex number is normalized before applying to ensure a pure rotation.

#### Example

```typescript
const c = Complex.fromPolar(1, Math.PI / 4);
const v = { x: 1, y: 0 };
const rotated = Complex.apply(c, v); // (0.707, 0.707)
```

#### Since

0.7.0

---

### applyInverse()

> `static` **applyInverse**(`complex`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:844](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L844)

Applies the inverse rotation of a complex number to a vector.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number (will be normalized first)

##### vector

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Vector to rotate inversely

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Rotated vector (in the opposite direction)

#### Remarks

- Use `Complex.applyInverse` for pure rotation (operator semantics).
- Use `Matrix2.transformVector` for general linear transformations (spatial semantics).
- Uses the conjugate of the normalized complex number.

Relationship: `applyInverse(c, apply(c, v)) ≈ v`

#### Example

```typescript
const c = Complex.fromPolar(1, Math.PI / 4); // 45° rotation
const v = { x: 1, y: 0 };
const rotated = Complex.apply(c, v); // ≈ (0.707, 0.707)
const back = Complex.applyInverse(c, rotated); // ≈ (1, 0)
```

#### Since

0.7.0

---

### normalize()

> `static` **normalize**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:722](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L722)

Normalizes a complex number to unit length.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Normalized complex

#### Throws

If magnitude is near zero

#### Since

0.7.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:750](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L750)

Safe normalization that handles zero-magnitude complex numbers.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to normalize

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Normalized complex, or (1, 0) if input has zero magnitude

#### Remarks

Unlike [normalize](#normalize-2), this method returns the unit real (1, 0)
instead of throwing when the input has zero magnitude.

#### Example

```typescript
const zero = Complex.ZERO;
const safe = Complex.normalizeSafe(zero); // Returns (1, 0)
```

#### Since

0.7.0

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:776](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L776)

Normalizes a complex number without validation (for hot paths).

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to normalize (must have non-zero magnitude)

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Normalized complex

#### Remarks

**WARNING:** This method performs no validation.

- If complex has zero magnitude, the result will be (NaN, NaN).
- Use only when you can guarantee non-zero magnitude.

#### See

- [normalize](#normalize-2) - Throws on zero-magnitude
- [normalizeSafe](#normalizesafe-2) - Returns (1, 0) on zero-magnitude

#### Since

0.7.0

---

### pow()

> `static` **pow**(`complex`, `exponent`, `out?`): `Complex`

Defined in: [src/core/complex.ts:930](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L930)

Raises a complex number to a power.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Base complex number

##### exponent

`number`

Exponent

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex raised to power

#### Since

0.7.0

---

### reciprocal()

> `static` **reciprocal**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:873](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L873)

Returns the reciprocal of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Reciprocal

#### Throws

If magnitude is near zero.

#### See

- [reciprocalSafe](#reciprocalsafe-2) - Returns (0,0) instead of throwing
- [reciprocalUnchecked](#reciprocalunchecked-2) - No validation

#### Since

0.7.0

---

### reciprocalSafe()

> `static` **reciprocalSafe**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:893](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L893)

Returns the reciprocal of a complex number, returning (0,0) if magnitude is near zero.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Reciprocal, or (0,0) if input has zero magnitude.

#### See

[reciprocal](#reciprocal-2) - Throws on zero magnitude

#### Since

0.7.0

---

### reciprocalUnchecked()

> `static` **reciprocalUnchecked**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:914](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L914)

Returns the reciprocal of a complex number without validation.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number (must have non-zero magnitude)

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Reciprocal

#### Remarks

**⚠️ Precondition:** `|complex| ≠ 0`. Calling with zero produces Infinity/NaN.

#### Since

0.7.0

---

### sqrt()

> `static` **sqrt**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:947](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/complex.ts#L947)

Returns the square root of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Square root

#### Since

0.7.0
