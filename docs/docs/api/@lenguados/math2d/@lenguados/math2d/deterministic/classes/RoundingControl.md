# Class: RoundingControl

Provides explicit control over rounding operations for deterministic behavior.
JavaScript doesn't provide native rounding mode control, so this class
implements various rounding strategies explicitly.

## Example

```typescript
// Different rounding modes
RoundingControl.round(2.5, RoundingMode.NEAREST_EVEN); // 2 (banker's)
RoundingControl.round(2.5, RoundingMode.NEAREST_AWAY); // 3
RoundingControl.round(2.5, RoundingMode.FLOOR); // 2
RoundingControl.round(2.5, RoundingMode.CEIL); // 3
```

## Constructors

### Constructor

> **new RoundingControl**(): `RoundingControl`

#### Returns

`RoundingControl`

## Methods

### ceil()

> `static` **ceil**(`value`): `number`

Rounds towards positive infinity (ceiling).

#### Parameters

##### value

`number`

Value to round

#### Returns

`number`

Rounded value

---

### floor()

> `static` **floor**(`value`): `number`

Rounds towards negative infinity (floor).

#### Parameters

##### value

`number`

Value to round

#### Returns

`number`

Rounded value

---

### nearestAway()

> `static` **nearestAway**(`value`): `number`

Rounds to nearest integer, ties away from zero.
Traditional rounding taught in schools.

#### Parameters

##### value

`number`

Value to round

#### Returns

`number`

Rounded value

---

### nearestEven()

> `static` **nearestEven**(`value`): `number`

Rounds to nearest integer, ties to even (banker's rounding).
Reduces bias in repeated rounding operations.

#### Parameters

##### value

`number`

Value to round

#### Returns

`number`

Rounded value

---

### quantizeToFixed()

> `static` **quantizeToFixed**(`value`, `fractionalBits`, `mode`): `number`

Quantizes value to fixed-point representation.
Useful for ensuring consistent precision.

#### Parameters

##### value

`number`

Value to quantize

##### fractionalBits

`number`

Number of fractional bits

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md) = `RoundingMode.NEAREST_EVEN`

Rounding mode

#### Returns

`number`

Quantized value

#### Example

```typescript
// 16-bit fractional precision
const quantized = RoundingControl.quantizeToFixed(3.14159, 16);
```

---

### rangeReduce()

> `static` **rangeReduce**(`value`, `period`): `number`

Performs range reduction for periodic functions.
Reduces value to [0, period) using exact arithmetic.

#### Parameters

##### value

`number`

Value to reduce

##### period

`number`

Period of the function

#### Returns

`number`

Reduced value in [0, period)

---

### round()

> `static` **round**(`value`, `mode`): `number`

Rounds a value according to the specified rounding mode.

#### Parameters

##### value

`number`

Value to round

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md)

Rounding mode to use

#### Returns

`number`

Rounded value

---

### roundToMultiple()

> `static` **roundToMultiple**(`value`, `multiple`, `mode`): `number`

Rounds to nearest multiple using given mode.

#### Parameters

##### value

`number`

Value to round

##### multiple

`number`

Multiple to round to

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md) = `RoundingMode.NEAREST_EVEN`

Rounding mode

#### Returns

`number`

Rounded value

---

### roundToPlaces()

> `static` **roundToPlaces**(`value`, `places`, `mode`): `number`

Rounds to specified number of decimal places using given mode.

#### Parameters

##### value

`number`

Value to round

##### places

`number`

Number of decimal places

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md) = `RoundingMode.NEAREST_EVEN`

Rounding mode

#### Returns

`number`

Rounded value

---

### stochasticRound()

> `static` **stochasticRound**(`value`, `random`): `number`

Applies stochastic rounding using provided random value.
Useful for Monte Carlo simulations where bias matters.

#### Parameters

##### value

`number`

Value to round

##### random

`number`

Random value in [0, 1)

#### Returns

`number`

Rounded value

#### Example

```typescript
// Round 2.7 stochastically
// 70% chance of rounding to 3, 30% chance of rounding to 2
const rounded = RoundingControl.stochasticRound(2.7, Math.random());
```

---

### truncate()

> `static` **truncate**(`value`): `number`

Truncates towards zero.

#### Parameters

##### value

`number`

Value to truncate

#### Returns

`number`

Truncated value
