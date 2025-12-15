# Class: RoundingControl

Defined in: [src/deterministic/rounding-control.ts:62](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L62)

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

## Since

0.1.0

## Constructors

### Constructor

> **new RoundingControl**(): `RoundingControl`

#### Returns

`RoundingControl`

## Rounding

### ceil()

> `static` **ceil**(`value`): `number`

Defined in: [src/deterministic/rounding-control.ts:159](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L159)

Rounds towards positive infinity (ceiling).

#### Parameters

##### value

`number`

Value to round.

#### Returns

`number`

Rounded value.

#### Since

0.1.0

---

### floor()

> `static` **floor**(`value`): `number`

Defined in: [src/deterministic/rounding-control.ts:173](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L173)

Rounds towards negative infinity (floor).

#### Parameters

##### value

`number`

Value to round.

#### Returns

`number`

Rounded value.

#### Since

0.1.0

---

### nearestAway()

> `static` **nearestAway**(`value`): `number`

Defined in: [src/deterministic/rounding-control.ts:145](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L145)

Rounds to nearest integer, ties away from zero.
Traditional rounding taught in schools.

#### Parameters

##### value

`number`

Value to round.

#### Returns

`number`

Rounded value.

#### Since

0.1.0

---

### nearestEven()

> `static` **nearestEven**(`value`): `number`

Defined in: [src/deterministic/rounding-control.ts:123](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L123)

Rounds to nearest integer, ties to even (banker's rounding).
Reduces bias in repeated rounding operations.

#### Parameters

##### value

`number`

Value to round.

#### Returns

`number`

Rounded value.

#### Since

0.1.0

---

### quantizeToFixed()

> `static` **quantizeToFixed**(`value`, `fractionalBits`, `mode`): `number`

Defined in: [src/deterministic/rounding-control.ts:254](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L254)

Quantizes value to fixed-point representation.
Useful for ensuring consistent precision.

#### Parameters

##### value

`number`

Value to quantize.

##### fractionalBits

`number`

Number of fractional bits.

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md) = `RoundingMode.NEAREST_EVEN`

Rounding mode.

#### Returns

`number`

Quantized value.

#### Example

```typescript
// 16-bit fractional precision
const quantized = RoundingControl.quantizeToFixed(3.14159, 16);
```

#### Since

0.1.0

---

### rangeReduce()

> `static` **rangeReduce**(`value`, `period`): `number`

Defined in: [src/deterministic/rounding-control.ts:315](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L315)

Performs range reduction for periodic functions.
Reduces value to [0, period) using exact arithmetic.

#### Parameters

##### value

`number`

Value to reduce.

##### period

`number`

Period of the function.

#### Returns

`number`

Reduced value in [0, period).

#### Since

0.1.0

---

### round()

> `static` **round**(`value`, `mode`): `number`

Defined in: [src/deterministic/rounding-control.ts:77](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L77)

Rounds a value according to the specified rounding mode.

#### Parameters

##### value

`number`

Value to round.

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md)

Rounding mode to use.

#### Returns

`number`

Rounded value.

#### Since

0.1.0

---

### roundToMultiple()

> `static` **roundToMultiple**(`value`, `multiple`, `mode`): `number`

Defined in: [src/deterministic/rounding-control.ts:220](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L220)

Rounds to nearest multiple using given mode.

#### Parameters

##### value

`number`

Value to round.

##### multiple

`number`

Multiple to round to.

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md) = `RoundingMode.NEAREST_EVEN`

Rounding mode.

#### Returns

`number`

Rounded value.

#### Since

0.1.0

---

### roundToPlaces()

> `static` **roundToPlaces**(`value`, `places`, `mode`): `number`

Defined in: [src/deterministic/rounding-control.ts:193](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L193)

Rounds to specified number of decimal places using given mode.

#### Parameters

##### value

`number`

Value to round.

##### places

`number`

Number of decimal places.

##### mode

[`RoundingMode`](../enumerations/RoundingMode.md) = `RoundingMode.NEAREST_EVEN`

Rounding mode.

#### Returns

`number`

Rounded value.

#### Since

0.1.0

---

### stochasticRound()

> `static` **stochasticRound**(`value`, `random`): `number`

Defined in: [src/deterministic/rounding-control.ts:295](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L295)

Applies stochastic rounding using provided random value.
Useful for Monte Carlo simulations where bias matters.

#### Parameters

##### value

`number`

Value to round.

##### random

`number`

Random value in [0, 1).

#### Returns

`number`

Rounded value.

#### Example

```typescript
// Round 2.7 stochastically
// 70% chance of rounding to 3, 30% chance of rounding to 2
const rounded = RoundingControl.stochasticRound(2.7, Math.random());
```

#### Since

0.1.0

---

### truncate()

> `static` **truncate**(`value`): `number`

Defined in: [src/deterministic/rounding-control.ts:108](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/rounding-control.ts#L108)

Truncates towards zero.

#### Parameters

##### value

`number`

Value to truncate.

#### Returns

`number`

Truncated value.

#### Since

0.1.0
