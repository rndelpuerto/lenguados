# Function: angleBisector()

> **angleBisector**(`a`, `b`): `number`

Defined in: [src/auxiliary/angle/operations.ts:187](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/angle/operations.ts#L187)

Calculates angle bisector.
Returns angle halfway between a and b (shortest path).

## Parameters

### a

`number`

First angle in radians

### b

`number`

Second angle in radians

## Returns

`number`

Bisector angle

## Remarks

When angles are exactly π apart, the bisector direction is ambiguous —
the result depends on which angle is `a` vs `b` due to the signed
shortest-path computation.

## Example

```typescript
angleBisector(0, Math.PI / 2); // Math.PI / 4
angleBisector(0, Math.PI); // Math.PI / 2
angleBisector(-Math.PI / 2, Math.PI / 2); // 0
```

## Since

0.7.0
