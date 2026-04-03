---
sidebar_position: 3
title: 'Edge Cases'
description: 'IEEE 754 failure modes, normalization paradoxes, and set theory anomalies'
---

# Edge Cases

> **Status:** NORMATIVE  
> **Scope:** Documenting exact failure modes, IEEE 754 precision limits, set theory anomalies, and architectural safety-valves across `@lenguados/math2d`.

This is the definitive guide to mathematical failure within the `math2d` package. It catalogues every known scenario where the API behavior diverges from naive expectations, detailing exactly _why_ it happens and how the package handles it.

---

## 1. IEEE 754 Floating-Point Precision Constraints

### 1.1 The Underflow Catastrophe: `Complex` Division

- **The Engine Reality:** Dividing a complex number $C_1$ by $C_2$ requires dividing by the squared magnitude of the denominator ($x^2 + y^2$).
- **The Edge Case:** Squaring extremely small floats (e.g., $10^{-160}$) causes a catastrophic IEEE 754 underflow, resulting in absolute `0.0`. Even if $C_2$ is not literally zero, calculating `magnitudeSq()` evaluates to `0`, throwing an artificial division-by-zero `RangeError`.
- **The Fix:** When dealing with atomic-scale physics, use `divideSafe()`, which intercepts this underflow and returns the generic `Complex.ZERO` rather than blowing up the game tick.

### 1.2 The Normalization Paradox: `Vector2.normalize()`

- **The Engine Reality:** Normalizing a vector of microscopic scale.
- **The Edge Case:** Length calculations depend on $x^2 + y^2$. Identical to `Complex` division, extremely small vectors whose squared components underflow standard 64-bit precision will fail the `isNearZero` check and throw `RangeError("Vector2.normalize: cannot normalize zero-length vector")`.
- **Why it was omitted:** Implementing a high-precision hypotenuse solver (like Kahan summation) would add massive overhead to thousands of particle calculations per frame. The library favors 99% fast-path speed over 1% underflow protection.

---

## 2. Set Theory & Component Operations

### 2.1 The `undefined` Intersection: `Interval`

- **The Expectation:** Chaining fluid methods: `interval.union(b).intersect(c).multiplyScalar(5)`.
- **The Edge Case:** The intersection of two non-overlapping intervals mathematically results in the Empty Set (∅).
- **The Architecture:** In JavaScript, representing ∅ with a degenerate interval like `[0,0]` or `[NaN, NaN]` is wildly dangerous. Therefore, `Interval.intersect()` explicitly returns `undefined` when sets are disjoint.
- **The Rule:** You **cannot** safely chain `.intersect()`. Callers must explicitly check for `undefined` to prevent `TypeError: cannot read properties of undefined (reading 'multiplyScalar')`.

### 2.2 Reversal via Negative Radius: `randomOnCircle`

- **The Reality:** Circular random generative functions accept a `radius` parameter.
- **The Edge Case:** Passing a negative radius (e.g., `-5`) does not throw an error in JavaScript math. However, it geometrically inverts the resultant coordinates across the origin.
- **The Architecture:** `assertNonNegative` exists locally inside these functions for `DEV_MODE`. In production (`useNativeMath`), this is stripped, making it silently degenerative.

---

## 3. The Branchless Mathematical Contract (The `*Unchecked` Path)

The ultimate architectural concession for extreme performance is the `Unchecked` variant of arithmetic methods -- a deliberate decision made under engine-level optimization criteria (V8/CPU Pipeline) that mirrors the "fast-paths" of C++ physics engines (like Box2D).

### 3.1 Branchless Normalization and Inversion

- **The Industry Context:** Traditional graphics libraries like `Three.js` or `gl-matrix` include defensive checks in their core functions (e.g., `if (len > 0)` or `length || 1`).
- **The Hidden Cost:** In a collision-resolution loop executed 100,000 times per frame, that `if` statement forces the CPU's Branch Predictor to guess. A misprediction flushes the pipeline, destroying performance.
- **The Math2D Architecture:** The `*Unchecked` methods (such as `Vector2.normalizeUnchecked()` or `Matrix2.inverseUnchecked()`) deliberately eliminate the `if`. They guarantee 100% linear (branchless) code.
- **The Edge Case (The IEEE 754 Contract):** If you break the contract and pass the Zero Vector to `normalizeUnchecked()`, the system will execute `1 / 0`, yielding `Infinity`. Multiplying `0 * Infinity` produces a result vector of `(NaN, NaN)`. Matrices with a zero determinant will fill with `Infinity`.
- **The Rule:** This behavior is **NOT a bug** -- it is the IEEE 754 standard for "Garbage In, Garbage Out". The NaN will recursively infect the transformation tree. These methods are "Industrial Grade"; use them exclusively when prior math (e.g., SAT separating axis detection) has already guaranteed that the length or determinant will never be zero. For UI or uncertain physics, use the `*Safe` variants.

---

## 4. Angle Wrap-Around & Equality Algorithms

