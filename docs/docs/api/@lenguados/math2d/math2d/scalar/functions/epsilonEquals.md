# Function: epsilonEquals()

> **epsilonEquals**(`a`, `b`, `eps?`): `boolean`

Defined in: [src/scalar.ts:111](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/scalar.ts#L111)

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
