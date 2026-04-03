# Function: floorPowerOfTwo()

> **floorPowerOfTwo**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:181](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/rounding.ts#L181)

Returns the largest power of two less than or equal to value.

## Parameters

### value

`number`

Input value (positive)

## Returns

`number`

Previous power of two, or 0 for non-positive input

## Example

```typescript
floorPowerOfTwo(5); // 4
floorPowerOfTwo(8); // 8
floorPowerOfTwo(1); // 1
floorPowerOfTwo(0); // 0
```

## See

- [ceilPowerOfTwo](ceilPowerOfTwo.md) - Smallest power of two ≥ value
- [roundToPowerOfTwo](roundToPowerOfTwo.md) - Nearest power of two

## Since

0.9.0
