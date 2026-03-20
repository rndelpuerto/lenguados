# Class: Interval

Defined in: [src/core/interval.ts:95](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L95)

Mutable closed interval with deterministic arithmetic and comparisons.

## Remarks

- **Design:** Closed interval `[min, max]` with `min <= max` invariant. Instance
  methods are mutable and chainable; static methods are pure with alloc-free
  overloads via `out` parameter.
- **Numerics:** Set operations (union, intersection) and arithmetic (add, multiply)
  use interval arithmetic rules. Reciprocal handles sign-crossing intervals.
- **Safety:** "Safe" variants return fallback intervals instead of throwing on
  degenerate inputs (e.g., empty intersection → `ZERO`).

## Example

```typescript
// Static (pure, allocation-controlled)
const merged = Interval.union(a, b);
const overlap = Interval.intersection(a, b);

// Instance (mutable, chainable)
interval.expand(0.1).clamp(bounds);
```

## Since

0.7.0

## Implements

- [`IntervalLike`](../../types/interfaces/IntervalLike.md)

## Constructors

### Constructor

> **new Interval**(`min`, `max`): `Interval`

Defined in: [src/core/interval.ts:229](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L229)

Creates a new Interval with the given bounds.

#### Parameters

##### min

`number` = `0`

Lower bound of the interval.

##### max

`number` = `0`

Upper bound of the interval.

#### Returns

`Interval`

#### Default Value

`0`

#### Default Value

`0`

## Accessor

### expanded

#### Get Signature

> **get** **expanded**(): `Interval`

Defined in: [src/core/interval.ts:2039](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2039)

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

Defined in: [src/core/interval.ts:2028](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2028)

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

Defined in: [src/core/interval.ts:2051](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2051)

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

Defined in: [src/core/interval.ts:2067](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2067)

Returns the squared interval without modifying this one.

##### Since

0.7.0

##### Returns

`Interval`

New squared interval

## Arithmetic

### add()

> **add**(`other`): `this`

Defined in: [src/core/interval.ts:1456](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1456)

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

> **divide**(`scalar`): `this`

Defined in: [src/core/interval.ts:1507](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1507)

Divides this interval by a scalar in place.

#### Parameters

##### scalar

`number`

Scalar to divide by

#### Returns

`this`

This for chaining

#### Throws

If scalar is zero

#### Since

0.7.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/interval.ts:1486](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1486)

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

Defined in: [src/core/interval.ts:1553](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1553)

Negates this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### reciprocal()

> **reciprocal**(): `this`

Defined in: [src/core/interval.ts:1651](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1651)

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

Defined in: [src/core/interval.ts:1672](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1672)

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

Defined in: [src/core/interval.ts:1700](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1700)

Computes the reciprocal of this interval in place without validation (for hot paths).

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Interval must not contain zero.
If interval contains zero, result will contain Infinity/-Infinity or NaN.

#### See

