## ADDED Requirements

### Requirement: Transform2 format SHALL include scale components

The `formatTransform2` function SHALL include scale components in all output formats. The JSON format SHALL produce `{p: {x, y}, r: {cos, sin}, s: {x, y}}` where `s` represents the scale vector. The flat format SHALL produce `"px,py,cos,sin,sx,sy"`.

#### Scenario: Format Transform2 with non-uniform scale to JSON

- **WHEN** `formatTransform2` is called with a Transform2 having `position=(1,2)`, `rotation=PI/4`, `scale=(2,3)` and format `'json'`
- **THEN** the output SHALL contain `"s":{"x":2,"y":3}` alongside position and rotation

#### Scenario: Format Transform2 with default scale to JSON

- **WHEN** `formatTransform2` is called with a Transform2 having `scale=(1,1)` and format `'json'`
- **THEN** the output SHALL contain `"s":{"x":1,"y":1}`

#### Scenario: Format Transform2 to flat string

- **WHEN** `formatTransform2` is called with format `'flat'` and `scale=(2,3)`
- **THEN** the output SHALL be `"px,py,cos,sin,2,3"` (6 components)

### Requirement: parseTransform2 SHALL extract scale from input

The `parseTransform2` function SHALL parse scale components from input strings. When scale is absent (legacy format), it SHALL default to `(1,1)`.

#### Scenario: Parse Transform2 with scale from JSON

- **WHEN** `parseTransform2` is called with `'{"p":{"x":1,"y":2},"r":{"cos":1,"sin":0},"s":{"x":2,"y":3}}'`
- **THEN** the result SHALL have `scale.x === 2` and `scale.y === 3`

#### Scenario: Parse Transform2 without scale (legacy format)

- **WHEN** `parseTransform2` is called with `'{"p":{"x":1,"y":2},"r":{"cos":1,"sin":0}}'` (no `s` field)
- **THEN** the result SHALL have `scale.x === 1` and `scale.y === 1`

#### Scenario: Parse Transform2 from flat string with 6 components

- **WHEN** `parseTransform2` is called with `"1,2,1,0,2,3"`
- **THEN** the result SHALL have `position=(1,2)`, `rotation=identity`, `scale=(2,3)`

#### Scenario: Parse Transform2 from flat string with 4 components (legacy)

- **WHEN** `parseTransform2` is called with `"1,2,1,0"` (4 components, no scale)
- **THEN** the result SHALL have `scale=(1,1)` as default

### Requirement: Transform2 round-trip SHALL preserve all components

`parseTransform2(formatTransform2(t))` SHALL produce a Transform2 that is `nearEquals` to the original for all finite values of position, rotation, and scale.

#### Scenario: Round-trip Transform2 with non-uniform scale

- **WHEN** a Transform2 with `position=(3.14, -2.71)`, `rotation=1.23`, `scale=(0.5, 2.0)` is formatted to JSON and parsed back
- **THEN** the parsed result SHALL satisfy `Transform2.nearEquals(original, parsed)`

#### Scenario: Round-trip Transform2 with negative scale

- **WHEN** a Transform2 with `scale=(-1, 1)` (horizontal flip) is formatted and parsed back
- **THEN** the parsed result SHALL preserve the negative scale value

### Requirement: Interval parse SHALL validate min <= max in all paths

The `parseInterval` function SHALL validate that `min <= max` after parsing, regardless of whether the input was parsed from JSON, brackets, CSV, or any other format.

#### Scenario: Parse Interval from JSON with inverted bounds

- **WHEN** `parseInterval` is called with `'{"min":5,"max":1}'`
- **THEN** it SHALL throw a `RangeError` indicating min must be <= max

#### Scenario: Parse Interval from brackets with inverted bounds

- **WHEN** `parseInterval` is called with `"[5,1]"`
- **THEN** it SHALL throw a `RangeError`

#### Scenario: Parse Interval from CSV with valid bounds

- **WHEN** `parseInterval` is called with `"1,5"`
- **THEN** it SHALL return an Interval with `min=1, max=5`

### Requirement: Parse functions SHALL reject NaN results (ALREADY SATISFIED)

All parse functions already validate against NaN in their `parseFloat` code paths. JSON.parse cannot produce NaN values. This requirement documents the existing behavior.

#### Scenario: Parse Vector2 from string producing NaN

- **WHEN** `parseVector2` is called with `"abc,def"`
- **THEN** it SHALL throw (existing: line 108-109 checks `isNaN(x) || isNaN(y)`)

#### Scenario: Parse Complex from partial NaN input

- **WHEN** `parseComplex` is called with `"3+xi"` (non-numeric imaginary)
- **THEN** it SHALL throw rather than returning `Complex(3, NaN)` (existing: line 706 checks `!isNaN(real) && !isNaN(imag)`)

### Requirement: Parse/format round-trip test suite SHALL exist

A dedicated test file `test/utils/parse.node.spec.ts` SHALL exist covering round-trip correctness for all 7 type pairs (Vector2, Rotation2, Matrix2, Matrix3, Transform2, Complex, Interval) across all supported formats.

#### Scenario: Round-trip Vector2 through all formats

- **WHEN** a Vector2 is formatted with each of `'csv'`, `'space'`, `'json'`, `'brackets'` and parsed back
- **THEN** the result SHALL satisfy `Vector2.nearEquals(original, parsed)` for each format

#### Scenario: Round-trip Interval through all formats

- **WHEN** an Interval `[2.5, 7.3]` is formatted with `'brackets'`, `'csv'`, `'json'` and parsed back
- **THEN** the result SHALL satisfy `Interval.nearEquals(original, parsed)` for each format
