# Class: Complex

Defined in: [src/core/complex.ts:175](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L175)

Mutable interface for complex numbers.

## Since

0.7.0

## Implements

- [`ComplexLike`](../../types/interfaces/ComplexLike.md)

## Constructors

### Constructor

> **new Complex**(`real`, `imag`): `Complex`

Defined in: [src/core/complex.ts:284](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L284)

Creates a new Complex number from real and imaginary parts.

#### Parameters

##### real

`number` = `0`

Real component.

##### imag

`number` = `0`

Imaginary component.

#### Returns

`Complex`

#### Default Value

`0`

#### Default Value

`0`

## Accessor

### angle

#### Get Signature

> **get** **angle**(): `number`

Defined in: [src/core/complex.ts:1416](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1416)

Gets the phase angle in radians.
Symmetric with Rotation2.angle getter.

##### Since

0.7.0

##### Returns

`number`

Angle in radians

#### Set Signature

> **set** **angle**(`value`): `void`

Defined in: [src/core/complex.ts:1440](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1440)

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

0.7.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### angleDegrees

#### Get Signature

> **get** **angleDegrees**(): `number`

Defined in: [src/core/complex.ts:1455](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1455)

Gets the phase angle in degrees.
Symmetric with Rotation2.angleDegrees getter.

##### Since

0.7.0

##### Returns

`number`

Angle in degrees

#### Set Signature

> **set** **angleDegrees**(`value`): `void`

Defined in: [src/core/complex.ts:1467](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1467)

Sets the phase angle in degrees.
Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
Symmetric with Rotation2.angleDegrees setter.

##### Since

0.7.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### angleTurns

#### Get Signature

> **get** **angleTurns**(): `number`

Defined in: [src/core/complex.ts:1479](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1479)

Gets the phase angle in turns (0-1 = one full rotation).
Symmetric with Rotation2.angleTurns getter.

##### Since

0.7.0

##### Returns

`number`

Angle in turns (0-1 range)

#### Set Signature

> **set** **angleTurns**(`value`): `void`

Defined in: [src/core/complex.ts:1491](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1491)

Sets the phase angle in turns.
Preserves magnitude, only changes angle. Zero-allocation in-place mutation.
Symmetric with Rotation2.angleTurns setter.

##### Since

0.7.0

##### Parameters

###### value

`number`

##### Returns

`void`

---

### conjugated

#### Get Signature

> **get** **conjugated**(): `Complex`

Defined in: [src/core/complex.ts:2104](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2104)

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

Defined in: [src/core/complex.ts:2143](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2143)

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

Defined in: [src/core/complex.ts:2127](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2127)

Returns the normalized (unit) complex without modifying this number.

##### Remarks

