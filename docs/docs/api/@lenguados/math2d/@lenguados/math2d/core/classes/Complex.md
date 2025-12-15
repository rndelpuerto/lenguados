# Class: Complex

Defined in: [src/core/complex.ts:93](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L93)

Mutable interface for complex numbers.

## Implements

- [`ComplexLike`](../../types/interfaces/ComplexLike.md)

## Constructors

### Constructor

> **new Complex**(`real`, `imag`): `Complex`

Defined in: [src/core/complex.ts:184](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L184)

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

Defined in: [src/core/complex.ts:690](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L690)

Adds another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to add

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### conjugate()

> **conjugate**(): `this`

Defined in: [src/core/complex.ts:772](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L772)

Conjugates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### divide()

> **divide**(`other`): `this`

Defined in: [src/core/complex.ts:739](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L739)

Divides by another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to divide by

#### Returns

`this`

This for chaining

#### Remarks

Uses safe division internally. Dividing by zero returns (0, 0).

#### Since

0.1.0

***

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/complex.ts:718](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L718)

Multiplies with another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to multiply by

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### negate()

> **negate**(): `this`

Defined in: [src/core/complex.ts:969](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L969)

Negates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/complex.ts:759](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L759)

Scales this complex number by a scalar in place.

#### Parameters

##### scalar

`number`

Scale factor

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/complex.ts:704](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L704)

Subtracts another complex number in place.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number to subtract

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### add()

> `static` **add**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:286](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L286)

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

0.1.0

***

### conjugate()

> `static` **conjugate**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:366](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L366)

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

0.1.0

***

### divide()

> `static` **divide**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:334](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L334)

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

#### Remarks

Uses safe division internally. Dividing by zero returns (0, 0).

#### Since

0.1.0

***

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:314](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L314)

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

#### Since

0.1.0

***

### negate()

> `static` **negate**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:379](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L379)

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

0.1.0

***

### scale()

> `static` **scale**(`complex`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:353](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L353)

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

0.1.0

***

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:300](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L300)

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

0.1.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/complex.ts:880](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L880)

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

0.1.0

***

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:896](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L896)

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

0.9.0

***

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/complex.ts:419](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L419)

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

0.1.0

***

### hasNaN()

> `static` **hasNaN**(`complex`): `boolean`

Defined in: [src/core/complex.ts:604](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L604)

Tests if any component is NaN.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to test

#### Returns

`boolean`

True if any component is NaN

#### Since

0.9.0

***

### isFinite()

> `static` **isFinite**(`complex`): `boolean`

Defined in: [src/core/complex.ts:592](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L592)

Tests if both components are finite numbers.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex to test

#### Returns

`boolean`

True if both components are finite

#### Since

0.9.0

***

### isImaginary()

> `static` **isImaginary**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:580](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L580)

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

0.1.0

***

### isReal()

> `static` **isReal**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:567](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L567)

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

0.1.0

***

### isZero()

> `static` **isZero**(`complex`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:554](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L554)

Tests if a complex number is near zero.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if near zero

#### Since

0.1.0

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/complex.ts:436](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L436)

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

0.9.0

## Computed

### conjugated

#### Get Signature

> **get** **conjugated**(): `Complex`

Defined in: [src/core/complex.ts:999](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L999)

Returns the conjugate without modifying this number.

##### Since

0.1.0

##### Returns

`Complex`

New conjugate complex

***

### negated

#### Get Signature

> **get** **negated**(): `Complex`

Defined in: [src/core/complex.ts:1026](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1026)

Returns the negated complex without modifying this number.

##### Since

0.1.0

##### Returns

`Complex`

New negated complex

***

### normalized

#### Get Signature

> **get** **normalized**(): `Complex`

Defined in: [src/core/complex.ts:1010](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1010)

Returns the normalized (unit) complex without modifying this number.

##### Since

0.1.0

##### Returns

`Complex`

New unit complex

