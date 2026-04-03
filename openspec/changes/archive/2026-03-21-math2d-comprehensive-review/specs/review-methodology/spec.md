## ADDED Requirements

### Requirement: Layer agent reviews every assigned file

Each layer agent SHALL read every source file in its assigned scope and produce findings for each file. An agent MUST NOT report completion without having read and analyzed every assigned file.

#### Scenario: Agent reviews all files in scope

- **WHEN** a layer agent is assigned files `[A.ts, B.ts, C.ts]`
- **THEN** the agent's report SHALL contain analysis sections for each of A.ts, B.ts, and C.ts
- **AND** each section SHALL reference specific line numbers from the actual source code

#### Scenario: Agent finds no issues in a file

- **WHEN** a layer agent reviews a file and finds no issues
- **THEN** the agent SHALL explicitly state "No findings" for that file rather than omitting it

### Requirement: Findings include verifiable evidence

Every finding SHALL include: file path, line number(s), current behavior description, recommended change, justification citing one of the 3 library pillars (Completeness, Performance, Safety), priority (P0-P3), and breaking change flag (yes/no).

#### Scenario: Complete finding entry

- **WHEN** an agent identifies an issue at `core/vector2.ts:150`
- **THEN** the finding entry SHALL contain all 7 required fields
- **AND** the line number SHALL match the actual source code location

#### Scenario: Finding with NaN edge case

- **WHEN** an agent identifies a method that does not handle NaN input
- **THEN** the finding SHALL specify the exact NaN propagation behavior observed
- **AND** SHALL reference the library's Safety pillar for justification

#### Scenario: Finding with Infinity edge case

- **WHEN** an agent identifies a method that does not handle Infinity input
- **THEN** the finding SHALL specify whether the method produces correct results for +-Infinity
- **AND** SHALL distinguish between "silent wrong result" (P0) and "throws appropriately" (no finding)

### Requirement: Cross-type pattern consistency verification

The pattern consistency agent (X1) SHALL build a complete matrix of patterns across all 7 core types and identify gaps. Patterns include: negate triple (static/instance/getter), inverse triple, clone/copy, equality (equals/nearEquals), component-wise ops (abs/floor/ceil/round/trunc/sign/min/max/clamp/mod), factory methods, and predicates.

#### Scenario: Pattern matrix identifies missing operation

- **WHEN** 6 of 7 core types implement a pattern but 1 does not
- **THEN** X1 SHALL flag the missing implementation with priority P1 or higher
- **AND** SHALL note whether the missing operation is mathematically meaningful for that type

#### Scenario: Pattern matrix with type-specific exclusions

- **WHEN** a pattern does not apply to a specific type (e.g., component-wise `floor` on Rotation2)
- **THEN** X1 SHALL mark it as "N/A" with a mathematical justification rather than flagging it as missing

### Requirement: Layer dependency verification

The dependency auditor (X2) SHALL verify that no file imports from a higher layer. Layer order (bottom to top): deterministic → auxiliary → core → types → validation → utils. The index.ts barrel files are the only exception (they re-export from within their own layer).

#### Scenario: Circular dependency detected

- **WHEN** a file in `deterministic/` imports from `auxiliary/` or higher
- **THEN** X2 SHALL flag it as P0 with "layer violation" category

#### Scenario: Valid downward dependency

- **WHEN** a file in `core/` imports from `auxiliary/` or `deterministic/`
- **THEN** X2 SHALL NOT flag this as a violation

### Requirement: JSDoc accuracy verification

Each layer agent SHALL verify that JSDoc comments accurately describe the actual implementation behavior, including: parameter descriptions, return value descriptions, @example code, @throws documentation, and @remarks notes.

#### Scenario: JSDoc contradicts implementation

- **WHEN** a JSDoc comment says "values are used directly without normalization" but the method calls `normalize()`
- **THEN** the finding SHALL be categorized as P2 with "JSDoc inaccuracy" and include the correct description

#### Scenario: Missing JSDoc on public method

- **WHEN** a public static or instance method lacks JSDoc
- **THEN** the finding SHALL be categorized as P3

### Requirement: Adversarial review filters findings

The Philosophy Guardian (A1) SHALL review every finding and reject those that contradict the library's pillars. The DX Advocate (A2) SHALL reject findings that harm developer experience without proportional benefit.

#### Scenario: Finding contradicts completeness pillar

- **WHEN** a finding recommends removing a mathematically valid operation "because no one uses it"
- **THEN** A1 SHALL reject the finding citing the Completeness pillar

#### Scenario: Finding adds verbosity without benefit

- **WHEN** a finding recommends renaming a well-established method for "consistency" but the rename would break discoverability
- **THEN** A2 SHALL flag the finding with a DX concern

### Requirement: Tolerance handling verification

Each core type agent SHALL verify that floating-point comparisons use appropriate tolerance values and that the tolerance is consistent with `EPSILON = 1e-10`.

#### Scenario: Hard equality on floats

- **WHEN** a method compares floating-point values using `===` where approximate comparison is expected
- **THEN** the finding SHALL be P1 with "unsafe float comparison"

#### Scenario: Correct tolerance usage

- **WHEN** a method uses `nearEquals` with the library's EPSILON constant
- **THEN** no finding SHALL be generated for that comparison
