# @lenguados/math2d API Reference

## Table of Contents

- [Core Types](#core-types)
  - [Vector2](#vector2)
  - [Complex](#complex)
  - [Interval](#interval)
  - [Rotation2](#rotation2)
  - [Quaternion2](#quaternion2)
  - [Matrix2](#matrix2)
  - [Matrix3](#matrix3)
  - [Transform2](#transform2)
- [Auxiliary Modules](#auxiliary-modules)
  - [Scalar Operations](#scalar-operations)
  - [Angular Operations](#angular-operations)
  - [Numeric Operations](#numeric-operations)
- [Performance Modules](#performance-modules)
  - [Batch Operations](#batch-operations)
  - [Object Pooling](#object-pooling)
  - [Validation](#validation)

## Core Types

### Vector2

2D vector with x and y components.

```typescript
class Vector2 {
 x: number;
 y: number;

 // Constructors
 constructor(x?: number, y?: number);
 static fromAngle(angle: number, radius?: number): Vector2;
 static fromArray(array: ArrayLike<number>, offset?: number): Vector2;
 static fromObject(obj: { x: number; y: number }): Vector2;

 // Constants
 static readonly ZERO: Vector2; // (0, 0)
 static readonly ONE: Vector2; // (1, 1)
 static readonly UNIT_X: Vector2; // (1, 0)
 static readonly UNIT_Y: Vector2; // (0, 1)

 // Basic Operations
 add(other: Vector2, out?: Vector2): Vector2;
 subtract(other: Vector2, out?: Vector2): Vector2;
 multiply(other: Vector2, out?: Vector2): Vector2;
 divide(other: Vector2, out?: Vector2): Vector2;
 scale(scalar: number, out?: Vector2): Vector2;
 negate(out?: Vector2): Vector2;

 // Geometric Operations
 length(): number;
 lengthSq(): number;
 distanceTo(other: Vector2): number;
 distanceSq(other: Vector2): number;
 normalize(out?: Vector2): Vector2;
 dot(other: Vector2): number;
 cross(other: Vector2): number;
 angle(): number;
 angleTo(other: Vector2): number;

 // Transformations
 rotate(angle: number, out?: Vector2): Vector2;
 rotateAround(angle: number, center: Vector2, out?: Vector2): Vector2;
 reflect(normal: Vector2, out?: Vector2): Vector2;
 project(onto: Vector2, out?: Vector2): Vector2;

 // Interpolation
 lerp(other: Vector2, t: number, out?: Vector2): Vector2;
 slerp(other: Vector2, t: number, out?: Vector2): Vector2;

 // Comparison
 equals(other: Vector2, epsilon?: number): boolean;
 isZero(epsilon?: number): boolean;
 isUnit(epsilon?: number): boolean;

 // Conversion
 toArray(): [number, number];
 toObject(): { x: number; y: number };
 toString(precision?: number): string;
 clone(): Vector2;
}
```

### Complex

Complex number with real and imaginary components.

```typescript
class Complex {
 real: number;
 imag: number;

 // Constructors
 constructor(real?: number, imag?: number);
 static fromPolar(magnitude: number, angle: number): Complex;

 // Properties
 magnitude(): number;
 magnitudeSq(): number;
 argument(): number;

 // Operations
 add(other: Complex, out?: Complex): Complex;
 subtract(other: Complex, out?: Complex): Complex;
 multiply(other: Complex, out?: Complex): Complex;
 divide(other: Complex, out?: Complex): Complex;
 conjugate(out?: Complex): Complex;
 normalize(out?: Complex): Complex;
 reciprocal(out?: Complex): Complex;
 pow(exponent: number, out?: Complex): Complex;
 sqrt(out?: Complex): Complex;

 // Comparison
 equals(other: Complex, epsilon?: number): boolean;
 isZero(epsilon?: number): boolean;
 isReal(epsilon?: number): boolean;
 isImaginary(epsilon?: number): boolean;
}
```

### Matrix3

3x3 matrix for 2D affine transformations.

```typescript
class Matrix3 {
 // Components (column-major order)
 m00: number;
 m01: number;
 m02: number;
 m10: number;
 m11: number;
 m12: number;
 m20: number;
 m21: number;
 m22: number;

 // Factory methods
 static fromTranslation(translation: Vector2): Matrix3;
 static fromRotation(angle: number): Matrix3;
 static fromScale(scale: Vector2 | number): Matrix3;
 static fromTransform(translation: Vector2, rotation: number, scale: Vector2 | number): Matrix3;
 static ortho(left: number, right: number, bottom: number, top: number): Matrix3;

 // Properties
 getTranslation(out?: Vector2): Vector2;
 getRotation(): number;
 getScale(out?: Vector2): Vector2;
 determinant(): number;
 isInvertible(epsilon?: number): boolean;
 isAffine(epsilon?: number): boolean;

 // Matrix operations
 multiply(other: Matrix3, out?: Matrix3): Matrix3;
 transpose(out?: Matrix3): Matrix3;
 inverse(out?: Matrix3): Matrix3;

 // Transformations
 translate(translation: Vector2, out?: Matrix3): Matrix3;
 rotate(angle: number, out?: Matrix3): Matrix3;
 scale(scale: Vector2 | number, out?: Matrix3): Matrix3;

 // Apply to vectors/points
 transformPoint(point: Vector2, out?: Vector2): Vector2;
 transformVector(vector: Vector2, out?: Vector2): Vector2;
}
```

### Transform2

Decomposed 2D transform with position, rotation, and scale.

```typescript
class Transform2 {
 position: Vector2;
 rotation: number;
 scale: Vector2;

 // Constructors
 constructor(position?: Vector2, rotation?: number, scale?: Vector2);
 static fromMatrix(matrix: Matrix3): Transform2;

 // Properties
 hasUniformScale(epsilon?: number): boolean;
 hasNegativeScale(): boolean;
 determinant(): number;

 // Operations
 multiply(other: Transform2, out?: Transform2): Transform2;
 inverse(out?: Transform2): Transform2;

 // Transformations
 transformPoint(point: Vector2, out?: Vector2): Vector2;
 transformVector(vector: Vector2, out?: Vector2): Vector2;
 inverseTransformPoint(point: Vector2, out?: Vector2): Vector2;

 // Conversion
 toMatrix(out?: Matrix3): Matrix3;

 // Interpolation
 lerp(other: Transform2, t: number, out?: Transform2): Transform2;
}
```

## Auxiliary Modules

### Scalar Operations

```typescript
// Constants
export const EPSILON: number;
export const PI: number;
export const TAU: number;
export const DEG_TO_RAD: number;
export const RAD_TO_DEG: number;

// Arithmetic
export function clamp(value: number, min: number, max: number): number;
export function sign(x: number): number;
export function saturate(x: number): number; // clamp to [0,1]
export function saturateSigned(x: number): number; // clamp to [-1,1]
export function remap(
 value: number,
 inMin: number,
 inMax: number,
 outMin: number,
 outMax: number,
): number;

// Comparison
export function nearEquals(a: number, b: number, epsilon?: number): boolean;
export function isNearZero(value: number, epsilon?: number): boolean;
export function lessThan(a: number, b: number, epsilon?: number): boolean;
export function greaterThan(a: number, b: number, epsilon?: number): boolean;
export function inRange(value: number, min: number, max: number, epsilon?: number): boolean;

// Interpolation
export function lerp(a: number, b: number, t: number): number;
export function inverseLerp(a: number, b: number, value: number): number;
export function smoothStep(edge0: number, edge1: number, x: number): number;
export function smootherStep(edge0: number, edge1: number, x: number): number;
```

### Angular Operations

```typescript
// Conversion
export function degreesToRadians(degrees: number): number;
export function radiansToDegrees(radians: number): number;

// Normalization
export function normalizeRadians(radians: number): number; // to [-PI, PI]
export function normalizeRadiansPositive(radians: number): number; // to [0, TAU]

// Operations
export function angleDifference(from: number, to: number): number;
export function angleDistance(a: number, b: number): number;
export function anglesNearEqual(a: number, b: number, epsilon?: number): boolean;

// Interpolation
export function lerpAngle(from: number, to: number, t: number): number;
export function slerpAngle(from: number, to: number, t: number): number;
```

### Numeric Operations

```typescript
// Safety
export function safeDiv(numerator: number, denominator: number, epsilon?: number): number;
export function safeSqrt(x: number): number;
export function safeAcos(x: number): number;
export function safeAsin(x: number): number;

// Guards
export function isFinite(x: number): boolean;
export function isNaN(x: number): boolean;
export function sanitizeNumber(x: number, fallback: number, min?: number, max?: number): number;

// Rounding
export function roundToInt(x: number): number;
export function roundToPlaces(x: number, places: number): number;
export function snapToGrid(x: number, gridSize: number, offset?: number): number;

// Wrapping
export function wrap(value: number, min: number, max: number): number;
export function euclideanMod(dividend: number, divisor: number): number;
```

## Performance Modules

### Batch Operations

```typescript
class Vector2Batch {
 readonly x: Float32Array;
 readonly y: Float32Array;
 readonly count: number;

 constructor(count: number, buffer?: SharedArrayBuffer);

 // Element access
 get(index: number, out?: Vector2): Vector2;
 set(index: number, vector: Vector2): void;
 fill(vector: Vector2): void;

 // Arithmetic operations (in-place and out-of-place)
 add(other: Vector2Batch, out?: Vector2Batch): Vector2Batch;
 addScalar(vector: Vector2, out?: Vector2Batch): Vector2Batch;
 scale(scalar: number, out?: Vector2Batch): Vector2Batch;

 // Geometric operations
 normalize(out?: Vector2Batch): Vector2Batch;
 length(out?: Float32Array): Float32Array;
 dot(other: Vector2Batch, out?: Float32Array): Float32Array;

 // Transformations
 rotate(angle: number, out?: Vector2Batch): Vector2Batch;
 transform2x2(m00: number, m01: number, m10: number, m11: number, out?: Vector2Batch): Vector2Batch;

 // Statistics
 min(out?: Vector2): Vector2;
 max(out?: Vector2): Vector2;
 mean(out?: Vector2): Vector2;

 // Conversion
 toVectors(): Vector2[];
 toArray(out?: Float32Array): Float32Array;
}
```

### Object Pooling

```typescript
// Type pools
class TypePools {
 static readonly vector2: ObjectPool<Vector2>;
 static readonly complex: ObjectPool<Complex>;
 static readonly matrix2: ObjectPool<Matrix2>;
 static readonly matrix3: ObjectPool<Matrix3>;
 static readonly transform2: ObjectPool<Transform2>;

 static preallocateAll(sizes?: Partial<Record<string, number>>): void;
 static clearAll(): void;
 static getAllStats(): PoolStats;
}

// Convenience functions
export function withVector2<R>(fn: (v: Vector2) => R): R;
export function withVector2s<R>(count: number, fn: (...vectors: Vector2[]) => R): R;
export function withMatrix3<R>(fn: (m: Matrix3) => R): R;
export function withTransform2<R>(fn: (t: Transform2) => R): R;

// Generic pool
class ObjectPool<T> {
 constructor(factory: () => T, config?: PoolConfig);

 acquire(): T;
 release(obj: T): void;
 releaseMany(objects: T[]): void;

 withTemporary<R>(fn: (obj: T) => R): R;
 scope<R>(fn: (context: PoolContext<T>) => R): R;

 getStats(): PoolStats;
}
```

### Validation

```typescript
// Configuration
enum ValidationMode {
 NONE = 'none', // No validation
 SAFE = 'safe', // Return safe fallbacks
 WARN = 'warn', // Log warnings
 STRICT = 'strict', // Throw errors
}

interface ValidationConfig {
 mode: ValidationMode;
 validateFinite?: boolean;
 validateNaN?: boolean;
 validateRange?: boolean;
 checkDenormals?: boolean;
 logger?: (message: string) => void;
}

// Configuration functions
function setValidationConfig(config: Partial<ValidationConfig>): void;
function getValidationConfig(): Required<ValidationConfig>;
function resetValidationConfig(): void;
function withValidationConfig<T>(config: Partial<ValidationConfig>, fn: () => T): T;

// Validators
class NumericalValidator {
 static validateFinite(value: number, name?: string): number;
 static validateNotNaN(value: number, name?: string): number;
 static validateRange(value: number, min: number, max: number, name?: string): number;
 static sanitize(
  value: number,
  fallback?: number,
  min?: number,
  max?: number,
  name?: string,
 ): number;

 static validateVector2(x: number, y: number, name?: string): { x: number; y: number };
 static validateMatrix2(
  m00: number,
  m01: number,
  m10: number,
  m11: number,
  name?: string,
 ): { m00: number; m01: number; m10: number; m11: number };

 static assertNearEquals(
  actual: number,
  expected: number,
  epsilon?: number,
  message?: string,
 ): void;
}
```

## Usage Examples

### Basic Vector Math

```typescript
import { Vector2 } from '@lenguados/math2d';

const a = new Vector2(3, 4);
const b = new Vector2(1, 2);

// Basic operations
const sum = a.add(b); // Vector2(4, 6)
const diff = a.subtract(b); // Vector2(2, 2)
const scaled = a.scale(2); // Vector2(6, 8)

// Geometric operations
const length = a.length(); // 5
const normalized = a.normalize(); // Vector2(0.6, 0.8)
const dot = a.dot(b); // 11
const angle = a.angleTo(b); // angle in radians
```

### Transform Hierarchies

```typescript
import { Transform2 } from '@lenguados/math2d';

// Parent transform
const parent = new Transform2();
parent.position.set(100, 100);
parent.rotation = Math.PI / 4;
parent.scale.set(2, 2);

// Child transform (relative to parent)
const child = new Transform2();
child.position.set(50, 0);

// Combined world transform
const world = parent.multiply(child);

// Transform a point from local to world space
const localPoint = new Vector2(10, 10);
const worldPoint = world.transformPoint(localPoint);
```

### High-Performance Processing

```typescript
import { Vector2Batch, withVector2 } from '@lenguados/math2d';

// Process many vectors efficiently
const particles = new Vector2Batch(10000);

// Initialize positions
particles.fill(new Vector2(0, 0));

// Apply forces
withVector2((gravity) => {
 gravity.set(0, -9.81);
 particles.addScalar(gravity.scale(deltaTime));
});

// Get statistics
const bounds = {
 min: particles.min(),
 max: particles.max(),
 center: particles.mean(),
};
```

### Safe Mathematical Operations

```typescript
import { safeDiv, clamp, normalizeRadians } from '@lenguados/math2d';
import { setValidationConfig, ValidationMode } from '@lenguados/math2d/validation';

// Enable validation in development
if (process.env.NODE_ENV === 'development') {
 setValidationConfig({ mode: ValidationMode.STRICT });
}

// Safe operations
const ratio = safeDiv(a, b); // Handles division by zero
const clamped = clamp(value, 0, 1); // Ensures value in range
const angle = normalizeRadians(anyAngle); // Always in [-π, π]

// Validated operations (throws in strict mode if invalid)
const v = new Vector2(NaN, 0); // Will throw error
const normalized = v.normalize(); // Will validate input
```
