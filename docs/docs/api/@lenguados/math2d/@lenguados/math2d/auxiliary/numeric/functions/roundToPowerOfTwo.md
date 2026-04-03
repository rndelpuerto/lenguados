# Function: roundToPowerOfTwo()

> **roundToPowerOfTwo**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:126](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/rounding.ts#L126)

Rounds to nearest power of two.

## Parameters

### value

`number`

Value to round (must be positive)

## Returns

`number`

Nearest power of two

## Remarks

Uses deterministic math (`log` from deterministic-kernels).

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
