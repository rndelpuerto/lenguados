# Class: Complex

Defined in: [src/core/complex.ts:195](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L195)

Mutable interface for complex numbers.

## Since

0.7.0

## Implements

- [`ComplexLike`](../../types/interfaces/ComplexLike.md)

## Constructors

### Constructor

> **new Complex**(`real?`, `imag?`): `Complex`

Defined in: [src/core/complex.ts:267](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L267)

Creates a new Complex number from real and imaginary parts.

#### Parameters

##### real?

`number` = `0`

Real component.

##### imag?

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

Defined in: [src/core/complex.ts:1753](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1753)

Gets the phase angle in radians.
Computed as atan2(imag, real), consistent with Vector2.angle and Rotation2.angle.

##### Since

0.7.0

##### Returns

`number`

Angle in radians

#### Set Signature

> **set** **angle**(`value`): `void`

Defined in: [src/core/complex.ts:1777](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1777)

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

Defined in: [src/core/complex.ts:1792](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1792)

Gets the phase angle in degrees.
Symmetric with Rotation2.angleDegrees getter.

##### Since

0.7.0

##### Returns

`number`

Angle in degrees

#### Set Signature

> **set** **angleDegrees**(`value`): `void`

Defined in: [src/core/complex.ts:1804](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1804)

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

Defined in: [src/core/complex.ts:1816](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1816)

Gets the phase angle in turns (0-1 = one full rotation).
Symmetric with Rotation2.angleTurns getter.

##### Since

0.7.0

##### Returns

`number`

Angle in turns (0-1 range)

#### Set Signature

> **set** **angleTurns**(`value`): `void`

Defined in: [src/core/complex.ts:1828](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1828)

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

Defined in: [src/core/complex.ts:2675](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2675)

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

Defined in: [src/core/complex.ts:2714](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2714)

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

Defined in: [src/core/complex.ts:2698](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2698)

Returns the normalized (unit) complex without modifying this number.

##### Remarks

