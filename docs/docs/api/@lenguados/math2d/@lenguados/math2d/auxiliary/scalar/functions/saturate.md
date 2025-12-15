# Function: saturate()

> **saturate**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:119](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L119)

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

1.0.0
