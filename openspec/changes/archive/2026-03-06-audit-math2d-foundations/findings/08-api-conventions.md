# Phase 2 - API Design: Conventions (Tasks 8.1-8.7)

## 8.1 Naming Rules

### Suffix Triality

| Suffix      | Meaning   | Behavior                                           | Example                         |
| ----------- | --------- | -------------------------------------------------- | ------------------------------- |
| (none)      | Strict    | Validates input; throws on error                   | `inverseLerp(a, b, v)`          |
| `Safe`      | Safe      | Returns finite fallback; never throws              | `inverseLerpSafe(a, b, v)`      |
| `Unchecked` | Unchecked | No validation; undefined behavior on invalid input | `inverseLerpUnchecked(a, b, v)` |

**Rule:** Not all operations need all three tiers. Apply triality when:

- The operation can fail (division by zero, degenerate input)
- The caller might reasonably want different failure modes

Operations that cannot fail (e.g., `add`, `negate`, `dot`) need only one variant.

### Prefix Conventions

| Prefix    | Meaning                                              | Example                                     |
| --------- | ---------------------------------------------------- | ------------------------------------------- |
| `from*`   | Static factory creating from specific representation | `fromAngle`, `fromPolar`, `fromArray`       |
| `to*`     | Conversion to another representation                 | `toArray`, `toMatrix3`                      |
| `is*`     | Boolean predicate                                    | `isVector2Like`, `isNearZero`, `isIdentity` |
| `set*`    | Mutate specific aspect of instance                   | `setAngle`, `setMagnitude`                  |
| `assert*` | Dev-only validation                                  | `assertFinite`, `assertVector2Like`         |
| `freeze*` | Create immutable version                             | `freezeVector2`                             |

### Suffix Conventions

| Suffix             | Meaning                       | Example                              |
| ------------------ | ----------------------------- | ------------------------------------ |
| `*CS`              | Pre-computed cos/sin variant  | `rotateCS(cos, sin)`                 |
| `*Like`            | Duck-typed interface          | `Vector2Like`, `ReadonlyMatrix3Like` |
| `*Squared` / `*Sq` | Squared variant (avoids sqrt) | Standardize to `*Sq`                 |

**Decision: Standardize to `magnitudeSq`** (shorter, matches Complex). Vector2.magnitudeSquared → Vector2.magnitudeSq.

### Method Names

| Action                             | Naming            | Example                               |
| ---------------------------------- | ----------------- | ------------------------------------- |
| Apply rotation to vector           | `rotateVector`    | `Rotation2.rotateVector(r, v, out?)`  |
| Transform point (with translation) | `transformPoint`  | `Matrix3.transformPoint(m, p, out?)`  |
| Transform vector (no translation)  | `transformVector` | `Matrix3.transformVector(m, v, out?)` |

---

## 8.2 Instance/Static Symmetry Rules

### Rule: Static owns the algorithm, instance delegates

```typescript
// Static: the canonical implementation
static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2 { ... }

// Instance: one-line delegate
add(other: ReadonlyVector2Like): this {
  return Vector2.add(this, other, this) as this;
}
```

### Which methods get both forms?

| Category                                 | Static              | Instance     | Rationale            |
| ---------------------------------------- | ------------------- | ------------ | -------------------- |
| Binary ops (add, subtract, multiply)     | Yes                 | Yes          | Fluent chaining      |
| Unary ops (negate, normalize, conjugate) | Yes                 | Yes          | Convenience          |
| Getters (magnitude, determinant)         | Yes                 | Yes (getter) | Access pattern       |
| Factories (fromAngle, fromArray)         | Yes                 | No           | Construction only    |
| Type conversions (toMatrix3)             | Yes                 | Yes          | Both patterns useful |
| Utility (format, parse)                  | Yes (free function) | No           | Not type method      |

### Exceptions

- `transformPoint`/`transformVector` on Matrix3/Transform2: Static form is canonical. Instance form calls static with `this` as the matrix.
- `compose` on Transform2: Static only makes sense (two inputs).

---

## 8.3 API Layer Strategy

### Three Layers

| Layer         | Purpose                                | Example                              | Hot Path?   |
| ------------- | -------------------------------------- | ------------------------------------ | ----------- |
| **Primitive** | Core algorithm, minimal overhead       | `Vector2.add(a, b, out)`             | Yes         |
| **Hot Path**  | Pre-computed variant for tight loops   | `Vector2.rotateCS(v, cos, sin, out)` | Yes         |
| **Facade**    | DX convenience delegating to primitive | `instance.add(other)` → static       | Usually not |

### When to add a \*CS variant

Add `*CS` when:

1. The method internally computes sin/cos from an angle
2. The method is likely called in a loop with the same angle
3. The sin/cos computation is a measurable fraction of the method's cost

Currently applied to: `Vector2.rotateCS`, `Vector2.rotateAroundCS`
Could extend to: Any future rotation-consuming method

### When a facade is justified

A facade is justified when:

1. It improves DX without measurable performance impact
2. The delegation is a single function call (V8 inlineable)
3. There's a clear "canonical owner" for the logic

---

## 8.4 Hot Path Policy

