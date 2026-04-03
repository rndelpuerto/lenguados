## ADDED Requirements

### Requirement: Document the sqrt vs hypot design pattern in project rules

The project SHALL document the following convention in `.claude/rules/math2d-patterns.md`:

- **Default/Safe methods** that compute magnitude from two components SHALL use `hypot(x, y)` from `deterministic-kernels.ts` for overflow safety (handles components exceeding ~1.34e154).
- **Unchecked/hot-path methods** that compute magnitude from two components SHALL use `Math.sqrt(x*x + y*y)` for performance, accepting the overflow trade-off as the caller's responsibility.
- `Math.sqrt` on scalar values (not two-component magnitude) is always acceptable regardless of method tier (e.g., `frobeniusNorm` with 4-9 components, `sqrtSafe` on a single scalar, `Complex.sqrt` algebraic results).

This pattern is currently established by precedent in `Vector2.normalize` (uses `hypot`) vs `Vector2.normalizeUnchecked` (uses `Math.sqrt`) and `Complex.normalize` vs `Complex.normalizeUnchecked`, but is not explicitly documented anywhere. The audit found 5 violations of this pattern in Unchecked methods that use `hypot` when they should use `Math.sqrt`.

#### Scenario: Developer reads math2d-patterns.md

- **WHEN** a developer reads the performance patterns section of `.claude/rules/math2d-patterns.md`
- **THEN** the document SHALL contain a clear rule specifying when to use `hypot` vs `Math.sqrt` for magnitude computation based on method tier

### Requirement: Unchecked methods use Math.sqrt instead of hypot for magnitude

The following 5 Unchecked methods currently use `hypot` for two-component magnitude computation. They SHALL be changed to use `Math.sqrt(x*x + y*y)` to match the established performance pattern (consistent with `Vector2.normalizeUnchecked` and `Complex.normalizeUnchecked` which already use `Math.sqrt`).

**Verified violations:**

1. `Vector2.directionUnchecked()` static at `vector2.ts:1401` -- uses `hypot(dx, dy)`
2. `Vector2.setMagnitudeUnchecked()` static at `vector2.ts:1809` -- uses `hypot(v.x, v.y)`
3. `Vector2.setMagnitudeUnchecked()` instance at `vector2.ts:3681` -- uses `hypot(this.x, this.y)`
4. `Rotation2.normalizeUnchecked()` static at `rotation2.ts:744` -- uses `hypot(rotation.cos, rotation.sin)`
5. `Rotation2.normalizeUnchecked()` instance at `rotation2.ts:1329` -- uses `hypot(this.cos, this.sin)`

These were verified by reading every occurrence of `Math.sqrt` (20 total) and `hypot` (32 total) across all source files. No other violations exist.

**Non-violations verified (correctly using Math.sqrt in non-magnitude contexts):**

- `frobeniusNorm` in Matrix2/Matrix3 uses `Math.sqrt` with 4/9 components (hypot only takes 2 args)
- `Complex.sqrt` uses `Math.sqrt` on algebraic scalar results bounded by a prior `hypot` call
- `sqrtSafe` is a scalar utility, not a magnitude computation
- `acos`/`asin` in deterministic kernels use `Math.sqrt(1 - x*x)` for trig identities

#### Scenario: directionUnchecked uses Math.sqrt after fix

- **WHEN** `Vector2.directionUnchecked(from, to, out)` is called
- **THEN** the implementation SHALL compute distance via `Math.sqrt(dx*dx + dy*dy)` (not `hypot(dx, dy)`)

#### Scenario: setMagnitudeUnchecked uses Math.sqrt after fix

- **WHEN** `Vector2.setMagnitudeUnchecked(v, magnitude, out)` is called
- **THEN** the implementation SHALL compute length via `Math.sqrt(v.x*v.x + v.y*v.y)` (not `hypot(v.x, v.y)`)

#### Scenario: Rotation2.normalizeUnchecked uses Math.sqrt after fix

- **WHEN** `Rotation2.normalizeUnchecked(rotation, out)` is called
- **THEN** the implementation SHALL compute magnitude via `Math.sqrt(cos*cos + sin*sin)` (not `hypot(cos, sin)`)

#### Scenario: Existing correct Unchecked methods are not affected

- **WHEN** `Vector2.normalizeUnchecked(v, out)` or `Complex.normalizeUnchecked(z, out)` is called
- **THEN** the implementation SHALL continue using `Math.sqrt` as it already does (no change needed)

#### Scenario: Default/Safe methods continue using hypot

- **WHEN** `Vector2.magnitude(v)`, `Vector2.normalize(v)`, `Vector2.distance(a, b)`, `Complex.magnitude(z)`, or any other default/safe magnitude method is called
- **THEN** the implementation SHALL continue using `hypot` (no change needed)
