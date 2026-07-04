# Contributing to @lenguados/math2d

> **Scope:** package-specific conventions for contributions to `@lenguados/math2d`.

This guide extends the monorepo-wide [CONTRIBUTING.md](../../CONTRIBUTING.md) with conventions specific to `@lenguados/math2d`. Read the root guide first for prerequisites, workflow, commit format, and general standards. This document focuses on what is unique about contributing math code.

---

## 1. Package Identity — The Boundary Test

`@lenguados/math2d` is the **core mathematics package** of the engine. Its API is domain-agnostic and must be comprehensive — if an operation is mathematically well-defined on the types provided, it belongs here. Domain-specific algorithms (collision, dynamics, rendering, pathfinding) belong in other packages.

Before adding **any** new method, constant, or type, apply the four-check verification in this order. All four MUST pass.

### Check 1 — Pure math reference presence

Evaluate the operation's presence in three tiers of numerical references:

- **Tier A (pure mathematics):** peer-reviewed linear-algebra implementations, scientific computing platforms, and graduate-level mathematical reference works that define the mathematical canon.
- **Tier B (general-purpose math and graphics):** shader math conventions (GLSL, HLSL), language standard numerics modules, and general graphics programming references.
- **Tier C (game and rendering engines):** domain-specific engine implementations that include many non-math operations tied to rendering or physics simulation.

**Rule:** if the operation is present in **zero** Tier A references, it requires strong justification from Checks 2–4. Tier B presence alone is insufficient — many Tier B references mirror shader built-ins that are rendering conventions, not pure math. Tier C presence is almost always indicative of a domain-specific operation that does NOT belong here.

### Check 2 — Mathematical standard or domain convention?

- **IEEE 754 operations** (`floor`, `ceil`, `round`, `trunc`, `abs`, `sqrt`, `sign`): always belong.
- **Standard linear algebra** (dot, cross, determinant, eigenvalue, SVD, norm): always belong.
- **GLSL / HLSL conventions** (`fract`, `mix`, `step`, `smoothStep`): evaluate individually. Some (`step`, `smoothStep`) are mathematical primitives. Others may be shader conventions with narrow value.
- **Game engine patterns** (`moveTowards`, `lookAt`, `slerp` on non-rotation types): usually domain-specific.

### Check 3 — Internal building block test

Does the method enable other methods within the package through composition or hot-path reuse?

- **YES:** `dot` enables `project`, `reject`, `reflect`, `angleBetween`. `cross` enables orientation tests. `sinCos` enables all `*CS` variants.
- **NO:** a method only consumed externally with zero internal synergy is a weaker candidate.

### Check 4 — Composition triviality

If the operation is composable from existing API in **one expression** (single line, no temporaries), it generally does NOT warrant a dedicated method unless:

- It appears in 4+ Tier A references (industry consensus overrides triviality).
- It is a hot-path operation where the composition has measurable overhead.
- The composition is non-obvious (the naive attempt would be incorrect).

---

## 2. Quality Bar for math2d Contributions

Every contribution MUST satisfy:

### 2.1 Numerical correctness

