## ADDED Requirements

### Requirement: lerpAngle PI-boundary sign correctness

`lerpAngle(from, to, t)` SHALL compute the interpolated angle as `from + angleDifference(from, to) * t`, without applying intermediate normalization to the scaled difference. The current formula `normalizeRadians(diff * t) + from` wraps the intermediate value, preventing correct extrapolation for `t` outside [0, 1].

**Source:** `packages/math2d/src/auxiliary/angle/interpolation.ts:34-37`

**Reference:** Godot `lerp_angle` uses the same `from + angleDifference(from, to) * t` formulation.

**Important boundary note:** The PI-boundary behavior is inherent to the `[-PI, PI)` normalization range. `angleDifference(0, PI) = -PI` because PI is the excluded endpoint of the half-open range. This means `lerpAngle(0, PI, 0.5) = -PI/2` under BOTH old and new formulas — the fix addresses extrapolation, not the PI-boundary sign. Unity produces `+PI/2` for the same inputs because it uses `(-PI, PI]` range convention — this is a different equally valid arbitrary choice, not a correctness issue.

#### Scenario: Midpoint interpolation across PI boundary (inherent convention)

- **GIVEN** `from = 0` and `to = PI`
- **WHEN** `lerpAngle(from, to, 0.5)` is called
- **THEN** the result SHALL be `-PI / 2` (this is inherent to the `[-PI, PI)` range: `angleDifference(0, PI) = -PI`, so `0 + (-PI) * 0.5 = -PI/2`). This is NOT a bug — it reflects the half-open range convention.

#### Scenario: Midpoint interpolation within non-boundary range

- **GIVEN** `from = 0` and `to = PI / 2`
- **WHEN** `lerpAngle(from, to, 0.5)` is called
- **THEN** the result SHALL be `PI / 4` (no boundary ambiguity for angles well within `[-PI, PI)`)

#### Scenario: Interpolation at endpoints is exact

- **GIVEN** `from = 0` and `to = PI / 2`
- **WHEN** `lerpAngle(from, to, 0)` and `lerpAngle(from, to, 1)` are called
- **THEN** the results SHALL be `0` and `PI / 2` respectively

#### Scenario: Negative-direction shortest path preserved

- **GIVEN** `from = 0` and `to = -PI / 2`
- **WHEN** `lerpAngle(from, to, 0.5)` is called
- **THEN** the result SHALL be `-PI / 4` (shortest path is clockwise)

---

### Requirement: angleDifference anti-symmetry

`angleDifference` SHALL satisfy the anti-symmetry property `angleDifference(a, b) = -angleDifference(b, a)` for all inputs, including the PI boundary. The current implementation maps both `PI` and `-PI` to `-PI` via the half-open `[-PI, PI)` range, causing `angleDifference(0, PI)` and `angleDifference(PI, 0)` to both return `-PI`. The fix SHALL document this as a known boundary condition of the `[-PI, PI)` representation and, where feasible, adjust the implementation so that the anti-symmetry holds for non-boundary inputs.

**Source:** `packages/math2d/src/auxiliary/angle/operations.ts:109-111`

#### Scenario: Anti-symmetry for non-boundary angles

- **GIVEN** `a = 0` and `b = PI / 2`
- **WHEN** `angleDifference(a, b)` and `angleDifference(b, a)` are called
- **THEN** the results SHALL satisfy `angleDifference(a, b) === -angleDifference(b, a)`

#### Scenario: PI boundary anti-symmetry documentation

- **GIVEN** `a = 0` and `b = PI`
- **WHEN** `angleDifference(a, b)` is called
- **THEN** the result SHALL be `-PI` (inherent to `[-PI, PI)` range), AND the function documentation SHALL explicitly state that `angleDifference(a, b) = -angleDifference(b, a)` holds for all inputs except when `|to - from|` is an exact multiple of `PI`, where the sign is determined by the `[-PI, PI)` normalization convention

#### Scenario: Symmetric angles around zero

- **GIVEN** `a = PI / 4` and `b = -PI / 4`
- **WHEN** `angleDifference(a, b)` and `angleDifference(b, a)` are called
- **THEN** the results SHALL be `-PI / 2` and `PI / 2` respectively

---

### Requirement: smoothStepAngle removes redundant double-saturation

