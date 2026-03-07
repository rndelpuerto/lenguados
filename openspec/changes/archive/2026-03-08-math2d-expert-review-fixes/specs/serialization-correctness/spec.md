## ADDED Requirements

### Requirement: parseComplex SHALL accept scientific notation in math format

The `parseComplex` regex patterns for mathematical notation (`a+bi`, `a-bi`) and pure imaginary (`bi`) SHALL match numbers containing scientific notation (e.g., `1e5`, `2.5E-3`, `1e+10`). The current regex `/^([+-]?[\d.]+)\s*([+-])\s*([\d.]+)i$/` only matches digits and dots, rejecting valid inputs like `"1e5+2e3i"`. The pure imaginary regex `/^([+-]?[\d.]+)i$/` similarly rejects `"1e5i"`.

Both regexes SHALL be updated to include an optional scientific notation suffix `(?:[eE][+-]?\d+)?` after the digit-dot groups, producing patterns like `[+-]?[\d.]+(?:[eE][+-]?\d+)?`.

#### Scenario: parseComplex with scientific notation in both parts

- **WHEN** `parseComplex("1e5+2e3i")` is called
- **THEN** the result SHALL be `Complex(100000, 2000)`

#### Scenario: parseComplex with negative scientific exponent

- **WHEN** `parseComplex("2.5E-3+1.5e2i")` is called
- **THEN** the result SHALL be `Complex(0.0025, 150)`

#### Scenario: parseComplex with scientific notation and subtraction

- **WHEN** `parseComplex("1e5-2e3i")` is called
- **THEN** the result SHALL be `Complex(100000, -2000)`

#### Scenario: parseComplex pure imaginary with scientific notation

- **WHEN** `parseComplex("1e5i")` is called
- **THEN** the result SHALL be `Complex(0, 100000)`

#### Scenario: parseComplex pure imaginary with negative scientific exponent

- **WHEN** `parseComplex("-3.14e-2i")` is called
- **THEN** the result SHALL be `Complex(0, -0.0314)`

#### Scenario: parseComplex with explicit positive exponent sign

- **WHEN** `parseComplex("1e+5+2e+3i")` is called
- **THEN** the result SHALL be `Complex(100000, 2000)`

#### Scenario: parseComplex without scientific notation is unchanged

- **WHEN** `parseComplex("3+4i")` is called
- **THEN** the result SHALL be `Complex(3, 4)` (existing behavior preserved)

---

### Requirement: Format functions SHALL produce valid JSON for non-finite values

All format functions that support a `'json'` output format (`formatVector2`, `formatComplex`, `formatRotation2`, `formatInterval`, `formatMatrix2`, `formatMatrix3`, `formatTransform2`) SHALL produce valid JSON strings when given non-finite numeric values (`NaN`, `Infinity`, `-Infinity`). Currently, these functions interpolate `NaN.toString()` and `Infinity.toString()` directly into JSON-shaped strings, producing output like `{"x":NaN,"y":0}` which is not valid JSON per RFC 8259 (JSON does not permit `NaN`, `Infinity`, or `-Infinity` as values).

Non-finite values SHALL be serialized as `null` in JSON format, following the convention established by `JSON.stringify(NaN)` which returns `"null"`. Alternatively, the functions MAY throw an `Error` indicating that non-finite values cannot be represented in JSON. The chosen strategy SHALL be consistent across all seven format functions.

Note: The `'csv'`, `'space'`, `'brackets'`, `'flat'`, `'nested'`, `'math'`, `'radians'`, `'degrees'`, and `'components'` formats are not bound by JSON validity and MAY continue to emit `NaN` and `Infinity` as literal strings.

#### Scenario: formatVector2 JSON with NaN produces valid JSON

- **WHEN** `formatVector2({x: NaN, y: 0}, 'json')` is called
- **THEN** the result SHALL be valid JSON (parseable by `JSON.parse`)
- **AND** the result SHALL be `{"x":null,"y":0}` (or the function SHALL throw an `Error`)

#### Scenario: formatVector2 JSON with Infinity produces valid JSON

- **WHEN** `formatVector2({x: Infinity, y: -Infinity}, 'json')` is called
- **THEN** the result SHALL be valid JSON (parseable by `JSON.parse`)
- **AND** the result SHALL be `{"x":null,"y":null}` (or the function SHALL throw an `Error`)

#### Scenario: formatComplex JSON with NaN produces valid JSON

- **WHEN** `formatComplex({real: NaN, imag: 0}, 'json')` is called
- **THEN** the result SHALL be valid JSON (parseable by `JSON.parse`)

#### Scenario: formatRotation2 JSON with NaN produces valid JSON

- **WHEN** `formatRotation2({cos: NaN, sin: 0}, 'json')` is called
- **THEN** the result SHALL be valid JSON (parseable by `JSON.parse`)

#### Scenario: formatInterval JSON with Infinity produces valid JSON

- **WHEN** `formatInterval({min: -Infinity, max: Infinity}, 'json')` is called
- **THEN** the result SHALL be valid JSON (parseable by `JSON.parse`)

