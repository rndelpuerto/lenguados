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
 * 2. **Core Types** (`core/`): High-level mathematical objects
 *    - Vector2, Complex, Interval
 *    - Rotation2, Matrix2, Matrix3, Transform2
 *
 * 3. **Deterministic Math**: Platform-consistent trigonometry via `DeterministicMath`
 *
 * ## Usage
 *
 * ```typescript
 * import { Vector2, Matrix3, Transform2, DeterministicMath } from '@lenguados/math2d';
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
 *
 * // Use deterministic math for reproducibility
 * const sin = DeterministicMath.sin(angle);
 * const cos = DeterministicMath.cos(angle);
 * ```
 *
 * ## Internal Modules
 *
 * For advanced use cases, additional modules are available via specific imports:
 *
 * ```typescript
 * // Validation - assertions for development (Box2D/Bullet style)
 * import { assertFinite, assertVector2, setAssertionsEnabled } from '@lenguados/math2d/validation/assert';
 *
 * // Deterministic - precision arithmetic and rounding control
 * import { PrecisionMath } from '@lenguados/math2d/deterministic/precision-math';
 * import { RoundingControl } from '@lenguados/math2d/deterministic/rounding-control';
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

// Re-export only DeterministicMath from deterministic module
// Other deterministic utilities (PrecisionMath, RoundingControl) are available
// via '@lenguados/math2d/deterministic/*'
export { DeterministicMath } from './deterministic/deterministic-math';