`smoothStepAngle` SHALL NOT apply `saturate(t)` before passing `t` to `smoothStep(0, 1, t)`, because `smoothStep` already clamps its input internally via `saturate((x - edge0) / range)`. The redundant outer `saturate` SHALL be removed so that `smoothStepAngle` calls `lerpAngle(from, to, smoothStep(0, 1, t))` directly.

**Source:** `packages/math2d/src/auxiliary/angle/interpolation.ts:55-58`

#### Scenario: smoothStepAngle produces correct eased interpolation

- **GIVEN** `from = 0` and `to = PI / 2`
- **WHEN** `smoothStepAngle(from, to, 0.5)` is called
- **THEN** the result SHALL equal `lerpAngle(0, PI / 2, smoothStep(0, 1, 0.5))`

#### Scenario: smoothStepAngle clamps out-of-range t values

- **GIVEN** `from = 0` and `to = PI / 2`
- **WHEN** `smoothStepAngle(from, to, -0.5)` and `smoothStepAngle(from, to, 1.5)` are called
- **THEN** the results SHALL be `0` and `PI / 2` respectively (clamped by smoothStep internally)

#### Scenario: Rotation2.slerp mirrors the fix

- **GIVEN** `Rotation2.slerp` also applies `saturate(t)` before `smoothStep(0, 1, clamped)`
- **WHEN** `Rotation2.slerp` is reviewed
- **THEN** it SHALL also remove the redundant outer `saturate` to match `smoothStepAngle`

---

### Requirement: Rotation2.lerp extrapolation correctness

`Rotation2.lerp` (instance method) documents that `t` is "not clamped, allows extrapolation." The underlying `lerpAngle` SHALL support extrapolation by not normalizing intermediate results. After the `lerpAngle` fix (Requirement 1), extrapolation with `t` outside `[0, 1]` SHALL produce continuous, unwrapped results that extend linearly beyond the interpolation endpoints.

**Source:** `packages/math2d/src/core/rotation2.ts:1426` (doc says "allows extrapolation"), `rotation2.ts:705-713` (static lerp)

#### Scenario: Extrapolation beyond t = 1

- **GIVEN** `a = Rotation2.fromAngle(0)` and `b = Rotation2.fromAngle(PI / 2)`
- **WHEN** `Rotation2.lerp(a, b, 2.0)` is called
- **THEN** the result SHALL represent the angle `PI` (linear extrapolation: `0 + (PI/2) * 2 = PI`)

#### Scenario: Extrapolation before t = 0

- **GIVEN** `a = Rotation2.fromAngle(0)` and `b = Rotation2.fromAngle(PI / 2)`
- **WHEN** `Rotation2.lerp(a, b, -1.0)` is called
- **THEN** the result SHALL represent the angle `-PI / 2` (linear extrapolation: `0 + (PI/2) * (-1) = -PI/2`)

#### Scenario: Extrapolation continuity at endpoints

- **GIVEN** `a = Rotation2.fromAngle(PI / 4)` and `b = Rotation2.fromAngle(3 * PI / 4)`
- **WHEN** `Rotation2.lerp(a, b, t)` is called for `t` values `[0.99, 1.0, 1.01]`
- **THEN** the resulting angles SHALL be monotonically increasing (no discontinuous wrap)

---

### Requirement: isAngleBetween zero-arc semantics documentation

`isAngleBetween` SHALL document the behavior when `start === end` (zero-arc case). The current implementation returns `true` only when `angle === start` (point containment). The documentation SHALL explicitly state whether `start === end` represents a zero-arc (containing only the single point) or a full-circle (containing all angles), and the chosen semantics SHALL be consistent with the `inclusive` parameter.

**Source:** `packages/math2d/src/auxiliary/angle/operations.ts:201-222`

#### Scenario: Zero-arc with inclusive boundaries

- **GIVEN** `start = PI / 4` and `end = PI / 4` (zero-arc)
- **WHEN** `isAngleBetween(PI / 4, start, end, true)` is called
- **THEN** the result SHALL be `true` (the single point is on the boundary)

#### Scenario: Zero-arc with exclusive boundaries

- **GIVEN** `start = PI / 4` and `end = PI / 4` (zero-arc)
- **WHEN** `isAngleBetween(PI / 4, start, end, false)` is called
- **THEN** the result SHALL be `false` (no interior exists in a zero-arc)

#### Scenario: Zero-arc rejects other angles

- **GIVEN** `start = PI / 4` and `end = PI / 4` (zero-arc)
- **WHEN** `isAngleBetween(PI / 2, start, end, true)` is called
- **THEN** the result SHALL be `false` (zero-arc contains only the single point)

