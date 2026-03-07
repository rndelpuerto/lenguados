# Class: Interval

Defined in: [src/core/interval.ts:72](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L72)

Mutable closed interval with deterministic arithmetic and comparisons.

## Remarks

Interval bounds satisfy `min <= max` after construction and validation.

## Since

0.7.0

## Implements

- [`IntervalLike`](../../types/interfaces/IntervalLike.md)

## Constructors

### Constructor

> **new Interval**(`min`, `max`): `Interval`

Defined in: [src/core/interval.ts:195](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L195)

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

Defined in: [src/core/interval.ts:1254](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1254)

Adds another interval to this one in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### divide()

> **divide**(`other`): `this`

Defined in: [src/core/interval.ts:1305](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1305)

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

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/interval.ts:1284](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1284)

Multiplies with another interval in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### negate()

> **negate**(): `this`

Defined in: [src/core/interval.ts:1349](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1349)

Negates this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### reciprocal()

> **reciprocal**(): `this`

Defined in: [src/core/interval.ts:1405](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1405)

Computes the reciprocal of this interval in place.

#### Returns

`this`

This for chaining

#### Throws

If interval contains zero

#### Since

0.7.0

---

### reciprocalSafe()

> **reciprocalSafe**(): `this`

Defined in: [src/core/interval.ts:1426](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1426)

Computes the reciprocal of this interval in place (safe version).

#### Returns

`this`

This for chaining, set to ZERO if interval contains zero

#### See

- [reciprocal](#reciprocal-2) - Throws if contains zero
- [reciprocalUnchecked](#reciprocalunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### reciprocalUnchecked()

> **reciprocalUnchecked**(): `this`

Defined in: [src/core/interval.ts:1453](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1453)

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

0.7.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/interval.ts:1328](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1328)

Scales this interval by a scalar in place.

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

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/interval.ts:1388](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1388)

Computes the square root of this interval in place.

#### Returns

`this`

This for chaining

#### Throws

If interval contains negative values

#### Since

0.7.0

---

### square()

> **square**(): `this`

Defined in: [src/core/interval.ts:1364](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1364)

Squares this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/interval.ts:1268](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1268)

Subtracts another interval from this one in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Interval to subtract

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:354](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L354)

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

0.7.0

---

### divide()

> `static` **divide**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:427](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L427)

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

0.7.0

---

### divideSafe()

> `static` **divideSafe**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:446](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L446)

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

0.7.0

---

### divideUnchecked()

> `static` **divideUnchecked**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:475](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L475)

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

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:386](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L386)

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

0.7.0

---

### negate()

> `static` **negate**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:492](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L492)

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

0.7.0

---

### reciprocal()

> `static` **reciprocal**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:543](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L543)

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

0.7.0

---

### reciprocalSafe()

> `static` **reciprocalSafe**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:563](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L563)

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

0.7.0

---

### reciprocalUnchecked()

> `static` **reciprocalUnchecked**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:590](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L590)

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

0.7.0

---

### scale()

> `static` **scale**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:408](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L408)

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

0.7.0

---

### sqrt()

> `static` **sqrt**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:526](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L526)

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

0.7.0

---

### square()

> `static` **square**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:505](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L505)

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

0.7.0

---

### subtract()

> `static` **subtract**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:368](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L368)

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

0.7.0

## Comparison

### contains()

> **contains**(`value`): `boolean`

Defined in: [src/core/interval.ts:1202](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1202)

Tests if this interval contains a value.

#### Parameters

##### value

`number`

Value to test

#### Returns

`boolean`

True if value is within interval

#### Since

0.7.0

---

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/interval.ts:1515](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1515)

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

0.7.0

---

### isDegenerate()

> **isDegenerate**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:1190](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1190)

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

0.7.0

---

### isSubsetOf()

> **isSubsetOf**(`other`): `boolean`

Defined in: [src/core/interval.ts:1238](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1238)

Tests if this interval is a subset of another.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Other interval

#### Returns

`boolean`

True if this is contained in other

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:1531](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1531)

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

0.7.0

---

### overlaps()

> **overlaps**(`other`): `boolean`

Defined in: [src/core/interval.ts:1226](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1226)

Tests if this interval overlaps another.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Other interval

#### Returns

`boolean`

True if intervals overlap

#### Since

0.7.0

---

### strictlyContains()

> **strictlyContains**(`value`): `boolean`

