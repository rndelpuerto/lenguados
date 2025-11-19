/**
 * @file src/mat3/instance/affine.ts
 * @module math2d/mat3/instance/affine
 * @description Affine transformation operations for Mat3.
 */

import { Mat3Base } from '../base';

declare module '../base' {
  interface Mat3Base {
    /**
     * Set upper-left 2×2 block while preserving translation and enforcing affine last row.
     * 
     * @param a00 - Row0,Col0.
     * @param a01 - Row0,Col1.
     * @param a10 - Row1,Col0.
     * @param a11 - Row1,Col1.
     * @returns This matrix for chaining.
     */
    set2x2(a00: number, a01: number, a10: number, a11: number): this;

    /**
     * Set this matrix to an **affine** rotation by angle (radians).
     * 
     * @param angle - Rotation angle (radians).
     * @returns This matrix, now a rotation (with `m02=m12=0`, last row affine).
     */
    setRotation(angle: number): this;

    /**
     * Set this matrix to an affine rotation using **precomputed** cosine/sine.
     * 
     * @param cosAngle - Cosine.
     * @param sinAngle - Sine.
     * @returns This matrix for chaining.
     */
    setRotationCS(cosAngle: number, sinAngle: number): this;

    /**
     * Set this matrix to an **affine** scaling.
     * 
     * @param scaleX - Scale X.
     * @param scaleY - Scale Y.
     * @returns This matrix for chaining.
     */
    setScaling(scaleX: number, scaleY: number): this;

    /**
     * Set this matrix to an **affine** shear.
     * 
     * @param shearX - Horizontal shear.
     * @param shearY - Vertical shear.
     * @returns This matrix for chaining.
     */
    setShear(shearX: number, shearY: number): this;

    /**
     * Set this matrix to **TRS** (translation–rotation–scale).
     * 
     * @param translateX - Translation X.
     * @param translateY - Translation Y.
     * @param angle - Rotation angle (radians).
     * @param scaleX - Scale X (default = 1).
     * @param scaleY - Scale Y (default = 1).
     * @returns This matrix for chaining.
     */
    setTRS(
      translateX: number,
      translateY: number,
      angle: number,
      scaleX?: number,
      scaleY?: number
    ): this;

    /**
     * Replace translation (m02, m12), enforcing affine last row.
     * 
     * @param translateX - Translation X.
     * @param translateY - Translation Y.
     * @returns This matrix for chaining.
     */
    setTranslation(translateX: number, translateY: number): this;

    /**
     * Post-multiply by a **translation** in place: `this = this × T(tx,ty)`.
     * 
     * @param translateX - Translation along X.
     * @param translateY - Translation along Y.
     * @returns This matrix after composition.
     * 
     * @remarks
     * Only the translation column is modified; basis columns remain unchanged.
     */
    translate(translateX: number, translateY: number): this;

    /**
     * Post-multiply by a **rotation** (affine) in place: `this = this × R(θ)`.
     * 
     * @param angle - Angle in radians.
     * @returns This matrix after composition.
     * 
     * @remarks
     * Only the first two columns (basis) are rotated; translation is preserved.
     */
    rotate(angle: number): this;

    /**
     * Post-multiply by a rotation using **cos/sin**, in place: `this = this × R(c,s)`.
     * 
     * @param cosAngle - `cos(θ)`.
     * @param sinAngle - `sin(θ)`.
     * @returns This matrix after composition.
     */
    rotateCS(cosAngle: number, sinAngle: number): this;

    /**
     * Post-multiply by a **scale** (affine) in place: `this = this × S(sx,sy)`.
     * 
     * @param scaleX - Scale factor along X.
     * @param scaleY - Scale factor along Y.
     * @returns This matrix after composition.
     * 
     * @remarks
     * Only the first two columns (basis) are scaled; translation is preserved.
     */
    scale(scaleX: number, scaleY: number): this;

    /**
     * Post-multiply by a **shear** (affine) in place: `this = this × H(shx,shy)`.
     * 
     * @param shearX - Horizontal shear (x w.r.t y).
     * @param shearY - Vertical shear (y w.r.t x).
     * @returns This matrix after composition.
     */
    shear(shearX: number, shearY: number): this;
  }
}

/**
 * Set upper-left 2×2 block while preserving translation and enforcing affine last row.
 */
Mat3Base.prototype.set2x2 = function (
  a00: number,
  a01: number,
  a10: number,
  a11: number
): any {
  this.m00 = a00;
  this.m01 = a01;
  this.m10 = a10;
  this.m11 = a11;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;
  return this;
};

/**
 * Set this matrix to an affine rotation by angle.
 */
Mat3Base.prototype.setRotation = function (angle: number): any {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  
  this.m00 = c;
  this.m01 = -s;
  this.m02 = 0;
  this.m10 = s;
  this.m11 = c;
  this.m12 = 0;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;
  
  return this;
};

/**
 * Set this matrix to an affine rotation using precomputed cosine/sine.
 */
