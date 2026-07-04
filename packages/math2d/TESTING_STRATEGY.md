# @lenguados/math2d Testing Strategy

> **Status:** MANDATORY
> **Scope:** test topology, algebraic invariants, dangerous-path testing, and tolerance handling for `@lenguados/math2d`.

This document extends the engine-wide [Testing Strategy](../../TESTING_STRATEGY.md) with conventions specific to `@lenguados/math2d`. The testing strategy has been designed to support exact mathematics, deterministic cross-platform reproducibility, and hot-path collision engines.

---

## 1. Test Topology

Tests MUST be written under the assumption that an error in bit $N$ of a Float64 Double will destroy the peer-to-peer lockstep game system in production. **Sporadic failures are not acceptable.**

1. **Mathematical unit tests (Jest)** — verify concrete results (`sin(PI) === 0`, within tolerance).
2. **Boundary checks (isolated edge cases)** — every input MUST be tortured against: `NaN`, `+Infinity`, `-Infinity`, $+0$, $-0$, and `Number.MAX_VALUE`.
3. **Property-based testing (fast-check)** — abstract invariants, for example: _"for any vector $X$ and any rotation $Y$, if $X$ is rotated by $Y$ and then by $-Y$, the resulting vector MUST be equivalent within `EPSILON`."_
4. **Overflow-boundary tests** — Default-tier and Safe-tier methods that compute magnitude MUST be tested with inputs above the naive-overflow threshold ($\sqrt{\mathtt{Number.MAX\_VALUE}} \approx 1.34 \times 10^{154}$ for a single component; $\approx 9.5 \times 10^{153}$ when both components are comparable — where `x*x + y*y` overflows to `Infinity`) to verify they use `hypot` rather than `sqrtSafe(magnitudeSq())`.

---

## 2. Fast-Check — Mandatory Algebraic Invariants

Any new method on composite classes (`Complex`, `Matrix*`, `Vector2`, `Rotation2`, `Interval`, `Transform2`) MUST algorithmically test its invariants:

| Class T      | Property Tested       | Invariant                                                                 |
| :----------- | :-------------------- | :------------------------------------------------------------------------ |
| `Rotation2`  | Closure               | The product of two rotations MUST yield a valid rotation of length $1.0$. |
| `Vector2`    | Commutativity         | $a + b \equiv b + a$                                                      |
| `Complex`    | Conjugate involution  | $(Z^*)^* \equiv Z$                                                        |
| `Matrix3`    | Invertibility         | $A \cdot A^{-1} \equiv I$ (Identity)                                      |
| `Interval`   | Empty set             | The intersection of disjoint intervals MUST return `undefined`.           |
| `Transform2` | Identity preservation | Composing with identity MUST yield the original (within `EPSILON`).       |

Additional invariants by category:

- **Addition / subtraction** — commutativity, associativity (within tolerance), identity element, inverse.
- **Normalization** — idempotence (`normalize(normalize(v)) ≈ normalize(v)`).
- **Rotations** — length preservation (`rotate(v).magnitude() ≈ v.magnitude()`).
- **Conversions** — round-trip (`fromAngle(r.toAngle()) ≈ r`).

---

## 3. Dangerous-Path Testing (Unchecked Variants)

The `*Unchecked` methods (for example `inverseUnchecked`, `normalizeUnchecked`) are exempt from throwing errors by design — they follow the IEEE 754 "Garbage In, Garbage Out" contract. Test suites MUST NOT assert that these methods throw on malformed inputs (zero determinant, zero-length vector). Instead, test suites MUST verify that the mathematical fallthrough occurs predictably — the IEEE 754 fallthrough to `NaN` or `±Infinity`.

```typescript
// CORRECT: assert NaN result, not error
it('produces NaN for zero-length vector', () => {
 const v = new Vector2(0, 0);
 v.normalizeUnchecked();
 expect(v.x).toBeNaN();
});

// WRONG: Unchecked methods never throw
expect(() => v.normalizeUnchecked()).toThrow(); // NEVER DO THIS
```

---

## 4. Overflow Boundary Tests

Default-tier and Safe-tier methods that compute vector or matrix magnitude MUST be tested with overflow-range inputs to verify the implementation uses `hypot` and not `sqrtSafe(magnitudeSq())`. The intermediate quantity $x^2 + y^2$ overflows to `Infinity` once a single component exceeds $\sqrt{\mathtt{Number.MAX\_VALUE}} \approx 1.34 \times 10^{154}$ — or $\sqrt{\mathtt{Number.MAX\_VALUE} / 2} \approx 9.5 \times 10^{153}$ when both components are comparable — and the naive `sqrt(x*x + y*y)` collapses any subsequent operation, while `hypot(x, y)` remains finite for any representable magnitude up to `Number.MAX_VALUE` $\approx 1.80 \times 10^{308}$.

### Required test coverage

Every core type whose magnitude enters a default-tier or Safe-tier code path MUST have at least one boundary test covering:

1. **Just above threshold** ($1.01 \times \sqrt{\mathtt{Number.MAX\_VALUE} / 2}$ on both components, per the canonical pattern below) — verifies the first-octave overflow.
2. **Mid-range extreme** ($1 \times 10^{200}$) — verifies behavior well inside the overflow-capable region.
3. **Near `MAX_VALUE`** ($1 \times 10^{308}$) — verifies the implementation does not lose precision at the very edge.