### `out` Parameter

**Rule:** Always last, always optional, always typed as the concrete return type.

```typescript
static add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2): Vector2
```

**Usage pattern:**

```typescript
// Allocation-free loop
const temp = new Vector2();
for (const v of vectors) {
 Vector2.add(v, offset, temp);
 // use temp...
}
```

### \*CS Variants

**Rule:** Provide when angle → sin/cos is computed inside AND the method is loop-candidate.

**Breakeven point:** Not quantified (benchmark pending, task 14.3). Based on analysis:

- sin/cos from deterministic kernels: ~100-200ns each
- A loop of 100+ calls with the same angle benefits from pre-computing

### Allocation Strategy

- Static methods with `out`: zero allocation in hot path
- Instance methods: always allocate `this` (one-time), then mutate
- `SinCos` interface: use `out` parameter to avoid object creation

---

## 8.5 Determinism Policy

### Default Configuration

| Function Category                              | Default Source                      | Toggle Available?          |
| ---------------------------------------------- | ----------------------------------- | -------------------------- |
| sin, cos, tan, asin, acos, atan, atan2         | fdlibm kernels                      | Yes (config.useNativeMath) |
| exp, log, pow                                  | fdlibm kernels                      | Yes                        |
| sqrt                                           | **Math.sqrt** (change from custom)  | No (always IEEE 754)       |
| abs, floor, ceil, trunc, round, sign, min, max | Math.\*                             | No (always IEEE 754)       |
| hypot                                          | Custom (avoid Math.hypot variation) | Yes                        |

### Rule: Only wrap non-IEEE-754-required operations

IEEE 754-2019 Section 5.4.1 required operations are deterministic by standard. Don't wrap them.
IEEE 754-2019 Section 9.2 recommended operations are NOT guaranteed deterministic. Wrap these.

### config.useNativeMath Behavior

- `false` (default): All trig/exp/log use fdlibm kernels. Cross-platform deterministic.
- `true`: Delegates to Math.\*. Faster but may differ between V8/SpiderMonkey/JSC.

**Future consideration:** Immutable-after-init pattern or build-time selection to avoid Web Worker issues.

---

## 8.6 Tolerance Policy

### Tolerance Categories

| Category  | Constant                        | Value | Used For                                     |
| --------- | ------------------------------- | ----- | -------------------------------------------- |
| Geometric | EPSILON                         | 1e-10 | nearEquals, isNearZero, comparison functions |
| Safety    | MIN_SAFE_DIVISOR (= EPSILON)    | 1e-10 | divideSafe, reciprocalSafe                   |
| Angular   | **EPSILON** (not ANGLE_EPSILON) | 1e-10 | anglesNearEqual, all angle comparisons       |
| Iterative | ITERATIVE_TOLERANCE             | 1e-6  | Future constraint solver                     |

### Decision: Deprecate ANGLE_EPSILON

ANGLE_EPSILON (1e-12) is defined but has zero consumers. All angular comparisons use EPSILON (1e-10). Options:

1. **Remove ANGLE_EPSILON** — simplest, eliminates confusion
2. **Integrate into anglesNearEqual** — use it where intended

**Decision:** Remove. A single EPSILON for all comparisons is simpler and matches the codebase's actual behavior. If tighter angular tolerance is needed in the future, it can be passed as a parameter.

### When configurable vs hardcoded

| Approach            | When                                                             |
| ------------------- | ---------------------------------------------------------------- |
| Hardcoded (EPSILON) | Default tolerance for all comparison functions                   |
| Parameter (`eps?`)  | When caller needs custom tolerance (nearEquals, anglesNearEqual) |
| Never configurable  | MIN_SAFE_DIVISOR (safety critical, should not be loosened)       |

---

## 8.7 Composition and Delegation Policy

### When to compose vs reimplement

| Scenario                                        | Decision               | Rationale                   |
| ----------------------------------------------- | ---------------------- | --------------------------- |
| Function A uses function B's exact algorithm    | Compose (call B)       | DRY, single source of truth |
| Function A uses a subset of B's algorithm       | Reimplement            | Avoid unnecessary work      |
| Function A is in a hot path and B adds overhead | Reimplement (inline)   | Performance                 |
| Function A and B are in different layers        | Compose (call through) | Layer separation            |

### When a facade is justified

A facade delegates from type A to type B's implementation:

- **Justified:** `instance.add(other)` → `Static.add(this, other, this)` — DX improvement, zero cost
- **Justified:** `numeric/sqrtSafe` re-exports `deterministic/sqrtSafe` — convenience import
- **Not justified:** Duplicating implementation across types for minor signature differences

### Inter-type facade cost-benefit

| Facade                    | Owner          | Cost             | DX Value                    | Keep? |
| ------------------------- | -------------- | ---------------- | --------------------------- | ----- |
| Instance methods → static | Same type      | 1 call (inlined) | High (fluent chaining)      | Yes   |
| numeric/safe re-exports   | deterministic/ | 0 (re-export)    | Medium (import convenience) | Yes   |
| normalizeRadians → loop   | scalar/        | 1 call (inlined) | High (semantic naming)      | Yes   |
