# Function: safeAcos()

> **safeAcos**(`value`): `number`

Safe arc cosine (clamps input to [-1, 1]).

## Parameters

### value

`number`

Value to take arc cosine of

## Returns

`number`

Arc cosine in radians

## Example

```typescript
safeAcos(0.5); // Math.PI / 3
safeAcos(1); // 0
safeAcos(-1); // Math.PI
safeAcos(2); // 0 (clamped to 1)
safeAcos(-2); // Math.PI (clamped to -1)
```

## Since

1.0.0
