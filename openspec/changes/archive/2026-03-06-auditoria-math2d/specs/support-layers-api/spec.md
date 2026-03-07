## ADDED Requirements

### Requirement: Deterministic kernel exports

The `deterministic/deterministic-kernels.ts` module SHALL export:

- `DeterministicKernels` object containing all deterministic functions
- Individual named exports: `sin`, `cos`, `sinCos`, `tan`, `asin`, `asinSafe`, `acos`, `acosSafe`, `atan`, `atan2`, `sqrt`, `sqrtSafe`, `exp`, `expSafe`, `log`, `logSafe`, `pow`, `hypot`
- `config` object with `useNativeMath: boolean` toggle

The `SinCos` interface SHALL be re-exported from `auxiliary/angle/operations`.

No functions from deleted modules (PrecisionMath, RoundingControl) SHALL be referenced
anywhere in the codebase.

#### Scenario: Deterministic sin matches fdlibm reference

- **WHEN** `sin(PI / 6)` is called
- **THEN** it SHALL return a value within 1 ULP of the fdlibm reference value for sin(PI/6)

#### Scenario: config.useNativeMath toggles implementation

- **WHEN** `config.useNativeMath` is set to `true`
- **THEN** all kernel functions SHALL delegate to `Math.*` equivalents

#### Scenario: No stale references to deleted modules

- **WHEN** searching the entire `packages/math2d/src/` tree for "PrecisionMath" or "RoundingControl"
- **THEN** zero matches SHALL be found

---

### Requirement: Type interfaces symmetry

The `types/index.ts` module SHALL export exactly 7 Readonly + 7 Mutable interface pairs
plus 7 type guard functions:

| Type       | Readonly Interface     | Mutable Interface | Type Guard       |
| ---------- | ---------------------- | ----------------- | ---------------- |
| Vector2    | ReadonlyVector2Like    | Vector2Like       | isVector2Like    |
| Matrix2    | ReadonlyMatrix2Like    | Matrix2Like       | isMatrix2Like    |
| Matrix3    | ReadonlyMatrix3Like    | Matrix3Like       | isMatrix3Like    |
| Rotation2  | ReadonlyRotation2Like  | Rotation2Like     | isRotation2Like  |
| Complex    | ReadonlyComplexLike    | ComplexLike       | isComplexLike    |
| Interval   | ReadonlyIntervalLike   | IntervalLike      | isIntervalLike   |
| Transform2 | ReadonlyTransform2Like | Transform2Like    | isTransform2Like |

Each Readonly interface SHALL have all properties marked `readonly`.
Each Mutable interface SHALL have all properties mutable.
Both interfaces for the same type SHALL have identical property names.

#### Scenario: ReadonlyVector2Like accepts plain object

- **WHEN** a function parameter is typed as `ReadonlyVector2Like`
- **THEN** it SHALL accept `{ x: 3, y: 4 }` as a valid argument

#### Scenario: Type guard detects valid shape

- **WHEN** `isVector2Like({ x: 1, y: 2 })` is called
- **THEN** it SHALL return `true`

#### Scenario: Type guard rejects invalid shape

- **WHEN** `isVector2Like({ a: 1, b: 2 })` is called
- **THEN** it SHALL return `false`

#### Scenario: Type guard handles null/undefined

- **WHEN** `isVector2Like(null)` or `isVector2Like(undefined)` is called
- **THEN** it SHALL return `false` without throwing

---

### Requirement: Validation assertions for all 7 types

The `validation/assert.ts` module SHALL export:

**Configuration:**

- `setAssertionsEnabled(enabled)` — runtime toggle
- `areAssertionsEnabled()` — query state

**Generic:**

- `assert(condition, message?)` — boolean assertion

**Scalar assertions:**

- `assertFinite(value, name?)`
- `assertNonZero(value, name?)`
- `assertRange(value, min, max, name?)`
- `assertPositive(value, name?)`
- `assertNonNegative(value, name?)`
- `assertSafeInteger(value, name?)`

**Component-level assertions (one per type):**

- `assertVector2(x, y, name?)` — validates both components finite
- `assertMatrix2(m00, m01, m10, m11, name?)` — validates all 4 elements finite
- `assertMatrix3(m00..m22, name?)` — validates all 9 elements finite
- `assertRotation2(cos, sin, name?)` — validates both components finite
- `assertComplex(real, imag, name?)` — validates both components finite **(NEW)**
- `assertInterval(min, max, name?)` — validates both finite AND min <= max **(NEW)**
- `assertTransform2(px, py, cos, sin, sx, sy, name?)` — validates all 6 components finite **(NEW)**

**Shape assertions (one per type):**

