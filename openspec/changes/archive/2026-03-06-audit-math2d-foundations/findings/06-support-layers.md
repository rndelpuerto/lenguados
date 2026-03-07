# Phase 1 - Audit: types/, validation/, utils/ (Tasks 6.1-6.14)

## 6.1 types/index.ts

**File:** `src/types/index.ts` (438 lines)

### Interface Pairs (7)

| Readonly Interface     | Mutable Interface | Properties                         |
| ---------------------- | ----------------- | ---------------------------------- |
| ReadonlyVector2Like    | Vector2Like       | x, y                               |
| ReadonlyMatrix2Like    | Matrix2Like       | m00, m01, m10, m11                 |
| ReadonlyMatrix3Like    | Matrix3Like       | m00-m22 (9 properties)             |
| ReadonlyRotation2Like  | Rotation2Like     | cos, sin                           |
| ReadonlyComplexLike    | ComplexLike       | real, imag                         |
| ReadonlyIntervalLike   | IntervalLike      | min, max                           |
| ReadonlyTransform2Like | Transform2Like    | position, rotation, scale (nested) |

### Type Guard Functions (7)

| Guard            | Narrows To             | Strategy                                                   |
| ---------------- | ---------------------- | ---------------------------------------------------------- |
| isVector2Like    | ReadonlyVector2Like    | hasNumericProperties(['x', 'y'])                           |
| isMatrix2Like    | ReadonlyMatrix2Like    | hasNumericProperties(['m00', 'm01', 'm10', 'm11'])         |
| isMatrix3Like    | ReadonlyMatrix3Like    | hasNumericProperties(9 keys)                               |
| isRotation2Like  | ReadonlyRotation2Like  | hasNumericProperties(['cos', 'sin'])                       |
| isComplexLike    | ReadonlyComplexLike    | hasNumericProperties(['real', 'imag'])                     |
| isIntervalLike   | ReadonlyIntervalLike   | hasNumericProperties(['min', 'max'])                       |
| isTransform2Like | ReadonlyTransform2Like | Recursive: isVector2Like + isRotation2Like + isVector2Like |

### Internal Helper

`hasNumericProperties(object, keys)` - loops through keys, checks `key in object` and `typeof === 'number'`. Shared by all flat type guards. Transform2Like uses recursive composition instead.

### Analysis

- **All 7 pairs are symmetric**: Readonly adds `readonly` modifier, mutable doesn't. Clean pattern.
- **Type guards narrow to Readonly**: Correct - guards accept `unknown` and narrow to the most restrictive (readonly) interface.
- **Transform2Like uses nesting**: `position: ReadonlyVector2Like`, `rotation: ReadonlyRotation2Like`, `scale: ReadonlyVector2Like`. The type guard correctly uses recursive checks.
- **No NaN/finite validation in type guards**: Guards only check structural shape (property existence + `typeof number`), NOT value validity. A `{ x: NaN, y: Infinity }` passes `isVector2Like`. This is correct - type guards are about shape, not value. Assertions handle value validation.

**Verdict:** Clean, well-designed type system. Complete coverage of all 7 core types.

---

## 6.2 Consumer Map for types/

### \*Like Interface Consumers

| Core Type  | Readonly\*Like Used For                | Mutable\*Like Used For |
| ---------- | -------------------------------------- | ---------------------- |
| Vector2    | Input parameters (add, subtract, etc.) | `out?` return type     |
| Complex    | Input parameters                       | `out?` return type     |
| Rotation2  | Input parameters                       | `out?` return type     |
| Interval   | Input parameters                       | -                      |
| Matrix2    | Input parameters                       | `out?` return type     |
| Matrix3    | Input parameters                       | `out?` return type     |
| Transform2 | Input parameters                       | `out?` return type     |

### Readonly\*Like Usage Verification

All core types use `Readonly*Like` for input parameters universally:

- `Vector2.add(a: ReadonlyVector2Like, b: ReadonlyVector2Like, out?: Vector2)`
- `Matrix3.multiply(a: ReadonlyMatrix3Like, b: ReadonlyMatrix3Like, out?: Matrix3)`
- Pattern is consistent across all types.

### Type Guard Re-exports

Some core types re-export their type guard:

- `vector2.ts` re-exports `isVector2Like` from types/
- `matrix2.ts` re-exports `isMatrix2Like` from types/
- `matrix3.ts` re-exports `isMatrix3Like` from types/
- Other types do NOT re-export their guards

