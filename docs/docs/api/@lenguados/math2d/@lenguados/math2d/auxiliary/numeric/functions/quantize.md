# Function: quantize()

> **quantize**(`value`, `levels`, `min`, `max`): `number`

Quantizes to specific number of levels.

## Parameters

### value

`number`

Value to quantize

### levels

`number`

Number of quantization levels

### min

`number` = `0`

Minimum value (default: 0)

### max

`number` = `1`

Maximum value (default: 1)

## Returns

`number`

Quantized value

## Example

```typescript
quantize(0.7, 5, 0, 1); // 0.75 (one of: 0, 0.25, 0.5, 0.75, 1)
quantize(0.3, 3, 0, 1); // 0.5 (one of: 0, 0.5, 1)
quantize(7, 5, 0, 10); // 7.5 (one of: 0, 2.5, 5, 7.5, 10)
```

## Since

1.0.0
