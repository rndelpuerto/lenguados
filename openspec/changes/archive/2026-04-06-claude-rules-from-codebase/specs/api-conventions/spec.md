## ADDED Requirements

### Requirement: Allocation control patterns

Updated `.claude/rules/math2d-patterns.md` MUST detail the `out` parameter pattern, `ensureOut()` helper, and `Object.freeze()` for constants.

#### Scenario: Claude creates a new static method

- **WHEN** Claude writes a static method on a core class
- **THEN** it includes `out?: ClassName` as the last parameter
- **THEN** the method body starts with `return this.ensureOut(out).set(...)`
- **THEN** each class has a `private static ensureOut(out?: T): T` helper

#### Scenario: Claude creates a new static constant

- **WHEN** Claude adds a constant like `ZERO` or `IDENTITY`
- **THEN** it uses `public static readonly NAME = freezeXxx(new Xxx(...))` pattern
- **THEN** the freeze helper returns `ReadonlyXxx` type

### Requirement: Apply vs transform distinction

The rule MUST clarify with examples when to use `apply` vs `transform` naming.

#### Scenario: Claude names a new transformation method

- **WHEN** Claude creates a method that transforms coordinates
- **THEN** `apply` is used for operators acting on operands (Rotation2 applies to Vector2)
- **THEN** `transform` is used for spatial coordinate changes (Matrix3 transforms a point)

### Requirement: \*Like interface input/concrete output pattern

The rule MUST specify that input parameters use `Readonly*Like` and outputs use concrete types.

#### Scenario: Claude writes a method signature

- **WHEN** Claude defines parameters for a static method
- **THEN** input vectors are typed as `ReadonlyVector2Like`, not `Vector2`
- **THEN** the return type is `Vector2` (concrete), not `Vector2Like`

### Requirement: Instance method chaining contract

The rule MUST specify that instance methods mutate `this` and return `this`.

#### Scenario: Claude creates a new instance method

- **WHEN** Claude writes an instance method on a core class
- **THEN** it mutates `this`, returns `this`, and the return type is `this`
- **THEN** no new object allocation occurs in the method body
