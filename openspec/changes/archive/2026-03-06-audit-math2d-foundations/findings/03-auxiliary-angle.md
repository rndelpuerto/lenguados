# Phase 1 - Audit: auxiliary/angle/ (Tasks 3.1-3.13)

## 3.1 conversion.ts

**File:** `src/auxiliary/angle/conversion.ts` (86 lines)

### Functions (4)

| Function              | Formula           | Constants Used                   |
| --------------------- | ----------------- | -------------------------------- |
| degreesToRadians(deg) | deg \* DEG_TO_RAD | DEG_TO_RAD from scalar/constants |
| radiansToDegrees(rad) | rad \* RAD_TO_DEG | RAD_TO_DEG from scalar/constants |
| turnsToRadians(turns) | turns \* TAU      | TAU from scalar/constants        |
| radiansToTurns(rad)   | rad / TAU         | TAU from scalar/constants        |

**Precision analysis:**

- DEG_TO_RAD = Math.PI / 180 — single division, computed once. Full double precision.
- RAD_TO_DEG = 180 / Math.PI — same.
- turnsToRadians uses multiplication by TAU (exact if input is exact).
- radiansToTurns uses DIVISION by TAU, not multiplication by RAD_TO_TURN. This is a minor inconsistency — using `rad * RAD_TO_TURN` would be faster (multiplication vs division) and match the pattern of the other functions.

**Verdict: ✅** Correct. Minor: radiansToTurns could use `rad * RAD_TO_TURN` instead of `rad / TAU` for consistency and performance.

---

## 3.2 normalization.ts

**File:** `src/auxiliary/angle/normalization.ts` (95 lines)

### Functions (4)

| Function                      | Range       | Delegates To         |
| ----------------------------- | ----------- | -------------------- |
| normalizeRadians(rad)         | [-PI, PI)   | loop(rad, -PI, PI)   |
| normalizeRadiansPositive(rad) | [0, TAU)    | loop(rad, 0, TAU)    |
| normalizeDegrees(deg)         | [-180, 180) | loop(deg, -180, 180) |
| normalizeDegreesPositive(deg) | [0, 360)    | loop(deg, 0, 360)    |

**Excellent composition:** All 4 functions delegate to `loop` from scalar/arithmetic. No code duplication. The `loop` function handles the wrapping math correctly.

**Range convention:** [-PI, PI) is half-open (excludes PI itself). This matches:

- atan2 output range [-PI, PI] — **almost** matches, but atan2 CAN return PI
- Godot: uses (-PI, PI] — different!
- three.js MathUtils.euclideanModulo: always positive
- Box2D: no explicit normalization

**Potential edge case:** `normalizeRadians(PI)` returns `-PI` (since loop wraps PI to the start of the range). This is mathematically correct for [-PI, PI) but may surprise users expecting PI. The docstring documents this.

---

## 3.3 Normalization vs External References

### Industry Convention

| Library      | Signed Range     | Unsigned Range |
| ------------ | ---------------- | -------------- |
| lenguados    | [-PI, PI)        | [0, TAU)       |
| Godot        | (-PI, PI]        | [0, TAU)       |
| Unity        | (-180, 180]      | [0, 360)       |
| GLSL         | No standard      | mod-based      |
| atan2 (IEEE) | [-PI, PI]        | N/A            |
| Box2D        | No normalization | N/A            |

**Key difference:** lenguados uses [-PI, PI) while Godot/Unity use (-PI, PI]. The practical difference is where PI itself lands:

- lenguados: normalizeRadians(PI) = -PI
- Godot: wrapf(PI, -PI, PI) = PI

For most purposes this doesn't matter, but for consumers that check `angle === PI`, the convention matters. The half-open [-PI, PI) is the more common mathematical convention.

---

## 3.4 operations.ts

**File:** `src/auxiliary/angle/operations.ts` (306 lines)

### Functions and Types

