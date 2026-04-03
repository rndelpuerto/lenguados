## REMOVED Requirements

### Requirement: scale() as scalar multiplication method

**Reason**: Renamed to `multiplyScalar` across all 5 core types. `scale` was ambiguous with geometric scaling (`fromScale`, `scaleBy`). Research confirmed `multiplyScalar` is the ecosystem standard (glMatrix, Three.js).
**Migration**: Replace `Type.scale(x, s)` with `Type.multiplyScalar(x, s)`. Replace `x.scale(s)` with `x.multiplyScalar(s)`. Applies to Vector2, Complex, Interval, Matrix2, Matrix3.

### Requirement: Complex.argument() method

**Reason**: Replaced by `Complex.angle` (getter) and `Complex.angle(z)` (static). Consistent with `Vector2.angle` and `Rotation2.angle`.
**Migration**: Replace `z.argument()` with `z.angle`. Replace `Complex.argument(z)` with `Complex.angle(z)`.

### Requirement: Interval.divide/divideSafe/divideUnchecked (scalar overload)

**Reason**: Renamed to `divideScalar/divideScalarSafe/divideScalarUnchecked` to follow the `verbScalar(number)` convention used by all other types.
**Migration**: Replace `Interval.divide(i, s)` with `Interval.divideScalar(i, s)`. Same for Safe/Unchecked variants and instance methods.

## MODIFIED Requirements

### Requirement: Complex.pow zero base with negative exponent

`Complex.pow(z, n)` where `z` has zero magnitude and `n < 0` SHALL throw a `RangeError` in the strict variant instead of producing `Complex(Infinity, NaN)`. The safe variant `Complex.powSafe` SHALL return `Complex(0, 0)` as the fallback. The unchecked variant has no obligation.

Note: After `argument()` removal, internal usage within `pow` uses the `angle` getter directly.

#### Scenario: Strict pow of zero to negative exponent throws

- **GIVEN** `z = Complex(0, 0)` and `exponent = -1`
- **WHEN** `Complex.pow(z, exponent)` is called
- **THEN** the function SHALL throw `RangeError` with a message indicating that zero cannot be raised to a negative exponent

#### Scenario: Strict pow of zero to negative fractional exponent throws

- **GIVEN** `z = Complex(0, 0)` and `exponent = -0.5`
- **WHEN** `Complex.pow(z, exponent)` is called
- **THEN** the function SHALL throw `RangeError`

#### Scenario: Safe pow of zero to negative exponent returns fallback

- **GIVEN** `z = Complex(0, 0)` and `exponent = -2`
- **WHEN** `Complex.powSafe(z, exponent)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (safe fallback, not `Complex(Infinity, NaN)`)

#### Scenario: Pow of zero to positive exponent is unchanged

- **GIVEN** `z = Complex(0, 0)` and `exponent = 2`
- **WHEN** `Complex.pow(z, exponent)` is called
- **THEN** the result SHALL be `Complex(0, 0)` (existing behavior preserved)
