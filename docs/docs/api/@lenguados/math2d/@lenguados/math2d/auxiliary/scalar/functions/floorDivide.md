# Function: floorDivide()

> **floorDivide**(`value`, `divisor`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:455](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L455)

Returns the floor of value/divisor.
Useful for grid cell calculations.

## Parameters

### value

`number`

Numerator

### divisor

`number`

Denominator

## Returns

`number`

Floor of division

## Throws

If divisor is zero

## Example

```typescript
floorDivide(7, 3); // 2
floorDivide(-7, 3); // -3
floorDivide(6, 3); // 2
```

## See

- [floorDivideSafe](floorDivideSafe.md) — Returns 0 if divisor is zero
- [floorDivideUnchecked](floorDivideUnchecked.md) — No validation

## Since

0.7.0
