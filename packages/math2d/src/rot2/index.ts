/**
 * @file src/rot2/index.ts
 * @module math2d/rot2
 * @description Pure 2D rotation representation and operations for the Lenguado physics-engine family.
 * 
 * @remarks
 * - Representation: unit complex `{ c, s } = { cos(θ), sin(θ) }`.
 * - Composition is complex multiplication; inverse is the conjugate.
 * - **Convention**: angles are in radians with **CCW positive**; vectors are treated
 *   as **column vectors** and the rotation matrix is:
 *   ```
 *   R = [ c  -s
 *         s   c ]
 *   ```
 *   so `v' = R · v` and `R(a)·R(b) = R(a + b)`.
 * - Instance methods are **mutable** and chainable; static helpers are **pure**
 *   and provide **alloc-free** overloads writing into `out` parameters.
 * - Includes robust normalization to mitigate numerical drift in hot paths.
 */

// Base class
export { Rot2Base } from './base';

// Helper types and functions
export { freezeRot2, isRot2Like } from './helpers';
export type { Rot2Like, ReadonlyRot2 } from './helpers';

// Import all modules to register methods
import './factories';
// TODO: Add instance modules as they are created:
// import './instance/mutators';
// import './instance/operations';
// import './instance/comparison';
// import './instance/conversion';
// import './instance/interpolation';

// Import constants and apply to Rot2Base
import { ROT2_CONSTANTS } from './constants';
import { Rot2Base } from './base';

// Apply static constants
Object.assign(Rot2Base, ROT2_CONSTANTS);

// Re-export the main Rot2 class
export { Rot2Base as Rot2 } from './base';

// Export factory type
export type { Rot2 } from './factories';
