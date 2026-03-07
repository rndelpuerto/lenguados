## ADDED Requirements

### Requirement: Naming convention for function variants

All fallible operations SHALL use suffix-based naming for their error-handling variants:

- `op()` — strict, throws on invalid input
- `opSafe()` — returns a defined fallback value, never throws
- `opUnchecked()` — no validation, undefined behavior on invalid input

The prefix form (`safeOp`) is NOT permitted. All existing prefix-form functions
MUST be renamed to suffix form.

#### Scenario: Strict variant receives invalid input

- **WHEN** a strict function (e.g., `divide(a, 0)`) receives invalid input
- **THEN** it SHALL throw an Error with a descriptive message

#### Scenario: Safe variant receives invalid input

- **WHEN** a Safe function (e.g., `divideSafe(a, 0)`) receives invalid input
- **THEN** it SHALL return a documented fallback value (e.g., 0) without throwing

#### Scenario: Unchecked variant receives invalid input

- **WHEN** an Unchecked function (e.g., `divideUnchecked(a, 0)`) receives invalid input
- **THEN** behavior is undefined; no validation is performed

#### Scenario: Existing prefix-named functions

- **WHEN** a function uses the `safe*` prefix pattern (e.g., `safeDivide`)
- **THEN** it MUST be renamed to suffix pattern (`divideSafe`) and the old name retained as deprecated re-export for exactly one minor version

---

### Requirement: CS variant naming for pre-computed trigonometry

Methods that accept an angle and internally compute sin/cos SHALL have a `*CS` variant
that accepts pre-computed `(cos, sin)` values. The `*CS` variant name is formed by
appending `CS` to the base method name.

#### Scenario: Hot path with shared angle

- **WHEN** multiple operations use the same angle in a tight loop
- **THEN** the developer computes `sinCos(angle)` once and passes `cos, sin` to each `*CS` variant, avoiding redundant trigonometric computation

#### Scenario: Types that store cos/sin natively

- **WHEN** a type stores cos/sin as its representation (Rotation2, Complex)
- **THEN** that type does NOT need `*CS` variants because its methods already operate on stored cos/sin

---

### Requirement: Parameter ordering convention

All functions SHALL follow this parameter ordering:

1. Primary operands (the data being operated on)
2. Secondary operands or configuration parameters
3. Optional tolerance/epsilon parameter (default: `EPSILON`)
4. Optional `out` parameter (last position, always optional)

#### Scenario: Static method with out parameter

- **WHEN** a static method produces a result object (e.g., `Vector2.add(a, b, out?)`)
- **THEN** `out` SHALL be the last parameter, typed as optional, defaulting to a new allocation

#### Scenario: Comparison with tolerance

- **WHEN** a comparison function accepts tolerance (e.g., `nearEquals(a, b, epsilon?)`)
- **THEN** epsilon SHALL come after all operands and before `out` (if present), defaulting to `EPSILON`

---

### Requirement: Static and instance method symmetry

Every core type SHALL provide both static and instance versions of its operations,
following these rules:

- **Static methods**: Pure functions. Accept operands as parameters. Accept optional `out` parameter last. Return the result object.
- **Instance methods**: Mutate `this`. Return `this` for fluent chaining. Do NOT accept `out` parameter.

Exceptions:

- **Query methods** (magnitude, determinant, angle, contains, intersects) exist as both static and instance but return scalar/boolean, not `this`.
- **Factory methods** (`from*`) exist only as static.
- **Computed properties** (width, center) may exist as instance-only getters.

#### Scenario: Instance method mutates and chains

- **WHEN** an instance arithmetic method is called (e.g., `vector.add(other)`)
- **THEN** it SHALL mutate `this` in place, return `this`, and NOT allocate a new object

#### Scenario: Static method preserves inputs

- **WHEN** a static method is called (e.g., `Vector2.add(a, b, out?)`)
- **THEN** input parameters `a` and `b` SHALL NOT be mutated; result is written to `out` or a new object

---

### Requirement: ReadonlyLike interfaces for input parameters

All function and method input parameters that accept math objects SHALL use `Readonly*Like`
interfaces (e.g., `ReadonlyVector2Like`, `ReadonlyMatrix3Like`). Output types and return
types SHALL use concrete classes (e.g., `Vector2`, `Matrix3`).

#### Scenario: Static method accepts POJO input

- **WHEN** a static method accepts a vector parameter typed as `ReadonlyVector2Like`
- **THEN** it SHALL accept both `Vector2` instances and plain objects `{ x: number, y: number }`

#### Scenario: out parameter uses concrete type

- **WHEN** an `out` parameter is provided
- **THEN** it SHALL be typed as the concrete class (e.g., `out?: Vector2`), not the Like interface

---

### Requirement: Deterministic math usage policy

Functions that use trigonometric, logarithmic, exponential, or square root operations
SHALL use the deterministic kernel functions (`sin`, `cos`, `sqrt`, `atan2`, `log`, `exp`, `pow`
from `deterministic-kernels.ts`), never `Math.*` equivalents.

Functions that use `Math.floor`, `Math.ceil`, `Math.abs`, `Math.round`, `Math.min`,
`Math.max`, `Math.trunc` MAY use them directly — these are IEEE 754 deterministic.

#### Scenario: Angle computation uses deterministic atan2

- **WHEN** a function computes an angle from coordinates
- **THEN** it SHALL use `atan2(y, x)` from deterministic-kernels, not `Math.atan2(y, x)`

#### Scenario: Floor division uses Math.floor

