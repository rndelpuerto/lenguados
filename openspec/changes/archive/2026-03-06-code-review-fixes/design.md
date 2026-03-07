## Context

An exhaustive code review of `@lenguados/math2d` identified 10 findings across severity levels. After contrasting each finding against the 10 existing specs, the classification is:

- **2 spec violations** (H1: epsilon inconsistency, M3: missing GOLDEN_RATIO) — specs already mandate the correct behavior
- **1 delta spec needed** (H3: normalize must use overflow-safe hypot) — no spec currently covers this
- **7 implementation fixes** (H2, M1, M2, M4, L1, L4 + test tolerance unification) — no spec impact

All changes are in the `core/` and `auxiliary/` layers. No changes to `deterministic/`, `types/`, or `utils/`.

## Goals / Non-Goals

**Goals:**

- Fix all 10 code review findings to full spec compliance
- Add delta spec for overflow-safe normalization requirement
- Unify test tolerance constants with documented rationale
- Ensure all changes pass existing test suite with no regressions

**Non-Goals:**

- Adding `Matrix3.isAffine()` (L5 — scope creep, would need its own proposal)
- Changing `Vector2.slerp()` naming (L2 — non-issue, defensive internals are fine)
- Replacing `Math.PI` with project `PI` in Complex constants (L3 — they're bit-identical)
- Rewriting normalize to use a different algorithm — only switching from `sqrt(x*x+y*y)` to `hypot(x,y)`

## Decisions

### D1: Use `hypot()` in normalize, keep `Math.sqrt()` in normalizeUnchecked

**Choice**: `normalize()` and `normalizeSafe()` will use `hypot(v.x, v.y)` from deterministic-kernels (overflow-safe). `normalizeUnchecked()` keeps `Math.sqrt(x*x + y*y)` (max performance, caller guarantees safe range).

**Rationale**: The Unchecked contract explicitly accepts undefined behavior on edge inputs. Paying for `hypot()` overhead in the unchecked path violates the "pay only for what you use" principle. The strict/safe paths should be robust; the unchecked path should be fast.

**Alternatives considered**:

- Use `hypot` everywhere — rejected: penalizes hot paths that guarantee safe ranges
- Keep `sqrt` everywhere — rejected: inconsistent with `magnitude()`, overflow risk is real

### D2: Unify test DIGITS to 10 with documented exceptions

**Choice**: Standardize on `DIGITS = 10` (~1e-10 tolerance) for all core type tests, matching `EPSILON`. Use `DIGITS = 14` only for deterministic kernel tests where fdlibm guarantees higher precision.

**Rationale**: Tests should verify at the precision the library guarantees. EPSILON = 1e-10 is the library's documented tolerance, so tests should verify at that level. Kernel tests verify the underlying math at higher precision because the kernels guarantee ~15-digit accuracy.

**Alternatives considered**:

- Keep DIGITS = 8 — rejected: too loose, could miss precision regressions
- Use DIGITS = 14 everywhere — rejected: core operations compound errors, 1e-14 would cause false failures

### D3: Add dev-mode assertion to projectOnUnit, not runtime validation

**Choice**: Add `assertVector2(unitAxis)` and a magnitude check via assertion (dev-mode only, tree-shaken in production). Do NOT add a Safe/Unchecked variant.

**Rationale**: `projectOnUnit()` is a hot-path optimization method — users call it when they've already ensured unit length. A dev-mode assertion catches misuse during development without penalizing production. Adding full triality (Safe/Unchecked) would be scope creep for what's essentially a named precondition.

### D4: Fix Rotation2.fromComplex by bypassing set() normalization

**Choice**: Change `fromComplex()` to directly assign `cos`/`sin` from the complex number, then call `normalize()` once. This avoids the double normalization from `set()` → `normalize()`.

**Rationale**: `set()` normalizes internally (it maintains the SO(2) invariant). Calling `normalize()` after `set()` is redundant. The fix is to use direct property assignment in the factory, then normalize once.

## Risks / Trade-offs

- **[Risk] Changing normalize implementation could shift floating-point results** → `hypot()` and `sqrt(x*x+y*y)` produce slightly different results for normal-range inputs (last 1-2 bits). Mitigation: This is an improvement in accuracy. Tests use EPSILON tolerance, not exact equality. No test breakage expected.
- **[Risk] Unifying DIGITS could surface latent precision issues** → If raising DIGITS from 8 to 10 causes test failures, it means the library has precision gaps we weren't catching. Mitigation: Fix the underlying precision issues rather than lowering DIGITS back.
- **[Risk] Dev-mode assertion in projectOnUnit adds import dependency** → `projectOnUnit()` would need to import from `validation/`. Mitigation: validation is already imported in core types for other assertions. No new dependency edges.