#### Scenario: Documentation states zero-arc semantics

- **GIVEN** the `isAngleBetween` JSDoc
- **WHEN** the documentation is reviewed
- **THEN** it SHALL contain a `@remarks` note explaining that when `start === end`, the function treats this as a zero-length arc (single point), not a full circle

---

### Requirement: clampAngle output range documentation

`clampAngle` SHALL document that it normalizes all input angles to `[-PI, PI)` before clamping, and therefore its return value is always in `[-PI, PI)`. The current implementation silently normalizes but the documentation does not state the output range.

**Source:** `packages/math2d/src/auxiliary/angle/operations.ts:244-261`

#### Scenario: Output is within documented range

- **GIVEN** `angle = 5 * PI / 2`, `min = 0`, `max = PI`
- **WHEN** `clampAngle(angle, min, max)` is called
- **THEN** the result SHALL be in `[-PI, PI)` AND the result SHALL equal `PI / 2` (the normalized angle is `PI / 2`, which is within `[0, PI]`)

#### Scenario: Documentation states normalization behavior

- **GIVEN** the `clampAngle` JSDoc
- **WHEN** the documentation is reviewed
- **THEN** it SHALL state that all input angles (angle, min, max) are normalized to `[-PI, PI)` before clamping, and that the return value is always in `[-PI, PI)`

#### Scenario: Clamped output preserves normalization

- **GIVEN** `angle = 3 * PI`, `min = 0`, `max = PI / 2`
- **WHEN** `clampAngle(angle, min, max)` is called
- **THEN** the result SHALL be in `[-PI, PI)` (the normalized angle `-PI` is outside `[0, PI/2]`, so the closer boundary is returned, also in `[-PI, PI)`)

---

### Requirement: AngleUnwrapper precision drift mitigation

`AngleUnwrapper` SHALL mitigate precision drift that accumulates over long sequences. When `previous` grows large (e.g., after 100K+ full rotations), the `angleDifference(previous, theta)` computation loses precision because `previous` has many significant digits consumed by the integer part. The implementation SHALL use compensated accumulation or periodic re-basing to maintain precision proportional to the step size, not the accumulated total.

**Source:** `packages/math2d/src/auxiliary/angle/unwrapping.ts:62,114,172`

#### Scenario: Precision after 100K full rotations

- **GIVEN** an `AngleUnwrapper` initialized at `0`
- **WHEN** `next(theta)` is called 100,000 times with `theta` incrementing by `TAU` each step (simulating 100K full rotations)
- **THEN** the accumulated value SHALL be within `1e-6` of the mathematically exact value `100000 * TAU`, demonstrating that precision has not degraded to only ~3 significant digits

#### Scenario: Small steps remain precise after large accumulation

- **GIVEN** an `AngleUnwrapper` that has accumulated `previous ~ 628318` (100K rotations)
- **WHEN** `next(0.1)` is called (a small angular step from the previous wrapped position)
- **THEN** the delta computed SHALL be accurate to at least 10 significant digits, not losing precision due to the magnitude of `previous`

#### Scenario: Batch unwrapAngles precision for long arrays

- **GIVEN** an array of 100,000 angles representing small incremental rotations of `0.01` radians each
- **WHEN** `unwrapAngles(array)` is called
- **THEN** the final unwrapped value SHALL be within `1e-6` of the exact sum `100000 * 0.01 = 1000.0`

---

### Requirement: normalizeRadians large-angle precision

`normalizeRadians` SHALL document the precision limitations for very large angles. The underlying modulo operation `((value - min) % range)` loses significant digits when `value` is much larger than the range `TAU`. For angles exceeding approximately `1e15`, the result has zero meaningful digits. The documentation SHALL state the practical input range for which the function produces meaningful results, and optionally provide a `normalizeRadiansPrecise` variant using Cody-Waite or Payne-Hanek reduction for applications requiring precision at large magnitudes.

**Source:** `packages/math2d/src/auxiliary/angle/normalization.ts`, `packages/math2d/src/auxiliary/scalar/arithmetic.ts:179-186`

#### Scenario: Precision loss documentation for extreme angles

- **GIVEN** `radians = 1e15`
- **WHEN** `normalizeRadians(radians)` is called
- **THEN** the result SHALL be a value in `[-PI, PI)`, BUT the documentation SHALL note that for `|radians| > 2^53 / TAU` (approximately `1.4e15`), the modulo operation loses all significant digits and the result is essentially meaningless

