/**
 * @file src/mat3/base.ts
 * @module math2d/mat3/base
 * @description Base Mat3 class definition.
 * @internal
 */

/**
 * Base Mat3 class with only core properties and constructor.
 * Methods are added via prototype extension in separate modules.
 * 
 * @remarks
 * Storage is **row-major** using the fields: `m00, m01, m02, m10, m11, m12, m20, m21, m22`.
 * Vectors are treated as **column vectors** when applying transforms: `p' = M · p`.
 * 
 * Affine 2D transforms are represented as:
 * ```
 * [ a  c  tx ]
 * [ b  d  ty ]
 * [ 0  0   1 ]
 * ```
 * where the upper-left 2×2 block encodes rotation/scale/shear and the last column is translation.
 * 
 * @internal
 */
export class Mat3Base {
  /**
   * Row 0, Col 0.
   */
  public m00: number;

  /**
   * Row 0, Col 1.
   */
  public m01: number;

  /**
   * Row 0, Col 2.
   */
  public m02: number;

  /**
   * Row 1, Col 0.
   */
  public m10: number;

  /**
   * Row 1, Col 1.
   */
  public m11: number;

  /**
   * Row 1, Col 2.
   */
  public m12: number;

  /**
   * Row 2, Col 0.
   */
  public m20: number;

  /**
   * Row 2, Col 1.
   */
  public m21: number;

  /**
   * Row 2, Col 2.
   */
  public m22: number;

  /**
   * Constructs a new 3×3 matrix.
   * 
   * @param m00 - Row 0, Col 0 (defaults to 1).
   * @param m01 - Row 0, Col 1 (defaults to 0).
   * @param m02 - Row 0, Col 2 (defaults to 0).
   * @param m10 - Row 1, Col 0 (defaults to 0).
   * @param m11 - Row 1, Col 1 (defaults to 1).
   * @param m12 - Row 1, Col 2 (defaults to 0).
   * @param m20 - Row 2, Col 0 (defaults to 0).
   * @param m21 - Row 2, Col 1 (defaults to 0).
   * @param m22 - Row 2, Col 2 (defaults to 1).
   * 
   * @remarks
   * Default values create an identity matrix.
   */
  public constructor(
    m00 = 1, m01 = 0, m02 = 0,
    m10 = 0, m11 = 1, m12 = 0,
    m20 = 0, m21 = 0, m22 = 1
  ) {
    this.m00 = m00;
    this.m01 = m01;
    this.m02 = m02;
    this.m10 = m10;
    this.m11 = m11;
    this.m12 = m12;
    this.m20 = m20;
    this.m21 = m21;
    this.m22 = m22;
  }
}