Returns `(1, 0)` (multiplicative identity) for zero-magnitude input,
consistent with [normalizeSafe](#normalizesafe-2). A zero-magnitude complex number
is not a valid element of the multiplicative group C\*, so the identity
`(1, 0)` is the algebraically correct fallback. This aligns with
Rotation2.normalized which also returns identity for zero-magnitude.

**BREAKING (v0.6.0 → v0.7.0):** Previously returned `(0, 0)` for
zero-magnitude input. Changed to `(1, 0)` to match `normalizeSafe()`
and the algebraic identity convention. No deprecated alias is provided.

##### Since

0.7.0

##### Returns

`Complex`

New unit complex

---

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Complex`

Defined in: [src/core/complex.ts:2160](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2160)

Returns the reciprocal without modifying this number.
Uses safe behavior: returns (0,0) for zero-magnitude input.

##### Remarks

Delegates to [Complex.reciprocalSafe](#reciprocalsafe-2). Cleans up negative zero
on the imaginary component when the input is purely real.

##### Since

0.7.0

##### Returns

`Complex`

New reciprocal complex

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/complex.ts:1507](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1507)

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

Defined in: [src/core/complex.ts:1630](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1630)

Conjugates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### divide()

> **divide**(`other`): `this`

Defined in: [src/core/complex.ts:1563](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1563)

Divides by another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to divide by

#### Returns

`this`

This for chaining

#### Throws

If denominator magnitude is near zero

#### Example

```typescript
new Complex(4, 2).divide(new Complex(1, 1)); // (3, -1)
new Complex(1, 0).divide(Complex.ZERO); // throws RangeError
```

#### See

- [divideSafe](#dividesafe-2) - Returns fallback on zero denominator
- [divideUnchecked](#divideunchecked-2) - No validation

#### Since

0.7.0

---

### divideSafe()

> **divideSafe**(`other`): `this`

Defined in: [src/core/complex.ts:1584](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1584)

Divides by another complex number in place (safe).

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to divide by

#### Returns

`this`

This for chaining (sets to (0,0) if denominator near zero)

#### Example

```typescript
new Complex(4, 2).divideSafe(new Complex(1, 1)); // (3, -1)
new Complex(1, 0).divideSafe(Complex.ZERO); // (0, 0)
```

#### See

[divide](#divide-2) - Throws for zero denominator

#### Since

0.7.0

---

### divideUnchecked()

> **divideUnchecked**(`other`): `this`

Defined in: [src/core/complex.ts:1604](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1604)

Divides by another complex number in place (unchecked).

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to divide by (must have non-zero magnitude)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `|other| ≠ 0`.

#### See

- [divide](#divide-2) - Throws on zero denominator
- [divideSafe](#dividesafe-2) - Returns fallback on zero denominator

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/complex.ts:1535](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1535)

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

Defined in: [src/core/complex.ts:2072](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2072)

Negates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/complex.ts:1617](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1617)

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

Defined in: [src/core/complex.ts:1521](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1521)

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

Defined in: [src/core/complex.ts:483](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L483)

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

Defined in: [src/core/complex.ts:626](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L626)

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

Defined in: [src/core/complex.ts:545](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L545)

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

If denominator magnitude is near zero

#### Example

```typescript
Complex.divide(new Complex(4, 2), new Complex(1, 1)); // (3, -1)
Complex.divide(new Complex(1, 0), Complex.ZERO); // throws RangeError
```

#### See

- [divideSafe](#dividesafe-2) - Returns fallback on zero denominator
- [divideUnchecked](#divideunchecked-2) - No validation

#### Since

0.7.0

---

### divideSafe()

> `static` **divideSafe**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:572](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L572)

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

Quotient, or (0,0) if denominator magnitude is near zero

#### Example

```typescript
Complex.divideSafe(new Complex(4, 2), new Complex(1, 1)); // (3, -1)
Complex.divideSafe(new Complex(1, 0), Complex.ZERO); // (0, 0)
```

#### See

[divide](#divide-2) - Throws for zero denominator

#### Since

0.7.0

---

### divideUnchecked()

> `static` **divideUnchecked**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:598](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L598)

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

**Precondition:** `|b| ≠ 0`. Calling with zero denominator produces Infinity/NaN.

#### See

- [divide](#divide-2) - Throws on zero denominator
- [divideSafe](#dividesafe-2) - Returns fallback on zero denominator

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:518](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L518)

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

Defined in: [src/core/complex.ts:639](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L639)

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

Defined in: [src/core/complex.ts:613](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L613)

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

Defined in: [src/core/complex.ts:497](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L497)

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

Defined in: [src/core/complex.ts:1934](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1934)

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

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/complex.ts:2035](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2035)

Tests if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any component is ±Infinity

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/complex.ts:2024](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2024)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/complex.ts:2013](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2013)

Tests if both components are finite numbers.

#### Returns

`boolean`

True if both components are finite

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:2059](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2059)

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

Defined in: [src/core/complex.ts:2002](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2002)

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

Defined in: [src/core/complex.ts:1978](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1978)

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

Defined in: [src/core/complex.ts:1990](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1990)

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

Defined in: [src/core/complex.ts:2047](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2047)

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

Defined in: [src/core/complex.ts:1966](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1966)

Tests if this complex number is exactly zero.

#### Returns

`boolean`

True if both real and imag are exactly 0

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:1951](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1951)

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

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/complex.ts:778](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L778)

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

Defined in: [src/core/complex.ts:1287](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1287)

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

Defined in: [src/core/complex.ts:1271](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1271)

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

Defined in: [src/core/complex.ts:1259](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1259)

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

Defined in: [src/core/complex.ts:832](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L832)

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

Defined in: [src/core/complex.ts:1247](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1247)

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

Defined in: [src/core/complex.ts:1221](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1221)

Tests if a complex number is near zero within tolerance.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if both components are within epsilon of zero

#### Since

0.7.0

---

### isReal()

> `static` **isReal**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:1234](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1234)

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

Defined in: [src/core/complex.ts:813](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L813)

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

Defined in: [src/core/complex.ts:1207](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1207)

Tests if a complex number is exactly zero.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to test

#### Returns

`boolean`

True if both real and imaginary parts are exactly 0

#### Remarks

For tolerance-based comparison, use [isNearZero](../../auxiliary/scalar/functions/isNearZero.md).

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:796](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L796)

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

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per component.

#### Default Value

`EPSILON`

#### Since

0.7.0

## Computed

### argument()

> **argument**(): `number`

Defined in: [src/core/complex.ts:1404](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1404)

Returns the argument (phase angle) of this complex number.

#### Returns

`number`

Angle in radians

#### Since

0.7.0

---

### magnitude()

> **magnitude**(): `number`

Defined in: [src/core/complex.ts:1382](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1382)

Returns the magnitude of this complex number.

#### Returns

`number`

Magnitude

#### Since

0.7.0

---

### magnitudeSq()

> **magnitudeSq**(): `number`

Defined in: [src/core/complex.ts:1393](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1393)

Returns the squared magnitude of this complex number.

#### Returns

`number`

Squared magnitude

#### Since

0.7.0

---

### argument()

> `static` **argument**(`complex`): `number`

Defined in: [src/core/complex.ts:856](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L856)

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

Defined in: [src/core/complex.ts:844](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L844)

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

Defined in: [src/core/complex.ts:868](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L868)

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

### E

> `readonly` `static` **E**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:272](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L272)

Euler's number as a real complex (e + 0i).

#### Since

0.7.0

---

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/complex.ts:207](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L207)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### EPSILON_COMPLEX

> `readonly` `static` **EPSILON_COMPLEX**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:242](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L242)

Epsilon complex for tolerance comparison.

#### Since

0.7.0

---

### I

> `readonly` `static` **I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:221](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L221)

Imaginary unit (0 + 1i).

#### Since

0.7.0

---

### NEG_I

> `readonly` `static` **NEG_I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:228](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L228)

Negative imaginary unit (0 - 1i).

#### Since

0.7.0

---

### NEG_ONE

> `readonly` `static` **NEG_ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:235](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L235)

Negative real unit (-1 + 0i).

#### Since

0.7.0

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:214](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L214)

Real unit (1 + 0i).

#### Since

0.7.0

---

### PI

> `readonly` `static` **PI**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:265](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L265)

Pi as a real complex (π + 0i).

#### Since

0.7.0

---

### SQRT2

> `readonly` `static` **SQRT2**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:251](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L251)

Square root of 2 as a real complex (√2 + 0i).

#### Since

0.7.0

---

### SQRT2_INV

> `readonly` `static` **SQRT2_INV**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:258](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L258)

Inverse of square root of 2 as a real complex (1/√2 + 0i).

#### Since

0.7.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:200](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L200)

Zero complex (0 + 0i).

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/complex.ts:2441](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2441)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding real then imag

#### Example

```typescript
const [real, imag] = new Complex(3, 4);
```

#### Since

0.7.0

---

### clone()

> **clone**(): `Complex`

Defined in: [src/core/complex.ts:2425](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2425)

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

Defined in: [src/core/complex.ts:2335](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2335)

Writes to array or typed array.

#### Type Parameters

##### T

`T` _extends_ `ArrayLike`\<`number`\> & `object`

#### Parameters

##### out?

`T`

Optional destination array. If not provided, returns a new tuple

##### offset?

`number` = `0`

Write offset.

#### Returns

\[`number`, `number`\] \| `T`

The output array, or a new tuple if no output was provided

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

Defined in: [src/core/complex.ts:2380](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2380)

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

Defined in: [src/core/complex.ts:2361](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2361)

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

### toPolar()

> **toPolar**(): `object`

Defined in: [src/core/complex.ts:1914](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1914)

Converts this complex number to polar coordinates.

#### Returns

`object`

Object with magnitude and angle

##### angle

> **angle**: `number`

##### magnitude

> **magnitude**: `number`

#### Since

0.9.0

---

### toRotationMatrix2()

> **toRotationMatrix2**(`out?`): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/complex.ts:2286](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2286)

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

Defined in: [src/core/complex.ts:2404](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2404)

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

---

### toVector2()

> **toVector2**(`out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:2311](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2311)