#### Scenario: Moderate large angles retain useful precision

- **GIVEN** `radians = 1e8` (within useful precision range)
- **WHEN** `normalizeRadians(radians)` is called
- **THEN** the result SHALL be accurate to at least 8 significant digits (double precision has ~15.9 digits, minus ~8 digits consumed by the integer part of `1e8 / TAU`)

#### Scenario: Small angles are unaffected

- **GIVEN** `radians = PI / 4`
- **WHEN** `normalizeRadians(radians)` is called
- **THEN** the result SHALL be `PI / 4` with full double-precision accuracy

---

### Requirement: AngleUnwrapper uninitialized state distinguishability

`AngleUnwrapper.value` SHALL provide a way to distinguish "uninitialized" from "initialized at angle 0." The current implementation returns `0` in both cases. The fix SHALL either (a) return `undefined` when uninitialized (changing the return type to `number | undefined`), or (b) expose an `initialized` property so callers can check the state.

**Source:** `packages/math2d/src/auxiliary/angle/unwrapping.ts:141-154, 183-185`

#### Scenario: Uninitialized unwrapper is distinguishable from zero

- **GIVEN** a freshly constructed `AngleUnwrapper()` with no initial angle
- **WHEN** the initialization state is queried
- **THEN** the unwrapper SHALL indicate that it is not yet initialized (either `value` returns `undefined`, or an `initialized` getter returns `false`)

#### Scenario: Initialized at zero is distinguishable from uninitialized

- **GIVEN** `new AngleUnwrapper(0)` (explicitly initialized at angle 0)
- **WHEN** the initialization state is queried
- **THEN** the unwrapper SHALL indicate that it IS initialized (either `value` returns `0`, or `initialized` returns `true`)

#### Scenario: First next() call initializes the unwrapper

- **GIVEN** a freshly constructed `AngleUnwrapper()` (uninitialized)
- **WHEN** `next(PI / 4)` is called
- **THEN** the unwrapper SHALL become initialized, `value` SHALL return `PI / 4`, and subsequent state queries SHALL indicate initialized

#### Scenario: Reset without argument returns to uninitialized

- **GIVEN** an `AngleUnwrapper` that has been initialized via `next()` calls
- **WHEN** `reset()` is called without arguments
- **THEN** the unwrapper SHALL return to the uninitialized state

---

### Requirement: angleFromVectors single-atan2 optimization

`angleFromVectors` SHALL compute the directed angle using a single `atan2` call on the cross product and dot product of the two vectors, instead of computing two separate `atan2` calls and taking their difference. The formula SHALL be `atan2(x1 * y2 - y1 * x2, x1 * x2 + y1 * y2)` (i.e., `atan2(cross, dot)`). This is both faster (one atan2 instead of two) and more numerically stable (avoids cancellation in the subtraction of two similar-magnitude angles).

**Source:** `packages/math2d/src/auxiliary/angle/operations.ts:283-287`

#### Scenario: Cross/dot formulation produces correct result for orthogonal vectors

- **GIVEN** `v1 = (1, 0)` and `v2 = (0, 1)`
- **WHEN** `angleFromVectors(1, 0, 0, 1)` is called
- **THEN** the result SHALL be `PI / 2` (90 degrees CCW)

#### Scenario: Cross/dot formulation for opposite vectors

- **GIVEN** `v1 = (1, 0)` and `v2 = (-1, 0)`
- **WHEN** `angleFromVectors(1, 0, -1, 0)` is called
- **THEN** the result SHALL be `PI` or `-PI` (180 degrees, sign determined by `[-PI, PI)` convention)

#### Scenario: Improved precision for nearly-parallel vectors

- **GIVEN** `v1 = (1, 0)` and `v2 = (cos(1e-10), sin(1e-10))` (nearly parallel)
- **WHEN** `angleFromVectors` is called with the single-atan2 formula
- **THEN** the result SHALL be approximately `1e-10` with relative error less than `1e-5`, which is more precise than the two-atan2 approach that suffers from catastrophic cancellation when subtracting two nearly-equal angles

#### Scenario: Determinism preserved

- **GIVEN** any pair of finite vectors
- **WHEN** `angleFromVectors` is called
- **THEN** the result SHALL use only the deterministic `atan2` kernel (from `deterministic-kernels.ts`), maintaining cross-platform bit-exactness
