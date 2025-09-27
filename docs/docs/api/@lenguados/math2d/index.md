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
<<<<<<< HEAD
- **Vector2**: mutable, chainable 2‑D vectors with robust numerics, safe variants, and alloc‑free static helpers.
- **Mat2**: 2×2 row‑major matrices (column‑vector convention) with rotation/scale/shear, algebra, inversion & solving.
=======
- **(Future modules)**: vectors, matrices, transforms, convex-hull, raycasting, pooling.
>>>>>>> origin/main

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

<<<<<<< HEAD
### Vectors & Matrices

```ts
import {
 // Vector2 + helpers & types
 Vector2,
 freezeVector2,
 isVector2Like,
 type Vector2Like,
 type ReadonlyVector2Like,
 type ReadonlyVector2,

 // Mat2 + helpers & types
 Mat2,
 freezeMat2,
 isMat2Like,
 type Mat2Like,
 type ReadonlyMat2,
} from '@lenguados/math2d';
```

> **Design notes**
>
> - **Instances mutate and chain** (ergonomic for gameplay code).
> - **Static helpers are pure** and accept optional `out` parameters for **alloc‑free** hot paths:
>
>   ```ts
>   const a = new Vector2(1, 2),
>    b = new Vector2(3, 4),
>    out = new Vector2();
>   Vector2.add(a, b, out); // writes into `out` instead of allocating
>   ```

=======
>>>>>>> origin/main
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

<<<<<<< HEAD
### 2‑D vectors (Vector2)

```ts
import { Vector2 } from '@lenguados/math2d';

// Construct
const p = new Vector2(3, 4);
console.log(p.length()); // 5

// Mutable, chainable instance methods
p.normalize()
 .multiplyScalar(10)
 .rotate(Math.PI / 4);

// Pure static helper with alloc‑free `out`
const a = new Vector2(1, 2);
const b = new Vector2(5, -1);
const sum = Vector2.add(a, b); // → new Vector2(6, 1)
const out = new Vector2();
Vector2.subtract?.Vector2.sub(a, b, out); // (alias isn't provided) // → out = (-4, 3)

// Safe vs throwing variants
const v = new Vector2(1, 1);
v.divideScalarSafe(0); // → (0,0)   (safe)
```

> **Tip:** many operations also exist as _safe_ statics, e.g. `Vector2.divideSafe`, `Vector2.normalizeSafe`, etc.

### 2×2 matrices (Mat2)

```ts
import { Mat2, Vector2 } from '@lenguados/math2d';

// Build a rotation and transform a vector (column vector convention)
const R = Mat2.fromRotation(Math.PI / 2);
const v = new Vector2(1, 0);
const vRot = Mat2.transformVector(R, v); // → (0, 1)

// Compose transforms (mutable & chainable)
const M = new Mat2()
 .setRotation(Math.PI / 3)
 .scale(2, 1)
 .shear(0.1, 0.2);

// Solve A·x = b
const A = new Mat2(2, 1, 1, 3);
const b = new Vector2(5, 7);
const x = Mat2.solve(A, b); // → solution vector
```

> **Conventions:** Matrices are **row‑major** (`m00 m01; m10 m11`) and vectors are treated as **columns** when applying transforms: `v' = M · v`.

=======
>>>>>>> origin/main
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

<<<<<<< HEAD
_(New in this release: **Vector2** and **Mat2**. Additional modules (Mat3, Transform, Geometry, Raycast, etc.) will be added in subsequent releases.)_

### Vector2 (class)

> **Summary:** Mutable, chainable 2‑D vector with comprehensive static helpers (pure, optional `out`) and safe variants. Robust numerics (`Math.hypot`), rich geometry/angle ops, interpolation, constraints, projections/reflections, and Box2D‑style cross products.

**Types & helpers**

- `type Vector2Like = { x: number; y: number }`
- `type ReadonlyVector2Like = { readonly x: number; readonly y: number }`
- `type ReadonlyVector2 = Readonly<Vector2>`
- `freezeVector2(v: Vector2): ReadonlyVector2` – permanently freeze a vector instance.
- `isVector2Like(subject: unknown): subject is ReadonlyVector2Like`

**Static constants**

- `ZERO_VECTOR (0,0)`, `ONE_VECTOR (1,1)`, `NEGATIVE_ONE_VECTOR (-1,-1)`,
  `EPSILON_VECTOR (EPSILON,EPSILON)`, `INFINITY_VECTOR (+∞,+∞)`, `NEGATIVE_INFINITY_VECTOR (-∞,-∞)`,
  `UNIT_X_VECTOR (1,0)`, `UNIT_Y_VECTOR (0,1)`, `NEGATIVE_UNIT_X_VECTOR (-1,0)`, `NEGATIVE_UNIT_Y_VECTOR (0,-1)`,
  `UNIT_DIAGONAL_VECTOR (1/√2,1/√2)`, `NEGATIVE_UNIT_DIAGONAL_VECTOR (-1/√2,-1/√2)`.

