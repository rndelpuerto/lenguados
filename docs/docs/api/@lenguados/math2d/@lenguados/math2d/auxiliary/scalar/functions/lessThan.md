# Function: lessThan()

> **lessThan**(`a`, `b`, `epsilon?`): `boolean`

Defined in: [src/auxiliary/scalar/comparison.ts:179](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/comparison.ts#L179)

Tests if a < b with epsilon tolerance.
Returns true if a < b - epsilon.

## Parameters

### a

`number`

First value

### b

`number`

Second value

### epsilon?

`number` = `EPSILON`

Tolerance (default: EPSILON)

## Returns

`boolean`

True if a is less than b beyond tolerance

## Throws

If epsilon is negative or NaN

## Example

```typescript
lessThan(1.0, 2.0); // true
lessThan(1.9999999999, 2.0); // false (within epsilon)
lessThan(1.99, 2.0, 0.1); // false (within custom epsilon)
```

## Since

0.7.0
