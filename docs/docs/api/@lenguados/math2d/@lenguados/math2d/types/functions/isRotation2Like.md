# Function: isRotation2Like()

> **isRotation2Like**(`value`): `value is ReadonlyRotation2Like`

Defined in: [src/types/index.ts:332](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/types/index.ts#L332)

Type guard to check if value has rotation properties (Rotation2Like).

## Parameters

### value

`unknown`

Value to check.

## Returns

`value is ReadonlyRotation2Like`

True if value conforms to ReadonlyRotation2Like.

## Example

```typescript
const rot = { cos: 1, sin: 0 };
if (isRotation2Like(rot)) {
 console.log(rot.cos, rot.sin); // TypeScript knows cos, sin are numbers
}
```

## Since

0.7.0