Defined in: [src/core/interval.ts:1214](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1214)

Tests if this interval strictly contains a value (exclusive bounds).

#### Parameters

##### value

`number`

Value to test

#### Returns

`boolean`

True if value is strictly within interval

#### Since

0.7.0

---

### contains()

> `static` **contains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:809](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L809)

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

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:739](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L739)

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

0.7.0

---

### hasInfinity()

> `static` **hasInfinity**(`interval`): `boolean`

Defined in: [src/core/interval.ts:918](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L918)

Tests if any bound is infinite (±Infinity).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

#### Returns

`boolean`

True if any bound is ±Infinity

#### Remarks

Distinguishes infinity from NaN. Use [isFinite](#isfinite-2) to check for both.

#### Since

0.7.0

---

### hasNaN()

> `static` **hasNaN**(`interval`): `boolean`

Defined in: [src/core/interval.ts:903](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L903)

Tests if any bound is NaN.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

#### Returns

`boolean`

True if any bound is NaN

#### Since

0.7.0

---

### isDegenerate()

> `static` **isDegenerate**(`interval`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:776](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L776)

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

0.7.0

---

### isFinite()

> `static` **isFinite**(`interval`): `boolean`

Defined in: [src/core/interval.ts:866](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L866)

Tests if both bounds are finite numbers.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

#### Returns

`boolean`

True if both bounds are finite

#### Since

0.7.0

---

### isNearZero()

> `static` **isNearZero**(`interval`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:891](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L891)

Tests if both bounds are near zero.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

True if both bounds are within epsilon of zero

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### isSubsetOf()

> `static` **isSubsetOf**(`subset`, `superset`): `boolean`

Defined in: [src/core/interval.ts:854](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L854)

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

0.7.0

---

### isZero()

> `static` **isZero**(`interval`): `boolean`

Defined in: [src/core/interval.ts:878](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L878)

Tests if both bounds are exactly zero.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to test

#### Returns

`boolean`

True if min = 0 and max = 0

#### Since

0.7.0

---

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:756](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L756)

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

0.7.0

---

### overlaps()

> `static` **overlaps**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:796](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L796)

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

#### Example

```typescript
const a = new Interval(0, 5);
const b = new Interval(3, 8);
Interval.overlaps(a, b); // true - they share [3, 5]
```

#### Since

0.7.0

---

### strictlyContains()

> `static` **strictlyContains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:832](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L832)

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

0.7.0

## Computed

### expanded

#### Get Signature

> **get** **expanded**(): `Interval`

Defined in: [src/core/interval.ts:1741](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1741)

Returns an expanded interval (by EPSILON) without modifying this one.

##### Since

0.7.0

##### Returns

`Interval`

New expanded interval

---

### negated

#### Get Signature

> **get** **negated**(): `Interval`

Defined in: [src/core/interval.ts:1730](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1730)

Returns the negated interval without modifying this one.

##### Since

0.7.0

##### Returns

`Interval`

New negated interval

---

### reciprocated

#### Get Signature

> **get** **reciprocated**(): `Interval`

Defined in: [src/core/interval.ts:1753](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1753)

Returns the reciprocal interval without modifying this one.

##### Throws

If interval contains zero

##### Since

0.7.0

##### Returns

`Interval`

New reciprocal interval

---

### squared

#### Get Signature

> **get** **squared**(): `Interval`

Defined in: [src/core/interval.ts:1769](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1769)

Returns the squared interval without modifying this one.

##### Since

0.7.0

##### Returns

`Interval`

New squared interval

---

### center()

> **center**(): `number`

Defined in: [src/core/interval.ts:1160](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1160)

Returns the center of this interval.

#### Returns

`number`

Center ((min + max) / 2)

#### Since

0.7.0

---

### radius()

> **radius**(): `number`

Defined in: [src/core/interval.ts:1171](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1171)

Returns the radius (half-width) of this interval.

#### Returns

`number`

Radius ((max - min) / 2)

#### Since

0.7.0

---

### width()

> **width**(): `number`

Defined in: [src/core/interval.ts:1149](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1149)

Returns the width of this interval.

#### Returns

`number`

Width (max - min)

#### Since

0.7.0

---

### center()

> `static` **center**(`interval`): `number`

Defined in: [src/core/interval.ts:949](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L949)

Returns the center of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Center ((min + max) / 2)

#### Since

0.7.0

---

### radius()

