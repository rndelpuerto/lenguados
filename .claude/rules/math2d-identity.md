---
paths:
 - '**'
---

# math2d Package Identity — Golden Rule

## What math2d IS

`@lenguados/math2d` is the **core/base mathematics package** of the lenguados monorepo — a deterministic 2D physics engine. It is the foundational package upon which the rest of the engine's packages are built, but it can also be consumed independently by external users or other libraries.

It provides fundamental mathematical primitives (vectors, matrices, rotations, complex numbers, intervals, transforms) and scalar/numeric utilities. Its API is domain-agnostic (no physics or engine concepts), serving both as the mathematical bedrock for sibling packages and as a general-purpose 2D math toolkit for any consumer.

The API must be **comprehensive and complete** as a mathematical toolkit. If a scalar reduction, algebraic operation, or geometric primitive is mathematically well-defined and useful as a building block, it belongs here — even if it has no direct "geometric meaning" in isolation. Packages like Eigen, nalgebra, numpy, and glam provide such primitives because downstream consumers need them. Downstream consumers include both the sibling packages in this monorepo and any external project that depends on math2d.

## What math2d is NOT

- **NOT a physics engine.** No forces, collisions, rigid bodies, joints, solvers, or simulation loops.
- **NOT a high-level geometry library.** No polygons, meshes, spatial queries, pathfinding, or scene graphs.
- **NOT a rendering library.** No cameras, projections, sprites, or draw calls.
- **NOT an algorithm library.** No SAT, GJK, BVH, quadtrees, or spatial hashing.

These concerns belong in **other packages within the monorepo** that import and extend math2d through composition, facades, adapters, or any appropriate pattern.

## The Boundary Test

When deciding whether something belongs in math2d, apply this test:

1. **Is it a mathematical primitive or operation?** (vector arithmetic, matrix decomposition, angle interpolation, scalar comparison) → **YES, it belongs.**
2. **Does it require domain knowledge beyond pure mathematics?** (collision response, constraint solving, physics integration) → **NO, it belongs in a higher-level package.**
3. **Is it a building block that multiple higher-level packages would need?** (component sum, determinant, eigenvalues, barycentric utilities) → **YES, it belongs.**
4. **Does it implement a specific algorithm tied to a specific domain?** (GJK for collision, Verlet for physics) → **NO, it belongs elsewhere.**

## Implications for Audits and Reviews

When auditing math2d, do NOT evaluate methods by whether they have a "geometric purpose" or "physics application." Evaluate them by whether they are **mathematically well-defined operations on the types provided**. A method like `sumComponents` (scalar reduction) is a legitimate mathematical primitive even if it has no standalone geometric interpretation — just as `trace()` on a matrix is a legitimate operation without a direct spatial meaning.

Do NOT recommend removing or deprecating math2d methods solely because they seem "too low-level" or "not useful for physics." The package is intentionally low-level. Higher-level usefulness is the responsibility of higher-level packages.
