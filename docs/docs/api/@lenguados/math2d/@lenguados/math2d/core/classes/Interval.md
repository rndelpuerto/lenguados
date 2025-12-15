# Class: Interval

Defined in: [src/core/interval.ts:72](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L72)

Mutable closed interval with deterministic arithmetic and comparisons.

## Remarks

Interval bounds satisfy `min <= max` after construction and validation.

## Since

0.1.0

## Implements

- [`IntervalLike`](../../types/interfaces/IntervalLike.md)

## Constructors

### Constructor

> **new Interval**(`min`, `max`): `Interval`

Defined in: [src/core/interval.ts:188](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L188)

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

Defined in: [src/core/interval.ts:1180](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1180)

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

---

### divide()

> **divide**(`other`): `this`

Defined in: [src/core/interval.ts:1231](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1231)

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

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/interval.ts:1210](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1210)

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

---

### negate()

> **negate**(): `this`

Defined in: [src/core/interval.ts:1275](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1275)

Negates this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

---

### reciprocal()

> **reciprocal**(): `this`

Defined in: [src/core/interval.ts:1331](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1331)

Computes the reciprocal of this interval in place.

#### Returns

`this`

This for chaining

#### Throws

If interval contains zero

#### Since

0.1.0

---

### reciprocalSafe()

> **reciprocalSafe**(): `this`

Defined in: [src/core/interval.ts:1352](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1352)

Computes the reciprocal of this interval in place (safe version).

#### Returns

`this`

This for chaining, set to ZERO if interval contains zero

#### See

- [reciprocal](#reciprocal-2) - Throws if contains zero
- [reciprocalUnchecked](#reciprocalunchecked-2) - No validation, for hot paths

#### Since

0.14.0

---

### reciprocalUnchecked()

> **reciprocalUnchecked**(): `this`

Defined in: [src/core/interval.ts:1379](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1379)

Computes the reciprocal of this interval in place without validation (for hot paths).

#### Returns

`this`

This for chaining

#### Remarks

**⚠️ Precondition:** Interval must not contain zero.
If interval contains zero, result will contain Infinity/-Infinity or NaN.

#### See

- [reciprocal](#reciprocal-2) - Throws if contains zero
- [reciprocalSafe](#reciprocalsafe-2) - Returns ZERO if contains zero

#### Since

0.14.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/interval.ts:1254](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1254)

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

---

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/interval.ts:1314](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1314)

Computes the square root of this interval in place.

#### Returns

`this`

This for chaining

#### Throws

If interval contains negative values

#### Since

0.1.0

---

### square()

> **square**(): `this`

Defined in: [src/core/interval.ts:1290](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1290)

Squares this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.1.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/interval.ts:1194](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1194)

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

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:345](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L345)

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

---

### divide()

> `static` **divide**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:418](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L418)

Divides an interval by a scalar.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to divide

##### scalar

`number`

Scalar to divide by (must not be zero)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Divided interval

#### Throws

If scalar is zero

#### Since

0.9.0

---

### divideSafe()

> `static` **divideSafe**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:437](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L437)

Divides an interval by a scalar (safe version).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to divide

##### scalar

`number`

Scalar to divide by

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Divided interval, or ZERO if scalar is near zero

#### See

[divide](#divide-2) - Throws on zero scalar

#### Since

0.13.0

---

### divideUnchecked()

> `static` **divideUnchecked**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:466](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L466)

Divides an interval by a scalar without validation (for hot paths).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to divide

##### scalar

`number`

Scalar to divide by (must not be zero)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Divided interval

#### Remarks

**WARNING:** This method performs no validation.

- If scalar is zero, the result will contain Infinity/-Infinity or NaN.
- Use only when you can guarantee non-zero scalar.

#### See

- [divide](#divide-2) - Throws on zero scalar
- [divideSafe](#dividesafe) - Returns ZERO on zero scalar

#### Since

0.14.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:377](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L377)

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

---

### negate()

> `static` **negate**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:483](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L483)

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

---

### reciprocal()

> `static` **reciprocal**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:534](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L534)

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

---

### reciprocalSafe()

> `static` **reciprocalSafe**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:554](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L554)

Returns the reciprocal of an interval (safe version).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Reciprocal interval, or ZERO if interval contains zero

#### See

[reciprocal](#reciprocal-2) - Throws if interval contains zero

#### Since

0.13.0

---

### reciprocalUnchecked()

> `static` **reciprocalUnchecked**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:581](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L581)

Returns the reciprocal of an interval without validation (for hot paths).

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

#### Remarks

**⚠️ Precondition:** Interval must not contain zero.
If interval contains zero, result will contain Infinity/-Infinity or NaN.

