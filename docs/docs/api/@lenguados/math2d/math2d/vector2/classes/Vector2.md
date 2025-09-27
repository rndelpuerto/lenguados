# Class: Vector2

Defined in: [src/vector2.ts:101](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L101)

Mutable, chainable two-dimensional vector with comprehensive operations for
arithmetic, geometry, transforms, comparisons and conversions.

## Remarks

- **Design:** Instance methods are *mutable* and chainable; static methods are *pure*
  with alloc‑free overloads that write into an `out` parameter (a common pattern in
  performance‑oriented math libs such as glMatrix). This minimizes allocations in hot paths.
- **Numerics:** Uses Math.hypot for robust length/distance calculations.
- **Safety:** “Safe” variants avoid throwing on degeneracies (e.g., zero length),
  returning zero vectors or no‑ops instead—useful in physics loops.

## Constructors

### Constructor

> **new Vector2**(): `Vector2`

Defined in: [src/vector2.ts:2151](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2151)

General constructor implementation.

#### Returns

`Vector2`

#### Param

Overloaded: number pair, tuple, POJO `{x,y}`, or Vector2.

#### Param

Y component when `a` is a number.

#### Throws

If the tuple has fewer than two elements.

#### Throws

If the POJO form has non‑numeric `x` or `y`.

#### Throws

If arguments are invalid for any overload.

### Constructor

> **new Vector2**(`x`, `y`): `Vector2`

Defined in: [src/vector2.ts:2153](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2153)

General constructor implementation.

#### Parameters

##### x

`number`

##### y

`number`

#### Returns

`Vector2`

#### Param

Overloaded: number pair, tuple, POJO `{x,y}`, or Vector2.

#### Param

Y component when `a` is a number.

#### Throws

If the tuple has fewer than two elements.

#### Throws

If the POJO form has non‑numeric `x` or `y`.

#### Throws

If arguments are invalid for any overload.

### Constructor

> **new Vector2**(`array`): `Vector2`

Defined in: [src/vector2.ts:2155](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2155)

General constructor implementation.

#### Parameters

##### array

\[`number`, `number`\]

#### Returns

`Vector2`

#### Param

Overloaded: number pair, tuple, POJO `{x,y}`, or Vector2.

#### Param

Y component when `a` is a number.

#### Throws

If the tuple has fewer than two elements.

#### Throws

If the POJO form has non‑numeric `x` or `y`.

#### Throws

If arguments are invalid for any overload.

### Constructor

> **new Vector2**(`object`): `Vector2`

Defined in: [src/vector2.ts:2157](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2157)

General constructor implementation.

#### Parameters

##### object

[`Vector2Like`](../type-aliases/Vector2Like.md)

#### Returns

`Vector2`

#### Param

Overloaded: number pair, tuple, POJO `{x,y}`, or Vector2.

#### Param

Y component when `a` is a number.

#### Throws

If the tuple has fewer than two elements.

#### Throws

If the POJO form has non‑numeric `x` or `y`.

#### Throws

If arguments are invalid for any overload.

### Constructor

> **new Vector2**(`vector`): `Vector2`

Defined in: [src/vector2.ts:2159](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2159)

General constructor implementation.

#### Parameters

##### vector

`Vector2`

#### Returns

`Vector2`

#### Param

Overloaded: number pair, tuple, POJO `{x,y}`, or Vector2.

#### Param

Y component when `a` is a number.

#### Throws

If the tuple has fewer than two elements.

#### Throws

If the POJO form has non‑numeric `x` or `y`.

#### Throws

If arguments are invalid for any overload.

## Properties

### x

> **x**: `number`

Defined in: [src/vector2.ts:2142](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2142)

X component.

***

### y

> **y**: `number`

Defined in: [src/vector2.ts:2144](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2144)

Y component.

***

### EPSILON\_VECTOR

> `readonly` `static` **EPSILON\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:116](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L116)

The `(EPSILON, EPSILON)` vector.

***

### INFINITY\_VECTOR

> `readonly` `static` **INFINITY\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:119](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L119)

The `( +∞, +∞ )` vector.

***

### NEGATIVE\_INFINITY\_VECTOR

> `readonly` `static` **NEGATIVE\_INFINITY\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:124](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L124)

The `( −∞, −∞ )` vector.

***

### NEGATIVE\_ONE\_VECTOR

> `readonly` `static` **NEGATIVE\_ONE\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:113](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L113)

The all-(-1) vector `(−1, −1)`.

***

### NEGATIVE\_UNIT\_DIAGONAL\_VECTOR

> `readonly` `static` **NEGATIVE\_UNIT\_DIAGONAL\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:146](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L146)

225° diagonal unit `(−1/√2, −1/√2)`.

***

### NEGATIVE\_UNIT\_X\_VECTOR

> `readonly` `static` **NEGATIVE\_UNIT\_X\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:135](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L135)

Unit vector along −X `(−1, 0)`.

***

### NEGATIVE\_UNIT\_Y\_VECTOR

> `readonly` `static` **NEGATIVE\_UNIT\_Y\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:138](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L138)

Unit vector along −Y `(0, −1)`.

***

### ONE\_VECTOR

> `readonly` `static` **ONE\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:110](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L110)

The all-ones vector `(1, 1)`.

***

### UNIT\_DIAGONAL\_VECTOR

> `readonly` `static` **UNIT\_DIAGONAL\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:141](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L141)

45° diagonal unit `(1/√2, 1/√2)`.

***

### UNIT\_X\_VECTOR

> `readonly` `static` **UNIT\_X\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:129](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L129)

Unit vector along +X `(1, 0)`.

***

### UNIT\_Y\_VECTOR

> `readonly` `static` **UNIT\_Y\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:132](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L132)

Unit vector along +Y `(0, 1)`.

***

### ZERO\_VECTOR

> `readonly` `static` **ZERO\_VECTOR**: `Readonly`\<`Vector2`\>

Defined in: [src/vector2.ts:107](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L107)

The zero/origin vector `(0, 0)`.

## Accessors

### absolute

#### Get Signature

> **get** **absolute**(): `Vector2`

Defined in: [src/vector2.ts:2807](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2807)

Absolute-value copy of this vector.

##### Returns

`Vector2`

A new Vector2 with absolute components.

***

### negated

#### Get Signature

> **get** **negated**(): `Vector2`

Defined in: [src/vector2.ts:2551](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2551)

Negated copy of this vector.

##### Returns

`Vector2`

A new Vector2 equal to `(-x, -y)`.

***

### normalized

#### Get Signature

> **get** **normalized**(): `Vector2`

Defined in: [src/vector2.ts:3006](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3006)

Unit-length copy of this vector (or `(0,0)` if zero).

##### Returns

`Vector2`

A new unit Vector2.

***

### xx

#### Get Signature

> **get** **xx**(): `Vector2`

Defined in: [src/vector2.ts:2245](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2245)

Swizzle `[x, x]` into a fresh Vector2.

##### Returns

`Vector2`

A new Vector2 equal to `(x, x)`.

***

### xy

#### Get Signature

> **get** **xy**(): `Vector2`

Defined in: [src/vector2.ts:2227](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2227)

Swizzle `[x, y]` into a fresh Vector2.

##### Returns

`Vector2`

A new Vector2 equal to `(x, y)`.

***

### yx

#### Get Signature

> **get** **yx**(): `Vector2`

Defined in: [src/vector2.ts:2236](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2236)

Swizzle `[y, x]` into a fresh Vector2.

##### Returns

`Vector2`

A new Vector2 equal to `(y, x)`.

***

### yy

#### Get Signature

> **get** **yy**(): `Vector2`

Defined in: [src/vector2.ts:2254](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2254)

Swizzle `[y, y]` into a fresh Vector2.

##### Returns

`Vector2`

A new Vector2 equal to `(y, y)`.

## Methods

### \[iterator\]()

> **\[iterator\]**(): `IterableIterator`\<`number`\>

Defined in: [src/vector2.ts:3482](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3482)

Enables array destructuring: `[...vector] → [x, y]`.

#### Returns

`IterableIterator`\<`number`\>

An iterator yielding `x` then `y`.

#### Example

```ts
const v = new Vector2(3, 4);
const [x, y] = [...v]; // x=3, y=4
```

***

### abs()

> **abs**(): `this`

Defined in: [src/vector2.ts:2795](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2795)

Applies Math.abs to both components.

#### Returns

`this`

`this` for chaining.

***

### add()

> **add**(`v`): `this`

Defined in: [src/vector2.ts:2368](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2368)

Adds `v` component‑wise to `this`.

#### Parameters

##### v

`Readonly`

Vector to add.

#### Returns

`this`

`this` for chaining.

***

### addScalar()

> **addScalar**(`s`): `this`

Defined in: [src/vector2.ts:2381](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2381)

Adds scalar `s` to both components.

#### Parameters

##### s

`number`

Scalar to add.

#### Returns

`this`

`this` for chaining.

***

### addScaledVector()

> **addScaledVector**(`v`, `scale`): `this`

Defined in: [src/vector2.ts:2562](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2562)

Adds a scaled vector: `this += scale * v`.

#### Parameters

##### v

`Readonly`

Vector to scale and add.

##### scale

`number`

Scale factor.

#### Returns

`this`

`this` for chaining.

***

### angle()

> **angle**(): `number`

Defined in: [src/vector2.ts:2720](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2720)