> `static` **radius**(`interval`): `number`

Defined in: [src/core/interval.ts:961](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L961)

Returns the radius (half-width) of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Radius ((max - min) / 2)

#### Since

0.7.0

---

### width()

> `static` **width**(`interval`): `number`

Defined in: [src/core/interval.ts:937](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L937)

Returns the width of an interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

#### Returns

`number`

Width (max - min)

#### Since

0.7.0

## Constant

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/interval.ts:121](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L121)

Number of elements when serialized to an array.

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/interval.ts:1903](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1903)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding min then max.

#### Example

```typescript
const [min, max] = new Interval(0, 10);
```

#### Since

0.7.0

## Core

### DEGREES

> `readonly` `static` **DEGREES**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:177](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L177)

Degrees interval [0, 360].

---

### EPSILON_INTERVAL

> `readonly` `static` **EPSILON_INTERVAL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:163](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L163)

Epsilon interval [-ε, ε].

---

### FULL

> `readonly` `static` **FULL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:155](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L155)

Full real line (-∞, +∞).

---

### NEGATIVE

> `readonly` `static` **NEGATIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:147](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L147)

Negative half-line (-∞, 0].

---

### NORMALIZED

> `readonly` `static` **NORMALIZED**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:189](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L189)

Normalized interval [0, 1] (same as UNIT).

---

### PERCENT

> `readonly` `static` **PERCENT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:171](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L171)

Percentage interval [0, 100].

---

### POSITIVE

> `readonly` `static` **POSITIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:139](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L139)

Positive half-line [0, +∞).

---

### RADIANS

> `readonly` `static` **RADIANS**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:183](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L183)

Radians interval [0, 2π].

---

### SYMMETRIC_UNIT

> `readonly` `static` **SYMMETRIC_UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:133](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L133)

Symmetric unit interval [-1, 1].

---

### UNIT

> `readonly` `static` **UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:127](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L127)

Unit interval [0, 1].

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:114](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L114)

Zero interval [0, 0].

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Interval`

Defined in: [src/core/interval.ts:323](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L323)

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

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Interval`

Defined in: [src/core/interval.ts:336](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L336)

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

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Interval`

Defined in: [src/core/interval.ts:259](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L259)

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

#### Throws

If offset is out of bounds

#### Since

0.7.0

---

### fromCenterRadius()

> `static` **fromCenterRadius**(`center`, `radius`, `out?`): `Interval`

Defined in: [src/core/interval.ts:233](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L233)

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

#### Throws

If radius is negative

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Interval`

Defined in: [src/core/interval.ts:283](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L283)

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

0.7.0

---

### fromValue()

> `static` **fromValue**(`value`, `out?`): `Interval`

Defined in: [src/core/interval.ts:217](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L217)

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

0.7.0

---

### fromValues()

> `static` **fromValues**(`min`, `max`, `out?`): `Interval`

Defined in: [src/core/interval.ts:307](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L307)

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

0.7.0

## Interpolation

### clampValue()

> **clampValue**(`value`): `number`

Defined in: [src/core/interval.ts:1697](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1697)

Clamps a value to this interval.

#### Parameters

##### value

`number`

Value to clamp

#### Returns

`number`

Clamped value

#### Since

0.7.0

---

### inverseLerp()

> **inverseLerp**(`value`): `number`

Defined in: [src/core/interval.ts:1681](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1681)

Returns the inverse lerp (normalized position of value in interval).

#### Parameters

##### value

`number`

Value to find position of

#### Returns

`number`

Normalized position [0, 1] (or 0 if degenerate)

#### Since

0.7.0

---

### lerp()

> **lerp**(`other`, `t`): `this`

Defined in: [src/core/interval.ts:1640](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1640)

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

0.7.0

---

### lerpClamped()

> **lerpClamped**(`other`, `t`): `this`

Defined in: [src/core/interval.ts:1655](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1655)

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

0.7.0

---

### lerpInterval()

> **lerpInterval**(`other`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1715](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1715)

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

0.7.0

---

### sample()

> **sample**(`t`): `number`

Defined in: [src/core/interval.ts:1615](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1615)

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

0.7.0

---

### smoothStep()

> **smoothStep**(`other`, `t`): `this`

Defined in: [src/core/interval.ts:1668](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1668)

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

0.7.0

---

### clampValue()

> `static` **clampValue**(`interval`, `value`): `number`