- **Deterministic kernels:** all transcendental functions (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`, `hypot`, `sinh`, `cosh`, `tanh`) MUST import from `deterministic-kernels.ts`, never from `Math`.
- **`Math.sqrt` direct:** IEEE 754-required; use directly.
- **`hypot` vs. `sqrt` convention:** default and Safe tiers use `hypot` (overflow-safe — finite for any representable magnitude up to `Number.MAX_VALUE` $\approx 1.80 \times 10^{308}$). Unchecked tier uses `Math.sqrt(x*x + y*y)`, whose squared intermediate overflows once a single component exceeds $\sqrt{\mathtt{Number.MAX\_VALUE}} \approx 1.34 \times 10^{154}$ (faster; caller owns overflow).
- **No NaN masking:** pass NaN through arithmetic; never convert NaN to a concrete value inside math code.

### 2.2 Constructor purity (ADR-007)

Constructors MUST be pure assignment. No `assertFinite`, no `assertIsNumber`, no dev-only guards. NaN and Infinity are valid IEEE 754 values in the math layer. Validation belongs in `set`, `fromValues`, and assertion functions — not in constructors.

### 2.3 Assertion NaN rejection (ADR-008)

Every assertion that guards a numeric range MUST include the NaN trap:

```typescript
// CORRECT
if (value !== value || value <= 0) throw new Error(...);

// WRONG — NaN silently passes (NaN <= 0 is false in IEEE 754)
if (value <= 0) throw new Error(...);
```

### 2.4 Triality pattern for fallible operations

Every fallible operation MUST expose three variants:

- `op()` — strict, throws on invalid input.
- `opSafe()` — returns neutral fallback, never throws.
- `opUnchecked()` — no validation, caller owns correctness.

See [DESIGN_PHILOSOPHY.md](DESIGN_PHILOSOPHY.md) §3.2 for the branch-prediction rationale behind intentional code duplication across tiers.

### 2.5 TSDoc coverage

Every public export MUST follow the canonical TSDoc template set in [TSDOC_STANDARD.md](TSDOC_STANDARD.md). Non-negotiables:

- Present-tense 3rd-person summary, no trailing period on sentence fragments.
- `@param` uses hyphen separator, no inline types.
- `@see` cross-links between triality variants (strict ↔ Safe ↔ Unchecked).
- `@category` from the controlled vocabulary; `@since` matching next release version.

### 2.6 Test coverage

- **Mandatory:** Jest unit tests with concrete expected results.
- **Mandatory for composite types:** property-based tests (fast-check) verifying algebraic invariants (closure, commutativity, associativity, identity, inverse, idempotence, round-trip).
- **Mandatory for Unchecked variants:** dangerous-path tests asserting GIGO behavior (NaN / Infinity propagation), never error emission.
- **Mandatory for magnitude operations:** overflow-boundary tests above the naive-overflow threshold ($\sqrt{\mathtt{Number.MAX\_VALUE}} \approx 1.34 \times 10^{154}$ for a single component; $\approx 9.5 \times 10^{153}$ when both components are comparable) to verify `hypot` usage in default / Safe tiers.

Coverage thresholds (enforced): 90% lines / statements / functions, 80% branches.

See [TESTING_STRATEGY.md](TESTING_STRATEGY.md) for the full test topology.

---

## 3. Adding a New Math Type — Checklist

When adding a new type to `core/` (for example `Complex3`, `Quaternion2D`, `Dual`, etc.):

1. **Boundary test** — apply the four checks in §1. Document justification in the PR description.
2. **ADR entry** — add an ADR to [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md) if the type introduces a design choice not already covered (layout, mutability convention, etc.).
3. **Layer placement** — put the file in `src/core/`. Type-only interfaces go in `src/types/`.
4. **Constructor** — pure assignment only (ADR-007).
5. **`setDirect` helper** — if the type stores a normalized invariant (unit length, ordered bounds), add a private `setDirect` alongside `set` (ADR-009).
6. **`*Like` interfaces** — add `TypeLike` (mutable) and `ReadonlyTypeLike` (getters only) in `src/types/index.ts`. Add `isTypeLike` type guard.
7. **`freezeType` helper** — export a freeze helper alongside the class for static constants (`Type.ZERO`, `Type.IDENTITY`).
8. **Triality** — every fallible operation gets `op` / `opSafe` / `opUnchecked`.
9. **`*CS` variants** — if the type uses rotations, expose `*CS` variants following the `(subject, cos, sin, out?)` parameter order.
10. **TSDoc templates** — use [TSDOC_STANDARD.md](TSDOC_STANDARD.md) templates 7 (class), 8 (interface), 9 (constant), 10 (factory), 11 (instance method). Every public export gets `@category` + `@since`.
11. **Tests** — mirror structure at `test/core/type-name.node.spec.ts`. Add arbitraries to `test/arbitraries.ts` (`arbTypeName`, `arbNonZeroTypeName`). Write property-based tests in `test/properties/` covering all algebraic invariants.
12. **Barrel exports** — add the class and its freeze helper to `src/core/index.ts`. Add `*Like` interfaces to `src/types/index.ts`. Add type guard to `src/types/index.ts`. Main barrel (`src/index.ts`) re-exports from each layer.
13. **Docs updates** — add a row to [ARCHITECTURE.md](ARCHITECTURE.md) if the type introduces a new layer concept. If the type needs interop notes, add a section to [INTEROPERABILITY.md](INTEROPERABILITY.md).

---

## 4. What NOT to Add

math2d is domain-agnostic. The following do NOT belong here and will be rejected:

- **Physics concepts** — forces, collisions, rigid bodies, joints, constraints, solvers, simulation loops.
- **High-level geometry** — polygons, meshes, spatial queries, pathfinding, scene graphs.
- **Rendering** — cameras, projections, sprites, draw calls, shader uniforms.
- **Specific algorithms** — SAT, GJK, BVH, quadtrees, spatial hashing.

These concerns belong in other packages that compose on top of math2d.

---

## 5. Quick Reference

| Need                      | Authoritative document                        |
| ------------------------- | --------------------------------------------- |
| General contribution flow | [Root CONTRIBUTING.md](../../CONTRIBUTING.md) |
| Architecture              | [ARCHITECTURE.md](ARCHITECTURE.md)            |
| Philosophy and patterns   | [DESIGN_PHILOSOPHY.md](DESIGN_PHILOSOPHY.md)  |
| ADRs                      | [DESIGN_DECISIONS.md](DESIGN_DECISIONS.md)    |
| TSDoc templates           | [TSDOC_STANDARD.md](TSDOC_STANDARD.md)        |
| Testing patterns          | [TESTING_STRATEGY.md](TESTING_STRATEGY.md)    |
| Edge cases catalogue      | [EDGE_CASES.md](EDGE_CASES.md)                |
| Type interoperability     | [INTEROPERABILITY.md](INTEROPERABILITY.md)    |
| Module exports            | [MODULE_EXPORTS.md](MODULE_EXPORTS.md)        |
