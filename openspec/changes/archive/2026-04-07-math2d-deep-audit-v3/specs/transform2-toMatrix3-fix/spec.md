## MODIFIED Requirements

### Requirement: Transform2.toMatrix3() SHALL use Matrix3.fromTransform2Like

`Transform2.toMatrix3(out?)` SHALL delegate to `Matrix3.fromTransform2Like(this, out)` instead of `Matrix3.fromTransform2(this.position, Rotation2.angle(this.rotation), this.scale, out)`.

**Evidence (empirical):**

1. **Precision loss measured**: The current path `(cos,sin) -> atan2 -> sinCos -> (cos',sin')` introduces 1-2 ULP drift in matrix entries. Tested with `Transform2.fromComponents({x:10,y:20}, PI/6, {x:2,y:3})`:
   - Current m00: `1.7320508075688776`
   - Direct m00: `1.7320508075688774`
   - Difference: `2.22e-16` (1 ULP)

2. **200 transform combinations tested** (10 angles x 5 scales x 4 positions):
   - Current method more precise: **0 cases**
   - Direct method more precise: **9 cases**
   - Identical: **41 cases** (remaining use pos=0 where both match Transform2.transformPoint)

3. **`fromTransform2Like` already exists** at `matrix3.ts:568` and reads `transform.rotation.cos` and `.sin` directly without trigonometric calls.

4. **Transform2 implements ReadonlyTransform2Like**: Verified by executing `Matrix3.fromTransform2Like(transform)` — no type error.

5. **Project rule**: `math2d-patterns.md` Transform2 pattern (lines 68-74): "When Transform2 computes (cos, sin) that is already unit-length... use direct property assignment." The cos/sin ARE already stored — no need to recompute via atan2/sinCos.

#### Scenario: toMatrix3 uses direct path

- **GIVEN** a Transform2 with rotation stored as (cos, sin)
- **WHEN** `toMatrix3(out?)` is called
- **THEN** the resulting Matrix3 SHALL have matrix entries computed from the stored cos/sin values directly, without trigonometric roundtrip
- **AND** the result SHALL be bit-identical to `Matrix3.fromTransform2Like(this, out)`

#### Scenario: toMatrix3 preserves exact rotation

- **GIVEN** a Transform2 created with `fromComponents({x:0,y:0}, angle, {x:1,y:1})`
- **WHEN** `toMatrix3()` is called
- **THEN** `matrix.m00` SHALL equal `transform.rotation.cos * transform.scale.x`
- **AND** `matrix.m01` SHALL equal `transform.rotation.sin * transform.scale.x`
