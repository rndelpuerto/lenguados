## MODIFIED Requirements

### Requirement: ARCHITECTURE.md Mermaid diagram SHALL match actual imports

The dependency graph in `packages/math2d/ARCHITECTURE.md` SHALL accurately reflect the actual import statements across all source files.

**Evidence (import tracing across 32 source files):**

Missing edges (actual imports not shown in diagram):

1. `Utils → Auxiliary`: random.ts imports sqrtSafe, TAU, lerp; parse.ts imports DEG_TO_RAD
2. `Utils → Deterministic`: random.ts imports cos, sin, log; parse.ts imports atan2
3. `Utils → Types`: random.ts imports ReadonlyVector2Like (type-only)
4. `Utils → Validation`: random.ts imports assertNonNegative
5. `Auxiliary → Types`: operations.ts imports SinCos type
6. `Core → Validation`: 6 of 7 core files import assert functions
7. `Deterministic → Types`: imports SinCos (type-only)

Incorrect edges (shown but don't exist): 8. `Validation → Core`: Direction is reversed. Core imports FROM validation, not the other way. 9. `Validation → Auxiliary`: Does not exist. Validation imports only from Types.

#### Scenario: diagram accuracy

- **GIVEN** the ARCHITECTURE.md Mermaid diagram
- **WHEN** compared against `grep -r "import" packages/math2d/src/`
- **THEN** every import relationship SHALL have a corresponding edge in the diagram
- **AND** no edge SHALL exist without a corresponding import

### Requirement: architecture-and-layers.md SHALL document validation as cross-cutting

The `.claude/rules/architecture-and-layers.md` file SHALL document that:

- Validation is a cross-cutting concern imported by Core and Utils (NOT by Auxiliary — verified via grep: 0 imports from validation in auxiliary/)
- Validation itself only imports from Types
- The direction of import is FROM other layers TO validation (not the reverse)

### Requirement: code-style.md member ordering SHALL match tsdoc-conventions.md

The class member ordering in `.claude/rules/code-style.md` SHALL be updated to match the ordering described in `.claude/rules/tsdoc-conventions.md`, which is the ordering all source code actually follows.

**Evidence**: All 7 core type files follow the tsdoc-conventions.md ordering:

1. Private helpers (ensureOut)
2. Static constants (ZERO, ONE)
3. Static factories (from\*)
4. Static methods
5. Instance properties
6. Constructor
7. Instance methods

The code-style.md ordering (public fields → private fields → private static → ...) does not match any source file.
