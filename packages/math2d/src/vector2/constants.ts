/**
 * @file src/vector2/constants.ts
 * @module math2d/core/vector2/constants
 * @description Static constants for Vector2 class.
 * @internal
 */

import { Vector2Base } from './base';
import { freezeVector2 } from './helpers';
import { EPSILON } from '../scalar';

/**
 * Static Vector2 constants for common values.
 * All constants are frozen to prevent mutation.
 * @internal
 */
export const VECTOR2_CONSTANTS = {
 /** The zero/origin vector `(0, 0)`. */
 ZERO_VECTOR: freezeVector2(new Vector2Base(0, 0)),

 /** The all-ones vector `(1, 1)`. */
 ONE_VECTOR: freezeVector2(new Vector2Base(1, 1)),

 /** The all-(-1) vector `(−1, −1)`. */
 NEGATIVE_ONE_VECTOR: freezeVector2(new Vector2Base(-1, -1)),

 /** The `(EPSILON, EPSILON)` vector. */
 EPSILON_VECTOR: freezeVector2(new Vector2Base(EPSILON, EPSILON)),

 /** The `( +∞, +∞ )` vector. */
 INFINITY_VECTOR: freezeVector2(
  new Vector2Base(Number.POSITIVE_INFINITY, Number.POSITIVE_INFINITY),
 ),

 /** The `( −∞, −∞ )` vector. */
 NEGATIVE_INFINITY_VECTOR: freezeVector2(
  new Vector2Base(Number.NEGATIVE_INFINITY, Number.NEGATIVE_INFINITY),
 ),

 /** Unit vector along +X `(1, 0)`. */
 UNIT_X_VECTOR: freezeVector2(new Vector2Base(1, 0)),

 /** Unit vector along +Y `(0, 1)`. */
 UNIT_Y_VECTOR: freezeVector2(new Vector2Base(0, 1)),

 /** Unit vector along −X `(−1, 0)`. */
 NEGATIVE_UNIT_X_VECTOR: freezeVector2(new Vector2Base(-1, 0)),

 /** Unit vector along −Y `(0, −1)`. */
 NEGATIVE_UNIT_Y_VECTOR: freezeVector2(new Vector2Base(0, -1)),

 /** 45° diagonal unit `(1/√2, 1/√2)`. */
 UNIT_DIAGONAL_VECTOR: freezeVector2(
  new Vector2Base(Math.SQRT1_2, Math.SQRT1_2),
 ),

 /** 225° diagonal unit `(−1/√2, −1/√2)`. */
 NEGATIVE_UNIT_DIAGONAL_VECTOR: freezeVector2(
  new Vector2Base(-Math.SQRT1_2, -Math.SQRT1_2),
 ),
} as const;
