/**
 * @module @lenguados/math2d/core
 * @description Core 2D mathematical types for the Lenguados math2d library
 *
 * This module provides the fundamental mathematical types:
 * - Vector2: 2D vectors with x,y components
 * - Complex: Complex numbers with real,imaginary components
 * - Interval: Closed intervals for interval arithmetic
 * - Rotation2: 2D rotations using unit complex representation (cos, sin)
 * - Matrix2: 2x2 matrices for linear transformations
 * - Matrix3: 3x3 matrices for affine transformations
 * - Transform2: Decomposed transforms (position, rotation, scale)
 */

// Export all core types
export * from './vector2';
export * from './complex';
export * from './interval';
export * from './rotation2';
export * from './matrix2';
export * from './matrix3';
export * from './transform2';
