/**
 * @file src/constants/index.ts
 * @module math2d/constants
 * @description Centralized constants for @lenguados/math2d.
 * 
 * @remarks
 * Constants are organized into logical groups:
 * - Mathematical constants (PI, TAU, etc.) in ./math
 * - Precision/tolerance constants (EPSILON, etc.) in ./precision
 */

// Re-export mathematical constants
export * from './math';

// Re-export precision constants
export * from './precision';

// Re-export conversion constants
export * from './conversion';

// Re-export tolerance types for standardized usage
export * from './tolerance-types';
