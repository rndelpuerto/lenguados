---
paths:
 - 'packages/math2d/src/**'
---

# Architecture & Layer Rules

## Layer Dependency Graph (imports flow downward only)

```
Level 0:  deterministic/     (fdlibm kernels, type-only dep on types/)
             ↑
Level 1:  auxiliary/          (scalar, angle, numeric — imports deterministic/, type-only types/)
             ↑
Level 2:  core/               (Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2
                                — imports auxiliary/, deterministic/, types/, validation/)
             ↑
Level 3:  utils/              (parsing, formatting, random, performance
                                — imports core/, auxiliary/, deterministic/, types/, validation/)

types/       → standalone interfaces, no imports from other layers
validation/  → imports types/ only; imported BY core/ and utils/ (cross-cutting concern)
```

**MUST NOT** import upward: auxiliary/ must never import from core/, core/ must never import from utils/.

**Circular dependency avoidance**: When core classes reference each other (e.g., Vector2 ↔ Rotation2), the lower-level class uses `Readonly*Like` interfaces for parameters, not direct class imports.

## Deterministic Functions

**MUST import from `deterministic-kernels.ts`** (not bit-exact across platforms via native Math):
`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`, `hypot`

**Safe to use from `Math.*`** (IEEE 754 required operations, deterministic by standard):
`Math.sqrt`, `Math.floor`, `Math.ceil`, `Math.abs`, `Math.min`, `Math.max`, `Math.round`, `Math.trunc`, `Math.sign`

**Runtime toggle**: `config.useNativeMath = true` switches deterministic kernels to native `Math.*` (4x faster, loses cross-platform bit-exactness). Set once at app startup; never toggle mid-computation.

## L0/L1 Safety Boundary

**L0 Kernel Rule**: `deterministic-kernels.ts` contains ONLY pure deterministic replacements for non-deterministic `Math.*` functions. Each kernel accepts any IEEE 754 double and returns the IEEE 754-specified result (including NaN for domain errors). No clamping, no fallbacks, no `*Safe` variants. This mirrors fdlibm's `e_*.c` kernel files.

**L1 Safety Rule**: ALL domain-clamping, overflow-guarding, and fallback-returning functions live in `auxiliary/numeric/safety.ts`. Named `{fn}Safe`. Import raw kernels from L0 and add guards.

**Safe existence criteria** — a Safe variant exists only when the underlying function has a restricted domain or produces non-finite output for finite input:

| Function                                      | Domain Restriction | Safe Variant | Location                              |
| --------------------------------------------- | ------------------ | ------------ | ------------------------------------- |
| `acos`                                        | [-1, 1]            | `acosSafe`   | safety.ts                             |
| `asin`                                        | [-1, 1]            | `asinSafe`   | safety.ts                             |
| `log`                                         | (0, +inf)          | `logSafe`    | safety.ts                             |
| `exp`                                         | range overflows    | `expSafe`    | safety.ts                             |
| `sqrt`                                        | [0, +inf)          | `sqrtSafe`   | safety.ts (uses IEEE 754 `Math.sqrt`) |
| `pow`                                         | complex edge cases | `powSafe`    | safety.ts                             |
| `sin`, `cos`, `tan`, `atan`, `atan2`, `hypot` | all reals          | none needed  | —                                     |

**DeterministicKernels namespace rule**: Contains exactly the pure L0 kernel functions plus `config`. No Safe variants. No auxiliary-layer functions.

**Naming standard**: `{fn}Safe` suffix. No `Kernel` infix. No `Unsafe` prefix.

## Two-Layer Validation

**Layer 1 — Assertions (dev-only, stripped in production):**

- Guarded by `DEV_MODE` (resolves `process.env.NODE_ENV !== 'production'`)
- Bundlers (Vite, Webpack, Rollup) evaluate to `false` and DCE removes entire blocks
- Naming: `assertFinite(value, 'ClassName.methodName:paramName')`
- Pattern: `/* istanbul ignore next -- DCE */` comment before DEV_MODE guard

**Layer 2 — Safe functions (always active, never stripped):**

- `divideSafe()`, `sqrtSafe()`, `reciprocalSafe()` — return neutral fallback (0, identity)
- These are the production safety net; they must never be wrapped in DEV_MODE guards

## Design Philosophy — Intentional Patterns

**Do NOT refactor these patterns — they are deliberate performance optimizations:**

- **Loop unrolling**: Matrix3.multiply writes all 9 combinations explicitly. Do NOT refactor into a `for` loop. V8 cannot reliably inline nested loops in hot math functions.
- **Code duplication in Safe/Unchecked**: `normalizeSafe()` and `normalizeUnchecked()` duplicate the math from `normalize()`. This eliminates branch prediction misses in hot paths.
- **No `extends` on core classes**: V8 Hidden Classes optimization — inheritance branches the optimization path for ALL instances of the base class. Use composition instead.
- **No dependency injection for math kernels**: `sin`/`cos` are hardcoded imports from `deterministic-kernels.ts`. DI wrappers inside loops destroy inlining. The `config.useNativeMath` toggle handles the switch globally.

## Constructor Purity

Constructors MUST:

- Accept default parameter values (identity/zero state)
- Have NO assertions (NaN/Infinity are valid IEEE 754 values in math layer)
- Include a comment explaining the lack of validation

```typescript
constructor(x: number = 0, y: number = 0) {
 this.x = x;
 this.y = y;
 // Pure math: no assertions — Infinity/NaN are valid IEEE 754 values
}
```

**All 7 core types comply**: Vector2, Rotation2, Complex, Interval (fixed 2026 audit), Matrix2, Matrix3, Transform2 (fixed 2026 post-audit).

**Never add assertions to constructors** — not even `assertFinite`, `assertIsNumber`, or dev-only guards. If a constructor in math2d appears to have an assertion, treat it as a bug to fix, not a pattern to follow.

## Assertion Functions Must Reject NaN

Every assertion function that guards a **numeric range** MUST also reject NaN via the `value !== value` check:

```typescript
// CORRECT — NaN check first, then range check
if (value !== value || value <= 0) {
  throw new Error(`${label}: expected positive, got ${value}`);
}

// WRONG — NaN silently passes (NaN <= 0 is false in IEEE 754)
if (value <= 0) { ... }
if (value === 0) { ... }
if (value < 0) { ... }
```

**Rationale**: NaN is not in any valid numeric range. Silently passing NaN into math that assumes a validated range produces incorrect results downstream without any error signal — worse than throwing.

**Affected functions**: `assertPositive`, `assertNonNegative`, `assertNonZero` (all use range comparisons and must include `value !== value ||`). Functions that check identity (`assertIsFinite`, `assertIsNumber`) use primitives that handle NaN by definition and are not affected.

## Export Patterns

- All modules use **named exports only** — never `export default`
- Barrel files (`index.ts`) re-export in layer order: types → auxiliary → core → deterministic → validation
- `type` imports use `import type { ... }` syntax (enforced by TypeScript `verbatimModuleSyntax`)
