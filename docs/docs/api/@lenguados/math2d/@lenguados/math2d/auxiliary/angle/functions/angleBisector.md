# Function: angleBisector()

> **angleBisector**(`a`, `b`): `number`

Defined in: [src/auxiliary/angle/operations.ts:210](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/angle/operations.ts#L210)

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

1.0.0
