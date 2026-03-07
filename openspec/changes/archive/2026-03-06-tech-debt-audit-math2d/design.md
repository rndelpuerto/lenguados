## Context

The `@lenguados/math2d` package (~12,000 LOC, 25 source files, 6 architectural layers) is the foundation of the lenguados ecosystem. A comprehensive audit of every module identified technical debt distributed across all layers. No critical bugs were found, but accumulated inconsistencies in API patterns, missing validation, broken serialization round-trips, and test coverage gaps create a fragile foundation for the physics/geometry packages that will build on top.

The codebase quality is high overall (scores ranging from 8.1 to 9.3/10 across modules), so this is a targeted cleanup, not a rewrite. Each change is surgical, isolated to its module, and independently revertable.

**Current state by layer:**

- **deterministic/** — A+ quality; `config` object needs mutability documentation
- **auxiliary/scalar** — Production-ready; no bugs; missing edge case tests
- **auxiliary/angle** — 8.5/10; missing NaN/Infinity tests; tolerance question for `anglesNearEqual`
- **auxiliary/numeric** — 93/100; 3 rounding functions lack non-finite validation
- **core/ (Vector2, Complex, Rotation2)** — 8.6/10; missing `angle` getter/setter on Vector2; missing `signedAngle`; instance `reject()` silently returns `this` (static version correctly throws)
- **core/ (Matrix2, Matrix3, Transform2, Interval)** — Robust; decompose allocation pattern; Interval.intersect semantics
- **support/ (types, validation, utils)** — 8.1/10; Transform2 serialization loses scale; parse tests missing; mutable global state

## Goals / Non-Goals

**Goals:**

- Establish API consistency across all core types (accessor patterns, triality, naming)
- Fix data-loss bugs in serialization (Transform2 scale, Interval validation)
- Eliminate validation logic duplication (assert*Like vs is*Like)
- Close edge case test coverage gaps (NaN, Infinity, extreme values)
- Make global mutable state safer (defaultRandomSource, config)
- Optimize Complex.normalize (remove redundant divideSafe after validation)

**Non-Goals:**

- No new mathematical types (Vector3, AABB, Circle belong to future packages)
- No performance optimization (benchmarks show current perf is excellent)
- No breaking changes to core type constructors or method signatures (except Transform2 serialization format)
- No migration of utils/performance to @lenguados/devtools (separate change)
- No changes to deterministic kernel algorithms (fdlibm implementations are verified correct)
- No addition of abs/min/max wrappers to scalar (users can use Math.\* directly)

## Decisions

### D1: Transform2 serialization format change

**Decision:** Extend Transform2 JSON format from `{p, r}` to `{p, r, s}` where `s` is the scale vector. Parser accepts both old and new format for backward compatibility (old format defaults scale to `(1,1)`).

**Alternatives considered:**

- _Versioned format with `version` field_ — Over-engineered for an internal format; adds parsing complexity
- _Separate `formatTransform2Full()` function_ — Splits API surface; users must know about both
- _Keep current behavior, document scale loss_ — Unacceptable: silent data loss violates library contract

**Rationale:** The current format silently drops scale, making `parse(format(t)) !== t`. This is a correctness bug, not a design choice. Backward-compatible parsing mitigates the breaking change.

### D2: Vector2 angle() method → getter/setter conversion

**Decision:** Convert the existing instance `angle()` method (line 3204) to a `get angle()` getter, and add a `set angle()` setter, matching the pattern already established by Complex (line 1218) and Rotation2 (line 1027).

**BREAKING**: This changes `v.angle()` (method call with parens) to `v.angle` (property access without parens). The static `Vector2.angle(vector)` remains unchanged.

**Discovery during contrast**: The audit initially proposed "adding" a getter, but line-by-line review found the instance `angle()` method already exists at line 3204. TypeScript cannot have both a method and a getter with the same name, so this must be a conversion, not an addition.

**Also discovered**: `Vector2.signedAngle(from, to)` was proposed but `Vector2.angleTo(a, b)` (line 1303) already implements the exact same computation (`atan2(cross, dot)`). No new method needed.

**Alternatives considered:**

- _Keep method, add getter with different name_ — Increases API surface for no benefit
- _Only getter, no setter_ — Breaks symmetry with Complex/Rotation2 which have both
- _Add angleDegrees/angleTurns too_ — Scope creep; can add later if needed

**Rationale:** Three core types (Vector2, Complex, Rotation2) represent direction. They should share a common accessor pattern.

### D3: Vector2 instance reject triality

**Decision:** Fix the instance `reject()` method to throw `RangeError` on zero-length axis (matching the static `Vector2.reject()` which already throws). Add instance `rejectSafe()` and `rejectUnchecked()` methods (static versions already exist at lines 1847 and 1874).

**Current state:**

- Static `reject()` — CORRECT: already throws `RangeError` (line 1823)
- Static `rejectSafe()` — CORRECT: already exists (line 1847)
- Static `rejectUnchecked()` — CORRECT: already exists (line 1874)
- Instance `reject()` — BUG: silently returns `this` on zero axis (line 3610)
- Instance `rejectSafe()` — MISSING
- Instance `rejectUnchecked()` — MISSING

**Alternatives considered:**

- _Keep silent no-op_ — Inconsistent with static version and all other strict-tier instance methods
- _Only fix instance reject_ — Incomplete: missing Safe/Unchecked instance variants

**Rationale:** The static version already has the correct triality pattern. The instance methods must mirror it. This is the only instance method that diverges from its static counterpart.

### D4: Assertion composition with type guards

**Decision:** Refactor `assertVector2Like()` and siblings to delegate to `isVector2Like()` type guards, eliminating duplicated property-checking logic.

```typescript
// Before (duplicated logic):
export function assertVector2Like(value: unknown): asserts value is Vector2Like {
  if (!DEV_MODE || !assertionsEnabled) return;
  if (typeof value !== 'object' || value === null) throw ...;
  if (typeof (value as any).x !== 'number') throw ...;
  if (typeof (value as any).y !== 'number') throw ...;
}

// After (composed):
export function assertVector2Like(value: unknown): asserts value is Vector2Like {
  if (!DEV_MODE || !assertionsEnabled) return;
  if (!isVector2Like(value)) {
    throw new TypeError(`Expected Vector2Like, got ${typeof value}`);
  }
}
```

**Alternatives considered:**

- _Keep duplication_ — More verbose error messages per property, but doubles maintenance burden
- _Merge guards into assertions_ — Breaks tree-shaking: type guards are used independently

**Rationale:** Type guards already exist and are well-tested. Assertions should compose, not duplicate. Error messages become slightly less granular (which property failed) but the trade-off is worth the DRY improvement.

**IMPORTANT caveat discovered during contrast:** `isVector2Like` only checks `typeof 'number'` (via `hasNumericProperties`). `assertVector2Like` additionally checks `Number.isFinite()`. The refactoring MUST preserve the finite validation by adding finite checks AFTER the structural `isXLike` check. Pattern:

```typescript
if (!isVector2Like(value)) throw new TypeError(`Expected Vector2Like, got ${typeof value}`);
// isXLike only checks structure, not finite — assert must also check finite
if (!Number.isFinite((value as any).x) || !Number.isFinite((value as any).y)) {
 throw new Error(`${label}.x and .y must be finite numbers`);
}
```

### D5: defaultRandomSource encapsulation

**Decision:** Remove the `export let defaultRandomSource` and expose only `getDefaultRandomSource()` / `setDefaultRandomSource()` functions.

**Alternatives considered:**

- _Freeze the export_ — `export const` prevents reassignment but not the `export let` pattern
- _Keep mutable export_ — Thread-unsafe, test side effects, violates encapsulation

**Rationale:** Mutable module-level exports are an anti-pattern. The getter/setter functions already exist; the bare `let` export is redundant and dangerous.

### D6: Rounding function validation

**Decision:** Add `if (!Number.isFinite(value)) return value;` guard to `roundToPlaces`, `roundToMultiple`, `snapToGrid`, matching `roundToInt`'s validation pattern.

**Alternatives considered:**

- _Throw on non-finite_ — Inconsistent: `roundToInt` throws but these return NaN silently, neither approach matches
- _Return NaN explicitly_ — Same as current behavior but explicit; doesn't help users

**Rationale:** Propagating non-finite values is the correct IEEE 754 behavior and matches what users expect from rounding functions. The guard makes the behavior explicit and documentable rather than accidental.

### D7: signedAngle implementation

**Decision:** Add `Vector2.signedAngle(from, to)` as static method returning the signed angle from vector `from` to vector `to` in range `[-PI, PI]`. Uses `atan2(cross, dot)` for numerical stability.

**Alternatives considered:**

- _Instance method only_ — Breaks convention (all operations have static form)
- _Use angleBetween with sign_ — angleBetween is unsigned; retrofitting adds complexity
- _Add to auxiliary/angle_ — Requires Vector2Like, creating upward dependency

**Rationale:** Unity (`Vector2.SignedAngle`) and Godot (`signed_angle()`) both provide this. It's the most-requested missing operation from the core audit.

## Risks / Trade-offs

### [Transform2 format breaking change] -> Mitigation: backward-compatible parser

Parser accepts `{p, r}` (legacy) and `{p, r, s}` (new). Consumers reading old-format data get `scale=(1,1)` default, which matches the current hardcoded behavior. No data loss for existing users.

### [Assertion error messages less granular] -> Mitigation: secondary check

After `isXLike` returns false, a secondary diagnostic can identify which property failed. This adds ~3 LOC per assertion but preserves debugging quality.

### [defaultRandomSource removal] -> Mitigation: deprecation period

The `export let` can first be deprecated (console.warn on access) before removal. However, since this is pre-v1.0, direct removal is acceptable.

### [Instance reject() behavior change] -> Mitigation: Safe variant

Users relying on the instance `reject()` silent no-op behavior can switch to instance `rejectSafe()`. Note: the static `Vector2.reject()` already throws, so this only affects instance callers.

### [Scope risk: 8 spec files across 6 layers] -> Mitigation: independent changes

Each capability is independently implementable and testable. Implementation can proceed layer-by-layer. No cross-capability dependencies exist.

## Open Questions

1. **ANGLE_EPSILON constant**: Should `anglesNearEqual` use a dedicated `ANGLE_EPSILON` (e.g., 1e-6) instead of `EPSILON` (1e-10)? Industry practice varies. Current behavior is correct but unusually strict. Decision deferred to implementation phase after measuring practical impact.

2. **Complex.normalizeSafe fallback**: Vector2 returns `(0,0)`, Complex/Rotation2 return `(1,0)`. The difference is semantically correct (identity element differs per type), but should it be documented more prominently? Currently a comment-level decision.

3. **Matrix decompose allocation**: `decompose()` always allocates new objects. Should we add `out` parameter variants? Low priority since decompose is not a hot-path operation, but worth considering for API completeness.
