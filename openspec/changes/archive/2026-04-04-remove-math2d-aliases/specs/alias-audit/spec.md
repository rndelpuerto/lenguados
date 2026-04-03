## ADDED Requirements

### Requirement: Complete alias inventory documented before removal

A complete inventory of all aliases in `@lenguados/math2d` SHALL be produced before any removals. The inventory SHALL cover every `.ts` file in `packages/math2d/src/` recursively, organized by directory and file.

#### Scenario: Inventory covers all core type files

- **WHEN** the alias inventory is reviewed
- **THEN** it SHALL contain entries (or explicit "no aliases found" notes) for all 7 core types: Vector2, Complex, Rotation2, Interval, Matrix2, Matrix3, Transform2

#### Scenario: Inventory covers non-core directories

- **WHEN** the alias inventory is reviewed
- **THEN** it SHALL contain entries (or explicit "no aliases found" notes) for: `auxiliary/`, `deterministic/`, `types/`, `validation/`, `utils/`

#### Scenario: Each alias entry has required fields

- **WHEN** an alias entry in the inventory is inspected
- **THEN** it SHALL contain: file path, line number(s), alias name, original name, type (method/property/constant/re-export), and a brief description of what the entity does

---

### Requirement: Multi-agent research for naming decisions

Each alias pair where the "better" name is not self-evident SHALL be evaluated using a structured multi-agent research process. The process SHALL include:

1. **Investigative agents**: Research naming conventions in at least 3 external libraries (e.g., glMatrix, Three.js, math.js, complex.js)
2. **Adversarial agent**: Present the strongest case for the name NOT chosen by the initial recommendation
3. **Integrator agent**: Synthesize all evidence and produce a final recommendation with rationale

#### Scenario: Complex angle vs argument is researched

- **WHEN** the `Complex.angle` vs `Complex.argument()` decision is evaluated
- **THEN** the research SHALL reference naming conventions in at least 3 external complex-number or math libraries
- **AND** the adversarial agent SHALL present the case for whichever name is NOT initially recommended
- **AND** the integrator agent SHALL produce a final recommendation citing specific evidence

#### Scenario: multiplyScalar vs scale is researched

- **WHEN** the `multiplyScalar` vs `scale` decision is evaluated
- **THEN** the research SHALL reference naming conventions in at least 3 external matrix/vector libraries
- **AND** the final recommendation SHALL cite which libraries use which name

---

### Requirement: toJSON/toObject pattern classified as non-alias

The `toJSON()` → `toObject()` delegation pattern across all 7 core types SHALL be classified as a "protocol implementation pattern" rather than an alias, and SHALL NOT be removed.

#### Scenario: toJSON is recognized as JavaScript protocol method

- **WHEN** the audit evaluates `toJSON()` methods
- **THEN** the audit SHALL classify them as "protocol implementation" not "alias"
- **AND** the rationale SHALL reference `JSON.stringify()` protocol requirements

#### Scenario: toObject remains independent

- **WHEN** the audit evaluates `toObject()` methods
- **THEN** the audit SHALL confirm `toObject()` serves an independent purpose (programmatic plain-object extraction)
- **AND** SHALL NOT recommend its removal or merging with `toJSON()`

---

### Requirement: lerpClamped classified as variant, not alias

The `lerpClamped` methods SHALL be classified as "behavioral variants" (they add clamping logic via `saturate(t)`) rather than aliases, and SHALL NOT be removed by this change.

#### Scenario: lerpClamped is not an alias

- **WHEN** the audit evaluates `lerpClamped` methods across all types
- **THEN** the audit SHALL classify them as "variants with added behavior" not "aliases"
- **AND** the rationale SHALL note that they add `saturate(t)` clamping before delegation
