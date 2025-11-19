/**
 * @file src/mat3/constants.ts
 * @module math2d/mat3/constants
 * @description Static constants for Mat3.
 */

import { Mat3Base } from './base';
import { freezeMat3 } from './helpers';

/**
 * Static constants for Mat3 class.
 * @internal
 */
export const MAT3_CONSTANTS = {
  /** Identity matrix. */
  IDENTITY_MATRIX: freezeMat3(new Mat3Base(1, 0, 0, 0, 1, 0, 0, 0, 1)),

  /** All-zero matrix. */
  ZERO_MATRIX: freezeMat3(new Mat3Base(0, 0, 0, 0, 0, 0, 0, 0, 0)),
} as const;
