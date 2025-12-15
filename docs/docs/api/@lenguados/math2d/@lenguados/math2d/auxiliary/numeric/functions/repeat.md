# Function: repeat()

> **repeat**(`value`, `length`): `number`

Defined in: [src/auxiliary/numeric/wrapping.ts:223](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/auxiliary/numeric/wrapping.ts#L223)

Repeats value in range (strict).

## Parameters

### value

`number`

Value to repeat.

### length

`number`

Period of repetition.

## Returns

`number`

Repeated value in [0, length).

## Throws

If length <= 0.

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

## See

- [repeatSafe](repeatSafe.md) - Returns 0 if length is invalid
- [repeatUnchecked](repeatUnchecked.md) - No validation

## Since

1.0.0
