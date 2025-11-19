/**
 * @file src/mat3/instance/conversion.ts
 * @module math2d/mat3/instance/conversion
 * @description Conversion and serialization methods for Mat3.
 */

import { Mat3Base } from '../base';
import type { Mat3Like } from '../helpers';

declare module '../base' {
  interface Mat3Base {
    /**
     * Convert to array in row-major order.
     * 
     * @param out - Target array (optional).
     * @param offset - Starting index. @defaultValue 0
     * @returns Array containing `[m00, m01, m02, m10, m11, m12, m20, m21, m22]`.
     */
    toArray(out?: number[], offset?: number): number[];

    /**
     * Convert to Float32Array in row-major order.
     * 
     * @param out - Target array (optional).
     * @param offset - Starting index. @defaultValue 0
     * @returns Float32Array containing matrix components.
     */
    toFloat32Array(out?: Float32Array, offset?: number): Float32Array;

    /**
     * Convert to plain object.
     * 
     * @returns Object with m00..m22 properties.
     */
    toObject(): Mat3Like;

    /**
     * Serialize to JSON-compatible object.
     * 
     * @returns Object suitable for JSON serialization.
     */
    toJSON(): Mat3Like;

    /**
     * Convert to string representation.
     * 
     * @param precision - Number of decimal places (optional).
     * @returns String representation like "Mat3(1, 0, 0, 0, 1, 0, 0, 0, 1)".
     */
    toString(precision?: number): string;

    /**
     * Format as string with fixed decimal places.
     * 
     * @param fractionDigits - Number of decimal places.
     * @returns Formatted string.
     */
    toFixed(fractionDigits: number): string;

    /**
     * Format as string in exponential notation.
     * 
     * @param fractionDigits - Number of decimal places.
     * @returns Formatted string.
     */
    toExponential(fractionDigits: number): string;

    /**
     * Format as string with specified precision.
     * 
     * @param precision - Number of significant digits.
     * @returns Formatted string.
     */
    toPrecision(precision: number): string;

    /**
     * Format as a multi-line string.
     * 
     * @param precision - Number of decimal places (optional).
     * @returns Multi-line string with matrix rows.
     * 
     * @example
     * ```ts
     * const m = Mat3.identity();
     * console.log(m.format(2));
     * // [1.00, 0.00, 0.00]
     * // [0.00, 1.00, 0.00]
     * // [0.00, 0.00, 1.00]
     * ```
     */
    format(precision?: number): string;

    /**
     * Make the matrix iterable (yields components in row-major order).
     * 
     * @yields Matrix components in order: m00, m01, m02, m10, m11, m12, m20, m21, m22.
     * 
     * @example
     * ```ts
     * const m = Mat3.identity();
     * const components = [...m]; // [1, 0, 0, 0, 1, 0, 0, 0, 1]
     * ```
     */
    [Symbol.iterator](): IterableIterator<number>;
  }
}

/**
 * Convert to array in row-major order.
 */
Mat3Base.prototype.toArray = function (
  out: number[] = [],
  offset: number = 0
): number[] {
  out[offset + 0] = this.m00;
  out[offset + 1] = this.m01;
  out[offset + 2] = this.m02;
  out[offset + 3] = this.m10;
  out[offset + 4] = this.m11;
  out[offset + 5] = this.m12;
  out[offset + 6] = this.m20;
  out[offset + 7] = this.m21;
  out[offset + 8] = this.m22;
  return out;
};

/**
 * Convert to Float32Array in row-major order.
 */
Mat3Base.prototype.toFloat32Array = function (
  out?: Float32Array,
  offset: number = 0
): Float32Array {
  if (!out) {
    out = new Float32Array(9);
    offset = 0;
  }
  out[offset + 0] = this.m00;
  out[offset + 1] = this.m01;
  out[offset + 2] = this.m02;
  out[offset + 3] = this.m10;
  out[offset + 4] = this.m11;
  out[offset + 5] = this.m12;
  out[offset + 6] = this.m20;
  out[offset + 7] = this.m21;
  out[offset + 8] = this.m22;
  return out;
};

/**
 * Convert to plain object.
 */
Mat3Base.prototype.toObject = function (): Mat3Like {
  return {
    m00: this.m00,
    m01: this.m01,
    m02: this.m02,
    m10: this.m10,
    m11: this.m11,
    m12: this.m12,
    m20: this.m20,
    m21: this.m21,
    m22: this.m22,
  };
};

