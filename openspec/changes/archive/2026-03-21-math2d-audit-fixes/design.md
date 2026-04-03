## Context

A 12-agent audit applied 26 `@deprecated` annotations and other changes to @lenguados/math2d. Post-audit expert review (5 specialized agents + 4 verification agents) determined that many deprecations were incorrect — they violated the library's own design principles of completeness, consistency, and DX. The library's philosophy: "completeness over minimalism", every core type must have all operations for its algebraic structure. Code must be definitive — no `@deprecated` annotations, no aliases, no legacy.

Current uncommitted state: 18 files modified with a mix of correct changes (smoothStep fix, layer dependency fix, Matrix3.fromReflection, Transform2.iterator) and incorrect changes (most @deprecated annotations).

## Goals / Non-Goals

**Goals:**

- Remove ALL `@deprecated` annotations — each item is either kept (clean) or deleted (gone)
- Delete 15 constants that don't serve algebraic, geometric, or practical purposes
- Restore 5 constants that serve documented design principles (symmetry, DX, angular ranges)
- Restore 20 matrix methods to fix component-wise operation consistency
- Fix Rotation2.negated bug (computes conjugation, not negation)
- Add Rotation2.negate() static + instance for API symmetry with all other core types
- Delete orphaned tests for deleted constants
- All 3225+ existing tests pass after changes

**Non-Goals:**

- Adding new constants beyond what already exists (e.g., UNIT_ANTIDIAGONAL)
- Refactoring or optimizing existing methods
- Changing the deterministic layer
- Modifying the layer architecture

## Decisions

### D1: Delete vs Deprecate

**Decision:** Delete entirely. No @deprecated annotations.
**Rationale:** The user explicitly requires "no deprecated code, aliases, or legacy." Items either earn their place or are removed. This is a breaking change requiring a major version bump, which the user accepts.

### D2: Constant deletion criteria

**Decision:** A constant earns its place if it meets ANY of:

1. **Algebraic necessity** — required for the type's algebraic structure (ZERO, ONE, IDENTITY, I, NEG_I, NEG_ONE)
2. **Geometric significance** — represents a standard geometric primitive (UNIT_X, ROTATE_90, FLIP_X)
3. **Symmetry preservation** — completing an established positive/negative naming pattern (NEGATIVE_ONE completes ONE's pair)
4. **Practical DX with non-trivial construction** — values that are error-prone to construct inline (UNIT_DIAGONAL with irrational √2/2 components)
5. **Domain-standard range** — mathematically standard intervals for the library's domain (DEGREES, RADIANS for a 2D angle library)

Constants that fail ALL criteria are deleted.

### D3: Component-wise operations are all-or-nothing

**Decision:** Un-deprecate floor/ceil/round/trunc/sign on Matrix2/Matrix3.
**Rationale:** The library already provides abs/min/max/clamp/mod/lerp/smoothStep on matrices without deprecation. All are component-wise operations. There is no mathematical, practical, or API-design basis for deprecating a subset. The asymmetry violates the library's consistency principle.

### D4: Rotation2.negated fix

**Decision:** Change implementation from `(cos, -sin)` to `(-cos, -sin)`.
**Rationale:** Every other core type's `negated` getter performs component-wise sign flip. Rotation2's current implementation computes conjugation, which is identical to `inversed`. True negation `(-cos, -sin)` = rotation by θ+π (opposite direction) is a distinct, useful operation. This is a behavioral breaking change.

### D5: Rotation2.negate() addition

**Decision:** Add static `negate(rotation, out?)` and instance `negate()` methods.
**Rationale:** All 5 other core types have the complete triple: static negate(), instance negate(), getter negated. Rotation2 is the only one missing the first two.
**Pattern:** Follow exact same signatures as other types. Static returns `Rotation2.ensureOut(out).set(-rotation.cos, -rotation.sin)`. Instance mutates `this.cos = -this.cos; this.sin = -this.sin; return this`.

## Risks / Trade-offs

### [Breaking Changes] → Major version bump

15 constant deletions + Rotation2.negated behavioral change require a semver major version bump. Users referencing deleted constants get compile-time errors (TypeScript). Users relying on `negated` returning conjugation must switch to `inversed`.

### [Rotation2.negated behavioral change] → Document migration path

Any code using `rotation.negated` expecting the inverse rotation must change to `rotation.inversed`. This is a silent behavioral change if not caught by types — both return Rotation2. Mitigation: clear changelog entry, migration guide.

### [Incomplete 8-direction compass] → Future enhancement

Keeping UNIT_DIAGONAL/NEGATIVE_UNIT_DIAGONAL but not UNIT_ANTIDIAGONAL (135°/315°) means 6/8 compass directions. This is acceptable because the naming pattern is "basis + negation pairs" not "8 compass directions." The antidiagonals can be added in a future minor version if needed.