Use in performance-critical code where interval validity is guaranteed.

#### See

- [reciprocal](#reciprocal-2) - Throws if interval contains zero
- [reciprocalSafe](#reciprocalsafe-2) - Returns ZERO if interval contains zero

#### Since

0.14.0

---

### scale()

> `static` **scale**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:399](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L399)

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

---

### sqrt()

> `static` **sqrt**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:517](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L517)

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

---

### square()

> `static` **square**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:496](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L496)

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

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:359](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L359)

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

Defined in: [src/core/interval.ts:1128](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1128)

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

---

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/interval.ts:1441](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1441)

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

---

### isDegenerate()

> **isDegenerate**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:1116](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1116)

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

---

### isSubsetOf()

> **isSubsetOf**(`other`): `boolean`

Defined in: [src/core/interval.ts:1164](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1164)

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

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:1457](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1457)

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

---

### overlaps()

> **overlaps**(`other`): `boolean`

Defined in: [src/core/interval.ts:1152](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1152)

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

---

### strictlyContains()

> **strictlyContains**(`value`): `boolean`

Defined in: [src/core/interval.ts:1140](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1140)

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

---

### contains()

> `static` **contains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:793](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L793)

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

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:730](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L730)

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

---

### hasNaN()

> `static` **hasNaN**(`interval`): `boolean`

Defined in: [src/core/interval.ts:862](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L862)

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

---

### isDegenerate()

> `static` **isDegenerate**(`interval`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:767](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L767)

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

---

### isFinite()

> `static` **isFinite**(`interval`): `boolean`

Defined in: [src/core/interval.ts:850](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L850)

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

---

### isSubsetOf()

> `static` **isSubsetOf**(`subset`, `superset`): `boolean`

Defined in: [src/core/interval.ts:838](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L838)

Tests if one interval is a subset of another.

#### Parameters

##### subset

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval that should be contained

##### superset

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval that should contain the subset

#### Returns

`boolean`

True if subset is entirely within superset

#### Remarks

An interval A is a subset of B if A.min >= B.min AND A.max <= B.max.

#### Example

```typescript
Interval.isSubsetOf({ min: 2, max: 8 }, { min: 0, max: 10 }); // true
Interval.isSubsetOf({ min: 0, max: 10 }, { min: 2, max: 8 }); // false
```

#### Since

0.11.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:747](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L747)

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

---

### overlaps()

> `static` **overlaps**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:780](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L780)

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

---

### strictlyContains()

> `static` **strictlyContains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:816](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L816)

Strict containment check (exclusive bounds).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test against

##### value

`number`

Value to test

#### Returns

`boolean`

True if value is strictly inside the interval (min < value < max)

#### Remarks

