# Function: wrapAngle()

> **wrapAngle**(`angle`, `period`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:133](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/auxiliary/angle/normalization.ts#L133)

Wraps angle to specific period.

## Parameters

### angle

`number`

Angle to wrap.

### period

`number` = `TAU`

Period (default: 2π).

## Returns

`number`

Wrapped angle in [0, period).

## Example

```typescript
wrapAngle(Math.PI, Math.PI); // 0
wrapAngle(3 * Math.PI, 2 * Math.PI); // Math.PI
wrapAngle(370, 360); // 10 (degrees example)
```

## Since

0.7.0
