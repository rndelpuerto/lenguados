# @lenguados/math2d Design Philosophy

> **Status:** NORMATIVE
> **Scope:** How `@lenguados/math2d` interprets, applies, and intentionally violates traditional OOP and SOLID principles for the sake of 60 FPS simulation performance.

This document extends the engine-wide [Design Philosophy](../../DESIGN_PHILOSOPHY.md) with conventions specific to `@lenguados/math2d`. It is the Rosetta Stone for understanding why certain code blocks look "repetitive" or "un-encapsulated", and why those decisions are highly calculated optimizations (mechanical sympathy).

---

## 1. Context — The Physics Engine Reality

In standard enterprise development, DRY (Don't Repeat Yourself) and SOLID are sacrosanct. However, in low-level mathematics libraries executed millions of times per second, the rules of CPU cache lines and branch prediction overrule theoretical purity.

This package adopts **Performance-Oriented Architecture (POA)**, meaning SOLID is strictly enforced until it hits an algorithmic hot path, at which point the abstraction is deliberately dismantled with a documented rationale.

---

## 2. SOLID Application and Intentional Violations

### 2.1 Single Responsibility Principle (SRP)

- **Strict adherence:** classes only handle their specific geometric domain. `Transform2` manages spatial relationships; it does not intertwine with collision logic. `Vector2` manages linear magnitude; it does not attempt to calculate quaternions.
- **Separation of I/O:** parsing algorithms (`parseVector2`, `formatMatrix3`) live entirely outside the core classes in `utils/parse.ts`. A `Matrix3` is purely a mathematical construct; it has zero responsibility for JSON stringification or regex execution.

### 2.2 Open / Closed Principle (OCP)

- **Intentional friction:** core math classes (`Vector2`, `Matrix3`) are not designed to be inherited via `extends`. Modern JavaScript engines optimize classes based on their hidden classes (object shapes). If a user extends `Vector2` to create `ColorVector`, the engine branches the optimization path, slowing down all `Vector2` operations globally.
- **The rule:** do not use `extends` on core math classes. Use composition (passing a `Vector2` into a custom `RigidBody` class) instead.

### 2.3 Liskov Substitution Principle (LSP)

- **Strict adherence via interfaces:** every concrete class (`Matrix2`) has a corresponding `ReadonlyXYZLike` interface (`ReadonlyMatrix2Like`). Any function expecting a matrix (`transform(m: ReadonlyMatrix2Like)`) will accept a plain JavaScript object perfectly: `transform({ m00: 1, m01: 0, ... })`. The package does not enforce `instanceof` checks.

### 2.4 Interface Segregation Principle (ISP)

- **Strict adherence:** interfaces are razor-thin. `ReadonlyVector2Like` (getters only) is explicitly exported as distinct from `Vector2Like` (getters and setters). Consumers depend only on the exact mutability contract they require.

### 2.5 Dependency Inversion Principle (DIP)

- **The determinism exception:** transcendental math functions (`sin`, `cos`, and siblings) are hardcoded dependencies linking back to `deterministic-kernels.ts` (fdlibm).
- **The justification:** injecting `Math` versus `fdlibm` via dependency-injection wrappers inside a loop running 10 000 times per frame destroys inlining and introduces virtual dispatch overhead. The package inverts the dependency globally via the `config.useNativeMath` kill-switch instead of locally injecting factories.

---

## 3. DRY vs. Inline Expansion

If you read the source of `Matrix3.ts` and `Matrix2.ts`, you will find duplicate blocks calculating determinants or multiplying components.

### 3.1 Unrolling Loops (Intentional WET Code)

- **The faux-pas:** a junior developer might try to refactor `Matrix3.multiply` by abstracting the row / column multiplication into a generic `for` loop helper function.
- **The architecture:** `math2d` uses **loop unrolling**. `Matrix3.multiply` explicitly writes out all 9 output cells ($N^2$ cells, $N$ multiplications each) manually:

```typescript
out.m00 = a.m00 * b.m00 + a.m10 * b.m01 + a.m20 * b.m02;
out.m01 = a.m01 * b.m00 + a.m11 * b.m01 + a.m21 * b.m02;
// ... repeated 9 times.
```

- **The justification:** JIT engines cannot reliably inline nested `for` loops within a hot mathematical function. Hardcoding the 9 output cells eliminates loop-index management and array bounds checks from the hot path entirely.

### 3.2 The Dual-Path Pipeline (`Safe` vs. `Unchecked`)

- **The code duplication:** nearly every critical mutator (for example `normalize`, `inverse`) is visually duplicated twice in the source.

1. `normalizeSafe` contains structural checks (`isNearZero`).
2. `normalizeUnchecked` has identical mathematics, but no `isNearZero` block.

- **The justification:** branch prediction. If the CPU pipeline encounters an `if (isNearZero)` inside an inner loop, it must guess. If it guesses wrong, the pipeline flushes (massive latency spike). By duplicating the code and offering `Unchecked`, advanced consumers (such as a physics solver guaranteeing non-zero inputs) completely bypass the `if` statement, ensuring linear CPU execution.

This rule covers formula duplication across triality tiers (strict / Safe / Unchecked variants of the same operation). It does **not** cover wrapper methods whose entire body is a single kernel call (for example `Complex.apply` delegating to `Vector2.rotateCS`). Wrappers whose body is a single kernel call SHOULD delegate to the canonical kernel. Inlining is permitted only when a tracked benchmark in `tools/benchmark/` shows a measurable and reproducible improvement; the benchmark MUST be referenced from a TSDoc `@remarks` block on the inlined method.

---

## 4. Constructor Purity — No Assertions

Constructors MUST be pure assignment with zero validation. `NaN` and `Infinity` are valid IEEE 754 values. Validation belongs in `set` (user-facing), `fromValues` (factory), and assertion functions — never in constructors.

Rationale: constructors are called in tight allocation loops (for example `ensureOut(out)`, whose body evaluates `out ?? new Vector2()`). A DCE-stripped assertion in the constructor body still adds a branch in development builds, which hurts profiling accuracy. More importantly, `NaN` and `Infinity` propagation through the math layer is a feature — it surfaces bugs rather than silently masking them.

All seven core types comply: `Vector2`, `Rotation2`, `Complex`, `Interval`, `Matrix2`, `Matrix3`, `Transform2`. See the [Design Decisions](DESIGN_DECISIONS.md) record ADR-007 for the full rationale.

---

## 5. Determinism as an Architectural Axiom

The package commits to bit-exact cross-platform results for all transcendental functions via fdlibm polynomial implementations. `Math.sqrt` and other IEEE 754-required operations are used directly. The `config.useNativeMath` runtime toggle provides an escape hatch for single-player scenarios where reproducibility is not required. Set once at application startup — never toggle mid-computation.

See the [Architecture](ARCHITECTURE.md) document for the full layer graph and toggle mechanics.

---

> **Cross-reference:** For industry benchmarks and conventions informing these axioms, see [Design Decisions](DESIGN_DECISIONS.md).
