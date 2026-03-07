# Function: saturateSigned()

> **saturateSigned**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:85](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L85)

Saturates value to [-1, 1] range.
Useful for normalized directions.

## Parameters

### value

`number`

Value to saturate.

## Returns

`number`

Saturated value in [-1, 1].

## Example

```typescript
saturateSigned(-2); // -1
saturateSigned(0.5); // 0.5
saturateSigned(2); // 1
```

## Since

0.7.0