Heading (angle) in radians ∈ `[−π, π]`.

#### Returns

`number`

Angle in radians from the +X axis.

***

### angleBetween()

> **angleBetween**(`v`): `number`

Defined in: [src/vector2.ts:2740](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2740)

Smallest unsigned angle to `v` with numerical clamping.

#### Parameters

##### v

`Readonly`

Target vector.

#### Returns

`number`

The unsigned angle in radians.

***

### angleTo()

> **angleTo**(`v`): `number`

Defined in: [src/vector2.ts:2730](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2730)

Signed angle to `v` (positive if `v` is CCW).

#### Parameters

##### v

`Readonly`

Target vector.

#### Returns

`number`

The signed angle in radians.

***

### ceil()

> **ceil**(): `this`

Defined in: [src/vector2.ts:2771](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2771)

Applies Math.ceil to both components.

#### Returns

`this`

`this` for chaining.

***

### clamp()

> **clamp**(`min`, `max`): `this`

Defined in: [src/vector2.ts:2864](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2864)

Clamps each component between corresponding `min` and `max`.

#### Parameters

##### min

`Readonly`

Minimum per component.

##### max

`Readonly`

Maximum per component.

#### Returns

`this`

`this` for chaining.

***

### clampLength()

> **clampLength**(`minLength`, `maxLength`): `this`

Defined in: [src/vector2.ts:2892](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2892)

Clamps the length to `[minLength, maxLength]` using a single square root.

#### Parameters

##### minLength

`number`

Minimum magnitude (≥ 0).

##### maxLength

`number`

Maximum magnitude.

#### Returns

`this`

`this` for chaining.

***

### clampScalar()

> **clampScalar**(`min`, `max`): `this`

Defined in: [src/vector2.ts:2878](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2878)

Clamps both components between scalar `min` and `max`.

#### Parameters

##### min

`number`

Minimum scalar.

##### max

`number`

Maximum scalar.

#### Returns

`this`

`this` for chaining.

***

### clone()

> **clone**(): `Vector2`

Defined in: [src/vector2.ts:2218](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2218)

Creates a shallow clone of this vector.

#### Returns

`Vector2`

A new Vector2 with the same components.

***

### copy()

> **copy**(`other`): `this`

Defined in: [src/vector2.ts:2333](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2333)

Copies from another vector.

#### Parameters

##### other

`Readonly`

Source vector.

#### Returns

`this`

`this` for chaining.

***

### cross()

> **cross**(`v`): `number`

Defined in: [src/vector2.ts:2621](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2621)

2‑D scalar cross product with `v`.

#### Parameters

##### v

`Readonly`

Second operand.

#### Returns

`number`

The scalar cross product.

***

### cross3()

> **cross3**(`b`, `c`): `number`

Defined in: [src/vector2.ts:2632](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2632)

Twice the signed area of triangle `(this, b, c)`.

#### Parameters

##### b

`Readonly`

Second vertex.

##### c

`Readonly`

Third vertex.

#### Returns

`number`

Twice the signed area.

***

### crossScalarLeft()

> **crossScalarLeft**(`s`): `this`

Defined in: [src/vector2.ts:3324](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3324)

Box2D‑style cross product **scalar × vector** on `this`: `this = ( −s·y, s·x )`.

#### Parameters

##### s

`number`

Scalar factor.

#### Returns

`this`

`this` for chaining.

***

### crossScalarRight()

> **crossScalarRight**(`s`): `this`

Defined in: [src/vector2.ts:3309](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3309)

Box2D‑style cross product **vector × scalar** on `this`: `this = ( s·y, −s·x )`.

#### Parameters

##### s

`number`

Scalar factor.

#### Returns

`this`

`this` for chaining.

***

### directionTo()

> **directionTo**(`target`): `Vector2`

Defined in: [src/vector2.ts:2706](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2706)

Unit direction from `this` to `target`. Returns `(0,0)` if coincident.

#### Parameters

##### target

`Readonly`

Vector to point toward.

#### Returns

`Vector2`

A new Vector2 representing the unit direction.

***

### distanceTo()

> **distanceTo**(`v`): `number`

Defined in: [src/vector2.ts:2669](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2669)

Euclidean distance to `v`.

#### Parameters

##### v

`Readonly`

Target vector.

#### Returns

`number`

The Euclidean distance.

***

### distanceToSq()

> **distanceToSq**(`v`): `number`

Defined in: [src/vector2.ts:2679](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2679)

Squared Euclidean distance to `v`.

#### Parameters

##### v

`Readonly`

Target vector.

#### Returns

`number`

The squared distance.

***

### divide()

> **divide**(`v`): `this`

Defined in: [src/vector2.ts:2447](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2447)

Component-wise division by `v`.

#### Parameters

##### v

`Readonly`

Divisor vector.

#### Returns

`this`

`this` for chaining.

#### Throws

If any component of `v` is zero.

***

### divideSafe()

> **divideSafe**(`v`): `this`

Defined in: [src/vector2.ts:2479](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2479)

Safe component-wise division (|divisor| ≤ EPSILON → component becomes `0`).

#### Parameters

##### v

`Readonly`

Divisor vector.

#### Returns

`this`

`this` for chaining.

***

### divideScalar()

> **divideScalar**(`s`): `this`

Defined in: [src/vector2.ts:2464](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2464)

Scalar division `this /= s`.

#### Parameters

##### s

`number`

Non‑zero scalar divisor.

#### Returns

`this`

`this` for chaining.

#### Throws

If `s === 0`.

***

### divideScalarSafe()

> **divideScalarSafe**(`s`): `this`

Defined in: [src/vector2.ts:2492](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2492)

Safe scalar division (|`s`| ≤ EPSILON → `(0,0)`).

#### Parameters

##### s

`number`

Scalar divisor.

#### Returns

`this`

`this` for chaining.

***

### dot()

> **dot**(`v`): `number`

Defined in: [src/vector2.ts:2611](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2611)

Dot product with `v`.

#### Parameters

##### v

`Readonly`

Second operand.

#### Returns

`number`

The scalar dot product.

***

### equals()

> **equals**(`v`): `boolean`

Defined in: [src/vector2.ts:3365](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3365)

Strict component-wise equality with `v`.

#### Parameters

##### v

`Readonly`

Vector to compare.

#### Returns

`boolean`

`true` if components are identical; otherwise `false`.

***

### floor()

> **floor**(): `this`

Defined in: [src/vector2.ts:2759](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2759)

Applies Math.floor to both components.

#### Returns

`this`

`this` for chaining.

***

### getComponent()

> **getComponent**(`index`): `number`

Defined in: [src/vector2.ts:2209](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2209)

Returns a component by index.

#### Parameters

##### index

`0` for `x`, `1` for `y`.

`0` | `1`

#### Returns

`number`

The selected component value.

***

### hashCode()

> **hashCode**(): `number`

Defined in: [src/vector2.ts:3508](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3508)

Computes a fast 32‑bit unsigned hash of this vector’s components.

#### Returns

`number`

A 32‑bit unsigned integer hash (not cryptographically secure).

***

### inverse()

> **inverse**(): `this`

Defined in: [src/vector2.ts:2817](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2817)

Component-wise reciprocal.

#### Returns

`this`

`this` for chaining.

#### Throws

If any component is zero.

***

### inverseSafe()

> **inverseSafe**(): `this`

Defined in: [src/vector2.ts:2832](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2832)

Safe reciprocal (|component| ≤ EPSILON → `0`).

#### Returns

`this`

`this` for chaining.

***

### isFinite()

> **isFinite**(): `boolean`

Defined in: [src/vector2.ts:3397](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3397)

Tests whether both components are finite numbers.

#### Returns

`boolean`

`true` if both components are finite; otherwise `false`.

***

### isParallelTo()

> **isParallelTo**(`v`, `epsilon`): `boolean`

Defined in: [src/vector2.ts:3408](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3408)

Parallelism test against `v` using `epsilon` tolerance.

#### Parameters

##### v

`Readonly`

Vector to compare.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

`true` if vectors are parallel within tolerance; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

***

### isPerpendicularTo()

> **isPerpendicularTo**(`v`, `epsilon`): `boolean`

Defined in: [src/vector2.ts:3419](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3419)

Perpendicularity test against `v` using `epsilon` tolerance.

#### Parameters

##### v

`Readonly`

Vector to compare.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

`true` if vectors are perpendicular within tolerance; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

***

### isUnit()

> **isUnit**(): `boolean`

Defined in: [src/vector2.ts:3388](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3388)

Tests whether this vector has unit length within `EPSILON`.

#### Returns

`boolean`

`true` if `|length() − 1| ≤ EPSILON`; otherwise `false`.

***

### isZero()

> **isZero**(): `boolean`

Defined in: [src/vector2.ts:3342](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3342)

Tests whether this vector is exactly `(0,0)`.

#### Returns

`boolean`

`true` if `x === 0` and `y === 0`; otherwise `false`.

***

### length()

> **length**(): `number`

Defined in: [src/vector2.ts:2641](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2641)

Euclidean length `||this||`.

#### Returns

`number`

The Euclidean norm of this vector.

***

### lengthSq()

> **lengthSq**(): `number`

Defined in: [src/vector2.ts:2650](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2650)

Squared length `||this||²`.

#### Returns

`number`

The squared length of this vector.

***

### lerp()

> **lerp**(`end`, `t`): `this`

