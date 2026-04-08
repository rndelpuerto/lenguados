# Function: roundToMultiple()

> **roundToMultiple**(`value`, `multiple`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:101](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/auxiliary/numeric/rounding.ts#L101)

Rounds to nearest multiple.

## Parameters

### value

`number`

Value to round

### multiple

`number`

Multiple to round to

## Returns

`number`

Rounded value

## Example

```typescript
roundToMultiple(7, 5); // 5
roundToMultiple(8, 5); // 10
roundToMultiple(23, 10); // 20
roundToMultiple(1.7, 0.5); // 1.5
```

## See

[snapToGrid](snapToGrid.md) - Equivalent: roundToMultiple(value, multiple) = snapToGrid(value, multiple, 0)

## Since

0.7.0
