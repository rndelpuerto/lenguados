# Function: isVector2Like()

> **isVector2Like**(`value`): `value is ReadonlyVector2Like`

Defined in: [src/types/index.ts:270](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/types/index.ts#L270)

Type guard to check if value has x,y properties (Vector2Like).

## Parameters

### value

`unknown`

Value to check

## Returns

`value is ReadonlyVector2Like`

True if value conforms to ReadonlyVector2Like

## Example

```typescript
const point = { x: 1, y: 2 };
if (isVector2Like(point)) {
 console.log(point.x, point.y); // TypeScript knows x, y are numbers
}
```

## Since

0.7.0
