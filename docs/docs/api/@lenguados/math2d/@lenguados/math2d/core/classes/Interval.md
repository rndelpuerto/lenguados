# Class: Interval

Defined in: [src/core/interval.ts:56](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L56)

Mutable interface for intervals.

## Implements

- [`IntervalLike`](../../types/interfaces/IntervalLike.md)

## Constructors

### Constructor

> **new Interval**(`min`, `max`): `Interval`

Defined in: [src/core/interval.ts:172](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L172)

#### Parameters

##### min

`number` = `0`

##### max

`number` = `0`

#### Returns

`Interval`

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/interval.ts:867](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L867)

Adds another interval to this one in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to add

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### divide()

> **divide**(`other`): `this`

Defined in: [src/core/interval.ts:918](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L918)

Divides this interval by another in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to divide by (must not contain zero)

#### Returns

`this`

This for chaining

#### Throws

If divisor interval contains zero

#### Since

0.1.0

***

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/interval.ts:897](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L897)

Multiplies with another interval in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to multiply by

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### negate()

> **negate**(): `this`

Defined in: [src/core/interval.ts:962](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L962)

Negates this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### reciprocal()

> **reciprocal**(): `this`

Defined in: [src/core/interval.ts:1018](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1018)

Computes the reciprocal of this interval in place.

#### Returns

`this`

This for chaining

#### Throws

If interval contains zero

#### Since

0.1.0

***

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/interval.ts:941](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L941)

Scales this interval by a scalar in place.

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

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/interval.ts:1001](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1001)

Computes the square root of this interval in place.

#### Returns

`this`

This for chaining

#### Throws

If interval contains negative values

#### Since

0.1.0

***

### square()

> **square**(): `this`

Defined in: [src/core/interval.ts:977](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L977)

Squares this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/interval.ts:881](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L881)

Subtracts another interval from this one in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to subtract

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### add()

> `static` **add**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:304](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L304)

Adds two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Sum interval

#### Since

0.1.0

***

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:336](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L336)

Multiplies two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Product interval

#### Since

0.1.0

***

### negate()

> `static` **negate**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:374](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L374)

Negates an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to negate

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Negated interval

#### Since

0.1.0

***

### reciprocal()

> `static` **reciprocal**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:425](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L425)

Returns the reciprocal of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval (must not contain zero)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Reciprocal interval

#### Throws

If interval contains zero

#### Since

0.1.0

***

### scale()

> `static` **scale**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:358](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L358)

Scales an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to scale

##### scalar

`number`

Scale factor

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Scaled interval

#### Since

0.1.0

***

### sqrt()

> `static` **sqrt**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:408](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L408)

Returns the square root of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval (must be non-negative)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Square root interval

#### Throws

If interval contains negative values

#### Since

0.1.0

***

### square()

> `static` **square**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:387](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L387)

Returns the square of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to square

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Squared interval

#### Since

0.1.0

***

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:318](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L318)

Subtracts two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Difference interval

#### Since

0.1.0

## Comparison

### contains()

> **contains**(`value`): `boolean`

Defined in: [src/core/interval.ts:815](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L815)

Tests if this interval contains a value.

#### Parameters

##### value

`number`

Value to test

#### Returns

`boolean`

True if value is within interval

#### Since

0.1.0

***

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/interval.ts:1083](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1083)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to compare

#### Returns

`boolean`

True if exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.1.0

***

### isDegenerate()

> **isDegenerate**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:803](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L803)

Tests if this interval is degenerate (zero width).

#### Parameters

##### epsilon

`number` = `EPSILON`

Relative tolerance (default: EPSILON)

#### Returns

`boolean`

True if degenerate

#### Remarks

Uses relative tolerance for comparing min and max bounds.

#### Since

0.1.0

***

### isSubsetOf()

> **isSubsetOf**(`other`): `boolean`

Defined in: [src/core/interval.ts:851](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L851)

Tests if this interval is a subset of another.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Other interval

#### Returns

`boolean`

True if this is contained in other

#### Since

0.1.0

***

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:1099](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1099)

Approximate equality using relative tolerance.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to compare

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if within scaled epsilon

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.

#### Since

0.9.0

***

### overlaps()

> **overlaps**(`other`): `boolean`

Defined in: [src/core/interval.ts:839](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L839)

Tests if this interval overlaps another.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Other interval

#### Returns

`boolean`

True if intervals overlap

#### Since

0.1.0

***

### strictlyContains()

> **strictlyContains**(`value`): `boolean`

Defined in: [src/core/interval.ts:827](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L827)

