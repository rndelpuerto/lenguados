# Class: Interval

Defined in: [src/core/interval.ts:100](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L100)

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

Defined in: [src/core/interval.ts:241](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L241)

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

Defined in: [src/core/interval.ts:2547](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2547)

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

Defined in: [src/core/interval.ts:2536](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2536)

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

Defined in: [src/core/interval.ts:2559](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2559)

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

Defined in: [src/core/interval.ts:2575](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2575)

Returns the squared interval without modifying this one.

##### Since

0.7.0

##### Returns

`Interval`

New squared interval

## Arithmetic

### abs()

> **abs**(): `this`

Defined in: [src/core/interval.ts:2007](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2007)

Takes the absolute value of this interval in place (Moore's definition).

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### add()

> **add**(`other`): `this`

Defined in: [src/core/interval.ts:1839](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1839)

Adds another interval to this one in place.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to add

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### divideScalar()

> **divideScalar**(`scalar`): `this`

Defined in: [src/core/interval.ts:1888](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1888)

Divides this interval's bounds by a scalar in place.

#### Parameters

##### scalar

`number`

Scalar divisor

#### Returns

`this`

This for chaining

#### Throws

If scalar is zero

#### Since

0.7.0

---

### divideScalarSafe()

> **divideScalarSafe**(`scalar`): `this`

Defined in: [src/core/interval.ts:1915](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1915)

Divides this interval's bounds by a scalar in place, returning [0, 0] on zero scalar.

#### Parameters

##### scalar

`number`

Scalar divisor

#### Returns

`this`

This for chaining

#### See

[divideScalar](#dividescalar-2) - Throws on zero

#### Since

0.9.0

---

### divideScalarUnchecked()

> **divideScalarUnchecked**(`scalar`): `this`

Defined in: [src/core/interval.ts:1949](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1949)

Divides this interval's bounds by a scalar in place without validation.

#### Parameters

##### scalar

`number`

Scalar divisor (must be non-zero)

#### Returns

`this`

This for chaining

#### Remarks

**Precondition:** `scalar ≠ 0`. Calling with zero produces Infinity/NaN.

#### See

- [divideScalar](#dividescalar-2) - Throws on zero
- [divideScalarSafe](#dividescalarsafe-2) - Returns [0,0] on zero

#### Since

0.9.0

---

### mod()

> **mod**(`other`): `this`

Defined in: [src/core/interval.ts:1821](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1821)

Component-wise modulo.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Divisor interval

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### multiply()

> **multiply**(`other`): `this`

Defined in: [src/core/interval.ts:1869](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1869)

Multiplies with another interval in place.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to multiply by

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### multiplyScalar()

> **multiplyScalar**(`scalar`): `this`

Defined in: [src/core/interval.ts:1971](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1971)

Multiplies this interval's bounds by a scalar in place.

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

Defined in: [src/core/interval.ts:1992](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1992)

Negates this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### reciprocal()

> **reciprocal**(): `this`

Defined in: [src/core/interval.ts:2113](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2113)

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

Defined in: [src/core/interval.ts:2134](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2134)

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

Defined in: [src/core/interval.ts:2162](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2162)

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

### sqrt()

> **sqrt**(): `this`

Defined in: [src/core/interval.ts:2054](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2054)

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

Defined in: [src/core/interval.ts:2073](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2073)

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

Defined in: [src/core/interval.ts:2099](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2099)

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

Defined in: [src/core/interval.ts:2030](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2030)

Squares this interval in place.

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### subtract()

> **subtract**(`other`): `this`

Defined in: [src/core/interval.ts:1853](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1853)

Subtracts another interval from this one in place.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to subtract

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### abs()

> `static` **abs**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:639](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L639)

Returns the absolute value of an interval (Moore's definition).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Interval to take absolute value of

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval of absolute values

#### Remarks

Three cases:

- All positive (`min ≥ 0`): result is `[min, max]`
- Crosses zero (`min < 0 < max`): result is `[0, max(|min|, max)]`
- All negative (`max ≤ 0`): result is `[|max|, |min|]`

#### Example

```typescript
Interval.abs({ min: 2, max: 5 }); // → [2, 5]
Interval.abs({ min: -3, max: 5 }); // → [0, 5]
Interval.abs({ min: -5, max: -2 }); // → [2, 5]
```

#### Since

0.8.0

---

### add()

> `static` **add**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:465](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L465)

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

### divideScalar()

> `static` **divideScalar**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:542](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L542)

Divides an interval's bounds by a scalar.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### scalar

`number`

Scalar divisor (must not be zero)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with bounds divided by scalar

#### Throws

If scalar is zero

#### Since

0.7.0

---

### divideScalarSafe()

> `static` **divideScalarSafe**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:565](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L565)

Divides an interval's bounds by a scalar (safe version).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### scalar

`number`

Scalar divisor

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with bounds divided by scalar, or ZERO if scalar is zero

#### See

[divideScalar](#dividescalar-2) - Throws on zero scalar

#### Since

0.7.0

---

### divideScalarUnchecked()

> `static` **divideScalarUnchecked**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:595](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L595)

Divides an interval's bounds by a scalar without validation (for hot paths).

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### scalar

`number`

Scalar divisor (must not be zero)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with bounds divided by scalar

#### Remarks

**WARNING:** This method performs no validation.

- If scalar is zero, the result will contain Infinity/-Infinity or NaN.
- Use only when you can guarantee non-zero scalar.

#### See

- [divideScalar](#dividescalar-2) - Throws on zero scalar
- [divideScalarSafe](#dividescalarsafe-2) - Returns ZERO on zero scalar

#### Since

0.7.0

---

### mod()

> `static` **mod**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:944](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L944)

Component-wise modulo of two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Dividend interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Divisor interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with per-bound remainder

#### Remarks

This is component-wise modulo (applied to min and max independently), NOT
interval-theoretic modulo. The result may not enclose all possible modulo
values of points within the interval.

#### Since

0.8.0

---

### multiply()

> `static` **multiply**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:497](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L497)

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

### multiplyScalar()

> `static` **multiplyScalar**(`interval`, `scalar`, `out?`): `Interval`

Defined in: [src/core/interval.ts:519](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L519)

Multiplies an interval's bounds by a scalar.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### scalar

`number`

Scalar multiplier

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with bounds multiplied by scalar

#### Since

0.7.0

---

### negate()

> `static` **negate**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:612](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L612)

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

