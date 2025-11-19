/**
 * @file src/mat2/constants.ts
 * @module math2d/mat2/constants
 * @description Static constants for Mat2.
 */

import { Mat2Base } from './base';
import { freezeMat2 } from './helpers';

/**
 * Static constants for Mat2 class.
 * @internal
 */
export const MAT2_CONSTANTS = {
  /** Identity matrix. */
  IDENTITY_MATRIX: freezeMat2(new Mat2Base(1, 0, 0, 1)),

  /** All-zero matrix. */
  ZERO_MATRIX: freezeMat2(new Mat2Base(0, 0, 0, 0)),

  /** 90° counter-clockwise rotation matrix. */
  ROT90_CCW_MATRIX: freezeMat2(new Mat2Base(0, -1, 1, 0)),

  /** 90° clockwise rotation matrix. */
  ROT90_CW_MATRIX: freezeMat2(new Mat2Base(0, 1, -1, 0)),

  /** 180° rotation matrix. */
  ROT180_MATRIX: freezeMat2(new Mat2Base(-1, 0, 0, -1)),
} as const;
