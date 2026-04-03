## Context

The `@lenguados/math2d` core layer (Layer 3) contained aliases and naming inconsistencies across its 7 class files. A multi-agent research process (investigative, adversarial, integrator) was used to make evidence-based naming decisions validated against the broader JS/math ecosystem.

### Initial State

- `scale` / `multiplyScalar` duality on Matrix2 and Matrix3 (4 alias methods)
- `angle` / `argument()` duality on Complex (2 alias methods)
- `toJSON` → `toObject` delegation on all 7 core types (7 protocol implementations)
- `Interval.divide(scalar)` inconsistent with `verbScalar` naming convention
- `fma` parameter named `scale` instead of `scalar`
- Matrix3 `addScalar`/`subtractScalar` using abbreviated parameter names

## Goals / Non-Goals

**Goals:**

- One canonical name per operation — no aliases
- Unified `multiplyScalar` across all types for scalar multiplication
- `verbScalar` naming convention enforced for all scalar operations
- Consistent parameter naming across all types

**Non-Goals:**

- Changing method behavior or semantics
- Modifying geometric operations (`scaleBy`, `fromScale`, `getScale`, `decompose`)
- Changing `toJSON`/`toObject` protocol pattern
- Adding new methods

## Decisions

### Decision 1: `multiplyScalar` as canonical name for scalar multiplication (ALL types)

**Research findings:**

- glMatrix: `multiplyScalar` for matrices, `scale` for vectors
- Three.js: `multiplyScalar` for ALL types (vectors, matrices, quaternions)
- The operation is structurally identical across all types: multiply all components by a scalar

**Choice:** `multiplyScalar` everywhere. `scale` removed from Vector2, Complex, Interval, Matrix2, Matrix3.

**Rationale:** Consistency across types wins. Three.js precedent supports unified naming. Eliminates ambiguity with geometric scaling (`fromScale`, `scaleBy`). Self-documenting name.

### Decision 2: `angle` as canonical name for Complex phase (remove `argument`)

**Research findings:**

- `arg` camp (5): complex.js, math.js, C++ std, Rust, Mathematica
- `angle` camp (4): NumPy, Julia, MATLAB, Three.js
- Cross-type consistency: Vector2.angle, Rotation2.angle → Complex.angle

**Choice:** `angle`. Both static `Complex.angle()` and instance getter `angle` retained. `argument()` removed entirely.

**Rationale:** Target audience (game/physics devs) thinks in angles. Cross-type consistency. `angleDegrees`/`angleTurns` already exist as natural derivatives.

### Decision 3: `toJSON`/`toObject` — kept as-is

**Rationale:** `toJSON()` is the JavaScript protocol method for `JSON.stringify()`. `toObject()` is the explicit programmatic conversion. Different semantic purposes, identical implementation. This is a protocol pattern, not a naming alias.

### Decision 4: `Interval.divide` → `Interval.divideScalar`

**Found during post-implementation audit.** Interval's `divide(scalar)` broke the `verb(type)` / `verbScalar(number)` convention used by all other types. Renamed the full triality: `divideScalar`, `divideScalarSafe`, `divideScalarUnchecked`.

### Decision 5: `fma` parameter `scale` → `scalar`, Matrix3 parameter abbreviations

**Minor consistency fixes.** `fma` parameter renamed from `scale` to `scalar` to avoid confusion with geometric scale operations. Matrix3 `addScalar`/`subtractScalar` parameters expanded from `m`/`s` to `matrix`/`scalar` to match Matrix2.

## Risks / Trade-offs

- **[Breaking changes]** All renames are breaking → Pre-1.0 library, acceptable.
- **[Verbosity]** `v.multiplyScalar(2)` is longer than `v.scale(2)` → Clarity over brevity.
- **[Ecosystem split]** glMatrix uses `scale` for vectors → Three.js uses `multiplyScalar` for all types, and unified naming across types is more valuable than per-type ecosystem alignment.

## Migration Plan

Revert the commits if needed. No data migration or deployment concerns. Pre-1.0.