Returns `(1, 0)` (multiplicative identity) for zero-magnitude input,
consistent with [normalizeSafe](#normalizesafe-1). A zero-magnitude complex number
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

Defined in: [src/core/complex.ts:2731](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2731)

Returns the reciprocal without modifying this number.
Uses safe behavior: returns (0,0) for zero-magnitude input.

##### Remarks

Delegates to [Complex.reciprocalSafe](#reciprocalsafe-1). Cleans up negative zero
on the imaginary component when the input is purely real.

##### Since

0.7.0

##### Returns

`Complex`

New reciprocal complex

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/complex.ts:1844](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1844)

Adds another complex number in place.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### addScalar()

> **addScalar**(`scalar`): `this`

Defined in: [src/core/complex.ts:2044](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2044)

Adds a real scalar to this complex number in place.
Only the real component is affected: `(a+bi) + s = (a+s) + bi`.

#### Parameters

##### scalar

`number`

Real scalar addend

#### Returns

`this`

This for chaining

#### Remarks

Unlike [Vector2.addScalar](Vector2.md#addscalar-1) which adds the scalar to both components,
this follows complex arithmetic convention where adding a real scalar
affects only the real part.

#### Example

```typescript
new Complex(3, 4).addScalar(2); // (5, 4)
```

#### Since

0.7.0

---

### conjugate()

> **conjugate**(): `this`

Defined in: [src/core/complex.ts:2075](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2075)

Conjugates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### divide()

> **divide**(`other`): `this`

Defined in: [src/core/complex.ts:1900](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1900)

Divides by another complex number in place.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

- [divideSafe](#dividesafe-1) - Returns fallback on zero denominator
- [divideUnchecked](#divideunchecked-1) - No validation

#### Since

0.7.0

---

### divideSafe()

> **divideSafe**(`other`): `this`

Defined in: [src/core/complex.ts:1921](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1921)

Divides by another complex number in place (safe).

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

[divide](#divide-1) - Throws for zero denominator

#### Since

0.7.0

---

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/complex.ts:1958](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1958)

Divides this complex number by a real scalar in place.

#### Parameters

##### scalar

`number`

Real denominator

#### Returns

`this`

This for chaining

#### Throws

If scalar is near zero

#### See

- [divideScalarSafe](#dividescalarsafe-1) - Returns zero for near-zero scalar
- [divideScalarUnchecked](#dividescalarunchecked-1) - No validation

#### Since

0.7.0

---

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/complex.ts:1978](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1978)

Divides this complex number by a real scalar in place (safe).

#### Parameters

##### scalar

`number`

Real denominator

#### Returns

`this`

This for chaining (sets to (0,0) if scalar near zero)

#### See

- [divideScalar](#dividescalar-1) - Throws for near-zero scalar
- [divideScalarUnchecked](#dividescalarunchecked-1) - No validation

#### Since

0.7.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`scalar`): `this`

Defined in: [src/core/complex.ts:2004](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2004)

Divides this complex number by a real scalar in place (unchecked).

#### Parameters

##### scalar

`number`

Real denominator (must be non-zero)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `scalar ≠ 0`. Calling with zero produces Infinity/NaN.

#### See

- [divideScalar](#dividescalar-1) - Throws for near-zero scalar
- [divideScalarSafe](#dividescalarsafe-1) - Returns zero for near-zero scalar

#### Since

0.7.0

---

### divideUnchecked()

> **divideUnchecked**(`other`): `this`

Defined in: [src/core/complex.ts:1941](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1941)

Divides by another complex number in place (unchecked).

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to divide by (must have non-zero magnitude)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `|other| ≠ 0`.

#### See

- [divide](#divide-1) - Throws on zero denominator
- [divideSafe](#dividesafe-1) - Returns fallback on zero denominator

#### Since

0.7.0

---

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/complex.ts:2203](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2203)

Component-wise modulo.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Divisor complex

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/complex.ts:1872](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1872)

Multiplies with another complex number in place.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/complex.ts:2018](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2018)

Multiplies both components by a scalar in place.

#### Parameters

##### scalar

`number`

Scalar multiplier

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/complex.ts:2643](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2643)

Negates this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/complex.ts:1858](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1858)

Subtracts another complex number in place.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to subtract

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtractScalar()

> **subtractScalar**(`scalar`): `this`

Defined in: [src/core/complex.ts:2063](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2063)

Subtracts a real scalar from this complex number in place.
Only the real component is affected: `(a+bi) - s = (a-s) + bi`.

#### Parameters

##### scalar

`number`

Real scalar subtrahend

#### Returns

`this`

This for chaining

#### Example

```typescript
new Complex(3, 4).subtractScalar(2); // (1, 4)
```

#### Since

0.7.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:509](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L509)

Adds two complex numbers.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

First complex number

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

### addScalar()

> `static` **addScalar**(`complex`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:676](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L676)

Adds a real scalar to a complex number: `(a+bi) + s = (a+s) + bi`.
Only the real component is affected.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex number

##### scalar

`number`

Real scalar addend

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with real component increased by scalar

#### Remarks

Unlike [Vector2.addScalar](Vector2.md#addscalar-1) which adds the scalar to both components,
this follows complex arithmetic convention where adding a real scalar
affects only the real part.

#### Example

```typescript
Complex.addScalar(new Complex(3, 4), 2); // (5, 4)
```

#### Since

0.7.0

---

### conjugate()

> `static` **conjugate**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:779](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L779)

Returns the conjugate of a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:571](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L571)

Divides two complex numbers.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Numerator

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

- [divideSafe](#dividesafe-1) - Returns fallback on zero denominator
- [divideUnchecked](#divideunchecked-1) - No validation

#### Since

0.7.0

---

### divideSafe()

> `static` **divideSafe**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:599](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L599)

Divides two complex numbers, returning (0,0) if denominator is near zero.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Numerator

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

[divide](#divide-1) - Throws for zero denominator

#### Since

0.7.0

---

### divideScalar()

> `static` **divideScalar**(`z`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:718](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L718)

Divides a complex number by a real scalar.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex numerator

##### scalar

`number`

Real denominator

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

z / scalar

#### Throws

If scalar is near zero

#### See

- [divideScalarSafe](#dividescalarsafe-1) - Returns zero for near-zero scalar
- [divideScalarUnchecked](#dividescalarunchecked-1) - No validation

#### Since

0.7.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`z`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:738](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L738)

Divides a complex number by a real scalar, returning zero for near-zero scalar.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex numerator

##### scalar

`number`

Real denominator

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

z / scalar, or (0, 0) if scalar is near zero

#### See

- [divideScalar](#dividescalar-1) - Throws for near-zero scalar
- [divideScalarUnchecked](#dividescalarunchecked-1) - No validation

#### Since

0.7.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`z`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:762](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L762)

Divides a complex number by a real scalar without validation.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex numerator

##### scalar

`number`

Real denominator (must be non-zero)

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

z / scalar

#### Remarks

**Precondition:** `scalar ≠ 0`. Calling with zero produces Infinity/NaN.

#### See

- [divideScalar](#dividescalar-1) - Throws for near-zero scalar
- [divideScalarSafe](#dividescalarsafe-1) - Returns zero for near-zero scalar

#### Since

0.7.0

---

### divideUnchecked()

> `static` **divideUnchecked**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:626](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L626)

Divides two complex numbers without validation.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Numerator

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

- [divide](#divide-1) - Throws on zero denominator
- [divideSafe](#dividesafe-1) - Returns fallback on zero denominator

#### Since

0.7.0

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:939](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L939)

Component-wise modulo.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Dividend complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Divisor complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with per-component remainder

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:544](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L544)

Multiplies two complex numbers.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

First complex number

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

### multiplyScalar()

> `static` **multiplyScalar**(`complex`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:646](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L646)

Multiplies all components of a complex number by a scalar.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex number

##### scalar

`number`

Scalar multiplier

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with both components multiplied by scalar

#### Since

0.7.0

---

### negate()

> `static` **negate**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:792](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L792)

Negates a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:523](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L523)

Subtracts two complex numbers.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

First complex number

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Second complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Difference

#### Since

0.7.0

---

### subtractScalar()

> `static` **subtractScalar**(`complex`, `scalar`, `out?`): `Complex`

Defined in: [src/core/complex.ts:696](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L696)

Subtracts a real scalar from a complex number: `(a+bi) - s = (a-s) + bi`.
Only the real component is affected.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex number

##### scalar

`number`

Real scalar subtrahend

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with real component decreased by scalar

#### Example

```typescript
Complex.subtractScalar(new Complex(3, 4), 2); // (1, 4)
```

#### Since

0.7.0

## Comparison

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/complex.ts:2509](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2509)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex to compare

#### Returns

`boolean`

True if exactly identical

#### Remarks

Use [nearEquals](#nearequals-1) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/complex.ts:2606](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2606)

Tests if any component is infinite (±Infinity).

#### Returns

`boolean`

True if any component is ±Infinity

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/complex.ts:2595](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2595)

Tests if any component is NaN.

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/complex.ts:2584](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2584)

Tests if both components are finite numbers.

#### Returns

`boolean`

True if both components are finite

#### Since

0.7.0

---

### isIdentity()

> **isIdentity**(`epsilon?`): `boolean`

Defined in: [src/core/complex.ts:2630](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2630)

Tests if this complex number is the multiplicative identity (1 + 0i).

#### Parameters

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if z ≈ 1 + 0i

#### Since

0.7.0

---

### isImaginary()

> **isImaginary**(`epsilon?`): `boolean`

Defined in: [src/core/complex.ts:2573](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2573)

Tests if this complex number is purely imaginary.

#### Parameters

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if real part is near zero

#### Since

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon?`): `boolean`

Defined in: [src/core/complex.ts:2549](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2549)

Tests if this complex number is near zero.

#### Parameters

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if near zero

#### Since

0.7.0

---

### isReal()

> **isReal**(`epsilon?`): `boolean`

Defined in: [src/core/complex.ts:2561](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2561)

Tests if this complex number is purely real.

#### Parameters

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if imaginary part is near zero

#### Since

0.7.0

---

### isUnit()

> **isUnit**(`epsilon?`): `boolean`

Defined in: [src/core/complex.ts:2618](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2618)

Tests if this complex number has unit magnitude.

#### Parameters

##### epsilon?

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

Defined in: [src/core/complex.ts:2537](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2537)

Tests if this complex number is exactly zero.

#### Returns

`boolean`

True if both real and imag are exactly 0

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon?`): `boolean`

Defined in: [src/core/complex.ts:2526](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2526)

Approximate equality using relative tolerance.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex to compare

##### epsilon?

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

Defined in: [src/core/complex.ts:1088](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1088)

Exact component-wise equality (bit-identical).

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

First complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Second complex

#### Returns

`boolean`

True if real and imaginary parts are exactly identical

#### Remarks

Use [nearEquals](#nearequals-1) for comparing results of floating-point operations.

#### Since

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`complex`): `boolean`

Defined in: [src/core/complex.ts:1633](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1633)

Tests if any component is infinite (±Infinity).

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex to test

#### Returns

`boolean`

True if any component is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-1) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`complex`): `boolean`

Defined in: [src/core/complex.ts:1617](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1617)

Tests if any component is NaN.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex to test

#### Returns

`boolean`

True if any component is NaN

#### Since

0.7.0

---

### isFinite()

> `static` **isFinite**(`complex`): `boolean`

Defined in: [src/core/complex.ts:1605](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1605)

Tests if both components are finite numbers.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex to test

#### Returns

`boolean`

True if both components are finite

#### Since

0.7.0

---

### isIdentity()

> `static` **isIdentity**(`complex`, `epsilon?`): `boolean`

Defined in: [src/core/complex.ts:1142](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1142)

Tests if a complex number is the multiplicative identity (1 + 0i).

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to test

##### epsilon?

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

> `static` **isImaginary**(`complex`, `epsilon?`): `boolean`

Defined in: [src/core/complex.ts:1593](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1593)

Tests if a complex number is purely imaginary.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if real part is near zero

#### Since

0.7.0

---

### isNearZero()

> `static` **isNearZero**(`complex`, `epsilon?`): `boolean`

Defined in: [src/core/complex.ts:1567](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1567)

Tests if a complex number is near zero within tolerance.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to test

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if both components are within epsilon of zero

#### Since

0.7.0

---

### isReal()

> `static` **isReal**(`complex`, `epsilon?`): `boolean`

Defined in: [src/core/complex.ts:1580](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1580)

Tests if a complex number is purely real.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

##### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if imaginary part is near zero

#### Since

0.7.0

---

### isUnit()

> `static` **isUnit**(`complex`, `epsilon?`): `boolean`

Defined in: [src/core/complex.ts:1123](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1123)

Tests if a complex number has unit magnitude.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to test

##### epsilon?

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

Defined in: [src/core/complex.ts:1553](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1553)

Tests if a complex number is exactly zero.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

> `static` **nearEquals**(`a`, `b`, `epsilon?`): `boolean`

Defined in: [src/core/complex.ts:1106](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1106)

Approximate equality between two complex numbers using relative tolerance.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

First complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Second complex

##### epsilon?

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

### magnitude()

> **magnitude**(): `number`

Defined in: [src/core/complex.ts:1730](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1730)

Returns the magnitude of this complex number.

#### Returns

`number`

Magnitude

#### Since

0.7.0

---

### magnitudeSq()

> **magnitudeSq**(): `number`

Defined in: [src/core/complex.ts:1741](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1741)

Returns the squared magnitude of this complex number.

#### Returns

`number`

Squared magnitude

#### Since

0.7.0

---

### angle()

> `static` **angle**(`complex`): `number`

Defined in: [src/core/complex.ts:1167](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1167)

Returns the phase angle of a complex number in radians.
Computed as atan2(imag, real), consistent with Vector2.angle.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

#### Returns

`number`

Angle in radians

#### Since

0.7.0

---

### magnitude()

> `static` **magnitude**(`complex`): `number`

Defined in: [src/core/complex.ts:1154](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1154)

Returns the magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

#### Returns

`number`

Magnitude

#### Since

0.7.0

---

### magnitudeSq()

> `static` **magnitudeSq**(`complex`): `number`

Defined in: [src/core/complex.ts:1179](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1179)

Returns the squared magnitude of a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

#### Returns

`number`

Squared magnitude

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/complex.ts:227](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L227)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### I

