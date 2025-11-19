# Math2D Migration and Standardization Plan

## Phase 1: Immediate Fixes (Vector2)

### 1.1 Complete Missing JSDoc Documentation

**Files to update:**
- [ ] `vector2/missing_static_methods.ts` - Add full JSDoc for all methods
- [ ] `vector2/missing_core_static_methods.ts` - Already has JSDoc ✓
- [ ] `vector2/instance/arithmetic.ts` - Add JSDoc
- [ ] `vector2/instance/transforms.ts` - Add JSDoc  
- [ ] `vector2/instance/geometry.ts` - Add JSDoc
- [ ] `vector2/instance/comparison.ts` - Add JSDoc
- [ ] `vector2/instance/constraints.ts` - Add JSDoc
- [ ] `vector2/instance/conversion.ts` - Add JSDoc
- [ ] `vector2/instance/interpolation.ts` - Add JSDoc
- [ ] `vector2/instance/mutators.ts` - Add JSDoc

**JSDoc Template from original:**
```typescript
/**
 * Brief description of what the method does.
 * 
 * @param paramName - Description of parameter.
 * @returns Description of return value.
 * 
 * @remarks
 * Additional implementation details or usage notes.
 * 
 * @example
 * ```ts
 * // Example usage
 * const result = Vector2.methodName(params);
 * ```
 * 
 * @throws {ErrorType} Description of when this error is thrown.
 */
```

### 1.2 Fix Method Naming Inconsistencies

**Deprecated methods to remove in v1.0:**
- `fuzzyEquals` → `nearEquals` ✓ (already deprecated)
- `fuzzyZero` → `nearZero` ✓ (already deprecated)

### 1.3 Standardize Tolerance Usage

**Current Issues:**
- Vector2 uses `EPSILON` (re-exported LINEAR_EPSILON)
- Mat2/Mat3 use `LINEAR_EPSILON` directly
- No clear guidelines on when to use which constant

**Solution:**
```typescript
// constants/tolerance-types.ts
export const TOLERANCE = {
  LINEAR: LINEAR_EPSILON,      // For positions, distances
  ANGULAR: ANGULAR_EPSILON,    // For angles, rotations  
  UNIT: UNIT_EPSILON,         // For normalized checks
  DETERMINANT: DETERMINANT_EPSILON // For matrix singularity
} as const;

// Usage:
import { TOLERANCE } from './constants/tolerance-types';
nearEquals(a, b, TOLERANCE.LINEAR);
```

## Phase 2: DRY Violations (1-2 weeks)

### 2.1 Extract Common Tolerance Patterns

**Create `core-utils/comparisons.ts`:**
```typescript
export function isNearZero(value: number, tolerance = TOLERANCE.LINEAR): boolean;
export function areNearEqual(a: number, b: number, tolerance = TOLERANCE.LINEAR): boolean;
export function isNearOne(value: number, tolerance = TOLERANCE.UNIT): boolean;

// Vector-specific
export function isNearZeroVector(v: ReadonlyVector2Like, tolerance = TOLERANCE.LINEAR): boolean;
export function areNearEqualVectors(a: ReadonlyVector2Like, b: ReadonlyVector2Like, tolerance = TOLERANCE.LINEAR): boolean;
```

### 2.2 Standardize Error Messages

**Create `core-utils/errors.ts`:**
```typescript
export const ErrorMessages = {
  ZERO_LENGTH_VECTOR: (method: string) => `${method}: cannot operate on zero-length vector`,
  ZERO_DIVISOR: (method: string, param: string) => `${method}: ${param} must be non-zero`,
  SINGULAR_MATRIX: (method: string) => `${method}: matrix is singular (determinant = 0)`,
  INVALID_RANGE: (method: string, param: string, value: number) => 
    `${method}: ${param} must be non-negative (got ${value})`
} as const;
```

### 2.3 Centralize Common Operations

**Move to `numeric.ts`:**
- Component-wise min/max
- Vector clamp operations
- Safe normalization patterns

## Phase 3: SOLID Improvements (2-4 weeks)

### 3.1 Define Core Interfaces

**Create `interfaces/index.ts`:**
```typescript
export interface Equalable<T> {
  equals(other: T): boolean;
  nearEquals(other: T, tolerance?: number): boolean;
}

export interface Normalizable {
  normalize(): this;
  normalizeSafe(tolerance?: number): this;
  normalizeIfNeeded(tolerance?: number): this;
  isNormalized(tolerance?: number): boolean;
}

export interface Measurable {
  length(): number;
  lengthSq(): number;
}

export interface Transformable<T> {
  transform(matrix: T): this;
  transformSafe(matrix: T): this;
}

export interface Serializable {
  toJSON(): object;
  toString(precision?: number): string;
  toArray(): number[];
}
```

### 3.2 Apply to Existing Types

```typescript
export class Vector2 extends Vector2Base 
  implements Equalable<ReadonlyVector2>, 
             Normalizable, 
             Measurable,
             Transformable<Mat2>,
             Serializable {
  // Implementation already exists, just declare interface compliance
}
```

## Phase 4: Modularize Remaining Types (4-8 weeks)

### 4.1 Mat2 Refactoring

**Proposed structure:**
```
mat2/
├── base.ts              # Mat2Base class (minimal)
├── index.ts            # Main export
├── constants.ts        # IDENTITY, ZERO matrices
├── factories.ts        # fromValues, fromRotation, etc.
├── arithmetic.ts       # add, multiply, scale
├── transforms.ts       # invert, transpose, adjoint
├── decomposition.ts    # SVD, eigenvalues
├── instance/           # Instance methods
│   ├── arithmetic.ts
│   ├── transforms.ts
│   └── comparison.ts
```

### 4.2 Mat3 Refactoring
Similar structure to Mat2

### 4.3 Transform2 Refactoring
May need special consideration due to complexity

## Phase 5: Performance & Testing (Ongoing)

### 5.1 Benchmark Suite
- Create performance tests for critical paths
- Compare before/after refactoring
- Identify optimization opportunities

### 5.2 Comprehensive Tests
- Unit tests for all methods
- Integration tests for type interactions
- Edge case coverage

## Implementation Priority

1. **Week 1**: Complete Vector2 JSDoc and fix tolerance usage
2. **Week 2**: Extract common patterns (DRY)
3. **Week 3-4**: Define and apply interfaces
4. **Month 2**: Begin Mat2 modularization
5. **Month 3**: Complete remaining types

## Success Metrics

- [ ] 100% JSDoc coverage
- [ ] No DRY violations in tolerance/error handling
- [ ] All types implement standard interfaces
- [ ] Performance within 5% of original
- [ ] Test coverage > 90%
- [ ] Zero breaking changes to public API
