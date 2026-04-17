---
sidebar_position: 8
title: 'Testing Strategy'
description: 'Property-based testing with fast-check, algebraic invariants, and tolerance conventions'
---

# Testing Strategy

> **Package:** `@lenguados/math2d`
> **Document Revision:** 2.0 (2026)
> **Status:** MANDATORY

The testing strategy for `@lenguados/math2d` has been redesigned to support exact mathematics and collision engines.

---

## 1. Test Topology

Tests must be written under the assumption that an error in bit N of a Double (Float64) will destroy the P2P Lockstep game system in production. **Sporadic failures are not acceptable.**

1. **Mathematical Unit Tests (Jest)**
   Verify concrete results (`sin(pi) === 0`).
2. **Boundary Checks (Isolated Edge Cases)**
   Every input must be tortured against: `NaN`, `+Infinity`, `-Infinity`, `+/-0`, and `Number.MAX_VALUE`.
3. **Property-Based Testing (`fast-check`)**
   Test abstract invariants, for example: _"For any vector X and any rotation Y, if X is rotated by Y and then by -Y, the resulting vector X must be equivalent within EPSILON."_

---

## 2. Fast-Check: Mandatory Algebraic Invariants

Any new method on Composite Classes (Complex, Matrix, Vector) **MUST** algorithmically test its invariants:

| Class T     | Property Tested      | Test Code (fc.assert)                                                   |
| :---------- | :------------------- | :---------------------------------------------------------------------- |
| `Rotation2` | Closure              | The product of two Rotations must yield a valid Rotation of length 1.0. |
| `Vector2`   | Commutativity        | `a + b === b + a`                                                       |
| `Complex`   | Conjugate Involution | `(Z*)* === Z`                                                           |
| `Matrix3`   | Invertibility        | `A * A^-1 === Identity`                                                 |
| `Interval`  | Infinite Bound       | The intersection of disjoint sets **must return `undefined`**.          |

---

## 3. Dangerous Path Testing (Unchecked Paths)

The `*Unchecked` methods (e.g., `inverseUnchecked`) are exempt from throwing errors by design. Test suites **MUST NOT** test for error emission under malformed inputs (e.g., zero determinant) on these functions. Instead, they must test that the mathematical _fallthrough_ occurs predictably (implosive generation of `+/-Infinity` or `NaN`).

---

## 4. Tolerance Handling and Critical Points (Wrap-Around)

Critical care is required with angular Wrap-Around (the dreaded jump from `-pi` to `pi`).

> **Historical L0 Bug:** `nearEquals(A, B)` failed miserably when crossing the circle. **Mandatory Fix:** If you are testing objects with angular components (Transforms, Rotations), require the internal use of the evaluator `angleDifference(A, B) <= EPSILON` for the equitative assertion test (`nearEquals`).

### Standard Tolerances (Constants)

```typescript
import { EPSILON } from '@lenguados/math2d/auxiliary';

// Always use 'approximate', NEVER use .toBe() directly with floats:
expect(result.x).toBeCloseTo(expected.x, 10);
```

:::note
Jest's `toBeCloseTo` second argument is the **number of digits of precision**, not a tolerance value. Passing `10` means the comparison checks up to 10 decimal digits of precision, which corresponds to `EPSILON = 1e-10`.
:::