> `readonly` `static` **I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:241](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L241)

Imaginary unit (0 + 1i).

#### Since

0.7.0

---

### NEG_I

> `readonly` `static` **NEG_I**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:248](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L248)

Negative imaginary unit (0 - 1i).

#### Since

0.7.0

---

### NEG_ONE

> `readonly` `static` **NEG_ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:255](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L255)

Negative real unit (-1 + 0i).

#### Since

0.7.0

---

### ONE

> `readonly` `static` **ONE**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:234](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L234)

Real unit (1 + 0i).

#### Since

0.7.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Complex`\>

Defined in: [src/core/complex.ts:220](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L220)

Zero complex (0 + 0i).

#### Since

0.7.0

## Constraint

### clamp()

> **clamp**(`minZ`, `maxZ`): `this`

Defined in: [src/core/complex.ts:2190](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2190)

Clamps components between min and max complex values.

#### Parameters

##### minZ

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Per-component minima

##### maxZ

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Per-component maxima

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### max()

> **max**(`other`): `this`

Defined in: [src/core/complex.ts:2176](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2176)

Component-wise maximum with other.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Other complex

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### min()

> **min**(`other`): `this`

Defined in: [src/core/complex.ts:2163](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2163)

Component-wise minimum with other.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Other complex

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### clamp()

> `static` **clamp**(`z`, `minZ`, `maxZ`, `out?`): `Complex`

Defined in: [src/core/complex.ts:917](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L917)

Clamps components between min and max complex values.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex

##### minZ

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Per-component minima

##### maxZ

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Per-component maxima

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Clamped complex

#### Since

0.7.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:902](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L902)

Component-wise maximum of a and b.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

First complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Second complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with per-component maxima

#### Since

0.7.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Complex`

