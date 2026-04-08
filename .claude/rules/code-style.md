---
paths:
 - '**/*.ts'
---

# Code Style

## Prettier (auto-enforced via pre-commit hook)

```json
{
 "semi": true,
 "singleQuote": true,
 "trailingComma": "all",
 "printWidth": 100,
 "tabWidth": 1
}
```

When writing code: single quotes, semicolons, trailing commas in multiline, 1-space indentation, 100-char line width.

## Import Ordering (ESLint `import/order`)

Group imports with blank lines between groups, alphabetical within each:

1. **Type imports** — `import type { ReadonlyVector2Like } from '../types'`
2. **Deterministic** — `import { sin, cos } from '../deterministic/deterministic-kernels'`
3. **Auxiliary** — `import { clamp, lerp } from '../auxiliary/scalar/arithmetic'`
4. **Core** — `import { Vector2 } from '../core/vector2'`
5. **Validation** — `import { assertFinite } from '../validation/assert'`

Use `import type` for type-only imports (enforced by TypeScript).

## File Naming

- All `.ts` files use **kebab-case** (ESLint `unicorn/filename-case`)
- Good: `angle-operations.ts`, `deterministic-kernels.ts`
- Bad: `angleOperations.ts`, `AngleOperations.ts`

## No Default Exports

All modules use named exports exclusively. Never `export default`.

## Class Member Ordering (ESLint `@typescript-eslint/member-ordering`)

Follows the ordering defined in `tsdoc-conventions.md` (all source files use this):

```
Group 1 (declarations — must precede all instance methods):
1. Private helpers (ensureOut, normalizeComponents)
2. Public static readonly fields (constants: ZERO, ONE, IDENTITY)
3. Public static factories (from*)
4. Public static methods (arithmetic, transform, computed, comparison)
5. Public instance properties (x, y, cos, sin, etc.)
6. Constructor

Group 2 (instance members):
7. Instance mutators (arithmetic, transform, normalization)
8. Instance accessors (getters, computed properties)
9. Instance conversion (to*, clone, copy, equals)
```

## Conventional Commits

Format: `type(scope): description`

Common types: `feat`, `fix`, `docs`, `refactor`, `test`, `perf`, `chore`

Scope: `math2d` for math package, `common` for common, `docs` for documentation, `build` for build system.

Examples:

- `feat(math2d): add AABB type with intersection support`
- `fix(math2d): handle near-zero denominator in Complex.divide`
- `docs(math2d): update architecture deep-dive with DCE policy`

Breaking changes use `!`: `feat(math2d)!: rename scale() to multiplyScalar()`

## Section Divider Comments

Core classes use banner comments to separate logical sections:

```typescript
/* ========================================================================== */
/* Static Factories                                                           */
/* ========================================================================== */
```

Maintain these when adding methods to existing classes.
