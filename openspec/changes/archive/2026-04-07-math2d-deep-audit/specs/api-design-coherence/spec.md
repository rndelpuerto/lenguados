## ADDED Requirements

### Requirement: Layer dependency graph is strictly respected

The math2d layered architecture defines a strict dependency order: `deterministic` ← `auxiliary` ← `core` ← `types`/`validation`/`utils`. No import SHALL flow upward or laterally in violation of this order. The audit SHALL trace every import statement in every source file and produce a violation report.

#### Scenario: No upward imports exist

- **WHEN** the audit scans all source files in `deterministic/`, `auxiliary/`, and `core/`
- **THEN** no import SHALL reference a module in a layer above it in the hierarchy

#### Scenario: `types/` imports nothing from other layers

- **WHEN** the audit scans `types/` imports
- **THEN** zero imports from `deterministic/`, `auxiliary/`, `core/`, `validation/`, or `utils/` SHALL exist

#### Scenario: `validation/` imports only from `types/` and `core/`

- **WHEN** the audit scans `validation/` imports
- **THEN** imports SHALL only come from `types/` and `core/`; no import from `utils/` or `auxiliary/` above `core/` SHALL exist

---

### Requirement: All fallible static operations follow strict/safe/unchecked triality

Every static method on a core type that can fail for degenerate inputs (e.g., normalize with zero-length vector, invert with singular matrix, divide with zero scalar) SHALL have exactly three variants:

- **Strict** (default, no suffix): Validates input, throws `AssertionError` in development, undefined behavior in production
- **Safe** (`*Safe` suffix): Returns a caller-provided fallback, never throws
- **Unchecked** (`*Unchecked` suffix): No validation, maximum performance for trusted inputs

The audit SHALL enumerate all fallible static methods and verify all three variants exist. Missing variants SHALL receive ADD verdicts. Methods that cannot fail for any finite input SHALL NOT have triality variants.

#### Scenario: `Vector2.normalize` has all three variants

- **WHEN** the audit checks the Vector2 API for normalize
- **THEN** `Vector2.normalize(v, out?)`, `Vector2.normalizeSafe(v, fallback, out?)`, and `Vector2.normalizeUnchecked(v, out?)` SHALL all exist

#### Scenario: `Matrix3.inverse` has all three variants

- **WHEN** the audit checks the Matrix3 API for inverse
- **THEN** `Matrix3.inverse(m, out?)`, `Matrix3.inverseSafe(m, fallback, out?)`, and `Matrix3.inverseUnchecked(m, out?)` SHALL all exist

#### Scenario: Non-fallible methods lack triality

- **WHEN** the audit checks `Vector2.add`
- **THEN** `Vector2.addSafe` and `Vector2.addUnchecked` SHALL NOT exist (addition never fails for finite inputs)

---

### Requirement: `out` parameter is the last optional parameter on all allocating static methods

Every static method that produces a new object (Vector2, Rotation2, Matrix2, Matrix3, Transform2) SHALL accept an optional `out` parameter as its last argument. The `out` parameter SHALL receive the result in-place to avoid heap allocation in hot paths. The audit SHALL verify all static methods in core types follow this pattern.

#### Scenario: `out` parameter is last

- **WHEN** the audit inspects every static method signature in `core/`
- **THEN** if the method returns a concrete type, the last parameter SHALL be `out?: ConcreteType`

#### Scenario: Providing `out` writes to the existing object

- **WHEN** `Vector2.add(a, b, out)` is called with an existing `out` instance
- **THEN** the same `out` reference SHALL be returned with the result values written into it

---

### Requirement: Instance methods return `this` for chaining

Every instance method on core types that mutates state SHALL return `this`. The return type SHALL be the concrete type (not `void`). The audit SHALL verify all instance methods follow this contract and add it to any that do not.

#### Scenario: Method chain is possible

- **WHEN** `vector.add({x:1,y:0}).normalize().multiplyScalar(2)` is called
- **THEN** each intermediate result SHALL be the same `vector` instance, allowing the chain to complete

---

### Requirement: `*CS` (cos/sin pre-computed) variants exist for all rotation-involving operations

