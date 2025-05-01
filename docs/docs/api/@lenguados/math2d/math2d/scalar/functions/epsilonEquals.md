# Function: epsilonEquals()

> **epsilonEquals**(`a`, `b`, `eps?`): `boolean`

Defined in: [src/scalar.ts:111](https://github.com/rndelpuerto/lenguados/blob/3db26e60cf924a3f02d7d869c59509fd2fa87c96/packages/math2d/src/scalar.ts#L111)

Checks if two numbers are approximately equal within an absolute tolerance.

## Parameters

### a

`number`

First number.

### b

`number`

Second number.

### eps?

`number` = `EPSILON`

Comparison tolerance.

## Returns

`boolean`

True if the absolute difference ≤ eps.