***

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Complex`

Defined in: [src/core/complex.ts:1037](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1037)

Returns the reciprocal without modifying this number.

##### Since

0.1.0

##### Returns

`Complex`

New reciprocal complex

***

### argument()

> **argument**(): `number`

Defined in: [src/core/complex.ts:674](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L674)

Returns the argument (phase angle) of this complex number.

#### Returns

`number`

Angle in radians

#### Since

0.1.0

***

### magnitude()

> **magnitude**(): `number`

Defined in: [src/core/complex.ts:652](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L652)

Returns the magnitude of this complex number.

#### Returns

`number`

Magnitude

#### Since

0.1.0

***

### magnitudeSq()

> **magnitudeSq**(): `number`

Defined in: [src/core/complex.ts:663](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L663)

Returns the squared magnitude of this complex number.

#### Returns

`number`

Squared magnitude

#### Since

0.1.0

***

### argument()

> `static` **argument**(`complex`): `number`

Defined in: [src/core/complex.ts:464](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L464)

Returns the argument (phase angle) of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Angle in radians

#### Since

0.1.0

***

### magnitude()

> `static` **magnitude**(`complex`): `number`

Defined in: [src/core/complex.ts:452](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L452)

Returns the magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Magnitude

#### Since

0.1.0

***

### magnitudeSq()

> `static` **magnitudeSq**(`complex`): `number`

Defined in: [src/core/complex.ts:476](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L476)

Returns the squared magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Squared magnitude

#### Since

0.1.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/complex.ts:1235](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1235)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding real then imag.

#### Example

```typescript
const [real, imag] = new Complex(3, 4);
```

#### Since

0.9.0

## Core

### E

> `readonly` `static` **E**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:178](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L178)

Euler's number as a real complex (e + 0i).

***

### EPSILON\_COMPLEX

> `readonly` `static` **EPSILON\_COMPLEX**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:152](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L152)

Epsilon complex for tolerance comparison.

***

### I

> `readonly` `static` **I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:134](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L134)

Imaginary unit (0 + 1i).

***

### NEG\_I

> `readonly` `static` **NEG\_I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:140](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L140)

Negative imaginary unit (0 - 1i).

***

### NEG\_ONE

> `readonly` `static` **NEG\_ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:146](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L146)

Negative real unit (-1 + 0i).

***

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:128](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L128)

Real unit (1 + 0i).

***

### PI

> `readonly` `static` **PI**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:172](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L172)

Pi as a real complex (π + 0i).

***

### SQRT2

> `readonly` `static` **SQRT2**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:160](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L160)

Square root of 2 as a real complex (√2 + 0i).

***

### SQRT2\_INV

> `readonly` `static` **SQRT2\_INV**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:166](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L166)

Inverse of square root of 2 as a real complex (1/√2 + 0i).

***

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:122](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L122)

Zero complex (0 + 0i).

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Complex`

Defined in: [src/core/complex.ts:255](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L255)

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

0.9.0

***

### copy()

> `static` **copy**(`source`, `destination`): `Complex`

Defined in: [src/core/complex.ts:268](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L268)

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

0.9.0

***

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Complex`

Defined in: [src/core/complex.ts:220](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L220)

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

#### Since

0.1.0

***

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Complex`

Defined in: [src/core/complex.ts:240](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L240)

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

0.1.0

***

### fromPolar()

> `static` **fromPolar**(`magnitude`, `angle`, `out?`): `Complex`

Defined in: [src/core/complex.ts:203](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L203)

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

0.1.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/complex.ts:1056](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1056)

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

0.1.0

***

### slerp()

> **slerp**(`other`, `t`): `this`

Defined in: [src/core/complex.ts:1072](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1072)

Spherical linear interpolation towards another complex number in place.

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

0.1.0