Defined in: [src/core/interval.ts:745](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L745)

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

Defined in: [src/core/interval.ts:768](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L768)

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

Defined in: [src/core/interval.ts:799](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L799)

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

### sqrt()

> `static` **sqrt**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:685](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L685)

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

Defined in: [src/core/interval.ts:704](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L704)

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

Defined in: [src/core/interval.ts:731](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L731)

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

Defined in: [src/core/interval.ts:658](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L658)

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

Defined in: [src/core/interval.ts:479](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L479)

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

Defined in: [src/core/interval.ts:2317](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2317)

Exact equality (bit-identical).

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

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

Defined in: [src/core/interval.ts:2390](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2390)

Returns true if any bound is infinite (±Infinity).

#### Returns

`boolean`

True if any ±Infinity value exists

#### Since

0.7.0

---

### hasNaN()

> **hasNaN**(): `boolean`

Defined in: [src/core/interval.ts:2379](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2379)

Returns true if any bound is NaN.

#### Returns

`boolean`

True if any NaN value exists

#### Since

0.7.0

---

### isDegenerate()

> **isDegenerate**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:1682](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1682)

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

Defined in: [src/core/interval.ts:2345](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2345)

Returns true if all bounds are finite.

#### Returns

`boolean`

True if no NaN or Infinity values

#### Since

0.7.0

---

### isNearZero()

> **isNearZero**(`epsilon`): `boolean`

Defined in: [src/core/interval.ts:2368](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2368)

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

Defined in: [src/core/interval.ts:2356](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2356)

Tests if this interval is exactly [0, 0].

#### Returns

`boolean`

True if both bounds are exactly zero

#### Since

0.7.0

---

### nearEquals()

> **nearEquals**(`other`, `epsilon`): `boolean`

Defined in: [src/core/interval.ts:2334](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2334)

Approximate equality using relative tolerance.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

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

Defined in: [src/core/interval.ts:1117](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1117)

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

Defined in: [src/core/interval.ts:1325](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1325)

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

Defined in: [src/core/interval.ts:1309](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1309)

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

Defined in: [src/core/interval.ts:1156](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1156)

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

Defined in: [src/core/interval.ts:1272](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1272)

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

Defined in: [src/core/interval.ts:1297](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1297)

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

Defined in: [src/core/interval.ts:1284](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1284)

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

Defined in: [src/core/interval.ts:1135](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1135)

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

Defined in: [src/core/interval.ts:1651](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1651)

Returns the center of this interval.

#### Returns

`number`

Center ((min + max) / 2)

#### Since

