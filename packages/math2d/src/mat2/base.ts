/**
 * @file src/mat2/base.ts
 * @module math2d/mat2/base
 * @description Base Mat2 class definition.
 * @internal
 */

/**
 * Base Mat2 class with only core properties and constructor.
 * Methods are added via prototype extension in separate modules.
 * 
 * @remarks
 * Storage is **row-major** using the fields: `m00, m01, m10, m11`.
 * Vectors are treated as **column vectors** when applying transforms: `v' = M · v`.
 * 
 * @internal
 */
export class Mat2Base {
  /**
   * Row 0, Col 0.
   */
  public m00: number;

  /**
   * Row 0, Col 1.
   */
  public m01: number;

  /**
   * Row 1, Col 0.
   */
  public m10: number;

  /**
   * Row 1, Col 1.
   */
  public m11: number;

  /**
   * Constructs a new 2×2 matrix.
   * 
   * @param m00 - Row 0, Col 0 (defaults to 1).
   * @param m01 - Row 0, Col 1 (defaults to 0).
   * @param m10 - Row 1, Col 0 (defaults to 0).
   * @param m11 - Row 1, Col 1 (defaults to 1).
   * @remarks
   * Default values create an identity matrix.
   */
  public constructor(m00 = 1, m01 = 0, m10 = 0, m11 = 1) {
    this.m00 = m00;
    this.m01 = m01;
    this.m10 = m10;
    this.m11 = m11;
  }
}
