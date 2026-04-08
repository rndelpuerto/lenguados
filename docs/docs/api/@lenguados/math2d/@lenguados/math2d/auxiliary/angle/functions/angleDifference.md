# Function: angleDifference()

> **angleDifference**(`from`, `to`): `number`

Defined in: [src/auxiliary/angle/operations.ts:114](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/angle/operations.ts#L114)

Signed shortest-arc delta in radians: rotate from `from` to `to`.
Result is in (-PI, PI].

## Parameters

### from

`number`

Starting angle in radians

### to

`number`

Target angle in radians

## Returns

`number`

Signed angle difference in (-PI, PI]

## Remarks

Anti-symmetry breaks at the PI boundary due to the half-open (-PI, PI] range:
`angleDifference(0, PI)` and `angleDifference(PI, 0)` both return `+PI`
(not `+PI` and `-PI` respectively). This is inherent to the convention and
matches the CCW-positive rotation direction used by the library.

## Example

```typescript
angleDifference(0, Math.PI / 2); // Math.PI / 2
angleDifference(0, (3 * Math.PI) / 2); // -Math.PI / 2 (shorter path)
angleDifference(-Math.PI, Math.PI); // 0 (same angle)
```

## Since

0.7.0
