# Function: roundToPowerOfTwo()

> **roundToPowerOfTwo**(`value`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:96](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/rounding.ts#L96)

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

1.0.0
