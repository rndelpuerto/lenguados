## Context

The 2026-03-22 adversarial audit reviewed all 28 source files (~25,000 lines) in `@lenguados/math2d` against 30+ authoritative sources. It found 0 critical issues, 5 important items (P1), and 7 nice-to-have items (P2). This change implements all 12 items.

Current state:

- `Rotation2.fromMatrix2` uses `atan2(m01, m00)` then `fromAngle(angle)`, which round-trips through trig functions unnecessarily
- 5 constants (`ITERATIVE_TOLERANCE`, `MAX_SAFE_INTEGER_F64`, `E`, `GOLDEN_RATIO`, `GOLDEN_RATIO_CONJUGATE`) are exported but have zero consumers
- `Vector2` lacks `moveTowards` (standard in Unity/Godot)
- `Matrix2` lacks `fromAngleScale` convenience factory
- `sumComponents` exists with no geometric purpose and no consumers
- Several documentation cross-references are missing

## Goals / Non-Goals

**Goals:**

- Fix `Rotation2.fromMatrix2` precision by eliminating unnecessary trig round-trip
- Remove 5 unused constants to reduce API surface
- Add `Vector2.moveTowards` following static+instance+out pattern
- Add `Matrix2.fromAngleScale` convenience factory
- Deprecate `Vector2.sumComponents`
- Improve documentation cross-references for safety utilities and guards

**Non-Goals:**

- Changing the three-tier (strict/safe/unchecked) pattern
- Adding game-engine convenience methods beyond `moveTowards` (e.g., `smoothDamp`, `bounce`)
- Modifying deterministic kernel implementations
- Changing EPSILON or tolerance values
- Full deprecation/removal cycle (removals are immediate in this pre-1.0 phase)

## Decisions

### D1: Direct column extraction for `Rotation2.fromMatrix2`

**Decision:** Extract `cos = m00, sin = m01` directly from the rotation matrix and normalize via `hypot`, instead of computing `atan2(m01, m00)` then reconstructing via `sinCos(angle)`.

**Rationale:** The current approach compounds error: `atan2` has ~1 ULP error, then `sin/cos` each add ~1 ULP. Direct extraction + normalize via `hypot` (IEEE 754 required, ≤1 ULP) is both faster and more precise.

**Alternative considered:** Keep `atan2` approach with higher precision range reduction. Rejected because the fundamental issue is the unnecessary round-trip, not the precision of individual operations.

### D2: Immediate removal vs deprecation for constants

**Decision:** Remove constants immediately rather than deprecation-first.

**Rationale:** The package is pre-1.0 (version 0.7.x). Semver allows breaking changes in minor versions for pre-1.0 packages. All 5 constants have zero consumers in the codebase, so internal breakage is impossible. External consumers can trivially replace them with `Math.E`, `Number.MAX_SAFE_INTEGER`, or `(1 + Math.sqrt(5)) / 2`.

**Alternative considered:** Deprecation with `@deprecated` tag for one release cycle. Rejected because pre-1.0 and zero consumers makes this unnecessary overhead.

### D3: `moveTowards` parameter order

**Decision:** `moveTowards(current, target, maxDelta, out?)` — matching Unity's `Vector2.MoveTowards(current, target, maxDistanceDelta)` convention.

**Rationale:** Unity's parameter order is the most widely recognized. The `out` parameter goes last per library convention.

**Alternative considered:** Godot's `move_toward(to, delta)` (instance-only, no `current` param). Rejected because the library uses static+instance duality, and the static version needs `current` explicitly.

### D4: `fromAngleScale` implementation strategy

**Decision:** Compute rotation matrix `[cos, -sin; sin, cos]` and multiply by scale `[sx, 0; 0, sy]` in a single pass: `[cos*sx, -sin*sy; sin*sx, cos*sy]`.

**Rationale:** Avoids intermediate matrix allocation. Single-pass computation is both faster and more precise than `fromRotation` then `multiply(fromScale)`.

### D5: `sumComponents` deprecation approach

**Decision:** Add `@deprecated` JSDoc tag with removal target version. Keep the implementation unchanged.

**Rationale:** Even pre-1.0, deprecation is gentler than removal for a method that does exist in the API. Users get a compile-time warning to migrate.

## Risks / Trade-offs

- **[Risk] `Rotation2.fromMatrix2` behavior change** → The new implementation produces slightly different floating-point results for the same input. This is intentional (more precise), but could cause snapshot test failures in downstream code. Mitigation: document the precision improvement in changelog.

- **[Risk] Constant removal breaks external consumers** → Mitigation: pre-1.0 semver allows this. Constants are trivially replaceable. Document in BREAKING section of changelog.

- **[Trade-off] `moveTowards` adds API surface** → Justified by industry standard (Unity, Godot, three.js). The method composes existing primitives (`subtract`, `clampMagnitude`, `add`) but provides a named concept that improves discoverability.

- **[Trade-off] Documentation-only P2 items** → Low risk, high value. Cross-references improve discoverability without changing behavior.