### 4.1 The $2\pi$ Leap: `scalarNearEquals` vs `angleDifference`

- **The Engine Reality:** Comparing two angles to see if they represent the same rotational heading.
- **The Edge Case:** Floating point values `-3.14159` ($-\pi$) and `3.14159` ($\pi$) represent the exact same rotation, yet `scalarNearEquals(Math.PI, -Math.PI)` returns `false`.
- **The Architecture:** `Rotation2.nearEquals` explicitly implements a fallback employing `angleDifference(a, b)` precisely to intercept wrap-around.
- **The Rule:** Developers must never compare rotational headings directly using the raw `angle` getter. Always use `relativeEquals` wrapper primitives or let `Rotation2` handle the boundary cross.

---

## 5. Topological Resolutions in Continuous Spaces (Interval)

Unlike `intersect()`, which can result in an "Empty Set" (`undefined`) if the intervals do not overlap, the `Interval.union(a, b)` operation obeys the principles of **Convex Geometry and Continuous Topological Spaces**, not discrete finite set theory.

> [!WARNING]
> When `union` is applied to disjoint intervals (e.g., `[0, 1] ∪ [5, 6]`), the system does **not** return an array or fragmented collection of discontinuous dimensions. Instead, the math package operates under the Spatial Continuity postulate, generating the **Convex Hull** of the extreme points: `[0, 6]`.
>
> **Agnostic Mathematical Criterion:** When dealing with geometric spaces (1D, 2D), the fundamental unit of `Interval` is a continuous uninterrupted line segment. Any combinatorial operation that must return a single resulting `Interval` is mathematically obligated to span the complete range between the global minimum and the global maximum, inevitably absorbing the empty space `(1, 5)`. This is not an anomaly but the standard behavior defined by the topology of convex sets in $\mathbb{R}$.

---

## 6. NaN and the Assertion Boundary

### 6.1 The Assertion Boundary: Where NaN Validation Lives

The `math2d` package follows a strict layered validation model:

| Layer                                             | NaN Handling                                                         |
| :------------------------------------------------ | :------------------------------------------------------------------- |
| `auxiliary/` functions (lerp, clamp, reduceAngle) | **No NaN validation** — pure math, propagate NaN                     |
| `core/` constructor                               | **No NaN validation** — pure IEEE 754 assignment                     |
| `core/` `set()` / `fromValues()` user-facing      | **Validates** — rejects invalid inputs                               |
| `validation/assert*` dev-only                     | **Validates NaN** — range assertions include `value !== value` check |
| `*Safe()` variants                                | **Propagates NaN** from primary operands (by ratified spec)          |
| `*Unchecked()` variants                           | **GIGO** — NaN in → NaN out, never throws                            |

**The key insight**: Auxiliary functions (`lerp`, `clamp`, `sinCos`, etc.) do NOT validate NaN by documented design. They are composable math primitives. Validation belongs at the **API boundary** — in `set()`, `fromValues()`, and assertion functions — not in every intermediate computation.

### 6.2 NaN in `*Safe()` Variants

`*Safe()` methods return a fallback for operational failures (division by zero, normalize-zero-length) but they do **not** sanitize NaN from the inputs. If you pass NaN as a primary operand, the result will propagate NaN:

```typescript
Vector2.normalizeSafe({ x: NaN, y: 0 });
// → Vector2(NaN, NaN)  — not the fallback identity!
```

This is intentional. A `*Safe()` method protects against a specific mathematical edge case (zero division, degenerate magnitude). It is not a general NaN shield. Passing NaN is a programming error that should surface via NaN propagation (detectable via `isNaN(result.x)`), not be silently masked by returning a fallback.

### 6.3 The Double-Normalization Anti-Pattern

Factory methods and static computations that **pre-compute** normalized values (e.g., unit direction vectors, rotation components) MUST route them through `setDirect()`, not `set()`.

`set()` normalizes internally — so if you pass already-normalized values:

```typescript
const inv = 1 / magnitude;
rotation.set(x * inv, y * inv); // ← BAD: magnitude computed TWICE
```

The second `Math.sqrt` (inside `set()`) is a pure waste. The correct pattern:

```typescript
const inv = 1 / magnitude;
rotation.setDirect(x * inv, y * inv); // ← CORRECT: invariant already proven
```

`setDirect` is private to each class. It bypasses normalization because the calling code has already proven the invariant. This is the `setDirect` pattern (see ADR-009 in the Design Decisions doc).

`Transform2.fromComponents` is a concrete example of a related case: when a `ReadonlyRotation2Like` is passed, `cos` and `sin` are copied directly to the internal `Rotation2` without going through `set()`. This avoids both the redundant `Math.sqrt` and a lossy `atan2 → sinCos` roundtrip. The trade-off is that the **caller is responsible for providing a unit-length object** (`cos² + sin² = 1`). Passing a non-unit-length object stores invalid state silently — this is the implicit caller contract made explicit in the TSDoc `@remarks`.