***

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Complex`

Defined in: [src/core/complex.ts:398](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L398)

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

0.1.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/complex.ts:635](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L635)

Copies values from another complex number.

#### Parameters

##### other

[`ReadonlyComplex`](../type-aliases/ReadonlyComplex.md)

Source complex

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### set()

> **set**(`real`, `imag`): `this`

Defined in: [src/core/complex.ts:621](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L621)

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

0.1.0

***

### zero()

> **zero**(): `this`

Defined in: [src/core/complex.ts:982](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L982)

Resets this complex number to zero.

#### Returns

`this`

This for chaining

#### Since

0.9.0

## Other

### imag

> **imag**: `number`

Defined in: [src/core/complex.ts:99](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L99)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`imag`](../../types/interfaces/ComplexLike.md#imag)

***

### real

> **real**: `number`

Defined in: [src/core/complex.ts:98](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L98)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`real`](../../types/interfaces/ComplexLike.md#real)

## Predicate

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/complex.ts:958](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L958)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

#### Since

0.9.0

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/complex.ts:947](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L947)

Tests if both components are finite numbers.

#### Returns

`boolean`

True if both components are finite

#### Since

0.9.0

***

### isImaginary()

> **isImaginary**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:936](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L936)

Tests if this complex number is purely imaginary.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if real part is near zero

#### Since

0.1.0

***

### isReal()

> **isReal**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:924](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L924)

Tests if this complex number is purely real.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if imaginary part is near zero

#### Since

0.1.0

***

### isZero()

> **isZero**(`epsilon`): `boolean`

Defined in: [src/core/complex.ts:912](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L912)

Tests if this complex number is near zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if near zero

#### Since

0.1.0

## Serialization

### clone()

> **clone**(): `Complex`

Defined in: [src/core/complex.ts:1219](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1219)

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

0.1.0

***

### toArray()

> **toArray**(): \[`number`, `number`\]

Defined in: [src/core/complex.ts:1137](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1137)

Converts the complex number to a tuple [real, imag].

#### Returns

\[`number`, `number`\]

Tuple with real and imaginary parts

#### Example

```typescript
const c = new Complex(3, 4);
const [real, imag] = c.toArray();
// real = 3, imag = 4
```

#### Since

0.1.0

***

### toJSON()

> **toJSON**(): [`ComplexLike`](../../types/interfaces/ComplexLike.md)

Defined in: [src/core/complex.ts:1174](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1174)

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

0.1.0

***

### toObject()

> **toObject**(): [`ComplexLike`](../../types/interfaces/ComplexLike.md)

Defined in: [src/core/complex.ts:1155](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1155)

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

0.1.0

***

### toRotationMatrix()

> **toRotationMatrix**(`out?`): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/complex.ts:1113](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1113)

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
const mat = Matrix2.fromObject(complex.toRotationMatrix());
```

#### Example

```typescript
const c = Complex.fromPolar(1, Math.PI / 4);
const m = c.toRotationMatrix();
// m represents a 45° rotation: { m00: cos, m01: sin, m10: -sin, m11: cos }
```

#### Since

0.1.0

***

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/complex.ts:1198](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L1198)

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

0.1.0

## Transform

### normalize()

> **normalize**(): `this`

Defined in: [src/core/complex.ts:789](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L789)

Normalizes this complex number to unit length in place.

#### Returns

`this`

This for chaining

#### Throws

If magnitude is near zero

#### Since

0.1.0

***

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/complex.ts:807](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L807)

Safe normalization. Sets to (1, 0) if magnitude is near zero.

#### Returns

`this`

This for chaining

#### Since

0.9.0

***

### pow()

> **pow**(`exponent`): `this`

Defined in: [src/core/complex.ts:843](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L843)

Raises this complex number to a power in place.

#### Parameters

##### exponent

`number`

Exponent

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### reciprocal()

> **reciprocal**(): `this`

Defined in: [src/core/complex.ts:827](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L827)

Computes the reciprocal of this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/complex.ts:861](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L861)

Computes the square root of this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### normalize()

> `static` **normalize**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:490](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L490)

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

0.1.0

***

### pow()

> `static` **pow**(`complex`, `exponent`, `out?`): `Complex`

Defined in: [src/core/complex.ts:524](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L524)

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

0.1.0

***

### reciprocal()

> `static` **reciprocal**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:508](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L508)

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

#### Since

0.1.0

***

### sqrt()

> `static` **sqrt**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:541](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/complex.ts#L541)

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

0.1.0
