# Design Philosophy

> **Status:** NORMATIVE
> **Scope:** How the lenguados engine interprets, applies, and intentionally deviates from traditional OOP and SOLID principles for 60FPS simulation performance.

This document is the engine-wide Rosetta Stone for understanding why certain code blocks look "repetitive" or "unencapsulated." These decisions are highly calculated optimizations — a discipline known as **Mechanical Sympathy**.

---

## 1. Performance-Oriented Architecture (POA)

In standard enterprise development, DRY (Don't Repeat Yourself) and SOLID are sacrosanct. In a physics engine executed millions of times per second, the rules of CPU cache-lines and Branch Prediction overrule theoretical purity.

Every package in the engine adopts **POA**: SOLID is strictly enforced until it hits an algorithmic hot path, at which point the abstraction is deliberately dismantled with a documented rationale.

---

## 2. SOLID Application & Intentional Violations

### 2.1 Single Responsibility Principle (SRP)

- **Strict Adherence:** Classes only handle their specific domain. A physics body does not parse JSON; a math type does not handle rendering.
- **Separation of I/O:** Parsing and serialization live outside core classes, in dedicated utility modules.

### 2.2 Open/Closed Principle (OCP)

- **Intentional Friction:** Core engine classes are not designed to be inherited (`extends`). Modern JavaScript engines optimize classes based on "Hidden Classes" (object shapes). Subclassing breaks these optimizations globally.
- **The Rule:** Do not use `extends` on core engine classes. Use Composition instead.

### 2.3 Liskov Substitution Principle (LSP)

- **Strict Adherence via Interfaces:** Every concrete class has a corresponding `Readonly*Like` interface. Functions accept POJOs (Plain Old JavaScript Objects) through structural typing — no `instanceof` checks.

### 2.4 Interface Segregation Principle (ISP)

- **Strict Adherence:** Interfaces are razor-thin. `Readonly*Like` (only getters) is distinct from `*Like` (getters and setters). Consumers depend on the exact mutability contract they require.

### 2.5 Dependency Inversion Principle (DIP)

- **The Performance Exception:** In hot-path code, dependency injection wrappers destroy inlining and introduce virtual dispatch overhead. Engine packages invert dependencies globally (e.g., configuration toggles) rather than locally injecting factories.

---

## 3. DRY vs Inline Expansion

### 3.1 Loop Unrolling (Intentional WET Code)

JIT engines cannot reliably inline nested `for` loops within hot mathematical functions. Engine packages explicitly unroll loops in performance-critical operations, manually writing out each computation instead of abstracting into helper functions.

### 3.2 The Dual-Path Pipeline (Safe vs Unchecked)

Nearly every critical operation is visually duplicated:

1. `opSafe()` — Contains structural validation (e.g., zero-check).
2. `opUnchecked()` — Identical mathematics, zero validation.

**Justification:** Branch Prediction. An `if` check inside an inner loop forces the CPU to guess. Mispredictions flush the pipeline. By offering `Unchecked` variants, consumers who can prove their inputs are valid bypass all branching, ensuring 100% linear CPU execution.

---

Each package documents its specific SOLID deviations and unrolling decisions. See the package documentation for concrete examples.