Defined in: [src/core/complex.ts:888](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L888)

Component-wise minimum of a and b.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

First complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Second complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with per-component minima

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/complex.ts:3011](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L3011)

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

Defined in: [src/core/complex.ts:2995](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2995)

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

Defined in: [src/core/complex.ts:2905](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2905)

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

Defined in: [src/core/complex.ts:2950](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2950)

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

Defined in: [src/core/complex.ts:2931](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2931)

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

Defined in: [src/core/complex.ts:2489](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2489)

Converts this complex number to polar coordinates.

#### Returns

`object`

Object with magnitude and angle

##### angle

> **angle**: `number`

##### magnitude

> **magnitude**: `number`

#### Since

0.7.0

---

### toRotationMatrix2()

> **toRotationMatrix2**(`out?`): [`Matrix2Like`](../../types/interfaces/Matrix2Like.md)

Defined in: [src/core/complex.ts:2856](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2856)

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

> **toString**(`precision?`): `string`

Defined in: [src/core/complex.ts:2974](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2974)

Creates a human-readable string representation.
Uses standard mathematical notation: a + bi or a - bi.

#### Parameters

##### precision?

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

Defined in: [src/core/complex.ts:2881](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2881)

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

0.7.0

---

### toPolar()

> `static` **toPolar**(`z`): `object`

