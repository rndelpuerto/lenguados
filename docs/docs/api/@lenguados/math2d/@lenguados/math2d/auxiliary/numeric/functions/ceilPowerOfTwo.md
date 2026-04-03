# Function: ceilPowerOfTwo()

> **ceilPowerOfTwo**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:155](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/rounding.ts#L155)

Returns the smallest power of two greater than or equal to value.

## Parameters

### value

`number`

Input value (positive)

## Returns

`number`

Next power of two, or 0 for non-positive input

## Example

```typescript
ceilPowerOfTwo(5); // 8
ceilPowerOfTwo(8); // 8
ceilPowerOfTwo(1); // 1
ceilPowerOfTwo(0); // 0
```

## See

- [floorPowerOfTwo](floorPowerOfTwo.md) - Largest power of two ≤ value
- [roundToPowerOfTwo](roundToPowerOfTwo.md) - Nearest power of two

## Since

0.9.0