Mat3Base.prototype.setRotationCS = function (cosAngle: number, sinAngle: number): any {
  this.m00 = cosAngle;
  this.m01 = -sinAngle;
  this.m02 = 0;
  this.m10 = sinAngle;
  this.m11 = cosAngle;
  this.m12 = 0;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;
  
  return this;
};

/**
 * Set this matrix to an affine scaling.
 */
Mat3Base.prototype.setScaling = function (scaleX: number, scaleY: number): any {
  this.m00 = scaleX;
  this.m01 = 0;
  this.m02 = 0;
  this.m10 = 0;
  this.m11 = scaleY;
  this.m12 = 0;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;
  
  return this;
};

/**
 * Set this matrix to an affine shear.
 */
Mat3Base.prototype.setShear = function (shearX: number, shearY: number): any {
  this.m00 = 1;
  this.m01 = shearX;
  this.m02 = 0;
  this.m10 = shearY;
  this.m11 = 1;
  this.m12 = 0;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;
  
  return this;
};

/**
 * Set this matrix to TRS (translation–rotation–scale).
 */
Mat3Base.prototype.setTRS = function (
  translateX: number,
  translateY: number,
  angle: number,
  scaleX: number = 1,
  scaleY: number = 1
): any {
  const c = Math.cos(angle);
  const s = Math.sin(angle);
  
  this.m00 = c * scaleX;
  this.m01 = -s * scaleY;
  this.m02 = translateX;
  this.m10 = s * scaleX;
  this.m11 = c * scaleY;
  this.m12 = translateY;
  this.m20 = 0;
  this.m21 = 0;
  this.m22 = 1;
  
  return this;
};

/**
 * Replace translation (m02, m12), enforcing affine last row.
 */
Mat3Base.prototype.setTranslation = function (translateX: number, translateY: number): any {
  this.m02 = translateX;
  this.m12 = translateY;
  this.m22 = 1;
  return this;
};

/**
 * Post-multiply by a translation in place.
 */
Mat3Base.prototype.translate = function (translateX: number, translateY: number): any {
  // col2' = this * [tx, ty, 1] = tx*col0 + ty*col1 + col2
  this.m02 = this.m00 * translateX + this.m01 * translateY + this.m02;
  this.m12 = this.m10 * translateX + this.m11 * translateY + this.m12;
  this.m22 = this.m20 * translateX + this.m21 * translateY + this.m22;
  return this;
};

/**
 * Post-multiply by a rotation (affine) in place.
 */
Mat3Base.prototype.rotate = function (angle: number): any {
  const c = Math.cos(angle);
  const s = Math.sin(angle);

  const c00 = this.m00;
  const c10 = this.m10;
  const c20 = this.m20;

  const c01 = this.m01;
  const c11 = this.m11;
  const c21 = this.m21;

  this.m00 = c * c00 + s * c01;
  this.m10 = c * c10 + s * c11;
  this.m20 = c * c20 + s * c21;

  this.m01 = -s * c00 + c * c01;
  this.m11 = -s * c10 + c * c11;
  this.m21 = -s * c20 + c * c21;

  return this;
};

/**
 * Post-multiply by a rotation using cos/sin, in place.
 */
Mat3Base.prototype.rotateCS = function (cosAngle: number, sinAngle: number): any {
  const c00 = this.m00;
  const c10 = this.m10;
  const c20 = this.m20;

  const c01 = this.m01;
  const c11 = this.m11;
  const c21 = this.m21;

  this.m00 = cosAngle * c00 + sinAngle * c01;
  this.m10 = cosAngle * c10 + sinAngle * c11;
  this.m20 = cosAngle * c20 + sinAngle * c21;

  this.m01 = -sinAngle * c00 + cosAngle * c01;
  this.m11 = -sinAngle * c10 + cosAngle * c11;
  this.m21 = -sinAngle * c20 + cosAngle * c21;

  return this;
};

/**
 * Post-multiply by a scale (affine) in place.
 */
Mat3Base.prototype.scale = function (scaleX: number, scaleY: number): any {
  this.m00 *= scaleX;
  this.m10 *= scaleX;
  this.m20 *= scaleX;

  this.m01 *= scaleY;
  this.m11 *= scaleY;
  this.m21 *= scaleY;

  return this;
};

/**
 * Post-multiply by a shear (affine) in place.
 */
Mat3Base.prototype.shear = function (shearX: number, shearY: number): any {
  const c00 = this.m00;
  const c10 = this.m10;
  const c20 = this.m20;

  const c01 = this.m01;
  const c11 = this.m11;
  const c21 = this.m21;

  this.m00 = c00 + shearY * c01;
  this.m10 = c10 + shearY * c11;
  this.m20 = c20 + shearY * c21;

  this.m01 = shearX * c00 + c01;
  this.m11 = shearX * c10 + c11;
  this.m21 = shearX * c20 + c21;

  return this;
};
