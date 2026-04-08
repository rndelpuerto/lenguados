# Function: formatTransform2()

> **formatTransform2**(`t`, `format?`, `precision?`): `string`

Defined in: [src/utils/parse.ts:681](https://github.com/rndelpuerto/lenguados/blob/b5bc3c56066e78e7b5908f28104e6f6ef0302803/packages/math2d/src/utils/parse.ts#L681)

Formats a 2D transform as a string.

## Parameters

### t

[`ReadonlyTransform2Like`](../../types/interfaces/ReadonlyTransform2Like.md)

Transform to format

### format?

`"json"` \| `"flat"`

Output format. Defaults to `'flat'`

### precision?

`number`

Number of decimal places. Defaults to full precision

## Returns

`string`

Formatted string

## Remarks

Supported formats: 'flat', 'json'.

## Example

```typescript
const text = formatTransform2(parseTransform2('0,0,1,0'), 'json');
```

## Since

0.7.0
