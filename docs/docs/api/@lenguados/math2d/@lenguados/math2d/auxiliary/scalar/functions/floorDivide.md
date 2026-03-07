# Function: floorDivide()

> **floorDivide**(`value`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:416](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L416)

Returns the floor of value/divisor.
Useful for grid cell calculations.

## Parameters

### value

`number`

Numerator.

### divisor

`number`

Denominator.

## Returns

`number`

Floor of division.

## Example

```typescript
floorDivide(7, 3); // 2
floorDivide(-7, 3); // -3
floorDivide(6, 3); // 2
```

## Since

0.7.0
