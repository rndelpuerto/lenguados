# Function: atan()

> **atan**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:551](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/deterministic/deterministic-kernels.ts#L551)

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

0.8.0
