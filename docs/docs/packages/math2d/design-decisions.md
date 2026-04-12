---
sidebar_position: 4
title: 'Design Decisions'
description: 'Architectural decisions, alternatives considered, and industry benchmarks'
---

# Design Decisions

> **Status:** Reference  
> **Last Reviewed:** 2025-2026

This document captures the architectural decisions behind `@lenguados/math2d`, contrasted against industry-standard game engines and simulation libraries. Each section follows an ADR (Architecture Decision Record) style where applicable: context, decision, alternatives considered, and rationale.

---

## 1. Design Conventions

The API follows established conventions from the broader 2D mathematics, physics simulation, and GPU computing domains.

| Technique / Algorithm | Our Decision                 | Convention Source               | Rationale                                                                           |
| :-------------------- | :--------------------------- | :------------------------------ | :---------------------------------------------------------------------------------- |
| Smooth Interpolation  | `smoothStep`                 | GLSL spec, HLSL spec            | Standardized Hermite pattern. (`smoothlerp` is a non-standard anti-pattern).        |
| 2D Rotations          | `Rotation2(cos, sin)` object | Unit complex representation     | Storing only the processed scalars avoids hidden latency in body-update loops.      |
| Matrix Memory Layout  | Column-Major (1D)            | WebGL / GPU buffer convention   | One-to-one compatibility with GPU buffer layouts (`Float32Array` ready for upload). |
| Precision Tolerance   | `EPSILON = 1e-10`            | Double-precision best practices | Conservative for double precision; float32 engines typically use `1e-7` to `1e-8`.  |

---

## 2. Deliberately Excluded Patterns

Based on theoretical failures in abstraction, the following designs have been intentionally rejected.

### ADR-001: No `Complex.min()` / `Complex.max()`

- **Context:** Developers may expect min/max operations on complex numbers by analogy with real-number types.
- **Decision:** Do not implement ordering operations on `Complex`.
- **Alternatives Considered:** Comparison by magnitude, comparison by real part.
- **Rationale:** Complex numbers inhabit a plane (C), not a real number line (R). They lack a total order relation compatible with their Galois field operations. Python raises `TypeError` for the same reason. Any ordering would be mathematically illegitimate and misleading.

### ADR-002: No `Transform2.slerp()`

- **Context:** 3D engines commonly provide spherical linear interpolation (slerp) on transforms via quaternions in SO(3).
- **Decision:** Do not provide a dedicated `slerp` method on `Transform2`.
- **Alternatives Considered:** Hybrid slerp combining position, rotation, and scale interpolation.
- **Rationale:** In the R2 domain, hybrid interpolation mixing linear position, vectorial rotation, and scaling is degenerative. The approved solution is an explicit general `lerp(a, b, t)` that internally delegates to `Vector2.lerp` (position), `Rotation2.lerp` (rotation), and `Vector2.lerp` (scale) respectively. Note: in 2D, lerp of unit complex numbers IS slerp, so a separate slerp method is unnecessary.

---

## 3. Industry Comparisons

After exhaustive audit, the following architectural contrasts against standardized open-source libraries have been codified.

### ADR-003: Object-Oriented Ergonomics over Raw Typed Arrays

- **Context:** Some math libraries rely entirely on pre-allocated mutations using raw `Float32Array` values and loose global functions (`vec2.add(out, a, b)`).
- **Decision:** `@lenguados/math2d` retains object-oriented programming (OOP) ergonomics, encapsulating state in instantiable classes (`this.x`, `this.y`). It employs pure static methods and fluent instance methods (`v.add(b)`).
- **Alternatives Considered:** Pure functional approach with typed arrays.
- **Rationale:** Gains ergonomics without sacrificing performance, facilitating readability for simulation code rather than strict WebGL buffer-filling patterns. Static methods still accept an optional `out` parameter for allocation-free hot paths.

### ADR-004: Explicit Rotation2 Object (Unit Complex Representation)

- **Context:** Many libraries store rotations as raw angles or rely on 3D quaternions even for 2D use cases.
- **Decision:** `@lenguados/math2d` explicitly introduces `Rotation2`, storing `(cos, sin)` internally instead of a floating-point scalar (radian).
- **Alternatives Considered:** Store rotation as a single radian value (simpler API, smaller memory footprint).
- **Rationale:** Eliminates costly and unnecessary kernel calls (`Math.cos()`, `Math.sin()`) during the 2D vertex/particle update cycle. The unit complex number representation is the standard approach for efficient 2D rotation in physics engines and robotics.

### ADR-005: Dual Validation Pipeline (Strict / Safe / Unchecked)

