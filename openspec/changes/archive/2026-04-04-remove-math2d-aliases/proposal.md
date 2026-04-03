## Why

The `@lenguados/math2d` core layer contained method/property aliases and naming inconsistencies — methods whose body delegates to another with no added logic, or names that diverge from the ecosystem standard. These inflated the API surface, created confusion between equivalent names, and broke naming conventions. Now is the right time because the library is pre-1.0 and breaking changes are still acceptable.

## What Changes

### Alias Removal

- **BREAKING** — Unified scalar multiplication to `multiplyScalar` across all 5 core types (Vector2, Complex, Interval, Matrix2, Matrix3). The former name `scale` was ambiguous with geometric scaling (`fromScale`, `scaleBy`). Research confirmed `multiplyScalar` is the ecosystem standard (glMatrix, Three.js).
- **BREAKING** — Removed `Complex.argument()` (static and instance). Kept `angle` as canonical, consistent with `Vector2.angle` and `Rotation2.angle`. Research showed `angle` is used by NumPy, Julia, MATLAB, and aligns with the target audience (game/physics developers).
- `toJSON` → `toObject` delegation pattern across all 7 core types was evaluated and **kept as-is** — it is a JavaScript protocol implementation, not a naming alias.

### Naming Consistency Fixes

- **BREAKING** — Renamed `Interval.divide/divideSafe/divideUnchecked` → `Interval.divideScalar/divideScalarSafe/divideScalarUnchecked` (6 methods). These took a `number` parameter, breaking the convention where `verb()` takes the same type and `verbScalar()` takes a number.
- Renamed `fma` parameter `scale` → `scalar` across Vector2, Matrix2, Matrix3 (6 methods). Aligns with the unified scalar parameter naming convention.
- Renamed Matrix3 `addScalar`/`subtractScalar` parameters from abbreviated `m`/`s` to `matrix`/`scalar` for consistency with Matrix2.

### Research Process

A multi-agent architecture (investigative, adversarial, integrator) was used to validate naming decisions against external libraries: glMatrix, Three.js, math.js, complex.js, NumPy, Julia, MATLAB, C++ std::complex, Rust num-complex, Mathematica, cannon-es.

## Capabilities

### New Capabilities

- `alias-audit`: Comprehensive audit of all aliases in math2d with multi-agent research framework.
- `alias-removal`: Removal of aliases and naming consistency fixes across all core types.

### Modified Capabilities

- `api-conventions`: Naming rules updated to forbid aliases and enforce `verbScalar` convention.
- `core-types-api`: Public API of all core types affected by renames.

## Impact

- **Code (Layer 3 — core/)**: All 7 core type files modified. 5 types gained `multiplyScalar` (replacing `scale`). Complex lost `argument()`. Interval gained `divideScalar` triality (replacing `divide`).
- **Tests**: 10 test files updated across core, properties, and boundaries.
- **Documentation**: ARCHITECTURE.md updated. JSDoc cleaned throughout.
- **Bundle size**: Net reduction — fewer methods per type.
- **Consumers**: **BREAKING** for code using `scale()`, `argument()`, or `Interval.divide()`.
- **Deterministic guarantees**: No impact — all changes are naming only.
- **Rollback plan**: Revert the commits. Pre-1.0, no deprecation cycle needed.
