# Function: snapToGrid()

> **snapToGrid**(`value`, `gridSize`, `offset?`): `number`

Defined in: [src/auxiliary/numeric/rounding.ts:203](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/auxiliary/numeric/rounding.ts#L203)

Snaps to grid with offset.

## Parameters

### value

`number`

Value to snap

### gridSize

`number`

Size of grid cells

### offset?

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