| Entity                                  | Type     | Dependencies                                             |
| --------------------------------------- | -------- | -------------------------------------------------------- |
| SinCos (interface)                      | Type     | -                                                        |
| sinCos(angle, out?)                     | Function | deterministic: sin, cos                                  |
| sinCosNormalized(angle, out?)           | Function | normalization: normalizeRadians; deterministic: sin, cos |
| angleDifference(from, to)               | Function | normalization: normalizeRadians                          |
| angleDistance(a, b)                     | Function | angleDifference (this module)                            |
| anglesNearEqual(a, b, eps)              | Function | angleDistance (this module)                              |
| angleBisector(a, b)                     | Function | angleDifference, normalizeRadians                        |
| isAngleBetween(angle, start, end, incl) | Function | normalizeRadiansPositive                                 |
| clampAngle(angle, min, max)             | Function | normalizeRadians, isAngleBetween, angleDistance          |
| angleFromVectors(x1, y1, x2, y2)        | Function | deterministic: atan2; angleDifference                    |

### Critical Finding: sinCos Inefficiency

The `sinCos` function (line 60) calls `sin(angle)` and `cos(angle)` separately. Each of these performs its own `reduceAngle` internally. The deterministic `sinCos` (in deterministic-kernels.ts) does reduction once and computes both.

**But:** The auxiliary `sinCos` does NOT delegate to the deterministic `sinCos`. It calls the individual functions. This means:

1. Double range reduction (wasted computation)
2. The `out` parameter on auxiliary sinCos is the only way to avoid allocation

**Recommendation:** auxiliary sinCos should import and delegate to deterministic sinCos, then handle the `out` parameter wrapper.

### angleDifference Design

`angleDifference(from, to) = normalizeRadians(to - from)` — Simple, correct shortest-arc delta. This is the foundational angular operation used by:

- angleDistance
- anglesNearEqual
- angleBisector
- angleFromVectors
- lerpAngle (in interpolation.ts)
- unwrapAngles (in unwrapping.ts)
- AngleUnwrapper.next

Making angleDifference the single most important building block in the angle module.

---

## 3.5 Internal Composition of angle/

### Delegation Map

```
sinCos ← sin, cos (from deterministic/)
sinCosNormalized ← normalizeRadians (from normalization) + sin, cos

angleDifference ← normalizeRadians (from normalization)
angleDistance ← angleDifference (internal)
anglesNearEqual ← angleDistance (internal)
angleBisector ← angleDifference + normalizeRadians
isAngleBetween ← normalizeRadiansPositive (from normalization)
clampAngle ← normalizeRadians + isAngleBetween + angleDistance
angleFromVectors ← atan2 (from deterministic/) + angleDifference

lerpAngle ← angleDifference + normalizeRadians
smoothStepAngle ← smoothStep (from scalar/) + saturate (from scalar/) + lerpAngle
```

### Delegation Cost Analysis

| Delegation                                                                  | Depth | Cost                             |
| --------------------------------------------------------------------------- | ----- | -------------------------------- |
| anglesNearEqual → angleDistance → angleDifference → normalizeRadians → loop | 4     | Low (all inline-friendly)        |
| clampAngle → isAngleBetween + angleDistance                                 | 2     | Medium (multiple normalizations) |
| smoothStepAngle → smoothStep + lerpAngle → angleDifference → ...            | 4     | Low (not hot-path)               |

No significant overhead concerns. All functions are small and V8-inlineable.

---

## 3.6 Dependencies: angle/ -> scalar/ and angle/ -> deterministic/

### angle/ imports from scalar/

| angle/ file      | scalar/ imports                                         |
| ---------------- | ------------------------------------------------------- |
| conversion.ts    | TAU, DEG_TO_RAD, RAD_TO_DEG from constants              |
| normalization.ts | loop from arithmetic; PI, TAU from constants            |
| operations.ts    | EPSILON from constants                                  |
| interpolation.ts | saturate from arithmetic; smoothStep from interpolation |

### angle/ imports from deterministic/

| angle/ file   | deterministic/ imports |
| ------------- | ---------------------- |
| operations.ts | atan2, cos, sin        |

### Assessment

