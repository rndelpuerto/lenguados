# Class: DeterministicMath

Defined in: [src/deterministic/deterministic-math.ts:94](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L94)

Deterministic math implementation using lookup tables and iterative algorithms.

## Remarks

**Determinism Guarantee Levels:**

| Level | Guarantee                  | Description                                       |
| ----- | -------------------------- | ------------------------------------------------- |
| L0    | Bit-exact cross-platform   | Not yet implemented (requires precomputed tables) |
| L1    | Same-engine consistent     | ✅ Current guarantee within same JS engine        |
| L2    | Same-invocation consistent | Always guaranteed                                 |

> **⚠️ Current Limitation:**
> Tables are generated at runtime using `Math.sin/cos`. This means:
>
> - Results are **consistent within the same JavaScript engine**
> - Results may **differ slightly between engines** (V8, SpiderMonkey, JSC)
>
> For true cross-engine determinism, tables must be precomputed offline
> and embedded as constants (planned for future version).

**Why is this still useful?**

- **Unit tests** run on same CI environment → deterministic
- **Replay systems** on same game build → deterministic
- **Single-platform games** (e.g., web-only) → deterministic

**Memory Trade-off:**
| tableSize | Memory (approx) | Max Error | Use Case |
|-----------|-----------------|---------------|--------------------
| 256 | ~4 KB | ~0.024 rad | Mobile/constrained |
| 4096 | ~64 KB | ~0.0015 rad | Casual games |
| 65536 | ~1 MB | ~0.00009 rad | Physics simulation |

The default of 65536 entries provides excellent precision for physics engines.

**Performance:**

- `sin`/`cos`: O(1) lookup + linear interpolation (~2ns)
- `sqrt`: O(k) Newton-Raphson iterations (~10ns for k=3)
- `atan2`: O(1) native + quantization (~5ns)

## Example

```typescript
// Deterministic trigonometry (same-engine consistent)
DeterministicMath.configure({ tableSize: 4096 });
const sine = DeterministicMath.sin(Math.PI / 4);
const cosine = DeterministicMath.cos(Math.PI / 4);

// Deterministic sqrt (cross-platform via Newton-Raphson)
const root = DeterministicMath.sqrt(2);
```

## See

[DeterministicOptions](../interfaces/DeterministicOptions.md) for configuration options.

## Since

0.1.0

## Constructors

### Constructor

> **new DeterministicMath**(): `DeterministicMath`

#### Returns

`DeterministicMath`

## Arithmetic

### abs()

> `static` **abs**(`value`): `number`

Defined in: [src/deterministic/deterministic-math.ts:637](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L637)

Deterministic absolute value.

#### Parameters

##### value

`number`

Input value.

#### Returns

`number`

Absolute value.

#### Since

0.1.0

---

### pow()

> `static` **pow**(`base`, `exponent`): `number`

Defined in: [src/deterministic/deterministic-math.ts:678](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L678)

Deterministic power function.

#### Parameters

##### base

`number`

Base value.

##### exponent

`number`

Exponent value.

#### Returns

`number`

base raised to exponent.

#### Remarks

Uses fast path for integer exponents (exponentiation by squaring).
For fractional exponents, delegates to Math.pow with quantization.

**Determinism:** Results are quantized to 12 significant digits to ensure
consistency across JavaScript engines (L1 guarantee).

#### Example

```typescript
DeterministicMath.pow(2, 10); // 1024 (exact)
DeterministicMath.pow(2, 0.5); // 1.41421356237... (quantized)
DeterministicMath.pow(10, -2); // 0.01 (exact)
```

#### Since

0.13.0

---

### sign()

> `static` **sign**(`value`): `number`

Defined in: [src/deterministic/deterministic-math.ts:650](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L650)

Deterministic sign function.

#### Parameters

##### value

`number`

Input value.

#### Returns

`number`

Sign (-1, 0, or 1).

#### Since

0.1.0

---

### sqrt()

> `static` **sqrt**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:370](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L370)

Deterministic square root using Fast Inverse Square Root algorithm.

#### Parameters

##### x

`number`

Value to take square root of.

#### Returns

`number`

Square root, NaN for negative values, handles Infinity correctly.

#### Remarks

**L0 Determinism:** Uses bit manipulation (Quake III style Fast Inverse
Square Root) to eliminate dependency on `Math.sqrt`. The algorithm:

1. Reinterprets Float64 bits as BigInt
2. Applies magic constant `0x5FE6EB50C7B537A9n`
3. Refines with Newton-Raphson iterations

