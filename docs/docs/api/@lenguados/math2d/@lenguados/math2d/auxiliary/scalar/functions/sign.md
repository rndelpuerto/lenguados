# Function: sign()

> **sign**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:52](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L52)

Returns the sign of a number (-1, 0, or 1).
More robust than Math.sign for special cases.

## Parameters

### value

`number`

Input number

## Returns

`number`

Sign of the value

## Remarks

Handles special cases:

- Returns 0 for both +0 and -0
- Returns 0 for NaN (unlike Math.sign which returns NaN)

## Example

```typescript
sign(42); // 1
sign(-3.5); // -1
sign(0); // 0
sign(NaN); // 0
```

## Since

0.7.0
