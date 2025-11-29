# Class: ErrorPropagation

Error propagation utilities for tracking numerical precision.

## Constructors

### Constructor

> **new ErrorPropagation**(): `ErrorPropagation`

#### Returns

`ErrorPropagation`

## Properties

### MACHINE_EPSILON

> `readonly` `static` **MACHINE_EPSILON**: `number` = `Number.EPSILON`

Machine epsilon for floating point operations.

## Methods

### add()

> `static` **add**(`aError`, `bError`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Calculate error bounds for addition.

#### Parameters

##### aError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for first operand

##### bError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for second operand

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Combined error bounds

---

### combine()

> `static` **combine**(...`errors`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Combine multiple error bounds (for sum operations).

#### Parameters

##### errors

...[`ErrorBounds`](../interfaces/ErrorBounds.md)[]

Array of error bounds

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Combined error bounds

---

### divide()

> `static` **divide**(`aError`, `bError`, `a`, `b`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Calculate error bounds for division.

#### Parameters

##### aError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for numerator

##### bError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for denominator

##### a

`number`

Numerator value

##### b

`number`

Denominator value

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Combined error bounds

---

### format()

> `static` **format**(`error`): `string`

Format error bounds for logging.

#### Parameters

##### error

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds

#### Returns

`string`

Human-readable string

---

### fromUlps()

> `static` **fromUlps**(`value`, `ulps`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Create error bounds from ulps (units in the last place).

#### Parameters

##### value

`number`

Value to calculate error for

##### ulps

`number`

Number of ulps of error

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds

---

### isAcceptable()

> `static` **isAcceptable**(`error`, `maxAbsolute`, `maxRelative`): `boolean`

Check if error is within acceptable bounds.

#### Parameters

##### error

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds to check

##### maxAbsolute

`number` = `1e-10`

Maximum allowed absolute error

##### maxRelative

`number` = `1e-10`

Maximum allowed relative error

#### Returns

`boolean`

True if error is acceptable

---

### multiply()

> `static` **multiply**(`aError`, `bError`, `a`, `b`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Calculate error bounds for multiplication.

#### Parameters

##### aError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for first operand

##### bError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for second operand

##### a

`number`

First operand value

##### b

`number`

Second operand value

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Combined error bounds

---

### sincos()

> `static` **sincos**(`error`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Calculate error bounds for sine/cosine.

#### Parameters

##### error

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for angle

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for trig function

---

### sqrt()

> `static` **sqrt**(`error`, `value`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Calculate error bounds for square root.

#### Parameters

##### error

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for operand

##### value

`number`

Operand value

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for sqrt

---

### subtract()

> `static` **subtract**(`aError`, `bError`, `a`, `b`): [`ErrorBounds`](../interfaces/ErrorBounds.md)

Calculate error bounds for subtraction.

#### Parameters

##### aError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for first operand

##### bError

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Error bounds for second operand

##### a

`number`

First operand value

##### b

`number`

Second operand value

#### Returns

[`ErrorBounds`](../interfaces/ErrorBounds.md)

Combined error bounds
