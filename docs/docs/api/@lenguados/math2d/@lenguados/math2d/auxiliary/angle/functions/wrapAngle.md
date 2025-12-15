# Function: wrapAngle()

> **wrapAngle**(`angle`, `period`): `number`

Defined in: [src/auxiliary/angle/normalization.ts:133](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/auxiliary/angle/normalization.ts#L133)

Wraps angle to specific period.

## Parameters

### angle

`number`

Angle to wrap

### period

`number` = `TAU`

Period (default: 2π)

## Returns

`number`

Wrapped angle in [0, period)

## Example

```typescript
wrapAngle(Math.PI, Math.PI);          // 0
wrapAngle(3 * Math.PI, 2 * Math.PI);  // Math.PI
wrapAngle(370, 360);                  // 10 (degrees example)
```

## Since

1.0.0
