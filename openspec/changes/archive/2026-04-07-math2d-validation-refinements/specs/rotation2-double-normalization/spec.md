## ADDED Requirements

### Requirement: `Rotation2.fromVector2` and `fromVectors2` SHALL avoid double normalization

`Rotation2.fromVector2` and `Rotation2.fromVectors2` compute a unit-direction `(x * inv, y * inv)` manually and then pass it to `set()`, which normalizes the result a second time. The redundant magnitude computation (a `Math.sqrt` or `hypot` call) SHALL be eliminated.

**Root cause**: After the audit added `setDirect()` to `Rotation2` for internal pre-validated results, `fromVector2` and `fromVectors2` were not updated to use it — they still call `set()`.

**Fix**: Replace `this.ensureOut(out).set(x * inv, y * inv)` with `this.ensureOut(out).setDirect(x * inv, y * inv)` in both methods. The `setDirect` call MUST be inside the validated code path (after the length check passes), never before.

**Evidence**: All other `Rotation2` factory methods that pre-compute normalized values use `setDirect`. Example: `fromAngle` routes through `setDirect` after computing `cos(angle)` and `sin(angle)`, which are already on the unit circle by construction.

#### Scenario: fromVector2 produces correct unit rotation (no regression)

- **WHEN** `Rotation2.fromVector2({ x: 3, y: 4 })` is called
- **THEN** the result SHALL have `cos ≈ 0.6` and `sin ≈ 0.8` (unit direction of (3,4))
- **AND** the result SHALL have magnitude 1 (within EPSILON)

#### Scenario: fromVector2 Safe returns identity for zero vector (no regression)

- **WHEN** `Rotation2.fromVector2Safe({ x: 0, y: 0 })` is called
- **THEN** the result SHALL be `Rotation2.IDENTITY`

#### Scenario: fromVectors2 produces correct relative rotation (no regression)

- **WHEN** `Rotation2.fromVectors2({ x: 1, y: 0 }, { x: 0, y: 1 })` is called
- **THEN** the result SHALL represent a 90-degree CCW rotation

#### Scenario: fromVector2 result is mathematically identical before and after fix

- **WHEN** the same vector is passed to `fromVector2` before and after the fix
- **THEN** both results SHALL be bitwise-identical (the fix is a pure performance change, not a behavioral change)
