# Function: relativeEquals()

> **relativeEquals**(`x`, `y`, `relEps?`): `boolean`

Defined in: [src/scalar.ts:130](https://github.com/rndelpuerto/lenguados/blob/210e5bae9296dd537e284b2b1cad232d956bbd88/packages/math2d/src/scalar.ts#L130)

Determine if two numbers are approximately equal within a relative tolerance.

Compares |x - y| against relEps * max(1, |x|, |y|), ensuring stability near zero.

## Parameters

### x

`number`

First value to compare.

### y

`number`

Second value to compare.

### relEps?

`number` = `EPSILON`

Relative tolerance fraction.

## Returns

`boolean`

True if within the scaled tolerance.

## Throws

If relEps is negative.

## See

EPSILON

## Example

```ts
// Relative compare: allows 1% difference
relativeEquals(100, 101, 0.01); // → true
```
