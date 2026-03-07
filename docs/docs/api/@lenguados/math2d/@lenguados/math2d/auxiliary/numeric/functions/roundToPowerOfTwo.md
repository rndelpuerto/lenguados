# Function: roundToPowerOfTwo()

> **roundToPowerOfTwo**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:107](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/numeric/rounding.ts#L107)

Rounds to nearest power of two.

## Parameters

### value

`number`

Value to round (must be positive).

## Returns

`number`

Nearest power of two.

## Example

```typescript
roundToPowerOfTwo(5); // 4
roundToPowerOfTwo(7); // 8
roundToPowerOfTwo(16); // 16
roundToPowerOfTwo(17); // 16
roundToPowerOfTwo(24); // 32
```

## Since

0.7.0
