# Function: atan()

> **atan**(`x`): `number`

Defined in: [src/deterministic/deterministic-kernels.ts:527](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/deterministic/deterministic-kernels.ts#L527)

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
