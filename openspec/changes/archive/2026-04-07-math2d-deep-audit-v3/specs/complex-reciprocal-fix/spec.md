## MODIFIED Requirements

### Requirement: Complex instance reciprocal() and reciprocalSafe() SHALL use magnitudeSq()

The instance methods `Complex.prototype.reciprocal()` and `Complex.prototype.reciprocalSafe()` SHALL compute magnitude squared via `this.magnitudeSq()` directly, instead of calling `this.magnitude()` and then squaring the result.

**Evidence (empirical):**

1. **Performance**: 2M iterations x 5 rounds benchmark:
   - Static (magnitudeSq): 175.6ms average
   - Instance (magnitude then square): 220.9ms average
   - Instance is **25.8% slower**

2. **Precision**: In 5/15 test cases the results differ by ~1 ULP. In ALL differing cases, `magnitudeSq()` (static path) produces **lower roundtrip error**:
   - Static roundtrip error (z \* reciprocal(z) - 1): 0 to 1.1e-16
   - Instance roundtrip error: 2.2e-16
   - The `magnitudeSq()` path is more precise because it avoids the `sqrt` -> `square` roundtrip

3. **Internal consistency**: `reciprocalUnchecked()` instance method (line 2407) already uses `this.magnitudeSq()`. The static `reciprocal()` (line 1364) also uses `magnitudeSq()`. Only instance `reciprocal()` and `reciprocalSafe()` deviate.

4. **Overflow safety**: Both paths overflow at the same threshold (~1e154). Tested: `hypot(1e154, 1e154)^2 = Infinity` AND `1e154^2 + 1e154^2 = Infinity`. No safety change.

5. **Threshold equivalence**: `isNearZero(mag)` with EPSILON=1e-10 triggers when |z| < 1e-10. `isNearZero(magSq, EPSILON*EPSILON)` triggers when |z|^2 < 1e-20, i.e., |z| < 1e-10. Mathematically equivalent.

#### Scenario: reciprocal uses magnitudeSq

- **GIVEN** a Complex number with `real=3, imag=4`
- **WHEN** instance `reciprocal()` is called
- **THEN** the result SHALL be computed using `this.magnitudeSq()` directly
- **AND** the result SHALL be numerically identical to `Complex.reciprocal(z, z)` (static version)

#### Scenario: reciprocal threshold equivalence

- **GIVEN** a Complex number with magnitude below EPSILON (e.g., `real=1e-11, imag=0`)
- **WHEN** instance `reciprocal()` is called
- **THEN** it SHALL throw `RangeError` (same behavior as before, using squared threshold)

#### Scenario: reciprocalSafe uses magnitudeSq

- **GIVEN** a Complex number with `real=3, imag=4`
- **WHEN** instance `reciprocalSafe()` is called
- **THEN** the result SHALL use `this.magnitudeSq()` directly
- **AND** for zero-magnitude input, it SHALL return `(0, 0)` (unchanged fallback behavior)
