# Function: repeat()

> **repeat**(`value`, `length`): `number`

Repeats value in range with smooth blend.

## Parameters

### value

`number`

Value to repeat

### length

`number`

Period of repetition

## Returns

`number`

Repeated value in [0, length)

## Remarks

Similar to modulo but designed for smooth tiling patterns.
Always returns positive values.

## Example

```typescript
repeat(3, 2); // 1
repeat(5, 2); // 1
repeat(-1, 2); // 1
repeat(2, 2); // 0
```

## Since

1.0.0
