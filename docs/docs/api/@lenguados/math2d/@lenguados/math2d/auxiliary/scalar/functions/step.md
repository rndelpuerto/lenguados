# Function: step()

> **step**(`edge`, `x`): `number`

Step function (Heaviside function).
Returns 0 if x < edge, else 1.

## Parameters

### edge

`number`

Threshold value

### x

`number`

Input value

## Returns

`number`

0 or 1

## Example

```typescript
step(5, 3); // 0 (3 < 5)
step(5, 5); // 1 (5 >= 5)
step(5, 7); // 1 (7 > 5)
```

## Since

1.0.0
