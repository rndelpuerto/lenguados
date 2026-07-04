# @lenguados/math2d Type Interoperability

> **Status:** NORMATIVE
> **Scope:** layer interaction, type conversions, and architectural boundaries.

This document describes how the different layers and types of the `@lenguados/math2d` package interact. It explains why certain boundaries exist and the mathematical limitations that force developers to escalate to more complex types.

---

## 1. Type Escalation (The Complexity Gradient)

The package operates on a strict complexity gradient (Layer 2 → Layer 3). Developers MUST actively escalate their mathematical abstractions when encountering specific physical or graphical edge cases.

### 1.1 The Skew / Shear Escalation

- **Context:** `Transform2` (Layer 3) is the semantic wrapper of choice for the typical 2D game object. It combines `Vector2` (position), `Rotation2` (orientation), and `Vector2` (scale).
- **The limitation:** `Transform2` can only represent rigid-body transformations (with optional scaling). If you composite two `Transform2` instances where one has a non-uniform scale and the other has a rotation, the resulting mathematical transformation introduces shearing (skew).
- **Why it was omitted:** storing shear requires cross-axial components. Adding shear to `Transform2` would grow the memory footprint by 33–50% (from 6 floats to 8 or 9), entirely defeating its purpose as a lightweight object for 2D sprites.
- **The solution:** when hierarchical non-uniform scaling combined with rotation is required (for example skeletal animation systems or complex UI hierarchies), developers MUST escalate to `Matrix3` (`transform.toMatrix3()`), which inherently handles shear.

### 1.2 Rotation Drift and Re-normalization

- **Context:** `Rotation2` stores angles as precalculated $(\cos, \sin)$ pairs.
- **The limitation:** floating-point precision (IEEE 754) is imperfect. Multiplying two `Rotation2` objects incurs minute rounding errors. After thousands of physics frames, the $(\cos, \sin)$ vector will drift away from the unit circle (magnitude $\neq 1.0$). If you scale a vector using a drifted rotation, the vector will unintentionally grow or shrink.
- **Why it was omitted in constructors:** the `Rotation2(cos, sin)` constructor intentionally does **not** auto-normalize inputs. Normalization requires calculating a square root ($1 / \sqrt{x^2 + y^2}$). Doing this automatically on every object creation or multiplication would plummet frame rate.
- **The solution:** the developer is responsible for manually calling `.normalize()` periodically (for example once every 60 frames per physics body) or using the `.normalized` getter when absolute precision is required.

---

## 2. API Facade and Conversions

The package avoids circular dependencies by employing strict conversion methodologies.

### 2.1 Type Upcasting (`from*` and `to*`)

Transforming data between geometries adheres to the `to[Type]()` pattern, generating a physical copy unless `out` parameters are provided.

```typescript
// Construct a Matrix from a semantic Transform
const matrix = Matrix3.fromTransform2(myTransform);

// Re-extract semantics (decomposition)
// Note: this decomposition drops shear data if present in the matrix.
const transform = Transform2.fromMatrix3(matrix);
```

### 2.2 Pre-calculated Trigonometry (The `*CS` Pattern)

Many methods in `Vector2` (for example `rotate`) require an angle in radians. However, invoking `Math.cos(angle)` inside a hot loop is a well-known architectural bottleneck. To achieve seamless interoperability with `Rotation2`, functions provide `*CS` variants.

```typescript
// BAD: invokes transcendental functions on every iteration
for (const vec of vertices) {
 vec.rotate(Math.PI / 4);
}

// GOOD: computes once, shares the pre-computed (cos, sin) scalars with Rotation2
const rot = Rotation2.fromAngle(Math.PI / 4);
for (const vec of vertices) {
 vec.rotateCS(rot.cos, rot.sin);
}
```

This pattern dictates how the package optimizes cross-layer operations without generating garbage-collector pressure.

### 2.3 `Readonly*Like` Duck Typing

Input parameters use `Readonly*Like` interfaces (structural, duck-typed) while outputs are concrete classes. This lets external consumers pass plain objects:

```typescript
// Any object with {x, y} numeric fields works as input
const mixed: ReadonlyVector2Like = { x: 3, y: 4 };
const result = Vector2.add(mixed, { x: 1, y: 2 }); // Vector2(4, 6)
```

`*Like` interfaces are exported from `@lenguados/math2d` and are the recommended pattern for accepting arguments from non-math2d sources (for example DOM events, external libraries, JSON payloads).

---

## 3. Subpath Exports

The root barrel exposes the mathematical surface; the utility modules live on dedicated subpaths:

- `@lenguados/math2d` — core types, the auxiliary layer (scalar, angle, numeric), the deterministic kernels, and the operational validation assertions. The `utils/` modules are **not** re-exported from the root.
- `@lenguados/math2d/validation/shapes` — structural shape assertions (`assertVector2Like`, etc.) for runtime validation of external inputs.
- `@lenguados/math2d/utils/random` — random generation per type (`randomVector2`, `randomInCircle`, ...).
- `@lenguados/math2d/utils/random-source` — PRNG infrastructure (`SeededRandomSource`, `setDefaultRandomSource`, ...).
- `@lenguados/math2d/utils/parse` — string parsing and formatting per type (`parseVector2`, `formatMatrix3`, ...).

Classification decisions and the full import quick-reference are documented in [MODULE_EXPORTS.md](MODULE_EXPORTS.md).

---

## 4. Decomposition Selection Guide

`Matrix2` exposes five decomposition entry-points that share a similar shape but answer different questions. Use this guide to pick the right one.

