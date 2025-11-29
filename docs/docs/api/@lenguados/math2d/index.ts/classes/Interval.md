# Class: Interval

Mutable interface for intervals.

## Extends

- [`Poolable`](../../@lenguados/math2d/pool/interfaces/Poolable.md)

## Implements

- [`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md)

## Constructors

### Constructor

> **new Interval**(`min`, `max`): `Interval`

#### Parameters

##### min

`number` = `0`

##### max

`number` = `0`

#### Returns

`Interval`

## Properties

### max

> **max**: `number`

#### Implementation of

[`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md).[`max`](../../@lenguados/math2d/types/interfaces/IntervalLike.md#max)

---

### min

> **min**: `number`

#### Implementation of

[`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md).[`min`](../../@lenguados/math2d/types/interfaces/IntervalLike.md#min)

---

### DEGREES

> `readonly` `static` **DEGREES**: `Readonly`\<`Interval`\>

Degrees interval [0, 360].

---

### EPSILON_INTERVAL

> `readonly` `static` **EPSILON_INTERVAL**: `Readonly`\<`Interval`\>

Epsilon interval [-ε, ε].

---

### FULL

> `readonly` `static` **FULL**: `Readonly`\<`Interval`\>

Full real line (-∞, +∞).

---

### NEGATIVE

> `readonly` `static` **NEGATIVE**: `Readonly`\<`Interval`\>

Negative half-line (-∞, 0].

---

### NORMALIZED

> `readonly` `static` **NORMALIZED**: `Readonly`\<`Interval`\>

Normalized interval [0, 1] (same as UNIT).

---

### PERCENT

> `readonly` `static` **PERCENT**: `Readonly`\<`Interval`\>

Percentage interval [0, 100].

---

### POSITIVE

> `readonly` `static` **POSITIVE**: `Readonly`\<`Interval`\>

Positive half-line [0, +∞).

---

### RADIANS

> `readonly` `static` **RADIANS**: `Readonly`\<`Interval`\>

Radians interval [0, 2π].

---

### SYMMETRIC_UNIT

> `readonly` `static` **SYMMETRIC_UNIT**: `Readonly`\<`Interval`\>

Symmetric unit interval [-1, 1].

---

### UNIT

> `readonly` `static` **UNIT**: `Readonly`\<`Interval`\>

Unit interval [0, 1].

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Interval`\>

Zero interval [0, 0].

## Accessors

### expanded

#### Get Signature

> **get** **expanded**(): `Interval`

Returns an expanded interval (by EPSILON) without modifying this one.

##### Returns

`Interval`

New expanded interval

---

### negated

#### Get Signature

> **get** **negated**(): `Interval`

Returns the negated interval without modifying this one.

##### Returns

`Interval`

New negated interval

---

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Interval`

Returns the reciprocal interval without modifying this one.

##### Returns

`Interval`

New reciprocal interval (or throws if contains zero)

---

### squared

#### Get Signature

> **get** **squared**(): `Interval`

Returns the squared interval without modifying this one.

##### Returns

`Interval`

New squared interval

## Methods

### add()

> **add**(`other`, `out?`): `Interval`

Adds another interval to this one.

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

Interval to add

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Sum interval

---

### center()

> **center**(): `number`

#### Returns

`number`

---

### clampValue()

> **clampValue**(`value`): `number`

#### Parameters

##### value

`number`

#### Returns

`number`

---

### clone()

> **clone**(): `Interval`

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

---

### contains()

> **contains**(`value`): `boolean`

#### Parameters

##### value

`number`

#### Returns

`boolean`

---

### copy()

> **copy**(`other`): `this`

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

#### Returns

`this`

---

### divide()

> **divide**(`other`, `out?`): `Interval`

Divides this interval by another.

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

Interval to divide by (must not contain zero)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Quotient interval

#### Throws

Error if divisor interval contains zero

---

### equals()

> **equals**(`other`, `epsilon`): `boolean`

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### intersect()

> **intersect**(`other`, `out?`): `Interval` \| `undefined`

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

##### out?

`Interval`

#### Returns

`Interval` \| `undefined`

---

### inverseLerp()

> **inverseLerp**(`value`): `number`

#### Parameters

##### value

`number`

#### Returns

`number`

---

### isDegenerate()

> **isDegenerate**(`epsilon`): `boolean`

#### Parameters

##### epsilon

`number` = `EPSILON`

#### Returns

`boolean`

---

### isSubsetOf()

> **isSubsetOf**(`other`): `boolean`

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

#### Returns

`boolean`

---

### lerp()

> **lerp**(`t`): `number`

#### Parameters

##### t

`number`

#### Returns

`number`

---

### lerpInterval()

> **lerpInterval**(`other`, `t`, `out?`): `Interval`

Interpolates between two intervals (not within a single interval).

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

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

---

### multiply()

> **multiply**(`other`, `out?`): `Interval`

Multiplies with another interval.

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

Interval to multiply by

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Product interval

---

### negate()

> **negate**(`out?`): `Interval`

#### Parameters

##### out?

`Interval`

#### Returns

`Interval`

---

### overlaps()

> **overlaps**(`other`): `boolean`

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

#### Returns

`boolean`

---

### radius()

> **radius**(): `number`

#### Returns

`number`

---

### reciprocal()

> **reciprocal**(`out?`): `Interval`

#### Parameters

##### out?

`Interval`

#### Returns

`Interval`

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

> **scale**(`scalar`, `out?`): `Interval`

#### Parameters

##### scalar

`number`

##### out?

`Interval`

#### Returns

`Interval`

---

### set()

> **set**(`minValue`, `maxValue`): `this`

#### Parameters

##### minValue

`number`

##### maxValue

`number`

#### Returns

`this`

---

### sqrt()

> **sqrt**(`out?`): `Interval`

Returns the square root of this interval.

#### Parameters

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Square root interval

#### Throws

If interval contains negative values

#### Remarks

Delegates to [Interval.sqrt](#sqrt-2) for the computation.

---

### square()

> **square**(`out?`): `Interval`

Returns the squared interval.

#### Parameters

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Squared interval

#### Remarks

Delegates to [Interval.square](#square-2) for the computation.

---

### strictlyContains()

> **strictlyContains**(`value`): `boolean`

#### Parameters

##### value

`number`

#### Returns

`boolean`

---

### subtract()

> **subtract**(`other`, `out?`): `Interval`

Subtracts another interval from this one.

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

Interval to subtract

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Difference interval

---

### toArray()

> **toArray**(): \[`number`, `number`\]

Converts the interval to a tuple [min, max].

#### Returns

\[`number`, `number`\]

Tuple with min and max values

#### Example

```typescript
const i = new Interval(0, 10);
const [min, max] = i.toArray();
```

---

### toJSON()

> **toJSON**(): [`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md)

Converts the interval to a JSON-serializable object.
Called automatically by JSON.stringify().

#### Returns

[`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md)

Object suitable for JSON serialization

#### Example

```typescript
const i = new Interval(0, 10);
const json = JSON.stringify(i);
// '{"min":0,"max":10}'
```

---

### toObject()

> **toObject**(): [`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md)

Converts the interval to a plain object.

#### Returns

[`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md)

Object with min and max properties

#### Example

```typescript
const i = new Interval(0, 10);
const obj = i.toObject();
// { min: 0, max: 10 }
```

---

### toString()

> **toString**(`precision`): `string`

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

---

### union()

> **union**(`other`, `out?`): `Interval`

#### Parameters

##### other

[`ReadonlyInterval`](../../@lenguados/math2d/core/type-aliases/ReadonlyInterval.md)

##### out?

`Interval`

#### Returns

`Interval`

---

### width()

> **width**(): `number`

#### Returns

`number`

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Interval`

Adds two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Sum interval

---

### center()

> `static` **center**(`interval`): `number`

Returns the center of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Center ((min + max) / 2)

---

### contains()

> `static` **contains**(`interval`, `value`): `boolean`

Tests if an interval contains a value.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval

##### value

`number`

Value to test

#### Returns

`boolean`

True if value is within interval

---

### equals()

> `static` **equals**(`a`, `b`, `epsilon`): `boolean`

Tests if two intervals are approximately equal.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if equal

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Interval`

#### Parameters

##### array

`ArrayLike`\<`number`\>

##### offset

`number` = `0`

##### out?

`Interval`

#### Returns

`Interval`

---

### fromCenterRadius()

> `static` **fromCenterRadius**(`center`, `radius`, `out?`): `Interval`

#### Parameters

##### center

`number`

##### radius

`number`

##### out?

`Interval`

#### Returns

`Interval`

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Interval`

#### Parameters

##### object

[`IntervalLike`](../../@lenguados/math2d/types/interfaces/IntervalLike.md)

##### out?

`Interval`

#### Returns

`Interval`

---

### fromValue()

> `static` **fromValue**(`value`, `out?`): `Interval`

#### Parameters

##### value

`number`

##### out?

`Interval`

#### Returns

`Interval`

---

### hull()

> `static` **hull**(`first`, `second?`, ...`rest?`): `Interval`

Computes the convex hull (smallest enclosing interval) of multiple values/intervals.

#### Parameters

##### first

Array of values/intervals, or first value

`number` | [`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md) | readonly (`number` \| [`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md))[]

##### second?

Optional second value or output parameter (when first is array)

`number` | [`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md) | `Interval`

##### rest?

...(`number` \| [`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md))[]