This provides bit-exact results across all JavaScript engines.

For safe handling of negative values (clamping to 0), use [sqrtSafe](#sqrtsafe).

#### Example

```typescript
DeterministicMath.sqrt(4); // 2
DeterministicMath.sqrt(2); // ~1.414
DeterministicMath.sqrt(-1); // NaN
DeterministicMath.sqrt(Infinity); // Infinity
```

#### See

- [sqrtSafe](#sqrtsafe) for version that clamps negatives to 0.
- https://en.wikipedia.org/wiki/Fast_inverse_square_root

#### Since

0.1.0

---

### sqrtSafe()

> `static` **sqrtSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:442](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L442)

Safe deterministic square root.
Clamps negative values to 0 instead of returning NaN.

#### Parameters

##### x

`number`

Value to take square root of.

#### Returns

`number`

Square root (0 for negative values).

#### Remarks

Use this when input may be slightly negative due to floating-point
errors (e.g., in geometric calculations where x should theoretically
be non-negative but may be -1e-15 due to precision loss).

#### Example

```typescript
DeterministicMath.sqrtSafe(-1); // 0 (not NaN)
DeterministicMath.sqrtSafe(-1e-15); // 0 (handles FP errors)
DeterministicMath.sqrtSafe(4); // 2
DeterministicMath.sqrtSafe(0); // 0
```

#### See

[sqrt](#sqrt) for standard sqrt that returns NaN for negatives.

#### Since

0.1.0

## Configuration

### configure()

> `static` **configure**(`options`): `void`

Defined in: [src/deterministic/deterministic-math.ts:148](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L148)

Updates the deterministic math configuration.

#### Parameters

##### options

`Partial`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\> = `{}`

Partial options to override defaults.

#### Returns

`void`

#### Since

0.1.0

---

### getOptions()

> `static` **getOptions**(): `Required`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\>

Defined in: [src/deterministic/deterministic-math.ts:897](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L897)

Gets the current configuration.

#### Returns

`Required`\<[`DeterministicOptions`](../interfaces/DeterministicOptions.md)\>

Configuration options.

#### Since

0.1.0

---

### reset()

> `static` **reset**(): `void`

Defined in: [src/deterministic/deterministic-math.ts:173](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L173)

Resets configuration to defaults and rebuilds lookup tables.

#### Returns

`void`

#### Since

0.1.0

## Rounding

### ceil()

> `static` **ceil**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:800](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L800)

Deterministic ceiling function using fast bitwise truncation.

#### Parameters

##### x

`number`

Input value.

#### Returns

`number`

Ceiling value.

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

#### Since

0.1.0

---

### ceilSafe()

> `static` **ceilSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:818](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L818)

Safe ceiling function that handles values outside int32 range.

#### Parameters

##### x

`number`

Input value (any finite number).

#### Returns

`number`

Ceiling value.

#### Remarks

Slower than [DeterministicMath.ceil](#ceil) but handles all finite values.
Uses Math.ceil internally with deterministic post-processing.

#### Since

0.1.0

---

### floor()

> `static` **floor**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:751](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L751)

Deterministic floor function using fast bitwise truncation.

#### Parameters

##### x

`number`

Input value.

#### Returns

`number`

Floor value.

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

#### Since

0.1.0

---

### floorSafe()

> `static` **floorSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:769](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L769)

Safe floor function that handles values outside int32 range.

#### Parameters

##### x

`number`

Input value (any finite number).

#### Returns

`number`

Floor value.

#### Remarks

Slower than [DeterministicMath.floor](#floor) but handles all finite values.
Uses Math.floor internally with deterministic post-processing.

#### Since

0.1.0

---

### round()

> `static` **round**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:852](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L852)

Deterministic round function (banker's rounding).

#### Parameters

##### x

`number`

Input value.

#### Returns

`number`

Rounded value.

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

#### Since

0.1.0

---

### roundSafe()

> `static` **roundSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:872](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L872)

Safe round function that handles values outside int32 range.

#### Parameters

##### x

`number`

Input value (any finite number).

#### Returns

`number`

Rounded value using banker's rounding.

#### Since

0.1.0

## Trigonometry

### acos()

> `static` **acos**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:482](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L482)

Deterministic arc cosine using trigonometric identity.
Uses the identity: acos(x) = atan2(sqrt(1-x²), x)

#### Parameters

##### x

`number`

Value in range [-1, 1].

#### Returns

`number`

