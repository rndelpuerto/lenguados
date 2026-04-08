# Function: atan()

> **atan**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:556](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/deterministic/deterministic-kernels.ts#L556)

Deterministic arctangent function.

## Parameters

### x

`number`

Any real number

## Returns

`number`

atan(x) in [-π/2, π/2]

## Example

```typescript
atan(0); // 0
atan(1); // ~0.7854 (π/4)
atan(Infinity); // ~1.5708 (π/2)
```

## Since

0.7.0
