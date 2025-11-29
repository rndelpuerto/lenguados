/**
 * @module @lenguados/math2d/deterministic
 * @description Deterministic mathematical operations for reproducible physics simulations
 *
 * This module provides deterministic implementations of common math functions
 * to ensure cross-platform reproducibility in physics simulations. It includes:
 * - Lookup table-based trigonometric functions (sin, cos, atan2)
 * - Deterministic sqrt using Newton-Raphson iteration
 * - Fixed-point arithmetic helpers
 * - Compensated arithmetic for precision
 */

export * from './deterministic-math';
export * from './precision-math';
export * from './rounding-control';
export * from './types';
export * from './tables';
