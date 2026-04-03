## ADDED Requirements

### Requirement: Deprecation pattern for obsolete methods

Methods identified as obsolete by audits SHALL be marked with `@deprecated` JSDoc tag before removal. The tag SHALL include the target removal version and migration guidance.

#### Scenario: Deprecated method has JSDoc tag

- **WHEN** a method is deprecated
- **THEN** its JSDoc SHALL include `@deprecated` with format: `@deprecated Since <version>. <Migration guidance>. Will be removed in <target version>.`

#### Scenario: Deprecated method still functions

- **WHEN** a deprecated method is called
- **THEN** it SHALL produce the same result as before deprecation (no behavioral change)