0.7.0

---

### radius()

> **radius**(): `number`

Defined in: [src/core/interval.ts:1662](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1662)

Returns the radius (half-width) of this interval.

#### Returns

`number`

Radius ((max - min) / 2)

#### Since

0.7.0

---

### width()

> **width**(): `number`

Defined in: [src/core/interval.ts:1640](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1640)

Returns the width of this interval.

#### Returns

`number`

Width (max - min)

#### Since

0.7.0

---

### center()

> `static` **center**(`interval`): `number`

Defined in: [src/core/interval.ts:1356](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1356)

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

Defined in: [src/core/interval.ts:1368](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1368)

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

Defined in: [src/core/interval.ts:1344](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1344)

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

Defined in: [src/core/interval.ts:222](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L222)

Degrees interval [0, 360].

#### Since

0.7.0

---

### ELEMENT_COUNT

> `readonly` `static` **ELEMENT_COUNT**: `2` = `2`

Defined in: [src/core/interval.ts:165](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L165)

Number of elements when serialized to an array.

#### Since

0.7.0

---

### EPSILON_INTERVAL

> `readonly` `static` **EPSILON_INTERVAL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:213](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L213)

Epsilon interval [-ε, ε].

#### Since

0.7.0

---

### FULL

> `readonly` `static` **FULL**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:204](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L204)

Full real line (-∞, +∞).

#### Since

0.7.0

---

### NEGATIVE

> `readonly` `static` **NEGATIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:195](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L195)

Negative half-line (-∞, 0].

#### Since

0.7.0

---

### POSITIVE

> `readonly` `static` **POSITIVE**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:186](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L186)

Positive half-line [0, +∞).

#### Since

0.7.0

---

### RADIANS

> `readonly` `static` **RADIANS**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:229](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L229)

Radians interval [0, 2π].

#### Since

0.7.0

---

### SYMMETRIC_UNIT

> `readonly` `static` **SYMMETRIC_UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:179](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L179)

Symmetric unit interval [-1, 1].

#### Since

0.7.0

---

### UNIT

> `readonly` `static` **UNIT**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:172](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L172)

Unit interval [0, 1].

#### Since

0.7.0

---

### ZERO

> `readonly` `static` **ZERO**: `Readonly`\<`Interval`\>

Defined in: [src/core/interval.ts:158](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L158)

Zero interval [0, 0].

#### Since

0.7.0

## Constraint

### clamp()

> **clamp**(`minI`, `maxI`): `this`

Defined in: [src/core/interval.ts:1808](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1808)

Clamps bounds between min and max intervals.

#### Parameters

##### minI

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Per-bound minima

##### maxI

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Per-bound maxima

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### clamp()

> `static` **clamp**(`interval`, `minI`, `maxI`, `out?`): `Interval`

Defined in: [src/core/interval.ts:916](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L916)

Clamps bounds between min and max intervals.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### minI

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Per-bound minima

##### maxI

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Per-bound maxima

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Clamped interval

#### Since

0.8.0

---

### max()

> `static` **max**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:901](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L901)

Component-wise maximum of two intervals.

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

Interval with per-bound maxima

#### Since

0.8.0

---

### min()

> `static` **min**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:887](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L887)

Component-wise minimum of two intervals.

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

Interval with per-bound minima

#### Since

0.8.0

## Conversion

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/core/interval.ts:2709](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2709)

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

Defined in: [src/core/interval.ts:2693](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2693)

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

Defined in: [src/core/interval.ts:2610](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2610)

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

Defined in: [src/core/interval.ts:2655](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2655)

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

Defined in: [src/core/interval.ts:2636](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2636)

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

Defined in: [src/core/interval.ts:2675](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2675)

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

Defined in: [src/core/interval.ts:427](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L427)

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

Defined in: [src/core/interval.ts:447](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L447)

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

Defined in: [src/core/interval.ts:324](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L324)

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

Defined in: [src/core/interval.ts:290](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L290)

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

Defined in: [src/core/interval.ts:355](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L355)

Creates an interval from a plain object.

#### Parameters

##### object

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

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

### fromUnsorted()

> `static` **fromUnsorted**(`a`, `b`, `out?`): `Interval`

Defined in: [src/core/interval.ts:406](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L406)

Creates an interval from two values in any order.

#### Parameters

##### a

`number`

First bound

##### b

`number`

Second bound

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with min = min(a, b), max = max(a, b)

#### Remarks

