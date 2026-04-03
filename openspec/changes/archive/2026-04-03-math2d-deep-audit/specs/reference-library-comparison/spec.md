## ADDED Requirements

### Requirement: MUST HAVE operations coverage — confirmed >95%

Operations present in 4+ reference libraries (gl-matrix, three.js, Box2D, Unity, Godot) SHALL all be present.

**Evidence:** Source code analyst verified against actual library code (DEFINITIVE confidence for all):

- gl-matrix vec2: all operations present in math2d
- Box2D b2Vec2/b2Rot/b2Mat22/b2Transform: all operations present in math2d
- three.js Vector2/Matrix3/MathUtils: all operations present in math2d
- Unity Vector2/Mathf: all operations present (except smoothDamp, which is correctly excluded as stateful)
- Godot Vector2/Transform2D: all operations present

#### Scenario: Scalar MUST HAVE verified

- **WHEN** the auxiliary/scalar module is examined
- **THEN** `lerp`, `clamp`, `sign`, `smoothStep`, `saturate`, `inverseLerp`, `remap`, `degToRad`/`radToDeg` SHALL all be present
- **THEN** all are CONFIRMED PRESENT

#### Scenario: Vector2 MUST HAVE verified

- **WHEN** the core/vector2 module is examined
- **THEN** `add`, `subtract`, `scale`, `dot`, `cross`, `normalize`, `magnitude`, `distance`, `negate`, `lerp`, `clamp`, `min`/`max`, `angle`, `rotate`, `project`, `reflect`, `perpendicular`, `equals`/`nearEquals` SHALL all be present
- **THEN** all are CONFIRMED PRESENT (~200 operations total)

#### Scenario: Rotation MUST HAVE verified

- **WHEN** the core/rotation2 module is examined
- **THEN** `fromAngle`, `multiply`, `inverse`, `apply`, `angle`, `lerp`, `identity` SHALL all be present
- **THEN** all are CONFIRMED PRESENT (91 members total)

#### Scenario: Matrix MUST HAVE verified

- **WHEN** Matrix2 and Matrix3 are examined
- **THEN** `identity`, `multiply`, `transpose`, `inverse`, `determinant`, `fromRotation`, `fromScale`, `transformVector` SHALL all be present
- **THEN** all are CONFIRMED PRESENT

#### Scenario: Transform MUST HAVE verified

- **WHEN** Transform2 is examined
- **THEN** `identity`, `multiply`, `inverse`, `transformPoint`, `transformVector`, `inverseTransformPoint`, `lerp` SHALL all be present
- **THEN** all are CONFIRMED PRESENT

### Requirement: SHOULD HAVE operations — confirmed or explicitly deferred

Operations present in 3 reference libraries SHALL either be present or have documented justification for exclusion.

#### Scenario: moveTowards — DEFERRED with irrefutable evidence

- **WHEN** `moveTowards` scalar and `moveTowardsAngle` are evaluated
- **THEN** they SHALL be DEFERRED per ratified 2026-03-20 spec
- **EVIDENCE:** glm, nalgebra, Eigen all lack `moveTowards` (DEFINITIVE from docs/source). Only game engines (Unity, Godot) include it. The operation composes trivially as `current + clamp(target - current, -maxDelta, maxDelta)`. The library's stated philosophy is "pure mathematical primitives" not "game engine conveniences."

#### Scenario: slerp on Vector2 — CONFIRMED PRESENT

- **WHEN** `Vector2.slerp` is examined
- **THEN** it SHALL be CONFIRMED PRESENT with proper magnitude interpolation and edge case handling

#### Scenario: smoothDamp — correctly excluded

- **WHEN** `smoothDamp` is evaluated
- **THEN** it SHALL NOT be added — it is stateful (requires velocity state between frames), making it inappropriate for a pure math library

### Requirement: NICE TO HAVE operations — selectively added based on math primitive criteria

Operations present in 1-2 libraries SHALL be added ONLY where they serve the pure math foundation objective.

**Selection criteria (established by this audit + historical reconciliation):**

1. Is it a mathematical primitive (not a convenience composition)?
2. Does Box2D have an equivalent? (If yes, strong signal for physics relevance)
3. Does it complete a mathematical family? (e.g., L-inf norm completes L1/L2/L-inf)
4. Is it needed for constraint solving, broadphase, or integration? (downstream physics use)

#### Scenario: Matrix2.fromDiagonal — ADDED

- **EVIDENCE:** Diagonal matrices represent axis-aligned mass/inertia. Used universally in physics constraint solvers.
- **THEN** it SHALL be added to `core/matrix2.ts`

#### Scenario: Matrix2.fromReflection — ADDED

