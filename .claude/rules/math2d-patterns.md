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

## Allocation Control

- **`out` parameter**: Always last, always optional: `static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2`
- **`ensureOut()` helper**: Every class has `private static ensureOut(out?: T): T { return out ?? new T(); }`
- **Static method body pattern**: `return this.ensureOut(out).set(computed.x, computed.y)`
- **Instance method contract**: Mutate `this`, return `this` for chaining. No allocations in the method body.
- **Input/output types**: Input params use `Readonly*Like` interfaces (duck typing); return type is concrete class
- **Frozen constants**: `public static readonly ZERO = freezeVector2(new Vector2(0, 0))` — use `freezeXxx()` helper, returns `ReadonlyXxx` type

## Apply vs Transform

- `apply` — operators acting on operands: `Rotation2.apply(rotation, vector)` (rotation applies TO vector)
- `transform` — spatial coordinate changes: `Matrix3.transformPoint(matrix, point)` (matrix transforms the point's coordinate space)

## Determinism

- MUST import `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`, `hypot` from `deterministic-kernels.ts`
- `Math.sqrt`, `Math.floor`, `Math.ceil`, `Math.abs`, `Math.min`, `Math.max` ARE deterministic (IEEE 754 required)
- Full determinism rules in `architecture-and-layers.md`

## setDirect vs set() — Internal Pre-Validated Assignment

Core classes that store normalized state (Rotation2, Interval) expose a private `setDirect()` method for internal use when the values are already mathematically validated by the calling code.

**Rule**: When a factory method or static computation has already guaranteed the invariant (unit length, ordered bounds, etc.), use `setDirect()` instead of `set()` to avoid redundant re-validation.

```typescript
// WRONG — set() normalizes again; double sqrt/hypot
return this.ensureOut(out).set(x * inv, y * inv);

// CORRECT — already unit-length by construction
return this.ensureOut(out).setDirect(x * inv, y * inv);
```

**Where `setDirect` is appropriate**:

- `Rotation2` factory methods that pre-compute `(cos, sin)` from math operations
- `Interval` static methods that produce a validated result before assigning

**Where `setDirect` is NOT appropriate**:

- User-facing code paths (use `set()` which validates)
- Any path where the values are not already guaranteed correct

**Transform2 pattern**: `Transform2` stores a `Rotation2` internally. When Transform2 computes `(cos, sin)` that is already unit-length (e.g., from trig functions or composing existing unit rotations), use direct property assignment:

```typescript
result.rotation.cos = cos;
result.rotation.sin = sin;
// NOT: result.rotation.set(cos, sin)  ← triggers redundant normalization
```

## sqrt vs hypot Convention

Magnitude computation has two tiers, aligned with the validation triality:

- **Default / Safe methods** → `hypot(x, y)` from deterministic-kernels (overflow-safe for components > ~1.34e154)
- **Unchecked methods** → `Math.sqrt(x * x + y * y)` (faster, no function-call overhead; caller guarantees no overflow)

Examples:

- `Vector2.magnitude()` / `normalize()` / `normalizeSafe()` → `hypot(x, y)`
- `Vector2.normalizeUnchecked()` / `directionUnchecked()` / `setMagnitudeUnchecked()` → `Math.sqrt(x*x + y*y)`
- `Rotation2.normalize()` / `normalizeSafe()` → `hypot(cos, sin)`
- `Rotation2.normalizeUnchecked()` → `Math.sqrt(cos*cos + sin*sin)`

This is a deliberate performance vs safety trade-off, NOT an oversight.

## Math Conventions

- Angles in radians, CCW positive, Y-up coordinate system
- Column-major matrices
- Transform order: Scale → Rotate → Translate
- EPSILON = 1e-10

## Layer Dependencies

See `architecture-and-layers.md` for full graph. Summary: deterministic → auxiliary → core → utils (downward only). validation/ can import any layer.
