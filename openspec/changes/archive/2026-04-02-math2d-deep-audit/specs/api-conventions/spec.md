## ADDED Requirements

### Requirement: R-README-CODE-SYNC

All export names, method names, and API signatures shown in the README MUST be validated against the actual source code. Any discrepancy between README and code is classified as a P1 documentation bug.

#### Scenario: README audit check

- **WHEN** a README mentions an export or method name
- **THEN** that name exists in the package's `index.ts` exports or on the referenced type
- **AND** the signature matches the actual implementation
