# Function: angleDistance()

> **angleDistance**(`a`, `b`): `number`

Defined in: [src/auxiliary/angle/operations.ts:164](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L164)

Absolute shortest-arc distance in radians.
Always positive, in [0, π].

## Parameters

### a

`number`

First angle in radians

### b

`number`

Second angle in radians

## Returns

`number`

Unsigned angle distance in [0, π]

## Example

```typescript
angleDistance(0, Math.PI / 2);        // Math.PI / 2
angleDistance(0, 3 * Math.PI / 2);    // Math.PI / 2
angleDistance(-Math.PI, Math.PI);     // 0
```

## Since

1.0.0