**Inconsistency:** Only 3/7 core types re-export their type guard. Should be all or none.

---

## 6.3 Duck-Typing vs External Approaches

| Approach              | Library   | Pros                                                                                | Cons                                           |
| --------------------- | --------- | ----------------------------------------------------------------------------------- | ---------------------------------------------- |
| Duck-typing (\*Like)  | lenguados | Interop with any object; serialization-friendly; no instanceof issues across frames | No prototype methods; extra type checking cost |
| Concrete classes only | three.js  | Simple; prototype methods; instanceof works                                         | No interop; cross-frame issues                 |
| Typed arrays          | gl-matrix | Memory efficient; GPU-compatible; cache-friendly                                    | No property names; error-prone indexing        |
| C++ templates         | Eigen     | Zero-cost abstraction; compile-time resolution                                      | N/A for JS                                     |

**Assessment:** lenguados's duck-typing is the best approach for a JS library targeting both browser and Node.js. It avoids `instanceof` issues across iframes/Workers, enables JSON round-tripping, and works with plain objects from any source.

---

## 6.4 validation/assert.ts

**File:** `src/validation/assert.ts` (910 lines)

### DCE (Dead Code Elimination) Mechanism

```typescript
const DEV_MODE =
 typeof process !== 'undefined' && process.env.NODE_ENV === 'production' ? false : true;
```

Every assertion function has:

```typescript
if (!DEV_MODE) return; // Compile-time elimination
if (!assertionsEnabled) return; // Runtime toggle
```

**Production behavior:** When `NODE_ENV=production`, bundlers replace the condition with `false`, making all assertion functions empty. Minifiers then eliminate the dead code entirely.

### Assertion Functions (22 total)

**Configuration (2):**

- `setAssertionsEnabled(enabled)` - Runtime toggle (dev only)
- `areAssertionsEnabled()` - Query state

**Scalar assertions (6):**

- `assertFinite(value, name?)` - Not NaN/Infinity
- `assertNonZero(value, name?)` - Strict !== 0
- `assertRange(value, min, max, name?)` - Inclusive bounds
- `assertPositive(value, name?)` - Strictly > 0
- `assertNonNegative(value, name?)` - >= 0
- `assertSafeInteger(value, name?)` - Number.isSafeInteger

**Generic assertion (1):**

- `assert(condition, message?)` - Boolean condition

**Type component assertions (6):**

- `assertVector2(x, y, name?)` - Both components finite
- `assertMatrix2(m00, m01, m10, m11, name?)` - All 4 finite
- `assertMatrix3(9 params, name?)` - All 9 finite
- `assertRotation2(cos, sin, name?)` - Both finite (does NOT check unit constraint)
- `assertComplex(real, imag, name?)` - Both finite
- `assertInterval(min, max, name?)` - Both finite AND min <= max
- `assertTransform2(px, py, cos, sin, sx, sy, name?)` - All 6 finite

**Shape assertions (7):**

- `assertVector2Like(value, name?)` - Object shape + finite
- `assertMatrix2Like(value, name?)` - Shape + finite
- `assertMatrix3Like(value, name?)` - Shape + finite
- `assertRotation2Like(value, name?)` - Shape + finite
- `assertComplexLike(value, name?)` - Shape + finite
- `assertIntervalLike(value, name?)` - Shape + finite + min <= max
- `assertTransform2Like(value, name?)` - Recursive shape + finite

### Coverage: All 7 Types Covered

Each type has both:

1. Component assertion (takes individual numbers) - used when constructing
2. Shape assertion (takes `unknown`) - used when accepting external objects

**Notable:** `assertRotation2` checks finiteness but NOT the unit constraint (cos^2 + sin^2 = 1). This is intentional per TSDoc — unit constraint validation would be expensive for every assertion.

---

## 6.5 Validation Consumer Map

### Which core types use assertions?

| Core Type  | Assertions Used           | Where                                      |
| ---------- | ------------------------- | ------------------------------------------ |
| Vector2    | assertFinite              | Constructor, set, static factories         |
| Complex    | assertFinite              | Constructor, set, static factories         |
| Rotation2  | assertFinite              | Set, fromAngle                             |
| Interval   | assert, assertNonNegative | Constructor (min<=max), expand (amount>=0) |
| Matrix2    | assertSafeInteger         | fromArray (offset validation)              |
| Matrix3    | assertSafeInteger         | fromArray (offset validation)              |
| Transform2 | assertFinite              | Constructor, set                           |