- **scalar/ dependencies are logical:** Constants and arithmetic primitives are exactly what angle/ should use.
- **deterministic/ dependencies are logical:** sin, cos, atan2 are needed for angle operations.
- **Missed composition:** sinCos in operations.ts calls sin/cos separately instead of deterministic sinCos.
- **No dependencies on numeric/:** Correct. angle/ doesn't need guards/rounding/safety.

---

## 3.7 Angle Operations vs External References

### Comparison

| Operation          | lenguados        | Godot                       | Unity            | three.js |
| ------------------ | ---------------- | --------------------------- | ---------------- | -------- |
| Signed delta       | angleDifference  | angle_difference (built-in) | Mathf.DeltaAngle | -        |
| Unsigned distance  | angleDistance    | -                           | -                | -        |
| Near-equal         | anglesNearEqual  | is_equal_approx             | -                | -        |
| Bisector           | angleBisector    | -                           | -                | -        |
| Is between         | isAngleBetween   | -                           | -                | -        |
| Clamp angle        | clampAngle       | clamp (for angles)          | -                | -        |
| Angle from vectors | angleFromVectors | -                           | -                | -        |
| sinCos             | sinCos           | -                           | -                | -        |

lenguados has MORE angle operations than most libraries. Godot is the closest match.

**Notable:** Unity's `Mathf.DeltaAngle` works in degrees. lenguados works in radians (consistent with the library's convention).

---

## 3.8 interpolation.ts

**File:** `src/auxiliary/angle/interpolation.ts` (59 lines)

### Functions (2)

| Function                     | Delegates To                                        |
| ---------------------------- | --------------------------------------------------- |
| lerpAngle(from, to, t)       | angleDifference + normalizeRadians                  |
| smoothStepAngle(from, to, t) | smoothStep (scalar) + saturate (scalar) + lerpAngle |

### Analysis

**lerpAngle:** `normalizeRadians(diff * t) + from` — Shortest-path angular lerp. Works for any real t (extrapolation supported).

**Anti-podal handling:** When from and to are exactly PI apart, angleDifference returns either PI or -PI. The lerp takes the shortest path. There's no special anti-podal handling needed for 2D (unlike quaternion slerp in 3D).

**smoothStepAngle delegates correctly:** Uses scalar smoothStep for the easing curve, then lerpAngle for the angular interpolation. Good composition.

---

## 3.9 Angular Interpolation vs External References

### Shoemake SLERP (2D context)

Shoemake's SLERP for quaternions reduces to simple angle lerp in 2D. The formula is:
`result = from + t * shortestDelta(from, to)`

This is exactly what lerpAngle does via `normalizeRadians(diff * t) + from`.

### Godot lerp_angle

`lerp_angle(from, to, weight)` — Same shortest-path approach. Godot normalizes the difference to [-PI, PI] and lerps. Matches lenguados.

### three.js

three.js doesn't have a dedicated lerp_angle. Users implement it manually.

**Verdict: ✅** lerpAngle correctly implements shortest-path angular lerp matching Godot and Shoemake.

---

## 3.10 unwrapping.ts

**File:** `src/auxiliary/angle/unwrapping.ts` (203 lines)

### Entities (3)

| Entity                            | Type     | Purpose               |
| --------------------------------- | -------- | --------------------- |
| unwrapAngles(angles, ref?)        | Function | Batch unwrap array    |
| unwrapAnglesInPlace(angles, ref?) | Function | In-place batch unwrap |
| AngleUnwrapper                    | Class    | Streaming unwrapper   |

### Analysis

- **unwrapAngles:** Creates new array. Uses angleDifference for shortest-arc steps. Optional reference for first element continuity.
- **unwrapAnglesInPlace:** Same logic, modifies array in-place. More memory efficient.
- **AngleUnwrapper:** Stateful streaming version. `next(theta)` accumulates shortest-arc deltas. Has `reset()` and `value` getter.

**Dependencies:** normalizeRadians, angleDifference (from operations.ts). Clean composition.

**Array holes check:** Both batch functions throw TypeError for undefined elements. This is TypeScript-strict-mode defensive coding.

**Verdict: ✅** Well-designed for both batch and streaming use cases. The streaming AngleUnwrapper is unique — most libraries only provide batch.

