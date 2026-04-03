## Why

Five adversarial audit agents (Documentation Archaeologist, Devil's Advocate, Evidence Hunter, Source Code Analyst, Synthesizer Judge) performed a line-by-line deep audit of the entire `@lenguados/math2d` package, contrasting every constant, method, and utility against authoritative references (gl-matrix, Box2D, Godot, Unity Mathematics, nalgebra, Eigen, GLM) and academic sources (IEEE 754/1788, Baudin-Smith, fdlibm, Kahan/Neumaier summation, Perlin smootherstep).

**Result: 8.8/10 overall quality.** Zero mathematical correctness bugs found. Zero determinism violations. However, the README contains 5 factual errors that actively mislead users, and 3 code-level improvements were verified. The library's mathematical foundation is production-quality, but the user-facing documentation is severely outdated.

This change addresses all verified findings to bring the library to full documentation-code alignment.

## What Changes

### P1 — README Corrections (Critical Documentation Errors)

- **Fix "row-major" → "column-major"** in README (2 locations, lines 295 and 378) — the code uses column-major matrices, contradicting the README claim
- **Fix export names** `DEG2RAD`/`RAD2DEG` → `DEG_TO_RAD`/`RAD_TO_DEG` in README (5 locations)
- **Fix non-existent API references** in README: `epsilonEquals` → `nearEquals`, `p.length()` → `p.magnitude()`
- **Update scope description** — README claims "only Vector2 and Matrix2" but Rotation2, Complex, Interval, Matrix3, Transform2 are all fully implemented

### P2 — Code Improvements (Verified)

- **Document `roundToPlaces` IEEE 754 limitation** — `roundToPlaces(1.005, 2)` returns 1.0 not 1.01 due to `Math.round(value * factor) / factor` floating-point representation
- **Add overflow warning to `Vector2.normalizeUnchecked`** — uses `Math.sqrt(x*x + y*y)` which overflows for large vectors; document the tradeoff vs `hypot`
- **Optimize `Rotation2.fromAngle`** — currently double-normalizes through `set()` which calls `hypot()` on already-unit values from `sinCos()`; bypass normalization for direct assignment

### P3 — Polish (Minor)

- **Add `t === 0` shortcut to scalar `lerp`** — matches the existing `t === 1` shortcut for symmetry and prevents theoretical NaN when `b - a` overflows to Infinity
- **Document `nearEquals` tolerance semantics** — Vector2/Matrix2 `nearEquals` uses relative tolerance (`relativeEquals`) while scalar `nearEquals` uses absolute; add JSDoc clarifying this

### Not Changed (Verified as Correct/By-Design)

- `EPSILON = 1e-10` — acceptable, no industry consensus (validated against Box2D 1e-7, Unreal 1e-8)
- `powSafe` returning NaN — documented exception to Safe convention, mathematically correct
- `ROTATE_180`/`FLIP_XY` and `THREE_QUARTER_TURN`/`NEGATIVE_QUARTER` as separate constants — semantic aliases by design
- `Complex` class scope (60+ methods) — well-scoped for analytical 2D math vs Rotation2 for runtime rotation
- `Interval` class — justified for AABB foundations and IEEE 1788 alignment
- `compensatedProduct`/`robustSum`/`neumaierSum` — academically established algorithms providing unique precision capabilities
- `fma` vs `addScaledVector` — different signatures and use cases (verified NOT identical)
- `roundToPowerOfTwo` using `Math.LN2` — IEEE 754 guarantees `LN2` is deterministic
- All mathematical formulas — verified correct against academic references
- All conventions (CCW, Y-up, column-major, radians, SRT) — confirmed industry standard

## Capabilities

### New Capabilities

- `readme-accuracy`: Comprehensive README overhaul to match actual code state, fixing all 5 verified factual errors
- `code-polish`: Targeted code improvements (3 verified issues) — documentation additions, minor optimization, endpoint guard

### Modified Capabilities

- `api-conventions`: Add requirement that README export names must match actual code exports
- `core-types-api`: Document Rotation2.fromAngle optimization (bypass normalization for sinCos output)

## Impact

- **packages/math2d/README.md** — Major rewrite to fix 5 factual errors and update scope
- **packages/math2d/src/auxiliary/numeric/rounding.ts** — JSDoc addition for `roundToPlaces`
- **packages/math2d/src/auxiliary/scalar/interpolation.ts** — Add `t === 0` guard to `lerp`
- **packages/math2d/src/core/vector2.ts** — JSDoc addition for `normalizeUnchecked`
- **packages/math2d/src/core/rotation2.ts** — Optimize `fromAngle` to bypass redundant normalization
- **openspec/specs/api-conventions/spec.md** — Add README accuracy requirement
- **openspec/specs/core-types-api/spec.md** — Document fromAngle optimization
- No breaking changes. No API surface changes. No determinism impact.
- Rollback: All changes are documentation or minor optimizations; full git revert is safe.