Additional values (when using varargs)

#### Returns

`Interval`

Interval enclosing all inputs

---

### intersect()

> `static` **intersect**(`a`, `b`, `out?`): `Interval` \| `undefined`

Returns the intersection of two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval` \| `undefined`

Intersection interval or undefined if no overlap

---

### isDegenerate()

> `static` **isDegenerate**(`interval`, `epsilon`): `boolean`

Tests if an interval is degenerate (zero width).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval to test

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if degenerate

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Interval`

Linear interpolation between two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Start interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

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

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Interval`

Multiplies two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Product interval

---

### negate()

> `static` **negate**(`interval`, `out?`): `Interval`

Negates an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval to negate

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Negated interval

---

### overlaps()

> `static` **overlaps**(`a`, `b`): `boolean`

Tests if two intervals overlap.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Second interval

#### Returns

`boolean`

True if intervals overlap

---

### radius()

> `static` **radius**(`interval`): `number`

Returns the radius (half-width) of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Radius ((max - min) / 2)

---

### reciprocal()

> `static` **reciprocal**(`interval`, `out?`): `Interval`

Returns the reciprocal of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval (must not contain zero)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Reciprocal interval

#### Throws

If interval contains zero

---

### scale()

> `static` **scale**(`interval`, `scalar`, `out?`): `Interval`

Scales an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

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

---

### sqrt()

> `static` **sqrt**(`interval`, `out?`): `Interval`

Returns the square root of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval (must be non-negative)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Square root interval

#### Throws

If interval contains negative values

---

### square()

> `static` **square**(`interval`, `out?`): `Interval`

Returns the square of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval to square

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Squared interval

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Interval`

Subtracts two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Difference interval

---

### union()

> `static` **union**(`a`, `b`, `out?`): `Interval`

Returns the union of two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Second interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Union interval (smallest interval containing both)

---

### width()

> `static` **width**(`interval`): `number`

Returns the width of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../@lenguados/math2d/types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Width (max - min)
