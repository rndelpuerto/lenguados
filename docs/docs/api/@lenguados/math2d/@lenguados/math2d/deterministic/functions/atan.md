# Function: atan()

> **atan**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:558](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/deterministic/deterministic-kernels.ts#L558)

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
