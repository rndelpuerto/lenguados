## Requirements

_Synced from delta spec: `openspec/changes/implement-audit-p1-p2-fixes/specs/audit-p2-additions` (2026-04-02)_

### Requirement: Vector2.moveTowards static method

`Vector2.moveTowards` SHALL move a vector towards a target by at most `maxDelta` distance. It SHALL accept `(current: ReadonlyVector2Like, target: ReadonlyVector2Like, maxDelta: number, out?: Vector2)` and return a `Vector2`.

#### Scenario: Move towards target within maxDelta

- **WHEN** `Vector2.moveTowards({x:0, y:0}, {x:10, y:0}, 3)` is called
- **THEN** the result SHALL be `(3, 0)` (moved 3 units towards target)

#### Scenario: Target within maxDelta distance

- **WHEN** `Vector2.moveTowards({x:0, y:0}, {x:2, y:0}, 5)` is called
- **THEN** the result SHALL be `(2, 0)` (reached target exactly, not overshooting)

#### Scenario: Zero maxDelta

- **WHEN** `Vector2.moveTowards({x:1, y:2}, {x:5, y:6}, 0)` is called
- **THEN** the result SHALL be `(1, 2)` (no movement)

#### Scenario: Negative maxDelta moves away

- **WHEN** `Vector2.moveTowards({x:0, y:0}, {x:3, y:4}, -2)` is called
- **THEN** the result SHALL move away from the target by 2 units

#### Scenario: Current equals target

- **WHEN** `Vector2.moveTowards({x:5, y:5}, {x:5, y:5}, 10)` is called
- **THEN** the result SHALL be `(5, 5)` (no movement, already at target)

#### Scenario: NaN or Infinity inputs

- **WHEN** any input component is NaN or Infinity
- **THEN** the behavior SHALL be consistent with other Vector2 methods (NaN propagation)

#### Scenario: Out parameter reuse

- **WHEN** an `out` parameter is provided
- **THEN** the result SHALL be written to `out` and `out` SHALL be returned

---

### Requirement: Vector2.moveTowards instance method

The instance method `moveTowards` SHALL mutate `this` to move towards the target and return `this` for chaining. It SHALL accept `(target: ReadonlyVector2Like, maxDelta: number)`.

#### Scenario: Instance method chaining

- **WHEN** `new Vector2(0, 0).moveTowards({x:10, y:0}, 3)` is called
- **THEN** `this` SHALL be mutated to `(3, 0)` and `this` SHALL be returned

---

### Requirement: Matrix2.fromAngleScale factory

`Matrix2.fromAngleScale` SHALL create a 2x2 matrix combining rotation and non-uniform scale in a single pass: `[cos*sx, -sin*sy; sin*sx, cos*sy]`. It SHALL accept `(angle: number, scaleX: number, scaleY: number, out?: Matrix2)`.

#### Scenario: Identity rotation with uniform scale

- **WHEN** `Matrix2.fromAngleScale(0, 2, 2)` is called
- **THEN** the result SHALL equal `Matrix2.fromScale({x:2, y:2})` within EPSILON

#### Scenario: 90-degree rotation with no scale

- **WHEN** `Matrix2.fromAngleScale(Math.PI/2, 1, 1)` is called
- **THEN** the result SHALL equal `Matrix2.fromRotation(Math.PI/2)` within EPSILON

#### Scenario: Combined rotation and non-uniform scale

- **WHEN** `Matrix2.fromAngleScale(Math.PI/4, 2, 3)` is called
- **THEN** the result SHALL equal `Matrix2.multiply(Matrix2.fromRotation(Math.PI/4), Matrix2.fromScale({x:2, y:3}))` within EPSILON

#### Scenario: Decomposition round-trip

- **WHEN** a matrix is created via `fromAngleScale(angle, sx, sy)` and then decomposed
- **THEN** the extracted rotation SHALL match `angle` and scale SHALL match `(sx, sy)` within EPSILON

---

### Requirement: Vector2.sumComponents is retained as a core primitive

`Vector2.sumComponents` SHALL be a non-deprecated public method. It is a fundamental scalar reduction (component sum) used as a building block for Manhattan norms, barycentric coordinate validation, diagonal matrix traces, and divergence approximations. As math2d is a low-level mathematical library, this primitive is retained for downstream consumers.

#### Scenario: No deprecation warning

- **WHEN** a user references `Vector2.sumComponents` in TypeScript with strict settings
- **THEN** the IDE SHALL NOT show a deprecation strikethrough or warning

#### Scenario: Functionality

- **WHEN** `Vector2.sumComponents({x:3, y:4})` is called
- **THEN** the result SHALL be `7`

---

### Requirement: Cross-documentation for neumaierSum and robustSum

Both `neumaierSum` and `robustSum` SHALL include `@see` JSDoc tags referencing each other, with guidance on when to use each.

#### Scenario: robustSum documentation

- **WHEN** a user reads the JSDoc for `robustSum`
- **THEN** they SHALL see a `@see neumaierSum` reference explaining that Neumaier is preferred for values of varying magnitudes

#### Scenario: neumaierSum documentation

- **WHEN** a user reads the JSDoc for `neumaierSum`
- **THEN** they SHALL see a `@see robustSum` reference explaining that Kahan is simpler and sufficient for values of similar magnitudes

---

### Requirement: compensatedProduct use case documentation

`compensatedProduct` SHALL include a `@example` JSDoc tag showing a high-precision dot product accumulation use case.

#### Scenario: Example in documentation

- **WHEN** a user reads the JSDoc for `compensatedProduct`
- **THEN** they SHALL see an example demonstrating its use for computing precise dot products

---

### Requirement: inRange vs isInRange distinction documentation

`inRange` (comparison.ts) and `isInRange` (guards.ts) SHALL include `@see` cross-references explicitly stating "epsilon-tolerant" vs "exact".

#### Scenario: inRange documentation

- **WHEN** a user reads the JSDoc for `inRange` in comparison.ts
- **THEN** they SHALL see a note: "For exact (non-tolerant) range checking, see {@link isInRange}"

#### Scenario: isInRange documentation

- **WHEN** a user reads the JSDoc for `isInRange` in guards.ts
- **THEN** they SHALL see a note: "For epsilon-tolerant range checking, see {@link inRange}"

---

### Requirement: Parse round-trip limitation documentation

Parse functions (`parseVector2`, `parseMatrix2`, etc.) SHALL document that they only handle finite numeric values, and that non-finite values serialized via format functions cannot be round-tripped.

#### Scenario: parseVector2 documentation

- **WHEN** a user reads the JSDoc for `parseVector2`
- **THEN** they SHALL see a note about non-finite value limitations
