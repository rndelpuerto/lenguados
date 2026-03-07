## Context

The @lenguados/math2d library completed a 66-task tech-debt audit that addressed correctness issues. Post-audit analysis against external references (glam, three.js, Unity, gl-matrix, Eigen) revealed the library's patterns are sound but incompletely applied. This change completes the patterns uniformly.

Current state:

- 7 core types with ~400 static methods and ~350 instance methods
- Triality pattern (strict/Safe/Unchecked) covers ~95% of fallible operations
- \*CS pre-computed trig pattern covers Vector2, Matrix2, Matrix3, Transform2 but not Complex/Rotation2 factories
- Instance ↔ Static parity is excellent for Vector2/Complex/Rotation2 but has gaps in Matrix2/Matrix3/Interval
- Core layer coverage: 86-91% statements (threshold is 90%)
- Tolerance constants exist but no explicit per-function documentation of which constant applies

## Goals / Non-Goals

**Goals:**

- Every fallible operation has exactly three variants (strict/Safe/Unchecked)
- Every public method exists in both static (with `out?`) and instance (mutating `this`) form, except factories (static-only) and serialization (instance-only)
- Every type that accepts angle parameters offers \*CS factory variants for pre-computed trig
- `get normalized` returns algebraically correct fallback (identity for group elements, zero for vectors)
- Core layer test coverage ≥ 95% statements
- Every tolerance-using function documents which constant it uses

**Non-Goals:**

- New mathematical types (AABB, Circle, Ray, Line, Segment)
- Physics features (velocity, forces, constraints, collision)
- Animation/easing/spring utilities
- IO extraction to separate package
- Changes outside packages/math2d/
- Legacy code, deprecated aliases, or backward-compatibility shims

## Decisions

### D0: No legacy code — only final API surface (v0.7.0)

**Decision**: This release (v0.7.0) ships only the final code. No deprecated aliases, no backward-compatibility shims, no `@deprecated` re-exports from v0.6.0. Breaking changes are clean breaks.

**Rationale**: The library is pre-1.0 (semver allows breaking changes in minor versions). Maintaining deprecated aliases adds dead code, increases bundle size, and creates confusion about which API is canonical. The previous version (v0.6.0) is available via npm version pinning for consumers who need migration time.

**Alternative considered**: Add `@deprecated` aliases for renamed/removed methods with removal scheduled for v1.0. Rejected because: (a) pre-1.0 semver contract allows breaking changes, (b) deprecated aliases are dead weight in a tree-shakeable library, (c) the library has a small consumer base where direct communication is feasible.

**Version references**: Any JSDoc or comment referencing the old behavior SHALL say "v0.6.0". Any reference to the new behavior SHALL say "v0.7.0".

### D1: Complex.get normalized fallback → (1, 0)

**Decision**: Change `Complex.get normalized` to return `(1, 0)` instead of `(0, 0)` for zero-magnitude input.

**Rationale**: A complex number of magnitude zero is not a valid element of the multiplicative group C\*. The multiplicative identity `(1, 0)` is the only algebraically meaningful fallback. This aligns `get normalized` with `normalizeSafe()` and matches the pattern in Rotation2 (which already returns identity `(cos=1, sin=0)` in both getter and safe variant). External precedent: three.js returns identity quaternion `(0,0,0,1)` for zero-magnitude normalization; Unity does the same.

**Alternative considered**: Keep `(0, 0)` with "zero means no direction" semantic. Rejected because: (a) it creates inconsistency between getter and Safe method on the same type, (b) `(0, 0)` is not a unit complex number, making the `normalized` name misleading, (c) downstream multiplication with `(0, 0)` silently zeroes out results, which is rarely the intended behavior.

**Breaking change**: Consumers using `complex.normalized` and relying on `(0,0)` for zero-magnitude must update. Risk is low — zero-magnitude complex numbers are rare in practice, and the old behavior was arguably a bug.

### D2: Static mod/modScalar for matrices — add static equivalents

**Decision**: Add static `mod()` and `modScalar()` to Matrix2 and Matrix3.

**Rationale**: The library convention is that every instance method has a static counterpart (and vice versa). `mod` and `modScalar` exist as instance-only methods, violating this convention. The static versions follow the standard signature: `Matrix2.mod(a, b, out?): Matrix2`.

