# Enumeration: ValidationMode

Validation mode for numerical operations.

## Remarks

Controls how the library handles invalid inputs and numerical edge cases.

- STRICT: Throws exceptions on any invalid input
- SAFE: Returns safe fallback values instead of throwing
- WARN: Logs warnings but continues execution
- NONE: No validation (maximum performance)

## Enumeration Members

### NONE

> **NONE**: `"none"`

No validation mode.
Skips all validation checks for maximum performance.

---

### SAFE

> **SAFE**: `"safe"`

Safe validation mode.
Returns safe fallback values for invalid inputs.

---

### STRICT

> **STRICT**: `"strict"`

Strict validation mode.
Throws exceptions on invalid inputs.

---

### WARN

> **WARN**: `"warn"`

Warning validation mode.
Logs warnings but continues execution.
