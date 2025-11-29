# Function: mod()

> **mod**(`dividend`, `divisor`): `number`

Modulo operation that always returns positive result.
Unlike %, this handles negative numbers correctly.

## Parameters

### dividend

`number`

Value to divide

### divisor

`number`

Divisor (must be positive)

## Returns

`number`

Positive modulo result

## Example

```typescript
mod(7, 3); // 1
mod(-7, 3); // 2 (not -1 like %)
mod(-1, 3); // 2
```

## Since

1.0.0