Tests if this interval strictly contains a value (exclusive bounds).

#### Parameters

##### value

`number`

Value to test

#### Returns

`boolean`

True if value is strictly within interval

#### Since

0.1.0

***

### contains()

> `static` **contains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:538](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L538)

Tests if an interval contains a value.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

##### value

`number`

Value to test

#### Returns

`boolean`

True if value is within interval

#### Since

0.1.0

***

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:475](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L475)

Exact equality (bit-identical).

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

#### Returns

`boolean`

True if exactly identical

#### Remarks

Use [nearEquals](#nearequals-2) for comparing results of floating-point operations.

#### Since

0.1.0

***

### hasNaN()

> `static` **hasNaN**(`interval`): `boolean`

Defined in: [src/core/interval.ts:562](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L562)

Tests if any bound is NaN.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

#### Returns

`boolean`

True if any bound is NaN

#### Since

0.9.0

***

### isDegenerate()

> `static` **isDegenerate**(`interval`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:512](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L512)

Tests if an interval is degenerate (zero width).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

##### epsilon

`number` = `EPSILON`

Relative tolerance (default: EPSILON)

#### Returns

`boolean`

True if degenerate

#### Remarks

Uses relative tolerance for comparing min and max bounds.

#### Since

0.1.0

***

### isFinite()

> `static` **isFinite**(`interval`): `boolean`

Defined in: [src/core/interval.ts:550](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L550)

Tests if both bounds are finite numbers.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

#### Returns

`boolean`

True if both bounds are finite

#### Since

0.9.0

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:492](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L492)

Approximate equality using relative tolerance.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### epsilon

`number` = `EPSILON`

Relative tolerance.

#### Returns

`boolean`

True if within scaled epsilon

#### Default Value

`EPSILON`

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.

#### Since

0.9.0

***

### overlaps()

> `static` **overlaps**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:525](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L525)

Tests if two intervals overlap.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

#### Returns

`boolean`

True if intervals overlap

#### Since

0.1.0

## Computed

### expanded

#### Get Signature

> **get** **expanded**(): `Interval`

Defined in: [src/core/interval.ts:1206](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1206)

Returns an expanded interval (by EPSILON) without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New expanded interval

***

### negated

#### Get Signature

> **get** **negated**(): `Interval`

Defined in: [src/core/interval.ts:1195](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1195)

Returns the negated interval without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New negated interval

***

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Interval`

Defined in: [src/core/interval.ts:1217](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1217)

Returns the reciprocal interval without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New reciprocal interval (or throws if contains zero)

***

### squared

#### Get Signature

> **get** **squared**(): `Interval`

Defined in: [src/core/interval.ts:1233](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1233)

Returns the squared interval without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New squared interval

***

### center()

> **center**(): `number`

Defined in: [src/core/interval.ts:773](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L773)

Returns the center of this interval.

#### Returns

`number`

Center ((min + max) / 2)

#### Since

0.1.0

***

### radius()

> **radius**(): `number`

Defined in: [src/core/interval.ts:784](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L784)

Returns the radius (half-width) of this interval.

#### Returns

`number`

Radius ((max - min) / 2)

#### Since

0.1.0

***

### width()

> **width**(): `number`

Defined in: [src/core/interval.ts:762](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L762)

Returns the width of this interval.

#### Returns

`number`

Width (max - min)

#### Since

0.1.0

***

### center()

> `static` **center**(`interval`): `number`

Defined in: [src/core/interval.ts:590](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L590)

Returns the center of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Center ((min + max) / 2)

#### Since

0.1.0

***

### radius()

> `static` **radius**(`interval`): `number`

Defined in: [src/core/interval.ts:602](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L602)

Returns the radius (half-width) of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Radius ((max - min) / 2)

#### Since

0.1.0

***

### width()

> `static` **width**(`interval`): `number`

Defined in: [src/core/interval.ts:578](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L578)

Returns the width of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Width (max - min)

#### Since

0.1.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/interval.ts:1352](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1352)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding min then max.

#### Example

```typescript
const [min, max] = new Interval(0, 10);
```

#### Since

0.9.0

## Core

### DEGREES

> `readonly` `static` **DEGREES**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:154](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L154)

Degrees interval [0, 360].

***

### EPSILON\_INTERVAL

> `readonly` `static` **EPSILON\_INTERVAL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:140](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L140)

Epsilon interval [-ε, ε].

***

### FULL

> `readonly` `static` **FULL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:132](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L132)

Full real line (-∞, +∞).

***

### NEGATIVE

> `readonly` `static` **NEGATIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:124](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L124)

Negative half-line (-∞, 0].

***

### NORMALIZED

> `readonly` `static` **NORMALIZED**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:166](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L166)

Normalized interval [0, 1] (same as UNIT).

***

### PERCENT

> `readonly` `static` **PERCENT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:148](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L148)

Percentage interval [0, 100].

***

### POSITIVE

> `readonly` `static` **POSITIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:116](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L116)

Positive half-line [0, +∞).

***

### RADIANS

> `readonly` `static` **RADIANS**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:160](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L160)

Radians interval [0, 2π].

***

### SYMMETRIC\_UNIT

> `readonly` `static` **SYMMETRIC\_UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:110](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L110)

Symmetric unit interval [-1, 1].

***

### UNIT

> `readonly` `static` **UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:104](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L104)

Unit interval [0, 1].

***

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:98](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L98)

Zero interval [0, 0].

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Interval`

