# Function: saturate()

> **saturate**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:65](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L65)

Saturates value to [0, 1] range.
Commonly used for colors, interpolation factors.

## Parameters

### value

`number`

Value to saturate.

## Returns

`number`

Saturated value in [0, 1].

## Example

```typescript
saturate(-0.5); // 0
saturate(0.5); // 0.5
saturate(1.5); // 1
```

## Since

0.7.0
