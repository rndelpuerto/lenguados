# Function: isTransform2Like()

> **isTransform2Like**(`value`): `value is ReadonlyTransform2Like`

Defined in: [src/types/index.ts:434](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/types/index.ts#L434)

Type guard to check if value has transform2 properties (Transform2Like).

## Parameters

### value

`unknown`

Value to check.

## Returns

`value is ReadonlyTransform2Like`

True if value conforms to ReadonlyTransform2Like.

## Example

```typescript
const transform = {
 position: { x: 0, y: 0 },
 rotation: { cos: 1, sin: 0 },
 scale: { x: 1, y: 1 },
};
if (isTransform2Like(transform)) {
 console.log(transform.position.x); // TypeScript knows structure
}
```

## Since

0.7.0