- [reciprocal](#reciprocal-2) - Throws if contains zero
- [reciprocalSafe](#reciprocalsafe-2) - Returns ZERO if contains zero

#### Since

0.7.0

---

### scale()

> **scale**(`scalar`): `this`

Defined in: [src/core/interval.ts:1532](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1532)

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

Defined in: [src/core/interval.ts:1592](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1592)

Computes the square root of this interval in place.

#### Returns

`this`

This for chaining

#### Throws

If interval contains negative values

#### Since

0.7.0

---

### sqrtSafe()

> **sqrtSafe**(): `this`

Defined in: [src/core/interval.ts:1611](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1611)

Computes the square root of this interval in place (safe version).

#### Returns

`this`

This for chaining, set to `[0, 0]` if fully negative; clamps min to 0 if partially negative

#### See

- [sqrt](#sqrt-2) - Throws if contains negative values
- [sqrtUnchecked](#sqrtunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### sqrtUnchecked()

> **sqrtUnchecked**(): `this`

Defined in: [src/core/interval.ts:1637](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1637)

Computes the square root of this interval in place without validation (for hot paths).

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** Interval must be non-negative.
If interval contains negative values, result will contain NaN.

#### See

- [sqrt](#sqrt-2) - Throws if contains negative values
- [sqrtSafe](../../auxiliary/numeric/functions/sqrtSafe.md) - Clamps negatives, never throws

#### Since

0.7.0

---

### square()

> **square**(): `this`

Defined in: [src/core/interval.ts:1568](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1568)

Squares this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/interval.ts:1470](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1470)

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

Defined in: [src/core/interval.ts:432](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L432)

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

Defined in: [src/core/interval.ts:505](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L505)

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

Defined in: [src/core/interval.ts:524](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L524)

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

Defined in: [src/core/interval.ts:554](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L554)

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
- [divideSafe](../../auxiliary/numeric/functions/divideSafe.md) - Returns ZERO on zero scalar

#### Since

0.7.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:464](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L464)

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

Defined in: [src/core/interval.ts:571](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L571)

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

Defined in: [src/core/interval.ts:665](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L665)

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

Defined in: [src/core/interval.ts:685](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L685)

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

Defined in: [src/core/interval.ts:713](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L713)

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

**Precondition:** Interval must not contain zero.
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

Defined in: [src/core/interval.ts:486](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L486)

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

Defined in: [src/core/interval.ts:605](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L605)

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

### sqrtSafe()

> `static` **sqrtSafe**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:624](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L624)

Returns the square root of an interval (safe version).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Square root interval, or `[0, 0]` if fully negative; clamps min to 0 if partially negative

#### See

- [sqrt](#sqrt-2) - Throws if interval contains negative values
- [sqrtUnchecked](#sqrtunchecked-2) - No validation, for hot paths

#### Since

0.7.0

---

### sqrtUnchecked()

> `static` **sqrtUnchecked**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:651](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L651)

Returns the square root of an interval without validation (for hot paths).

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

#### Remarks

**Precondition:** Interval must be non-negative.
If interval contains negative values, result will contain NaN.

Use in performance-critical code where interval validity is guaranteed.

#### See

- [sqrt](#sqrt-2) - Throws if interval contains negative values
- [sqrtSafe](../../auxiliary/numeric/functions/sqrtSafe.md) - Clamps negatives, never throws

#### Since

0.7.0

---

### square()

> `static` **square**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:584](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L584)

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

Defined in: [src/core/interval.ts:446](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L446)

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

### exactEquals()

> **exactEquals**(`other`): `boolean`

Defined in: [src/core/interval.ts:1809](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1809)

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

### hasInfinity()

> **hasInfinity**(): `boolean`

Defined in: [src/core/interval.ts:1882](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1882)

Returns true if any bound is infinite (±Infinity).

#### Returns

`boolean`

True if any ±Infinity value exists

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/interval.ts:1871](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1871)

Returns true if any bound is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.7.0

---

### isDegenerate()

> **isDegenerate**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:1390](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1390)

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

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/core/interval.ts:1837](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1837)

Returns true if all bounds are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:1860](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1860)

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

Defined in: [src/core/interval.ts:1848](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1848)

Tests if this interval is exactly [0, 0].

#### Returns

`boolean`

True if both bounds are exactly zero

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:1826](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1826)

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

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.

#### Default Value

`EPSILON`

#### Since

0.7.0

---

### exactEquals()

> `static` **exactEquals**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:883](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L883)

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

Defined in: [src/core/interval.ts:1067](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1067)

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

Defined in: [src/core/interval.ts:1051](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1051)

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

Defined in: [src/core/interval.ts:922](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L922)

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

Defined in: [src/core/interval.ts:1014](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1014)

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

Defined in: [src/core/interval.ts:1039](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1039)

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

### isZero()

> `static` **isZero**(`interval`): `boolean`

Defined in: [src/core/interval.ts:1026](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1026)

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

