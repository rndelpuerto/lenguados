# Function: safeAsin()

> **safeAsin**(`value`): `number`

Safe arc sine (clamps input to [-1, 1]).

## Parameters

### value

`number`

Value to take arc sine of

## Returns

`number`

Arc sine in radians

## Example

```typescript
safeAsin(0.5); // Math.PI / 6
safeAsin(1); // Math.PI / 2
safeAsin(-1); // -Math.PI / 2
safeAsin(2); // Math.PI / 2 (clamped to 1)
safeAsin(-2); // -Math.PI / 2 (clamped to -1)
```

## Since

1.0.0