Defined in: [src/core/interval.ts:719](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L719)

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

0.7.0

---

### inverseLerp()

> `static` **inverseLerp**(`interval`, `value`): `number`

Defined in: [src/core/interval.ts:693](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L693)

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

0.7.0

---

### lerp()

> `static` **lerp**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:611](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L611)

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

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:631](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L631)

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

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:662](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L662)

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

0.7.0

## Mutator

### copy()

> **copy**(`other`): `this`

Defined in: [src/core/interval.ts:1106](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1106)

Copies values from another interval.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Source interval

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### set()

> **set**(`minValue`, `maxValue`): `this`

Defined in: [src/core/interval.ts:1089](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1089)

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

0.7.0

---

### setFromArray()

> **setFromArray**(`array`, `offset`): `this`

Defined in: [src/core/interval.ts:1121](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1121)

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

0.7.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/interval.ts:1132](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1132)

Resets this interval to zero [0, 0].

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### max

> **max**: `number`

Defined in: [src/core/interval.ts:78](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L78)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`max`](../../types/interfaces/IntervalLike.md#max)

---

### min

> **min**: `number`

Defined in: [src/core/interval.ts:77](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L77)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`min`](../../types/interfaces/IntervalLike.md#min)

## Serialization

### clone()

> **clone**(): `Interval`

Defined in: [src/core/interval.ts:1887](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1887)

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

0.7.0

---

### toArray()

> **toArray**\<`T`\>(`out?`, `offset?`): \[`number`, `number`\] \| `T`

Defined in: [src/core/interval.ts:1804](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1804)

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
const i = new Interval(0, 10);
const [min, max] = i.toArray();

// Write to existing array
const arr = new Float32Array(10);
i.toArray(arr, 4); // writes at indices 4, 5
```

#### Since

0.7.0

---

### toJSON()

> **toJSON**(): [`IntervalLike`](../../types/interfaces/IntervalLike.md)

Defined in: [src/core/interval.ts:1849](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1849)

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

0.7.0

---

### toObject()

> **toObject**(): [`IntervalLike`](../../types/interfaces/IntervalLike.md)

Defined in: [src/core/interval.ts:1830](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1830)

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

0.7.0

---

### toString()

> **toString**(`precision`): `string`

Defined in: [src/core/interval.ts:1869](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1869)

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

0.7.0

## Set Operations

### intersect()

> **intersect**(`other`): `Interval` \| `undefined`

Defined in: [src/core/interval.ts:1479](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1479)

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

0.7.0

---

### union()

> **union**(`other`): `this`

Defined in: [src/core/interval.ts:1498](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1498)

Unions with another interval in place.

#### Parameters

##### other

[`ReadonlyInterval`](../type-aliases/ReadonlyInterval.md)

Other interval

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### hull()

> `static` **hull**(`first`, `second?`, ...`rest?`): `Interval`

Defined in: [src/core/interval.ts:979](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L979)

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

0.7.0

---

### intersect()

> `static` **intersect**(`a`, `b`, `out?`): `Interval` \| `undefined`

Defined in: [src/core/interval.ts:1062](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1062)

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

#### Example

```typescript
const a = new Interval(0, 5);
const b = new Interval(3, 8);
Interval.intersect(a, b); // [3, 5] - common region
Interval.intersect(new Interval(0, 2), new Interval(5, 8)); // undefined
```

#### Since

0.7.0

---

### union()

> `static` **union**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1036](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1036)

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

#### Example

```typescript
const a = new Interval(0, 3);
const b = new Interval(5, 8);
Interval.union(a, b); // [0, 8] - spans both intervals
```

#### Since

0.7.0

## Validation

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/interval.ts:1587](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1587)

Returns true if any bound is infinite (±Infinity).

#### Returns

`boolean`

True if any ±Infinity value exists

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/interval.ts:1576](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1576)

Returns true if any bound is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.7.0

---

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/interval.ts:1542](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1542)

Returns true if all bounds are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:1565](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1565)

Tests if this interval is near zero.

#### Parameters

##### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

#### Returns

`boolean`

True if both bounds are within epsilon of zero

#### Since

0.7.0

---

### isZero()

> **isZero**(): `boolean`

Defined in: [src/core/interval.ts:1553](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/core/interval.ts#L1553)

Tests if this interval is exactly [0, 0].

#### Returns

`boolean`

True if both bounds are exactly zero

#### Since

0.7.0
