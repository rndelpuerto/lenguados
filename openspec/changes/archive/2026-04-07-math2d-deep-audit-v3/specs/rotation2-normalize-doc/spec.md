## MODIFIED Requirements

### Requirement: Rotation2.normalize() triality deviation SHALL be documented

The `Rotation2.normalize()` TSDoc SHALL explicitly document that it does NOT throw for zero-magnitude input, making it an intentional exception to the triality pattern.

**Evidence (empirical):**

1. **Behavior confirmed**:

   ```
   Rotation2(0,0).normalize()     → (cos=1, sin=0) — does NOT throw
   Rotation2(0,0).normalizeSafe() → (cos=1, sin=0) — identical behavior
   Complex(0,0).normalize()       → THROWS RangeError
   ```

2. **17 input combinations tested**: `normalize()` and `normalizeSafe()` produce **identical results in ALL cases**, including NaN, Infinity, near-epsilon, and exact zero.

3. **Rules that define the expected behavior**:
   - `math2d-patterns.md` line 14: "op() -- strict, throws on error (default)"
   - README line 118: "normalize() throws on zero-length vectors"
   - ARCHITECTURE.md line 90: "op(): Strict, throws on error"

4. **Prior audit decision**: The comprehensive audit (design.md open question #2) explicitly chose NOT to fix this: "Should Rotation2.normalize/normalizeSafe behavioral identity be resolved? Not changing now but documented for future."

5. **Rationale for NOT fixing (preserving prior decision)**:
   - For rotations, identity (cos=1, sin=0) is ALWAYS a mathematically valid rotation
   - Unlike Vector2 (where zero has no meaningful direction), a "zero rotation" has a natural identity
   - Throwing would force error handling where the only sensible recovery is using identity
   - Complex.normalize() DOES throw because Complex is a general algebraic type

**No code change.** Documentation only.

#### Scenario: normalize TSDoc includes deviation note

- **GIVEN** the source file `rotation2.ts`
- **WHEN** a developer reads the TSDoc for instance `normalize()`
- **THEN** the `@remarks` section SHALL state that this method does not throw for zero-magnitude input
- **AND** SHALL note this is an intentional exception to the triality pattern
- **AND** SHALL include `@see normalizeSafe` noting functionally identical behavior for zero-magnitude

#### Scenario: static normalize TSDoc includes deviation note

- **GIVEN** the source file `rotation2.ts`
- **WHEN** a developer reads the TSDoc for static `Rotation2.normalize()`
- **THEN** the same deviation note SHALL be present
