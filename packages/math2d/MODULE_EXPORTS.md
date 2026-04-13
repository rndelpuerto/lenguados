# Module Exports & Internals

> Applies the engine-wide [Module Exports & Internals](../../MODULE_EXPORTS.md) framework to `@lenguados/math2d`. For the classification definitions, decision criteria, and build mechanics, see the general guide.

---

## Classification Map

Every source module in `@lenguados/math2d` is classified using the four options defined in the engine-wide guide:

| Source Module         | Option     | Export Surface                                                                               | Rationale                                                                                                    |
| --------------------- | ---------- | -------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------ |
| `types/`              | Barrel     | Interfaces, type guards (`is*Like`), `SinCos`                                                | Defines the type system. Zero runtime cost.                                                                  |
| `auxiliary/scalar/`   | Barrel     | `clamp`, `lerp`, `EPSILON`, `sign`, `nearEquals`, ...                                        | Fundamental scalar primitives used everywhere.                                                               |
| `auxiliary/angle/`    | Barrel     | `normalizeRadians`, `sinCos`, `lerpAngle`, ...                                               | Fundamental angular operations.                                                                              |
| `auxiliary/numeric/`  | Barrel     | `divideSafe`, `sqrtSafe`, `fract`, `flooredMod`, ...                                         | Production-active safety layer.                                                                              |
| `core/`               | Barrel     | `Vector2`, `Rotation2`, `Complex`, `Interval`, `Matrix2`, `Matrix3`, `Transform2`            | THE core types of the package.                                                                               |
| `deterministic/`      | Barrel     | `sin`, `cos`, `tan`, `atan2`, `exp`, `log`, `pow`, `hypot`, `config`, `DeterministicKernels` | All 14 symbols are fundamental L0 primitives. No subset is "advanced" enough to justify a separate internal. |
| `validation/assert`   | **Hybrid** | Barrel: 17 assertions. Internal: 7 shape guards.                                             | See detailed rationale below.                                                                                |
| `utils/random`        | Internal   | `randomVector2`, `randomInCircle`, `randomRotation2`, ... (17 functions)                     | Testing and procedural generation tooling. Not math core.                                                    |
| `utils/random-source` | Internal   | `RandomSource`, `SeededRandomSource`, `setDefaultRandomSource`, ...                          | PRNG infrastructure. Configuration concern.                                                                  |
| `utils/parse`         | Internal   | `parseVector2`, `formatMatrix3`, ... (14 functions)                                          | I/O serialization. Planned migration to `@lenguados/math2d-io`.                                              |
| `utils/performance`   | Internal   | `measure`, `MeasurementCollector`, ... (9 exports)                                           | Dev benchmarking tooling.                                                                                    |
| `@internal` helpers   | Hidden     | `kernelSin`, `reduceAngle`, `setDirect`, `splitMix32`, `hasNumericProperties`, ...           | Private implementation details.                                                                              |

---

## Hybrid Split: `validation/assert`

The validation module is the only hybrid in the package. A single source file (`validation/assert.ts`) is split into two disjoint export surfaces:

### Barrel (17 symbols)

Operational assertions used alongside math operations:

| Category      | Symbols                                                                                                                                                  | Why barrel                                                                                                         |
| ------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------ |
| Configuration | `setAssertionsEnabled`, `areAssertionsEnabled`                                                                                                           | Controls state read by all barrel assertions. State coherence requires same bundle.                                |
| Scalar        | `assertFinite`, `assertNonZero`, `assertRange`, `assertPositive`, `assertNonNegative`, `assertSafeInteger`                                               | Fundamental numeric validators. 4 of 7 used internally by core types. Co-import natural with `Vector2`, `Matrix3`. |
| Generic       | `assert`                                                                                                                                                 | Base boolean assertion. Used internally by `Rotation2`, `Interval`, `Vector2`.                                     |
| Per-type      | `assertVector2`, `assertMatrix2`, `assertMatrix3`, `assertRotation2`, `assertRotation2Normalized`, `assertComplex`, `assertInterval`, `assertTransform2` | Paired 1:1 with core types. A developer who imports `Vector2` naturally co-imports `assertVector2`.                |

### Internal `./validation/shapes` (7 symbols)

Boundary validation for unknown values:

| Category     | Symbols                                                                                                                                                 | Why internal                                                                                                                                                                                                                                                                              |
| ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Shape guards | `assertVector2Like`, `assertRotation2Like`, `assertMatrix2Like`, `assertMatrix3Like`, `assertComplexLike`, `assertIntervalLike`, `assertTransform2Like` | Accept `unknown`, narrow to `*Like` via TypeScript assertion signatures. Used at system boundaries (JSON, API responses, user input), not in math code. Zero intra-package usage. The subpath `@lenguados/math2d/validation/shapes` communicates intent: "I am validating external data." |

The barrel already exports the non-throwing type guards (`isVector2Like`, etc.) via `types/`. The shape guard assertions are the throwing counterpart, serving a different workflow.

---

## Decision Rationale

### Why `deterministic/` Is Not an Internal

All 14 exported symbols are L0 mathematical primitives: the 12 fdlibm kernels (`sin`, `cos`, ...), the runtime configuration (`config`), and the namespace aggregator (`DeterministicKernels`). There is no subset that serves a "different scenario" from the barrel's primary purpose. A single-symbol internal would add build complexity without consumer benefit. Consumer-side tree-shaking achieves the same bundle isolation.

### Why `utils/` Modules Are Internal-Only

The four `utils/` modules serve use cases **outside the primary math workflow**:

- **`random`**: Testing, procedural content generation. Not a mathematical operation.
- **`random-source`**: PRNG seeding infrastructure. One-time configuration, not math.
- **`parse`**: String serialization and deserialization. An I/O concern, not a mathematical operation. Scheduled for migration to a dedicated `@lenguados/math2d-io` package.
- **`performance`**: Benchmarking and measurement collection. Developer tooling, not math.

None of these pass Test 1 (Identity) or Test 2 (Co-import) from the general classification criteria.

### Why Shape Guards Are Not in the Barrel

The `assert*Like` functions differ from the barrel assertions in three dimensions:

1. **Input type** -- they accept `unknown`, while barrel assertions accept typed numbers or components.
2. **Use case** -- they validate data at system boundaries (deserialization, API responses), not during mathematical computation.
3. **Intra-package usage** -- zero. No module within `@lenguados/math2d` uses them. The core types accept `Readonly*Like` parameters, which are already typed.

The barrel already provides the `is*Like` type guards (non-throwing) for runtime type checking. The shape guard assertions are the throwing development-only counterpart for strict boundary validation.

---

## Import Quick Reference

```typescript
// Barrel — core math operations, types, and operational assertions
import {
 Vector2,
 Matrix3,
 Transform2,
 sin,
 cos,
 config,
 assertFinite,
 assertVector2,
 isVector2Like,
} from '@lenguados/math2d';

// Internal — shape validation at system boundaries
import { assertVector2Like } from '@lenguados/math2d/validation/shapes';

// Internal — random generation for testing
import { randomVector2, randomInCircle } from '@lenguados/math2d/utils/random';
import { SeededRandomSource } from '@lenguados/math2d/utils/random-source';

// Internal — parsing and serialization
import { parseVector2, formatMatrix3 } from '@lenguados/math2d/utils/parse';

// Internal — performance measurement
import { measure, MeasurementCollector } from '@lenguados/math2d/utils/performance';
```
