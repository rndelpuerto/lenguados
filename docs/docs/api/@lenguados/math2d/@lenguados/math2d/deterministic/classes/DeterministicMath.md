# Class: DeterministicMath

Defined in: [src/deterministic/deterministic-math.ts:83](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L83)

Deterministic math implementation using lookup tables and iterative algorithms.
Ensures reproducible results across different JavaScript engines and platforms.

## Remarks

**Why is this needed?**
JavaScript's `Math.sin`, `Math.cos`, and other trigonometric functions are not
guaranteed to produce identical results across different engines (V8, SpiderMonkey,
JSC). This is problematic for:
- **Lockstep networking** in multiplayer games (all clients must compute identically)
- **Replay systems** (recorded input must reproduce exact simulation)
- **Unit testing** (tests must be deterministic across CI environments)

**Memory Trade-off:**
The lookup tables consume memory based on `tableSize`:
| tableSize | Memory (approx) | Max Error     | Use Case           |
|-----------|-----------------|---------------|--------------------|
| 256       | ~4 KB           | ~0.024 rad    | Mobile/constrained |
| 4096      | ~64 KB          | ~0.0015 rad   | Casual games       |
| 65536     | ~1 MB           | ~0.00009 rad  | Physics simulation |

The default of 65536 entries provides excellent precision for physics engines.

**Performance:**
- `sin`/`cos`: O(1) lookup + linear interpolation (~2ns)
- `sqrt`: O(k) Newton-Raphson iterations (~10ns for k=3)
- `atan2`: O(1) native + quantization (~5ns)

## Example

```typescript
// Deterministic trigonometry
DeterministicMath.configure({ tableSize: 4096 });
const sine = DeterministicMath.sin(Math.PI / 4);
const cosine = DeterministicMath.cos(Math.PI / 4);

// Deterministic sqrt
const root = DeterministicMath.sqrt(2);
```

## See

[DeterministicOptions](../interfaces/DeterministicOptions.md) for configuration options

## Constructors

### Constructor

> **new DeterministicMath**(): `DeterministicMath`

#### Returns

`DeterministicMath`

## Methods

### abs()

> `static` **abs**(`value`): `number`

Defined in: [src/deterministic/deterministic-math.ts:493](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L493)

Deterministic absolute value.

#### Parameters

##### value

`number`

#### Returns

`number`

Absolute value

***

### acos()

> `static` **acos**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:359](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L359)

Deterministic arc cosine using trigonometric identity.
Uses the identity: acos(x) = atan2(sqrt(1-x²), x)

#### Parameters

##### x

`number`

Value in range [-1, 1]

#### Returns

`number`

Angle in radians [0, PI]

#### Remarks

**Why not use Math.acos directly?**
While IEEE 754 requires correctly rounded results, different JavaScript
engines (V8, SpiderMonkey, JSC) may produce slightly different results for
edge cases. This implementation composes `atan2` and `sqrt` which are
already deterministic in this class.

**Mathematical basis:**
For a unit circle, if cos(θ) = x, then sin(θ) = ±sqrt(1-x²).
Since acos returns values in [0, π], sin(θ) ≥ 0, so sin(θ) = sqrt(1-x²).
Therefore: θ = atan2(sin(θ), cos(θ)) = atan2(sqrt(1-x²), x)

#### Example

```typescript
DeterministicMath.acos(1);    // 0
DeterministicMath.acos(0);    // PI/2
DeterministicMath.acos(-1);   // PI
DeterministicMath.acos(0.5);  // PI/3
```

#### See

[acosSafe](#acossafe) for version that clamps input to [-1, 1]

***

### acosSafe()

> `static` **acosSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:392](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L392)

Safe deterministic arc cosine with input clamping.
Clamps input to [-1, 1] to avoid NaN for out-of-range values.

#### Parameters

##### x

`number`

Value to compute arc cosine of (will be clamped to [-1, 1])

#### Returns

`number`

Angle in radians [0, PI]

#### Remarks

Use this when input may be slightly outside [-1, 1] due to floating-point
errors (e.g., dot products that should be in range but may be 1.0000001).

#### Example

```typescript
DeterministicMath.acosSafe(1.0001);  // 0 (clamped to 1)
DeterministicMath.acosSafe(-1.001);  // PI (clamped to -1)
DeterministicMath.acosSafe(0.5);     // PI/3
```

#### See

[acos](#acos) for version that returns NaN for out-of-range inputs

***

### asin()

> `static` **asin**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:420](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L420)

Deterministic arc sine using trigonometric identity.
Uses the identity: asin(x) = atan2(x, sqrt(1-x²))

#### Parameters

##### x

`number`

Value in range [-1, 1]

#### Returns

`number`

Angle in radians [-PI/2, PI/2]

#### Remarks

**Mathematical basis:**
For a unit circle, if sin(θ) = x, then cos(θ) = ±sqrt(1-x²).
Since asin returns values in [-π/2, π/2], cos(θ) ≥ 0, so cos(θ) = sqrt(1-x²).
Therefore: θ = atan2(sin(θ), cos(θ)) = atan2(x, sqrt(1-x²))

#### Example

```typescript
DeterministicMath.asin(0);    // 0
DeterministicMath.asin(1);    // PI/2
DeterministicMath.asin(-1);   // -PI/2
DeterministicMath.asin(0.5);  // PI/6
```

