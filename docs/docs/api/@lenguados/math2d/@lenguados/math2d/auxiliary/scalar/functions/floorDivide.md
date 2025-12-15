# Function: floorDivide()

> **floorDivide**(`value`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:448](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L448)

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

1.0.0
