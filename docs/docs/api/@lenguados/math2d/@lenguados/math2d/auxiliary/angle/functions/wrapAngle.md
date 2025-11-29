# Function: wrapAngle()

> **wrapAngle**(`angle`, `period`): `number`

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
wrapAngle(Math.PI, Math.PI); // 0
wrapAngle(3 * Math.PI, 2 * Math.PI); // Math.PI
wrapAngle(370, 360); // 10 (degrees example)
```

## Since

1.0.0
