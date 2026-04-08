# Function: angleDistance()

> **angleDistance**(`a`, `b`): `number`

Defined in: [src/auxiliary/angle/operations.ts:135](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/operations.ts#L135)

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
angleDistance(0, Math.PI / 2); // Math.PI / 2
angleDistance(0, (3 * Math.PI) / 2); // Math.PI / 2
angleDistance(-Math.PI, Math.PI); // 0
```

## Since

0.7.0
