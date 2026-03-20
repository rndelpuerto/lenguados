# Function: angleBisector()

> **angleBisector**(`a`, `b`): `number`

Defined in: [src/auxiliary/angle/operations.ts:179](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/operations.ts#L179)

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

## Example

```typescript
angleBisector(0, Math.PI / 2); // Math.PI / 4
angleBisector(0, Math.PI); // Math.PI / 2
angleBisector(-Math.PI / 2, Math.PI / 2); // 0
```

## Since

0.7.0