- **WHEN** a function performs floor division
- **THEN** it MAY use `Math.floor()` directly as it is IEEE 754 deterministic

#### Scenario: Function documents deterministic dependency

- **WHEN** a function uses deterministic kernel functions
- **THEN** its TSDoc SHALL note `@remarks Uses deterministic math for cross-platform reproducibility`

---

### Requirement: API layers by usage scenario

Each significant operation SHALL be available at up to three layers, where the usage
scenario justifies it:

1. **Primitive** — Minimal, correct, no overhead. Free functions or static methods. Used directly in hot paths.
2. **Hot path** — Zero-allocation variant using `out` parameter and/or `*CS` precomputed values. For game loops, particle systems, simulations.
3. **Facade** — Ergonomic instance method, chainable, delegates to layers above. For setup code and general DX.

Not every operation needs all three layers. The criterion is whether the real-world
usage scenario demands it.

#### Scenario: Vector rotation in game loop

- **WHEN** a developer rotates 1000 vectors by the same angle per frame
- **THEN** they can compute `sinCos(angle)` once (primitive), then call `Vector2.rotateCS(v, cos, sin, out)` per vector (hot path), avoiding per-call trig and allocation

#### Scenario: One-off rotation in setup

- **WHEN** a developer rotates a single vector during initialization
- **THEN** they call `vector.rotate(angle)` (facade), accepting the allocation for cleaner code

---

### Requirement: Triality coverage rules

Not every function requires all three variants (strict/Safe/Unchecked). The rules are:

- **Division by zero risk**: MUST have triality (divide, reciprocal, inverse, normalize, inverseLerp)
- **Domain restriction risk**: MUST have at least strict + Safe (acos, asin, sqrt, log)
- **Range wrapping**: MUST have triality (loop, pingPong, mod, flooredMod)
- **Pure arithmetic with no failure mode**: Does NOT need variants (add, subtract, lerp, clamp)
- **Comparisons and predicates**: Do NOT need variants (nearEquals, isZero, contains)

#### Scenario: Function with division-by-zero risk

- **WHEN** a function can produce division by zero (e.g., `normalize` on zero vector)
- **THEN** it SHALL have strict (throws), Safe (returns fallback), and Unchecked (no validation) variants

#### Scenario: Pure arithmetic function

- **WHEN** a function has no failure mode for any finite input (e.g., `lerp(a, b, t)`)
- **THEN** it SHALL NOT have Safe/Unchecked variants — a single function suffices

---

### Requirement: apply vs transform semantic distinction

The verb `apply` SHALL be used when an operator acts on an operand (e.g., Rotation2 applies
to Vector2). The verb `transform` SHALL be used for spatial coordinate transformations
(e.g., Matrix3 transforms a point through homogeneous coordinates).

#### Scenario: Rotation applied to vector

- **WHEN** a Rotation2 rotates a Vector2
- **THEN** the method is named `Rotation2.apply(rotation, vector, out?)`, NOT `transform`

#### Scenario: Matrix transforms a point

- **WHEN** a Matrix3 transforms a point through affine space (including translation)
- **THEN** the method is named `Matrix3.transformPoint(matrix, point, out?)`, NOT `apply`

#### Scenario: Matrix2 transforms a vector (linear only)

- **WHEN** a Matrix2 transforms a vector (no translation component)
- **THEN** the method is named `Matrix2.transformVector(matrix, vector, out?)` — using `transform` because it is a spatial linear transformation

---

### Requirement: Frozen constants via Object.freeze

All type-level constants (e.g., `Vector2.ZERO`, `Matrix3.IDENTITY`, `Rotation2.IDENTITY`)
SHALL be created via `Object.freeze()` to prevent accidental mutation.

#### Scenario: Frozen constant prevents mutation

- **WHEN** user code attempts `Vector2.ZERO.x = 5`
- **THEN** it SHALL throw in strict mode or silently fail — the constant remains `(0, 0)`

#### Scenario: Frozen constant used as default

- **WHEN** a function uses a type constant as a default parameter value
- **THEN** the constant SHALL be safe to share across all call sites without defensive copying

---

### Requirement: Constructor normalization policy

Core type constructors SHALL NOT auto-normalize their inputs. Normalization (e.g.,
`Rotation2.normalize()`) is an explicit operation the developer calls when needed.

**Rationale**: Auto-normalization adds a hidden `sqrt` cost per construction. For types like
Rotation2 that store `(cos, sin)`, the developer should call `.normalize()` periodically
(~every 60 frames for accumulated rotations) rather than paying per-construction.

#### Scenario: Rotation2 from raw cos/sin

- **WHEN** `Rotation2.fromValues(0.6, 0.8)` is called (already unit length)
- **THEN** the constructor SHALL NOT recompute or normalize — it stores `(0.6, 0.8)` directly

#### Scenario: Accumulated rotation drift

- **WHEN** a Rotation2 is multiplied hundreds of times without normalization
- **THEN** `cos² + sin²` MAY drift from 1.0; the developer calls `.normalize()` to correct it

---

### Requirement: Transform2 shear limitation — escalate to Matrix3

Transform2 stores position + rotation + non-uniform scale and does NOT support shear.
When non-uniform scale is combined with rotation, the result is mathematically correct
only for the TRS decomposition. Operations requiring shear (e.g., inverse of non-uniform
scale + rotation) SHALL escalate to Matrix3.

#### Scenario: Non-uniform scale inverse

- **WHEN** a Transform2 has non-uniform scale and the user needs its inverse with full fidelity
- **THEN** they SHALL convert to Matrix3 first via `transform.toMatrix3()`, then invert the matrix
