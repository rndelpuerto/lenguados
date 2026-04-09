# Function: parseComplex()

> **parseComplex**(`string_`, `out?`): [`Complex`](../../core/classes/Complex.md)

Defined in: [src/utils/parse.ts:733](https://github.com/rndelpuerto/lenguados/blob/d802d438ec4beeaab5f6ab1340a68f854e86e5be/packages/math2d/src/utils/parse.ts#L733)

Parses a string representation of a complex number.

## Parameters

### string\_

`string`

Input string to parse

### out?

[`Complex`](../../core/classes/Complex.md) = `...`

Optional output complex to avoid allocation. Defaults to `new Complex()`

## Returns

[`Complex`](../../core/classes/Complex.md)

The `out` complex containing the parsed values

## Remarks

Supported formats:

- "a+bi" or "a-bi" (standard mathematical notation)
- "a,b" (comma-separated real,imag)
- "(a,b)" (with parentheses)
- "{real:a, imag:b}" (JSON-like)

Note: bracket stripping accepts mismatched brackets (e.g., "(1,2]").

## Throws

If the string cannot be parsed

## Example

```typescript
const c1 = parseComplex('3+4i'); // 3 + 4i
const c2 = parseComplex('3,-4'); // 3 - 4i
const c3 = parseComplex('{"real":1,"imag":0}'); // 1 + 0i
```

## Since

0.7.0
