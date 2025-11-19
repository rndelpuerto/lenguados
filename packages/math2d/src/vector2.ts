/**
 * @file src/vector2.ts
 * @module math2d/vector2
 * @description Two-dimensional vector implementation for the Lenguado 2‑D physics-engine family.
 * This file now serves as a re-export point for the modularized Vector2 implementation.
 *
 * @remarks
 * **Angle & rotation conventions**
 * - Angles are in radians, measured from the +X axis with **counter‑clockwise (CCW)** considered positive.
 * - Vectors are treated as column vectors; rotations use the standard matrix:
 *   ```
 *   [ cosθ  −sinθ ]
 *   [ sinθ   cosθ ]
 *   ```
 *   so a +90° CCW rotation maps `(x, y) → (−y, x)`, and a −90° CW rotation maps `(x, y) → (y, −x)`.
 */

// Re-export everything from the modularized implementation
export * from './vector2/index';

// For backward compatibility, also import and re-export the main class as default
import { Vector2 } from './vector2/index';
export default Vector2;
