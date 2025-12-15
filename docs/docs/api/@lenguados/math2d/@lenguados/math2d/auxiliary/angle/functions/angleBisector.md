# Function: angleBisector()

> **angleBisector**(`a`, `b`): `number`

Defined in: [src/auxiliary/angle/operations.ts:207](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L207)

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
angleBisector(0, Math.PI / 2);           // Math.PI / 4
angleBisector(0, Math.PI);               // Math.PI / 2
angleBisector(-Math.PI / 2, Math.PI / 2); // 0
```

## Since

1.0.0
