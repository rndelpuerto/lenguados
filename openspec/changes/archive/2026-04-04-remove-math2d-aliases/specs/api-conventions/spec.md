## MODIFIED Requirements

### Requirement: Deprecation pattern for obsolete methods

Methods identified as obsolete by audits SHALL be marked with `@deprecated` JSDoc tag before removal. The tag SHALL include the target removal version and migration guidance.

**Exception for pre-1.0 alias removal:** Aliases identified and removed as part of the alias cleanup (pre-1.0) MAY be removed without a deprecation cycle, since there are no stable API guarantees yet. Post-1.0, all removals SHALL follow the deprecation pattern.

#### Scenario: Deprecated method has JSDoc tag

- **WHEN** a method is deprecated post-1.0
- **THEN** its JSDoc SHALL include `@deprecated` with format: `@deprecated Since <version>. <Migration guidance>. Will be removed in <target version>.`

#### Scenario: Deprecated method still functions

- **WHEN** a deprecated method is called
- **THEN** it SHALL produce the same result as before deprecation (no behavioral change)

#### Scenario: Pre-1.0 alias removal without deprecation

- **WHEN** an alias is removed before version 1.0
- **THEN** the removal MAY proceed without a deprecation cycle
- **AND** the CHANGELOG SHALL document the removal and the canonical replacement name

## ADDED Requirements

### Requirement: No naming aliases in public API

The `@lenguados/math2d` public API SHALL NOT contain naming aliases — methods or properties whose sole purpose is to delegate to another method/property with no added logic. Each public operation SHALL have exactly one name.

#### Scenario: No pure delegation methods exist

- **WHEN** the public methods of all core types are inspected
- **THEN** no method SHALL have a body consisting solely of `return this.otherMethod(args)` or `return ClassName.otherMethod(args)` where both methods are public and have the same parameters (excepting `toJSON` protocol methods)

#### Scenario: Protocol methods are exempt

- **WHEN** `toJSON()` methods are inspected
- **THEN** they SHALL be allowed to delegate to `toObject()` as this is a JavaScript protocol implementation, not a naming alias
