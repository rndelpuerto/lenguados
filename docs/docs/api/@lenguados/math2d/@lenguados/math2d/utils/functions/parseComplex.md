# Function: parseComplex()

> **parseComplex**(`string_`, `out`): [`Complex`](../../core/classes/Complex.md)

Defined in: [src/utils/parse.ts:683](https://github.com/rndelpuerto/lenguados/blob/76bf48f6de585e4e63fa105b28c850c7b70ac176/packages/math2d/src/utils/parse.ts#L683)

Parses a string representation of a complex number.

## Parameters

### string\_

`string`

Input string to parse.

### out

[`Complex`](../../core/classes/Complex.md) = `...`

Optional output complex to avoid allocation. Defaults to `new Complex()`.

## Returns

[`Complex`](../../core/classes/Complex.md)

The `out` complex containing the parsed values.

## Throws

If the string cannot be parsed.

## Remarks

Supported formats:

- "a+bi" or "a-bi" (standard mathematical notation)
- "a,b" (comma-separated real,imag)
- "(a,b)" (with parentheses)
- "{real:a, imag:b}" (JSON-like)

## Example

```typescript
const c1 = parseComplex('3+4i'); // 3 + 4i
const c2 = parseComplex('3,-4'); // 3 - 4i
const c3 = parseComplex('{"real":1,"imag":0}'); // 1 + 0i
```

## Since

0.7.0
