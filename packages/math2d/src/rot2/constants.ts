/**
 * @file src/rot2/constants.ts
 * @module math2d/rot2/constants
 * @description Static constants for Rot2.
 */

import { Rot2Base } from './base';
import { freezeRot2 } from './helpers';

/**
 * Static constants for Rot2 class.
 * @internal
 */
export const ROT2_CONSTANTS = {
  /** Identity rotation (θ = 0). */
  IDENTITY_ROTATION: freezeRot2(new Rot2Base(1, 0)),

  /** +90° counter-clockwise rotation. */
  ROT90_CCW_ROTATION: freezeRot2(new Rot2Base(0, 1)),

  /** −90° clockwise rotation. */
  ROT90_CW_ROTATION: freezeRot2(new Rot2Base(0, -1)),

  /** 180° rotation. */
  ROT180_ROTATION: freezeRot2(new Rot2Base(-1, 0)),
} as const;