Defined in: [src/vector2.ts:2580](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2580)

Linear interpolation towards `end` by factor `t` (no clamping).

#### Parameters

##### end

`Readonly`

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

`this` for chaining.

***

### lerpClamped()

> **lerpClamped**(`end`, `t`): `this`

Defined in: [src/vector2.ts:2594](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2594)

Linear interpolation with `t` clamped to `[0, 1]`.

#### Parameters

##### end

`Readonly`

Target vector.

##### t

`number`

Interpolation factor.

#### Returns

`this`

`this` for chaining.

***

### limit()

> **limit**(`maxLength`): `this`

Defined in: [src/vector2.ts:2920](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2920)

Limits the length to `maxLength`.

#### Parameters

##### maxLength

`number`

Maximum allowed magnitude (≥ 0).

#### Returns

`this`

`this` for chaining.

***

### manhattanDistanceTo()

> **manhattanDistanceTo**(`v`): `number`

Defined in: [src/vector2.ts:2692](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2692)

Manhattan distance to `v`.

#### Parameters

##### v

`Readonly`

Target vector.

#### Returns

`number`

The Manhattan distance.

***

### manhattanLength()

> **manhattanLength**(): `number`

Defined in: [src/vector2.ts:2659](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2659)

Manhattan length.

#### Returns

`number`

`|x| + |y|`.

***

### max()

> **max**(`v`): `this`

Defined in: [src/vector2.ts:2952](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2952)

Component-wise maximum with `v`.

#### Parameters

##### v

`Readonly`

Other vector.

#### Returns

`this`

`this` for chaining.

***

### midpoint()

> **midpoint**(`v`): `this`

Defined in: [src/vector2.ts:3277](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3277)

Sets this vector to the midpoint between itself and `v`.

#### Parameters

##### v

`Readonly`

The other vector.

#### Returns

`this`

`this` for chaining.

***

### min()

> **min**(`v`): `this`

Defined in: [src/vector2.ts:2939](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2939)

Component-wise minimum with `v`.

#### Parameters

##### v

`Readonly`

Other vector.

#### Returns

`this`

`this` for chaining.

***

### mod()

> **mod**(`v`): `this`

Defined in: [src/vector2.ts:2508](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2508)

Component-wise remainder.

#### Parameters

##### v

`Readonly`

Divisor vector (non-zero components).

#### Returns

`this`

`this` for chaining.

#### Throws

If any component of `v` is zero.

***

### modScalar()

> **modScalar**(`s`): `this`

Defined in: [src/vector2.ts:2525](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2525)

Scalar remainder.

#### Parameters

##### s

`number`

Non‑zero scalar divisor.

#### Returns

`this`

`this` for chaining.

#### Throws

If `s === 0`.

***

### multiply()

> **multiply**(`v`): `this`

Defined in: [src/vector2.ts:2420](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2420)

Multiplies `this` by `v` component‑wise.

#### Parameters

##### v

`Readonly`

Vector multiplier.

#### Returns

`this`

`this` for chaining.

***

### multiplyScalar()

> **multiplyScalar**(`s`): `this`

Defined in: [src/vector2.ts:2433](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2433)

Scales `this` by scalar `s`.

#### Parameters

##### s

`number`

Scale factor.

#### Returns

`this`

`this` for chaining.

***

### nearEquals()

> **nearEquals**(`v`, `epsilon`): `boolean`

Defined in: [src/vector2.ts:3377](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3377)

Approximate component-wise equality with tolerance.

#### Parameters

##### v

`Readonly`

Vector to compare.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance.

#### Returns

`boolean`

`true` if both component differences are within `epsilon`; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

#### Throws

If `epsilon < 0`.

***

### nearZero()

> **nearZero**(`epsilon`): `boolean`

Defined in: [src/vector2.ts:3353](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3353)

Tests whether both components are within `epsilon` of `0`.

#### Parameters

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance.

#### Returns

`boolean`

`true` if both components are within tolerance; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

#### Throws

If `epsilon < 0`.

***

### negate()

> **negate**(): `this`

Defined in: [src/vector2.ts:2539](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2539)

Negates both components in place.

#### Returns

`this`

`this` for chaining.

***

### normalize()

> **normalize**(): `this`

Defined in: [src/vector2.ts:2969](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2969)

Normalizes this vector to unit length.

#### Returns

`this`

`this` for chaining.

#### Throws

If this vector has zero length.

***

### normalizeSafe()

> **normalizeSafe**(): `this`

Defined in: [src/vector2.ts:2985](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2985)

Safe normalization. If zero length, becomes `(0,0)`.

#### Returns

`this`

`this` for chaining.

***

### perpendicular()

> **perpendicular**(`clockwise`): `this`

Defined in: [src/vector2.ts:3164](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3164)

Rotates this vector by ±90° while keeping its magnitude.

#### Parameters

##### clockwise

`boolean` = `false`

`true` for CW; `false` for CCW.

#### Returns

`this`

`this` for chaining.

#### Default Value

`false`

***

### project()

> **project**(`axis`): `this`

Defined in: [src/vector2.ts:3081](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3081)

Projects this vector onto `axis`. If `axis` is zero, sets `(0,0)`.

#### Parameters

##### axis

`Readonly`

Projection axis.

#### Returns

`this`

`this` for chaining.

***

### projectOnUnit()

> **projectOnUnit**(`unitAxis`): `this`

Defined in: [src/vector2.ts:3113](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3113)

Projects this vector onto a **unit** axis.

#### Parameters

##### unitAxis

`Readonly`

Unit-length axis of projection.

#### Returns

`this`

`this` for chaining.

***

### projectSafe()

> **projectSafe**(`axis`): `this`

Defined in: [src/vector2.ts:3097](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3097)

Safe projection (axis near zero → sets `(0,0)`).

#### Parameters

##### axis

`Readonly`

Projection axis.

#### Returns

`this`

`this` for chaining.

***

### reflect()

> **reflect**(`unitNormal`): `this`

Defined in: [src/vector2.ts:3125](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3125)

Reflects this vector about a **unit** normal.

#### Parameters

##### unitNormal

`Readonly`

Unit-length normal to reflect about.

#### Returns

`this`

`this` for chaining.

***

### reflectSafe()

> **reflectSafe**(`normal`): `this`

Defined in: [src/vector2.ts:3140](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3140)

Safe reflection (normal is normalized internally; near‑zero normal → no‑op).

#### Parameters

##### normal

`Readonly`

Normal (need not be unitary).

#### Returns

`this`

`this` for chaining.

***

### reject()

> **reject**(`onto`): `this`

Defined in: [src/vector2.ts:3290](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3290)

Replaces this vector by its rejection from `onto`: `this -= proj_onto(this)`.

#### Parameters

##### onto

`Readonly`

Axis of projection.

#### Returns

`this`

`this` for chaining.

***

### rotate()

> **rotate**(`angle`): `this`

Defined in: [src/vector2.ts:3218](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3218)

Rotates this vector by `angle` radians.

#### Parameters

##### angle

`number`

Rotation angle in radians.

#### Returns

`this`

`this` for chaining.

***

### rotateAround()

> **rotateAround**(`center`, `angle`): `this`

Defined in: [src/vector2.ts:3255](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3255)

Rotates this vector around `center` by `angle`.

#### Parameters

##### center

`Readonly`

Center of rotation.

##### angle

`number`

Rotation angle in radians.

#### Returns

`this`

`this` for chaining.

***

### rotateAroundCS()

> **rotateAroundCS**(`center`, `c`, `s`): `this`

Defined in: [src/vector2.ts:3267](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3267)

Rotates this vector around `center` using precomputed `cos`/`sin`.

#### Parameters

##### center

`Readonly`

Center of rotation.

##### c

`number`

Cosine of the angle.

##### s

`number`

Sine of the angle.

#### Returns

`this`

`this` for chaining.

***

### rotateCS()

> **rotateCS**(`c`, `s`): `this`

Defined in: [src/vector2.ts:3238](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3238)

Rotates this vector using precomputed `cos`/`sin`.

#### Parameters

##### c

`number`

Cosine of the angle.

##### s

`number`

Sine of the angle.

#### Returns

`this`

`this` for chaining.

***

### round()

> **round**(): `this`

Defined in: [src/vector2.ts:2783](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2783)

Applies Math.round to both components.

#### Returns

`this`

`this` for chaining.

***

### set()

> **set**(`x`, `y`): `this`

Defined in: [src/vector2.ts:2269](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2269)

Assigns both components.

#### Parameters

##### x

`number`

New `x` component.

##### y

`number`

New `y` component.

#### Returns

`this`

`this` for chaining.

***

### setComponent()

> **setComponent**(`index`, `value`): `this`

Defined in: [src/vector2.ts:2283](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2283)

Assigns a component by index.

#### Parameters

##### index

`0` for X, `1` for Y.

`0` | `1`

##### value

`number`

New value.

#### Returns

`this`

`this` for chaining.

***

### setHeading()

> **setHeading**(`angle`): `this`

Defined in: [src/vector2.ts:3066](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3066)

Sets heading (angle) while preserving length.

#### Parameters

##### angle

`number`

New heading in radians.

#### Returns

`this`

`this` for chaining.

***

### setLength()

> **setLength**(`newLength`): `this`

Defined in: [src/vector2.ts:3019](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3019)

Sets this vector’s length (throws if negative or zero length).

