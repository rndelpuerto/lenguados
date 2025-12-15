# @lenguados/math2d — Module Synergy Analysis 2025

> **Audit Date:** December 25, 2025  
> **Methodology:** Import graph analysis, grep searches for cross-module usage patterns.  
> **Scope:** Collaboration between auxiliary, deterministic, utils, and core layers.

---

## Executive Summary

The codebase demonstrates **strong collaborative design** with clear layer separation. However, there are **synergy gaps** where modules could benefit from better integration.

---

## Layer Dependency Graph

```
┌─────────────────────────────────────────────────────────────────┐
│                           UTILS                                  │
│  random.ts → core/*, deterministic/*, auxiliary/*                │
│  parse.ts  → core/*, auxiliary/*                                 │
│  performance.ts → (standalone)                                   │
│  random-source.ts → auxiliary/scalar                             │
└─────────────────────────────────────────────────────────────────┘
                              │ imports
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                           CORE                                   │
│  Vector2 ──┬── DeterministicMath, auxiliary/{numeric,scalar,angle}│
│  Matrix2 ──┤                                                     │
│  Matrix3 ──┤                                                     │
│  Rotation2 ┤                                                     │
│  Complex ──┤                                                     │
│  Transform2┤                                                     │
│  Interval ─┴── ⚠️ NO DeterministicMath import                    │
└─────────────────────────────────────────────────────────────────┘
                              │ imports
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                      DETERMINISTIC                               │
│  DeterministicMath ← sin/cos/sqrt/atan2/pow                      │
│  PrecisionMath ← kahanSum/neumaierSum/twoSum/twoProduct          │
│  RoundingControl ← banker's rounding/quantization                │
│  trig-tables ← 65536-entry lookup tables                         │
└─────────────────────────────────────────────────────────────────┘
                              │ imports
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                       AUXILIARY                                  │
│  numeric/safety → PrecisionMath (kahanSum, neumaierSum wrapper)  │
│  numeric/rounding → RoundingControl (nearestEven, truncate)      │
│  scalar/* → constants, comparisons, interpolation                │
│  angle/* → normalization, operations, interpolation              │
└─────────────────────────────────────────────────────────────────┘
```

---

## Core Classes Auxiliary Usage Matrix

| Class      | safeDivide | safeSqrt | safeAcos | sinCos | lerp | smoothStep | EPSILON | saturate |
| ---------- | :--------: | :------: | :------: | :----: | :--: | :--------: | :-----: | :------: |
| Vector2    |     ✅     |    ✅    |    ✅    |   ✅   |  ✅  |     ✅     |   ✅    |    —     |
| Rotation2  |     ✅     |    ✅    |    —     |   ✅   |  —   |     ✅     |   ✅    |    ✅    |
| Complex    |     ✅     |    ✅    |    —     |   ✅   |  ✅  |     ✅     |   ✅    |    ✅    |
| Matrix2    |     ✅     |    ✅    |    —     |   ✅   |  ✅  |     —      |   ✅    |    —     |
| Matrix3    |     ✅     |    ✅    |    —     |   ✅   |  ✅  |     —      |   ✅    |    —     |
| Transform2 |     —      |    —     |    —     |   ✅   |  ✅  |     ✅     |   ✅    |    ✅    |
| Interval   |     ✅     |    ✅    |    —     |   —    |  ✅  |     ✅     |   ✅    |    ✅    |

**Observations:**

