## Why

The `@lenguados/math2d` package has accumulated technical debt across its 6 architectural layers from multiple development iterations. A comprehensive audit of all source modules (~12,000 LOC across 25 source files) reveals issues in API consistency, missing validation, broken serialization round-trips, naming asymmetries between core types, and gaps in edge case coverage. These issues, while none are critical individually, compound into an inconsistent developer experience and latent bugs that will amplify as downstream packages (physics, geometry) build on this foundation.

Addressing this debt now — before the API surface grows further — prevents cascading design errors in dependent packages and establishes the definitive API contract for v1.0.

## What Changes

### Serialization & Parsing

- **BREAKING**: Fix `Transform2` format/parse to include scale components (currently hardcodes scale to `(1,1)`, losing data)
- Fix `Interval` parsing to validate `min <= max` in JSON code path (bypasses validation at line 820)

### API Consistency

- **BREAKING**: Convert Vector2 `angle()` instance method to `get angle()` getter (matching Complex/Rotation2 pattern); add `set angle()` setter
- Fix Vector2 instance methods that diverge from static counterparts: `reject()` silently returns `this` (static throws), `project()` silently returns `(0,0)` (static throws), `reflect()` skips validation (static validates). All instance methods will match their static triality tier.
- Add missing instance triality methods: `rejectSafe()`/`rejectUnchecked()`, `projectSafe()`/`projectUnchecked()`
- Standardize zero-length fallback semantics: document `Vector2.normalizeSafe -> (0,0)` vs `Complex/Rotation2.normalizeSafe -> (1,0)` as intentional
- Note: `Vector2.signedAngle(from, to)` NOT needed — already exists as `Vector2.angleTo(a, b)` using `atan2(cross, dot)`

### Validation & Type Safety

- Refactor `assert*Like` functions to compose with `is*Like` type guards (DRY)
- Add non-finite validation to `roundToPlaces`, `roundToMultiple`, `snapToGrid` (inconsistent with `roundToInt`)
- Fix `logSafe` one-line JSDoc summary (says "returns -Infinity" but implementation returns `0`; the @returns tag is already correct)

### Edge Case Coverage

- Add NaN/Infinity edge case tests for angle module (76 tests pass but no NaN/Infinity coverage)
- Add parse/format round-trip test suite (currently no dedicated test file)
- Add extreme value tests for `sign(NaN)`, `compare(1e308, 1e308)`, `inRange(NaN, ...)`

### Architecture

- Change `defaultRandomSource` from mutable `export let` to function-only API (thread-safety)
- Document `config.useNativeMath` global mutability and thread-safety implications
- Remove redundant `divideSafe` calls in `Complex.normalize`/`normalizeSafe`/`normalized` and `Rotation2.normalizeComponents` (magnitude already validated non-zero in all cases)
- Fix `parseTransform2` flat path lossy `atan2` round-trip (converts cos/sin→angle→cos/sin)

### Documentation Fixes

- Fix `unwrapAngles` JSDoc example: documented output is wrong (`[0, PI, 2*PI]` vs actual `[0, -PI, -2*PI]`)
- Document Complex `normalized` getter inconsistency: returns `(0,0)` for zero-magnitude while `normalizeSafe()` returns `(1,0)`

## Capabilities

### New Capabilities

- `serialization-correctness`: Ensures all parse/format functions maintain data integrity through round-trips, with proper validation in all code paths
- `api-consistency-triality`: Enforces the Safe/Unchecked triality pattern uniformly across all fallible operations and harmonizes accessor patterns between core types
- `edge-case-coverage`: Systematic NaN/Infinity/extreme-value test coverage for all auxiliary and core modules
- `validation-composition`: DRY assertion layer that composes type guards with assertions, eliminating logic duplication

### Modified Capabilities

- `core-types-api`: Convert Vector2 angle to getter/setter, fix instance method triality divergence (reject/project/reflect), Complex normalize optimization
- `auxiliary-api`: Add non-finite validation to rounding functions, fix logSafe documentation
- `support-layers-api`: Change defaultRandomSource to function-only API, fix Transform2 serialization
- `determinism-guarantees`: Document config mutability constraints

## Impact

**Affected layers (all 6):**

1. **deterministic/** — config documentation
2. **auxiliary/scalar** — minor test additions for edge cases
3. **auxiliary/angle** — NaN/Infinity test coverage
4. **auxiliary/numeric** — rounding validation, logSafe JSDoc fix
5. **core/** — Vector2 angle accessor conversion, instance method triality fixes (reject/project/reflect), Complex.normalize optimization
6. **utils/** — Transform2 serialization fix, parse validation, randomSource API change, round-trip tests

**Breaking changes:**

1. Transform2 serialization format change (adds scale to JSON output). Consumers parsing Transform2 JSON must handle the new `s` (scale) field.
2. Vector2 `angle()` method → `angle` getter (callers using `v.angle()` must change to `v.angle`).
3. Vector2 instance `reject()` changes from silent no-op to throwing on zero axis.

**Bundle size:** Minimal impact. New methods add ~200 LOC. Assertion refactoring may slightly reduce dev bundle.

**Tree-shaking:** Not affected. All new exports follow existing conditional export pattern.

**Rollback plan:** All changes are isolated per-module. Each capability can be reverted independently. The Transform2 serialization change includes backward-compatible parsing (accepts both old format without scale and new format with scale).
