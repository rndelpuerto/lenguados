/**
 * @packageDocumentation
 * @module @lenguados/math2d
 *
 * Pure mathematical primitives and operations for 2D graphics and physics.
 *
 * ## Overview
 *
 * This library provides a comprehensive set of 2D mathematical types and operations,
 * designed with a focus on:
 * - **Performance**: Minimal allocations, cache-friendly operations
 * - **Robustness**: Careful handling of edge cases and numerical precision
 * - **Determinism**: Reproducible results across platforms
 * - **Tree-shaking**: Modular design for optimal bundle sizes
 *
 * ## Architecture
 *
 * The library is organized in layers:
 *
 * 1. **Auxiliary Modules** (`auxiliary/`): Low-level scalar and angular operations
 *    - `scalar/`: Arithmetic, comparison, interpolation
 *    - `angle/`: Normalization, conversion, wrapping
 *    - `numeric/`: Safety guards, rounding, precision
 *
 * 2. **Deterministic Layer** (`deterministic/`): Platform-consistent math
 *    - Lookup tables for trigonometry
 *    - Fixed-point arithmetic
 *    - Controlled rounding
 *
 * 3. **Core Types** (`core/`): High-level mathematical objects
 *    - Vector2, Complex, Interval
 *    - Rotation2, Quaternion2
 *    - Matrix2, Matrix3, Transform2
 *
 * 4. **Optimization Modules**:
 *    - `batch/`: High-performance batch operations using TypedArrays
 *    - `pool/`: Object pooling for reducing allocations
 *    - `validation/`: Runtime validation and debugging
 *
 * ## Usage
 *
 * ```typescript
 * import { Vector2, Matrix3, Transform2 } from '@lenguados/math2d';
 *
 * // Create and manipulate vectors
 * const v1 = new Vector2(3, 4);
 * const v2 = new Vector2(1, 0);
 * const sum = v1.add(v2);
 *
 * // Work with transformations
 * const transform = new Transform2();
 * transform.position.set(100, 50);
 * transform.rotation = Math.PI / 4;
 * transform.scale.set(2, 2);
 *
 * // Apply transformations
 * const point = new Vector2(10, 10);
 * const transformed = transform.transformPoint(point);
 * ```
 */

// Re-export auxiliary modules
export * from './auxiliary/scalar';
export * from './auxiliary/angle';
export * from './auxiliary/numeric';

// Re-export deterministic math
export * from './deterministic';

// Re-export core types
export * from './core';

// Re-export optimization modules
export * from './batch';
export * from './pool';
export * from './validation';
