# Function: angleDifference()

> **angleDifference**(`from`, `to`): `number`

Defined in: [src/auxiliary/angle/operations.ts:143](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/operations.ts#L143)

Signed shortest-arc delta in radians: rotate from `from` to `to`.
Result is in [-PI, PI).

## Parameters

### from

`number`

Starting angle in radians

### to

`number`

Target angle in radians

## Returns

`number`

Signed angle difference in [-PI, PI)

## Example

```typescript
angleDifference(0, Math.PI / 2);        // Math.PI / 2
angleDifference(0, 3 * Math.PI / 2);    // -Math.PI / 2 (shorter path)
angleDifference(-Math.PI, Math.PI);     // 0 (same angle)
```

## Since

1.0.0
