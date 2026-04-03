## NOTE: Infinity guard functions — REVERSED

The deprecation of `isPositiveInfinity`, `isNegativeInfinity`, `isInfinity` was proposed but REVERSED during adversarial review. The prior foundations audit (`openspec/changes/archive/2026-03-06-audit-math2d-foundations/findings/04-auxiliary-numeric.md:332-334`) explicitly gave verdict "Keep" for all three as "Readability helpers." Additionally, the suggested replacement for `isInfinity` (`!isFinite(value) && !isNaN(value)`) is more error-prone than the named function.

---

## MODIFIED Requirements

### Requirement: Layer dependency — deterministic SHALL NOT import from auxiliary

The `deterministic/deterministic-kernels.ts` module SHALL NOT import from `auxiliary/scalar/constants.ts`. Currently at line 29 it imports `{ HALF_PI, PI, QUARTER_PI }` from the auxiliary layer, creating a bidirectional dependency (auxiliary imports from deterministic, deterministic imports from auxiliary).

The module SHALL define its own local copies of `PI`, `HALF_PI`, and `QUARTER_PI` internally, with cross-reference comments to the canonical definitions in `auxiliary/scalar/constants.ts`.

**CORRECTION**: The original audit incorrectly stated the import was `EPSILON`. The actual import is `{ HALF_PI, PI, QUARTER_PI }`.

#### Scenario: deterministic module has no upward imports

- **WHEN** the import statements of `deterministic/deterministic-kernels.ts` are inspected
- **THEN** no import SHALL reference any path containing `auxiliary/`
- **AND** all imports SHALL reference only `types/` or be relative within `deterministic/`

#### Scenario: Constant values are consistent

- **WHEN** the `PI`, `HALF_PI`, `QUARTER_PI` defined in `deterministic/deterministic-kernels.ts` and the corresponding values in `auxiliary/scalar/constants.ts` are compared
- **THEN** they SHALL have identical values (`Math.PI`, `Math.PI / 2`, `Math.PI / 4`)

---

### Requirement: Rotation2.fromCS documentation accuracy

The JSDoc for `Rotation2.fromCS(cos, sin)` SHALL document that the `set()` method (called internally) normalizes the input to ensure a unit rotation, but the constructor does NOT normalize. Users relying on exact cos/sin values without normalization should use the constructor directly.

#### Scenario: fromCS JSDoc mentions normalization

- **WHEN** the JSDoc of `Rotation2.fromCS` is inspected
- **THEN** it SHALL contain a `@remarks` section explaining that `set()` normalizes the cos/sin pair to unit length

#### Scenario: Constructor JSDoc mentions no normalization

- **WHEN** the JSDoc of the `Rotation2` constructor is inspected
- **THEN** it SHALL contain a `@remarks` warning that the constructor does NOT normalize, and callers are responsible for providing a valid unit rotation

---

### Requirement: inRange and isInRange cross-reference disambiguation

The JSDoc for `inRange(value, min, max, epsilon?)` and `isInRange(value, min, max)` SHALL cross-reference each other with a clear explanation of the difference:

- `inRange` — epsilon-tolerant, returns true if `value` is within `[min - epsilon, max + epsilon]`
- `isInRange` — exact comparison, returns true if `value` is within `[min, max]`

#### Scenario: inRange JSDoc references isInRange

- **WHEN** the JSDoc of `inRange` is inspected
- **THEN** it SHALL contain a `@see` tag referencing `isInRange` with explanation: "For exact (non-tolerant) range checking"

#### Scenario: isInRange JSDoc references inRange

- **WHEN** the JSDoc of `isInRange` is inspected
- **THEN** it SHALL contain a `@see` tag referencing `inRange` with explanation: "For epsilon-tolerant range checking"
