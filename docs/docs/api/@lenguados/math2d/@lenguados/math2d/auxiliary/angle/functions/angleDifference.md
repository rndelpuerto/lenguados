# Function: angleDifference()

> **angleDifference**(`from`, `to`): `number`

Defined in: [src/auxiliary/angle/operations.ts:118](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/operations.ts#L118)

Signed shortest-arc delta in radians: rotate from `from` to `to`.
Result is in [-PI, PI).

## Parameters

### from

`number`

Starting angle in radians.

### to

`number`

Target angle in radians.

## Returns

`number`

Signed angle difference in [-PI, PI).

## Example

```typescript
angleDifference(0, Math.PI / 2); // Math.PI / 2
angleDifference(0, (3 * Math.PI) / 2); // -Math.PI / 2 (shorter path)
angleDifference(-Math.PI, Math.PI); // 0 (same angle)
```

## Since

0.7.0
