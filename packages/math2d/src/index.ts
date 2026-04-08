/**
 * @packageDocumentation
 * @module @lenguados/math2d
 * @description Pure mathematical primitives and operations for 2D graphics and physics
 *
 * @remarks
 *
 * ## Overview
 *
 * This library provides a comprehensive set of 2D mathematical types and operations,
 * designed with a focus on:
 * - **Performance**: Minimal allocations, cache-friendly operations.
 * - **Robustness**: Careful handling of edge cases and numerical precision.
 * - **Determinism**: Reproducible results across platforms.
 * - **Tree-shaking**: Modular design for optimal bundle sizes.
 *
 * ## Architecture
 *
 * The library is organized in layers:
 *
 * 1. **Auxiliary Modules** (`auxiliary/`): Low-level scalar and angular operations.
 *    - `scalar/`: Arithmetic, comparison, interpolation.
 *    - `angle/`: Normalization, conversion, wrapping.
 *    - `numeric/`: Safety guards, rounding, precision.
 *
 * 2. **Core Types** (`core/`): High-level mathematical objects.
 *    - Vector2, Complex, Interval
 *    - Rotation2, Matrix2, Matrix3, Transform2
 *
 * 3. **Deterministic Math** (`deterministic/`): Platform-consistent trigonometry via specialized kernels.
 *
 * ## Usage
 *
 * ```typescript
 * import { Vector2, Matrix2, Matrix3, Transform2, sin, cos, QUARTER_PI } from '@lenguados/math2d';
 *
 * // Create and manipulate vectors
 * const v1 = new Vector2(3, 4);
 * const v2 = new Vector2(1, 0);
 * const sum = v1.add(v2);
 *
 * // Work with transformations
 * const transform = new Transform2();
 * transform.position.set(100, 50);
 * transform.rotation.setAngle(QUARTER_PI);
 * transform.scale.set(2, 2);
 *
 * // Apply transformations
 * const point = new Vector2(10, 10);
 * const transformedByTransform = transform.transformPoint(point);
 *
 * // Matrix2 rotation
 * const mat2 = Matrix2.fromRotation(QUARTER_PI);
 * const rotated = mat2.transformVector(v1);
 *
 * // Matrix3 affine transform
 * const mat3 = Matrix3.fromTranslation({ x: 5, y: 10 }).rotate(QUARTER_PI);
 * const transformedByMatrix = mat3.transformPoint(point);
 *
 * // Use deterministic math for reproducibility
 * const angle = QUARTER_PI;
 * const sinValue = sin(angle);  // Deterministic across all platforms
 * const cosValue = cos(angle);  // Uses polynomial approximation
 * ```
 *
 * ## Internal Modules
 *
 * For advanced use cases, additional modules are available via specific imports:
 *
 * ```typescript
 * // Validation - assertions for development (tree-shakeable)
 * import { assertFinite, assertVector2, setAssertionsEnabled } from '@lenguados/math2d/validation/assert';
 *
 *
 * // Random generation
 * import { randomVector2, randomInCircle } from '@lenguados/math2d/utils/random';
 * import { SeededRandomSource } from '@lenguados/math2d/utils/random-source';
 *
 * // Parsing/serialization
 * import { parseVector2, formatMatrix3 } from '@lenguados/math2d/utils/parse';
 *
 * // Performance measurement
 * import { measure, MeasurementCollector } from '@lenguados/math2d/utils/performance';
 * ```
 */

// Re-export type definitions (no runtime cost, improves DX)
export * from './types';

// Re-export auxiliary modules
export * from './auxiliary/scalar';
export * from './auxiliary/angle';
export * from './auxiliary/numeric';

// Re-export core types
export * from './core';

// Re-export deterministic kernels for L0 cross-platform math
export { DeterministicKernels } from './deterministic/deterministic-kernels';

// Re-export individual pure deterministic kernels (L0).
// Safe variants (acosSafe, asinSafe, expSafe, etc.) are exported via
// `export * from './auxiliary/numeric'` from safety.ts (L1).
// sinCos is exported via `export * from './auxiliary/angle'` (which wraps the kernel).
export {
 acos,
 asin,
 atan,
 atan2,
 config,
 cos,
 exp,
 hypot,
 log,
 pow,
 sin,
 tan,
} from './deterministic/deterministic-kernels';

// Re-export validation/assertion utilities
export {
 setAssertionsEnabled,
 areAssertionsEnabled,
 assertFinite,
 assertNonZero,
 assertRange,
 assertPositive,
 assertNonNegative,
 assertSafeInteger,
 assert,
 assertVector2,
 assertMatrix2,
 assertMatrix3,
 assertRotation2,
 assertRotation2Normalized,
 assertComplex,
 assertInterval,
 assertTransform2,
 assertVector2Like,
 assertRotation2Like,
 assertMatrix2Like,
 assertMatrix3Like,
 assertComplexLike,
 assertIntervalLike,
 assertTransform2Like,
} from './validation/assert';