- **EVIDENCE:** Householder `I - 2nnᵀ` (DEFINITIVE: Wikipedia, PlanetMath, Cornell CS 6210). Matrix3.fromReflection already exists (added 2026-03-20). Pure linear algebra primitive.
- **THEN** it SHALL be added to `core/matrix2.ts`

#### Scenario: Matrix2.solveLinearSystem — ADDED

- **EVIDENCE:** Box2D's `b2Solve22` uses Cramer's rule for 2x2 (DEFINITIVE from source). Cramer's rule is numerically appropriate for 2x2. Every 2D physics constraint solver needs this.
- **THEN** it SHALL be added to `core/matrix2.ts` with three tiers

#### Scenario: Matrix3.inverseAffine — ADDED

- **EVIDENCE:** Exploits [0,0,1] bottom row (reduces 9 cofactors to 4). Godot distinguishes `inverse()` from `affine_inverse()` (DEFINITIVE from source). Performance win for the primary use case.
- **THEN** it SHALL be added to `core/matrix3.ts` with three tiers

#### Scenario: Vector2 chebyshev metrics — ADDED (lowest priority)

- **EVIDENCE:** Completes L1/L2/L-inf norm family. Mathematical completeness, not gameplay convenience.
- **THEN** `chebyshevLength` and `chebyshevDistance` SHALL be added as lowest-priority P4

#### Scenario: Interval.distance — ADDED

- **EVIDENCE:** Pure interval arithmetic: `max(0, max(a.min - b.max, b.min - a.max))`. Needed for SAT separation.
- **THEN** it SHALL be added to `core/interval.ts`

#### Scenario: Interval.enclosing — ADDED

- **EVIDENCE:** Pure interval operation: `[min(a.min, v), max(a.max, v)]`. Matches Box2D `b2AABB::Combine` pattern.
- **THEN** it SHALL be added to `core/interval.ts`

#### Scenario: Rotation2.angleBetween — ADDED

- **EVIDENCE:** Allocation-free signed angle. Physics engines compute angular differences thousands of times per frame.
- **THEN** it SHALL be added to `core/rotation2.ts`

#### Scenario: Complex.fromRotation2 — ADDED

- **EVIDENCE:** Symmetry completion with `Rotation2.fromComplex`.
- **THEN** it SHALL be added to `core/complex.ts`

#### Scenario: Matrix2.transformVectorTranspose — DEFERRED

- **EVIDENCE:** Devil's advocate correctly noted this is trivially inlined for 2x2 (`m00*vx+m01*vy, m10*vx+m11*vy`). Constraint solving is explicitly a downstream concern per project non-goals.
- **THEN** it SHALL NOT be added (deferred to downstream packages)

### Requirement: Operations explicitly excluded from scope

Certain categories SHALL NOT be added per the project's pure-math-foundation philosophy.

**Evidence:** Design philosophy established across 6 audit phases (2026-03-06 through 2026-04-02).

#### Scenario: Geometry types excluded

- **WHEN** the audit recommends additions
- **THEN** it SHALL NOT recommend AABB, Circle, Ray2, Line2, or Polygon types

#### Scenario: Physics algorithms excluded

- **WHEN** the audit recommends additions
- **THEN** it SHALL NOT recommend SAT, GJK, collision detection, or constraint solvers

#### Scenario: Advanced linear algebra excluded

- **WHEN** the audit recommends additions
- **THEN** it SHALL NOT recommend eigendecomposition, SVD, LU decomposition, or matrix exponential

#### Scenario: Hyperbolic functions excluded

- **WHEN** the audit recommends additions
- **THEN** it SHALL NOT recommend sinh, cosh, tanh deterministic kernels

#### Scenario: Stateful operations excluded

- **WHEN** the audit recommends additions
- **THEN** it SHALL NOT recommend `smoothDamp` or any operation requiring state between frames

### Requirement: Overall coverage assessment

The audit SHALL document the library's position relative to reference libraries.

#### Scenario: Coverage confirmation

- **WHEN** the complete API surface is assessed
- **THEN** the library SHALL cover >95% of MUST HAVE operations (CONFIRMED)
- **THEN** the library SHALL exceed gl-matrix (CONFIRMED: math2d has ~200 Vector2 ops vs gl-matrix ~40)
- **THEN** the library SHALL exceed Box2D math layer (CONFIRMED: math2d adds Complex, Interval, angle utilities, three-tier validation)
- **THEN** the library SHALL be comparable to Unity/Godot Vector2 API (CONFIRMED: near-complete coverage minus smoothDamp and moveTowards which are correctly deferred)
- **THEN** the remaining gaps SHALL be limited to the P4 additions listed above
