# Function: springAngle()

> **springAngle**(`current`, `target`, `velocity`, `stiffness`, `damping`, `dt`): `object`

Spring interpolation for angles.

## Parameters

### current

`number`

Current angle in radians

### target

`number`

Target angle in radians

### velocity

`number`

Current angular velocity (rad/s)

### stiffness

`number`

Spring stiffness (0-1)

### damping

`number`

Damping factor (0-1)

### dt

`number`

Time step

## Returns

`object`

Object with new angle and angular velocity

### angle

> **angle**: `number`

### velocity

> **velocity**: `number`

## Example

```typescript
let angle = 0,
 velocity = 0;
const result = springAngle(angle, Math.PI, velocity, 0.1, 0.9, 0.016);
angle = result.angle;
velocity = result.velocity;
```

## Since

1.0.0