- **Context:** Statically-typed languages (C++, Rust) can leverage compile-time assertions to omit costly NaN/zero-division validation at runtime. JavaScript lacks these compile-time guarantees.
- **Decision:** `@lenguados/math2d` implements a dual L0 pipeline: a Safe path that pre-computes division and transformation validations (`divideSafe`, `isNearZero`), and an Unchecked path that requires the consumer to mathematically verify state beforehand to bypass branch-prediction penalties.
- **Alternatives Considered:** Single validation path (always validate), runtime-configurable validation toggle.
- **Rationale:** The dual-path approach lets simulation code (e.g., physics solvers that guarantee non-zero inputs) run the Unchecked path for 100% linear CPU execution, while application-level code uses the Safe path for robustness.

### ADR-006: Zero-Allocation Mutation

- **Context:** Immutable math libraries return new instances for all operations, generating significant garbage collection pressure.
- **Decision:** `@lenguados/math2d` maintains a strict zero-allocation paradigm. Pre-existing instances are rewritten/mutated in-place. Static functions require an optional `out` argument.
- **Alternatives Considered:** Immutable value objects (functional style), copy-on-write.
- **Rationale:** In a physics engine running thousands of operations per frame, allocation and GC pauses are unacceptable. Mutation-in-place with optional `out` parameters eliminates allocation overhead entirely while still allowing callers to opt into fresh instances when convenient.

---

## 4. Ratified Policies (2026 Audit)

The following decisions were formalized after an exhaustive line-by-line audit of all 32 source files, verified against academic sources (IEEE 754, fdlibm, numerical analysis literature) and industry best practices.

### ADR-007: Constructor Purity — No Assertions in Constructors

- **Context:** A JavaScript math library cannot rely on C++ compile-time type constraints. The temptation is to add defensive assertions to constructors so that objects are always in a valid state upon creation.
- **Decision:** All constructors in `core/` MUST be pure assignment with zero validation. NaN and Infinity are valid IEEE 754 values. The canonical comment `// Pure math: no assertions — Infinity/NaN are valid IEEE 754 values` is required in every constructor.
- **Alternatives Considered:** Dev-only assertions (DCE-safe), always-on validation, optional validation flag.
- **Rationale:** Constructors are called in tight allocation loops (e.g., `ensureOut(out) ?? new Vector2()`). A DCE-stripped assertion in the constructor body still adds a branch in development builds, which hurts profiling accuracy. More importantly, NaN/Infinity propagation through the math layer is a feature: it surfaces bugs (via `isNaN` detection) rather than silently masking them. Validation belongs in `set()` (user-facing), `fromValues()` (factory), and assertion functions — not in constructors.
- **Compliance:** All 7 core types comply: Vector2, Rotation2, Complex, Interval (fixed 2026), Matrix2, Matrix3, Transform2 (fixed 2026).

### ADR-008: Assertion Functions Must Reject NaN via `value !== value`

- **Context:** Assertion functions like `assertPositive`, `assertNonNegative`, and `assertNonZero` guard numeric ranges. IEEE 754 comparison semantics cause all comparisons involving NaN to return `false` — so `NaN <= 0`, `NaN === 0`, and `NaN < 0` are all `false`. A guard written as `if (value <= 0) throw` silently passes NaN.
- **Decision:** Every assertion function that guards a numeric range MUST include an explicit NaN trap: `if (value !== value || <range_check>)`.
- **Alternatives Considered:** `Number.isNaN(value)`, `isNaN(value)` (coerces string to NaN — incorrect), `value !== value` (fastest, no call overhead, universally understood in math contexts).
- **Rationale:** NaN is not in any valid numeric range. Silently passing NaN into math that assumes a validated input produces incorrect results downstream without any error signal. The `value !== value` idiom is the canonical IEEE 754 NaN test, costs zero overhead, and is consistent with how deterministic math kernels handle the check.

### ADR-009: `setDirect` Pattern — Bypassing Re-Validation on Pre-Computed Results

- **Context:** Core classes that store normalized state (`Rotation2` stores unit-length `(cos, sin)`; `Interval` stores ordered `[min, max]`) expose a `set()` method that normalizes / validates inputs. Factory methods and static computations often pre-compute values that are already in the correct normalized form (e.g., `cos(angle)` is always in `[-1, 1]`; `x * inv` is unit-length by construction).
- **Decision:** These classes expose a private `setDirect()` method for internal use. All internal code paths that can prove the invariant MUST use `setDirect()` rather than `set()`. User-facing code paths MUST use `set()`.
- **Alternatives Considered:** Inlining the assignment directly, removing `set()` normalization (would break user-facing safety), always using `set()` (simpler but double-computes magnitude in hot paths).
- **Rationale:** The `set()` method calls `Math.sqrt` / `hypot` internally to normalize. In methods like `Rotation2.fromVector2` that have already computed the unit direction, calling `set()` triggers a second identical `Math.sqrt` — wasted computation in a hot-path factory. The `setDirect` pattern provides an escape hatch that is private (not part of the public API), clearly named, and limited to internal code that has explicitly proven the invariant.
