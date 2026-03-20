# Function: angleDifference()

> **angleDifference**(`from`, `to`): `number`

Defined in: [src/auxiliary/angle/operations.ts:115](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/angle/operations.ts#L115)

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

## Remarks

Anti-symmetry breaks at the PI boundary due to the half-open [-PI, PI) range:
`angleDifference(0, PI)` and `angleDifference(PI, 0)` both return `-PI`
(not `+PI` and `-PI` respectively). This is inherent to the convention.

## Example

```typescript
angleDifference(0, Math.PI / 2); // Math.PI / 2
angleDifference(0, (3 * Math.PI) / 2); // -Math.PI / 2 (shorter path)
angleDifference(-Math.PI, Math.PI); // 0 (same angle)
```

## Since

0.7.0
