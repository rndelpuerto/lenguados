# Phase 2 - API Design: Support Layers (Tasks 11.1-11.5)

## 11.1 deterministic/ — Definitive API

### Exported Functions (17, reduced from 18)

| Function        | Status     | Notes                                                         |
| --------------- | ---------- | ------------------------------------------------------------- |
| sin(x)          | Keep       | fdlibm kernel. Redefine: improve range reduction              |
| cos(x)          | Keep       | fdlibm kernel. Same range reduction fix                       |
| sinCos(x, out?) | Redefine   | Add `out` parameter for allocation-free hot paths             |
| tan(x)          | Keep       | sin/cos ratio                                                 |
| atan(x)         | Keep       | fdlibm kernel, good match                                     |
| atan2(y, x)     | Keep       | fdlibm kernel, good match                                     |
| acos(x)         | Keep       | Identity via atan2                                            |
| asin(x)         | Keep       | Identity via atan2                                            |
| acosSafe(x)     | Keep       | Clamp + delegate                                              |
| asinSafe(x)     | Keep       | Clamp + delegate                                              |
| log(x)          | Keep       | fdlibm kernel. Fix shared buffer concern                      |
| logSafe(x)      | Keep       | Internal                                                      |
| exp(x)          | Keep       | fdlibm kernel. Fix fragile 2^k scaling                        |
| expSafe(x)      | Keep       | Redefine: NaN→0 instead of NaN→1                              |
| pow(b, e)       | Keep       | Simplify; document precision limitation                       |
| hypot(x, y)     | Keep       | Custom (avoid Math.hypot variation). Use Math.sqrt internally |
| **sqrt(x)**     | **Remove** | Unnecessary. IEEE 754 required op. Use Math.sqrt              |
| **sqrtSafe(x)** | **Move**   | Move to numeric/safety: `x <= 0 ? 0 : Math.sqrt(x)`           |

### Other Exports

| Export                  | Status   | Notes                                                 |
| ----------------------- | -------- | ----------------------------------------------------- |
| config.useNativeMath    | Redefine | Consider immutable-after-init or build-time selection |
| DeterministicKernels    | Keep     | Convenient bag object                                 |
| SinCos type (re-export) | Keep     | From angle/operations                                 |

### Scope Boundary

deterministic/ provides ONLY cross-platform deterministic math kernels. It does NOT provide:

- Compensated arithmetic (that's numeric/)
- Safe wrappers (those go in numeric/safety)
- Angular operations (those go in angle/)
- Constants (those come from scalar/constants)

---

## 11.2 types/ — Definitive API

### Interface Pairs (7, no changes)

All 7 pairs confirmed. Clean duck-typing pattern.

### Type Guards (7, no changes)

All 7 guards confirmed. Structural checks only (no value validation).

### Re-Export Consistency

**Decision:** All 7 core types should re-export their type guard from types/.
Currently only 3/7 do. Add re-exports for: Rotation2, Complex, Interval, Transform2.

---

## 11.3 validation/ — Definitive API

### Functions (22, no changes to function set)

All 22 assertion functions confirmed. Coverage is complete for all 7 types.

### Improvements

| Improvement     | Detail                                                                     |
| --------------- | -------------------------------------------------------------------------- |
| Error messages  | Add Safe variant suggestion: "Consider using divideSafe for safe handling" |
| assertRotation2 | Keep NOT checking unit constraint (too expensive per call)                 |
| DCE mechanism   | Keep process.env.NODE_ENV pattern                                          |
| Runtime toggle  | Keep setAssertionsEnabled/areAssertionsEnabled                             |

### Validation Boundary

Assertions are used ONLY in core/ constructors and setters. auxiliary/ functions do NOT use assertions. This is intentional:

- Core types are the "trust boundary" — data entering core is validated
- Auxiliary functions are internal primitives trusted by core types
- This keeps hot-path auxiliary calls fast

### Conditional Exports

The package.json already has `development` vs `default` export conditions for validation/assert. Production builds use the empty/no-op version. This is correct.

---

## 11.4 utils/ — Definitive API

### parse.ts (14 functions, no changes)

7 parse + 7 format functions. Complete coverage. Flexible format support.

### random-source.ts

| Entity                     | Status   | Notes                              |
| -------------------------- | -------- | ---------------------------------- |
| RandomSource interface     | Keep     | Clean abstraction                  |
| MathRandomSource           | Keep     |                                    |
| SeededRandomSource         | Keep     | Park-Miller LCG                    |
| defaultRandomSource        | Redefine | Consider freeze-after-init pattern |
| get/setDefaultRandomSource | Keep     |                                    |

### random.ts (18 functions, no changes)

All 18 random generation functions confirmed. Good deterministic kernel usage.

### performance.ts

| Entity       | Status                 | Notes                                                   |
| ------------ | ---------------------- | ------------------------------------------------------- |
| All entities | Keep (migrate in v2.0) | Already documented for migration to @lenguados/devtools |

### Import Paths

utils/ functions are NOT in the main `export *` surface. They're accessible via:

- Direct import: `import { parseVector2 } from '@lenguados/math2d/utils/parse'`
- Or re-export: some are re-exported from index.ts (validation is, parse/random/perf are not)

**Decision:** Keep utils/ functions as secondary imports. They're utility, not core.

---

## 11.5 index.ts — Definitive API

### Export Strategy

| Category           | Strategy               | Via              |
| ------------------ | ---------------------- | ---------------- |
| types/             | `export *`             | Barrel           |
| auxiliary/scalar/  | `export *`             | Barrel           |
| auxiliary/angle/   | `export *`             | Barrel           |
| auxiliary/numeric/ | `export *`             | Barrel           |
| core/              | `export *`             | Barrel           |
| deterministic/     | Named exports          | Explicit list    |
| validation/        | Named exports          | Explicit list    |
| utils/parse        | NOT exported from main | Secondary import |
| utils/random       | NOT exported from main | Secondary import |
| utils/performance  | NOT exported from main | Secondary import |

### Naming Conflict Resolution

| Conflict                                                   | Resolution                                                                                                                                                                                               |
| ---------------------------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| sinCos (deterministic/ and angle/)                         | Verify: are both exported? If so, the named export from deterministic/ takes precedence via `export { sinCos } from './deterministic/...'`. The `export *` from angle/ would be shadowed. Document this. |
| sqrtSafe (deterministic/ named and numeric/ via export \*) | After removing deterministic/sqrt, sqrtSafe moves to numeric/safety only. Conflict resolved.                                                                                                             |

### Missing Export

Add `ReadonlyRotation2` to core/index.ts exports when the type alias is created.