#### Scenario: formatMatrix2 JSON with NaN delegates to JSON.stringify

- **WHEN** `formatMatrix2` is called with a matrix containing `NaN` in the `'json'` format
- **THEN** the result SHALL be valid JSON (note: `formatMatrix2` already uses `JSON.stringify` internally via `parseFloat`, which converts `NaN` to `null` -- this behavior SHALL be verified and documented as intentional)

#### Scenario: formatTransform2 JSON with NaN produces valid JSON

- **WHEN** `formatTransform2` is called with a transform containing `NaN` values in the `'json'` format
- **THEN** the result SHALL be valid JSON (note: `formatTransform2` already uses `JSON.stringify` internally -- this behavior SHALL be verified)

#### Scenario: Non-JSON formats are unaffected

- **WHEN** `formatVector2({x: NaN, y: 0}, 'csv')` is called
- **THEN** the result SHALL be `"NaN,0"` (existing behavior preserved; CSV is not JSON)

#### Scenario: Round-trip with null substitution

- **WHEN** `formatVector2({x: 1, y: 2}, 'json')` is called (finite values)
- **THEN** `JSON.parse(result)` SHALL produce `{x: 1, y: 2}` (finite values round-trip without `null` substitution)

---

### Requirement: parseInterval JSON branch SHALL NOT swallow its own validation error

The `parseInterval` function's JSON branch throws an `Error` when `min > max`, but this validation error is caught by the same `catch` block that handles malformed JSON. The `catch` block silently falls through to the non-JSON parsing path, where the `min > max` check fires again with a potentially different error message (since the non-JSON path re-parses from the bracket-stripped string).

The JSON branch SHALL re-throw validation errors (errors thrown by the `parseInterval` logic itself, not by `JSON.parse`). The `catch` block SHALL only suppress errors originating from `JSON.parse` (i.e., `SyntaxError`). This can be achieved by:

1. Checking `error instanceof SyntaxError` in the `catch` block and re-throwing non-`SyntaxError` errors, OR
2. Moving the `min > max` validation outside the `try`/`catch` block, OR
3. Using a flag to distinguish parse errors from validation errors.

#### Scenario: parseInterval JSON with min > max throws validation error

- **WHEN** `parseInterval('{"min":10,"max":5}')` is called
- **THEN** the function SHALL throw an `Error`
- **AND** the error message SHALL reference the JSON-parsed values (`min (10)` and `max (5)`), not values re-parsed from a fallback path

#### Scenario: parseInterval JSON with malformed JSON falls through

- **WHEN** `parseInterval('{min:10, max:5}')` is called (invalid JSON: unquoted keys)
- **THEN** the `JSON.parse` `SyntaxError` SHALL be caught and the function SHALL fall through to the non-JSON path
- **AND** the non-JSON path SHALL parse the values and throw its own `min > max` error

#### Scenario: parseInterval valid JSON parses correctly

- **WHEN** `parseInterval('{"min":0,"max":10}')` is called
- **THEN** the result SHALL be `Interval(0, 10)` (existing behavior preserved)

#### Scenario: parseInterval JSON with NaN value rejects

- **WHEN** `parseInterval('{"min":0,"max":"NaN"}')` is called
- **THEN** the function SHALL NOT accept `"NaN"` as a valid number (the `typeof object.max === 'number'` check fails for string `"NaN"`)
- **AND** the function SHALL fall through to the non-JSON path

---

### Requirement: parseComplex math notation regexes SHALL reject malformed decimal numbers

The `parseComplex` regex patterns use `[\d.]+` to match numeric parts, which accepts malformed numbers like `"1.2.3"` (multiple decimal points). While `parseFloat("1.2.3")` silently returns `1.2` (parsing stops at the second dot), the regex should not match such inputs in the first place, as they indicate a malformed input string that the caller likely did not intend.

The numeric part pattern SHALL be tightened from `[\d.]+` to a pattern that allows at most one decimal point, such as `\d+(?:\.\d+)?` (integer with optional decimal part) or `\d*\.?\d+` (optional leading digits, optional dot, required trailing digits). The chosen pattern SHALL also incorporate the scientific notation suffix from the scientific notation requirement.

#### Scenario: parseComplex rejects double-decimal real part

- **WHEN** `parseComplex("1.2.3+4i")` is called
- **THEN** the function SHALL NOT match the math notation regex
- **AND** the function SHALL fall through to the comma/space parser, which will fail
- **AND** the function SHALL throw an `Error`

#### Scenario: parseComplex rejects double-decimal imaginary part

- **WHEN** `parseComplex("1+4.5.6i")` is called
- **THEN** the function SHALL throw an `Error`

#### Scenario: parseComplex rejects double-decimal pure imaginary

- **WHEN** `parseComplex("1.2.3i")` is called
- **THEN** the function SHALL throw an `Error`

#### Scenario: parseComplex accepts valid decimal numbers