- `assertVector2Like(value, name?)`
- `assertMatrix2Like(value, name?)`
- `assertMatrix3Like(value, name?)` **(NEW — currently missing)**
- `assertRotation2Like(value, name?)`
- `assertComplexLike(value, name?)`
- `assertIntervalLike(value, name?)`
- `assertTransform2Like(value, name?)` — **NOTE**: existing implementation may have a property naming
  bug (checking for wrong property names). Must be verified and fixed if needed during implementation.

All assertions SHALL be no-ops in production builds via DCE
(`if (!DEV_MODE) return;` guard).

#### Scenario: assertComplex validates finite components

- **WHEN** `assertComplex(3, NaN, 'z')` is called with assertions enabled
- **THEN** it SHALL throw an Error mentioning 'z' and the NaN component

#### Scenario: assertInterval validates ordering

- **WHEN** `assertInterval(5, 3, 'range')` is called (min > max)
- **THEN** it SHALL throw an Error mentioning 'range' and the ordering violation

#### Scenario: assertTransform2 validates 6 components

- **WHEN** `assertTransform2(0, 0, 1, 0, Infinity, 1, 'tf')` is called
- **THEN** it SHALL throw an Error mentioning 'tf' and the Infinity component

#### Scenario: Assertions are no-ops in production

- **WHEN** `process.env.NODE_ENV === 'production'`
- **THEN** all assertion functions SHALL return immediately without any checks

#### Scenario: assertMatrix3Like validates shape

- **WHEN** `assertMatrix3Like({ m00: 1, m01: 0, m02: 0, m10: 0, m11: 1, m12: 0, m20: 0, m21: 0, m22: 1 })` is called
- **THEN** it SHALL pass without error

---

### Requirement: Utils formatting covers all types

The `utils/parse.ts` module SHALL export parse + format function pairs for all 7 core types:

- `parseVector2` / `formatVector2`
- `parseRotation2` / `formatRotation2`
- `parseMatrix2` / `formatMatrix2`
- `parseMatrix3` / `formatMatrix3`
- `parseTransform2` / `formatTransform2`
- `parseComplex` / `formatComplex`
- `parseInterval` / `formatInterval`

All parse functions SHALL accept an optional `out` parameter as last argument.
All format functions SHALL accept an optional `precision` parameter.

#### Scenario: Parse and format round-trip

- **WHEN** `parseVector2(formatVector2(v, 'csv', 6))` is called for any finite Vector2
- **THEN** the result SHALL nearEqual the original within the precision tolerance

---

### Requirement: Utils random generation covers all types

The `utils/random.ts` module SHALL export random generators for:

- Vectors: `randomVector2`, `randomUnitVector2`
- Complex: `randomComplex`, `randomUnitComplex`
- Rotation: `randomRotation2`, `randomRotationMatrix2`
- Transform: `randomTransform2`
- Interval: `randomInterval`
- Spatial: `randomInCircle`, `randomInUnitCircle`, `randomOnCircle`, `randomInRectangle`, `randomInBox`, `randomOnRectangle`, `randomInTriangle`, `randomOnTriangle`, `randomOnSegment`
- Distribution: `randomGaussianVector2`

All random functions SHALL accept an optional `source?: RandomSource` parameter as last argument.
All random functions that produce objects SHALL accept an optional `out` parameter before `source`.
All random functions SHALL use deterministic math (sin, cos, sqrt, log from kernels) for
cross-platform reproducibility when used with `SeededRandomSource`.

#### Scenario: Seeded random is reproducible

- **WHEN** `randomVector2(0, 1, undefined, new SeededRandomSource(42))` is called twice with same seed
- **THEN** both calls SHALL return exactEquals vectors

---

### Requirement: Public index.ts exports are clean and complete

The `src/index.ts` SHALL:

1. Re-export all types (`export * from './types'`)
2. Re-export all auxiliary modules (`export * from './auxiliary/scalar'`, `./auxiliary/angle'`, `./auxiliary/numeric'`)
3. Re-export all core types (`export * from './core'`)
4. Re-export `DeterministicKernels` and individual kernel functions by name
5. Re-export all validation functions by name
6. NOT contain references to deleted modules (PrecisionMath, RoundingControl) in code or JSDoc

Utils (random, parse, performance) SHALL remain importable via subpath
(`@lenguados/math2d/utils/random`, etc.) but NOT re-exported from the main index
to keep the main entry lean and tree-shakeable.

#### Scenario: Main import provides core API

- **WHEN** `import { Vector2, sin, EPSILON, assertFinite } from '@lenguados/math2d'`
- **THEN** all symbols SHALL resolve correctly

#### Scenario: JSDoc contains no stale references

- **WHEN** reading the JSDoc comment in `src/index.ts`
- **THEN** it SHALL NOT mention PrecisionMath, RoundingControl, or any other deleted module

#### Scenario: Utils not in main export

- **WHEN** `import { parseVector2 } from '@lenguados/math2d'`
- **THEN** it SHALL NOT resolve — parse functions are only available via `@lenguados/math2d/utils/parse`
