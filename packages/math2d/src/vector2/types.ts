/**
 * @file src/vector2/types.ts
 * @module math2d/core/vector2/types
 * @description Type declarations for Vector2.
 * 
 * @remarks
 * This file declares that Vector2 implements the core interfaces,
 * ensuring type safety and interface compliance.
 */

import type { 
  Arithmetic,
  Comparable,
  Interpolatable,
  Normalizable,
  Serializable,
  Transformable,
  ZeroComparable,
  WeightedCombinable
} from '../interfaces';
import type { Vector2Base } from './base';
import type { Mat2 } from '../mat2';
import type { Mat3 } from '../mat3';
import type { Transform2 } from '../transform2';

/**
 * Type declaration ensuring Vector2 implements all required interfaces.
 * 
 * @remarks
 * This enforces that Vector2Base (with all its prototype extensions)
 * properly implements the core mathematical interfaces.
 */
export interface Vector2 extends 
  Vector2Base,
  Arithmetic<Vector2>,
  Comparable<Vector2>,
  Interpolatable<Vector2>,
  Normalizable<Vector2>,
  Serializable<number[], { x: number; y: number }>,
  Transformable<Vector2, Mat2 | Mat3 | Transform2>,
  ZeroComparable,
  WeightedCombinable<Vector2> {}

/**
 * Static type checking to ensure Vector2Base implements required static interfaces.
 * This is a compile-time check only.
 */
declare const _typeCheck: {
  // These will cause compile errors if the static methods don't match the interfaces
  arithmetic: typeof Vector2Base extends ArithmeticStatic<Vector2> ? true : never;
  comparable: typeof Vector2Base extends ComparableStatic<Vector2> ? true : never;
  interpolatable: typeof Vector2Base extends InterpolatableStatic<Vector2> ? true : never;
  normalizable: typeof Vector2Base extends NormalizableStatic<Vector2, Vector2> ? true : never;
  serializable: typeof Vector2Base extends SerializableStatic<Vector2, number[], { x: number; y: number }> ? true : never;
  transformable: typeof Vector2Base extends TransformableStatic<Vector2, Vector2> ? true : never;
  zeroComparable: typeof Vector2Base extends ZeroComparableStatic<Vector2> ? true : never;
  weightedCombinable: typeof Vector2Base extends WeightedCombinableStatic<Vector2> ? true : never;
};

// Import the static interface types
import type {
  ArithmeticStatic,
  ComparableStatic,
  InterpolatableStatic,
  NormalizableStatic,
  SerializableStatic,
  TransformableStatic,
  ZeroComparableStatic,
  WeightedCombinableStatic
} from '../interfaces';
