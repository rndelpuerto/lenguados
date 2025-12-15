# Function: isRotation2Like()

> **isRotation2Like**(`value`): `value is ReadonlyRotation2Like`

Defined in: [src/types/index.ts:332](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/types/index.ts#L332)

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

0.1.0