Defined in: [src/core/complex.ts:1537](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1537)

Converts a complex number to polar coordinates.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

#### Returns

`object`

Object with magnitude and angle

##### angle

> **angle**: `number`

##### magnitude

> **magnitude**: `number`

#### Since

0.7.0

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Complex`

Defined in: [src/core/complex.ts:471](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L471)

Creates a deep copy of a complex number.

#### Parameters

##### source

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:491](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L491)

Copies values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

> `static` **fromArray**(`array`, `offset?`, `out?`): `Complex`

Defined in: [src/core/complex.ts:357](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L357)

Creates a complex number from an array [real, imag].

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array

##### offset?

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

Defined in: [src/core/complex.ts:384](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L384)

Creates a complex number from an object { real, imag }.

#### Parameters

##### object

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:296](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L296)

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

Defined in: [src/core/complex.ts:329](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L329)

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

### fromRotation2()

> `static` **fromRotation2**(`rotation`, `out?`): `Complex`

Defined in: [src/core/complex.ts:448](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L448)

Creates a complex number from a 2D rotation, mapping (cos, sin) to (real, imag).

#### Parameters

##### rotation

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Source rotation

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with real = rotation.cos, imag = rotation.sin

#### Remarks

A Rotation2 is a unit complex number. This factory converts the
(cos, sin) representation into the equivalent complex number (cos + i·sin).

#### Example

```typescript
const r = Rotation2.fromAngle(Math.PI / 4);
const z = Complex.fromRotation2(r); // → (cos(π/4) + i·sin(π/4))
```

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`real`, `imag`, `out?`): `Complex`

Defined in: [src/core/complex.ts:405](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L405)

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

---

### fromVector2()

> `static` **fromVector2**(`v`, `out?`): `Complex`

Defined in: [src/core/complex.ts:424](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L424)

Creates a complex number from a 2D vector, mapping (x, y) to (real, imag).

#### Parameters

##### v

[`ReadonlyVector2Like`](../../types/interfaces/ReadonlyVector2Like.md)

Source vector

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with real = v.x, imag = v.y

#### Example

```typescript
const v = new Vector2(3, 4);
const z = Complex.fromVector2(v); // → (3 + 4i)
```

#### Since

0.7.0

## Interpolation

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/complex.ts:2753](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2753)

Linear interpolation towards another complex number in place.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:2768](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2768)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:2781](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2781)

Spherical linear interpolation towards another complex number in place.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:2807](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2807)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:2824](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2824)

Smooth interpolation with another complex number in place.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:958](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L958)

Linear interpolation between two complex numbers.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Start complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:978](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L978)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Start complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:999](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L999)

Spherical linear interpolation between two complex numbers.
Interpolates both magnitude and angle.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Start complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:1030](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1030)

Spherical linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Start complex

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:1062](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1062)

Smooth interpolation between two complex numbers using smoothStep easing.

#### Parameters

##### a

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Source complex number

##### b

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:1667](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1667)

Copies values from another complex number.

#### Parameters

##### other

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Source complex

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`real`, `imag`): `this`

Defined in: [src/core/complex.ts:1653](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1653)

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

> **setFromArray**(`array`, `offset?`): `this`

Defined in: [src/core/complex.ts:1698](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1698)

Sets from array values.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array [real, imag]

##### offset?

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

Defined in: [src/core/complex.ts:1682](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1682)

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

Defined in: [src/core/complex.ts:1715](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1715)

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

Defined in: [src/core/complex.ts:2658](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2658)

Resets this complex number to zero.

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### imag

> **imag**: `number`

Defined in: [src/core/complex.ts:201](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L201)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`imag`](../../types/interfaces/ComplexLike.md#imag)

---

### real

> **real**: `number`

Defined in: [src/core/complex.ts:200](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L200)

#### Implementation of

[`ComplexLike`](../../types/interfaces/ComplexLike.md).[`real`](../../types/interfaces/ComplexLike.md#real)

## Transform

### abs()

> **abs**(): `this`

Defined in: [src/core/complex.ts:2090](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2090)

Applies Math.abs to both components.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### apply()

> **apply**(`vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:2314](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2314)

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

