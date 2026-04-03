---
sidebar_position: 3
title: 'Design Philosophy'
description: 'Performance-Oriented Architecture, SOLID deviations, and mechanical sympathy'
---

# Design Philosophy

> **Status:** NORMATIVE
> **Scope:** How `@lenguados/math2d` interprets, applies, and intentionally violates traditional OOP and SOLID principles for the sake of 60FPS simulation performance.

This document serves as the Rosetta Stone for understanding why certain code blocks look "repetitive" or "unencapsulated", and why those decisions are actually highly calculated optimizations (A.K.A "Mechanical Sympathy").

---

## 1. Context: The Physics Engine Reality

In standard enterprise development, DRY (Don't Repeat Yourself) and SOLID are sacrosanct. However, in low-level mathematics libraries executed millions of times per second, the rules of CPU cache-lines and Branch Prediction overrule theoretical purity.

This package adopts **Performance-Oriented Architecture (POA)**, meaning we strictly enforce SOLID until it hits an algorithmic hot-path, at which point the abstraction is deliberately dismantled.

---

## 2. SOLID Application & Intentional Violations

### 2.1 Single Responsibility Principle (SRP)

- **Strict Adherence:** Classes only handle their specific geometric domain. `Transform2` manages spatial relationships; it does not intertwine with collision logic. `Vector2` manages linear magnitude; it does not attempt to calculate quaternions.
- **Separation of I/O:** The Parsing algorithms (`parseVector2`, `formatMatrix3`) live entirely outside the core classes in `utils/parse.ts`. A `Matrix3` is purely a mathematical construct; it has _zero responsibility_ for JSON stringification or Regex execution.

### 2.2 Open/Closed Principle (OCP)

- **Intentional Friction:** Core math classes (`Vector2`, `Matrix3`) are not designed to be inherited (`extends`). V8 (the JavaScript engine) optimizes classes based on their "Hidden Classes" (object shapes). If a user extends `Vector2` to create `ColorVector`, V8 will branch the optimization path, slowing down all `Vector2` operations globally.
- **The Rule:** Do not use `extends` on Core Math classes. Use Composition (passing a `Vector2` into your custom `RigidBody` class) instead.

### 2.3 Liskov Substitution Principle (LSP)

- **Strict Adherence via Interfaces:** Every concrete class (`Matrix2`) has a corresponding `ReadonlyXYZLike` interface (`ReadonlyMatrix2Like`). Any function expecting a Matrix (`transform(m: ReadonlyMatrix2Like)`) will accept a POJO (Plain Old JavaScript Object) perfectly: `transform({m00: 1, m01: 0 ...})`. The engine does not enforce `instanceof` checks.

### 2.4 Interface Segregation Principle (ISP)

- **Strict Adherence:** Interfaces are razor-thin. We explicitly export `ReadonlyVector2Like` (only getters) distinct from `Vector2Like` (getters and setters). Consumers only depend on the exact mutability contract they require.

### 2.5 Dependency Inversion Principle (DIP)

- **The Determinism Exception:** Transcendental math functions (`sin`, `cos`) are hardcoded dependencies linking back to `deterministic-kernels.ts` (fdlibm).
- **The Justification:** Injecting standard `Math` vs `fdlibm` via Dependency Injection (DI wrappers) inside a loop running 10,000 times per frame destroys inlining and introduces virtual dispatch overhead. We invert the dependency globally via the `config.useNativeMath` kill-switch instead of locally injecting factories.

---

## 3. DRY (Don't Repeat Yourself) vs Inline Expansion

If you read the source code of `Matrix3.ts` and `Matrix2.ts`, you will find duplicate code blocks calculating determinants or multiplying components.

### 3.1 Unrolling Loops (Intentional WET Code)

- **The Faux-Pas:** A junior developer might try to refactor `Matrix3.multiply` by abstracting the row/column multiplication into a generic `for` loop helper function.
- **The Architecture:** `math2d` uses **Loop Unrolling**. `Matrix3.multiply` explicitly writes out all 9 combinations ($O(N^2)$) manually:
  ```typescript
  out.m00 = a.m00 * b.m00 + a.m10 * b.m01 + a.m20 * b.m02;
  out.m01 = a.m01 * b.m00 + a.m11 * b.m01 + a.m21 * b.m02;
  // ... repeated 9 times.
  ```
- **The Justification:** V8 cannot reliably inline nested `for` loops within a hot mathematical function. Hardcoding the 9 combinations takes 0.001ms instead of the 0.05ms required to manage loop indices and array bounds checking.

### 3.2 The Dual-Path Pipeline (`Safe` vs `Unchecked`)

- **The Code Duplication:** Nearly every critical mutator (e.g., `normalize`, `inverse`) is visually duplicated twice in the source code.
  1. `normalizeSafe()` - Contains structural checks (`isNearZero`).
  2. `normalizeUnchecked()` - Identical mathematics, but missing the `isNearZero` block.
- **The Justification:** Branch Prediction. If the CPU pipeline encounters an `if (isNearZero)` inside an inner loop, it must guess. If it guesses wrong, the pipeline flushes (massive latency spike). By duplicating the code and offering `Unchecked`, advanced consumers (like a physics solver guaranteeing non-zero inputs) completely bypass the `if` statement, ensuring 100% linear CPU execution.

---

:::note Cross-Reference
For industry benchmarks and comparisons, see [Design Decisions](../math2d/design-decisions).
:::
