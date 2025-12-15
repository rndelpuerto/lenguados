# Function: saturateSigned()

> **saturateSigned**(`value`): `number`

Defined in: [src/auxiliary/scalar/arithmetic.ts:139](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/scalar/arithmetic.ts#L139)

Saturates value to [-1, 1] range.
Useful for normalized directions.

## Parameters

### value

`number`

Value to saturate.

## Returns

`number`

Saturated value in [-1, 1].

## Example

```typescript
saturateSigned(-2); // -1
saturateSigned(0.5); // 0.5
saturateSigned(2); // 1
```

## Since

1.0.0
