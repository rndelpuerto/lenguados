---
paths:
 - 'packages/math2d/test/**'
---

# Math2D Testing Patterns

Complements `testing-conventions.md` (general structure) with math-specific patterns.

## Tolerance Constants

| Constant           | Value   | Usage                                                 |
| ------------------ | ------- | ----------------------------------------------------- |
| `DIGITS`           | `10`    | `toBeCloseTo(expected, 10)` — matches EPSILON = 1e-10 |
| `TEST_TOLERANCE`   | `1e-6`  | Property-based tests (relaxed for random inputs)      |
| `EPSILON`          | `1e-10` | Library constant for geometric comparisons            |
| `MIN_SAFE_DIVISOR` | `1e-10` | Library constant for division safety                  |

**Rule**: Never use raw `===` for floating-point comparison (except for exact values: 0, 1, -1, NaN checks via `toBeNaN()`).

## Test Helper Convention

Each test file defines helpers at the top for common assertions:

```typescript
const DIGITS = 10;
function expectVecClose(v: ReadonlyVector2, x: number, y: number, digits = DIGITS) {
 expect(v.x).toBeCloseTo(x, digits);
 expect(v.y).toBeCloseTo(y, digits);
}
```

Create similar helpers for each type: `expectMatClose`, `expectRotClose`, etc.

## Property-Based Testing (fast-check)

**Required for**: All composite type operations (add, multiply, normalize, transform, inverse).

### Custom Arbitraries

All arbitraries live in `test/arbitraries.ts`. Conventions:

- `arbVector2` — general coordinates (integer range ±1,000,000)
- `arbNonZeroVector2` — filters `magnitudeSq() > 1e-20`
- `arbUnitVector2` — generated via `fromAngle(arbAngle)`
- `arbSmallVector2` — near-underflow values (×1e-8)
- `arbAngle` — `[-π, π]` mapped from integers for reproducibility
- `arbAngleNearPi` — targets ±π boundary specifically
- `arbRotation2` — via `fromAngle(arbAngle)`
- `arbTransform2` — composed from position + rotation + scale arbitraries

When adding a new type, add corresponding arbitraries to this file.

### Algebraic Invariants to Test

| Invariant           | Example                                  | When Required                |
| ------------------- | ---------------------------------------- | ---------------------------- |
| Commutativity       | `add(a, b) ≈ add(b, a)`                  | Addition, dot product        |
| Associativity       | `add(add(a, b), c) ≈ add(a, add(b, c))`  | Addition (within tolerance)  |
| Identity element    | `add(a, ZERO) ≈ a`                       | All operations with identity |
| Inverse             | `add(a, negate(a)) ≈ ZERO`               | Operations with inverses     |
| Idempotence         | `normalize(normalize(v)) ≈ normalize(v)` | Normalization, clamp         |
| Length preservation | `rotate(v).magnitude() ≈ v.magnitude()`  | Rotations                    |
| Round-trip          | `fromAngle(r.toAngle()) ≈ r`             | Conversions                  |

## Angular Equality

**MUST use `angleDifference()` or `Rotation2.nearEquals()` for angle comparison.**

Never use `Math.abs(a - b) < epsilon` — it fails at the ±π boundary (π and -π are the same rotation but differ by 2π).

```typescript
// WRONG: fails at ±π boundary
expect(Math.abs(angle1 - angle2)).toBeLessThan(EPSILON);

// CORRECT: handles wrap-around
expect(Math.abs(angleDifference(angle1, angle2))).toBeLessThan(EPSILON);
```

## Dangerous-Path Testing (Unchecked Variants)

`*Unchecked` methods follow the IEEE 754 GIGO (Garbage In, Garbage Out) contract. They do NOT throw — they produce NaN/Infinity on invalid input.

```typescript
// CORRECT: assert NaN result, not error
it('produces NaN for zero-length vector', () => {
 const v = new Vector2(0, 0);
 v.normalizeUnchecked();
 expect(v.x).toBeNaN(); // IEEE 754: 0 * (1/0) = NaN
});

// WRONG: Unchecked methods never throw
expect(() => v.normalizeUnchecked()).toThrow(); // NEVER DO THIS
```

## Test File Types

| Pattern                   | Environment | Purpose                                       |
| ------------------------- | ----------- | --------------------------------------------- |
| `*.node.spec.ts`          | Node        | Standard math/logic tests                     |
| `*.dom.spec.ts`           | jsdom       | Canvas/DOM-dependent tests                    |
| `*.property.node.spec.ts` | Node        | Property-based tests (fast-check)             |
| `*.boundary.node.spec.ts` | Node        | Boundary value analysis (±π, 0, 2π, overflow) |

## Import Convention in Tests

```typescript
import { describe, expect, it } from '@jest/globals';
import * as fc from 'fast-check';
import { Vector2 } from '../../src/core/vector2'; // relative to src
import { arbVector2 } from '../arbitraries'; // shared arbitraries
```

Always import test globals from `@jest/globals`, not ambient.