Defined in: [src/core/complex.ts:2342](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2342)

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

### ceil()

> **ceil**(): `this`

Defined in: [src/core/complex.ts:2114](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2114)

Applies Math.ceil to both components.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### exp()

> **exp**(): `this`

Defined in: [src/core/complex.ts:2465](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2465)

Computes the complex exponential e^z in place using Euler's formula.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### floor()

> **floor**(): `this`

Defined in: [src/core/complex.ts:2102](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2102)

Applies Math.floor to both components.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### log()

> **log**(): `this`

Defined in: [src/core/complex.ts:2477](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2477)

Computes the principal complex logarithm in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### normalize()

> **normalize**(): `this`

Defined in: [src/core/complex.ts:2230](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2230)

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

- [normalizeSafe](#normalizesafe-1) - Returns fallback on zero magnitude
- [normalizeUnchecked](#normalizeunchecked-1) - No validation

#### Since

0.7.0

---

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/core/complex.ts:2256](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2256)

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

[normalize](#normalize-1) - Throws for zero magnitude

#### Since

0.7.0

---

### normalizeUnchecked()

> **normalizeUnchecked**(): `this`

Defined in: [src/core/complex.ts:2285](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2285)

Normalizes this complex number without validation (for hot paths).

#### Returns

`this`

This for chaining

#### Remarks

**WARNING:** This method performs no validation.

- If magnitude is zero, this will become (NaN, NaN).
- Use only when you can guarantee non-zero magnitude.

#### See

- [normalize](#normalize-1) - Throws on zero magnitude
- [normalizeSafe](#normalizesafe-1) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### pow()

> **pow**(`exponent`): `this`

Defined in: [src/core/complex.ts:2432](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2432)

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

Defined in: [src/core/complex.ts:2363](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2363)

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

- [reciprocalSafe](#reciprocalsafe-1) - Returns fallback on zero magnitude
- [reciprocalUnchecked](#reciprocalunchecked-1) - No validation

#### Since

0.7.0

---

### reciprocalSafe()

> **reciprocalSafe**(): `this`

Defined in: [src/core/complex.ts:2389](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2389)

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

[reciprocal](#reciprocal-1) - Throws for zero magnitude

#### Since

0.7.0

---

### reciprocalUnchecked()

> **reciprocalUnchecked**(): `this`

Defined in: [src/core/complex.ts:2416](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2416)

Computes the reciprocal of this complex number in place (unchecked).

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Magnitude must be non-zero.

#### See

- [reciprocal](#reciprocal-1) - Throws on zero magnitude
- [reciprocalSafe](#reciprocalsafe-1) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### round()

> **round**(): `this`

Defined in: [src/core/complex.ts:2126](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2126)

Applies Math.round to both components.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### sign()

> **sign**(): `this`

Defined in: [src/core/complex.ts:2150](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2150)

Component-wise sign.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/complex.ts:2453](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2453)

Computes the square root of this complex number in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/complex.ts:2138](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L2138)

Applies Math.trunc to both components.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### abs()

> `static` **abs**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:809](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L809)

Applies Math.abs to both components.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with absolute components

#### Since

0.7.0

---

### apply()

> `static` **apply**(`complex`, `vector`, `out?`): [`Vector2`](Vector2.md)

Defined in: [src/core/complex.ts:1294](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1294)

Applies a complex number as a rotation to a vector.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:1335](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1335)

Applies the inverse rotation of a complex number to a vector.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

### ceil()

> `static` **ceil**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:835](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L835)

Applies Math.ceil to both components.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with ceiled components

#### Since

0.7.0

---

### exp()

> `static` **exp**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1508](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1508)

Computes the complex exponential e^z using Euler's formula.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex exponent

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

e^z = e^re \* (cos(im) + i·sin(im))

#### Since

0.7.0

---

### floor()

> `static` **floor**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:822](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L822)

Applies Math.floor to both components.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with floored components

#### Since

0.7.0

---

### log()

> `static` **log**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1523](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1523)

Computes the principal complex logarithm.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

log(z) = (ln|z|, arg(z))

#### Since

0.7.0

---

### normalize()

> `static` **normalize**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1202](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1202)

