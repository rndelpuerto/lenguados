# Function: saturate()

> **saturate**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:74](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L74)

Saturates value to [0, 1] range.
Commonly used for colors, interpolation factors.

## Parameters

### value

`number`

Value to saturate

## Returns

`number`

Saturated value in [0, 1]

## Example

```typescript
saturate(-0.5); // 0
saturate(0.5); // 0.5
saturate(1.5); // 1
```

## Since

0.5.0
