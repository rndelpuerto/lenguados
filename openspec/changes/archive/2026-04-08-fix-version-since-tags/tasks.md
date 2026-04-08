## 1. Source TSDoc @since tag replacements (deterministic + auxiliary + types + validation layers)

- [x] 1.1 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/deterministic/deterministic-kernels.ts` (14 tags)
- [x] 1.2 Replace all `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/auxiliary/angle/interpolation.ts` (1 tag)
- [x] 1.3 Replace all `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/auxiliary/numeric/guards.ts` (1 tag)
- [x] 1.4 Replace all `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/auxiliary/numeric/rounding.ts` (2 tags)
- [x] 1.5 Replace all `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/auxiliary/numeric/safety.ts` (1 tag)
- [x] 1.6 Replace all `@since 0.8.0` with `@since 0.7.0` in `packages/math2d/src/types/index.ts` (7 tags) and `@since 0.9.0` (1 tag)
- [x] 1.7 Replace all `@since 0.8.0` with `@since 0.7.0` in `packages/math2d/src/validation/assert.ts` (6 tags)

## 2. Source TSDoc @since tag replacements (core layer)

- [x] 2.1 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/core/complex.ts` (39 tags)
- [x] 2.2 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/core/interval.ts` (29 tags)
- [x] 2.3 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/core/transform2.ts` (13 tags)
- [x] 2.4 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/core/matrix2.ts` (11 tags)
- [x] 2.5 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/core/matrix3.ts` (11 tags)
- [x] 2.6 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/core/vector2.ts` (9 tags)
- [x] 2.7 Replace all `@since 0.8.0` and `@since 0.9.0` with `@since 0.7.0` in `packages/math2d/src/core/rotation2.ts` (4 tags)

## 3. Deprecation notice fixes

- [x] 3.1 Fix `@deprecated` on static `Vector2.sumComponents` (line ~390): change `Since 0.8.0. This method has no standard geometric meaning. Will be removed in 1.0.0.` to `Since 0.7.0. This method has no standard geometric meaning.`
- [x] 3.2 Fix `@deprecated` on instance `Vector2.sumComponents` (line ~3424): same change as 3.1

## 4. OpenSpec archive corrections

- [x] 4.1 Update `openspec/changes/archive/2026-03-12-math2d-doc-audit-v2/design.md` lines 114-115: replace `0.8.0` with `0.7.0`
- [x] 4.2 Update `openspec/changes/archive/2026-03-12-math2d-doc-audit-v2/tasks.md` line 58: replace `@since 0.8.0` with `@since 0.7.0`
- [x] 4.3 Update `openspec/changes/archive/2026-04-07-math2d-deep-audit/verdicts/vector2-rotation2-verdict.md` line 55: replace `since 0.8.0; will be removed in 1.0.0` with `since 0.7.0`
- [x] 4.4 Update `openspec/changes/archive/2026-04-07-math2d-deep-audit/verdicts/vector2-rotation2-verdict.md` line 101: replace `added in 0.9.0` with `added in 0.7.0`
- [x] 4.5 Update `openspec/changes/archive/2026-04-07-math2d-deep-audit/design.md` line 67: replace `v1.0.0` with `a future major version`

## 5. Verification and regeneration

- [x] 5.1 Run `grep -r "@since 0\.[89]" packages/math2d/src/` — confirm zero matches
- [x] 5.2 Run `grep -r "removed in [1-9]" packages/math2d/src/` — confirm zero matches
- [x] 5.3 Run `grep -r "Since 0\.[89]" packages/math2d/src/` — confirm zero matches
- [x] 5.4 Run `npm run build` to verify no build regressions
- [x] 5.5 Run `npm run test:unit` to verify no test regressions
- [x] 5.6 Regenerate API docs (TypeDoc) so `docs/docs/api/` reflects corrected versions
- [x] 5.7 Run final grep across all non-generated files to confirm no remaining library version > 0.7.0
