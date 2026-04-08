## MODIFIED Requirements

### Requirement: Rotation2.fromComplex and fromComplexSafe SHALL accept ReadonlyComplexLike

The parameter type for `Rotation2.fromComplex()` and `Rotation2.fromComplexSafe()` SHALL be `ReadonlyComplexLike` (the structural interface) instead of `ReadonlyComplex` (the concrete type alias).

**Evidence:**

1. **Pattern violation**: Every other factory method in the library accepts `*Like` interfaces:
   - `Rotation2.fromVector2(v: ReadonlyVector2Like, ...)`
   - `Rotation2.fromMatrix2(m: ReadonlyMatrix2Like, ...)`
   - `Complex.add(a: ReadonlyComplexLike, b: ReadonlyComplexLike, ...)`
   - `Complex.divide(a: ReadonlyComplexLike, b: ReadonlyComplexLike, ...)`
2. **Documented rule**: `math2d-patterns.md` line 3: "Input parameters use `Readonly*Like` interfaces"

3. **Zero runtime impact**: The function body only accesses `.real` and `.imag` (line 473-474), which are defined on `ReadonlyComplexLike`.

4. **DX impact**: `Rotation2.fromComplex({ real: 3, imag: 4 })` currently fails TypeScript compilation. After fix, it works.

5. **Import change required**: `ReadonlyComplexLike` must be added to the existing type import from `'../types'` (line 70-75). The `type ReadonlyComplex` import from `'./complex'` (line 78) can be removed. The `Complex` class import remains (used elsewhere in the file).

#### Scenario: plain object input

- **GIVEN** a plain object `{ real: 0.6, imag: 0.8 }`
- **WHEN** `Rotation2.fromComplex({ real: 0.6, imag: 0.8 })` is called
- **THEN** it SHALL compile without type errors
- **AND** it SHALL normalize and return a valid Rotation2

#### Scenario: Complex instance input (backward compatible)

- **GIVEN** a `Complex` instance `new Complex(0.6, 0.8)`
- **WHEN** `Rotation2.fromComplex(complex)` is called
- **THEN** the behavior SHALL be identical to the current implementation
