## MODIFIED Requirements

### Requirement: defaultRandomSource SHALL use function-only API

The `defaultRandomSource` SHALL NOT be exported as a mutable `let` binding. Access SHALL be exclusively through `getDefaultRandomSource()` and `setDefaultRandomSource()` functions. The mutable variable SHALL remain internal to the module.

#### Scenario: getDefaultRandomSource returns current source

- **WHEN** `getDefaultRandomSource()` is called without prior `setDefaultRandomSource`
- **THEN** it SHALL return a `MathRandomSource` instance (the default)

#### Scenario: setDefaultRandomSource changes the active source

- **WHEN** `setDefaultRandomSource(new SeededRandomSource(42))` is called
- **THEN** subsequent calls to `getDefaultRandomSource()` SHALL return the seeded source

#### Scenario: Direct import of defaultRandomSource is not possible

- **WHEN** a consumer attempts `import { defaultRandomSource } from '@lenguados/math2d'`
- **THEN** the import SHALL NOT resolve to a mutable `let` binding

#### Scenario: Random functions use getter internally

- **WHEN** `randomVector2()` is called without explicit source parameter
- **THEN** it SHALL internally call `getDefaultRandomSource()` to obtain the active source

## ADDED Requirements

### Requirement: Transform2 serialization SHALL include scale

The `formatTransform2` and `parseTransform2` functions in `utils/parse.ts` SHALL serialize and deserialize all three Transform2 components: position, rotation, and scale.

See `serialization-correctness` spec for full scenario coverage.

#### Scenario: formatTransform2 JSON includes scale

- **WHEN** `formatTransform2(t, 'json')` is called with `t.scale = (2, 3)`
- **THEN** the output SHALL contain a `"s"` field with `{"x":2,"y":3}`

#### Scenario: parseTransform2 extracts scale from JSON

- **WHEN** `parseTransform2('{"p":{"x":0,"y":0},"r":{"cos":1,"sin":0},"s":{"x":2,"y":3}}')` is called
- **THEN** the result SHALL have `scale.x === 2` and `scale.y === 3`

### Requirement: config.useNativeMath SHALL document thread-safety constraints

The `config` object in `deterministic-kernels.ts` SHALL have JSDoc documenting:

1. It is a global mutable singleton
2. Changing it affects all subsequent deterministic math calls
3. It is NOT thread-safe for concurrent/worker scenarios
4. It MUST be set before any deterministic computation begins and not changed during simulation

#### Scenario: config JSDoc includes thread-safety warning

- **WHEN** the JSDoc for `config` is inspected
- **THEN** it SHALL contain a `@remarks` section warning about global mutability and thread-safety