---

## 3.11 index.ts

Clean barrel export of all 5 files:

```typescript
export * from './conversion';
export * from './normalization';
export * from './operations';
export * from './interpolation';
export * from './unwrapping';
```

**SinCos interface location:** Defined in operations.ts, exported via index.ts. This is the canonical location. The deterministic module re-exports it via `export type { SinCos } from '../auxiliary/angle/operations'`.

**Verdict: ✅** Clean. SinCos location is appropriate.

---

## 3.12 Core Type Consumers of angle/

| Core Type  | angle/ Functions Used                                                  |
| ---------- | ---------------------------------------------------------------------- |
| Vector2    | (indirect via sinCos pattern, but uses deterministic sin/cos directly) |
| Rotation2  | (uses atan2 from deterministic, angle normalization)                   |
| Complex    | (uses atan2 from deterministic)                                        |
| Matrix2    | (uses atan2 from deterministic for angle extraction)                   |
| Matrix3    | (uses atan2 from deterministic for decomposition)                      |
| Transform2 | (uses atan2 from deterministic)                                        |

**Observation:** Core types import from deterministic/ directly for sin/cos/atan2, NOT from angle/operations. They don't use the angle module's sinCos function. This means the angle module is primarily a USER-FACING utility layer, not a core building block.

**Building blocks from angle/ used by core:** NONE directly. The core types bypass angle/ and go to deterministic/ directly.

**Building blocks from angle/ used by other auxiliary/:** Normalization functions are used ONLY within angle/ itself.

**Assessment:** The angle module is a self-contained utility layer for end-user angle manipulation. It's not a building block for core types. This is architecturally clean.

---

## 3.13 Diagnostic by Entity

| Entity                   | Verdict     | Justification                                                                 |
| ------------------------ | ----------- | ----------------------------------------------------------------------------- |
| degreesToRadians         | ✅ Keep     | Simple, correct                                                               |
| radiansToDegrees         | ✅ Keep     | Simple, correct                                                               |
| turnsToRadians           | ✅ Keep     | Simple, correct                                                               |
| radiansToTurns           | ⚠️ Redefine | Uses division by TAU instead of multiplication by RAD_TO_TURN                 |
| normalizeRadians         | ✅ Keep     | Building block. Clean delegation to loop                                      |
| normalizeRadiansPositive | ✅ Keep     | Clean delegation                                                              |
| normalizeDegrees         | ✅ Keep     | Clean delegation                                                              |
| normalizeDegreesPositive | ✅ Keep     | Clean delegation                                                              |
| SinCos (interface)       | ✅ Keep     | Well-placed                                                                   |
| sinCos                   | ⚠️ Redefine | Should delegate to deterministic sinCos to avoid double range reduction       |
| sinCosNormalized         | ⚠️ Redefine | If sinCos is fixed, this may be redundant (sinCos already handles all angles) |
| angleDifference          | ✅ Keep     | Critical building block. Used by 6+ consumers                                 |
| angleDistance            | ✅ Keep     | Clean abs wrapper                                                             |
| anglesNearEqual          | ✅ Keep     | Uses EPSILON (should it use ANGLE_EPSILON?)                                   |
| angleBisector            | ✅ Keep     | Correct midpoint on shortest arc                                              |
| isAngleBetween           | ✅ Keep     | CCW convention, handles wrap-around                                           |
| clampAngle               | ✅ Keep     | Correct nearest-boundary approach                                             |
| angleFromVectors         | ✅ Keep     | Uses deterministic atan2 correctly                                            |
| lerpAngle                | ✅ Keep     | Correct shortest-path lerp                                                    |
| smoothStepAngle          | ✅ Keep     | Good composition from scalar smoothStep                                       |
| unwrapAngles             | ✅ Keep     | Batch unwrapping with reference                                               |
| unwrapAnglesInPlace      | ✅ Keep     | Memory-efficient variant                                                      |
| AngleUnwrapper           | ✅ Keep     | Unique streaming feature                                                      |

**Summary:** 20 ✅ Keep, 3 ⚠️ Redefine, 0 Remove, 0 Add
