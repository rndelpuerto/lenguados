# Class: Complex

Mutable interface for complex numbers.

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Implements

- [`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md)

## Constructors

### Constructor

> **new Complex**(`real`, `imag`): `Complex`

#### Parameters

##### real

`number` = `0`

##### imag

`number` = `0`

#### Returns

`Complex`

## Properties

### imag

> **imag**: `number`

#### Implementation of

[`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md).[`imag`](../../@lenguados/math2d/types/interfaces/ComplexLike.md#imag)

---

### real

> **real**: `number`

#### Implementation of

[`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md).[`real`](../../@lenguados/math2d/types/interfaces/ComplexLike.md#real)

---

### E

> `readonly` `static` **E**: `Readonly`\<`Complex`\>

Euler's number as a real complex (e + 0i).

---

### EPSILON

> `readonly` `static` **EPSILON**: `Readonly`\<`Complex`\>

Epsilon complex for tolerance comparison.

---

### I

> `readonly` `static` **I**: `Readonly`\<`Complex`\>

Imaginary unit (0 + 1i).

---

### NEG_I

> `readonly` `static` **NEG_I**: `Readonly`\<`Complex`\>

Negative imaginary unit (0 - 1i).

---

### NEG_ONE

> `readonly` `static` **NEG_ONE**: `Readonly`\<`Complex`\>

Negative real unit (-1 + 0i).

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Complex`\>

Real unit (1 + 0i).

---

### PI

> `readonly` `static` **PI**: `Readonly`\<`Complex`\>

Pi as a real complex (π + 0i).

---

### SQRT2

> `readonly` `static` **SQRT2**: `Readonly`\<`Complex`\>

Square root of 2 as a real complex (√2 + 0i).

---

### SQRT2_INV

> `readonly` `static` **SQRT2_INV**: `Readonly`\<`Complex`\>

Inverse of square root of 2 as a real complex (1/√2 + 0i).

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Complex`\>

Zero complex (0 + 0i).

## Accessors

### conjugated

#### Get Signature

> **get** **conjugated**(): `Complex`

Returns the conjugate without modifying this number.

##### Returns

`Complex`

New conjugate complex

---

### negated

#### Get Signature

> **get** **negated**(): `Complex`

Returns the negated complex without modifying this number.

##### Returns

`Complex`

New negated complex

---

### normalized

#### Get Signature

> **get** **normalized**(): `Complex`

Returns the normalized (unit) complex without modifying this number.

##### Returns

`Complex`

New unit complex

---

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Complex`

Returns the reciprocal without modifying this number.

##### Returns

`Complex`

New reciprocal complex

## Methods

### add()

> **add**(`other`, `out?`): `Complex`

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

##### out?

`Complex`

#### Returns

`Complex`

---

### argument()

> **argument**(): `number`

#### Returns

`number`

---

### clone()

> **clone**(): `Complex`

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

---

### conjugate()

> **conjugate**(`out?`): `Complex`

#### Parameters

##### out?

`Complex`

#### Returns

`Complex`

---

### copy()

> **copy**(`other`): `this`

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

#### Returns

`this`

---

### divide()

> **divide**(`other`, `out?`): `Complex`

Divides by another complex number.

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number to divide by

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Quotient

---

### equals()

> **equals**(`other`, `epsilon`): `boolean`

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### isImaginary()

> **isImaginary**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### isReal()

> **isReal**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### isZero()

> **isZero**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### lerp()

> **lerp**(`other`, `t`, `out?`): `Complex`

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

##### t

`number`

##### out?

`Complex`

#### Returns

`Complex`

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

> **multiply**(`other`, `out?`): `Complex`

Multiplies with another complex number.

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number to multiply by

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Product

---

### negate()

> **negate**(`out?`): `Complex`

Negates this complex number.

#### Parameters

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Negated complex

---

### normalize()

> **normalize**(`out?`): `Complex`

#### Parameters

##### out?

`Complex`

#### Returns

`Complex`

---

### pow()

> **pow**(`exponent`, `out?`): `Complex`

#### Parameters

##### exponent

`number`

##### out?

`Complex`

#### Returns

`Complex`

---

### reciprocal()

> **reciprocal**(`out?`): `Complex`

#### Parameters

##### out?

`Complex`

#### Returns

`Complex`

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

### scale()

> **scale**(`scalar`, `out?`): `Complex`

#### Parameters

##### scalar

`number`

##### out?

`Complex`

#### Returns

`Complex`

---

### set()

> **set**(`real`, `imag`): `this`

#### Parameters

##### real

`number`

##### imag

`number`

#### Returns

`this`

---

### slerp()

> **slerp**(`other`, `t`, `out?`): `Complex`

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

##### t

`number`

##### out?

`Complex`

#### Returns

`Complex`

---

### sqrt()

> **sqrt**(`out?`): `Complex`

#### Parameters

##### out?

`Complex`

#### Returns

`Complex`

---

### subtract()

> **subtract**(`other`, `out?`): `Complex`

Subtracts another complex number.

#### Parameters

##### other

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number to subtract

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Difference

---

### toArray()

> **toArray**(): \[`number`, `number`\]

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

---

### toJSON()

> **toJSON**(): [`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md)

Converts the complex number to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md)

Object suitable for JSON serialization

#### Example

```typescript
const c = new Complex(3, 4);
const json = JSON.stringify(c);
// '{"real":3,"imag":4}'
```

---

### toObject()

> **toObject**(): [`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md)

Converts the complex number to a plain object.

#### Returns

[`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md)

Object with real and imag properties

#### Example

```typescript
const c = new Complex(3, 4);
const obj = c.toObject();
// { real: 3, imag: 4 }
```

---

### toRotationMatrix()

> **toRotationMatrix**(`out?`): [`Matrix2`](Matrix2.md)

Converts the complex number to a 2D rotation matrix.
The complex number is normalized before conversion.

#### Parameters

##### out?

[`Matrix2`](Matrix2.md)

Optional output matrix

#### Returns

[`Matrix2`](Matrix2.md)

Rotation matrix

#### Example

```typescript
const c = Complex.fromPolar(1, Math.PI / 4);
const m = c.toRotationMatrix();
// m represents a 45° rotation
```

---

### toString()

> **toString**(`precision`): `string`

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

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Complex`

Adds two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

First complex number

##### b

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Second complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Sum

---

### argument()

> `static` **argument**(`complex`): `number`

Returns the argument (phase angle) of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Angle in radians

---

### conjugate()

> `static` **conjugate**(`complex`, `out?`): `Complex`

Returns the conjugate of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Conjugate

---

### divide()

> `static` **divide**(`a`, `b`, `out?`): `Complex`

Divides two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Numerator

##### b

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Denominator

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Quotient

---

### equals()

> `static` **equals**(`a`, `b`, `epsilon`): `boolean`

Tests if two complex numbers are approximately equal.

#### Parameters

##### a

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

First complex

##### b

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Second complex

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if equal within tolerance

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Complex`

#### Parameters

##### array

`ArrayLike`\<`number`\>

##### offset

`number` = `0`

##### out?

`Complex`

#### Returns

`Complex`

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Complex`

#### Parameters

##### object

[`ComplexLike`](../../@lenguados/math2d/types/interfaces/ComplexLike.md)

##### out?

`Complex`

#### Returns

`Complex`

---

### fromPolar()

> `static` **fromPolar**(`magnitude`, `angle`, `out?`): `Complex`

#### Parameters

##### magnitude

`number`

##### angle

`number`

##### out?

`Complex`

#### Returns

`Complex`

---

### isImaginary()

> `static` **isImaginary**(`complex`, `epsilon`): `boolean`

Tests if a complex number is purely imaginary.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if real part is near zero

---

### isReal()

> `static` **isReal**(`complex`, `epsilon`): `boolean`

Tests if a complex number is purely real.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if imaginary part is near zero

---

### isZero()

> `static` **isZero**(`complex`, `epsilon`): `boolean`

Tests if a complex number is near zero.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if near zero

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Complex`

Linear interpolation between two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Start complex

##### b

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

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

---

### magnitude()

> `static` **magnitude**(`complex`): `number`

Returns the magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Magnitude

---

### magnitudeSq()

> `static` **magnitudeSq**(`complex`): `number`

Returns the squared magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

#### Returns

`number`

Squared magnitude

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Complex`

Multiplies two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

First complex number

##### b

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Second complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Product

---

### negate()

> `static` **negate**(`complex`, `out?`): `Complex`

Negates a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Negated complex

---

### normalize()

> `static` **normalize**(`complex`, `out?`): `Complex`

Normalizes a complex number to unit length.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Normalized complex (or zero if magnitude is near zero)

---

### pow()

> `static` **pow**(`complex`, `exponent`, `out?`): `Complex`

Raises a complex number to a power.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

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

---

### reciprocal()

> `static` **reciprocal**(`complex`, `out?`): `Complex`

Returns the reciprocal of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Reciprocal

---

### scale()

> `static` **scale**(`complex`, `scalar`, `out?`): `Complex`

Scales a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

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

---

### sqrt()

> `static` **sqrt**(`complex`, `out?`): `Complex`

Returns the square root of a complex number.

#### Parameters

##### complex

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Square root

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Complex`

Subtracts two complex numbers.

#### Parameters

##### a

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

First complex number

##### b

[`ReadonlyComplex`](../../@lenguados/math2d/core/type-aliases/ReadonlyComplex.md)

Second complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Difference
