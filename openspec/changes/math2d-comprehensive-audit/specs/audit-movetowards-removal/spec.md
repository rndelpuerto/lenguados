## REMOVED Requirements

### Requirement: Vector2.moveTowards static and instance methods

**Reason**: `moveTowards` is a simulation/gameplay convenience, not a mathematical primitive. The comprehensive audit established the following irrefutable evidence:

1. **0 out of 7 pure math libraries** have it (Eigen, NumPy, GLM, Apache Commons Math, Boost.Math, MathNet, CGAL).
2. **0 out of 5 applied math/graphics libraries** have it (glMatrix, Three.js, p5.js, Box2D, Matter.js).
3. **Only game engines** have it (Unity, Godot, Unreal, Pygame, Chipmunk2D) -- and their naming reveals intent: Chipmunk calls it `cpvlerpconst` ("lerp at constant speed"), Unreal calls it `FInterpConstantTo` ("interpolate constant to").
4. **The `maxDelta` parameter has units of distance-per-frame**, making the operation inherently frame-rate-dependent -- a simulation concept, not a mathematical one. Compare with `lerp(a, b, t)` where `t` is dimensionless.
5. **Composes trivially** from 3 existing primitives: `subtract` + `limit` + `add`:
   ```typescript
   Vector2.add(current, Vector2.limit(Vector2.subtract(target, current, tmp), maxDelta, tmp), out);
   ```
6. **The project's own ratified previous audit** (archived at `openspec/changes/archive/2026-04-03-math2d-deep-audit/`) explicitly rejected it with documented evidence: _"glm, nalgebra, Eigen all lack moveTowards (DEFINITIVE). The library's stated philosophy is 'pure mathematical primitives' not 'game engine conveniences.'"_
7. **No internal consumers**: no other method in math2d calls `moveTowards`.
8. **Unreleased API**: tagged `@since 0.8.0`, package is at 0.6.0 -- zero external breakage.
9. **Precedent risk**: keeping it invites `moveTowardsAngle`, `smoothDamp`, `smoothDampAngle`, `rotateTowards`, `accelerateTowards`, etc. -- drifting from "math foundation" to "game utility belt."

**Contrast with similar operations that DO belong:**

- `clampMagnitude` -- unary operator on a single vector (metric projection onto annulus), found in Three.js, p5.js, Unity, Godot, Chipmunk (5 libs).
- `limit` -- special case of `clampMagnitude`, same library presence.
- `lerp` -- dimensionless parametric interpolation, universal in all math libraries.
- `smoothStep` -- standard GLSL/HLSL Hermite function, found in GLM, Three.js, and game engines.

**Migration**: A future `@lenguados/physics2d` or `@lenguados/gameplay` package can implement it as a 3-line composition from existing math2d primitives.

#### Scenario: moveTowards no longer exists on Vector2

- **WHEN** a developer attempts to call `Vector2.moveTowards(current, target, maxDelta)`
- **THEN** the method SHALL NOT exist (compile error in TypeScript)

#### Scenario: moveTowards no longer exists as instance method

- **WHEN** a developer attempts to call `vector.moveTowards(target, maxDelta)`
- **THEN** the method SHALL NOT exist (compile error in TypeScript)

## ADDED Requirements

### Requirement: Analogous moveTowards operations are NOT added

The following operations SHALL NOT be added to `@lenguados/math2d`, as they are simulation/gameplay concepts with 0 presence in pure math libraries:

- `moveTowardsAngle(current, target, maxDelta)` -- angular version, composes from `angleDifference` + `clamp`. Only Unity and Godot have it.
- Scalar `moveTowards(current, target, maxDelta)` -- is literally `clamp(target, current - maxDelta, current + maxDelta)`.
- `smoothDamp` -- second-order ODE (critically-damped spring), requires mutable velocity state + `deltaTime`. Unambiguously physics.

These are documented here to prevent future re-proposals without new evidence.

#### Scenario: moveTowardsAngle is not added

- **WHEN** a developer searches for `moveTowardsAngle` in the math2d package
- **THEN** no such function SHALL exist

#### Scenario: smoothDamp is not added

- **WHEN** a developer searches for `smoothDamp` in the math2d package
- **THEN** no such function SHALL exist
