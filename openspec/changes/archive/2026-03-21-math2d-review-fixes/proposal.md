## Why

The exhaustive 16-agent code review (`math2d-comprehensive-review`) verified every `.ts` file in `packages/math2d/src/` and produced 13 confirmed findings across 3 priority levels. Three P1 API inconsistencies need immediate resolution before the next release. Eight P2 gaps (missing operations, JSDoc, layer violation) round out the library's completeness. Two P3 items improve documentation polish.

## What Changes

### P1 Fixes — **BREAKING**

- **F1**: Rename `Rotation2.inversed` getter → `inverted` for consistency with Matrix2/Matrix3/Transform2
- **F5**: Fix `formatMatrix3` nested format to include outer brackets (`[[...],[...],[...]]` matching Matrix2)

### P1 Fixes — Non-breaking

- **F4**: Widen `randomOnSegment`, `randomInTriangle`, `randomOnTriangle` parameter types from `ReadonlyVector2` to `ReadonlyVector2Like`

### P2 Additive Features

- **F3**: Add `assertRotation2Normalized(cos, sin, tolerance?)` to validation layer
- **F6**: Add `Transform2.COMPONENT_COUNT = 6` constant + clarify `ELEMENT_COUNT` JSDoc
- **F7**: Add 10 component-wise operations to `Complex` (abs, floor, ceil, round, trunc, sign, min, max, clamp, mod) — static + instance
- **F8**: Add 9 component-wise operations to `Interval` (floor, ceil, round, trunc, sign, min, max, clamp, mod) — static + instance
- **F9**: Add `Vector2.inverted` getter to complete the inverse triple pattern
- **F10**: Add @remarks JSDoc for edge cases in auxiliary layer (angleBisector, smoothStep, compensatedProduct, sanitizeNumber, ensureFinite, fract, flooredMod)
- **F13**: Resolve `sqrtSafe` re-export layer violation in `deterministic-kernels.ts`

### P3 Documentation Polish

- **F11**: Document `assert*Like` DCE behavior in production builds
- **F12**: Document `Transform2.premultiply()` allocation pattern in JSDoc

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `core-types-api`: Rotation2 getter rename (F1), Vector2 inverted getter (F9), Transform2 COMPONENT_COUNT (F6), Complex component-wise ops (F7), Interval component-wise ops (F8)
- `api-conventions`: Parameter type widening in random utilities (F4)
- `serialization-correctness`: formatMatrix3 nested format fix (F5)
- `support-layers-api`: assertRotation2Normalized addition (F3), sqrtSafe layer fix (F13)
- `documentation-standard`: JSDoc edge case documentation (F10, F11, F12)

## Impact

- **Layer 0 (deterministic/)**: 1 file modified — `deterministic-kernels.ts` (sqrtSafe re-export removal)
- **Layer 1 (auxiliary/)**: ~7 files modified — JSDoc additions only, zero behavioral changes
- **Layer 2 (core/)**: 5 files modified — `rotation2.ts`, `vector2.ts`, `complex.ts`, `interval.ts`, `transform2.ts`
- **Layer 5 (validation/)**: 1 file modified — `assert.ts`
- **Layer 6 (utils/)**: 2 files modified — `random.ts`, `parse.ts`
- **Tests**: Update Rotation2 tests for rename, add tests for new operations (F7, F8, F9, F3, F6)
- **Breaking changes**: F1 (getter rename), F5 (output format). Requires minor version bump at minimum.
- **Bundle size**: Slight increase from ~60 new methods on Complex/Interval. Tree-shakeable.
- **Determinism**: Not affected — no changes to deterministic algorithms. sqrtSafe fix is structural only.