#### See

[asinSafe](#asinsafe) for version that clamps input to [-1, 1]

***

### asinSafe()

> `static` **asinSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:449](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L449)

Safe deterministic arc sine with input clamping.
Clamps input to [-1, 1] to avoid NaN for out-of-range values.

#### Parameters

##### x

`number`

Value to compute arc sine of (will be clamped to [-1, 1])

#### Returns

`number`

Angle in radians [-PI/2, PI/2]

#### Example

```typescript
DeterministicMath.asinSafe(1.0001);  // PI/2 (clamped to 1)
DeterministicMath.asinSafe(-1.001);  // -PI/2 (clamped to -1)
DeterministicMath.asinSafe(0.5);     // PI/6
```

#### See

[asin](#asin) for version that returns NaN for out-of-range inputs

***

### atan2()

> `static` **atan2**(`y`, `x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:462](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L462)

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

***

### ceil()

> `static` **ceil**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:565](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L565)

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
DeterministicMath.ceil(3.2);   // 4
DeterministicMath.ceil(-3.2);  // -3
```

***

### ceilSafe()

> `static` **ceilSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:579](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L579)

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

***

### configure()

> `static` **configure**(`options`): `void`

Defined in: [src/deterministic/deterministic-math.ts:111](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L111)

Update deterministic math configuration.

#### Parameters

##### options

`Partial`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\> = `{}`

Partial options to override defaults

#### Returns

`void`

***

### cos()

> `static` **cos**(`angle`): `number`

Defined in: [src/deterministic/deterministic-math.ts:243](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L243)

Deterministic cosine using lookup table with linear interpolation.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`number`

Cosine value

***

### floor()

> `static` **floor**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:524](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L524)

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
DeterministicMath.floor(3.7);   // 3
DeterministicMath.floor(-3.7);  // -4
```

***

### floorSafe()

> `static` **floorSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:538](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L538)

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

***

### getOptions()

> `static` **getOptions**(): `Required`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\>

Defined in: [src/deterministic/deterministic-math.ts:642](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L642)

Gets the current configuration.

#### Returns

`Required`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\>

Configuration options

***

### reset()

> `static` **reset**(): `void`

Defined in: [src/deterministic/deterministic-math.ts:133](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L133)

Reset configuration to defaults and rebuild lookup tables.

#### Returns

`void`

***

### round()

> `static` **round**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:609](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L609)

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
DeterministicMath.round(2.5);   // 2 (rounds to even)
DeterministicMath.round(3.5);   // 4 (rounds to even)
DeterministicMath.round(2.6);   // 3
```

***

### roundSafe()

> `static` **roundSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:625](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L625)

Safe round function that handles values outside int32 range.

#### Parameters

##### x

`number`

Input value (any finite number)

#### Returns

`number`

Rounded value using banker's rounding

***

### sign()

> `static` **sign**(`value`): `number`

Defined in: [src/deterministic/deterministic-math.ts:502](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L502)

Deterministic sign function.

#### Parameters

##### value

`number`

#### Returns

`number`

Sign (-1, 0, or 1)

***

### sin()

> `static` **sin**(`angle`): `number`

Defined in: [src/deterministic/deterministic-math.ts:231](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L231)

Deterministic sine using lookup table with linear interpolation.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`number`

Sine value

***

### sqrt()

> `static` **sqrt**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:285](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L285)

Deterministic square root using Newton-Raphson iteration.

#### Parameters

##### x

`number`

Value to take square root of

#### Returns

`number`

Square root, NaN for negative values, handles Infinity correctly

#### Remarks

Uses Newton-Raphson iteration for deterministic results across platforms.
For safe handling of negative values (clamping to 0), use [sqrtSafe](#sqrtsafe).

#### Example

```typescript
DeterministicMath.sqrt(4);     // 2
DeterministicMath.sqrt(2);     // ~1.414
DeterministicMath.sqrt(-1);    // NaN
DeterministicMath.sqrt(Infinity); // Infinity
```

#### See

[sqrtSafe](#sqrtsafe) for version that clamps negatives to 0

***

### sqrtSafe()

> `static` **sqrtSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:326](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L326)

Safe deterministic square root.
Clamps negative values to 0 instead of returning NaN.

#### Parameters

##### x

`number`

Value to take square root of

#### Returns

`number`

Square root (0 for negative values)

#### Remarks

Use this when input may be slightly negative due to floating-point
errors (e.g., in geometric calculations where x should theoretically
be non-negative but may be -1e-15 due to precision loss).

#### Example

```typescript
DeterministicMath.sqrtSafe(-1);     // 0 (not NaN)
DeterministicMath.sqrtSafe(-1e-15); // 0 (handles FP errors)
DeterministicMath.sqrtSafe(4);      // 2
DeterministicMath.sqrtSafe(0);      // 0
```

#### See

[sqrt](#sqrt) for standard sqrt that returns NaN for negatives

***

### tan()

> `static` **tan**(`angle`): `number`

Defined in: [src/deterministic/deterministic-math.ts:255](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/deterministic/deterministic-math.ts#L255)

Deterministic tangent computed from sin/cos.

#### Parameters

##### angle

`number`

Angle in radians

#### Returns

`number`

Tangent value