Defined in: [src/core/interval.ts:901](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L901)

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

#### Remarks

Uses relative tolerance: `|a - b| <= epsilon * max(1, |a|, |b|)` per bound.

#### Default Value

`EPSILON`

#### Since

0.7.0

## Computed

### center()

> **center**(): `number`

Defined in: [src/core/interval.ts:1359](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1359)

Returns the center of this interval.

#### Returns

`number`

Center ((min + max) / 2)

#### Since

0.7.0

---

### radius()

> **radius**(): `number`

Defined in: [src/core/interval.ts:1370](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1370)

Returns the radius (half-width) of this interval.

#### Returns

`number`

Radius ((max - min) / 2)

#### Since

0.7.0

---

### width()

> **width**(): `number`

Defined in: [src/core/interval.ts:1348](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1348)

Returns the width of this interval.

#### Returns

`number`

Width (max - min)

#### Since

0.7.0

---

### center()

> `static` **center**(`interval`): `number`

Defined in: [src/core/interval.ts:1098](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1098)

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

Defined in: [src/core/interval.ts:1110](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1110)

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

Defined in: [src/core/interval.ts:1086](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1086)

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

### DEGREES

> `readonly` `static` **DEGREES**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:210](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L210)

Degrees interval [0, 360].

#### Since

0.7.0

---

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/interval.ts:146](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L146)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### EPSILON_INTERVAL

> `readonly` `static` **EPSILON_INTERVAL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:194](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L194)

Epsilon interval [-ε, ε].

#### Since

0.7.0

---

### FULL

> `readonly` `static` **FULL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:185](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L185)

Full real line (-∞, +∞).

#### Since

0.7.0

---

### NEGATIVE

> `readonly` `static` **NEGATIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:176](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L176)

Negative half-line (-∞, 0].

#### Since

0.7.0

---

### PERCENT

> `readonly` `static` **PERCENT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:203](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L203)

Percentage interval [0, 100].

#### Since

0.7.0

---

### POSITIVE

> `readonly` `static` **POSITIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:167](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L167)

Positive half-line [0, +∞).

#### Since

0.7.0

---

### RADIANS

> `readonly` `static` **RADIANS**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:217](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L217)

Radians interval [0, 2π].

#### Since

0.7.0

---

### SYMMETRIC_UNIT

> `readonly` `static` **SYMMETRIC_UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:160](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L160)

Symmetric unit interval [-1, 1].

#### Since

0.7.0

---

### UNIT

> `readonly` `static` **UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:153](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L153)

Unit interval [0, 1].

#### Since

0.7.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:139](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L139)

Zero interval [0, 0].

#### Since

0.7.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/interval.ts:2201](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2201)

Iterator for array destructuring.

#### Returns

`IterableIterator`\<`number`\>

Iterator yielding min then max

#### Example

```typescript
const [min, max] = new Interval(0, 10);
```

#### Since

0.7.0

---

### clone()

> **clone**(): `Interval`

Defined in: [src/core/interval.ts:2185](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2185)

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

Defined in: [src/core/interval.ts:2102](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2102)

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

Defined in: [src/core/interval.ts:2147](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2147)

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

Defined in: [src/core/interval.ts:2128](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2128)

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

Defined in: [src/core/interval.ts:2167](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2167)

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

## Factory

### clone()

> `static` **clone**(`source`, `out?`): `Interval`

Defined in: [src/core/interval.ts:394](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L394)

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

#### Example

```typescript
const original = Interval.fromValues(2, 8);
const cloned = Interval.clone(original); // → [2, 8], new instance
const out = new Interval();
Interval.clone(original, out); // → [2, 8], reuses out
```

#### Since

0.7.0

---

### copy()

> `static` **copy**(`source`, `destination`): `Interval`

Defined in: [src/core/interval.ts:414](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L414)

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

#### Example

```typescript
const src = Interval.fromValues(1, 9);
const dst = new Interval();
Interval.copy(src, dst); // dst → [1, 9], mutates dst in place
```