Every operation on Vector2, Rotation2, Matrix2, Matrix3, or Transform2 that internally computes `cos` and `sin` from an angle SHALL have a `*CS` variant accepting the pre-computed values directly. The audit SHALL enumerate all operations involving trig computation and verify `*CS` variants exist.

#### Scenario: `rotateCS` exists on Vector2

- **WHEN** the audit checks for `Vector2.rotateCS(v, cos, sin, out?)`
- **THEN** it SHALL exist as both a static and instance method

#### Scenario: `Matrix3.rotateCS` and `Transform2.rotateCS` exist

- **WHEN** the audit checks Matrix3 and Transform2 for `*CS` rotation variants
- **THEN** both SHALL have `rotateCS(cos: number, sin: number)` as an instance method for hot loops

---

### Requirement: Naming conventions are consistent across all modules

The audit SHALL verify:

1. No mixing of British/American English spellings (e.g., `normalise` vs `normalize`)
2. Function names use camelCase, constants use SCREAMING_SNAKE_CASE, types use PascalCase
3. The `apply` verb is reserved for operators/rotations (e.g., `Rotation2.apply`, `Complex.apply`) — NOT used for matrix transforms (which use `transform`)
4. The `transform` verb is used for spatial transforms (Matrix3, Transform2)
5. The `set` prefix is for instance methods that overwrite all fields from explicit arguments
6. The `copy` prefix is for instance methods that copy from another \*Like object
7. The `from*` prefix is for static factories
8. Boolean query methods follow `is*` or `has*` pattern

#### Scenario: No `normalise` spelling in any source file

- **WHEN** the audit greps for "normalise" across all source files
- **THEN** zero results SHALL be found

#### Scenario: `apply` is not used for Matrix3 transforms

- **WHEN** the audit scans Matrix3 and Transform2 for any method named `apply*`
- **THEN** zero results SHALL be found — matrix transforms SHALL use `transform*` naming

#### Scenario: `is*` queries return boolean

- **WHEN** the audit enumerates all methods starting with `is` or `has` on any core type
- **THEN** all SHALL have return type `boolean`

---

### Requirement: No unnecessary public exports exist

Every export from `packages/math2d/src/index.ts` SHALL have a documented consumer use-case. Internal helper functions, intermediate computation types, and build-time utilities SHALL be private (not exported). The audit SHALL verify that no export is present solely because it was convenient during implementation.

#### Scenario: All exports are documented

- **WHEN** the audit checks every export in `index.ts`
- **THEN** each SHALL have a TSDoc comment with `@public` visibility and a usage example

#### Scenario: Internal helpers are not exported

- **WHEN** the audit traces helper functions that are only called from within their own file
- **THEN** they SHALL NOT be exported from the package — they SHALL use the `/** @internal */` marker if they must be exported for testing

---

### Requirement: Synergy between modules is real and traceable

The audit SHALL verify that lower-layer operations are actually used by higher-layer operations. Specifically:

- `deterministic/` kernels SHALL be called by `auxiliary/angle/operations.ts` (sinCos, angleFromVectors) and by `core/` rotation/matrix methods
- `auxiliary/scalar/` lerp SHALL be used by `core/` interpolation methods (Vector2.lerp, Matrix3.lerp, etc.)
- `auxiliary/angle/` normalization SHALL be used by `Rotation2.fromAngle` and `Rotation2.setAngle`
- `types/` `*Like` interfaces SHALL be the input parameter types for all `core/` static methods

#### Scenario: Vector2.lerp uses auxiliary lerp

- **WHEN** the audit traces the implementation of `Vector2.lerp`
- **THEN** it SHALL call `auxiliary/scalar/interpolation.lerp` rather than reimplementing `a + t * (b - a)` inline

#### Scenario: Rotation2.fromAngle uses deterministic sinCos

- **WHEN** the audit traces `Rotation2.fromAngle(θ)`
- **THEN** it SHALL call the deterministic `sinCos` or the `auxiliary/angle/operations.sinCos` which in turn routes through deterministic kernels

#### Scenario: All core static methods accept \*Like interfaces

- **WHEN** the audit checks parameter types of static methods in `Vector2`, `Matrix3`, `Transform2`
- **THEN** inputs SHALL use `ReadonlyVector2Like`, `ReadonlyMatrix3Like`, `ReadonlyTransform2Like` rather than concrete classes