#### Parameters

##### newLength

`number`

Desired magnitude (≥ 0).

#### Returns

`this`

`this` for chaining.

#### Throws

If `newLength < 0` or this vector is zero-length.

***

### setLengthSafe()

> **setLengthSafe**(`newLength`): `this`

Defined in: [src/vector2.ts:3041](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3041)

Safe setLength. Negative `newLength` is clamped to `0`. Zero vectors become `(newLength, 0)`.

#### Parameters

##### newLength

`number`

Desired magnitude (non‑negative).

#### Returns

`this`

`this` for chaining.

***

### setScalar()

> **setScalar**(`s`): `this`

Defined in: [src/vector2.ts:2320](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2320)

Sets both components to the same scalar.

#### Parameters

##### s

`number`

Scalar value assigned to both `x` and `y`.

#### Returns

`this`

`this` for chaining.

***

### setX()

> **setX**(`x`): `this`

Defined in: [src/vector2.ts:2296](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2296)

Sets `x`.

#### Parameters

##### x

`number`

New `x` value.

#### Returns

`this`

`this` for chaining.

***

### setY()

> **setY**(`y`): `this`

Defined in: [src/vector2.ts:2308](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2308)

Sets `y`.

#### Parameters

##### y

`number`

New `y` value.

#### Returns

`this`

`this` for chaining.

***

### sub()

> **sub**(`v`): `this`

Defined in: [src/vector2.ts:2394](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2394)

Subtracts `v` component‑wise from `this`.

#### Parameters

##### v

`Readonly`

Vector to subtract.

#### Returns

`this`

`this` for chaining.

***

### subScalar()

> **subScalar**(`s`): `this`

Defined in: [src/vector2.ts:2407](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2407)

Subtracts scalar `s` from both components.

#### Parameters

##### s

`number`

Scalar to subtract.

#### Returns

`this`

`this` for chaining.

***

### sumComponents()

> **sumComponents**(): `number`

Defined in: [src/vector2.ts:2358](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2358)

Returns the sum of components `x + y`.

#### Returns

`number`

The scalar sum of components.

***

### swap()

> **swap**(): `this`

Defined in: [src/vector2.ts:2844](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2844)

Swaps `x` and `y`.

#### Returns

`this`

`this` for chaining.

***

### toArray()

> **toArray**\<`T`\>(`outArray`, `offset`): `T`

Defined in: [src/vector2.ts:3461](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3461)

Writes this vector’s components into an array or typed array.

#### Type Parameters

##### T

`T` *extends* `number`[] \| `Float32Array`\<`ArrayBufferLike`\>

`number[]` or `Float32Array`.

#### Parameters

##### outArray

`T` = `...`

Destination array.

##### offset

`number` = `0`

Index at which to write `x` and `y`.

#### Returns

`T`

The `outArray` reference for chaining.

#### Default Value

a new `number[]`

#### Default Value

`0`

#### Example

```ts
const v = new Vector2(5, 7);
const arr = v.toArray();           // [5, 7]
const buf = new Float32Array(4);
v.toArray(buf, 2);                  // buf = [0, 0, 5, 7]
```

***

### toJSON()

> **toJSON**(): `object`

Defined in: [src/vector2.ts:3432](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3432)

Returns a plain object for JSON serialization.

#### Returns

`object`

An object literal `{ x, y }`.

##### x

> **x**: `number`

##### y

> **y**: `number`

***

### toObject()

> **toObject**(): `object`

Defined in: [src/vector2.ts:3441](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3441)

Alias for [toJSON](#tojson) with explicit semantics.

#### Returns

`object`

An object literal `{ x, y }`.

##### x

> **x**: `number`

##### y

> **y**: `number`

***

### toString()

> **toString**(`precision?`): `string`

Defined in: [src/vector2.ts:3493](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3493)

Returns a string representation `"x,y"`.

#### Parameters

##### precision?

`number`

Optional number of decimal places for each component.

#### Returns

`string`

The formatted string.

***

### unitPerpendicular()

> **unitPerpendicular**(`clockwise`): `this`

Defined in: [src/vector2.ts:3185](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3185)

Rotates this vector by ±90° and normalizes it to unit length.

#### Parameters

##### clockwise

`boolean` = `false`

`true` for CW; `false` for CCW.

#### Returns

`this`

`this` for chaining.

#### Default Value

`false`

#### Throws

If this vector has zero length.

***

### unitPerpendicularSafe()

> **unitPerpendicularSafe**(`clockwise`): `this`

Defined in: [src/vector2.ts:3201](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L3201)

Safe unit perpendicular (zero vectors become `(-1,0)` or `(1,0)` depending on `clockwise`).

#### Parameters

##### clockwise

`boolean` = `false`

`true` for CW; `false` for CCW.

#### Returns

`this`

`this` for chaining.

#### Default Value

`false`

***

### zero()

> **zero**(): `this`

Defined in: [src/vector2.ts:2342](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2342)

Resets both components to zero.

#### Returns

`this`

`this` for chaining.

***

### abs()

#### Call Signature

> `static` **abs**(`v`): `Vector2`

Defined in: [src/vector2.ts:1086](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1086)

Applies Math.abs to both components.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new Vector2 with absolute components.

#### Call Signature

> `static` **abs**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1094](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1094)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### add()

#### Call Signature

> `static` **add**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:388](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L388)

Component-wise addition `a + b`.

##### Parameters

###### a

`Readonly`

First addend.

###### b

`Readonly`

Second addend.

##### Returns

`Vector2`

A new Vector2 equal to `(a.x + b.x, a.y + b.y)`.

#### Call Signature

> `static` **add**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:397](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L397)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

First addend.

###### b

`Readonly`

Second addend.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### addScalar()

#### Call Signature

> `static` **addScalar**(`v`, `s`): `Vector2`

Defined in: [src/vector2.ts:413](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L413)

Adds a scalar to both components `v + s`.

##### Parameters

###### v

`Readonly`

Source vector.

###### s

`number`

Scalar addend.

##### Returns

`Vector2`

A new Vector2 equal to `(v.x + s, v.y + s)`.

#### Call Signature

> `static` **addScalar**(`v`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:422](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L422)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### s

`number`

Scalar addend.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### addScaledVector()

#### Call Signature

> `static` **addScaledVector**(`base`, `scaled`, `scale`): `Vector2`

Defined in: [src/vector2.ts:742](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L742)

Adds a scaled vector: `base + scale * scaled`.

##### Parameters

###### base

`Readonly`

Base vector.

###### scaled

`Readonly`

Vector to scale and add.

###### scale

`number`

Scale factor.

##### Returns

`Vector2`

A new Vector2 equal to `(base + scaled * scale)`.

##### Example

```ts
velocity = Vector2.addScaledVector(velocity, acceleration, dt);
```

#### Call Signature

> `static` **addScaledVector**(`base`, `scaled`, `scale`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:756](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L756)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### base

`Readonly`

Base vector.

###### scaled

`Readonly`

Vector to scale and add.

###### scale

`number`

Scale factor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### angle()

> `static` **angle**(`v`): `number`

Defined in: [src/vector2.ts:983](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L983)

Heading (angle) of `v` from the +X axis in radians ∈ `[−π, π]`.

#### Parameters

##### v

`Readonly`

Vector to measure.

#### Returns

`number`

Angle in radians in the range `[−π, π]`.

***

### angleBetween()

> `static` **angleBetween**(`a`, `b`): `number`

Defined in: [src/vector2.ts:1009](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1009)

Smallest unsigned angle between `a` and `b` in radians ∈ `[0, π]`.

#### Parameters

##### a

`Readonly`

First vector.

##### b

`Readonly`

Second vector.

#### Returns

`number`

The unsigned angle in radians.

#### Remarks

Clamps the cosine to `[-1, 1]` to avoid `NaN` due to floating‑point error.

***

### angleTo()

> `static` **angleTo**(`a`, `b`): `number`

Defined in: [src/vector2.ts:996](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L996)

Signed angle from `a` to `b` in radians (positive if `b` is CCW from `a`).

#### Parameters

##### a

`Readonly`

Start vector.

##### b

`Readonly`

End vector.

#### Returns

`number`

The signed angle in radians.

#### Remarks

Uses `atan2(cross(a,b), dot(a,b))` for robust behavior.

***

### ceil()

#### Call Signature

> `static` **ceil**(`v`): `Vector2`

Defined in: [src/vector2.ts:1048](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1048)

Applies Math.ceil to both components.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new ceiled Vector2.

#### Call Signature

> `static` **ceil**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1056](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1056)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### clamp()

#### Call Signature

> `static` **clamp**(`v`, `min`, `max`): `Vector2`

Defined in: [src/vector2.ts:1179](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1179)

Clamps each component between the corresponding components of `min` and `max`.

##### Parameters

###### v

`Readonly`

Vector to clamp.

###### min

`Readonly`

Per-component minima.

###### max

`Readonly`

Per-component maxima.

##### Returns

`Vector2`

A new clamped Vector2.

##### Remarks

If `min` > `max` on a component, behavior follows `Math.min(Math.max(x, min), max)`.

#### Call Signature

> `static` **clamp**(`v`, `min`, `max`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1189](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1189)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to clamp.

###### min

`Readonly`

Per-component minima.

###### max

`Readonly`

Per-component maxima.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### clampLength()

#### Call Signature