/**
 * Serialize to JSON-compatible object.
 */
Mat3Base.prototype.toJSON = function (): Mat3Like {
  return this.toObject();
};

/**
 * Convert to string representation.
 */
Mat3Base.prototype.toString = function (precision?: number): string {
  if (precision !== undefined) {
    return `Mat3(${this.m00.toFixed(precision)}, ${this.m01.toFixed(
      precision
    )}, ${this.m02.toFixed(precision)}, ${this.m10.toFixed(
      precision
    )}, ${this.m11.toFixed(precision)}, ${this.m12.toFixed(
      precision
    )}, ${this.m20.toFixed(precision)}, ${this.m21.toFixed(
      precision
    )}, ${this.m22.toFixed(precision)})`;
  }
  return `Mat3(${this.m00}, ${this.m01}, ${this.m02}, ${this.m10}, ${this.m11}, ${this.m12}, ${this.m20}, ${this.m21}, ${this.m22})`;
};

/**
 * Format as string with fixed decimal places.
 */
Mat3Base.prototype.toFixed = function (fractionDigits: number): string {
  return `Mat3(${this.m00.toFixed(fractionDigits)}, ${this.m01.toFixed(
    fractionDigits
  )}, ${this.m02.toFixed(fractionDigits)}, ${this.m10.toFixed(
    fractionDigits
  )}, ${this.m11.toFixed(fractionDigits)}, ${this.m12.toFixed(
    fractionDigits
  )}, ${this.m20.toFixed(fractionDigits)}, ${this.m21.toFixed(
    fractionDigits
  )}, ${this.m22.toFixed(fractionDigits)})`;
};

/**
 * Format as string in exponential notation.
 */
Mat3Base.prototype.toExponential = function (fractionDigits: number): string {
  return `Mat3(${this.m00.toExponential(fractionDigits)}, ${this.m01.toExponential(
    fractionDigits
  )}, ${this.m02.toExponential(fractionDigits)}, ${this.m10.toExponential(
    fractionDigits
  )}, ${this.m11.toExponential(fractionDigits)}, ${this.m12.toExponential(
    fractionDigits
  )}, ${this.m20.toExponential(fractionDigits)}, ${this.m21.toExponential(
    fractionDigits
  )}, ${this.m22.toExponential(fractionDigits)})`;
};

/**
 * Format as string with specified precision.
 */
Mat3Base.prototype.toPrecision = function (precision: number): string {
  return `Mat3(${this.m00.toPrecision(precision)}, ${this.m01.toPrecision(
    precision
  )}, ${this.m02.toPrecision(precision)}, ${this.m10.toPrecision(
    precision
  )}, ${this.m11.toPrecision(precision)}, ${this.m12.toPrecision(
    precision
  )}, ${this.m20.toPrecision(precision)}, ${this.m21.toPrecision(
    precision
  )}, ${this.m22.toPrecision(precision)})`;
};

/**
 * Format as a multi-line string.
 */
Mat3Base.prototype.format = function (precision?: number): string {
  const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());
  
  // Find max width for alignment
  const components = [
    this.m00, this.m01, this.m02,
    this.m10, this.m11, this.m12,
    this.m20, this.m21, this.m22
  ];
  const formatted = components.map(fmt);
  const maxWidth = Math.max(...formatted.map(s => s.length));
  
  // Pad for alignment
  const pad = (s: string) => s.padStart(maxWidth, ' ');
  
  return (
    `[${pad(fmt(this.m00))}, ${pad(fmt(this.m01))}, ${pad(fmt(this.m02))}]\n` +
    `[${pad(fmt(this.m10))}, ${pad(fmt(this.m11))}, ${pad(fmt(this.m12))}]\n` +
    `[${pad(fmt(this.m20))}, ${pad(fmt(this.m21))}, ${pad(fmt(this.m22))}]`
  );
};

/**
 * Make the matrix iterable.
 */
Mat3Base.prototype[Symbol.iterator] = function* (): IterableIterator<number> {
  yield this.m00;
  yield this.m01;
  yield this.m02;
  yield this.m10;
  yield this.m11;
  yield this.m12;
  yield this.m20;
  yield this.m21;
  yield this.m22;
};