**Static API (pure; many accept `out`)**

- **Factories & parsing:** `clone`, `copy`, `fromValues`, `fromArray`, `fromObject`, `fromAngle`, `parse`.
- **Random:** `random` (unit), `randomOnCircle(radius=1)`, `randomInUnitCircle` (uniform area).
- **Component arithmetic:** `sumComponents`, `add`, `addScalar`, `sub`, `subScalar`, `multiply`, `multiplyScalar`, `divide`, `divideScalar`, `divideSafe`, `divideScalarSafe`, `mod`, `modScalar`, `negate`, `addScaledVector`.
- **Interpolation:** `lerp`, `lerpClamped`.
- **Measures & geometry:** `dot`, `cross`, `cross3` (twice signed area of triangle), `length`, `lengthSq`, `manhattanLength`, `distance`, `distanceSq`, `manhattanDistance`.
- **Direction & angles:** `direction(from,to)`, `angle(v)`, `angleTo(a,b)`, `angleBetween(a,b)`.
- **Numeric transforms:** `floor`, `ceil`, `round`, `abs`, `inverse`, `inverseSafe`, `swap`.
- **Constraints:** `clamp(v,min,max)`, `clampScalar`, `clampLength(min,max)`, `limit(maxLength)`, `min(a,b)`, `max(a,b)`.
- **Vector transforms:** `normalize`, `normalizeSafe`, `setLength`, `setLengthSafe`, `setHeading`,
  `project`, `projectOnUnit`, `projectSafe`, `reflect`, `reflectSafe`,
  `perpendicular(clockwise=false)`, `unitPerpendicular`, `unitPerpendicularSafe`,
  `rotate`, `rotateCS`, `rotateAround`, `rotateAroundCS`,
  `midpoint`, `reject`, `crossVS`, `crossSV`.
- **Comparison & validation:** `isZero`, `nearZero`, `equals`, `nearEquals`, `isUnit`, `isFinite`, `isParallel`, `isPerpendicular`.
- **Utilities:** `hashCode(v)` (deterministic 32‑bit uint).

**Instance API (mutable & chainable)**

- **Storage & construction:** fields `x`, `y`. Overloads: `(x,y)`, tuple `[x,y]`, POJO `{x,y}`, copy `Vector2`, or no‑arg `(0,0)`.
- **Swizzles & access:** `getComponent(0|1)`, getters `xy`, `yx`, `xx`, `yy`.
- **Basic mutators:** `set(x,y)`, `setComponent(0|1,val)`, `setX`, `setY`, `setScalar`, `copy(v)`, `zero()`, `clone()`.
- **Arithmetic:** `sumComponents()`, `add`, `addScalar`, `sub`, `subScalar`, `multiply`, `multiplyScalar`, `divide`, `divideScalar`, `divideSafe`, `divideScalarSafe`, `mod`, `modScalar`, `negate`, getter `negated`, `addScaledVector`.
- **Interpolation:** `lerp(end,t)`, `lerpClamped(end,t)`.
- **Measures:** `dot`, `cross`, `cross3(b,c)`, `length`, `lengthSq`, `manhattanLength`, `distanceTo(v)`, `distanceToSq(v)`, `manhattanDistanceTo(v)`.
- **Direction & angles:** `directionTo(target)`, `angle()`, `angleTo(v)`, `angleBetween(v)`.
- **Numeric transforms:** `floor`, `ceil`, `round`, `abs`, getter `absolute`, `inverse`, `inverseSafe`, `swap`.
- **Constraints:** `clamp(min,max)`, `clampScalar(min,max)`, `clampLength(min,max)`, `limit(maxLen)`, `min(v)`, `max(v)`.
- **Vector transforms:** `normalize`, `normalizeSafe`, getter `normalized`, `setLength`, `setLengthSafe`, `setHeading`,
  `project(axis)`, `projectSafe(axis)`, `projectOnUnit(unitAxis)`, `reflect(unitNormal)`, `reflectSafe(normal)`,
  `perpendicular(clockwise)`, `unitPerpendicular(clockwise)`, `unitPerpendicularSafe(clockwise)`,
  `rotate(angle)`, `rotateCS(c,s)`, `rotateAround(center,angle)`, `rotateAroundCS(center,c,s)`,
  `midpoint(v)`, `reject(onto)`, `crossScalarRight(s)`, `crossScalarLeft(s)`.
- **Comparison & validation:** `isZero`, `nearZero(eps)`, `equals(v)`, `nearEquals(v,eps)`, `isUnit()`, `isFinite()`, `isParallelTo(v,eps)`, `isPerpendicularTo(v,eps)`.
- **Conversion & representation:** `toJSON()`, `toObject()`, `toArray(out?,offset=0)`, iterator `[Symbol.iterator]`, `toString(precision?)`, `hashCode()`.