Angle in radians [0, PI].

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
DeterministicMath.acos(1); // 0
DeterministicMath.acos(0); // PI/2
DeterministicMath.acos(-1); // PI
DeterministicMath.acos(0.5); // PI/3
```

#### See

[acosSafe](#acossafe) for version that clamps input to [-1, 1].

#### Since

0.1.0

---

### acosSafe()

> `static` **acosSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:518](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L518)

Safe deterministic arc cosine with input clamping.
Clamps input to [-1, 1] to avoid NaN for out-of-range values.

#### Parameters

##### x

`number`

Value to compute arc cosine of (will be clamped to [-1, 1]).

#### Returns

`number`

Angle in radians [0, PI].

#### Remarks

Use this when input may be slightly outside [-1, 1] due to floating-point
errors (e.g., dot products that should be in range but may be 1.0000001).

#### Example

```typescript
DeterministicMath.acosSafe(1.0001); // 0 (clamped to 1)
DeterministicMath.acosSafe(-1.001); // PI (clamped to -1)
DeterministicMath.acosSafe(0.5); // PI/3
```

#### See

[acos](#acos) for version that returns NaN for out-of-range inputs.

#### Since

0.1.0

---

### asin()

> `static` **asin**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:549](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L549)

Deterministic arc sine using trigonometric identity.
Uses the identity: asin(x) = atan2(x, sqrt(1-x²))

#### Parameters

##### x

`number`

Value in range [-1, 1].

#### Returns

`number`

Angle in radians [-PI/2, PI/2].

#### Remarks

**Mathematical basis:**
For a unit circle, if sin(θ) = x, then cos(θ) = ±sqrt(1-x²).
Since asin returns values in [-π/2, π/2], cos(θ) ≥ 0, so cos(θ) = sqrt(1-x²).
Therefore: θ = atan2(sin(θ), cos(θ)) = atan2(x, sqrt(1-x²))

#### Example

```typescript
DeterministicMath.asin(0); // 0
DeterministicMath.asin(1); // PI/2
DeterministicMath.asin(-1); // -PI/2
DeterministicMath.asin(0.5); // PI/6
```

#### See

[asinSafe](#asinsafe) for version that clamps input to [-1, 1].

#### Since

0.1.0

---

### asinSafe()

> `static` **asinSafe**(`x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:581](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L581)

Safe deterministic arc sine with input clamping.
Clamps input to [-1, 1] to avoid NaN for out-of-range values.

#### Parameters

##### x

`number`

Value to compute arc sine of (will be clamped to [-1, 1]).

#### Returns

`number`

Angle in radians [-PI/2, PI/2].

#### Example

```typescript
DeterministicMath.asinSafe(1.0001); // PI/2 (clamped to 1)
DeterministicMath.asinSafe(-1.001); // -PI/2 (clamped to -1)
DeterministicMath.asinSafe(0.5); // PI/6
```

#### See

[asin](#asin) for version that returns NaN for out-of-range inputs.

#### Since

0.1.0

---

### atan2()

> `static` **atan2**(`y`, `x`): `number`

Defined in: [src/deterministic/deterministic-math.ts:598](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L598)

Deterministic arc tangent with quadrant handling.
Delegates to Math.atan2 and quantizes the result to a fixed precision
so that equivalent inputs yield identical outputs across platforms.

#### Parameters

##### y

`number`

Y coordinate.

##### x

`number`

X coordinate.

#### Returns

`number`

Angle in radians [-PI, PI].

#### Since

0.1.0

---

### cos()

> `static` **cos**(`angle`): `number`

Defined in: [src/deterministic/deterministic-math.ts:308](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L308)

Deterministic cosine using lookup table with linear interpolation.

#### Parameters

##### angle

`number`

Angle in radians.

#### Returns

`number`

Cosine value.

#### Since

0.1.0

---

### sin()

> `static` **sin**(`angle`): `number`

Defined in: [src/deterministic/deterministic-math.ts:292](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L292)

Deterministic sine using lookup table with linear interpolation.

#### Parameters

##### angle

`number`

Angle in radians.

#### Returns

`number`

Sine value.

#### Since

0.1.0

---

### tan()

> `static` **tan**(`angle`): `number`

Defined in: [src/deterministic/deterministic-math.ts:324](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/deterministic/deterministic-math.ts#L324)

Deterministic tangent computed from sin/cos.

#### Parameters

##### angle

`number`

Angle in radians.

#### Returns

`number`

Tangent value.

#### Since

0.1.0