> `static` **clampLength**(`v`, `minLength`, `maxLength`): `Vector2`

Defined in: [src/vector2.ts:1250](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1250)

Clamps the vector length to the range `[minLength, maxLength]` using a single square root.

##### Parameters

###### v

`Readonly`

Vector to clamp.

###### minLength

`number`

Minimum magnitude (≥ 0).

###### maxLength

`number`

Maximum magnitude.

##### Returns

`Vector2`

A new Vector2 with clamped magnitude.

##### Remarks

Avoids redundant normalization to reduce cost in hot‑paths.

#### Call Signature

> `static` **clampLength**(`v`, `minLength`, `maxLength`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1260](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1260)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to clamp.

###### minLength

`number`

Minimum magnitude (≥ 0).

###### maxLength

`number`

Maximum magnitude.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### clampScalar()

#### Call Signature

> `static` **clampScalar**(`v`, `min`, `max`): `Vector2`

Defined in: [src/vector2.ts:1215](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1215)

Clamps both components between scalar `min` and `max`.

##### Parameters

###### v

`Readonly`

Vector to clamp.

###### min

`number`

Minimum scalar.

###### max

`number`

Maximum scalar.

##### Returns

`Vector2`

A new clamped Vector2.

#### Call Signature

> `static` **clampScalar**(`v`, `min`, `max`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1225](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1225)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to clamp.

###### min

`number`

Minimum scalar.

###### max

`number`

Maximum scalar.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### clone()

> `static` **clone**(`source`): `Vector2`

Defined in: [src/vector2.ts:160](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L160)

Creates a deep copy of `source`.

#### Parameters

##### source

`Readonly`

Vector to clone.

#### Returns

`Vector2`

A new Vector2 instance with identical components.

***

### copy()

> `static` **copy**(`source`, `destination`): `Vector2`

Defined in: [src/vector2.ts:171](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L171)

Copies component values from `source` into `destination` (alloc‑free).

#### Parameters

##### source

`Readonly`

Source vector.

##### destination

`Vector2`

Target vector to receive the copy.

#### Returns

`Vector2`

The `destination` vector (for chaining).

***

### cross()

> `static` **cross**(`a`, `b`): `number`

Defined in: [src/vector2.ts:860](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L860)

2‑D scalar cross product (z‑component): `a.x*b.y − a.y*b.x`.

#### Parameters

##### a

`Readonly`

First operand.

##### b

`Readonly`

Second operand.

#### Returns

`number`

The scalar cross product (signed area magnitude).

***

### cross3()

> `static` **cross3**(`a`, `b`, `c`): `number`

Defined in: [src/vector2.ts:872](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L872)

Twice the signed area of triangle `(a, b, c)`.

#### Parameters

##### a

`Readonly`

First vertex.

##### b

`Readonly`

Second vertex.

##### c

`Readonly`

Third vertex.

#### Returns

`number`

Twice the signed area (can be negative).

***

### crossSV()

#### Call Signature

> `static` **crossSV**(`s`, `a`): `Vector2`

Defined in: [src/vector2.ts:2008](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2008)

Box2D‑style cross product **scalar × vector**: `s × a = ( −s·a.y, s·a.x )`.

##### Parameters

###### s

`number`

Scalar factor.

###### a

`Readonly`

Source vector.

##### Returns

`Vector2`

A new Vector2 equal to the perpendicular scaled vector.

#### Call Signature

> `static` **crossSV**(`s`, `a`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:2017](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2017)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### s

`number`

Scalar factor.

###### a

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### crossVS()

#### Call Signature

> `static` **crossVS**(`a`, `s`): `Vector2`

Defined in: [src/vector2.ts:1987](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1987)

Box2D‑style cross product **vector × scalar**: `a × s = ( s·a.y, −s·a.x )`.

##### Parameters

###### a

`Readonly`

Source vector.

###### s

`number`

Scalar factor.

##### Returns

`Vector2`

A new Vector2 equal to the perpendicular scaled vector.

#### Call Signature

> `static` **crossVS**(`a`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1996](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1996)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Source vector.

###### s

`number`

Scalar factor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### direction()

#### Call Signature

> `static` **direction**(`from`, `to`): `Vector2`

Defined in: [src/vector2.ts:955](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L955)

Unit direction from `from` to `to`. Returns `(0,0)` if both points coincide.

##### Parameters

###### from

`Readonly`

Start point.

###### to

`Readonly`

End point.

##### Returns

`Vector2`

A new unit Vector2 representing the direction.

##### Remarks

This implementation is **alloc‑free** and writes directly into `outVector` when provided.

#### Call Signature

> `static` **direction**(`from`, `to`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:964](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L964)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### from

`Readonly`

Start point.

###### to

`Readonly`

End point.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### distance()

> `static` **distance**(`a`, `b`): `number`

Defined in: [src/vector2.ts:913](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L913)

Euclidean distance between `a` and `b`.

#### Parameters

##### a

`Readonly`

First point.

##### b

`Readonly`

Second point.

#### Returns

`number`

The Euclidean distance.

***

### distanceSq()

> `static` **distanceSq**(`a`, `b`): `number`

Defined in: [src/vector2.ts:924](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L924)

Squared Euclidean distance between `a` and `b`.

#### Parameters

##### a

`Readonly`

First point.

##### b

`Readonly`

Second point.

#### Returns

`number`

The squared Euclidean distance.

***

### divide()

#### Call Signature

> `static` **divide**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:539](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L539)

Component-wise division `a / b`.

##### Parameters

###### a

`Readonly`

Numerator vector.

###### b

`Readonly`

Divisor vector.

##### Returns

`Vector2`

A new Vector2 equal to `(a.x / b.x, a.y / b.y)`.

##### Throws

If any component of `b` is zero.

#### Call Signature

> `static` **divide**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:549](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L549)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Numerator vector.

###### b

`Readonly`

Divisor vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If any component of `b` is zero.

***

### divideSafe()

#### Call Signature

> `static` **divideSafe**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:600](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L600)

Safe component-wise division. Components with |divisor| ≤ [EPSILON](../../scalar/variables/EPSILON.md) yield `0`.

##### Parameters

###### a

`Readonly`

Numerator vector.

###### b

`Readonly`

Divisor vector.

##### Returns

`Vector2`

A new Vector2 with safe division per component.

#### Call Signature

> `static` **divideSafe**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:609](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L609)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Numerator vector.

###### b

`Readonly`

Divisor vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### divideScalar()

#### Call Signature

> `static` **divideScalar**(`v`, `s`): `Vector2`

Defined in: [src/vector2.ts:570](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L570)

Scalar division `v / s`.

##### Parameters

###### v

`Readonly`

Vector to divide.

###### s

`number`

Non‑zero scalar divisor.

##### Returns

`Vector2`

A new Vector2 equal to `(v.x / s, v.y / s)`.

##### Throws

If `s === 0`.

#### Call Signature

> `static` **divideScalar**(`v`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:580](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L580)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to divide.

###### s

`number`

Non‑zero scalar divisor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If `s === 0`.

***

### divideScalarSafe()

#### Call Signature

> `static` **divideScalarSafe**(`v`, `s`): `Vector2`

Defined in: [src/vector2.ts:628](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L628)

Safe scalar division. If |`s`| ≤ [EPSILON](../../scalar/variables/EPSILON.md), returns `(0,0)`.

##### Parameters

###### v

`Readonly`

Vector to divide.

###### s

`number`

Scalar divisor.

##### Returns

`Vector2`

A new Vector2 containing the safe division.

#### Call Signature

> `static` **divideScalarSafe**(`v`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:637](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L637)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to divide.

###### s

`number`

Scalar divisor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### dot()

> `static` **dot**(`a`, `b`): `number`

Defined in: [src/vector2.ts:849](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L849)

Dot product `a·b = a.x*b.x + a.y*b.y`.

#### Parameters

##### a

`Readonly`

First operand.

##### b

`Readonly`

Second operand.

#### Returns

`number`

The scalar dot product.

***

### equals()

> `static` **equals**(`a`, `b`): `boolean`

Defined in: [src/vector2.ts:2057](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2057)

Strict component-wise equality.

#### Parameters

##### a

`Readonly`

First vector.

##### b

`Readonly`

Second vector.

#### Returns

`boolean`

`true` if components are identical; otherwise `false`.

***

### floor()

#### Call Signature

> `static` **floor**(`v`): `Vector2`

Defined in: [src/vector2.ts:1029](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1029)

Applies Math.floor to both components.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new floored Vector2.

#### Call Signature

> `static` **floor**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1037](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1037)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### fromAngle()

#### Call Signature

> `static` **fromAngle**(`angle`, `length?`): `Vector2`

Defined in: [src/vector2.ts:268](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L268)

Creates a vector from polar coordinates.

##### Parameters

###### angle

`number`

Angle in radians.

###### length?

`number`

Magnitude.

##### Returns

`Vector2`

A new Vector2 positioned at the given angle and length.

##### Default Value

`1`

##### Example

```ts
Vector2.fromAngle(Math.PI / 2, 2); // -> (0, 2)
```

#### Call Signature

> `static` **fromAngle**(`angle`, `length`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:277](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L277)

Alloc‑free overload writing into `outVector`.

##### Parameters

###### angle

`number`

Angle in radians.

###### length

`number`

Magnitude.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### fromArray()

#### Call Signature

> `static` **fromArray**(`sourceArray`, `offset?`): `Vector2`

