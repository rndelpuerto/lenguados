/**
 * @file src/mat2/index.ts
 * @module math2d/mat2
 * @description 2×2 matrix implementation for the Lenguado 2D physics-engine family.
 * 
 * @remarks
 * - Storage is **row-major** using the fields: `m00, m01, m10, m11`.
 * - Vectors are treated as **column vectors** when applying transforms: `v' = M · v`.
 * - Instance methods are **mutable** and chainable for ergonomics.
 * - Static helpers are **pure** and offer optional `out` parameters for **alloc-free** workflows.
 * - Avoids logs in hot-paths; offers "safe" and "tolerant" variants for numerical robustness.
 */

// Base class
export { Mat2Base } from './base';

// Helper types and functions
export { freezeMat2, isMat2Like } from './helpers';
export type { Mat2Like, ReadonlyMat2 } from './helpers';

// Import all modules to register methods
import './factories';
import './instance/mutators';
import './instance/arithmetic';
import './instance/transforms';
import './instance/comparison';
import './instance/conversion';

// Import constants and apply to Mat2Base
import { MAT2_CONSTANTS } from './constants';
import { Mat2Base } from './base';

// Apply static constants
Object.assign(Mat2Base, MAT2_CONSTANTS);

// Re-export the main Mat2 class
export { Mat2Base as Mat2 } from './base';

// Export factory type
export type { Mat2 } from './factories';