### Validation Policy Consistency

| Tier             | Behavior                                           | Consistent? |
| ---------------- | -------------------------------------------------- | ----------- |
| Strict (default) | Assertions active → throws in dev, no-op in prod   | Yes         |
| Safe             | No assertions; returns fallback value              | Yes         |
| Unchecked        | No assertions; undefined behavior on invalid input | Yes         |

The three-tier system is consistent: strict methods use assertions, safe methods use runtime guards, unchecked methods skip everything.

**Gap:** `auxiliary/` functions do NOT use assertions. Only `core/` types do. This means calling `lerp(NaN, 1, 0.5)` in strict mode doesn't throw - it just returns NaN. The assertion boundary is at the core type level, not the scalar utility level.

---

## 6.6 Comparison with External Approaches

| Approach      | Library             | Pattern                         | Production Cost     |
| ------------- | ------------------- | ------------------------------- | ------------------- |
| DCE-based     | lenguados           | `if (!DEV_MODE) return`         | Zero (eliminated)   |
| Preprocessor  | Box2D (C++)         | `#ifdef B2_DEBUG`               | Zero (compile-time) |
| Debug.Assert  | Unity (C#)          | `[Conditional("DEBUG")]`        | Zero (stripped)     |
| zod           | zod (JS)            | Schema-based runtime validation | Full runtime cost   |
| No validation | gl-matrix, three.js | Trust the caller                | Zero                |

lenguados's approach matches Box2D/Unity: zero-cost in production, full validation in development. This is superior to gl-matrix/three.js (no validation at all) and zod (always-on runtime cost).

---

## 6.7 Error Messages

### Sample Messages

| Assertion                     | Message                                                      |
| ----------------------------- | ------------------------------------------------------------ |
| assertFinite(NaN, 'velocity') | `[math2d] velocity must be finite, got NaN`                  |
| assertRange(5, 0, 1, 't')     | `[math2d] t must be in [0, 1], got 5`                        |
| assertPositive(-1, 'radius')  | `[math2d] radius must be positive (> 0), got -1`             |
| assertVector2Like(null)       | `[math2d] value must be an object, got object`               |
| assertInterval(5, 3)          | `[math2d] interval.min (5) must not exceed interval.max (3)` |

### Quality Assessment

| Criterion               | Rating  | Notes                                        |
| ----------------------- | ------- | -------------------------------------------- |
| Prefix identification   | Good    | All start with `[math2d]`                    |
| Parameter naming        | Good    | Uses `name` param when provided              |
| Value in message        | Good    | Shows actual value received                  |
| Bound information       | Good    | Shows expected range for assertRange         |
| Safe variant suggestion | Missing | No message suggests using \*Safe alternative |
| Stack trace             | N/A     | Thrown Error automatically includes stack    |

**Gap:** Error messages don't suggest the Safe variant. E.g., `assertFinite` in `divideSafe` context could say "use divideSafe for safe handling" but doesn't.

---

## 6.8 parse.ts

**File:** `src/utils/parse.ts` (891 lines)

### Parse/Format Pairs (7)

| Type       | Parse Function             | Format Function                 | Out Param |
| ---------- | -------------------------- | ------------------------------- | --------- |
| Vector2    | parseVector2(str, out?)    | formatVector2(v, precision?)    | Yes       |
| Rotation2  | parseRotation2(str, out?)  | formatRotation2(r, precision?)  | Yes       |
| Matrix2    | parseMatrix2(str, out?)    | formatMatrix2(m, precision?)    | Yes       |
| Matrix3    | parseMatrix3(str, out?)    | formatMatrix3(m, precision?)    | Yes       |
| Transform2 | parseTransform2(str, out?) | formatTransform2(t, precision?) | Yes       |
| Complex    | parseComplex(str, out?)    | formatComplex(c, precision?)    | Yes       |
| Interval   | parseInterval(str, out?)   | formatInterval(i, precision?)   | Yes       |

### Parse Formats Supported

All parse functions support:

- Comma-separated: `"1, 2"`
- Space-separated: `"1 2"`
- Parenthesized: `"(1, 2)"`
- Bracketed: `"[1, 2]"`
- JSON-like: `'{"x": 1, "y": 2}'`

### Format Precision

Format functions default to 4 decimal places (configurable via `precision` parameter).

### Composition

- Parse functions create `new Type()` as default `out`, then populate
- Uses `JSON.parse` for JSON-like format with fast structural check to avoid V8 deopt
- Imports atan2 from deterministic/ (for formatRotation2 angle display)
- No validation/ imports — parse functions throw their own errors

**Verdict:** Complete coverage. Clean pattern. Good format flexibility.

---

## 6.9 parse.ts Composition

| Dependency           | What                                   | Why                                   |
| -------------------- | -------------------------------------- | ------------------------------------- |
| core/ constructors   | Vector2, Complex, Matrix2, etc.        | Default `out` parameter               |
| core/ Readonly types | ReadonlyVector2, ReadonlyMatrix2, etc. | Format function input                 |
| deterministic/       | atan2                                  | Computing angle for Rotation2 display |
| types/               | ReadonlyRotation2Like                  | Type for format parameter             |

**Does NOT import from:**

- validation/ (does its own error checking)
- auxiliary/ (no scalar utilities needed)

---

## 6.10 random.ts + random-source.ts

**File:** `src/utils/random-source.ts` (265 lines)

### RandomSource Interface

```typescript
interface RandomSource {
 next(): number; // [0, 1)
 nextInt(max: number): number; // [0, max)
 seed?(seed: number): void; // Optional seeding
}
```

### Implementations

| Class              | Algorithm                          | Deterministic? | Seedable? |
| ------------------ | ---------------------------------- | -------------- | --------- |
| MathRandomSource   | Math.random()                      | No             | No        |
| SeededRandomSource | Park-Miller LCG (minimal standard) | Yes            | Yes       |

**SeededRandomSource details:**

- Multiplier: 16807 (7^5)
- Modulus: 2147483647 (2^31 - 1, Mersenne prime)
- Uses Schrage's method to avoid overflow
- State save/restore via getState()/setState()
- Period: 2^31 - 2 (~2.1 billion)

**Global state:** `defaultRandomSource` (mutable `let` export). Same Web Worker concern as `config.useNativeMath`.

**File:** `src/utils/random.ts` (682 lines)

### Random Generation Functions (18)

| Function                                                     | Output Type | Distribution           | Dependencies            |
| ------------------------------------------------------------ | ----------- | ---------------------- | ----------------------- |
| randomVector2(min, max, out?, source?)                       | Vector2     | Uniform per-component  | -                       |
| randomUnitVector2(out?, source?)                             | Vector2     | Uniform on unit circle | sin, cos                |
| randomOnCircle(center, radius, out?, source?)                | Vector2     | Uniform on circle      | sin, cos                |
| randomInUnitCircle(out?, source?)                            | Vector2     | Uniform in unit disk   | sin, cos, sqrtSafe      |
| randomInCircle(center, radius, out?, source?)                | Vector2     | Uniform in disk        | sin, cos, sqrtSafe      |
| randomRotation2(out?, source?)                               | Rotation2   | Uniform angle          | sin, cos                |
| randomRotationMatrix2(out?, source?)                         | Matrix2     | Uniform rotation       | sin, cos                |
| randomTransform2(posMin, posMax, sclMin, sclMax, out?, src?) | Transform2  | Per-component uniform  | sin, cos                |
| randomInRectangle(min, max, out?, source?)                   | Vector2     | Uniform in AABB        | -                       |
| randomInBox(center, halfSize, out?, source?)                 | Vector2     | Uniform in box         | -                       |
| randomOnRectangle(min, max, out?, source?)                   | Vector2     | Uniform on perimeter   | lerp                    |
| randomGaussianVector2(mean, stdDev, out?, source?)           | Vector2     | Box-Muller Gaussian    | sin, cos, log, sqrtSafe |
| randomOnSegment(a, b, out?, source?)                         | Vector2     | Uniform on segment     | lerp                    |
| randomInTriangle(a, b, c, out?, source?)                     | Vector2     | Uniform in triangle    | -                       |
| randomOnTriangle(a, b, c, out?, source?)                     | Vector2     | Uniform on perimeter   | -                       |
| randomComplex(minR, maxR, minI, maxI, out?, src?)            | Complex     | Per-component uniform  | -                       |
| randomUnitComplex(out?, source?)                             | Complex     | Uniform angle          | sin, cos                |
| randomInterval(minLow, maxHigh, out?, source?)               | Interval    | Uniform bounds         | -                       |

### Deterministic Math Usage

Uses from deterministic/: `sin`, `cos`, `log`, `sqrtSafe`
Uses from auxiliary/scalar: `TAU`, `lerp`
Uses from validation/: `assertNonNegative`

**All trigonometric operations use deterministic kernels.** This ensures that `SeededRandomSource + deterministic sin/cos = reproducible across platforms`. Correct.

---

## 6.11 random.ts Composition

| Source                         | What Used                                                  |
| ------------------------------ | ---------------------------------------------------------- |
| deterministic/                 | sin, cos, log, sqrtSafe                                    |
| auxiliary/scalar/constants     | TAU                                                        |
| auxiliary/scalar/interpolation | lerp                                                       |
| core/                          | Vector2, Complex, Interval, Matrix2, Rotation2, Transform2 |
| validation/                    | assertNonNegative                                          |
| random-source.ts               | RandomSource, defaultRandomSource                          |

**Assessment:** Good composition. Uses deterministic kernels for cross-platform reproducibility. Uses core constructors for output. Uses auxiliary scalars for constants and interpolation.

---

## 6.12 performance.ts

**File:** `src/utils/performance.ts` (367 lines)

### Entities

| Entity                     | Type      | Purpose                                    |
| -------------------------- | --------- | ------------------------------------------ |
| timestamp()                | Function  | performance.now() with Date.now() fallback |
| Measurement<T>             | Interface | { label, duration, value }                 |
| MeasurementSummary         | Interface | { label, count, total, min, max, mean }    |
| measure(label, fn)         | Function  | Synchronous timing                         |
| measureAsync(label, fn)    | Function  | Async timing                               |
| recordMeasurement(map, m)  | Function  | Accumulate into collector                  |
| summarizeMeasurements(map) | Function  | Compute summary stats                      |
| formatSummary(summary)     | Function  | Human-readable string                      |
| MeasurementCollector<T>    | Class     | Convenience wrapper                        |

### Assessment

- **General-purpose, not math-specific.** Nothing in this module is specific to 2D math.
- **Migration planned:** TSDoc explicitly says it will move to `@lenguados/devtools` in v2.0.
- **No dependencies on math2d internals:** Completely self-contained.
- **performance.now() detection:** Correct check for Node.js/browser/Worker compatibility.

**Verdict:** Well-implemented but belongs in a separate package. The migration plan is already documented.

---

## 6.13 Public index.ts

**File:** `src/index.ts` (148 lines)

### Export Surface

| Category           | How Exported                          | Count                                   |
| ------------------ | ------------------------------------- | --------------------------------------- |
| types/             | `export * from './types'`             | 14 interfaces + 7 guards                |
| auxiliary/scalar/  | `export * from './auxiliary/scalar'`  | ~40 functions + 21 constants            |
| auxiliary/angle/   | `export * from './auxiliary/angle'`   | ~23 functions + 1 interface             |
| auxiliary/numeric/ | `export * from './auxiliary/numeric'` | ~26 functions + 1 constant              |
| core/              | `export * from './core'`              | 7 classes + 7 freeze + 6 Readonly types |
| deterministic/     | Named exports                         | 18 functions + 1 bag object             |
| validation/        | Named exports                         | 22 functions                            |
| **Total**          |                                       | ~170+ exports                           |

### Tree-Shaking Assessment

- **Wildcard re-exports** (`export *`) are tree-shakeable in modern bundlers (Rollup, Webpack 5, esbuild)
- **No side effects** at module scope (no global state initialization beyond `assertionsEnabled = true` and `defaultRandomSource`)
- **`defaultRandomSource`** is a `let` export — creates a module-level object. Could prevent tree-shaking of random-source.ts even if unused
- **`config.useNativeMath`** in deterministic/ — same concern

### Stale References Check

- All named exports from deterministic/ correspond to real functions
- All named exports from validation/ correspond to real functions
- `export * from './core'` includes the `ReadonlyRotation2` type alias... actually no — ReadonlyRotation2 is MISSING from core/index.ts

### Naming Conflicts

Potential naming conflicts in the flat namespace:

- `sinCos` exists in both deterministic/ and auxiliary/angle/ — deterministic's is re-exported by name, angle's comes via `export *`. Both might be exported. **Possible conflict.**
- `log` from deterministic/ and `logSafe` from numeric/safety — different names, no conflict
- `sqrtSafe` re-exported from both deterministic/ (named) and numeric/safety (via `export *`) — **potential duplicate export**

---

## 6.14 Diagnostic by Entity

### types/

| Entity                           | Verdict  | Justification                        |
| -------------------------------- | -------- | ------------------------------------ |
| 7 Readonly\*Like interfaces      | Keep     | Clean duck-typing for input params   |
| 7 Mutable \*Like interfaces      | Keep     | Clean for output/mutation            |
| 7 is\*Like type guards           | Keep     | Correct structural checks            |
| hasNumericProperties helper      | Keep     | Good DRY for flat guards             |
| Type guard re-export consistency | Redefine | Only 3/7 re-exported from core types |

### validation/

| Entity                                    | Verdict    | Justification                                |
| ----------------------------------------- | ---------- | -------------------------------------------- |
| DEV_MODE + DCE mechanism                  | Keep       | Industry-standard zero-cost assertions       |
| setAssertionsEnabled/areAssertionsEnabled | Keep       | Runtime toggle for dev                       |
| assertFinite                              | Keep       | Most-used assertion (5 consumers)            |
| assertNonZero                             | Keep       | Useful for division guards                   |
| assertRange                               | Keep       | Parametric range check                       |
| assertPositive / assertNonNegative        | Keep       | Sign validation                              |
| assertSafeInteger                         | Keep       | Used by Matrix2/3 fromArray                  |
| assert (generic)                          | Keep       | Flexible base assertion                      |
| 7 type component assertions               | Keep       | Full coverage                                |
| 7 shape assertions (\*Like)               | Keep       | External object validation                   |
| Error message quality                     | Redefine   | Missing Safe variant suggestions             |
| assertRotation2 unit check                | Keep as-is | Unit constraint too expensive for every call |

### utils/parse.ts

| Entity                | Verdict | Justification                       |
| --------------------- | ------- | ----------------------------------- |
| 7 parse functions     | Keep    | Complete coverage, flexible formats |
| 7 format functions    | Keep    | Configurable precision              |
| out parameter pattern | Keep    | Consistent with core types          |
| JSON fast-path        | Keep    | Good V8 optimization awareness      |

### utils/random-source.ts

| Entity                                        | Verdict  | Justification                                     |
| --------------------------------------------- | -------- | ------------------------------------------------- |
| RandomSource interface                        | Keep     | Clean abstraction                                 |
| MathRandomSource                              | Keep     | Default non-deterministic                         |
| SeededRandomSource                            | Keep     | Park-Miller LCG, reproducible                     |
| defaultRandomSource global                    | Redefine | Mutable global, same Web Worker concern as config |
| getDefaultRandomSource/setDefaultRandomSource | Keep     | Proper accessor pattern                           |

### utils/random.ts

| Entity                            | Verdict | Justification               |
| --------------------------------- | ------- | --------------------------- |
| 18 random generation functions    | Keep    | Comprehensive coverage      |
| Deterministic kernel usage        | Keep    | Correct for reproducibility |
| Box-Muller Gaussian               | Keep    | Standard algorithm          |
| sqrt(r) for uniform disk sampling | Keep    | Correct area distribution   |

### utils/performance.ts

| Entity               | Verdict        | Justification                |
| -------------------- | -------------- | ---------------------------- |
| measure/measureAsync | Keep (migrate) | Useful but not math-specific |
| MeasurementCollector | Keep (migrate) | Convenience wrapper          |
| timestamp            | Keep (migrate) | Cross-environment            |
| formatSummary        | Keep (migrate) | Human-readable output        |

### index.ts

| Entity                     | Verdict  | Justification                              |
| -------------------------- | -------- | ------------------------------------------ |
| Export surface             | Redefine | Potential sinCos/sqrtSafe naming conflicts |
| Missing ReadonlyRotation2  | Add      | Gap in core/ exports                       |
| utils/ not in main exports | Keep     | Correct — parse/random/perf are secondary  |

**Summary:** 55 Keep, 5 Redefine, 0 Remove, 1 Add (ReadonlyRotation2)
