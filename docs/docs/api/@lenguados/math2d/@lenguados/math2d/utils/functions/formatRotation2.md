# Function: formatRotation2()

> **formatRotation2**(`r`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:246](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L246)

Formats a 2D rotation as a string.

## Parameters

### r

[`ReadonlyRotation2`](../../core/type-aliases/ReadonlyRotation2.md)

Rotation to format.

### format

Output format. Defaults to `'radians'`.

`"json"` | `"radians"` | `"degrees"` | `"components"`

### precision?

`number`

Number of decimal places. Defaults to full precision.

## Returns

`string`

Formatted string.

## Remarks

Supported formats: 'radians', 'degrees', 'components', 'json'.

## Example

```typescript
const text = formatRotation2(Rotation2.fromAngle(Math.PI / 2), 'degrees');
```

## Since

0.1.0