- **WHEN** `parseComplex("1.5+2.7i")` is called
- **THEN** the result SHALL be `Complex(1.5, 2.7)` (existing behavior preserved)

#### Scenario: parseComplex accepts integer parts

- **WHEN** `parseComplex("3+4i")` is called
- **THEN** the result SHALL be `Complex(3, 4)` (existing behavior preserved)

#### Scenario: parseComplex accepts leading-dot decimals

- **WHEN** `parseComplex(".5+.7i")` is called
- **THEN** the result SHALL be `Complex(0.5, 0.7)` (`.5` is a valid float literal)

---

### Requirement: formatComplex SHALL preserve negative zero sign in math format

`formatComplex(Complex(1, -0), 'math')` currently produces `"1 + 0i"` (with positive sign) because the sign check `c.imag >= 0` evaluates to `true` for `-0` (IEEE 754 defines `-0 >= 0` as `true`). The negative zero sign is lost.

The `'math'` format SHALL use `Object.is(c.imag, -0)` or `1 / c.imag === -Infinity` to detect negative zero and format it with a negative sign: `"1-0i"` (or `"1 - 0i"` with spacing, matching the current formatting pattern). This preserves the IEEE 754 sign bit through the format/parse round-trip.

Note: when `precision` is specified, `(-0).toFixed(n)` returns `"0.0000"` (losing the sign). The implementation SHALL use `Object.is(c.imag, -0)` to detect this case and prepend a minus sign if needed.

#### Scenario: formatComplex math format with negative zero imaginary

- **WHEN** `formatComplex(Complex.create(1, -0), 'math')` is called
- **THEN** the result SHALL contain a minus sign before the imaginary part (e.g., `"1-0i"`)
- **AND** the result SHALL NOT show a plus sign (i.e., NOT `"1+0i"` or `"1 + 0i"`)

#### Scenario: formatComplex math format with negative zero and precision

- **WHEN** `formatComplex(Complex.create(1, -0), 'math', 4)` is called
- **THEN** the result SHALL be `"1.0000-0.0000i"` (negative sign preserved despite `toFixed` losing it)

#### Scenario: formatComplex math format with positive zero imaginary unchanged

- **WHEN** `formatComplex(Complex.create(1, 0), 'math')` is called
- **THEN** the result SHALL contain a plus sign (e.g., `"1+0i"`) (existing behavior preserved)

#### Scenario: formatComplex csv format with negative zero

- **WHEN** `formatComplex(Complex.create(1, -0), 'csv')` is called
- **THEN** the result SHALL be `"1,0"` (CSV format uses `toString()` which returns `"0"` for `-0`; this is acceptable for CSV)

---

### Requirement: Parse function bracket-matching flexibility SHALL be documented

The parse functions (`parseVector2`, `parseComplex`, `parseInterval`) use the regex `/^[([{]|[)\]}]$/g` to strip leading and trailing brackets/parentheses/braces. This regex independently strips the first character if it is any of `(`, `[`, `{` and independently strips the last character if it is any of `)`, `]`, `}`. This means mismatched brackets like `"(1,2]"`, `"[1,2}"`, or `"{1,2)"` are silently accepted and parsed as `"1,2"`.

This behavior is intentionally flexible (allows interoperability with different notation conventions, e.g., mathematical open/closed interval notation `(0,1]`), but it could mask bugs in caller code that accidentally produces mismatched delimiters. The behavior SHALL be documented in the JSDoc `@remarks` of `parseVector2`, `parseComplex`, and `parseInterval`.

#### Scenario: parseVector2 accepts mismatched brackets

- **WHEN** `parseVector2("(1,2]")` is called
- **THEN** the result SHALL be `Vector2(1, 2)` (brackets stripped independently)

#### Scenario: parseInterval accepts mathematical open interval notation

- **WHEN** `parseInterval("(0,1]")` is called
- **THEN** the result SHALL be `Interval(0, 1)` (open bracket `(` stripped from start, close bracket `]` stripped from end)

#### Scenario: parseComplex accepts mismatched delimiters

- **WHEN** `parseComplex("[3,4}")` is called
- **THEN** the result SHALL be `Complex(3, 4)` (brackets stripped independently)

#### Scenario: parseVector2 JSDoc documents bracket flexibility

- **WHEN** the `parseVector2` JSDoc is inspected
- **THEN** the `@remarks` SHALL note that opening and closing brackets/parentheses/braces are stripped independently, so mismatched delimiters (e.g., `"(1,2]"`) are accepted

#### Scenario: parseInterval JSDoc documents bracket flexibility

- **WHEN** the `parseInterval` JSDoc is inspected
- **THEN** the `@remarks` SHALL note the independent bracket stripping behavior
- **AND** SHALL mention that this enables acceptance of mathematical interval notation like `(a,b]` and `[a,b)`, but does not distinguish open from closed intervals (the parsed result is always a closed `Interval`)

#### Scenario: parseComplex JSDoc documents bracket flexibility

- **WHEN** the `parseComplex` JSDoc is inspected
- **THEN** the `@remarks` SHALL note the independent bracket stripping behavior
