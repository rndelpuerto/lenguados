## ADDED Requirements

### Requirement: Layer dependency enforcement

Rule file `.claude/rules/architecture-and-layers.md` MUST specify the exact unidirectional layer dependency graph with concrete import rules.

#### Scenario: Claude adds an import to an auxiliary module

- **WHEN** Claude edits a file in `src/auxiliary/`
- **THEN** it only imports from `src/deterministic/` and `src/types/` (lower layers)
- **THEN** it NEVER imports from `src/core/`, `src/validation/`, or `src/utils/`

#### Scenario: Claude adds an import to a core module

- **WHEN** Claude edits a file in `src/core/`
- **THEN** it may import from `src/auxiliary/`, `src/deterministic/`, and `src/types/`
- **THEN** circular dependencies between core classes use `Readonly*Like` interfaces, not direct class imports

### Requirement: Deterministic function classification

The rule MUST explicitly classify which math functions require fdlibm kernels vs which are IEEE 754 safe.

#### Scenario: Claude uses a trig function

- **WHEN** Claude needs `sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`, or `hypot`
- **THEN** it imports from `../deterministic/deterministic-kernels`, never from `Math.*`

#### Scenario: Claude uses sqrt or floor

- **WHEN** Claude needs `sqrt`, `floor`, `ceil`, `abs`, `min`, `max`, `round`, `trunc`, `sign`
- **THEN** it uses `Math.*` directly (IEEE 754 required operations, deterministic by standard)

### Requirement: Two-layer validation architecture

The rule MUST document the assertion + safe function dual-layer system and DCE policy.

#### Scenario: Claude adds validation to a new method

- **WHEN** Claude adds input validation to a method in `src/core/`
- **THEN** assertions use `assertFinite(value, 'ClassName.methodName:paramName')` naming pattern
- **THEN** assertions are guarded by DEV_MODE (stripped in production via DCE)
- **THEN** `*Safe` variants use always-active runtime checks (never stripped)

### Requirement: Design philosophy awareness

The rule MUST document intentional SOLID violations with rationale, so Claude doesn't "fix" deliberate patterns.

#### Scenario: Claude reviews loop-unrolled matrix multiplication

- **WHEN** Claude sees manually unrolled operations (e.g., 9 explicit multiplications in Matrix3.multiply)
- **THEN** it does NOT refactor into a loop (V8 cannot reliably inline nested loops in hot math functions)

#### Scenario: Claude considers adding class inheritance

- **WHEN** Claude considers using `extends` on a core math class
- **THEN** it uses composition instead (V8 Hidden Classes optimization — inheritance branches the optimization path)

### Requirement: Constructor purity

The rule MUST specify that constructors have NO assertions and accept all values including NaN/Infinity.

#### Scenario: Claude creates a constructor for a new math type

- **WHEN** Claude writes a constructor for a core class
- **THEN** it has default parameter values (identity/zero), no assertions, and a comment explaining the lack of validation

### Requirement: Path scoping

The rule MUST use `paths: ['packages/math2d/src/**']` frontmatter.

#### Scenario: Claude edits documentation files

- **WHEN** Claude edits `docs/docs/math2d/architecture.md`
- **THEN** the architecture-and-layers rule is NOT loaded
