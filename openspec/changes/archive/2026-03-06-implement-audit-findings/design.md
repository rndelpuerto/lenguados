## Context

The `audit-math2d-foundations` audit (archived at `openspec/changes/archive/2026-03-06-audit-math2d-foundations/`) produced a prioritized implementation checklist with 7 priority levels. This change implements P1-P4 (bug fixes, naming consistency, deterministic module cleanup, constants cleanup). P5-P7 (new operations, quality improvements, documentation) are deferred.

The library is at a stable API point post-v0.6.0. These changes are breaking but affect only zero-consumer entities or clear naming violations, minimizing downstream impact.

## Goals / Non-Goals

**Goals:**

- Fix the Transform2 shallow freeze bug (P1 — only actual bug)
- Resolve all naming inconsistencies identified in the audit (P2)
- Remove unnecessary deterministic sqrt (6x overhead for zero benefit) and fix sinCos double range reduction (P3)
- Remove zero-consumer constants that cause confusion (P4)
- Update all tests to reflect changes
- Maintain 90%+ coverage thresholds

**Non-Goals:**

- Adding new operations (Complex.exp/log, Matrix2.trace) — deferred to P5 change
- Improving deterministic/exp or range reduction — deferred to P6 change
- Documentation improvements (TSDoc, error messages) — deferred to P7 change
- Changing EPSILON value or tolerance strategy
- Modifying the layer architecture

## Decisions

### D1: Rename `negate` → `conjugate` (not fix implementation)

**Alternatives:**

1. Rename method to `conjugate` (reflects what it does: flips sin sign, preserving cos)
2. Fix implementation to actually negate (-cos, -sin)

**Choice:** Rename to `conjugate`. The current implementation (cos, -sin) is the mathematically correct inverse rotation in SO(2). Actual negation (-cos, -sin) has no standard geometric meaning for unit complex numbers. The audit confirmed this.

### D2: Remove slerp entirely (not deprecate)

**Alternatives:**

1. Remove `Rotation2.slerp` and document lerp equivalence
2. Keep slerp as alias pointing to lerp
3. Deprecate with warning

**Choice:** Remove entirely. In 2D, slerp of unit complex numbers degenerates to lerp+normalize. Keeping an alias misleads users into thinking slerp is "better". Add a `@remarks` TSDoc note to `lerp` explaining the equivalence.

### D3: Move sqrtSafe to numeric/safety (not just delete)

**Alternatives:**

1. Delete sqrtSafe entirely (users call `Math.sqrt` with their own guard)
2. Move to numeric/safety with `x <= 0 ? 0 : Math.sqrt(x)` implementation
3. Keep in deterministic/ but delegate to Math.sqrt

**Choice:** Move to numeric/safety. `sqrtSafe` is a useful guard pattern consistent with `divideSafe`, `reciprocalSafe`, etc. Its home is numeric/safety (the "safe wrappers" module), not deterministic/ (the "cross-platform kernels" module). Re-export from deterministic/ for backward compatibility.

### D4: Breaking changes without deprecated aliases

**Alternatives:**

1. Immediate removal (breaking)
2. Deprecated aliases for one release cycle

**Choice:** Immediate removal. All removed entities have zero consumers in the codebase and zero external users (pre-1.0 library). Deprecated aliases add unnecessary code and confuse the API surface.

## Risks / Trade-offs

- **[Risk] External consumers may use removed APIs** → Mitigation: Pre-1.0 library; semver allows breaking changes. CHANGELOG will document all removals with migration paths.
- **[Risk] sinCos delegation change may alter numerical results** → Mitigation: angle/sinCos currently calls sin() then cos() separately. Delegating to deterministic/sinCos uses shared range reduction, which may produce slightly different results for the same input. This is actually MORE correct (single reduction). Verify with existing test suite.
- **[Risk] Removing custom sqrt changes hypot results** → Mitigation: `hypot` currently uses custom sqrt internally. After this change, it will use `Math.sqrt`. Since Math.sqrt is IEEE 754 correctly rounded (0.5 ULP), results may differ by at most 1 ULP from the previous custom sqrt. This is an IMPROVEMENT in accuracy. Tests use EPSILON tolerance which absorbs this.
- **[Trade-off] magnitudeSquared rename touches many files** → Accepted. Consistency across the API is worth the churn. The rename is mechanical (find-replace).
