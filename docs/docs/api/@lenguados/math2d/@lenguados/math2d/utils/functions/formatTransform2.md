# Function: formatTransform2()

> **formatTransform2**(`t`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:623](https://github.com/rndelpuerto/lenguados/blob/39bc447afe3bf2e923cd6256cbc68afb64bc0fd0/packages/math2d/src/utils/parse.ts#L623)

Formats a 2D transform as a string.

## Parameters

### t

[`ReadonlyTransform2`](../../core/type-aliases/ReadonlyTransform2.md)

Transform to format.

### format

Output format. Defaults to `'flat'`.

`"json"` | `"flat"`

### precision?

`number`

Number of decimal places. Defaults to full precision.

## Returns

`string`

Formatted string.

## Remarks

Supported formats: 'flat', 'json'.

## Example

```typescript
const text = formatTransform2(parseTransform2('0,0,1,0'), 'json');
```

## Since

0.1.0