Converts the complex number to a Vector2 (real → x, imag → y).

#### Parameters

##### out?

[`Vector2`](Vector2.md)

Optional output vector

#### Returns

[`Vector2`](Vector2.md)

Vector2 with x = real, y = imag

#### Example

```typescript
const c = new Complex(3, 4);
const v = c.toVector2();
// v.x === 3, v.y === 4
```

#### Since

0.8.0

---

### toPolar()

> `static` **toPolar**(`z`): `object`

Defined in: [src/core/complex.ts:1191](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1191)

Converts a complex number to polar coordinates.

#### Parameters

##### z

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`object`

Object with magnitude and angle

##### angle

> **angle**: `number`

##### magnitude

> **magnitude**: `number`

#### Since

0.9.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Complex`

Defined in: [src/core/complex.ts:445](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L445)

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

#### Example

```typescript
const z = Complex.fromValues(3, 4);
const z2 = Complex.clone(z); // → (3, 4), independent copy

// Reuse an existing instance to avoid allocation
const out = new Complex();
Complex.clone(z, out); // → (3, 4)
```

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Complex`

Defined in: [src/core/complex.ts:465](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L465)

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

#### Example

```typescript
const src = Complex.fromValues(3, 4);
const dst = new Complex();
Complex.copy(src, dst); // dst → (3, 4)
```