The `Unchecked` tier is explicitly exempted from this requirement — per `math2d-patterns.md`, `Unchecked` uses `Math.sqrt(x*x + y*y)` for speed and documents overflow as a caller-owned precondition.

### Canonical test pattern

```typescript
import { Vector2 } from '@lenguados/math2d';

const OVERFLOW_THRESHOLD = Math.sqrt(Number.MAX_VALUE / 2);

it('normalizes correctly above the overflow threshold', () => {
 const large = new Vector2(OVERFLOW_THRESHOLD * 1.01, OVERFLOW_THRESHOLD * 1.01);
 const normalized = Vector2.normalize(large);
 // Must be unit length — NOT (0, 0) or (NaN, NaN)
 expect(Vector2.magnitude(normalized)).toBeCloseTo(1, 10);
});
```

### Which operations need these tests

- `Vector2.magnitude`, `Vector2.normalize`, `Vector2.normalizeSafe`
- `Complex.magnitude`, `Complex.normalize`, `Complex.normalizeSafe`
- `Rotation2.normalize`, `Rotation2.normalizeSafe` (the `(cos, sin)` pair should stay unit-length under extreme drift)
- Matrix Frobenius paths: `Matrix2.frobeniusNorm`, `Matrix2.eigenvectorForValue` (default and Safe tiers)

Any future N-dimensional norm added to the package inherits the same contract: default and Safe tiers use `hypot` composed recursively; Unchecked uses raw `Math.sqrt` with the raw sum of squares.

### Coverage helper

Overflow-boundary tests derive their inputs from the threshold constant directly (`Math.sqrt(Number.MAX_VALUE / 2)`, as in the canonical pattern above). `test/arbitraries.ts` does not currently provide a dedicated large-vector arbitrary — property-based suites cover the general ranges (`arbVector2`, `arbSmallVector2`), and the overflow region is exercised by the explicit boundary tests.

---

## 5. Tolerance Handling and Critical Points (Wrap-Around)

Critical care is required with angular wrap-around — the jump from $-\pi$ to $+\pi$.

> **Warning:** a plain component-wise `nearEquals(A, B)` fails when the compared angles cross the circle boundary. When testing objects with angular components (`Transform2`, `Rotation2`), use the evaluator `angleDifference(A, B) <= EPSILON` for angle-aware equality assertions, or use `Rotation2.nearEquals` directly.

### Standard tolerances (constants)

```typescript
import { EPSILON } from '@lenguados/math2d';

// Always use approximate comparisons. NEVER use .toBe() directly with floats:
expect(result.x).toBeCloseTo(expected.x, 10);
```

> **Note:** Jest's `toBeCloseTo` second argument is the number of digits of precision, not a tolerance value. Passing `10` means the comparison checks up to 10 decimal digits of precision, which corresponds to `EPSILON` = $1 \times 10^{-10}$.

### Tolerance constants reference

| Constant           | Value               | Usage                                            |
| ------------------ | ------------------- | ------------------------------------------------ |
| `DIGITS`           | `10`                | `toBeCloseTo(expected, 10)` — matches EPSILON    |
| `TEST_TOLERANCE`   | $1 \times 10^{-6}$  | Property-based tests (relaxed for random inputs) |
| `EPSILON`          | $1 \times 10^{-10}$ | Library constant for geometric comparisons       |
| `MIN_SAFE_DIVISOR` | $1 \times 10^{-10}$ | Library constant for division safety             |

Never use raw `===` for floating-point comparison (except for exact values: `0`, `1`, `-1`, `NaN` via `toBeNaN()`).

---

## 6. Custom Arbitraries (fast-check)

All shared arbitraries live in `test/arbitraries.ts`. Conventions:

- `arbVector2` — general coordinates (integer range $\pm 10^6$).
- `arbNonZeroVector2` — filters `magnitudeSq() > 10^{-20}`.
- `arbUnitVector2` — generated via `fromAngle(arbAngle)`.
- `arbSmallVector2` — near-underflow values ($\times 10^{-8}$).
- `arbAngle` — $[-\pi, \pi]$ mapped from integers for reproducibility.
- `arbAngleNearPi` — targets $\pm\pi$ boundary specifically.
- `arbRotation2` — via `Rotation2.fromAngle(arbAngle)`.
- `arbTransform2` — composed from position, rotation, and scale arbitraries.

When adding a new core type, add corresponding arbitraries to `test/arbitraries.ts`.

---

## 7. Test File Types

| Pattern                   | Environment | Purpose                                      |
| ------------------------- | ----------- | -------------------------------------------- |
| `*.node.spec.ts`          | Node        | Standard math / logic tests                  |
| `*.dom.spec.ts`           | jsdom       | Canvas / DOM-dependent tests                 |
| `*.property.node.spec.ts` | Node        | Property-based tests (fast-check)            |
| `*.boundary.node.spec.ts` | Node        | Boundary value analysis ($\pm\pi$, overflow) |

Tests MUST mirror source structure: `src/core/vector2.ts` maps to `test/core/vector2.node.spec.ts`. Property-based tests go under `test/properties/`. Boundary tests go under `test/boundaries/`.

---

## 8. Coverage Thresholds

- **Lines / statements / functions:** 90%.
- **Branches:** 80% (lower bar than lines because some branches are dev-only assertion paths stripped in production).

Coverage thresholds are enforced by the Jest configuration (`coverageThreshold` in `jest.config.ts`); a drop below any threshold fails `npm test` and `npm run test:unit`.
