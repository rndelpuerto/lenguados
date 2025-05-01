# @lenguados/math2d

## Table of Contents

- [Description](#description)
- [Installation](#installation)
- [Scripts](#scripts)
- [API](#api)
- [Examples](#examples)
- [Full Spec](#full-spec)
- [Changelog](#changelog)

> Core 2-D math utilities for the Lenguado physics-engine family.

---

## Description

`@lenguados/math2d` provides a high-performance, fully-typed TypeScript toolkit of fundamental math building-blocks used throughout the Lenguado physics-engine family:

- **Constants**: π, τ, EPSILON, degree↔radian factors.
- **Scalar utilities**: clamp, sign, lerp, normalize, smoothStep, epsilonEquals, relativeEquals, saturate.
- **(Future modules)**: vectors, matrices, transforms, convex-hull, raycasting, pooling.

---

## Installation

```bash
npm install --save @lenguados/math2d
# or
yarn add @lenguados/math2d
```

---

## Scripts

> Follow the [general scripts usage guide](https://github.com/rndelpuerto/lenguados/blob/main/docs/guide/scripts-usage.md) for configuration and how-tos.

---

## API

All exports are available as **named** exports from the package root:

```ts
import {
 PI,
 HALF_PI,
 TAU,
 DEG2RAD,
 RAD2DEG,
 EPSILON,
 clamp,
 sign,
 lerp,
 normalize,
 smoothStep,
 epsilonEquals,
 relativeEquals,
 saturate,
} from '@lenguados/math2d';
```

---

## Examples

### Scalar constants

```ts
import { PI, TAU, DEG2RAD } from '@lenguados/math2d';

console.log(`π = ${PI}`);
console.log(`Full circle (τ) = ${TAU}`);
console.log(`90° in radians = ${90 * DEG2RAD}`);
```

### Interpolation

```ts
import { clamp, lerp, smoothStep } from '@lenguados/math2d';

const t = 1.2;

console.log(clamp(t, 0, 1)); // 1
console.log(lerp(10, 20, 0.5)); // 15
console.log(smoothStep(0, 1, 0.5)); // ≈ 0.5
```

### Normalize

```ts
import { normalize } from '@lenguados/math2d';

console.log(normalize(5, 0, 10)); // → 0.5
console.log(normalize(-5, 0, 10)); // → 0
console.log(normalize(15, 0, 10)); // → 1
```

### Fuzzy comparison

```ts
import { epsilonEquals, relativeEquals, EPSILON } from '@lenguados/math2d';

// Absolute comparison with EPSILON
const a = 0.1 + 0.2;
const b = 0.3;

console.log(epsilonEquals(a, b)); // true

// Relative comparison: allows 1% difference on 100 → threshold = 1
console.log(relativeEquals(100, 100.5, 0.01)); // → true
console.log(relativeEquals(100, 102, 0.01)); // → false
```

---

## Full Spec

| Export               | Type     | Description                                                             |
| -------------------- | -------- | ----------------------------------------------------------------------- |
| **PI**               | `number` | π (`Math.PI`).                                                          |
| **HALF_PI**          | `number` | π/2.                                                                    |
| **TAU**              | `number` | 2π.                                                                     |
| **DEG2RAD**          | `number` | π/180.                                                                  |
| **RAD2DEG**          | `number` | 180/π.                                                                  |
| **EPSILON**          | `number` | Small tolerance for float comparisons.                                  |
| **clamp()**          | `fn`     | Clamp value to [min, max].                                              |
| **sign()**           | `fn`     | Returns -1, 0, or +1.                                                   |
| **lerp()**           | `fn`     | Linear interpolation.                                                   |
| **normalize()**      | `fn`     | Linear map and clamp from [min, max] to [0, 1].                         |
| **smoothStep()**     | `fn`     | Smoothstep interpolation with zero derivatives at boundaries.           |
| **epsilonEquals()**  | `fn`     | Absolute-difference float comparison.                                   |
| **relativeEquals()** | `fn`     | Relative-tolerance float comparison (scaled by `max(1, \|x\|, \|y\|)`). |
| **saturate()**       | `fn`     | Clamp to [0, 1].                                                        |

_(Additional modules: Vector2, Mat2, Mat3, Transform, Geometry, Raycast, etc., will be added in subsequent releases.)_

---

## Changelog

All notable changes to this package are documented in [CHANGELOG.md](../../_media/CHANGELOG.md).  
Version numbering follows [SemVer](https://semver.org/).

## Modules

- [index.ts](index.ts/index.md)
- [math2d/scalar](math2d/scalar/index.md)
