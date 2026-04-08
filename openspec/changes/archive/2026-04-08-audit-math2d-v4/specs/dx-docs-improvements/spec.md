## MODIFIED Requirements

### Requirement: Instance transformDirectionCS SHALL document parameter order difference

The **instance** `transformDirectionCS` method on Transform2 SHALL include a `@remarks` section documenting that its parameter order differs from sibling instance methods `transformPointCS` and `transformVectorCS`.

Note: The **static** `transformDirectionCS` already documents this at lines 868-871: "Unlike transformPointCS/transformVectorCS, this method omits the transform parameter because direction transforms only use rotation (cos/sin), not position or scale." However, the instance method at line 1701-1719 lacks this explanation.

**Evidence:**

Instance method parameter orders (verified at lines 1653, 1684, 1712):

- `transformPointCS(point, cos, sin, out)` — data first, then cos/sin
- `transformVectorCS(vector, cos, sin, out)` — data first, then cos/sin
- `transformDirectionCS(cos, sin, direction, out)` — cos/sin first, then data

TypeScript catches misuse (Vector2Like vs number types), but the inconsistency can trap JavaScript users or developers learning the API from instance methods.

#### Scenario: Instance TSDoc documentation

- **GIVEN** the instance `transformDirectionCS` method on Transform2 (line 1701)
- **WHEN** a developer reads the TSDoc
- **THEN** they SHALL see a `@remarks` section explicitly stating:
  - "Note: Unlike the instance transformPointCS and transformVectorCS which take (data, cos, sin), this method takes (cos, sin, data) because direction transforms only use rotation, not position or scale."
  - `@see` links to both sibling CS instance methods

### Requirement: Complex.addScalar SHALL cross-reference Vector2.addScalar behavioral difference

The `Complex.addScalar` method already documents "Only the real component is affected" (line 656). It SHALL additionally include a `@remarks` section cross-referencing the behavioral difference from `Vector2.addScalar`, since the same method name has different semantics across types.

**Evidence:**

- `Vector2.addScalar(v, s)` adds `s` to BOTH components: `(x+s, y+s)`
- `Complex.addScalar(z, s)` adds `s` to real ONLY: `(real+s, imag)` — already documented in summary line
- Both are mathematically correct but same method name, different behavior
- The existing TSDoc does NOT cross-reference Vector2's different behavior

#### Scenario: TSDoc documentation

- **GIVEN** the `Complex.addScalar` method
- **WHEN** a developer reads the TSDoc
- **THEN** they SHALL see a `@remarks` section stating:
  - "Unlike {@link Vector2.addScalar} which adds the scalar to both components, this follows complex arithmetic convention where adding a real scalar affects only the real part."
  - This supplements the existing summary line "Only the real component is affected."
