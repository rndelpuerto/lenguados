# Math2D API Consistency & Clean Code Plan

## Current Issues

### 1. Inconsistent Tolerance Parameters
- Some methods use `EPSILON` (1e-6) as default
- Others use `LINEAR_EPSILON` (~9.5e-7) as default
- No clear guideline on when to use which

### 2. Inconsistent Method Names
- `fuzzyEquals` (Vector2) vs `nearEquals` (Mat2, Mat3, Rot2, Transform2)
- `fuzzyZero` (Vector2) vs `nearZero` (not consistent across modules)

### 3. Missing API Symmetry
- Vector2 has: `normalize()`, `normalizeSafe()`
- Rot2 has: `normalize()`, `normalizeSafe()`, `normalizeIfNeeded()`, `ensureNormalized()`
- Transform2 has: `normalize()`, `normalizeIfNeeded()`
- Mat2/Mat3: No normalization methods

### 4. DRY Violations
- Tolerance checking logic duplicated across modules
- Normalization patterns repeated but not extracted
- Error messages inconsistent

### 5. SOLID Violations
- Large classes with 100+ methods (Vector2 has 200+)
- Mixed responsibilities in some modules
- No clear interfaces for common operations

## Proposed Solutions

### 1. Standardize Tolerance Usage

#### Guidelines:
- Use `LINEAR_EPSILON` for **linear measurements** (positions, distances)
- Use `ANGULAR_EPSILON` for **angular measurements** (rotations, angles)
- Use `UNIT_EPSILON` for **unit length checks** (normalization)
- Document tolerance parameter in every method

#### Implementation:
```typescript
// Common tolerance utilities
export interface ToleranceOptions {
  linear?: number;
  angular?: number;
  unit?: number;
}

export const DEFAULT_TOLERANCES = {
  linear: LINEAR_EPSILON,
  angular: ANGULAR_EPSILON,
  unit: UNIT_EPSILON,
} as const;
```

### 2. Standardize Method Names

#### Naming Convention:
- `equals(other)` - Exact equality
- `nearEquals(other, tolerance?)` - Approximate equality
- `isZero()` - Exact zero check
- `nearZero(tolerance?)` - Approximate zero check
- `normalize()` - Normalize (throws on zero)
- `normalizeSafe(tolerance?)` - Normalize (returns zero on degenerate)
- `normalizeIfNeeded(tolerance?)` - Normalize only if needed
- `ensureNormalized(tolerance?)` - Return normalized copy

#### Deprecation Strategy:
```typescript
/**
 * @deprecated Use nearEquals() instead
 */
public fuzzyEquals(v: ReadonlyVector2, tolerance = LINEAR_EPSILON): boolean {
  return this.nearEquals(v, tolerance);
}
```

### 3. Extract Common Interfaces

```typescript
// Common mathematical object operations
export interface MathObject {
  clone(): this;
  copy(other: this): this;
  equals(other: this): boolean;
  nearEquals(other: this, tolerance?: number): boolean;
  isFinite(): boolean;
  toString(precision?: number): string;
}

// Normalizable objects
export interface Normalizable {
  normalize(): this;
  normalizeSafe(tolerance?: number): this;
  normalizeIfNeeded(tolerance?: number): this;
  isNormalized(tolerance?: number): boolean;
}

// Objects that can be zero
export interface ZeroCheckable {
  isZero(): boolean;
  nearZero(tolerance?: number): boolean;
}
```

### 4. Apply DRY Principle

#### Extract Common Utilities:
```typescript
// src/core-utils/tolerance.ts
export function isNearZero(value: number, tolerance: number = LINEAR_EPSILON): boolean {
  return Math.abs(value) < tolerance;
}

export function areNearEqual(a: number, b: number, tolerance: number = LINEAR_EPSILON): boolean {
  return Math.abs(a - b) < tolerance;
}

export function checkNonNegativeTolerance(tolerance: number, methodName: string): void {
  if (tolerance < 0) {
    throw new RangeError(`${methodName}: tolerance must be non-negative`);
  }
}
```

#### Reuse in all modules:
```typescript
// Before (duplicated)
public nearEquals(other: ReadonlyVector2, epsilon: number = EPSILON): boolean {
  if (epsilon < 0) throw new RangeError('Vector2.nearEquals: epsilon must be non-negative');
  return Math.abs(this.x - other.x) <= epsilon && Math.abs(this.y - other.y) <= epsilon;
}

// After (DRY)
public nearEquals(other: ReadonlyVector2, tolerance: number = LINEAR_EPSILON): boolean {
  checkNonNegativeTolerance(tolerance, 'Vector2.nearEquals');
  return areNearEqual(this.x, other.x, tolerance) && 
         areNearEqual(this.y, other.y, tolerance);
}
```

### 5. Apply SOLID Principles

#### Single Responsibility - Split Vector2:
```typescript
// src/vector2/core.ts - Core vector operations
export class Vector2Core implements MathObject, ZeroCheckable {
  // Basic operations: add, sub, mul, div, dot, cross
}

// src/vector2/geometry.ts - Geometric operations
export class Vector2Geometry {
  // project, reflect, angle operations
}

// src/vector2/transforms.ts - Transformation operations
export class Vector2Transforms implements Normalizable {
  // rotate, scale, normalize operations
}

// src/vector2/index.ts - Facade that combines all
export class Vector2 extends Vector2Core {
  // Compose all operations through mixins or delegation
}
```

#### Open/Closed - Use composition:
```typescript
// Allow extending without modifying core
export class Vector2 {
  private static extensions = new Map<string, Function>();
  
  static extend(name: string, fn: Function): void {
    this.extensions.set(name, fn);
  }
}
```

### 6. Performance Considerations

#### Inline Critical Functions:
```typescript
// Mark hot-path functions for inlining
/**
 * @inline
 * @hot-path
 */
export function isNearZero(value: number, tolerance: number = LINEAR_EPSILON): boolean {
  return Math.abs(value) < tolerance;
}
```

#### Add Fast Variants:
```typescript
// Precise version
public normalize(): this {
  const length = this.length();
  if (length <= MIN_SAFE_LENGTH) {
    throw new RangeError('Cannot normalize zero vector');
  }
  return this.divideScalar(length);
}

// Fast version (no safety checks)
public normalizeFast(): this {
  const invLength = 1 / this.length();
  this.x *= invLength;
  this.y *= invLength;
  return this;
}
```

## Implementation Priority

1. **Phase 1**: Standardize tolerance parameters (HIGH)
2. **Phase 2**: Unify method names with deprecation (HIGH) 
3. **Phase 3**: Extract common utilities (MEDIUM)
4. **Phase 4**: Define and implement interfaces (MEDIUM)
5. **Phase 5**: Modularize large classes (LOW - requires major refactor)

## Migration Guide

### For Library Users:
```typescript
// Old API (deprecated)
vector.fuzzyEquals(other, 0.001);
vector.fuzzyZero(0.001);

// New API
vector.nearEquals(other, 0.001);
vector.nearZero(0.001);
```

### For Library Developers:
1. Update imports to use core utilities
2. Replace tolerance checks with shared functions
3. Ensure all new methods follow naming conventions
4. Add deprecation warnings to old methods
5. Update tests to use new APIs

## Success Metrics

- [ ] All modules use consistent tolerance defaults
- [ ] All modules have symmetric APIs for common operations
- [ ] Zero code duplication for tolerance checks
- [ ] All modules implement relevant interfaces
- [ ] Performance maintained or improved
- [ ] Zero breaking changes (only deprecations)