#### Since

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Complex`

Defined in: [src/core/complex.ts:374](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L374)

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

#### Example

```typescript
const z = Complex.fromArray([3, 4]); // → (3, 4)

// With offset into a larger array
const buf = [0, 0, 5, 6];
const z2 = Complex.fromArray(buf, 2); // → (5, 6)

// Reuse an existing instance to avoid allocation
const out = new Complex();
Complex.fromArray([1, 2], 0, out); // → (1, 2)
```

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Complex`

Defined in: [src/core/complex.ts:401](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L401)

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

#### Example

```typescript
const z = Complex.fromObject({ real: 3, imag: 4 }); // → (3, 4)

// Reuse an existing instance to avoid allocation
const out = new Complex();
Complex.fromObject({ real: 1, imag: -1 }, out); // → (1, -1)
```

#### Since

0.7.0

---

### fromPolar()

> `static` **fromPolar**(`magnitude`, `angle`, `out?`): `Complex`

Defined in: [src/core/complex.ts:313](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L313)

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

#### Example

```typescript
const z = Complex.fromPolar(1, Math.PI / 2); // → (0, 1)

// Reuse an existing instance to avoid allocation
const out = new Complex();
Complex.fromPolar(2, Math.PI, out); // → (-2, 0)
```

#### Since

0.7.0

---

### fromPolarCS()

> `static` **fromPolarCS**(`magnitude`, `cos`, `sin`, `out?`): `Complex`

Defined in: [src/core/complex.ts:346](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L346)

Creates a complex number from polar form using pre-computed cos/sin.

#### Parameters

##### magnitude

`number`

Distance from origin

##### cos

`number`

Pre-computed cosine of the angle

##### sin

`number`

Pre-computed sine of the angle

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex number `(magnitude * cos, magnitude * sin)`

#### Remarks

Trusts caller-provided cos/sin without normalization or validation,
consistent with all \*CS methods in the library. Use when trig has
been pre-computed (e.g., via [sinCos](../../auxiliary/angle/functions/sinCos.md)) to avoid redundant computation.

#### Example

```typescript
const { cos, sin } = sinCos(Math.PI / 4);
const z = Complex.fromPolarCS(2, cos, sin); // → (√2, √2)

// Reuse an existing instance to avoid allocation
const out = new Complex();
Complex.fromPolarCS(1, cos, sin, out); // → (√2/2, √2/2)
```

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`real`, `imag`, `out?`): `Complex`

Defined in: [src/core/complex.ts:422](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L422)

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

Defined in: [src/core/complex.ts:2182](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2182)

Linear interpolation towards another complex number in place.

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

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/complex.ts:2197](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2197)

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

Defined in: [src/core/complex.ts:2210](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2210)

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

