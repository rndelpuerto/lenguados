# Function: formatRotation2()

> **formatRotation2**(`r`, `format?`, `precision?`): `string`

Defined in: [src/utils/parse.ts:278](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L278)

Formats a 2D rotation as a string.

## Parameters

### r

[`ReadonlyRotation2Like`](../../types/interfaces/ReadonlyRotation2Like.md)

Rotation to format

### format?

`"json"` \| `"radians"` \| `"degrees"` \| `"components"`

Output format. Defaults to `'radians'`

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