Defined in: [src/vector2.ts:201](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L201)

Creates a vector from a flat numeric array.

##### Parameters

###### sourceArray

`ArrayLike`\<`number`\>

Numeric array with at least two elements.

###### offset?

`number`

Index of the **x** component.

##### Returns

`Vector2`

A new Vector2 initialized from the array.

##### Default Value

`0`

##### Throws

If `offset` is out of bounds for `sourceArray`.

##### Example

```ts
const v = Vector2.fromArray([10, 20, 30]);     // -> (10, 20)
const w = Vector2.fromArray([10, 20, 30], 1); // -> (20, 30)
```

#### Call Signature

> `static` **fromArray**(`sourceArray`, `offset`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:212](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L212)

Alloc‑free overload that writes into `outVector`.

##### Parameters

###### sourceArray

`ArrayLike`\<`number`\>

Numeric array with at least two elements.

###### offset

`number`

Index of the **x** component.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Default Value

`0`

##### Throws

If `offset` is out of bounds for `sourceArray`.

***

### fromObject()

#### Call Signature

> `static` **fromObject**(`object`): `Vector2`

Defined in: [src/vector2.ts:238](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L238)

Creates a vector from a plain object `{ x, y }`.

##### Parameters

###### object

[`Vector2Like`](../type-aliases/Vector2Like.md)

Plain object with numeric `x` and `y`.

##### Returns

`Vector2`

A new Vector2.

##### Throws

If `object.x` or `object.y` is not a number.

#### Call Signature

> `static` **fromObject**(`object`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:247](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L247)

Alloc‑free overload that writes into `outVector`.

##### Parameters

###### object

[`Vector2Like`](../type-aliases/Vector2Like.md)

Plain object with numeric `x` and `y`.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If `object.x` or `object.y` is not a number.

***

### fromValues()

> `static` **fromValues**(`x`, `y`): `Vector2`

Defined in: [src/vector2.ts:182](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L182)

Constructs a vector from explicit components.

#### Parameters

##### x

`number`

X component.

##### y

`number`

Y component.

#### Returns

`Vector2`

A new Vector2 with components `(x, y)`.

***

### hashCode()

> `static` **hashCode**(`v`): `number`

Defined in: [src/vector2.ts:2130](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2130)

Computes a fast, deterministic 32‑bit unsigned hash from the vector components.

#### Parameters

##### v

`Readonly`

Vector to hash.

#### Returns

`number`

A 32‑bit unsigned integer hash (not cryptographically secure).

***

### inverse()

#### Call Signature

> `static` **inverse**(`v`): `Vector2`

Defined in: [src/vector2.ts:1106](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1106)

Component-wise reciprocal `(1/x, 1/y)`.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new inverted Vector2.

##### Throws

If any component is zero.

#### Call Signature

> `static` **inverse**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1115](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1115)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If any component is zero.

***

### inverseSafe()

#### Call Signature

> `static` **inverseSafe**(`v`): `Vector2`

Defined in: [src/vector2.ts:1130](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1130)

Safe reciprocal. Components with |value| ≤ [EPSILON](../../scalar/variables/EPSILON.md) become `0`.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new Vector2 with safe reciprocals.

#### Call Signature

> `static` **inverseSafe**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1138](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1138)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### isFinite()

> `static` **isFinite**(`v`): `boolean`

Defined in: [src/vector2.ts:2092](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2092)

Tests whether both components are finite numbers.

#### Parameters

##### v

`Readonly`

Vector to test.

#### Returns

`boolean`

`true` if `Number.isFinite(x)` and `Number.isFinite(y)`; otherwise `false`.

***

### isParallel()

> `static` **isParallel**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/vector2.ts:2104](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2104)

Parallelism test: `|cross(a,b)| ≤ epsilon`.

#### Parameters

##### a

`Readonly`

First vector.

##### b

`Readonly`

Second vector.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

`true` if vectors are parallel within tolerance; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

***

### isPerpendicular()

> `static` **isPerpendicular**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/vector2.ts:2116](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2116)

Perpendicularity test: `|dot(a,b)| ≤ epsilon`.

#### Parameters

##### a

`Readonly`

First vector.

##### b

`Readonly`

Second vector.

##### epsilon

`number` = `EPSILON`

Tolerance.

#### Returns

`boolean`

`true` if vectors are perpendicular within tolerance; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

***

### isUnit()

> `static` **isUnit**(`v`): `boolean`

Defined in: [src/vector2.ts:2082](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2082)

Tests whether `| length(v) − 1 | ≤ EPSILON`.

#### Parameters

##### v

`Readonly`

Vector to test.

#### Returns

`boolean`

`true` if `v` is unit length; otherwise `false`.

***

### isZero()

> `static` **isZero**(`v`): `boolean`

Defined in: [src/vector2.ts:2032](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2032)

Tests whether `v` is exactly `(0,0)`.

#### Parameters

##### v

`Readonly`

Vector to test.

#### Returns

`boolean`

`true` if both components are zero; otherwise `false`.

***

### length()

> `static` **length**(`v`): `number`

Defined in: [src/vector2.ts:882](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L882)

Euclidean length `||v||` using Math.hypot for stability.

#### Parameters

##### v

`Readonly`

Vector to measure.

#### Returns

`number`

The Euclidean norm.

***

### lengthSq()

> `static` **lengthSq**(`v`): `number`

Defined in: [src/vector2.ts:892](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L892)

Squared length `||v||²` (avoids the square root for performance).

#### Parameters

##### v

`Readonly`

Vector to measure.

#### Returns

`number`

The squared length.

***

### lerp()

#### Call Signature

> `static` **lerp**(`a`, `b`, `t`): `Vector2`

Defined in: [src/vector2.ts:783](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L783)

Linear interpolation: `a + t (b − a)`. The factor `t` is **not** clamped.

##### Parameters

###### a

`Readonly`

Start vector.

###### b

`Readonly`

End vector.

###### t

`number`

Interpolation factor.

##### Returns

`Vector2`

A new Vector2 equal to the linear interpolation.

#### Call Signature

> `static` **lerp**(`a`, `b`, `t`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:793](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L793)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Start vector.

###### b

`Readonly`

End vector.

###### t

`number`

Interpolation factor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### lerpClamped()

#### Call Signature

> `static` **lerpClamped**(`a`, `b`, `t`): `Vector2`

Defined in: [src/vector2.ts:811](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L811)

Linear interpolation with `t` clamped to `[0, 1]`.

##### Parameters

###### a

`Readonly`

Start vector.

###### b

`Readonly`

End vector.

###### t

`number`

Interpolation factor.

##### Returns

`Vector2`

A new Vector2 equal to the clamped interpolation.

#### Call Signature

> `static` **lerpClamped**(`a`, `b`, `t`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:821](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L821)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Start vector.

###### b

`Readonly`

End vector.

###### t

`number`

Interpolation factor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### limit()

#### Call Signature

> `static` **limit**(`v`, `maxLength`): `Vector2`

Defined in: [src/vector2.ts:1302](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1302)

Limits the vector length to `maxLength`.

##### Parameters

###### v

`Readonly`

Vector to limit.

###### maxLength

`number`

Maximum allowed magnitude (≥ 0).

##### Returns

`Vector2`

A new Vector2 with length not exceeding `maxLength`.

##### Remarks

Equivalent to `clampLength(v, 0, maxLength)`.

#### Call Signature

> `static` **limit**(`v`, `maxLength`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1311](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1311)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to limit.

###### maxLength

`number`

Maximum allowed magnitude (≥ 0).

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### manhattanDistance()

> `static` **manhattanDistance**(`a`, `b`): `number`

Defined in: [src/vector2.ts:938](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L938)

Manhattan distance between `a` and `b`.

#### Parameters

##### a

`Readonly`

First point.

##### b

`Readonly`

Second point.

#### Returns

`number`

The Manhattan distance.

***

### manhattanLength()

> `static` **manhattanLength**(`v`): `number`

Defined in: [src/vector2.ts:902](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L902)

Manhattan length `|x| + |y|`.

#### Parameters

##### v

`Readonly`

Vector to measure.

#### Returns

`number`

The L¹ norm.

***

### max()

#### Call Signature

> `static` **max**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:1360](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1360)

Component-wise maximum of `a` and `b`.

##### Parameters

###### a

`Readonly`

First vector.

###### b

`Readonly`

Second vector.

##### Returns

`Vector2`

A new Vector2 containing per-component maxima.

#### Call Signature

> `static` **max**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1369](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1369)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

First vector.

###### b

`Readonly`

Second vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### midpoint()

#### Call Signature

> `static` **midpoint**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:1931](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1931)

Midpoint between `a` and `b`.

##### Parameters

###### a

`Readonly`

First endpoint.

###### b

`Readonly`

Second endpoint.

##### Returns

`Vector2`

A new Vector2 at the midpoint.

#### Call Signature

> `static` **midpoint**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1940](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1940)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

First endpoint.

###### b

`Readonly`

Second endpoint.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### min()

#### Call Signature

> `static` **min**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:1335](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1335)

Component-wise minimum of `a` and `b`.

##### Parameters

###### a

`Readonly`

First vector.

###### b

`Readonly`

Second vector.

##### Returns

`Vector2`

A new Vector2 containing per-component minima.

#### Call Signature

> `static` **min**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1344](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1344)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

First vector.

