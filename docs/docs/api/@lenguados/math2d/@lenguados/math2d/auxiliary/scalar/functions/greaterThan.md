# Function: greaterThan()

> **greaterThan**(`a`, `b`, `epsilon`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:190](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/comparison.ts#L190)

Tests if a > b with epsilon tolerance.
Returns true if a > b + epsilon.

## Parameters

### a

`number`

First value

### b

`number`

Second value

### epsilon

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if a is greater than b beyond tolerance

## Example

```typescript
greaterThan(2.0, 1.0); // true
greaterThan(2.0, 1.9999999999); // false (within epsilon)
greaterThan(2.0, 1.99, 0.1); // false (within custom epsilon)
```

## Since

0.7.0