Defined in: [src/core/interval.ts:273](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L273)

Creates a deep copy of an interval.

#### Parameters

##### source

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to clone

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

A new Interval with identical values

#### Since

0.9.0

***

### copy()

> `static` **copy**(`source`, `destination`): `Interval`

Defined in: [src/core/interval.ts:286](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L286)

Copies values from source into destination (alloc-free).

#### Parameters

##### source

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Source interval

##### destination

`Interval`

Target interval to receive the copy

#### Returns

`Interval`

The destination interval

#### Since

0.9.0

***

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Interval`

Defined in: [src/core/interval.ts:234](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L234)

Creates an interval from an array [min, max].

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array

##### offset

`number` = `0`

Index offset (default: 0)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval from array

#### Since

0.1.0

***

### fromCenterRadius()

> `static` **fromCenterRadius**(`center`, `radius`, `out?`): `Interval`

Defined in: [src/core/interval.ts:209](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L209)

Creates an interval from center and radius [center - radius, center + radius].

#### Parameters

##### center

`number`

Center value

##### radius

`number`

Half-width (must be non-negative)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Symmetric interval around center

#### Since

0.1.0

***

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Interval`

Defined in: [src/core/interval.ts:258](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L258)

Creates an interval from a plain object.

#### Parameters

##### object

[`IntervalLike`](../../types/interfaces/IntervalLike.md)

Object with min and max properties

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval from object

#### Since

0.1.0

***

### fromValue()

> `static` **fromValue**(`value`, `out?`): `Interval`

Defined in: [src/core/interval.ts:194](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L194)

Creates an interval from a single value [v, v].

#### Parameters

##### value

`number`

Value for both min and max

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Degenerate interval

#### Since

0.1.0

## Interpolation

### clampValue()

> **clampValue**(`value`): `number`

Defined in: [src/core/interval.ts:1166](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1166)

Clamps a value to this interval.

#### Parameters

##### value

`number`

Value to clamp

#### Returns

`number`

Clamped value

#### Since

0.1.0

***

### inverseLerp()

> **inverseLerp**(`value`): `number`

Defined in: [src/core/interval.ts:1150](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1150)

Returns the inverse lerp (normalized position of value in interval).

#### Parameters

##### value

`number`

Value to find position of

#### Returns

`number`

Normalized position [0, 1] (or 0 if degenerate)

#### Since

0.1.0

***

### lerp()

> **lerp**(`t`): `number`

Defined in: [src/core/interval.ts:1137](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1137)

Linearly interpolates within this interval.

#### Parameters

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`number`

Value within the interval

#### Since

0.1.0

***

### lerpInterval()

> **lerpInterval**(`other`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1180](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1180)

Interpolates between two intervals (not within a single interval).

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Target interval

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interpolated interval

#### Since

0.1.0

***

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:449](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L449)

Linear interpolation between two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Start interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

End interval

##### t

`number`

Interpolation factor [0, 1], clamped

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interpolated interval

#### Since

0.1.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/interval.ts:732](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L732)

Copies values from another interval.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Source interval

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### set()

> **set**(`minValue`, `maxValue`): `this`

Defined in: [src/core/interval.ts:715](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L715)

Sets the min and max bounds.

#### Parameters

##### minValue

`number`

Minimum bound

##### maxValue

`number`

Maximum bound

#### Returns

`this`

This for chaining

#### Throws

If min > max

#### Since

0.1.0

***

### zero()

> **zero**(): `this`

Defined in: [src/core/interval.ts:745](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L745)

Resets this interval to zero [0, 0].

#### Returns

`this`

This for chaining

#### Since

0.9.0

## Other

### max

> **max**: `number`

