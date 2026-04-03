---
sidebar_position: 2
title: 'Type Interoperability'
description: 'Type escalation, rotation drift, and conversion patterns'
---

# Type Interoperability

> **Status:** NORMATIVE  
> **Scope:** Layer interaction, Type Conversions, and Architectural Boundaries.

This document describes how the different layers of the `@lenguados/math2d` package interact. It explains _why_ certain boundaries exist and the mathematical limitations forcing developers to escalate to more complex types.

---

## 1. Type Escalation (The Complexity Gradient)

The package operates on a strict complexity gradient (Layer 2 -> Layer 3 -> Layer 4). Developers must actively "escalate" their mathematical abstractions when encountering specific physical or graphical edge cases.

### 1.1 The Skew/Shear Escalation

- **Context:** `Transform2` (Layer 4) is the semantic wrapper of choice for 90% of game objects. It combines `Vector2` (position), `Rotation2` (orientation), and `Vector2` (scale).
- **The Limitation:** `Transform2` can only represent **Rigid Body transformations** (with optional scaling). If you composite two `Transform2` instances where one has a non-uniform scale and the other has a rotation, the resulting mathematical transformation introduces **Shearing (Skew)**.
- **Why it was omitted:** Storing shear requires cross-axial components. Adding shear to `Transform2` would bloat the memory footprint by 33% (from 6 floats to 8-9 floats), entirely defeating its purpose as a lightweight object for 2D sprites.
- **The Solution:** When hierarchical non-uniform scaling combined with rotation is required (e.g., skeletal animation systems or complex UI hierarchies), developers **MUST** escalate to `Matrix3` (`transform.toMatrix3()`), which inherently handles shear.

### 1.2 Rotation Drift and Re-normalization

- **Context:** `Rotation2` stores angles as precalculated `(cos, sin)` pairs.
- **The Limitation:** Floating-point precision (IEEE 754) is imperfect. Multiplying two `Rotation2` objects incurs minute rounding errors. After thousands of physics frames, the `(cos, sin)` vector will "drift" away from the unit circle (magnitude ≠ 1.0). If you scale a vector using a drifted rotation, the vector will unintentionally grow or shrink.
- **Why it was omitted in constructors:** The `Rotation2(cos, sin)` constructor intentionally **does not** auto-normalize inputs. Normalization requires calculating a square root (`1 / sqrt(x*x + y*y)`). Doing this automatically on every object creation or multiplication would plummet the engine's frame rate.
- **The Solution:** The developer is responsible for manually calling `.normalize()` periodically (e.g., once every 60 frames per physics body) or using the `.normalized` getter when absolute precision is required.

---

## 2. API Facade & Conversions

The library avoids circular dependencies by employing strict conversion methodologies.

### 2.1 Type Upcasting (`from*` and `to*`)

Transforming data between geometries adheres to the `to[Type]()` pattern, generating a physical copy unless `out` parameters are provided.

```typescript
// Construct a Matrix from a Semantic Transform
const matrix = Matrix3.fromTransform2(myTransform);

// Re-extract semantics (Decomposition)
// Note: This decomposition drops shear data if present in the matrix.
const transform = Transform2.fromMatrix3(matrix);
```

### 2.2 Pre-calculated Trigonometry (The `*CS` Pattern)

Many methods in `Vector2` (e.g., `rotate()`) require an angle in radians. However, invoking `Math.cos(angle)` inside a hot loop is a well-known architectural bottleneck.
To achieve seamless interoperability with `Rotation2`, functions provide `*CS` variants.

```typescript
// BAD: Invokes transcendental functions X times
for (const vec of vertices) {
 vec.rotate(Math.PI / 4);
}

// GOOD: Calculates once, interoperates with Rotation2 via exact pointers
const rot = Rotation2.fromAngle(Math.PI / 4);
for (const vec of vertices) {
 vec.rotateCS(rot.cos, rot.sin);
}
```

This pattern dictates how the library optimizes cross-layer operations without destroying the Garbage Collector.
