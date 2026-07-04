# @lenguados/math2d

[![npm version](https://img.shields.io/npm/v/@lenguados/math2d.svg)](https://www.npmjs.com/package/@lenguados/math2d)
[![Bundle Size](https://img.shields.io/bundlephobia/minzip/@lenguados/math2d)](https://bundlephobia.com/package/@lenguados/math2d)
[![TypeScript](https://img.shields.io/badge/TypeScript-strict-blue.svg)](https://www.typescriptlang.org/)

> Core 2D math utilities for the Lenguado physics-engine family.

High-performance, fully-typed TypeScript math primitives with **cross-platform determinism** (fdlibm-based kernels), **zero-allocation** hot-path patterns, and **development-only validation** (assertions are eliminated at the library build step; conditional exports select the production build).

## Highlights

- **7 core types** -- Vector2, Rotation2, Complex, Interval, Matrix2, Matrix3, Transform2
- **Deterministic math** -- bit-exact sin/cos/atan2/exp/log across all JS engines via fdlibm polynomial kernels
- **Allocation control** -- static methods with `out` parameter for GC-free hot paths
- **Strict/Safe/Unchecked triality** -- three error-handling tiers per fallible operation
- **Rich auxiliary layer** -- scalar, angle, and numeric utilities (clamp, lerp, sinCos, nearEquals, and 100+ more)

## Installation

```bash
npm install @lenguados/math2d
```

## Quick Start

```typescript
import { Vector2, Transform2, DEG_TO_RAD, sinCos } from '@lenguados/math2d';

// --- Static methods are pure; instance methods mutate `this` ---
const position = Vector2.fromValues(10, 20);
const velocity = Vector2.fromValues(3, 4);

// Allocation-free: reuse `position` as output
Vector2.add(position, velocity, position);

// Fluent instance chaining
position.add(velocity).multiplyScalar(0.5);

// --- Rotation via decomposed transform (Scale -> Rotate -> Translate) ---
const transform = Transform2.fromValues(5, 10, 45 * DEG_TO_RAD, 1, 1);
const worldPoint = Transform2.transformPoint(transform, position);

// --- Pre-computed cos/sin for hot loops ---
const { cos, sin } = sinCos(45 * DEG_TO_RAD);
const rotated = Vector2.fromValues(1, 0);
rotated.rotateCS(cos, sin);
```

## API Overview

All exports are **named**. Core types, the auxiliary layer, the deterministic kernels, and validation are imported from the package root; the utilities are imported from dedicated subpaths (see the Utilities table below).

### Core Types

| Type         | Description                                                                                                             |
| ------------ | ----------------------------------------------------------------------------------------------------------------------- |
| `Vector2`    | Mutable, chainable 2D vector with static pure helpers                                                                   |
| `Rotation2`  | Unit-complex rotation (cos, sin) with CS variants for hot paths and closest-rotation factory (`fromMatrix2Closest`)     |
| `Complex`    | Full complex arithmetic (exp, log, polar, slerp)                                                                        |
| `Interval`   | Closed interval [min, max] arithmetic and set operations                                                                |
| `Matrix2`    | 2x2 column-major matrix: arithmetic, decompositions (SVD, polar, eigen, pseudo-inverse), condition number, solve, shear |
| `Matrix3`    | 3x3 affine matrix for 2D coordinate transforms                                                                          |
| `Transform2` | Decomposed SRT (Scale -> Rotate -> Translate) transform                                                                 |

Each type includes: `Readonly*` alias, `freeze*()` function, `is*Like()` guard, and `*Like` / `Readonly*Like` structural interfaces.

### Auxiliary Layer

| Module        | Key Exports                                                                                                                                      |
| ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| **Scalar**    | `clamp`, `lerp`, `smoothStep`, `nearEquals`, `inverseLerp`, `sign`, `saturate`, `mod`, `floorDivide`, `loop`, `step`                             |
| **Angle**     | `sinCos`, `degreesToRadians`, `normalizeRadians`, `angleDifference`, `lerpAngle`, `angleBisector`, `AngleUnwrapper`                              |
| **Numeric**   | `divideSafe`, `reciprocalSafe`, `sqrtSafe`, `acosSafe`, `asinSafe`, `expSafe`, `logSafe`, `powSafe`, `robustSum`, `neumaierSum`, `roundToPlaces` |
| **Constants** | `PI`, `TAU`, `HALF_PI`, `DEG_TO_RAD`, `RAD_TO_DEG`, `EPSILON`, `MIN_SAFE_DIVISOR`, `SQRT_2`                                                      |

The Numeric row lists Layer 1 safety-wrappers over the Layer 0 deterministic kernels (shown in the Deterministic Kernels row below). Each `*Safe` entry substitutes a neutral fallback (`0`, `1`, identity) for IEEE 754 domain violations that would otherwise propagate as `NaN` or `Infinity`. These wrappers do not throw and do not have `*Unchecked` siblings — the raw kernel itself is the "no-guard" form. The full strict / Safe / Unchecked triality applies wherever a strict variant throws on invalid input: the Core-type operations (for example `Vector2.normalize`, `Matrix2.inverse`) and a small set of restricted-domain scalar operations (`mod`, `inverseLerp`, `loop`, `floorDivide`). The total IEEE 754 kernels themselves carry no triality.

### Deterministic Kernels

| Export                          | Description                                                  |
| ------------------------------- | ------------------------------------------------------------ |
| `sin`, `cos`, `tan`             | fdlibm-based trigonometry (L0 bit-exact)                     |
| `asin`, `acos`, `atan`, `atan2` | Inverse trig (pure IEEE 754 kernels)                         |
| `exp`, `log`, `pow`             | Exponential/logarithmic (pure IEEE 754 kernels)              |
| `sinCos`, `hypot`               | Combined/utility functions                                   |
| `config`                        | `config.useNativeMath` toggle for determinism vs performance |

The `sinCos` exported from the package root is the auxiliary (angle-layer) wrapper over the L0 kernel — same `(angle, out?)` signature, delegating to the deterministic implementation. It is the same symbol listed in the Angle row above.

### Validation

| Export                                                   | Description                           |
| -------------------------------------------------------- | ------------------------------------- |
| `setAssertionsEnabled` / `areAssertionsEnabled`          | Control assertion behavior at runtime |
| `assert`, `assertFinite`, `assertNonZero`, `assertRange` | Scalar assertions                     |
| `assertVector2`, `assertMatrix2`, `assertRotation2`, ... | Per-type structural assertions        |

Assertions are development-only: they are eliminated at the library build step, and conditional exports select the production build.

### Utilities

| Export                                                                   | Import Path                             | Description                       |
| ------------------------------------------------------------------------ | --------------------------------------- | --------------------------------- |
| `randomVector2`, `randomUnitVector2`, `randomOnCircle`, `randomInCircle` | `@lenguados/math2d/utils/random`        | Random generation                 |
| `SeededRandomSource`                                                     | `@lenguados/math2d/utils/random-source` | Deterministic PRNG (xoshiro128++) |
| `parseVector2`, `formatVector2`, ...                                     | `@lenguados/math2d/utils/parse`         | Serialization/parsing per type    |

```typescript
import { randomVector2 } from '@lenguados/math2d/utils/random';
import { SeededRandomSource } from '@lenguados/math2d/utils/random-source';
import { parseVector2 } from '@lenguados/math2d/utils/parse';
```

## Key Concepts

### Triality (Strict / Safe / Unchecked)

Every fallible operation follows the triality pattern. `normalize()` throws on zero-length vectors. `normalizeSafe()` returns a fallback (zero vector). `normalizeUnchecked()` skips validation for hot paths where the caller guarantees valid input.

### Out Parameter

Static methods accept an optional `out` parameter as the last argument to write results into an existing object, avoiding heap allocations. Instance methods mutate `this` and return `this` for chaining.

### CS Variants

Methods ending in `CS` accept pre-computed cosine and sine values. Use `sinCos(angle)` once, then call `rotateCS(cos, sin)` on many vectors to avoid redundant trig in tight loops.

### Apply vs Transform

`apply` is used for operators acting on operands (e.g., `Rotation2.apply(rotation, vector)`). `transform` is used for spatial coordinate transformations (e.g., `Matrix3.transformPoint(matrix, point)`).

## Performance Tips

```typescript
// 1. Reuse objects with `out` parameter
const temp = new Vector2();
for (const entity of entities) {
 Vector2.add(entity.position, entity.velocity, temp); // no allocation
 entity.position.copy(temp);
}

// 2. Pre-compute cos/sin for batch rotations
const { cos, sin } = sinCos(angle);
for (const v of vertices) {
 v.rotateCS(cos, sin); // avoids trig per vertex
}

// 3. Use Unchecked in validated hot paths
for (const v of validatedVectors) {
 v.normalizeUnchecked(); // caller guarantees non-zero magnitude
}
```

## Math Conventions

- Angles in **radians**, **CCW positive**, **Y-up** coordinate system
- **Column-major** matrices, column-vector convention (`v' = M * v`)
- Transform order: **Scale -> Rotate -> Translate**
- Tolerance: `EPSILON = 1e-10`

## Documentation

- [Architecture](https://github.com/rndelpuerto/lenguados/blob/main/packages/math2d/ARCHITECTURE.md) -- layered design and dependency rules
- [Contributing](https://github.com/rndelpuerto/lenguados/blob/main/CONTRIBUTING.md) -- setup, workflow, API conventions
- [TSDoc Standard](https://github.com/rndelpuerto/lenguados/blob/main/TSDOC_STANDARD.md) -- canonical tag order, templates
- [Changelog](https://github.com/rndelpuerto/lenguados/blob/main/packages/math2d/CHANGELOG.md) -- version history
- [Full Documentation](https://rndelpuerto.github.io/lenguados/docs/) -- docs site with deep-dives, design decisions, and API reference

## License

[Apache License 2.0](https://github.com/rndelpuerto/lenguados/blob/main/LICENSE)
