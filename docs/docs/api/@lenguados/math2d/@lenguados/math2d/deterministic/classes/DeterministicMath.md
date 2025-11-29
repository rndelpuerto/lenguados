# Class: DeterministicMath

Deterministic math implementation using lookup tables and iterative algorithms.
Ensures reproducible results across different JavaScript engines and platforms.

## Example

```typescript
// Deterministic trigonometry
DeterministicMath.configure({ tableSize: 4096 });
const sine = DeterministicMath.sin(Math.PI / 4);
const cosine = DeterministicMath.cos(Math.PI / 4);

// Deterministic sqrt
const root = DeterministicMath.sqrt(2);
```

## Constructors

### Constructor

> **new DeterministicMath**(): `DeterministicMath`

#### Returns

`DeterministicMath`

## Methods

### abs()

> `static` **abs**(`value`): `number`

Deterministic absolute value.

#### Parameters

##### value

`number`

#### Returns

`number`

Absolute value

---

### atan2()

> `static` **atan2**(`y`, `x`): `number`

Deterministic arc tangent with quadrant handling.
Delegates to Math.atan2 and quantizes the result to a fixed precision
so that equivalent inputs yield identical outputs across platforms.

#### Parameters

##### y

`number`

Y coordinate

##### x

`number`

X coordinate

#### Returns

`number`

Angle in radians [-PI, PI]

---

### ceil()

> `static` **ceil**(`x`): `number`

Deterministic ceiling function using fast bitwise truncation.

#### Parameters

##### x

`number`

Input value

#### Returns

`number`

Ceiling value

#### Remarks

**Performance vs Range Trade-off:**
This method uses bitwise operations (`| 0`) for maximum performance,
which limits the valid input range to int32 values: [-2147483648, 2147483647].

For values outside this range, use [DeterministicMath.ceilSafe](#ceilsafe) instead.

#### Example

```typescript
DeterministicMath.ceil(3.2); // 4
DeterministicMath.ceil(-3.2); // -3
```

---

### ceilSafe()

> `static` **ceilSafe**(`x`): `number`

Safe ceiling function that handles values outside int32 range.

#### Parameters

##### x

`number`

Input value (any finite number)

#### Returns

`number`

Ceiling value

#### Remarks

Slower than [DeterministicMath.ceil](#ceil) but handles all finite values.
Uses Math.ceil internally with deterministic post-processing.

---

### configure()

> `static` **configure**(`options`): `void`

Update deterministic math configuration.

#### Parameters

##### options

`Partial`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\> = `{}`

Partial options to override defaults

#### Returns

`void`

---

### cos()

> `static` **cos**(`angle`): `number`

Deterministic cosine using lookup table with linear interpolation.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`number`

Cosine value

---

### floor()

> `static` **floor**(`x`): `number`

Deterministic floor function using fast bitwise truncation.

#### Parameters

##### x

`number`

Input value

#### Returns

`number`

Floor value

#### Remarks

**Performance vs Range Trade-off:**
This method uses bitwise operations (`| 0`) for maximum performance,
which limits the valid input range to int32 values: [-2147483648, 2147483647].

For values outside this range, use [DeterministicMath.floorSafe](#floorsafe) instead.

#### Example

```typescript
DeterministicMath.floor(3.7); // 3
DeterministicMath.floor(-3.7); // -4
```

---

### floorSafe()

> `static` **floorSafe**(`x`): `number`

Safe floor function that handles values outside int32 range.

#### Parameters

##### x

`number`

Input value (any finite number)

#### Returns

`number`

Floor value

#### Remarks

Slower than [DeterministicMath.floor](#floor) but handles all finite values.
Uses Math.floor internally with deterministic post-processing.

---

### getOptions()

> `static` **getOptions**(): `Required`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\>

Gets the current configuration.

#### Returns

`Required`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\>

Configuration options

---

### reset()

> `static` **reset**(): `void`

Reset configuration to defaults and rebuild lookup tables.

#### Returns

`void`

---

### round()

> `static` **round**(`x`): `number`

Deterministic round function (banker's rounding).

#### Parameters

##### x

`number`

Input value

#### Returns

`number`

Rounded value

#### Remarks

Uses banker's rounding (round half to even) to reduce bias in
repeated rounding operations. This is the IEEE 754 recommended
rounding mode.

**Range Limitation:** Inherits the int32 range limitation from
[DeterministicMath.floor](#floor). Use [DeterministicMath.roundSafe](#roundsafe)
for values outside this range.

#### Example

```typescript
DeterministicMath.round(2.5); // 2 (rounds to even)
DeterministicMath.round(3.5); // 4 (rounds to even)
DeterministicMath.round(2.6); // 3
```

---

### roundSafe()

> `static` **roundSafe**(`x`): `number`

Safe round function that handles values outside int32 range.

#### Parameters

##### x

`number`

Input value (any finite number)

#### Returns

`number`

Rounded value using banker's rounding

---

### sign()

> `static` **sign**(`value`): `number`

Deterministic sign function.

#### Parameters

##### value

`number`

#### Returns

`number`

Sign (-1, 0, or 1)

---

### sin()

> `static` **sin**(`angle`): `number`

Deterministic sine using lookup table with linear interpolation.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`number`

Sine value

---

### sqrt()

> `static` **sqrt**(`x`): `number`

Deterministic square root using Newton-Raphson iteration.

#### Parameters

##### x

`number`

Value to take square root of

#### Returns

`number`

Square root

---

### tan()

> `static` **tan**(`angle`): `number`

Deterministic tangent computed from sin/cos.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`number`

Tangent value
