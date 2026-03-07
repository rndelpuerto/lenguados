# Function: angleBisector()

> **angleBisector**(`a`, `b`): `number`

Defined in: [src/auxiliary/angle/operations.ts:182](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/operations.ts#L182)

Calculates angle bisector.
Returns angle halfway between a and b (shortest path).

## Parameters

### a

`number`

First angle in radians.

### b

`number`

Second angle in radians.

## Returns

`number`

Bisector angle.

## Example

```typescript
angleBisector(0, Math.PI / 2); // Math.PI / 4
angleBisector(0, Math.PI); // Math.PI / 2
angleBisector(-Math.PI / 2, Math.PI / 2); // 0
```

## Since

0.7.0
