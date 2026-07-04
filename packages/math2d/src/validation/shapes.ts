/**
 * @file validation/shapes.ts
 * @module @lenguados/math2d/validation
 * @description Object shape assertions for validating unknown values against *Like interfaces
 *
 * @remarks
 * Provides the `assert*Like` shape-validation functions for all core types as a dedicated subpath.
 * These functions accept `unknown` values, narrow them to the corresponding `*Like`
 * interface via TypeScript assertion signatures, and validate that all numeric
 * components are finite.
 *
 * Use these at system boundaries (API responses, JSON deserialization, user input)
 * where the incoming data type is not statically known. For validating values that
 * are already typed, use the scalar and component assertions from the main barrel.
 *
 * All functions are development-only and eliminated via DCE in production builds.
 *
 * @example
 * ```typescript
 * import { assertVector2Like, assertMatrix3Like } from '@lenguados/math2d/validation/shapes';
 *
 * function processInput(v: unknown, m: unknown): void {
 *   assertVector2Like(v, 'velocity');
 *   assertMatrix3Like(m, 'transform');
 *   // v and m are now narrowed to Vector2Like and Matrix3Like
 * }
 * ```
 *
 * @see {@link isVector2Like} - Runtime type guards (always active, available from the main barrel)
 * @see {@link assertFinite} - Scalar assertions (available from the main barrel)
 */
export {
 assertVector2Like,
 assertRotation2Like,
 assertMatrix2Like,
 assertMatrix3Like,
 assertComplexLike,
 assertIntervalLike,
 assertTransform2Like,
} from './assert';