###### b

`Readonly`

Second vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### mod()

#### Call Signature

> `static` **mod**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:656](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L656)

Component-wise remainder (JS `%` semantics).

##### Parameters

###### a

`Readonly`

Dividend vector.

###### b

`Readonly`

Divisor vector (non-zero components).

##### Returns

`Vector2`

A new Vector2 equal to `(a.x % b.x, a.y % b.y)`.

##### Throws

If any divisor component is zero.

#### Call Signature

> `static` **mod**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:666](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L666)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Dividend vector.

###### b

`Readonly`

Divisor vector (non-zero components).

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If any divisor component is zero.

***

### modScalar()

#### Call Signature

> `static` **modScalar**(`v`, `s`): `Vector2`

Defined in: [src/vector2.ts:687](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L687)

Scalar remainder `v % s`.

##### Parameters

###### v

`Readonly`

Dividend vector.

###### s

`number`

Non‑zero scalar divisor.

##### Returns

`Vector2`

A new Vector2 equal to `(v.x % s, v.y % s)`.

##### Throws

If `s === 0`.

#### Call Signature

> `static` **modScalar**(`v`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:697](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L697)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Dividend vector.

###### s

`number`

Non‑zero scalar divisor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If `s === 0`.

***

### multiply()

#### Call Signature

> `static` **multiply**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:488](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L488)

Component-wise multiplication `a * b`.

##### Parameters

###### a

`Readonly`

First factor.

###### b

`Readonly`

Second factor.

##### Returns

`Vector2`

A new Vector2 equal to `(a.x * b.x, a.y * b.y)`.

#### Call Signature

> `static` **multiply**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:497](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L497)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

First factor.

###### b

`Readonly`

Second factor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### multiplyScalar()

#### Call Signature

> `static` **multiplyScalar**(`v`, `s`): `Vector2`

Defined in: [src/vector2.ts:513](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L513)

Scales a vector by a scalar `v * s`.

##### Parameters

###### v

`Readonly`

Vector to scale.

###### s

`number`

Scale factor.

##### Returns

`Vector2`

A new Vector2 equal to `(v.x * s, v.y * s)`.

#### Call Signature

> `static` **multiplyScalar**(`v`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:522](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L522)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to scale.

###### s

`number`

Scale factor.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### nearEquals()

> `static` **nearEquals**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/vector2.ts:2070](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2070)

Approximate component-wise equality with tolerance.

#### Parameters

##### a

`Readonly`

First vector.

##### b

`Readonly`

Second vector.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance.

#### Returns

`boolean`

`true` if both component differences are within `epsilon`; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

#### Throws

If `epsilon < 0`.

***

### nearZero()

> `static` **nearZero**(`v`, `epsilon`): `boolean`

Defined in: [src/vector2.ts:2044](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L2044)

Tests whether both components are within `epsilon` of `0`.

#### Parameters

##### v

`Readonly`

Vector to test.

##### epsilon

`number` = `EPSILON`

Non‑negative tolerance.

#### Returns

`boolean`

`true` if `|x| ≤ epsilon` and `|y| ≤ epsilon`; otherwise `false`.

#### Default Value

[EPSILON](../../scalar/variables/EPSILON.md)

#### Throws

If `epsilon < 0`.

***

### negate()

#### Call Signature

> `static` **negate**(`v`): `Vector2`

Defined in: [src/vector2.ts:716](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L716)

Unary negation `( -x, -y )`.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new negated Vector2.

#### Call Signature

> `static` **negate**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:724](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L724)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the negation.

##### Returns

`Vector2`

`outVector`.

***

### normalize()

#### Call Signature

> `static` **normalize**(`v`): `Vector2`

Defined in: [src/vector2.ts:1389](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1389)

Normalizes `v` to unit length.

##### Parameters

###### v

`Readonly`

Vector to normalize.

##### Returns

`Vector2`

A new unit Vector2.

##### Throws

If `v` has zero length.

#### Call Signature

> `static` **normalize**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1398](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1398)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to normalize.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If `v` has zero length.

***

### normalizeSafe()

#### Call Signature

> `static` **normalizeSafe**(`v`): `Vector2`

Defined in: [src/vector2.ts:1413](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1413)

Safe normalization. If `v` has zero length, returns `(0,0)`.

##### Parameters

###### v

`Readonly`

Vector to normalize.

##### Returns

`Vector2`

A new Vector2 containing the safe normalization.

#### Call Signature

> `static` **normalizeSafe**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1421](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1421)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to normalize.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### parse()

#### Call Signature

> `static` **parse**(`string_`): `Vector2`

Defined in: [src/vector2.ts:289](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L289)

Parses a string of the form `"x,y"` into a vector.

##### Parameters

###### string\_

`string`

String containing two comma-separated numbers.

##### Returns

`Vector2`

A new Vector2 parsed from the string.

##### Throws

If the string cannot be parsed.

#### Call Signature

> `static` **parse**(`string_`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:298](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L298)

Alloc‑free overload writing into `outVector`.

##### Parameters

###### string\_

`string`

String containing two comma-separated numbers.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If the string cannot be parsed.

***

### perpendicular()

#### Call Signature

> `static` **perpendicular**(`v`, `clockwise?`): `Vector2`

Defined in: [src/vector2.ts:1695](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1695)

Perpendicular vector (±90°) with **unchanged length**.

##### Parameters

###### v

`Readonly`

Source vector.

###### clockwise?

`boolean`

`true` for CW, `false` for CCW.

##### Returns

`Vector2`

A new perpendicular Vector2.

##### Default Value

`false`

#### Call Signature

> `static` **perpendicular**(`v`, `clockwise`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1704](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1704)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### clockwise

`boolean`

`true` for CW, `false` for CCW.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### project()

#### Call Signature

> `static` **project**(`v`, `axis`): `Vector2`

Defined in: [src/vector2.ts:1531](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1531)

Projects `v` onto `axis`. If `axis` is zero, returns `(0,0)`.

##### Parameters

###### v

`Readonly`

Vector to project.

###### axis

`Readonly`

Projection axis.

##### Returns

`Vector2`

A new Vector2 equal to the projection.

#### Call Signature

> `static` **project**(`v`, `axis`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1540](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1540)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to project.

###### axis

`Readonly`

Projection axis.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### projectOnUnit()

#### Call Signature

> `static` **projectOnUnit**(`v`, `unitAxis`): `Vector2`

Defined in: [src/vector2.ts:1564](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1564)

Projects `v` onto a **unit** axis (assumes `|axis| == 1`).

##### Parameters

###### v

`Readonly`

Vector to project.

###### unitAxis

`Readonly`

Unit-length axis of projection.

##### Returns

`Vector2`

A new Vector2 equal to the projection.

##### Remarks

Avoids the extra division by `|axis|²`.

#### Call Signature

> `static` **projectOnUnit**(`v`, `unitAxis`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1573](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1573)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to project.

###### unitAxis

`Readonly`

Unit-length axis of projection.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### projectSafe()

#### Call Signature

> `static` **projectSafe**(`v`, `axis`): `Vector2`

Defined in: [src/vector2.ts:1595](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1595)

Safe projection: if `axis` is near zero, returns `(0,0)`.

##### Parameters

###### v

`Readonly`

Vector to project.

###### axis

`Readonly`

Projection axis.

##### Returns

`Vector2`

A new Vector2 equal to the safe projection.

#### Call Signature

> `static` **projectSafe**(`v`, `axis`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1604](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1604)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to project.

###### axis

`Readonly`

Projection axis.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### random()

#### Call Signature

> `static` **random**(): `Vector2`

Defined in: [src/vector2.ts:314](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L314)

Generates a **random unit vector** with uniform direction in `[0, 2π)`.

##### Returns

`Vector2`

A new unit Vector2 with random heading.

#### Call Signature

> `static` **random**(`outVector`): `Vector2`

Defined in: [src/vector2.ts:321](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L321)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### randomInUnitCircle()

#### Call Signature

> `static` **randomInUnitCircle**(): `Vector2`

Defined in: [src/vector2.ts:352](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L352)

Samples a random point **inside** the unit disk with uniform area density.

##### Returns

`Vector2`

A new Vector2 within the unit circle.

#### Call Signature

> `static` **randomInUnitCircle**(`outVector`): `Vector2`

Defined in: [src/vector2.ts:359](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L359)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### randomOnCircle()

#### Call Signature

> `static` **randomOnCircle**(`radius?`): `Vector2`

Defined in: [src/vector2.ts:332](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L332)

Samples a random point **on** a circle of radius `radius`.

##### Parameters

###### radius?

`number`

Circle radius.

##### Returns

`Vector2`

A new Vector2 located on the circle.

##### Default Value

`1`

#### Call Signature

> `static` **randomOnCircle**(`radius`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:340](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L340)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### radius

`number`

Circle radius.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### reflect()

#### Call Signature

> `static` **reflect**(`v`, `unitNormal`): `Vector2`

Defined in: [src/vector2.ts:1626](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1626)

Reflection of `v` about a **unit** normal: `r = v − 2 (v·n̂) n̂`.

##### Parameters

###### v

`Readonly`

Incident vector.

###### unitNormal

`Readonly`

Unit-length normal to reflect about.

##### Returns

`Vector2`

A new reflected Vector2.

#### Call Signature

> `static` **reflect**(`v`, `unitNormal`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1635](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1635)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Incident vector.

