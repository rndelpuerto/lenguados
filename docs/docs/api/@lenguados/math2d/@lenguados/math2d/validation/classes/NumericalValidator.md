# Class: NumericalValidator

Numerical validator with configurable behavior.

## Constructors

### Constructor

> **new NumericalValidator**(): `NumericalValidator`

#### Returns

`NumericalValidator`

## Methods

### assertNearEquals()

> `static` **assertNearEquals**(`actual`, `expected`, `epsilon`, `message?`): `void`

Assert that two values are nearly equal.

#### Parameters

##### actual

`number`

Actual value

##### expected

`number`

Expected value

##### epsilon

`number` = `1e-10`

Tolerance

##### message?

`string`

Error message

#### Returns

`void`

#### Throws

If values are not nearly equal

---

### sanitize()

> `static` **sanitize**(`value`, `fallback`, `min`, `max`): `number`

Validates and cleans a numeric value.

#### Parameters

##### value

`number`

Value to validate

##### fallback

`number` = `0`

Fallback value if invalid

##### min

`number` = `-Number.MAX_VALUE`

Minimum allowed value

##### max

`number` = `Number.MAX_VALUE`

Maximum allowed value

#### Returns

`number`

Clean value

---

### validateFinite()

> `static` **validateFinite**(`value`, `name`): `number`

Validates that a value is finite.

#### Parameters

##### value

`number`

Value to validate

##### name

`string` = `'value'`

Parameter name for error messages

#### Returns

`number`

Validated value or safe fallback

#### Throws

In strict mode if value is not finite

---

### validateMatrix2()

> `static` **validateMatrix2**(`m00`, `m01`, `m10`, `m11`, `name`): `object`

Validates a matrix's components.

#### Parameters

##### m00

`number`

Matrix element [0,0]

##### m01

`number`

Matrix element [0,1]

##### m10

`number`

Matrix element [1,0]

##### m11

`number`

Matrix element [1,1]

##### name

`string` = `'matrix'`

Matrix name for error messages

#### Returns

`object`

Validated components

##### m00

> **m00**: `number`

##### m01

> **m01**: `number`

##### m10

> **m10**: `number`

##### m11

> **m11**: `number`

---

### validateNotNaN()

> `static` **validateNotNaN**(`value`, `name`): `number`

Validates that a value is not NaN.

#### Parameters

##### value

`number`

Value to validate

##### name

`string` = `'value'`

Parameter name for error messages

#### Returns

`number`

Validated value or safe fallback

#### Throws

In strict mode if value is NaN

---

### validateRange()

> `static` **validateRange**(`value`, `min`, `max`, `name`): `number`

Validates that a value is within range.

#### Parameters

##### value

`number`

Value to validate

##### min

`number`

Minimum value (inclusive)

##### max

`number`

Maximum value (inclusive)

##### name

`string` = `'value'`

Parameter name for error messages

#### Returns

`number`

Validated value, clamped in safe mode

#### Throws

In strict mode if value is out of range

---

### validateVector2()

> `static` **validateVector2**(`x`, `y`, `name`): `object`

Validates a vector's components.

#### Parameters

##### x

`number`

X component

##### y

`number`

Y component

##### name

`string` = `'vector'`

Vector name for error messages

#### Returns

`object`

Validated components

##### x

> **x**: `number`

##### y

> **y**: `number`

---

### wouldThrow()

> `static` **wouldThrow**(): `boolean`

Check if validation would throw in current mode.

#### Returns

`boolean`

True if current mode is STRICT

---

### wouldWarn()

> `static` **wouldWarn**(): `boolean`

Check if validation would warn in current mode.

#### Returns

`boolean`

True if current mode is WARN or STRICT
