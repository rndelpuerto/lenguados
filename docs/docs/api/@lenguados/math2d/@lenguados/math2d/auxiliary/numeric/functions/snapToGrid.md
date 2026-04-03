# Function: snapToGrid()

> **snapToGrid**(`value`, `gridSize`, `offset`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:204](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/auxiliary/numeric/rounding.ts#L204)

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
