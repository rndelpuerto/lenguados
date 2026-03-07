# Contributing to @lenguados/math2d

Thank you for your interest in contributing to `@lenguados/math2d`. This package is the mathematical foundation for the Lenguado physics engine, prioritizing performance, determinism, and correctness.

This guide details the architectural patterns and conventions you must follow.

---

## 1. Design Philosophy

- **Zero Allocation on Hot Paths**: All operations inside loops must support `out` parameters to reuse memory.
- **Determinism**: Results must be bitwise identical across platforms. Use `deterministic-kernels` for trig functions. `Math.sqrt` is IEEE 754 required (deterministic by standard).
- **Semantic Precision**: Naming reflects mathematical meaning (e.g., `Rotation2` vs `Complex`, `apply` vs `transform`).
- **Strictness by Default**: Operations throw on invalid input unless `Safe` or `Unchecked` variants are used.

---

## 2. Architecture

The library is organized in layers of abstraction:

### 2.1 Auxiliary (`src/auxiliary/`)

Low-level primitives. stateless functions.

- `scalar/`: Floats, interpolation (lerp, smoothStep).
- `angle/`: Radians normalization, conversion.
- `numeric/`: Guards, safety checks.

### 2.2 Core (`src/core/`)

High-level mathematical objects (Vector2, Matrix2, etc.).

- Defines semantic types.
- Integrates auxiliary functions.

### 2.3 Deterministic (`src/deterministic/`)

Cross-platform consistent kernels.

- `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`, `hypot` implementations that guarantee reproducibility.

### 2.4 Utils (`src/utils/`)

Optional tools not required for core math.

- Random generation, parsing, performance measurement.

---

## 3. Error Handling Convention (Strict / Safe / Unchecked)

We use a triality pattern for operations that can fail (e.g., division by zero, singular matrix inversion).

### 3.1 Strict (Default)

**Signature:** `method(input): Result`

- **Behavior:** Throws `Error` if input is invalid.
- **Use Case:** General usage where correctness is paramount.
- **Example:** `Vector2.normalize(v)` throws if vector is zero.

### 3.2 Safe

**Signature:** `methodSafe(input): Result` (suffix, not prefix: `divideSafe`, not `safeDivide`)

- **Behavior:** Returns a fallback value (Identity, Zero, or Copy) on invalid input. **Never throws.**
- **Use Case:** Robust simulations where continuity is preferred over crashing.
- **Example:** `Vector2.normalizeSafe(v)` returns zero vector if input is zero.

### 3.3 Unchecked

**Signature:** `methodUnchecked(input): Result`

- **Behavior:** Performs NO validation. Result is undefined (NaN/Infinity) on invalid input.
- **Use Case:** Extreme hot paths where input validity is pre-guaranteed.
- **Example:** `Vector2.inverseUnchecked(v)` divides by determinant without checking for zero.

---

## 4. API Conventions

### 4.1 Memory Management (`out?`)

All static methods returning objects MUST accept an optional `out` parameter as the **last argument**.

```typescript
// Correct
static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2;

// Incorrect (out first)
static add(out: Vector2, a: ReadonlyVector2Like, b: ReadonlyVector2Like): Vector2;
```

### 4.2 Readonly vs Mutable Interfaces

Use `Readonly*Like` interfaces for inputs to allow passing POJOs (Plain Old JavaScript Objects).

```typescript
// Accepts { x: 1, y: 2 } or new Vector2(1, 2)
function process(v: ReadonlyVector2Like) { ... }
```

### 4.3 Fluent Interface

Instance methods that mutate `this` must return `this` to enable chaining.

```typescript
const v = new Vector2().set(1, 0).scale(2).rotate(Math.PI);
```

### 4.4 Apply vs Transform

- **`apply`**: Used for **Operators** (Rotation2, Complex). "Apply this rotation to a vector."
- **`transform`**: Used for **Spatial Definitions** (Matrix2, Matrix3, Transform2). "Transform this point from space A to space B."

---

## 5. Build & Test workflows

### Build

The project uses `rollup` with conditional exports.

```bash
# Build all formats (ESM, CJS, Types)
npm run build

# Watch mode
npm run watch
```

### Testing

We use `jest` for unit testing.

```bash
# Run all tests
npm test

# Run specific test
npm test vector2

# Check coverage
npm run test:coverage
```

### Linting

Ensure no lint errors before committing.

```bash
npm run lint
```