Unlike [fromValues](#fromvalues), this does not require `a ≤ b`.

#### Example

```typescript
Interval.fromUnsorted(5, 2); // → [2, 5]
Interval.fromUnsorted(2, 5); // → [2, 5]
```

#### Since

0.8.0

---

### fromValue()

> `static` **fromValue**(`value`, `out?`): `Interval`

Defined in: [src/core/interval.ts:267](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L267)

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

Defined in: [src/core/interval.ts:379](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L379)

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

Defined in: [src/core/interval.ts:2502](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2502)

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

Defined in: [src/core/interval.ts:2486](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2486)

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

Defined in: [src/core/interval.ts:2445](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2445)

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

Defined in: [src/core/interval.ts:2460](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2460)

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

Defined in: [src/core/interval.ts:2521](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2521)

Interpolates between two intervals, returning a new interval.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

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

Defined in: [src/core/interval.ts:2419](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2419)

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

Defined in: [src/core/interval.ts:2473](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2473)

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

Defined in: [src/core/interval.ts:1096](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1096)

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

Defined in: [src/core/interval.ts:1070](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1070)

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

Defined in: [src/core/interval.ts:968](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L968)

Linear interpolation between two intervals (unclamped).

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Start interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

End interval

##### t

`number`

Interpolation factor (unclamped, allows extrapolation)

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interpolated interval

#### Remarks

The interpolation factor `t` is NOT clamped — values outside [0, 1] will
extrapolate beyond the input intervals. Use [lerpClamped](#lerpclamped-2) to clamp.

#### Since

0.7.0

---

### lerpClamped()

> `static` **lerpClamped**(`a`, `b`, `t`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1007](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1007)

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

Defined in: [src/core/interval.ts:991](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L991)

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

Defined in: [src/core/interval.ts:1039](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1039)

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

Defined in: [src/core/interval.ts:1597](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1597)

Copies values from another interval.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Source interval

#### Returns

`this`

This for chaining

#### Remarks

Trusted fast path — does not validate min <= max. Use set() for validated
assignment from untrusted sources.

#### Since

0.7.0

---

### set()

> **set**(`minValue`, `maxValue`): `this`

Defined in: [src/core/interval.ts:1575](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1575)

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

Defined in: [src/core/interval.ts:1612](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1612)

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

Defined in: [src/core/interval.ts:1623](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1623)

Resets this interval to zero [0, 0].

#### Returns

`this`

This for chaining

#### Since

0.7.0

## Other

### max

> **max**: `number`

Defined in: [src/core/interval.ts:106](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L106)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`max`](../../types/interfaces/IntervalLike.md#max)

---

### min

> **min**: `number`

Defined in: [src/core/interval.ts:105](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L105)

#### Implementation of

[`IntervalLike`](../../types/interfaces/IntervalLike.md).[`min`](../../types/interfaces/IntervalLike.md#min)

## Set Operations

### contains()

> **contains**(`value`): `boolean`

Defined in: [src/core/interval.ts:1696](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1696)

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

### distanceTo()

> **distanceTo**(`other`): `number`

Defined in: [src/core/interval.ts:2301](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2301)

Returns the gap distance between this interval and another.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Other interval

#### Returns

`number`

Non-negative distance (0 if overlapping)

#### Remarks

If the intervals overlap, the distance is zero.

#### Example

```typescript
new Interval(0, 3).distanceTo({ min: 5, max: 8 }); // 2
new Interval(0, 5).distanceTo({ min: 3, max: 8 }); // 0
```

#### Since

0.9.0

---

### enclose()

> **enclose**(`value`): `this`

Defined in: [src/core/interval.ts:2277](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2277)

Expands this interval to include a value.

#### Parameters

##### value

`number`

Value to enclose

#### Returns

`this`

This for chaining

#### Remarks

If the value is already within the interval, this is a no-op.

#### Example

```typescript
new Interval(2, 5).enclose(8); // [2, 8]
new Interval(2, 5).enclose(3); // [2, 5] (no change)
```

#### Since

0.9.0

---

### expand()

> **expand**(`delta`): `this`

Defined in: [src/core/interval.ts:2223](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2223)

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

Defined in: [src/core/interval.ts:2189](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2189)

Intersects with another interval in place.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

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

Defined in: [src/core/interval.ts:1732](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1732)

Tests if this interval is a subset of another.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Other interval

#### Returns

`boolean`

True if this is contained in other

#### Since

0.7.0

---

### overlaps()

> **overlaps**(`other`): `boolean`

Defined in: [src/core/interval.ts:1720](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1720)

Tests if this interval overlaps another.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Other interval

#### Returns

`boolean`

True if intervals overlap

#### Since

0.7.0

---

### shrink()

> **shrink**(`delta`): `this`

Defined in: [src/core/interval.ts:2242](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2242)

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

Defined in: [src/core/interval.ts:1708](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1708)

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

Defined in: [src/core/interval.ts:2208](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L2208)

Unions with another interval in place.

#### Parameters

##### other

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Other interval

#### Returns

`this`

This for chaining

#### Since

0.7.0

---

### contains()

> `static` **contains**(`interval`, `value`): `boolean`

Defined in: [src/core/interval.ts:1189](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1189)

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

### distance()

> `static` **distance**(`a`, `b`): `number`

Defined in: [src/core/interval.ts:1260](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1260)

Returns the gap distance between two intervals.

#### Parameters

##### a

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

First interval

##### b

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Second interval

#### Returns

`number`

Non-negative distance between intervals (0 if overlapping)

#### Remarks

If the intervals overlap, the distance is zero. Otherwise, the distance
is the length of the gap between the closest endpoints.

#### Example

```typescript
Interval.distance({ min: 0, max: 3 }, { min: 5, max: 8 }); // 2
Interval.distance({ min: 0, max: 5 }, { min: 3, max: 8 }); // 0 (overlapping)
```

#### Since

0.9.0

---

### enclosing()

> `static` **enclosing**(`interval`, `value`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1529](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1529)

Returns the smallest interval that contains both the original interval and a value.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Source interval

##### value

`number`

Value to enclose

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval expanded to include the value

#### Remarks

If the value is already within the interval, the result is the original interval
unchanged. Otherwise, the interval is expanded on the appropriate side.

#### Example

```typescript
Interval.enclosing({ min: 2, max: 5 }, 8); // [2, 8]
Interval.enclosing({ min: 2, max: 5 }, 0); // [0, 5]
Interval.enclosing({ min: 2, max: 5 }, 3); // [2, 5] (already contained)
```

#### Since

0.9.0

---

### expand()

> `static` **expand**(`interval`, `delta`, `out?`): `Interval`

Defined in: [src/core/interval.ts:1500](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1500)

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

Defined in: [src/core/interval.ts:1392](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1392)

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

Defined in: [src/core/interval.ts:1476](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1476)

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

Defined in: [src/core/interval.ts:1236](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1236)

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

Defined in: [src/core/interval.ts:1176](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1176)

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

Defined in: [src/core/interval.ts:1548](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1548)

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

Defined in: [src/core/interval.ts:1213](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1213)

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

Defined in: [src/core/interval.ts:1449](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1449)

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

## Transform

### ceil()

> **ceil**(): `this`

Defined in: [src/core/interval.ts:1758](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1758)

Applies Math.ceil to both bounds.

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### floor()

> **floor**(): `this`

Defined in: [src/core/interval.ts:1746](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1746)

Applies Math.floor to both bounds.

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### round()

> **round**(): `this`

Defined in: [src/core/interval.ts:1770](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1770)

Applies Math.round to both bounds.

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### sign()

> **sign**(): `this`

Defined in: [src/core/interval.ts:1794](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1794)

Component-wise sign of both bounds.

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### trunc()

> **trunc**(): `this`

Defined in: [src/core/interval.ts:1782](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L1782)

Applies Math.trunc to both bounds.

#### Returns

`this`

This for chaining

#### Since

0.8.0

---

### ceil()

> `static` **ceil**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:834](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L834)

Applies Math.ceil to both bounds.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with ceiled bounds

#### Since

0.8.0

---

### floor()

> `static` **floor**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:821](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L821)

Applies Math.floor to both bounds.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with floored bounds

#### Since

0.8.0

---

### round()

> `static` **round**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:847](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L847)

Applies Math.round to both bounds.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with rounded bounds

#### Since

0.8.0

---

### sign()

> `static` **sign**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:873](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L873)

Component-wise sign of both bounds.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with sign of each bound (-1, 0, or 1)

#### Since

0.8.0

---

### trunc()

> `static` **trunc**(`interval`, `out?`): `Interval`

Defined in: [src/core/interval.ts:860](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/core/interval.ts#L860)

Applies Math.trunc to both bounds.

#### Parameters

##### interval

[`ReadonlyIntervalLike`](../../types/interfaces/ReadonlyIntervalLike.md)

Input interval

##### out?

`Interval`

Optional output interval

#### Returns

`Interval`

Interval with truncated bounds

#### Since

0.8.0