Unlike [contains](#contains-2), this excludes the boundary values.

#### Example

```typescript
Interval.strictlyContains({ min: 0, max: 10 }, 5); // true
Interval.strictlyContains({ min: 0, max: 10 }, 0); // false (boundary)
Interval.strictlyContains({ min: 0, max: 10 }, 10); // false (boundary)
```

#### Since

0.11.0

## Computed

### expanded

#### Get Signature

> **get** **expanded**(): `Interval`

Defined in: [src/core/interval.ts:1633](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1633)

Returns an expanded interval (by EPSILON) without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New expanded interval

---

### negated

#### Get Signature

> **get** **negated**(): `Interval`

Defined in: [src/core/interval.ts:1622](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1622)

Returns the negated interval without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New negated interval

---

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Interval`

Defined in: [src/core/interval.ts:1644](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1644)

Returns the reciprocal interval without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New reciprocal interval (or throws if contains zero)

---

### squared

#### Get Signature

> **get** **squared**(): `Interval`

Defined in: [src/core/interval.ts:1660](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1660)

Returns the squared interval without modifying this one.

##### Since

0.1.0

##### Returns

`Interval`

New squared interval

---

### center()

> **center**(): `number`

Defined in: [src/core/interval.ts:1086](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1086)

Returns the center of this interval.

#### Returns

`number`

Center ((min + max) / 2)

#### Since

0.1.0

---

### radius()

> **radius**(): `number`

Defined in: [src/core/interval.ts:1097](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1097)

Returns the radius (half-width) of this interval.

#### Returns

`number`

Radius ((max - min) / 2)

#### Since

0.1.0

---

### width()

> **width**(): `number`

Defined in: [src/core/interval.ts:1075](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1075)

Returns the width of this interval.

#### Returns

`number`

Width (max - min)

#### Since

0.1.0

---

### center()

> `static` **center**(`interval`): `number`

Defined in: [src/core/interval.ts:890](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L890)

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

---

### radius()

> `static` **radius**(`interval`): `number`

Defined in: [src/core/interval.ts:902](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L902)

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

---

### width()

> `static` **width**(`interval`): `number`

Defined in: [src/core/interval.ts:878](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L878)

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

Defined in: [src/core/interval.ts:1779](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1779)

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

Defined in: [src/core/interval.ts:170](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L170)

Degrees interval [0, 360].

---

### EPSILON_INTERVAL

> `readonly` `static` **EPSILON_INTERVAL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:156](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L156)

Epsilon interval [-ε, ε].

---

### FULL

> `readonly` `static` **FULL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:148](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L148)

Full real line (-∞, +∞).

---

### NEGATIVE

> `readonly` `static` **NEGATIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:140](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L140)

Negative half-line (-∞, 0].

---

### NORMALIZED

> `readonly` `static` **NORMALIZED**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:182](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L182)

Normalized interval [0, 1] (same as UNIT).

---

### PERCENT

> `readonly` `static` **PERCENT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:164](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L164)

Percentage interval [0, 100].

---

### POSITIVE

> `readonly` `static` **POSITIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:132](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L132)

Positive half-line [0, +∞).

---

### RADIANS

> `readonly` `static` **RADIANS**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:176](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L176)

Radians interval [0, 2π].

---

### SYMMETRIC_UNIT

> `readonly` `static` **SYMMETRIC_UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:126](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L126)

Symmetric unit interval [-1, 1].

---

### UNIT

> `readonly` `static` **UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:120](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L120)

Unit interval [0, 1].

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:114](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L114)

Zero interval [0, 0].

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Interval`

Defined in: [src/core/interval.ts:314](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L314)

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

---

### copy()

> `static` **copy**(`source`, `destination`): `Interval`

Defined in: [src/core/interval.ts:327](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L327)

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

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Interval`

Defined in: [src/core/interval.ts:250](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L250)

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

---

### fromCenterRadius()

> `static` **fromCenterRadius**(`center`, `radius`, `out?`): `Interval`

Defined in: [src/core/interval.ts:225](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L225)

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

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Interval`

Defined in: [src/core/interval.ts:274](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L274)

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

---

### fromValue()

> `static` **fromValue**(`value`, `out?`): `Interval`

Defined in: [src/core/interval.ts:210](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L210)

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

---

### fromValues()

> `static` **fromValues**(`min`, `max`, `out?`): `Interval`

Defined in: [src/core/interval.ts:298](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L298)

Creates an interval from individual min and max values.

#### Parameters

##### min

`number`

Minimum bound

##### max

`number`

Maximum bound

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval from the values

#### Throws

If min > max

#### Example

```typescript
Interval.fromValues(0, 1); // Unit interval [0, 1]
Interval.fromValues(-5, 5); // Symmetric interval [-5, 5]
Interval.fromValues(10, 10); // Degenerate interval [10, 10]
```

#### Since

0.14.0

## Interpolation

### clampValue()

> **clampValue**(`value`): `number`

Defined in: [src/core/interval.ts:1589](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1589)

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

---

### inverseLerp()

> **inverseLerp**(`value`): `number`

Defined in: [src/core/interval.ts:1573](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1573)

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

---

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/interval.ts:1532](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1532)

Linear interpolation towards another interval in place.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Target interval

##### t

`number`

Interpolation factor (not clamped)

#### Returns

`this`

This for chaining

#### Remarks

Interpolates BETWEEN this interval and another interval,
consistent with Vector2.lerp, Complex.lerp, etc.

#### Example

```typescript
const a = new Interval(0, 10);
const b = new Interval(100, 200);
a.lerp(b, 0.5); // a is now [50, 105]
```

#### Since

0.11.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/interval.ts:1547](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1547)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Target interval

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This for chaining

#### Since

0.11.0

---

### lerpInterval()

> **lerpInterval**(`other`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1607](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1607)

Interpolates between two intervals, returning a new interval.

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

Interpolated interval (new instance unless out is provided)

#### Remarks

Unlike [lerp](../../auxiliary/scalar/functions/lerp.md), this method does not mutate `this` and
returns a new interval (or uses the `out` parameter).

#### Since

0.1.0

---

### sample()

> **sample**(`t`): `number`

Defined in: [src/core/interval.ts:1507](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1507)

Samples a value within this interval using linear interpolation.

#### Parameters

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`number`

Value within the interval (min when t=0, max when t=1)

#### Remarks

This method samples a point WITHIN the interval, unlike [lerp](../../auxiliary/scalar/functions/lerp.md)
which interpolates BETWEEN two intervals.

#### Example

```typescript
const interval = new Interval(0, 100);
interval.sample(0); // 0
interval.sample(0.5); // 50
interval.sample(1); // 100
```