Defined in: [src/core/complex.ts:2236](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2236)

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

Defined in: [src/core/complex.ts:2253](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2253)

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

Defined in: [src/core/complex.ts:658](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L658)

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

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Complex`

Defined in: [src/core/complex.ts:673](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L673)

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

Defined in: [src/core/complex.ts:694](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L694)

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

Defined in: [src/core/complex.ts:720](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L720)

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

Defined in: [src/core/complex.ts:752](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L752)

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

Defined in: [src/core/complex.ts:1321](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1321)

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

Defined in: [src/core/complex.ts:1307](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1307)

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

Defined in: [src/core/complex.ts:1350](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1350)

Sets from array values.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array [real, imag]

##### offset

`number` = `0`

Starting index (default 0)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setFromPolar()

> **setFromPolar**(`magnitude`, `angle`): `this`

Defined in: [src/core/complex.ts:1336](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1336)

Sets from polar coordinates.

#### Parameters

##### magnitude

`number`

Distance from origin

##### angle

`number`

Angle in radians

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### setFromVector2()

> **setFromVector2**(`v`): `this`

Defined in: [src/core/complex.ts:1367](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1367)

Sets from a Vector2 (x→real, y→imag).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/complex.ts:2087](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L2087)

Resets this complex number to zero.

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### imag

> **imag**: `number`

Defined in: [src/core/complex.ts:181](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L181)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`imag`](../../types/interfaces/ComplexLike.md#imag)

---

### real

> **real**: `number`

Defined in: [src/core/complex.ts:180](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L180)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`real`](../../types/interfaces/ComplexLike.md#real)

## Transform

### apply()

> **apply**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:1740](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1740)

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

Defined in: [src/core/complex.ts:1768](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1768)

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

### exp()

> **exp**(): `this`

Defined in: [src/core/complex.ts:1890](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1890)

Computes the complex exponential e^z in place using Euler's formula.

#### Returns

`this`

This for chaining

#### Since

0.9.0

---

### log()

> **log**(): `this`

Defined in: [src/core/complex.ts:1902](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1902)

Computes the principal complex logarithm in place.

#### Returns

`this`

This for chaining

#### Since

0.9.0

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/complex.ts:1656](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1656)

Normalizes this complex number to unit length in place.

#### Returns

`this`

This for chaining

#### Throws

If magnitude is near zero

#### Example

```typescript
new Complex(3, 4).normalize(); // (0.6, 0.8)
Complex.ZERO.normalize(); // throws RangeError
```

#### See

- [normalizeSafe](#normalizesafe-2) - Returns fallback on zero magnitude
- [normalizeUnchecked](#normalizeunchecked-2) - No validation

#### Since

0.7.0

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/complex.ts:1682](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1682)

Safe normalization. Sets to (1, 0) if magnitude is near zero.

#### Returns

`this`

This for chaining

#### Example

```typescript
new Complex(3, 4).normalizeSafe(); // (0.6, 0.8)
new Complex(0, 0).normalizeSafe(); // (1, 0)
```

#### See

[normalize](#normalize-2) - Throws for zero magnitude

#### Since

0.7.0

---

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/complex.ts:1711](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1711)

Normalizes this complex number without validation (for hot paths).

#### Returns

`this`

This for chaining

#### Remarks

**WARNING:** This method performs no validation.

- If magnitude is zero, this will become (NaN, NaN).
- Use only when you can guarantee non-zero magnitude.

#### See

- [normalize](#normalize-2) - Throws on zero magnitude
- [normalizeSafe](#normalizesafe-2) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### pow()

> **pow**(`exponent`): `this`

Defined in: [src/core/complex.ts:1858](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1858)

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

Defined in: [src/core/complex.ts:1789](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1789)

Computes the reciprocal of this complex number in place.

#### Returns

`this`

This for chaining

#### Throws

If magnitude is near zero

#### Example

```typescript
new Complex(0, 2).reciprocal(); // (0, -0.5)
new Complex(0, 0).reciprocal(); // throws RangeError
```

#### See

- [reciprocalSafe](#reciprocalsafe-2) - Returns fallback on zero magnitude
- [reciprocalUnchecked](#reciprocalunchecked-2) - No validation

#### Since

0.7.0

---

### reciprocalSafe()

> **reciprocalSafe**(): `this`

Defined in: [src/core/complex.ts:1815](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1815)

Computes the reciprocal of this complex number in place (safe).

#### Returns

`this`

This for chaining (sets to (0,0) if magnitude near zero)

#### Example

```typescript
new Complex(0, 2).reciprocalSafe(); // (0, -0.5)
new Complex(0, 0).reciprocalSafe(); // (0, 0)
```

#### See

[reciprocal](#reciprocal-2) - Throws for zero magnitude

#### Since

0.7.0

---

### reciprocalUnchecked()

> **reciprocalUnchecked**(): `this`

Defined in: [src/core/complex.ts:1842](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1842)

Computes the reciprocal of this complex number in place (unchecked).

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Magnitude must be non-zero.

#### See

- [reciprocal](#reciprocal-2) - Throws on zero magnitude
- [reciprocalSafe](#reciprocalsafe-2) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/complex.ts:1879](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1879)

Computes the square root of this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### apply()

> `static` **apply**(`complex`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:983](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L983)

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
- If the complex number has near-zero magnitude, the original vector is returned
  unchanged (no rotation applied) rather than throwing.

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

Defined in: [src/core/complex.ts:1024](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1024)

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

### exp()

> `static` **exp**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1162](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1162)

Computes the complex exponential e^z using Euler's formula.

#### Parameters

##### z

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex exponent

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

e^z = e^re \* (cos(im) + i·sin(im))

#### Since

0.9.0

---

### log()

> `static` **log**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1177](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1177)

Computes the principal complex logarithm.

#### Parameters

##### z

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

log(z) = (ln|z|, arg(z))

#### Since

0.9.0

---

### normalize()

> `static` **normalize**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:891](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L891)

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

#### Example

```typescript
Complex.normalize(new Complex(3, 4)); // (0.6, 0.8)
Complex.normalize(Complex.ZERO); // throws RangeError
```

#### See

- [normalizeSafe](#normalizesafe-2) - Returns fallback on zero magnitude
- [normalizeUnchecked](#normalizeunchecked-2) - No validation

#### Since

0.7.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:925](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L925)

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
instead of throwing when the input has zero magnitude. The fallback
`(1, 0)` is the multiplicative identity for complex numbers, ensuring
that downstream multiplication operations remain neutral rather than
zeroing out results.

#### Example

```typescript
const zero = Complex.ZERO;
const safe = Complex.normalizeSafe(zero); // Returns (1, 0)
```

#### See

[normalize](#normalize-2) - Throws for zero magnitude

#### Since

0.7.0

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:952](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L952)

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

- [normalize](#normalize-2) - Throws on zero magnitude
- [normalizeSafe](#normalizesafe-2) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### pow()

> `static` **pow**(`complex`, `exponent`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1129](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1129)

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

#### Throws

If magnitude is zero and exponent is negative

#### Since

0.7.0

---

### reciprocal()

> `static` **reciprocal**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1059](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1059)

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

If magnitude is near zero

#### Example

```typescript
Complex.reciprocal(new Complex(0, 2)); // (0, -0.5)
Complex.reciprocal(Complex.ZERO); // throws RangeError
```

#### See

- [reciprocalSafe](#reciprocalsafe-2) - Returns fallback on zero magnitude
- [reciprocalUnchecked](#reciprocalunchecked-2) - No validation

#### Since

0.7.0

---

### reciprocalSafe()

> `static` **reciprocalSafe**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1086](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1086)

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

Reciprocal, or (0,0) if input has zero magnitude

#### Example

```typescript
Complex.reciprocalSafe(new Complex(0, 2)); // (0, -0.5)
Complex.reciprocalSafe(Complex.ZERO); // (0, 0)
```

#### See

[reciprocal](#reciprocal-2) - Throws for zero magnitude

#### Since

0.7.0

---

### reciprocalUnchecked()

> `static` **reciprocalUnchecked**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1112](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1112)

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

**Precondition:** `|complex| ≠ 0`. Calling with zero produces Infinity/NaN.

#### See

- [reciprocal](#reciprocal-2) - Throws on zero magnitude
- [reciprocalSafe](#reciprocalsafe-2) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### sqrt()

> `static` **sqrt**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1149](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/complex.ts#L1149)

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
