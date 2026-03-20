# Function: snapToGrid()

> **snapToGrid**(`value`, `gridSize`, `offset`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:141](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/auxiliary/numeric/rounding.ts#L141)

Snaps to grid with offset.

## Parameters

### value

`number`

Value to snap

### gridSize

`number`

Size of grid cells

### offset

`number` = `0`

Grid offset (default: 0)

## Returns

`number`

Snapped value

## Example

```typescript
snapToGrid(7, 5); // 5
snapToGrid(8, 5); // 10
snapToGrid(7, 5, 2); // 7 (snaps to 2, 7, 12, ...)
snapToGrid(3.7, 0.5); // 3.5
```

## Since

0.7.0