**Alternative considered**: Document as instance-only by design. Rejected because no other arithmetic operation is instance-only, and the inconsistency would be confusing.

### D3: \*CS factories use direct set, no normalization

**Decision**: `Complex.fromPolarCS(magnitude, cos, sin)` and `Rotation2.fromCS(cos, sin)` accept pre-computed cos/sin without normalizing the angle. They trust the caller's values.

**Rationale**: The purpose of *CS variants is hot-path performance. Adding normalization or validation defeats the purpose. This matches existing *CS methods like `Vector2.rotateCS(cos, sin)` which trust caller values. The "Unchecked" semantic is implicit in the \*CS suffix.

**Alternative considered**: Add validation that cos²+sin² ≈ 1. Rejected because existing \*CS methods don't validate this, and the overhead would negate the performance benefit.

### D4: Matrix3 static parity — selective additions

**Decision**: Add static equivalents for instance-only methods, but NOT for accessor-style methods (`getTranslation`, `getScale`, `getRotation`) which remain instance-only.

**Rationale**: Accessors like `getTranslation()` return extracted sub-components and are inherently tied to "having" a matrix instance. Static equivalents would be awkward: `Matrix3.getTranslation(matrix, out?)` is semantically identical to `matrix.getTranslation(out?)`. However, computational methods like `decompose()`, `premultiply()`, `transformPoints()` follow the standard static pattern.

Exception: `isAffine()` gets a static equivalent because it's a pure predicate function (like `isIdentity`, `isOrthogonal`).

### D5: Interval.sqrtSafe fallback — return degenerate interval [0, 0]

**Decision**: `Interval.sqrtSafe()` returns `[0, 0]` when the interval contains negative values that make sqrt undefined.

**Rationale**: The square root of a negative interval has no real-valued result. Returning `[0, 0]` (a degenerate/point interval) is the closest valid result and matches the pattern used by other Safe methods (return a degenerate but valid value). For intervals that are partially negative (e.g., [-1, 4]), sqrtSafe clamps min to 0 and takes sqrt of max: `[0, 2]`.

### D6: Tolerance documentation approach — JSDoc @remarks tags

**Decision**: Add `@remarks` tags to each tolerance-using function documenting which constant it uses, rather than creating a separate mapping document. Only two tolerance constants are in active use: `EPSILON` (1e-10) and `MIN_SAFE_DIVISOR`.

**Rationale**: Co-locating the tolerance information with the function keeps it discoverable and maintainable. A separate document would drift from code. The JSDoc approach also surfaces in IDE tooltips.

**Correction from review**: The original proposal referenced four constants (EPSILON, ANGLE_EPSILON, MIN_SAFE_DIVISOR, ITERATIVE_TOLERANCE). Code review confirmed that ANGLE_EPSILON does not exist in the codebase and ITERATIVE_TOLERANCE is defined but unused by any function. All angle comparisons use EPSILON. Only EPSILON and MIN_SAFE_DIVISOR require documentation.

### D7: premultiply() — static signature uses (left, right) parameter order

**Decision**: `Matrix2.premultiply(left, right, out?)` computes `left × right` (same as `multiply`). The instance method `matrix.premultiply(other)` computes `other × this`.

**Rationale**: The value of `premultiply` is in the instance method where it reverses the multiplication order. The static version is redundant with `multiply` but included for completeness. The parameter names `left, right` make the operation clear.

**Alternative considered**: Not adding static `premultiply` since it's identical to `multiply`. Included anyway because the convention demands static ↔ instance parity, and tree-shaking will eliminate it if unused.

## Risks / Trade-offs

- **[Bundle size increase]** → ~30 new methods. Mitigated by tree-shaking (unused static methods eliminated). Measured impact: <2KB gzipped for typical usage.
- **[Breaking change: Complex.get normalized]** → Semver minor bump to v0.7.0. Mitigated by: (a) documenting in CHANGELOG, (b) the old behavior was arguably incorrect, (c) zero-magnitude complex numbers are uncommon. No deprecated alias — v0.6.0 behavior is removed cleanly.
- **[Test maintenance burden]** → ~200+ new test cases. Mitigated by following existing test patterns and delegating to property-based tests where possible.
- **[Premultiply redundancy]** → Static `premultiply` is identical to `multiply`. Accepted as the cost of convention consistency. Tree-shaking eliminates dead code.