###### unitNormal

`Readonly`

Unit-length normal to reflect about.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### reflectSafe()

#### Call Signature

> `static` **reflectSafe**(`v`, `normal`): `Vector2`

Defined in: [src/vector2.ts:1657](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1657)

Safe reflection. If `normal` is not unitary, it is normalized; if `|normal| ≈ 0`, returns `v`.

##### Parameters

###### v

`Readonly`

Incident vector.

###### normal

`Readonly`

Normal (need not be unitary).

##### Returns

`Vector2`

A new Vector2 equal to the safe reflection.

#### Call Signature

> `static` **reflectSafe**(`v`, `normal`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1666](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1666)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Incident vector.

###### normal

`Readonly`

Normal (need not be unitary).

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### reject()

#### Call Signature

> `static` **reject**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:1956](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1956)

Vector rejection: the component of `a` **perpendicular** to `b`, i.e. `a − proj_b(a)`.

##### Parameters

###### a

`Readonly`

Vector to decompose.

###### b

`Readonly`

Axis of projection.

##### Returns

`Vector2`

A new Vector2 equal to the rejection of `a` from `b`.

#### Call Signature

> `static` **reject**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1965](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1965)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Vector to decompose.

###### b

`Readonly`

Axis of projection.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### rotate()

#### Call Signature

> `static` **rotate**(`v`, `angle`): `Vector2`

Defined in: [src/vector2.ts:1786](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1786)

Rotates `v` by an angle (radians).

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### angle

`number`

Rotation angle in radians.

##### Returns

`Vector2`

A new rotated Vector2.

#### Call Signature

> `static` **rotate**(`v`, `angle`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1795](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1795)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### angle

`number`

Rotation angle in radians.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### rotateAround()

#### Call Signature

> `static` **rotateAround**(`v`, `center`, `angle`): `Vector2`

Defined in: [src/vector2.ts:1845](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1845)

Rotates `v` around `center` by `angle` radians.

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### center

`Readonly`

Rotation pivot.

###### angle

`number`

Rotation angle in radians.

##### Returns

`Vector2`

A new rotated Vector2.

#### Call Signature

> `static` **rotateAround**(`v`, `center`, `angle`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1855](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1855)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### center

`Readonly`

Rotation pivot.

###### angle

`number`

Rotation angle in radians.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### rotateAroundCS()

#### Call Signature

> `static` **rotateAroundCS**(`v`, `center`, `c`, `s`): `Vector2`

Defined in: [src/vector2.ts:1888](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1888)

Rotates `v` around `center` using precomputed `(c, s)`.

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### center

`Readonly`

Rotation pivot.

###### c

`number`

Precomputed cosine.

###### s

`number`

Precomputed sine.

##### Returns

`Vector2`

A new rotated Vector2.

#### Call Signature

> `static` **rotateAroundCS**(`v`, `center`, `c`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1904](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1904)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### center

`Readonly`

Rotation pivot.

###### c

`number`

Precomputed cosine.

###### s

`number`

Precomputed sine.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### rotateCS()

#### Call Signature

> `static` **rotateCS**(`v`, `c`, `s`): `Vector2`

Defined in: [src/vector2.ts:1817](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1817)

Rotates `v` using **precomputed** cosine/sine (optimal for batches).

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### c

`number`

Precomputed cosine.

###### s

`number`

Precomputed sine.

##### Returns

`Vector2`

A new rotated Vector2.

##### Remarks

Mirrors patterns found in physics libs like Box2D.

#### Call Signature

> `static` **rotateCS**(`v`, `c`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1827](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1827)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Vector to rotate.

###### c

`number`

Precomputed cosine.

###### s

`number`

Precomputed sine.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### round()

#### Call Signature

> `static` **round**(`v`): `Vector2`

Defined in: [src/vector2.ts:1067](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1067)

Applies Math.round to both components.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new rounded Vector2.

#### Call Signature

> `static` **round**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1075](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1075)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### setHeading()

#### Call Signature

> `static` **setHeading**(`v`, `angle`): `Vector2`

Defined in: [src/vector2.ts:1504](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1504)

Returns a vector with the same magnitude as `v` but new heading `angle`.

##### Parameters

###### v

`Readonly`

Source vector.

###### angle

`number`

New heading in radians.

##### Returns

`Vector2`

A new Vector2 with rotated heading and preserved length.

#### Call Signature

> `static` **setHeading**(`v`, `angle`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1513](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1513)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### angle

`number`

New heading in radians.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### setLength()

#### Call Signature

> `static` **setLength**(`v`, `newLength`): `Vector2`

Defined in: [src/vector2.ts:1436](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1436)

Returns a copy of `v` with the requested length.

##### Parameters

###### v

`Readonly`

Source vector.

###### newLength

`number`

Desired magnitude (≥ 0).

##### Returns

`Vector2`

A new Vector2 with magnitude `newLength`.

##### Throws

If `newLength < 0` or `v` has zero length.

#### Call Signature

> `static` **setLength**(`v`, `newLength`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1446](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1446)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### newLength

`number`

Desired magnitude (≥ 0).

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If `newLength < 0` or `v` has zero length.

***

### setLengthSafe()

#### Call Signature

> `static` **setLengthSafe**(`v`, `newLength`): `Vector2`

Defined in: [src/vector2.ts:1472](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1472)

Safe copy with requested length. Negative `newLength` is clamped to `0`.
If `v` is zero, returns `(newLength, 0)`.

##### Parameters

###### v

`Readonly`

Source vector.

###### newLength

`number`

Desired magnitude (non‑negative).

##### Returns

`Vector2`

A new Vector2 with safe length.

#### Call Signature

> `static` **setLengthSafe**(`v`, `newLength`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1481](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1481)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### newLength

`number`

Desired magnitude (non‑negative).

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### sub()

#### Call Signature

> `static` **sub**(`a`, `b`): `Vector2`

Defined in: [src/vector2.ts:438](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L438)

Component-wise subtraction `a − b`.

##### Parameters

###### a

`Readonly`

Minuend.

###### b

`Readonly`

Subtrahend.

##### Returns

`Vector2`

A new Vector2 equal to `(a.x - b.x, a.y - b.y)`.

#### Call Signature

> `static` **sub**(`a`, `b`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:447](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L447)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### a

`Readonly`

Minuend.

###### b

`Readonly`

Subtrahend.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### subScalar()

#### Call Signature

> `static` **subScalar**(`v`, `s`): `Vector2`

Defined in: [src/vector2.ts:463](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L463)

Subtracts a scalar from both components `v − s`.

##### Parameters

###### v

`Readonly`

Source vector.

###### s

`number`

Scalar to subtract.

##### Returns

`Vector2`

A new Vector2 equal to `(v.x - s, v.y - s)`.

#### Call Signature

> `static` **subScalar**(`v`, `s`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:472](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L472)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### s

`number`

Scalar to subtract.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### sumComponents()

> `static` **sumComponents**(`vector`): `number`

Defined in: [src/vector2.ts:377](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L377)

Computes the sum of components `x + y`.

#### Parameters

##### vector

`Readonly`

Vector to read.

#### Returns

`number`

The scalar sum `vector.x + vector.y`.

***

### swap()

#### Call Signature

> `static` **swap**(`v`): `Vector2`

Defined in: [src/vector2.ts:1152](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1152)

Returns a new vector with `x` and `y` swapped.

##### Parameters

###### v

`Readonly`

Source vector.

##### Returns

`Vector2`

A new Vector2 equal to `(v.y, v.x)`.

#### Call Signature

> `static` **swap**(`v`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1160](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1160)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

***

### unitPerpendicular()

#### Call Signature

> `static` **unitPerpendicular**(`v`, `clockwise?`): `Vector2`

Defined in: [src/vector2.ts:1721](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1721)

Unit perpendicular (throws if `v` is zero).

##### Parameters

###### v

`Readonly`

Source vector.

###### clockwise?

`boolean`

`true` for CW, `false` for CCW.

##### Returns

`Vector2`

A new unit perpendicular Vector2.

##### Default Value

`false`

##### Throws

If `v` has zero length.

#### Call Signature

> `static` **unitPerpendicular**(`v`, `clockwise`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1731](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1731)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### clockwise

`boolean`

`true` for CW, `false` for CCW.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.

##### Throws

If `v` has zero length.

***

### unitPerpendicularSafe()

#### Call Signature

> `static` **unitPerpendicularSafe**(`v`, `clockwise?`): `Vector2`

Defined in: [src/vector2.ts:1753](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1753)

Safe unit perpendicular. If `v` is zero, returns `(-1,0)` for CCW or `(1,0)` for CW.

##### Parameters

###### v

`Readonly`

Source vector.

###### clockwise?

`boolean`

`true` for CW, `false` for CCW.

##### Returns

`Vector2`

A new unit perpendicular Vector2 or fallback axis for zeros.

##### Default Value

`false`

#### Call Signature

> `static` **unitPerpendicularSafe**(`v`, `clockwise`, `outVector`): `Vector2`

Defined in: [src/vector2.ts:1762](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/vector2.ts#L1762)

Alloc‑free variant writing into `outVector`.

##### Parameters

###### v

`Readonly`

Source vector.

###### clockwise

`boolean`

`true` for CW, `false` for CCW.

###### outVector

`Vector2`

Destination vector to receive the result.

##### Returns

`Vector2`

`outVector`.
