/**
 * @file src/core/vector2/index.ts
 * @module math2d/core/vector2
 * @description Main entry point for the modularized Vector2 class.
 * Assembles the complete Vector2 class from modular components while preserving
 * the exact same public API as the original monolithic implementation.
 */

// Import base class and extend it
import { Vector2Base } from './base';

// Import and apply all module extensions
import './constants';
import './factories';
import './arithmetic';
import './interpolation';
import './geometry';

// Import temporary file with remaining implementations
// TODO: Refactor this into proper modules
import './temporary-complete';

// TODO: Import other modules as they are created
// import './transforms';
// import './comparison';
// import './conversion';
// import './instance/arithmetic';
// import './instance/interpolation';
// import './instance/geometry';
// import './instance/transforms';
// import './instance/comparison';
// import './instance/conversion';

// Re-export types and helpers
export type { Vector2Like, ReadonlyVector2Like } from './helpers';
export { freezeVector2, isVector2Like } from './helpers';
export type { ReadonlyVector2 } from './factories';

// Import constants to attach them to the class
import { VECTOR2_CONSTANTS } from './constants';

/**
 * Mutable, chainable two-dimensional vector with comprehensive operations for
 * arithmetic, geometry, transforms, comparisons and conversions.
 *
 * @remarks
 * - **Design:** Instance methods are *mutable* and chainable; static methods are *pure*
 *   with alloc‑free overloads that write into an `out` parameter (a common pattern in
 *   performance‑oriented math libs such as glMatrix). This minimizes allocations in hot paths.
 * - **Numerics:** Uses {@link Math.hypot} for robust length/distance calculations.
 * - **Safety:** "Safe" variants avoid throwing on degeneracies (e.g., zero length),
 *   returning zero vectors or no‑ops instead—useful in physics loops.
 * 
 * @public
 */
export class Vector2 extends Vector2Base {
 // Attach all static constants
 public static readonly ZERO_VECTOR = VECTOR2_CONSTANTS.ZERO_VECTOR;
 public static readonly ONE_VECTOR = VECTOR2_CONSTANTS.ONE_VECTOR;
 public static readonly NEGATIVE_ONE_VECTOR = VECTOR2_CONSTANTS.NEGATIVE_ONE_VECTOR;
 public static readonly EPSILON_VECTOR = VECTOR2_CONSTANTS.EPSILON_VECTOR;
 public static readonly INFINITY_VECTOR = VECTOR2_CONSTANTS.INFINITY_VECTOR;
 public static readonly NEGATIVE_INFINITY_VECTOR = VECTOR2_CONSTANTS.NEGATIVE_INFINITY_VECTOR;
 public static readonly UNIT_X_VECTOR = VECTOR2_CONSTANTS.UNIT_X_VECTOR;
 public static readonly UNIT_Y_VECTOR = VECTOR2_CONSTANTS.UNIT_Y_VECTOR;
 public static readonly NEGATIVE_UNIT_X_VECTOR = VECTOR2_CONSTANTS.NEGATIVE_UNIT_X_VECTOR;
 public static readonly NEGATIVE_UNIT_Y_VECTOR = VECTOR2_CONSTANTS.NEGATIVE_UNIT_Y_VECTOR;
 public static readonly UNIT_DIAGONAL_VECTOR = VECTOR2_CONSTANTS.UNIT_DIAGONAL_VECTOR;
 public static readonly NEGATIVE_UNIT_DIAGONAL_VECTOR = VECTOR2_CONSTANTS.NEGATIVE_UNIT_DIAGONAL_VECTOR;

 // Static methods are already attached to Vector2Base via module augmentation,
 // so they will be available on Vector2 through inheritance
}