#### Since

0.11.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/interval.ts:1560](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1560)

Smooth interpolation towards another interval using smoothStep easing.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Target interval

##### t

`number`

Interpolation factor (clamped to [0, 1])

#### Returns

`this`

This for chaining

#### Since

0.12.0

---

### clampValue()

> `static` **clampValue**(`interval`, `value`): `number`

Defined in: [src/core/interval.ts:710](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L710)

Clamps a value to the interval bounds.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Reference interval.

##### value

`number`

Value to clamp.

#### Returns

`number`

Value clamped to [min, max].

#### Example

```typescript
const interval = new Interval(0, 100);
Interval.clampValue(interval, 50); // 50
Interval.clampValue(interval, -10); // 0
Interval.clampValue(interval, 150); // 100
```

#### Since

0.11.0

---

### inverseLerp()

> `static` **inverseLerp**(`interval`, `value`): `number`

Defined in: [src/core/interval.ts:684](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L684)

Finds where a value falls within an interval, returning normalized position.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Reference interval.

##### value

`number`

Value to find normalized position of.

#### Returns

`number`

Normalized position [0, 1] for values in [min, max], or 0 if interval is degenerate.

#### Remarks

This is the inverse of lerp: `Interval.inverseLerp(interval, Interval.lerp(interval, t)) ≈ t`

#### Example

```typescript
const interval = new Interval(0, 100);
Interval.inverseLerp(interval, 25); // 0.25
Interval.inverseLerp(interval, 75); // 0.75
Interval.inverseLerp(interval, 150); // 1.5 (extrapolated)
```

#### Since

0.11.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:602](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L602)

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

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:622](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L622)

Linear interpolation with t clamped to [0, 1].

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Start interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

End interval

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interpolated interval

#### Since

0.9.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:653](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L653)

Smooth interpolation between two intervals using smoothStep easing.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Source interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Target interval

##### t

`number`

Interpolation factor (clamped to [0, 1])

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Smoothly interpolated interval

#### Remarks

Uses Hermite smoothStep for ease-in-out effect.
Equivalent to `lerp(a, b, smoothStep(0, 1, clamp(t, 0, 1)))`.

#### Example

```typescript
const a = new Interval(0, 10);
const b = new Interval(100, 200);
const smooth = Interval.smoothStep(a, b, 0.5); // Smooth transition
```

#### Since

0.12.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/interval.ts:1032](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1032)

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

---

### set()

> **set**(`minValue`, `maxValue`): `this`

Defined in: [src/core/interval.ts:1015](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1015)

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

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/interval.ts:1047](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1047)

Sets this interval from array values.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array [min, max].

##### offset

`number` = `0`

Starting index (default 0).

#### Returns

`this`

This for chaining.

#### Since

0.14.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/interval.ts:1058](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1058)

Resets this interval to zero [0, 0].

#### Returns

`this`

This for chaining

#### Since

0.9.0

## Other

### max

> **max**: `number`

Defined in: [src/core/interval.ts:78](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L78)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`max`](../../types/interfaces/IntervalLike.md#max)

---

### min

> **min**: `number`

Defined in: [src/core/interval.ts:77](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L77)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`min`](../../types/interfaces/IntervalLike.md#min)

## Serialization

### clone()

> **clone**(): `Interval`

Defined in: [src/core/interval.ts:1763](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1763)

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

---

### toArray()

> **toArray**(): \[`number`, `number`\]

Defined in: [src/core/interval.ts:1688](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1688)

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

---

### toJSON()

> **toJSON**(): [`IntervalLike`](../../types/interfaces/IntervalLike.md)

Defined in: [src/core/interval.ts:1725](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1725)

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

---

### toObject()

> **toObject**(): [`IntervalLike`](../../types/interfaces/IntervalLike.md)

Defined in: [src/core/interval.ts:1706](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1706)

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

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/interval.ts:1745](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1745)

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

Defined in: [src/core/interval.ts:1405](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1405)

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

---

### union()

> **union**(`other`): `this`

Defined in: [src/core/interval.ts:1424](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1424)

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

---

### hull()

> `static` **hull**(`first`, `second?`, ...`rest?`): `Interval`

Defined in: [src/core/interval.ts:920](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L920)

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

---

### intersect()

> `static` **intersect**(`a`, `b`, `out?`): `Interval` \| `undefined`

Defined in: [src/core/interval.ts:988](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L988)

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

---

### union()

> `static` **union**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:970](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L970)

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

Defined in: [src/core/interval.ts:1479](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1479)

Returns true if any bound is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.9.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/interval.ts:1468](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/core/interval.ts#L1468)

Returns true if all bounds are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.9.0