| Method                            | Returns                                                                                                                                                      | Use when...                                                                                                                                                                                                                        | Constraints                                                                                                                                                                                                 |
| :-------------------------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `Matrix2.decompose(M)`            | $\{ \text{rotation}, \text{scale} \}$                                                                                                                        | The matrix is known to be rotation × non-uniform scale (no shear). Fast path for `Transform2` decomposition.                                                                                                                       | Discards shear silently. Signed scale on $\det(M) < 0$.                                                                                                                                                     |
| `Matrix2.eigendecompose(M)`       | Discriminated union: real-spectrum case `{ type: 'real', lambda1, v1, lambda2, v2 }` or complex-spectrum case `{ type: 'complex', realPart, imaginaryPart }` | You need the spectral decomposition $M = Q \cdot \mathrm{diag}(\lambda) \cdot Q^{-1}$ — diagonalisation, principal-axis analysis, or symmetric-matrix analysis (real eigenvalues).                                                 | Eigenvectors are not generally orthogonal. The complex-spectrum branch carries no eigenvectors (no real-valued $Q$ exists).                                                                                 |
| `Matrix2.polarDecompose(M)`       | $\{ R, S \}$ with $M = R \cdot S$                                                                                                                            | You need a proper-rotation factor $R$ and a symmetric stretch factor $S$. Useful for animation (extract rotation from a deformed transform), orientation alignment, or as a building block for SVD-based methods.                  | Convention A polar: $R$ is **always** a proper rotation ($\det(R) = +1$). $S$ is symmetric exactly (`S.m01 === S.m10`) but indefinite (NOT PSD) when $\det(M) < 0$ — see [Edge Cases §10.5](EDGE_CASES.md). |
| `Matrix2.svd(M)`                  | $\{ U, \sigma, V \}$ with $M = U \cdot \mathrm{diag}(\sigma) \cdot V^\top$                                                                                   | You need the full $U \cdot \Sigma \cdot V^\top$ factorisation: condition-number analysis, pseudo-inverse computation, low-rank approximation, robust orientation alignment.                                                        | Convention A: $\sigma_y$ is signed and carries the reflection sign of $M$. Both $U$ and $V$ are proper rotations. Consumers expecting unsigned $\sigma$ MUST reconcile sign against $\det(M)$.              |
| `Rotation2.fromMatrix2Closest(M)` | `Rotation2` (proper rotation, $\det(R) = +1$)                                                                                                                | You need ONLY the closest proper rotation to $M$ (Procrustes / Kabsch alignment) and want a `Rotation2` result without unpacking SVD or polar decomposition. Best for IK solvers, orientation alignment, point-cloud registration. | Discards stretch/scale information. Returns the identity rotation for the zero matrix (deterministic — every rotation is equidistant).                                                                      |

### 4.1 Decision Tree

```
Q: Do you need only orientation (rotation) ?
  Yes → Rotation2.fromMatrix2Closest(M)              [proper rotation guaranteed]
  No  ↓

Q: Do you need rotation + non-uniform scale, knowing the matrix has no shear ?
  Yes → Matrix2.decompose(M)                          [fast, allocation-light]
  No  ↓

Q: Do you need rotation + symmetric stretch (general affine) ?
  Yes → Matrix2.polarDecompose(M)                     [Convention A: R always rotation, S indefinite if det(M)<0]
  No  ↓

Q: Do you need eigenvalues / spectral decomposition ?
  Yes → Matrix2.eigendecompose(M)                     [may be complex]
  No  ↓

Q: Do you need full SVD (singular values + bases) ?
  Yes → Matrix2.svd(M)                                [signed σ_y]
  No  ↓

Q: Do you need only condition-number κ(M) ?
  Yes → Matrix2.conditionNumber(M)                    [single scalar; +Infinity on singular]
```

### 4.2 Wrapping SVD Results into `Rotation2` Instances

`SvdResult` returns $U$ and $V$ as `ReadonlyRotation2Like` (structural $\{ \cos, \sin \}$ shape) — not as concrete `Rotation2` instances. This avoids a runtime class cycle (matrix2.ts → rotation2.ts) while still allowing consumers to opt into `Rotation2` instances:

```typescript
import { Matrix2, Rotation2 } from '@lenguados/math2d';

const result = Matrix2.svd(M);

// Plain object access (no allocation)
const angleU = Math.atan2(result.U.sin, result.U.cos);

// Construct full Rotation2 instances when needed
const Urot = new Rotation2(result.U.cos, result.U.sin);
const Vrot = new Rotation2(result.V.cos, result.V.sin);

// Or compose in-place using *CS variants
const v = new Vector2(1, 0);
v.rotateCS(result.U.cos, result.U.sin); // rotate by U without instantiating Rotation2
```

The same pattern applies to `PolarDecomposeResult.R`. This is the recommended bridge between SVD-derivative results and the rest of the math2d API.

### 4.3 Pseudo-Inverse vs Inverse

`Matrix2.pseudoInverse(M)` matches `Matrix2.inverse(M)` to machine precision when $M$ is non-singular. They diverge for rank-deficient input:

- `inverse(singular)` → throws `RangeError` (default) or returns the identity matrix (`inverseSafe`).
- `pseudoInverse(singular)` → returns the Moore-Penrose pseudo-inverse, satisfying the four Penrose axioms (Penrose 1955).

Use `pseudoInverse` for least-squares regression, IK Jacobian inversion, and any scenario where graceful degradation under rank deficiency is required. Use `inverse` (or `inverseUnchecked` for hot paths) when $M$ is known to be non-singular and the strict failure mode is desired.
