## ADDED Requirements

### Requirement: Markdown file conventions for package documentation

In addition to the existing TSDoc conventions, the project SHALL maintain conventions for markdown documentation files:

- All markdown files SHALL use ATX-style headers (`#`, `##`, `###`)
- All markdown files SHALL have a single H1 header as the first line
- Code blocks SHALL specify a language identifier (`typescript, `bash, etc.)
- Relative links between markdown files SHALL be verified to resolve correctly
- Tables SHALL use GitHub Flavored Markdown (GFM) pipe syntax
- Line length in prose SHALL be unrestricted (no hard wrapping) to allow flexible rendering

#### Scenario: Markdown file has single H1

- **WHEN** any markdown file in the project is inspected
- **THEN** it has exactly one H1 (`#`) header as its first content line

#### Scenario: Code blocks have language identifiers

- **WHEN** a fenced code block is found in any markdown file
- **THEN** it specifies a language identifier (e.g., `typescript, `bash, ```text)

#### Scenario: Internal links resolve

- **WHEN** a markdown file contains a relative link like `[text](./other-file.md)`
- **THEN** the linked file exists at the specified relative path

### Requirement: Documentation files maintain consistent terminology

All markdown documentation files SHALL use consistent terminology for project concepts:

- "triality" (not "trinity" or "three variants") for strict/safe/unchecked pattern
- "out parameter" (not "output parameter" or "result parameter")
- "\*CS variants" (not "precomputed sin/cos" without mentioning the CS naming)
- "column-major" (not "col-major" or "column major" without hyphen)
- "tree-shakeable" (not "tree shakeable" or "tree-shakable")
- "cross-platform determinism" (not "portable math" or "reproducible math" alone)

#### Scenario: Consistent triality terminology

- **WHEN** the strict/safe/unchecked pattern is referenced in any markdown file
- **THEN** the term "triality" is used at least once in the explanation

#### Scenario: Consistent out parameter terminology

- **WHEN** the allocation-control pattern is described
- **THEN** the term "out parameter" is used (with exact casing and spacing)