#### Since

0.7.0

---

### fromArray()

> `static` **fromArray**(`array`, `offset`, `out?`): `Interval`

Defined in: [src/core/interval.ts:315](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L315)

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

#### Example

```typescript
const iv = Interval.fromArray([1, 5]); // → [1, 5]
Interval.fromArray([0, 0, 3, 7], 2); // → [3, 7], offset = 2
const out = new Interval();
Interval.fromArray([2, 8], 0, out); // → [2, 8], reuses out
```

#### Since

0.7.0

---

### fromCenterRadius()

> `static` **fromCenterRadius**(`center`, `radius`, `out?`): `Interval`

Defined in: [src/core/interval.ts:281](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L281)

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

#### Example

```typescript
const iv = Interval.fromCenterRadius(5, 3); // → [2, 8]
const out = new Interval();
Interval.fromCenterRadius(0, 10, out); // → [-10, 10], reuses out
```

#### Since

0.7.0

---

### fromObject()

> `static` **fromObject**(`object`, `out?`): `Interval`

Defined in: [src/core/interval.ts:346](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L346)

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

#### Example

```typescript
const iv = Interval.fromObject({ min: 0, max: 10 }); // → [0, 10]
const out = new Interval();
Interval.fromObject({ min: -1, max: 1 }, out); // → [-1, 1], reuses out
```

#### Since

0.7.0

---

### fromValue()

> `static` **fromValue**(`value`, `out?`): `Interval`

Defined in: [src/core/interval.ts:258](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L258)

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

#### Example

```typescript
const iv = Interval.fromValue(5); // → [5, 5]
const out = new Interval();
Interval.fromValue(3, out); // → [3, 3], reuses out
```

#### Since

0.7.0

---

### fromValues()

> `static` **fromValues**(`min`, `max`, `out?`): `Interval`

Defined in: [src/core/interval.ts:370](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L370)

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

Defined in: [src/core/interval.ts:1994](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1994)

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

Defined in: [src/core/interval.ts:1978](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1978)

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

Defined in: [src/core/interval.ts:1937](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1937)

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

Defined in: [src/core/interval.ts:1952](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1952)

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

Defined in: [src/core/interval.ts:2013](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L2013)

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

Defined in: [src/core/interval.ts:1911](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1911)

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

Defined in: [src/core/interval.ts:1965](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1965)

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

Defined in: [src/core/interval.ts:862](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L862)

Clamps a value to the interval bounds.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Reference interval

##### value

`number`

Value to clamp

#### Returns

`number`

Value clamped to [min, max]

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

Defined in: [src/core/interval.ts:836](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L836)

Finds where a value falls within an interval, returning normalized position.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Reference interval

##### value

`number`

Value to find normalized position of

#### Returns

`number`

Normalized position [0, 1] for values in [min, max], or 0 if interval is degenerate

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

Defined in: [src/core/interval.ts:734](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L734)

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

Defined in: [src/core/interval.ts:773](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L773)

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

### sample()

> `static` **sample**(`interval`, `t`): `number`

Defined in: [src/core/interval.ts:757](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L757)

Samples a value within an interval using linear interpolation.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to sample

##### t

`number`

Interpolation factor [0, 1], clamped

#### Returns

`number`

Value within the interval (min when t=0, max when t=1)

#### Remarks

Samples a point WITHIN the interval, unlike [lerp](../../auxiliary/scalar/functions/lerp.md)
which interpolates BETWEEN two intervals.

#### Since

0.7.0

---

### smoothStep()

> `static` **smoothStep**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:805](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L805)

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

Defined in: [src/core/interval.ts:1305](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1305)

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

Defined in: [src/core/interval.ts:1288](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1288)

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

Defined in: [src/core/interval.ts:1320](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1320)

Sets this interval from array values.

#### Parameters

##### array

`ArrayLike`\<`number`\>

Source array [min, max]

