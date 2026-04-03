# API Conventions — Delta Spec (math2d-audit-fixes)

## Component-wise Operation Consistency

### REQ-CW-UNIFORM-1: All component-wise scalar operations on matrices

Matrix2 and Matrix3 SHALL provide the SAME set of component-wise scalar operations as Vector2. Specifically, `floor`, `ceil`, `round`, `trunc`, and `sign` SHALL NOT be deprecated or removed from Matrix2 or Matrix3.

**Rationale:** The library already provides `abs`, `min`, `max`, `clamp`, `mod`, `lerp`, `smoothStep` as component-wise operations on all three types (Vector2, Matrix2, Matrix3) without deprecation. All are the same category: scalar functions broadcast over components. There is no principled distinction between `abs` (kept) and `sign` (deprecated) — both are unary component-wise transforms.

### REQ-CW-UNIFORM-2: No @deprecated on component-wise operations

No component-wise scalar operation SHALL carry an `@deprecated` annotation on any core type. If an operation exists on Vector2 without deprecation, it SHALL exist on Matrix2 and Matrix3 without deprecation.

## Negate API Consistency

### REQ-NEGATE-TRIPLE-1: Every core type has negate triple

Every core numeric type (Vector2, Complex, Matrix2, Matrix3, Interval, Rotation2) SHALL provide:

1. A static `negate(input, out?)` method
2. An instance `negate()` method that mutates `this`
3. A `negated` getter that returns a new instance

### REQ-NEGATE-TRIPLE-2: Negated means component-wise sign flip

For all core types, `negated` SHALL perform component-wise sign negation on the type's stored components. For Interval, this includes the min/max swap required for interval negation semantics.

## No Legacy Code

### REQ-NO-DEPRECATED-1: Zero @deprecated annotations

The codebase SHALL contain zero `@deprecated` JSDoc annotations on any public API member. Items either exist (clean, final) or are removed entirely.