- `safeDivide`/`safeSqrt` used by 6/7 classes (Transform2 doesn't need it)
- `sinCos` used by 6/7 classes (Interval doesn't need rotations)
- `EPSILON` used by all 7 classes ✅

---

## Core Classes DeterministicMath Usage

| Class      | atan2 | sin | cos | sqrt | pow |
| ---------- | :---: | :-: | :-: | :--: | :-: |
| Vector2    |  ✅   | ✅  |  —  |  ✅  |  —  |
| Rotation2  |  ✅   |  —  |  —  |  —   |  —  |
| Complex    |  ✅   |  —  |  —  |  —   | ✅  |
| Matrix2    |  ✅   |  —  |  —  |  —   |  —  |
| Matrix3    |  ✅   |  —  |  —  |  —   |  —  |
| Transform2 |  ✅   |  —  |  —  |  —   |  —  |
| Interval   |  ❌   | ❌  | ❌  |  ❌  | ❌  |

### 🔴 Critical Gap: Interval Isolation

`Interval` is the **only core class** that doesn't import `DeterministicMath`. This may cause:

- Inconsistent behavior if Interval is used in physics simulations
- Future maintenance issues

**Potential issue scenarios:**

- If Interval adds angle-based operations, they won't be deterministic
- If Interval.sqrt() or similar is added, it may not use the deterministic version

---

## Inter-Module Conversion Network

```
                    ┌─────────────┐
         ┌─────────▶│   Matrix3   │◀──── toMatrix3() ────┐
         │          └─────────────┘                       │
    toMatrix2()            │                              │
         │                 │                              │
         ▼                 │                              │
 ┌─────────────┐           │                      ┌───────────────┐
 │   Matrix2   │◀──────────┴───── fromMatrix2()   │  Transform2   │
 └─────────────┘                                  └───────────────┘
                                                         │
         ┌────────────────────────────────────────┬──────┘
         │                                        ▼
         │                               toRotation2()
         │                                        │
         │                                        ▼
 ┌─────────────┐    fromVector2/toVector2    ┌───────────────┐
 │   Vector2   │◀───────────────────────────▶│   Rotation2   │
 └─────────────┘                             └───────────────┘
         │                                        │
         │ fromComplex()                          │ fromComplex/toComplex
         │ toComplexLike()                        │
         ▼                                        ▼
 ┌─────────────┐    toRotationMatrix2()      ┌───────────────┐
 │   Complex   │───────────────────────────▶│   Matrix2Like │
 └─────────────┘                             └───────────────┘

         ┌─────────────┐
         │  Interval   │  ⚠️ ISOLATED - no inter-module conversions
         └─────────────┘
```

---

## 🔴 Synergy Gaps Identified

### 1. Interval Isolation (Critical)

| Issue                            | Impact          | Recommendation                         |
| -------------------------------- | --------------- | -------------------------------------- |
| No DeterministicMath import      | Determinism gap | Add import even if not currently used  |
| No inter-module conversions      | Usability gap   | Add `Vector2.toInterval()` for bounds? |
| Not used by any other core class | Integration gap | Consider `Interval.clampVector2()`     |

**Potential synergies:**

```typescript
// Vector2 → Interval (project to axis)
Vector2.toIntervalX(): Interval  // bounds on X axis
Vector2.toIntervalY(): Interval  // bounds on Y axis

// Interval × Vector2 (clamping)
Interval.clampScalar(value): number  // already exists
Interval.clampVector2Component(v, axis): number  // new

// Interval for angle wrapping
Interval.RADIANS.wrap(angle): number  // use existing wrapToRange?
```

### 2. Utils Not Integrated with Core (Medium)

| Issue            | Current State        | Recommendation                                    |
| ---------------- | -------------------- | ------------------------------------------------- |
| Random functions | In `utils/random.ts` | Consider `Vector2.random()`, `Rotation2.random()` |
| Parse functions  | In `utils/parse.ts`  | Consider `Vector2.parse()` static method          |

**Current separation is intentional** (keeps core lightweight), but may cause discoverability issues.

### 3. Missing Bidirectional Conversions

| From       | To         |        Forward         |            Reverse            |
| ---------- | ---------- | :--------------------: | :---------------------------: |
| Rotation2  | Complex    |      ✅ toComplex      |        ✅ fromComplex         |
| Rotation2  | Vector2    |      ✅ toVector2      |        ✅ fromVector2         |
| Complex    | Matrix2    | ✅ toRotationMatrix2() |        ❌ **Missing**         |
| Matrix2    | Complex    |     ❌ **Missing**     |               —               |
| Transform2 | Matrix3    |      ✅ toMatrix3      | ❌ **Missing fromTransform2** |
| Matrix3    | Transform2 |  ✅ extractTransform2  |               —               |

**Recommendations:**

```typescript
// Missing: Matrix2.fromComplex()
Matrix2.fromComplex(c: Complex): Matrix2  // rotation matrix from unit complex

// Missing: Complex.fromMatrix2()
Complex.fromMatrix2(m: Matrix2): Complex  // extract rotation as complex
```

### 4. PrecisionMath Underutilized

| Module                   | Uses PrecisionMath | Could Use PrecisionMath       |
| ------------------------ | :----------------: | ----------------------------- |
| auxiliary/numeric/safety |         ✅         | —                             |
| Vector2                  |         ❌         | `dot()` for high precision    |
| Matrix2                  |         ❌         | `determinant()` for stability |
| Matrix3                  |         ❌         | `determinant()` for stability |

**Opportunity:** For L0 determinism, matrix determinants could use `compensatedDot` or `kahanSum`.

### 5. RoundingControl Underutilized

| Module                     | Uses RoundingControl | Could Use RoundingControl            |
| -------------------------- | :------------------: | ------------------------------------ |
| auxiliary/numeric/rounding |          ✅          | —                                    |
| Core classes               |          ❌          | `Vector2.round()`, `Matrix2.round()` |

**Opportunity:** Add explicit rounding mode parameter to core class round methods:

```typescript
Vector2.round(v, mode: RoundingMode = RoundingMode.NEAREST_EVEN): Vector2
```

---

## 🟢 Strong Collaboration Patterns

### 1. sinCos() Reuse

All rotation-related code correctly uses the single `sinCos()` function from `auxiliary/angle/operations.ts`:

```
Vector2.rotate() → sinCos()
Matrix2.fromRotation() → sinCos()
Matrix3.fromRotation() → sinCos()
Transform2.constructor() → sinCos()
Rotation2.fromAngle() → sinCos()
```

### 2. Validation Delegation

All core classes use `auxiliary/numeric/safety` for safe operations:

- `safeDivide()` for division by zero
- `safeSqrt()` for negative square root
- `safeAcos()` for domain clamping

### 3. Constant Centralization

All tolerance comparisons use centralized constants:

- `EPSILON` from `auxiliary/scalar/constants`
- `TAU`, `PI`, `HALF_PI` from `auxiliary/scalar/constants`
- `DEG_TO_RAD`, `RAD_TO_DEG` from `auxiliary/scalar/constants`

---

## Recommendations Priority Matrix

| Priority  | Synergy Gap                              | Effort | Impact                     |
| --------- | ---------------------------------------- | ------ | -------------------------- |
| 🔴 High   | Add DeterministicMath import to Interval | Low    | High (consistency)         |
| 🔴 High   | Add Matrix2.fromComplex() factory        | Low    | Medium (symmetry)          |
| 🟡 Medium | Add Matrix3.fromTransform2() factory     | Low    | Medium (symmetry)          |
| 🟡 Medium | Consider Vector2.random() wrapper        | Low    | Medium (discoverability)   |
| 🟢 Low    | Add Interval ↔ Vector2 utilities         | Medium | Low (niche use)            |
| 🟢 Low    | Use PrecisionMath in determinant()       | Medium | Low (precision edge cases) |

---

## Summary Statistics

| Metric                                  | Value                          |
| --------------------------------------- | ------------------------------ |
| Core → Auxiliary imports                | 38 imports across 7 classes    |
| Core → DeterministicMath imports        | 6/7 classes (Interval missing) |
| Inter-module conversions                | 8 conversion methods           |
| Bidirectional conversion pairs          | 2 complete, 2 partial          |
| Auxiliary → Deterministic collaboration | 3 wrapper functions            |
| Utils → Core integration                | 2 files (random, parse)        |

**Overall Collaboration Score: 82%** (strong with specific gaps)

---

_Module synergy analysis completed: December 25, 2025_