### Mat2 (class, 2×2)

> **Summary:** Row‑major storage (`m00, m01, m10, m11`) with **column‑vector** transform semantics (`v' = M · v`). Includes full algebra, rotation/scale/shear builders, inversion (safe/tolerant), solving `A·x=b`, orthonormalization, and alloc‑free statics.

**Types & helpers**

- `interface Mat2Like { m00:number; m01:number; m10:number; m11:number }`
- `type ReadonlyMat2 = Readonly<Mat2>`
- `freezeMat2(m: Mat2): ReadonlyMat2` – permanently freeze a matrix instance.
- `isMat2Like(subject: unknown): subject is Readonly<Mat2Like>`

**Static constants**

- `IDENTITY_MATRIX`, `ZERO_MATRIX`, `ROT90_CCW_MATRIX`, `ROT90_CW_MATRIX`, `ROT180_MATRIX`.

**Static API (pure; many accept `out`)**

- **Factories:** `clone`, `copy`, `fromValues`, `fromRows`, `fromColumns`,
  `fromRotation(angle)`, `fromRotationCS(cos,sin)`, `fromScaling(sx,sy)`, `fromShear(shx,shy)`,
  `fromArray`, `fromObject`, `parse`, `randomRotation()`.
- **Algebra:** `add`, `sub`, `multiplyComponents` (Hadamard), `multiply` (A×B), `multiplyScalar`, `transpose`, `adjugate`, `determinant`, `trace`,
  `inverse` (throws on singular), `inverseSafe` (returns zero on singular), `inverseTol(a,epsilon)`.
- **Solve:** `solve(a,b)`, `solveSafe(a,b[,out])`, `solveTol(a,b,epsilon[,out])`.
- **Vectors & outer product:** `transformVector(a,v[,out])`, `outerProduct(u,v[,outMatrix])`.
- **Comparison & validation:** `equals`, `nearEquals`, `isFinite`, `isIdentity`, `isRotation`, `isSingular`.
- **Utilities:** `frobeniusNorm(a)`, `hashCode(a)`, `angleOfRotation(a)` (≈ `atan2(m10,m00)`).

**Instance API (mutable & chainable)**

- **Storage & construction:** fields `m00,m01,m10,m11`. Overloads: explicit values, tuple `[m00,m01,m10,m11]`, POJO, copy, or no‑arg identity.
- **Basics:** `set(m00,m01,m10,m11)`, `identity()`, `zero()`, `clone()`, `copy(other)`.
- **Rows/columns:** `getRow(0|1)`, `setRow(0|1,vec)`, `getColumn(0|1)`, `setColumn(0|1,vec)`.
- **Numeric transforms:** `floor`, `ceil`, `round`, `abs`.
- **Algebra (matrix–matrix/scalar):** `add`, `sub`, `multiplyComponents`, `multiply(m)` (**right‑multiply** → `this = this × m`), `premultiply(m)` (**left‑multiply** → `this = m × this`), `multiplyScalar(s)`, `transpose`, `determinant`, `trace`, `inverse` (throws), `inverseSafe`.
- **Build & compose transforms:** `setRotation(angle)`, `setRotationCS(c,s)`, `setScaling(sx,sy)`, `setShear(shx,shy)`, `rotate(angle)` (post‑multiply), `rotateCS(c,s)`, `scale(sx,sy)` (post‑multiply), `shear(shx,shy)` (post‑multiply).
- **Vectors & stability:** `transformVector(v)`, `transformVectorInto(v,out)`, `orthonormalize()` (Gram–Schmidt to nearest rotation).
- **Comparison & validation:** `equals`, `nearEquals`, `isIdentity`, `isRotation`, `isFinite`, `isSingular`, `angle()` (≈ rotation).
- **Conversion & representation:** `toJSON()`, `toObject()`, `toArray(out?,offset=0)`, iterator, `toString(precision?)`, `hashCode()`.
=======
_(Additional modules: Vector2, Mat2, Mat3, Transform, Geometry, Raycast, etc., will be added in subsequent releases.)_
>>>>>>> origin/main

---

## Changelog

<<<<<<< HEAD
All notable changes to this package are documented in [CHANGELOG.md](../../_media/CHANGELOG.md).
=======
All notable changes to this package are documented in [CHANGELOG.md](../../_media/CHANGELOG.md).  
>>>>>>> origin/main
Version numbering follows [SemVer](https://semver.org/).

## Modules

- [index.ts](index.ts/index.md)
<<<<<<< HEAD
- [math2d/mat2](math2d/mat2/index.md)
- [math2d/scalar](math2d/scalar/index.md)
- [math2d/vector2](math2d/vector2/index.md)
=======
- [math2d/scalar](math2d/scalar/index.md)
>>>>>>> origin/main
