# Function: clamp()

> **clamp**(`value`, `min`, `max`): `number`

Clamps a value between min and max bounds.

## Parameters

### value

`number`

Value to clamp

### min

`number`

Lower bound

### max

`number`

Upper bound

## Returns

`number`

Clamped value

## Example

```typescript
clamp(5, 0, 10); // 5
clamp(-5, 0, 10); // 0
clamp(15, 0, 10); // 10
clamp(NaN, 0, 10); // NaN
```

## Since

1.0.0
