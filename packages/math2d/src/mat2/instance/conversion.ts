/**
 * @file src/mat2/instance/conversion.ts
 * @module math2d/mat2/instance/conversion
 * @description Conversion and serialization methods for Mat2.
 */

import { Mat2Base } from '../base';
import type { Mat2Like } from '../helpers';

declare module '../base' {
  interface Mat2Base {
    /**
     * Convert to a flat array in row-major order.
     * 
     * @param outArray - Target array (optional).
     * @param offset - Starting index. @defaultValue 0
     * @returns Array containing `[m00, m01, m10, m11]`.
     * 
     * @example
     * ```ts
     * const m = Mat2.fromValues(1, 2, 3, 4);
     * m.toArray(); // [1, 2, 3, 4]
     * ```
     */
    toArray(outArray?: number[], offset?: number): number[];

    /**
     * Convert to a Float32Array in row-major order.
     * 
     * @param outArray - Target array (optional).
     * @param offset - Starting index. @defaultValue 0
     * @returns Float32Array containing matrix components.
     */
    toFloat32Array(outArray?: Float32Array, offset?: number): Float32Array;

    /**
     * Convert to a plain object.
     * 
     * @returns Object with `m00, m01, m10, m11` properties.
     * 
     * @example
     * ```ts
     * const m = Mat2.fromValues(1, 2, 3, 4);
     * m.toObject(); // { m00: 1, m01: 2, m10: 3, m11: 4 }
     * ```
     */
    toObject(): Mat2Like;

    /**
     * Convert to JSON-serializable format.
     * 
     * @returns Object suitable for JSON.stringify.
     * 
     * @remarks
     * This method is automatically called by JSON.stringify.
     */
    toJSON(): Mat2Like;

    /**
     * Convert to string representation.
     * 
     * @returns String in format `"m00,m01,m10,m11"`.
     * 
     * @example
     * ```ts
     * const m = Mat2.identity();
     * m.toString(); // "1,0,0,1"
     * ```
     */
    toString(): string;

    /**
     * Convert to fixed-point string representation.
     * 
     * @param fractionDigits - Number of decimal places. @defaultValue 2
     * @returns String with fixed decimal places.
     * 
     * @example
     * ```ts
     * const m = Mat2.fromRotation(Math.PI / 4);
     * m.toFixed(3); // "0.707,-0.707,0.707,0.707"
     * ```
     */
    toFixed(fractionDigits?: number): string;

    /**
     * Convert to exponential notation string.
     * 
     * @param fractionDigits - Number of decimal places in mantissa.
     * @returns String in exponential notation.
     */
    toExponential(fractionDigits?: number): string;

    /**
     * Convert to string with specified precision.
     * 
     * @param precision - Number of significant digits.
     * @returns String with specified precision.
     */
    toPrecision(precision?: number): string;

    /**
     * Get a formatted multi-line string representation.
     * 
     * @param indent - Indentation string. @defaultValue "  "
     * @param precision - Number of decimal places. @defaultValue 2
     * @returns Formatted matrix string.
     * 
     * @example
     * ```ts
     * const m = Mat2.identity();
     * console.log(m.format());
     * // Mat2 [
     * //   1.00  0.00
     * //   0.00  1.00
     * // ]
     * ```
     */
    format(indent?: string, precision?: number): string;

    /**
     * Make the matrix iterable (for destructuring).
     * 
     * @yields Matrix components in row-major order.
     * 
     * @example
     * ```ts
     * const m = Mat2.fromValues(1, 2, 3, 4);
     * const [m00, m01, m10, m11] = [...m];
     * ```
     */
    [Symbol.iterator](): IterableIterator<number>;
  }
}

/**
 * Convert to a flat array in row-major order.
 */
Mat2Base.prototype.toArray = function (
  outArray: number[] = [],
  offset: number = 0
): number[] {
  outArray[offset] = this.m00;
  outArray[offset + 1] = this.m01;
  outArray[offset + 2] = this.m10;
  outArray[offset + 3] = this.m11;
  return outArray;
};

/**
 * Convert to a Float32Array in row-major order.
 */
Mat2Base.prototype.toFloat32Array = function (
  outArray?: Float32Array,
  offset: number = 0
): Float32Array {
  const result = outArray ?? new Float32Array(4);
  result[offset] = this.m00;
  result[offset + 1] = this.m01;
  result[offset + 2] = this.m10;
  result[offset + 3] = this.m11;
  return result;
};

/**
 * Convert to a plain object.
 */
Mat2Base.prototype.toObject = function (): Mat2Like {
  return {
    m00: this.m00,
    m01: this.m01,
    m10: this.m10,
    m11: this.m11,
  };
};

/**
 * Convert to JSON-serializable format.
 */
Mat2Base.prototype.toJSON = function (): Mat2Like {
  return this.toObject();
};

/**
 * Convert to string representation.
 */
Mat2Base.prototype.toString = function (): string {
  return `${this.m00},${this.m01},${this.m10},${this.m11}`;
};

/**
 * Convert to fixed-point string representation.
 */
Mat2Base.prototype.toFixed = function (fractionDigits: number = 2): string {
  return [
    this.m00.toFixed(fractionDigits),
    this.m01.toFixed(fractionDigits),
    this.m10.toFixed(fractionDigits),
    this.m11.toFixed(fractionDigits),
  ].join(',');
};

/**
 * Convert to exponential notation string.
 */
Mat2Base.prototype.toExponential = function (fractionDigits?: number): string {
  if (fractionDigits === undefined) {
    return [
      this.m00.toExponential(),
      this.m01.toExponential(),
      this.m10.toExponential(),
      this.m11.toExponential(),
    ].join(',');
  }
  
  return [
    this.m00.toExponential(fractionDigits),
    this.m01.toExponential(fractionDigits),
    this.m10.toExponential(fractionDigits),
    this.m11.toExponential(fractionDigits),
  ].join(',');
};

/**
 * Convert to string with specified precision.
 */
Mat2Base.prototype.toPrecision = function (precision?: number): string {
  if (precision === undefined) {
    return this.toString();
  }
  
  return [
    this.m00.toPrecision(precision),
    this.m01.toPrecision(precision),
    this.m10.toPrecision(precision),
    this.m11.toPrecision(precision),
  ].join(',');
};

/**
 * Get a formatted multi-line string representation.
 */
Mat2Base.prototype.format = function (indent: string = '  ', precision: number = 2): string {
  const m00 = this.m00.toFixed(precision).padStart(precision + 4);
  const m01 = this.m01.toFixed(precision).padStart(precision + 4);
  const m10 = this.m10.toFixed(precision).padStart(precision + 4);
  const m11 = this.m11.toFixed(precision).padStart(precision + 4);
  
  return [
    'Mat2 [',
    `${indent}${m00}${indent}${m01}`,
    `${indent}${m10}${indent}${m11}`,
    ']'
  ].join('\n');
};

/**
 * Make the matrix iterable.
 */
Mat2Base.prototype[Symbol.iterator] = function* (): IterableIterator<number> {
  yield this.m00;
  yield this.m01;
  yield this.m10;
  yield this.m11;
};