Normalizes a complex number to unit length.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

- [normalizeSafe](#normalizesafe-1) - Returns fallback on zero magnitude
- [normalizeUnchecked](#normalizeunchecked-1) - No validation

#### Since

0.7.0

---

### normalizeSafe()

> `static` **normalizeSafe**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1236](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1236)

Safe normalization that handles zero-magnitude complex numbers.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number to normalize

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Normalized complex, or (1, 0) if input has zero magnitude

#### Remarks

Unlike [normalize](#normalize-1), this method returns the unit real (1, 0)
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

[normalize](#normalize-1) - Throws for zero magnitude

#### Since

0.7.0

---

### normalizeUnchecked()

> `static` **normalizeUnchecked**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1263](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1263)

Normalizes a complex number without validation (for hot paths).

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

- [normalize](#normalize-1) - Throws on zero magnitude
- [normalizeSafe](#normalizesafe-1) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### pow()

> `static` **pow**(`complex`, `exponent`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1438](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1438)

Raises a complex number to a power.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

Defined in: [src/core/complex.ts:1370](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1370)

Returns the reciprocal of a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

- [reciprocalSafe](#reciprocalsafe-1) - Returns fallback on zero magnitude
- [reciprocalUnchecked](#reciprocalunchecked-1) - No validation

#### Since

0.7.0

---

### reciprocalSafe()

> `static` **reciprocalSafe**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1396](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1396)

Returns the reciprocal of a complex number, returning (0,0) if magnitude is near zero.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

[reciprocal](#reciprocal-1) - Throws for zero magnitude

#### Since

0.7.0

---

### reciprocalUnchecked()

> `static` **reciprocalUnchecked**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1421](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1421)

Returns the reciprocal of a complex number without validation.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

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

- [reciprocal](#reciprocal-1) - Throws on zero magnitude
- [reciprocalSafe](#reciprocalsafe-1) - Returns fallback on zero magnitude

#### Since

0.7.0

---

### round()

> `static` **round**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:848](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L848)

Applies Math.round to both components.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with rounded components

#### Since

0.7.0

---

### sign()

> `static` **sign**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:874](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L874)

Component-wise sign.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with sign of each component (-1, 0, or 1)

#### Since

0.7.0

---

### sqrt()

> `static` **sqrt**(`complex`, `out?`): `Complex`

Defined in: [src/core/complex.ts:1471](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L1471)

Returns the principal square root of a complex number.

#### Parameters

##### complex

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Complex number

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Principal square root (real part >= 0)

#### Remarks

Uses the direct algebraic formula (matching C99 Annex G / production
`csqrt` implementations) instead of polar form, avoiding the overhead
of `atan2` + `sinCos` and providing better numerical stability.

Branch-cut handling (C99 Annex G):

- `sqrt(0)` = 0
- `sqrt(a + 0i)` where `a >= 0` = `(sqrt(a), 0)`
- `sqrt(a + 0i)` where `a < 0` = `(0, sqrt(-a))`
- General: `(sqrt((r+a)/2), sign(b) * sqrt((r-a)/2))`
  where `r = |z|`, `a = Re(z)`, `b = Im(z)`

#### Since

0.7.0

---

### trunc()

> `static` **trunc**(`z`, `out?`): `Complex`

Defined in: [src/core/complex.ts:861](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/core/complex.ts#L861)

Applies Math.trunc to both components.

#### Parameters

##### z

[`ReadonlyComplexLike`](../../types/interfaces/ReadonlyComplexLike.md)

Input complex

##### out?

`Complex`

Optional output complex

#### Returns

`Complex`

Complex with truncated components

#### Since

0.7.0