Defined in: [src/core/interval.ts:62](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L62)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`max`](../../types/interfaces/IntervalLike.md#max)

***

### min

> **min**: `number`

Defined in: [src/core/interval.ts:61](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L61)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`min`](../../types/interfaces/IntervalLike.md#min)

## Serialization

### clone()

> **clone**(): `Interval`

Defined in: [src/core/interval.ts:1336](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1336)

Creates a deep copy of this interval.

#### Returns

`Interval`

New Interval with identical bounds

#### Example

```typescript
const i = new Interval(0, 10);
const copy = i.clone();
copy.set(5, 15); // Original unchanged
```

#### Since

0.1.0

***

### toArray()

> **toArray**(): \[`number`, `number`\]

Defined in: [src/core/interval.ts:1261](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1261)

Converts the interval to a tuple [min, max].

#### Returns

\[`number`, `number`\]

Tuple with min and max values

#### Example

```typescript
const i = new Interval(0, 10);
const [min, max] = i.toArray();
```

#### Since

0.1.0

***

### toJSON()

> **toJSON**(): [`IntervalLike`](../../types/interfaces/IntervalLike.md)

Defined in: [src/core/interval.ts:1298](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1298)

Converts the interval to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`IntervalLike`](../../types/interfaces/IntervalLike.md)

Object suitable for JSON serialization

#### Example

```typescript
const i = new Interval(0, 10);
const json = JSON.stringify(i);
// '{"min":0,"max":10}'
```

#### Since

0.1.0

***

### toObject()

> **toObject**(): [`IntervalLike`](../../types/interfaces/IntervalLike.md)

Defined in: [src/core/interval.ts:1279](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1279)

Converts the interval to a plain object.

#### Returns

[`IntervalLike`](../../types/interfaces/IntervalLike.md)

Object with min and max properties

#### Example

```typescript
const i = new Interval(0, 10);
const obj = i.toObject();
// { min: 0, max: 10 }
```

#### Since

0.1.0

***

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/interval.ts:1318](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1318)

Creates a human-readable string representation.
Uses mathematical interval notation [min, max].

#### Parameters

##### precision

`number` = `4`

Number of decimal places (default: 4)

#### Returns

`string`

Formatted string

#### Example

```typescript
const i = new Interval(0, 10);
console.log(i.toString());
// "[0.0000, 10.0000]"
```

#### Since

0.1.0

## Set Operations

### intersect()

> **intersect**(`other`): `Interval` \| `undefined`

Defined in: [src/core/interval.ts:1047](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1047)

Intersects with another interval in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Other interval

#### Returns

`Interval` \| `undefined`

This for chaining, or undefined if no overlap (interval unchanged)

#### Remarks

If there is no overlap between the intervals, this method returns `undefined`
and leaves this interval unchanged. Use the static [Interval.intersect](#intersect-2)
method if you need a new interval for the result. Mathematically, a non-overlapping
intersection represents the empty set (∅).

#### Since

0.1.0

***

### union()

> **union**(`other`): `this`

Defined in: [src/core/interval.ts:1066](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1066)

Unions with another interval in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Other interval

#### Returns

`this`

This for chaining

#### Since

0.1.0

***

### hull()

> `static` **hull**(`first`, `second?`, ...`rest?`): `Interval`

Defined in: [src/core/interval.ts:620](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L620)

Computes the convex hull (smallest enclosing interval) of multiple values/intervals.

#### Parameters

##### first

Array of values/intervals, or first value

`number` | [`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md) | readonly (`number` \| [`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md))[]

##### second?

Optional second value or output parameter (when first is array)

`number` | [`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md) | `Interval`

##### rest?

...(`number` \| [`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md))[]

Additional values (when using varargs)

#### Returns

`Interval`

Interval enclosing all inputs

#### Since

0.1.0

***

### intersect()

> `static` **intersect**(`a`, `b`, `out?`): `Interval` \| `undefined`

Defined in: [src/core/interval.ts:688](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L688)

Returns the intersection of two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval` \| `undefined`

Intersection interval or undefined if no overlap

#### Remarks

If the intervals do not overlap, returns `undefined` to represent the
empty set (∅). The `out` parameter is not modified in this case.

#### Since

0.1.0

***

### union()

> `static` **union**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:670](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L670)

Returns the union of two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Union interval (smallest interval containing both)

#### Since

0.1.0

## Validation

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/interval.ts:1121](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1121)

Returns true if any bound is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.9.0

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/interval.ts:1110](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/core/interval.ts#L1110)

Returns true if all bounds are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.9.0