##### offset

`number` = `0`

Starting index (default 0)

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### zero()

> **zero**(): `this`

Defined in: [src/core/interval.ts:1331](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1331)

Resets this interval to zero [0, 0].

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### max

> **max**: `number`

Defined in: [src/core/interval.ts:101](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L101)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`max`](../../types/interfaces/IntervalLike.md#max)

---

### min

> **min**: `number`

Defined in: [src/core/interval.ts:100](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L100)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`min`](../../types/interfaces/IntervalLike.md#min)

## Set Operations

### contains()

> **contains**(`value`): `boolean`

Defined in: [src/core/interval.ts:1404](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1404)

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

### expand()

> **expand**(`delta`): `this`

Defined in: [src/core/interval.ts:1761](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1761)

Expands this interval symmetrically by a delta.

#### Parameters

##### delta

`number`

Amount to expand each side (must be non-negative)

#### Returns

`this`

This for chaining

#### Throws

If delta is negative

#### Since

0.8.0

---

### intersect()

> **intersect**(`other`): `Interval` \| `undefined`

Defined in: [src/core/interval.ts:1727](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1727)

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

### isSubsetOf()

> **isSubsetOf**(`other`): `boolean`

Defined in: [src/core/interval.ts:1440](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1440)

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

### overlaps()

> **overlaps**(`other`): `boolean`

Defined in: [src/core/interval.ts:1428](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1428)

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

### shrink()

> **shrink**(`delta`): `this`

Defined in: [src/core/interval.ts:1780](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1780)

Shrinks this interval symmetrically by a delta.
If delta exceeds half the width, collapses to the midpoint.

#### Parameters

##### delta

`number`

Amount to shrink each side (must be non-negative)

#### Returns

`this`

This for chaining

#### Throws

If delta is negative

#### Since

0.8.0

---

### strictlyContains()

> **strictlyContains**(`value`): `boolean`

Defined in: [src/core/interval.ts:1416](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1416)

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

### union()

> **union**(`other`): `this`

Defined in: [src/core/interval.ts:1746](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1746)

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

### contains()

> `static` **contains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:955](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L955)

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

### expand()

> `static` **expand**(`interval`, `delta`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1242](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1242)

Expands an interval symmetrically by a delta.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Source interval

##### delta

`number`

Amount to expand each side (must be non-negative)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Expanded interval [min - delta, max + delta]

#### Throws

If delta is negative

#### Since

0.8.0

---

### hull()

> `static` **hull**(`first`, `second?`, ...`rest?`): `Interval`

Defined in: [src/core/interval.ts:1134](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1134)

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

#### Remarks

Supports two calling conventions:

- **Array form**: `hull([a, b, c], out?)` — `second` serves as optional output parameter
- **Varargs form**: `hull(a, b, c, ...)` — `second` is another value to include in the hull

#### Since

0.7.0

---

### intersect()

> `static` **intersect**(`a`, `b`, `out?`): `Interval` \| `undefined`

Defined in: [src/core/interval.ts:1218](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1218)

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

### isSubsetOf()

> `static` **isSubsetOf**(`subset`, `superset`): `boolean`

Defined in: [src/core/interval.ts:1002](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1002)

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

### overlaps()

> `static` **overlaps**(`a`, `b`): `boolean`

Defined in: [src/core/interval.ts:942](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L942)

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

### shrink()

> `static` **shrink**(`interval`, `delta`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1261](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1261)

Shrinks an interval symmetrically by a delta.
If delta exceeds half the interval width, returns the midpoint as a degenerate interval.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Source interval

##### delta

`number`

Amount to shrink each side (must be non-negative)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Shrunk interval, or degenerate midpoint interval if fully collapsed

#### Throws

If delta is negative

#### Since

0.8.0

---

### strictlyContains()

> `static` **strictlyContains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:979](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L979)

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

---

### union()

> `static` **union**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1191](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/core/interval.ts#L1191)

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
