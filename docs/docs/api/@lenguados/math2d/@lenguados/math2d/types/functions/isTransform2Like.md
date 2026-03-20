# Function: isTransform2Like()

> **isTransform2Like**(`value`): `value is ReadonlyTransform2Like`

Defined in: [src/types/index.ts:416](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/types/index.ts#L416)

Type guard to check if value has transform2 properties (Transform2Like).

## Parameters

### value

`unknown`

Value to check

## Returns

`value is ReadonlyTransform2Like`

True if value conforms to ReadonlyTransform2Like

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
