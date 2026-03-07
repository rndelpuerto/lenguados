---
paths:
 - 'packages/math2d/**'
---

# @lenguados/math2d Code Patterns

## API Design

- Static methods accept `out?: T` as the **last** parameter for allocation-free hot paths
- Instance methods mutate `this` and return `this` for fluent chaining
- Input parameters use `Readonly*Like` interfaces; outputs use concrete types
- Every fallible operation has three variants:
  - `op()` — strict, throws on error (default)
  - `opSafe()` — returns fallback, never throws
  - `opUnchecked()` — no validation, undefined behavior on invalid input

## Naming

- `apply` — operators acting on operands (Rotation2 applies to Vector2)
- `transform` — spatial coordinate transformations (Matrix3 transforms a point)
- `*CS` suffix — pre-computed cos/sin variant for hot loops (e.g., `rotateCS(cos, sin)`)

## Determinism

- Use `sin`, `cos`, `atan2`, `exp`, `log`, `pow` from `deterministic-kernels.ts`, never `Math.*` equivalents
- `Math.sqrt`, `Math.floor`, `Math.ceil`, `Math.abs` ARE deterministic (IEEE 754 required) and can be used directly

## Math Conventions

- Angles in radians, CCW positive, Y-up coordinate system
- Column-major matrices
- Transform order: Scale → Rotate → Translate
- EPSILON = 1e-10

## Layer Dependencies (imports flow right-to-left)

utils → core → auxiliary → deterministic
↑
validation (can import any layer for type checks)
