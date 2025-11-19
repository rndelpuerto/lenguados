/**
 * @file src/rot2/base.ts
 * @module math2d/rot2/base
 * @description Base Rot2 class definition.
 */

/**
 * Pure 2D rotation represented as a unit complex `{ c, s } = { cos(θ), sin(θ) }`.
 * 
 * @remarks
 * - **Composition**: `R(a) · R(b) = R(a + b)` via complex multiplication.
 * - **Inverse**: conjugate `{ c, −s }` equals `R(−θ)`.
 * - **Interpolation**: SLERP (constant angular velocity, shortest arc) and
 *   NLERP (linear blend + renormalization).
 * - **Application to vectors**: `v' = R · v` with alloc-free variants.
 * - **Convention**: angles are in radians with **CCW positive**; vectors are treated
 *   as **column vectors** and the rotation matrix is:
 *   ```
 *   R = [ c  -s
 *         s   c ]
 *   ```
 */
export class Rot2Base {
  /**
   * Cosine of the rotation angle.
   */
  public c: number;

  /**
   * Sine of the rotation angle.
   */
  public s: number;

  /**
   * Creates a new rotation.
   * 
   * @param c - Cosine of the angle. @defaultValue 1
   * @param s - Sine of the angle. @defaultValue 0
   * 
   * @remarks
   * Default values create the identity rotation (angle = 0).
   * This does not enforce unit length. For normalized rotations,
   * use factory methods or call normalize() after construction.
   */
  public constructor(c: number = 1, s: number = 0) {
    this.c = c;
    this.s = s;
  }
}
