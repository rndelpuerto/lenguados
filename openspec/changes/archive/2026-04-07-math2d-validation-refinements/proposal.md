## Why

Following the main `math2d-comprehensive-audit` (which closed all Severity-L0 gaps), a post-implementation review compared every change against the full codebase, ratified specs, and project rules. Five additional issues survived the review — each directly analogous to a bug already fixed in the audit but in a different location.

All five are **consistency issues**: the audit fixed the pattern in the most visible locations, but the same oversight exists in sibling methods or sibling modules. Leaving them would make the codebase inconsistent against its own now-documented rules.

**Verification methodology**: Each issue was independently verified with code execution and cross-referenced against all ratified specs in `openspec/changes/math2d-comprehensive-audit/specs/`. Items refuted by existing specs are NOT included (5 items were refuted in this phase).

## What Changes

### Fix: `assertNonZero` silently passes NaN

- Same IEEE 754 NaN bypass already fixed in `assertPositive` and `assertNonNegative` (audit task 1.3). The guard `if (value === 0)` misses NaN since `NaN === 0` is `false`. Fix: `if (value !== value || value === 0)`.

### Fix: `Transform2` constructor violates Constructor Purity rule

- `Transform2` constructor calls `assertFinite(rotation, ...)` — a dev-only assertion inside the constructor. The Constructor Purity rule (documented in `architecture-and-layers.md`) states constructors MUST have NO assertions. All 6 other core types follow this rule. The `assertFinite` call was an oversight at the time the audit's Constructor Purity rule was formally added.

### Fix: `Rotation2.fromVector2` and `fromVectors2` double-normalization

- Both methods compute normalized `(x * inv, y * inv)` manually, then pass the result to `set()` which calls `normalize()` internally — computing magnitude a second time. Fix: route through `setDirect()` (the same pattern used by all other `Rotation2` factory methods after the audit).

### Fix: `Transform2` static methods set rotation via `rotation.set(cos, sin)`

- `multiply`, `inverseUnchecked`, `fromComponents`, and `premultiply` compute normalized `(cos, sin)` manually and then call `rotation.set(cos, sin)`. Since `Rotation2.set()` normalizes internally, this triggers a redundant `Math.sqrt` / `hypot` on already-normalized values. Fix: use `rotation.cos = ...; rotation.sin = ...;` direct assignment (or `rotation.setDirect(cos, sin)` if public access is required).

### Fix: Missing GIGO and edge-case tests for eigenvalues and solveLinearSystem

- The audit added eigenvalue and solveLinearSystem methods but the test coverage for degenerate inputs (zero matrix, repeated eigenvalues, Jordan block, unchecked GIGO) is incomplete, leaving branches uncovered that could silently violate the GIGO contract.

## Capabilities

### Modified Capabilities

- `validation-assertNonZero-nan`: Extends the `audit-bug-fixes` fix for `assertPositive`/`assertNonNegative` to cover `assertNonZero`.
- `constructor-purity-transform2`: Extends the `audit-architectural-fixes` Constructor Purity compliance to `Transform2`.
- `rotation2-fromvector-double-normalization`: Eliminates redundant magnitude computation in `Rotation2.fromVector2` and `fromVectors2`.
- `transform2-double-normalization`: Eliminates redundant normalization in 4 `Transform2` static methods.
- `eigenvalues-gigo-tests`: Completes test coverage for degenerate/GIGO scenarios of `Matrix2.eigenvalues`, `Matrix2.eigendecompose`, and `Matrix3.solveLinearSystem`.

## Impact

- **Affected code**: `validation/assert.ts`, `core/transform2.ts`, `core/rotation2.ts`, `test/core/matrix2.node.spec.ts`, `test/core/matrix3.node.spec.ts`
- **APIs**: No new public APIs. No breaking changes. Pure internal consistency fixes + test additions.
- **Performance**: Small improvement in `fromVector2`, `fromVectors2`, and 4 Transform2 static methods (eliminates 1 `Math.sqrt`/`hypot` call per invocation).
- **Dependencies**: None.
- **Rollback plan**: Each fix is independent and can be reverted separately.
