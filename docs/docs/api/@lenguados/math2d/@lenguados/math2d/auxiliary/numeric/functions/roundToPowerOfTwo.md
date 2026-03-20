# Function: roundToPowerOfTwo()

> **roundToPowerOfTwo**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:112](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/rounding.ts#L112)

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
