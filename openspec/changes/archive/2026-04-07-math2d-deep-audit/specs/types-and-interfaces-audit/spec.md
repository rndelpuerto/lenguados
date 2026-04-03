## ADDED Requirements

### Requirement: Every core type has a complete Readonly/mutable Like interface pair

For each concrete type (Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2), `types/` SHALL export:

- `Readonly<Type>Like` — structural interface with only the minimum read-only fields
- `<Type>Like` — extends `Readonly<Type>Like` allowing mutation (mutable fields)

The `ReadonlyVector2Like` SHALL only require `{ readonly x: number; readonly y: number }`. The mutable `Vector2Like` SHALL allow `{ x: number; y: number }`. No concrete class instances SHALL be imported by `types/` — the interfaces must be structural (duck-typed) so any POJO satisfying the shape qualifies.

#### Scenario: POJOs satisfy Readonly\*Like interfaces

- **WHEN** `{x: 1, y: 2}` is passed where `ReadonlyVector2Like` is expected
- **THEN** TypeScript SHALL not produce a type error

#### Scenario: Readonly\*Like interfaces reject mutation

- **WHEN** a consumer attempts to assign to a property of `ReadonlyVector2Like`
- **THEN** TypeScript SHALL produce a compile-time error

---

### Requirement: Type guard functions exist for every \*Like interface

For each `*Like` pair, `types/` SHALL export a corresponding type guard: `isVector2Like`, `isMatrix2Like`, `isMatrix3Like`, `isRotation2Like`, `isComplexLike`, `isIntervalLike`, `isTransform2Like`. Each type guard SHALL check the minimum structural contract (required fields are numbers) and return a `value is Readonly<Type>Like` predicate. Type guards SHALL NOT import concrete classes.

#### Scenario: Type guard accepts valid POJO

- **WHEN** `isVector2Like({x:1, y:2})` is called
- **THEN** result SHALL be `true`

#### Scenario: Type guard rejects structurally invalid objects

- **WHEN** `isVector2Like({x:1})` (missing y) or `isVector2Like({x:'hello', y:0})` (wrong type) is called
- **THEN** result SHALL be `false`

#### Scenario: Type guard handles NaN fields

- **WHEN** `isVector2Like({x:NaN, y:0})` is called
- **THEN** the audit SHALL decide and document whether NaN fields are considered valid structure (they are numbers); the decision SHALL be consistent across all type guards

---

### Requirement: SinCos type is correct and placed in types/

The `SinCos` and `ReadonlySinCos` types SHALL exist in `types/` and define `{ cos: number; sin: number }` and its readonly variant. They SHALL be used as the return type of `sinCos(...)` in both `auxiliary/angle/operations.ts` and `deterministic/`. No additional fields (e.g., `angle`) SHALL be included in `SinCos` — it is purely a pre-computed pair.

#### Scenario: `SinCos` is structurally minimal

- **WHEN** the audit inspects the definition of `SinCos`
- **THEN** it SHALL have exactly two fields: `cos: number` and `sin: number`

#### Scenario: `ReadonlySinCos` is the readonly variant

- **WHEN** a function returns `SinCos` results to a caller
- **THEN** the caller SHALL receive `ReadonlySinCos` to prevent accidental mutation of cached values

---

### Requirement: EigenvalueResult family is justified or removed

The `RealEigenvalues`, `ComplexEigenvalues`, `EigenvalueResult`, `RealEigendecomposition`, `ComplexEigendecomposition`, and `EigendecomposeResult` types SHALL be kept only if `Matrix2` or `Matrix3` in `core/` exposes an `eigendecompose()` method or similar operation. If no core method uses these types, they SHALL receive a REMOVE verdict (they constitute dead public API surface that suggests physics/PDE-solving complexity at the wrong layer).

#### Scenario: Eigenvalue types have live callers

- **WHEN** the audit greps for `EigenvalueResult`, `EigendecomposeResult`, `RealEigendecomposition`, `ComplexEigendecomposition` across all non-test source files
- **THEN** at least one non-test method SHALL use these types; if zero results are found they SHALL receive REMOVE verdict

---

### Requirement: types/ layer has zero imports from other layers

All files in `types/` SHALL import only from TypeScript built-ins and each other. No import from `auxiliary/`, `core/`, `deterministic/`, `validation/`, or `utils/` SHALL exist. This is the interface isolation invariant — types must be dependency-free for downstream packages to import only what they need.

#### Scenario: Dependency isolation check

- **WHEN** the audit scans all import statements in `types/` source files
- **THEN** zero cross-layer imports SHALL be found
