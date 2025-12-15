# Function: formatVector2()

> **formatVector2**(`v`, `format`, `precision?`): `string`

Defined in: [src/utils/parse.ts:106](https://github.com/rndelpuerto/lenguados/blob/5a1c09d8f0353db29cb52c06235fd1f375a985bd/packages/math2d/src/utils/parse.ts#L106)

Formats a 2D vector as a string.

## Parameters

### v

[`ReadonlyVector2`](../../../../@lenguados/math2d/core/type-aliases/ReadonlyVector2.md)

Vector to format

### format

Output format: 'csv', 'space', 'json', 'brackets'

`"json"` | `"csv"` | `"space"` | `"brackets"`

### precision?

`number`

Number of decimal places (default: full precision)

## Returns

`string`

Formatted string
