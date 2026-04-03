# Function: formatRotation2()

> **formatRotation2**(`r`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:278](https://github.com/rndelpuerto/lenguados/blob/3df0cd5faf71dfb9a81874ce52cb086af634e3ac/packages/math2d/src/utils/parse.ts#L278)

Formats a 2D rotation as a string.

## Parameters

### r

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to format

### format

Output format. Defaults to `'radians'`

`"json"` | `"radians"` | `"degrees"` | `"components"`

### precision?

`number`

Number of decimal places. Defaults to full precision

## Returns

`string`

Formatted string

## Remarks

Supported formats: 'radians', 'degrees', 'components', 'json'.

## Example

```typescript
const text = formatRotation2(Rotation2.fromAngle(Math.PI / 2), 'degrees');
```

## Since

0.7.0
