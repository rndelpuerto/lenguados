# Function: formatRotation2()

> **formatRotation2**(`r`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:266](https://github.com/rndelpuerto/lenguados/blob/e49c904206540fad03c397c71567a74238b2435e/packages/math2d/src/utils/parse.ts#L266)

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
