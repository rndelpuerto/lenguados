/**
 * @file src/mat3/index.ts
 * @module math2d/mat3
 * @description 3×3 matrix implementation for the Lenguado 2D physics-engine family.
 * 
 * @remarks
 * - Storage is **row-major** using the fields: `m00, m01, m02, m10, m11, m12, m20, m21, m22`.
 * - Vectors are treated as **column vectors** when applying transforms: `p' = M · p`.
 * - Affine 2D transforms are represented as:
 *   ```
 *   [ a  c  tx ]
 *   [ b  d  ty ]
 *   [ 0  0   1 ]
 *   ```
 *   where the upper-left 2×2 block encodes rotation/scale/shear and the last column is translation.
 * - Instance methods are **mutable** and chainable for ergonomics.
 * - Static helpers are **pure** and offer optional `out` parameters for **alloc-free** workflows.
 * - Console I/O is avoided in hot paths; "safe/tolerant" variants are provided for numerical robustness.
 */

// Base class
export { Mat3Base } from './base';

// Helper types and functions
export { freezeMat3, isMat3Like } from './helpers';
export type { Mat3Like, ReadonlyMat3 } from './helpers';

// Import all modules to register methods
import './factories';
import './instance/mutators';
import './instance/arithmetic';
import './instance/transforms';
import './instance/affine';
import './instance/comparison';
import './instance/conversion';
// TODO: Add remaining instance modules as they are created:
// import './instance/geometry';

// Import constants and apply to Mat3Base
import { MAT3_CONSTANTS } from './constants';
import { Mat3Base } from './base';

// Apply static constants
Object.assign(Mat3Base, MAT3_CONSTANTS);

// Re-export the main Mat3 class
export { Mat3Base as Mat3 } from './base';

// Export factory type
export type { Mat3 } from './factories';
