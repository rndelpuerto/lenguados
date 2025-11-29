# Function: springInterp()

> **springInterp**(`current`, `target`, `velocity`, `stiffness`, `damping`, `dt`): `object`

Spring-like interpolation.
Overshoots and settles.

## Parameters

### current

`number`

Current value

### target

`number`

Target value

### velocity

`number`

Current velocity

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

Object with new value and velocity

### value

> **value**: `number`

### velocity

> **velocity**: `number`

## Example

```typescript
let pos = 0,
 vel = 0;
const result = springInterp(pos, 100, vel, 0.1, 0.9, 0.016);
pos = result.value;
vel = result.velocity;
```

## Since

1.0.0
