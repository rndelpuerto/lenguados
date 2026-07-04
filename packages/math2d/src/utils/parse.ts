/**
 * @file utils/parse.ts
 * @module @lenguados/math2d/utils
 * @description Parsing and formatting utilities for math2d types
 *
 * @remarks
 * Provides consistent string parsing for all math types, supporting
 * various formats commonly used in configuration files and data interchange.
 *
 * Design principles:
 * - Flexible input format acceptance
 * - Consistent error handling
 * - Support for both creation and in-place parsing (out parameter)
 *
 * All trigonometric operations use deterministic kernels for
 * cross-platform reproducibility.
 */

import { DEG_TO_RAD, RAD_TO_DEG } from '../auxiliary/scalar/constants';
import { Complex } from '../core/complex';
import { Interval } from '../core/interval';
import { Matrix2 } from '../core/matrix2';
import { Matrix3 } from '../core/matrix3';
import { Rotation2 } from '../core/rotation2';
import { Transform2 } from '../core/transform2';
import { Vector2 } from '../core/vector2';
import { atan2 } from '../deterministic/deterministic-kernels';
import type {
 ReadonlyComplexLike,
 ReadonlyIntervalLike,
 ReadonlyMatrix2Like,
 ReadonlyMatrix3Like,
 ReadonlyRotation2Like,
 ReadonlyTransform2Like,
 ReadonlyVector2Like,
} from '../types';

/**
 * Converts a fixed-precision number to a JSON-safe string
 * @param n - Number to convert
 * @param precision - Decimal precision for toFixed, or undefined for toString
 * @returns JSON-safe string representation
 * @internal
 */
function jsonFixed(n: number, precision: number | undefined): string {
 if (!Number.isFinite(n)) return 'null';
 return precision !== undefined ? n.toFixed(precision) : n.toString();
}

/* ========================================================================== */
/* Vector2 Parsing and Formatting                                             */
/* ========================================================================== */

/**
 * Parses a string representation of a 2D vector
 *
 * @remarks
 * Supported formats:
 * - "x,y" (comma-separated)
 * - "x y" (space-separated)
 * - "(x,y)" (with parentheses)
 * - "[x,y]" (with brackets)
 * - "{x:n, y:n}" (JSON-like)
 *
 * This function only handles finite numeric values. Non-finite values
 * (NaN, Infinity, -Infinity) serialized via format functions cannot
 * be round-tripped through parse functions.
 *
 * @param string_ - Input string to parse
 * @param out - Optional output vector to avoid allocation. Defaults to `new Vector2()`
 * @returns The `out` vector containing the parsed values
 * @throws {Error} If the string cannot be parsed
 *
 * @example
 * ```typescript
 * const v = parseVector2("(1, 2)");
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function parseVector2(string_: string, out = new Vector2()): Vector2 {
 // Trim whitespace
 const trimmed = string_.trim();

 // Fast structural check for JSON to avoid throwing exceptions (JIT de-optimization)
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
  if (/"x"\s*:/i.test(trimmed) && /"y"\s*:/i.test(trimmed)) {
   try {
    const object = JSON.parse(trimmed);
    if (typeof object.x === 'number' && typeof object.y === 'number') {
     return out.set(object.x, object.y);
    }
   } catch {
    // Malformed JSON falls through
   }
  }
 }

 // Remove parentheses or brackets if present
 const cleaned = trimmed.replace(/^[([{]|[)\]}]$/g, '');

 // Split by comma or space
 const parts = cleaned.split(/[,\s]+/).filter((p) => p.length > 0);

 if (parts.length !== 2) {
  throw new Error(`parseVector2: expected 2 components, got ${parts.length} in "${string_}"`);
 }

 const x = parseFloat(parts[0]!);
 const y = parseFloat(parts[1]!);

 if (isNaN(x) || isNaN(y)) {
  throw new Error(`parseVector2: invalid numbers in "${string_}"`);
 }

 return out.set(x, y);
}

/**
 * Formats a 2D vector as a string
 *
 * @remarks
 * Supported formats: 'csv', 'space', 'json', 'brackets'.
 *
 * @param v - Vector to format
 * @param format - Output format. Defaults to `'csv'`
 * @param precision - Number of decimal places. Defaults to full precision
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * const text = formatVector2(new Vector2(1, 2), 'brackets');
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function formatVector2(
 v: ReadonlyVector2Like,
 format: 'csv' | 'space' | 'json' | 'brackets' = 'csv',
 precision?: number,
): string {
 const x = precision !== undefined ? v.x.toFixed(precision) : v.x.toString();
 const y = precision !== undefined ? v.y.toFixed(precision) : v.y.toString();

 switch (format) {
  case 'csv':
   return `${x},${y}`;
  case 'space':
   return `${x} ${y}`;
  case 'json': {
   const jx = jsonFixed(v.x, precision);
   const jy = jsonFixed(v.y, precision);
   return `{"x":${jx},"y":${jy}}`;
  }
  case 'brackets':
   return `[${x},${y}]`;
 }
}

/* ========================================================================== */
/* Rotation2 Parsing and Formatting                                           */
/* ========================================================================== */

/**
 * Parses a string representation of a 2D rotation
 *
 * @remarks
 * Supported formats:
 * - "angle" (single number in radians)
 * - "90deg" (with degree suffix)
 * - "c,s" (cosine,sine components)
 * - "{c:n, s:n}" (JSON-like)
 * - "{cos:n, sin:n}" (JSON-like)
 *
 * @param string_ - Input string to parse
 * @param out - Optional output rotation to avoid allocation. Defaults to `new Rotation2()`
 * @returns The `out` rotation containing the parsed values
 * @throws {Error} If the string cannot be parsed
 *
 * @example
 * ```typescript
 * const r = parseRotation2("90deg");
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function parseRotation2(string_: string, out = new Rotation2()): Rotation2 {
 const trimmed = string_.trim();

 // Fast structural check for JSON to avoid throwing exceptions (JIT de-optimization)
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
  if (/"(cos|c)"\s*:/i.test(trimmed) && /"(sin|s)"\s*:/i.test(trimmed)) {
   try {
    const object = JSON.parse(trimmed);
    if (typeof object.cos === 'number' && typeof object.sin === 'number') {
     return out.set(object.cos, object.sin);
    }
    // Legacy format support
    if (typeof object.c === 'number' && typeof object.s === 'number') {
     return out.set(object.c, object.s);
    }
   } catch {
    // Malformed JSON falls through
   }
  }
 }

 // Check for degree suffix
 if (trimmed.endsWith('deg')) {
  const degrees = parseFloat(trimmed.slice(0, -3));
  if (!isNaN(degrees)) {
   return Rotation2.fromAngle(degrees * DEG_TO_RAD, out);
  }
 }

 // Try comma-separated c,s
 if (trimmed.includes(',')) {
  const parts = trimmed.split(',').map((s) => s.trim());
  if (parts.length === 2) {
   const c = parseFloat(parts[0]!);
   const s = parseFloat(parts[1]!);
   if (!isNaN(c) && !isNaN(s)) {
    return out.set(c, s);
   }
  }
 }

 // Try as single angle in radians
 const angle = parseFloat(trimmed);
 if (!isNaN(angle)) {
  return Rotation2.fromAngle(angle, out);
 }

 throw new Error(`parseRotation2: cannot parse rotation from "${string_}"`);
}

/**
 * Formats a 2D rotation as a string
 *
 * @remarks
 * Supported formats: 'radians', 'degrees', 'components', 'json'.
 *
 * @param r - Rotation to format
 * @param format - Output format. Defaults to `'radians'`
 * @param precision - Number of decimal places. Defaults to full precision
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * const text = formatRotation2(Rotation2.fromAngle(Math.PI / 2), 'degrees');
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function formatRotation2(
 r: ReadonlyRotation2Like,
 format: 'radians' | 'degrees' | 'components' | 'json' = 'radians',
 precision?: number,
): string {
 switch (format) {
  case 'radians': {
   const angle = atan2(r.sin, r.cos);
   return precision !== undefined ? angle.toFixed(precision) : angle.toString();
  }
  case 'degrees': {
   const angle = atan2(r.sin, r.cos) * RAD_TO_DEG;
   const string_ = precision !== undefined ? angle.toFixed(precision) : angle.toString();
   return `${string_}deg`;
  }
  case 'components': {
   const cos = precision !== undefined ? r.cos.toFixed(precision) : r.cos.toString();
   const sin = precision !== undefined ? r.sin.toFixed(precision) : r.sin.toString();
   return `${cos},${sin}`;
  }
  case 'json': {
   const jcos = jsonFixed(r.cos, precision);
   const jsin = jsonFixed(r.sin, precision);
   return `{"cos":${jcos},"sin":${jsin}}`;
  }
 }
}

/* ========================================================================== */
/* Matrix2 Parsing and Formatting                                             */
/* ========================================================================== */

/**
 * Parses a string representation of a 2x2 matrix
 *
 * @remarks
 * Supported formats:
 * - "m00,m01,m10,m11" (row-major, comma-separated)
 * - "m00 m01 m10 m11" (row-major, space-separated)
 * - "[[m00,m01],[m10,m11]]" (nested arrays)
 * - JSON format
 *
 * @param string_ - Input string to parse
 * @param out - Optional output matrix to avoid allocation. Defaults to `new Matrix2()`
 * @returns The `out` matrix containing the parsed values
 * @throws {Error} If the string cannot be parsed
 *
 * @example
 * ```typescript
 * const m = parseMatrix2("1,0,0,1");
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function parseMatrix2(string_: string, out = new Matrix2()): Matrix2 {
 const trimmed = string_.trim();

 // Fast structural check for JSON to avoid throwing exceptions (JIT de-optimization)
 if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
  if (/^\[\s*\[/.test(trimmed) || /"m00"\s*:/.test(trimmed)) {
   try {
    const parsed = JSON.parse(trimmed);

    // Handle nested arrays
    if (Array.isArray(parsed) && parsed.length === 2) {
     const [row0, row1] = parsed;
     if (Array.isArray(row0) && row0.length === 2 && Array.isArray(row1) && row1.length === 2) {
      // Per-cell numeric guard (rejects `[[1, "x"], [3, 4]]`).
      const cells = [row0[0], row0[1], row1[0], row1[1]];
      if (cells.every((c) => typeof c === 'number')) {
       return out.set(row0[0], row0[1], row1[0], row1[1]);
      }
     }
    }

    // Handle object format
    if (parsed && typeof parsed === 'object') {
     const values = [parsed.m00, parsed.m01, parsed.m10, parsed.m11];
     if (values.every((v) => typeof v === 'number')) {
      return out.set(...(values as [number, number, number, number]));
     }
    }
   } catch {
    // Malformed JSON falls through
   }
  }
 }

 // Parse comma or space separated values
 const values = trimmed
  .replace(/[[\]{}]/g, '') // Remove brackets
  .split(/[,\s]+/)
  .filter((s) => s.length > 0)
  .map(parseFloat);

 if (values.length !== 4 || values.some(isNaN)) {
  throw new Error(`parseMatrix2: expected 4 values, got ${values.length} in "${string_}"`);
 }

 return out.set(...(values as [number, number, number, number]));
}

/**
 * Formats a 2x2 matrix as a string
 *
 * @remarks
 * Supported formats: 'flat', 'nested', 'json'.
 *
 * @param m - Matrix to format
 * @param format - Output format. Defaults to `'flat'`
 * @param precision - Number of decimal places. Defaults to full precision
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * const text = formatMatrix2(parseMatrix2("1,0,0,1"), 'json');
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function formatMatrix2(
 m: ReadonlyMatrix2Like,
 format: 'flat' | 'nested' | 'json' = 'flat',
 precision?: number,
): string {
 const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());

 switch (format) {
  case 'flat':
   return `${fmt(m.m00)},${fmt(m.m01)},${fmt(m.m10)},${fmt(m.m11)}`;
  case 'nested':
   return `[[${fmt(m.m00)},${fmt(m.m01)}],[${fmt(m.m10)},${fmt(m.m11)}]]`;
  case 'json':
   return JSON.stringify({
    m00: parseFloat(fmt(m.m00)),
    m01: parseFloat(fmt(m.m01)),
    m10: parseFloat(fmt(m.m10)),
    m11: parseFloat(fmt(m.m11)),
   });
 }
}

/* ========================================================================== */
/* Matrix3 Parsing and Formatting                                             */
/* ========================================================================== */

/**
 * Parses a string representation of a 3x3 matrix
 *
 * @remarks
 * Supported formats:
 * - "m00,m01,m02,m10,m11,m12,m20,m21,m22" (row-major, comma-separated)
 * - "m00 m01 m02 m10 m11 m12 m20 m21 m22" (row-major, space-separated)
 * - "[[m00,m01,m02],[m10,m11,m12],[m20,m21,m22]]" (nested arrays)
 * - JSON format
 *
 * @param string_ - Input string to parse
 * @param out - Optional output matrix to avoid allocation. Defaults to `new Matrix3()`
 * @returns The `out` matrix containing the parsed values
 * @throws {Error} If the string cannot be parsed
 *
 * @example
 * ```typescript
 * const m = parseMatrix3("1,0,0,0,1,0,0,0,1");
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function parseMatrix3(string_: string, out = new Matrix3()): Matrix3 {
 const trimmed = string_.trim();

 // Fast structural check for JSON to avoid throwing exceptions (JIT de-optimization)
 if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
  if (/^\[\s*\[/.test(trimmed) || /"m00"\s*:/.test(trimmed)) {
   try {
    const parsed = JSON.parse(trimmed);

    // Handle nested arrays
    if (Array.isArray(parsed) && parsed.length === 3) {
     const values: number[] = [];
     for (const row of parsed) {
      if (Array.isArray(row) && row.length === 3) {
       // Per-cell numeric guard (rejects non-numeric cells).
       if (!row.every((c) => typeof c === 'number')) {
        throw new Error('Non-numeric cell');
       }
       values.push(...row);
      } else {
       throw new Error('Invalid row');
      }
     }
     if (values.length === 9) {
      return out.set(
       ...(values as [number, number, number, number, number, number, number, number, number]),
      );
     }
    }

    // Handle object format
    if (parsed && typeof parsed === 'object') {
     const values = [
      parsed.m00,
      parsed.m01,
      parsed.m02,
      parsed.m10,
      parsed.m11,
      parsed.m12,
      parsed.m20,
      parsed.m21,
      parsed.m22,
     ];
     if (values.every((v) => typeof v === 'number')) {
      return out.set(
       ...(values as [number, number, number, number, number, number, number, number, number]),
      );
     }
    }
   } catch {
    // Malformed JSON falls through
   }
  }
 }

 // Parse comma or space separated values
 const values = trimmed
  .replace(/[[\]{}]/g, '') // Remove brackets
  .split(/[,\s]+/)
  .filter((s) => s.length > 0)
  .map(parseFloat);

 if (values.length !== 9 || values.some(isNaN)) {
  throw new Error(`parseMatrix3: expected 9 values, got ${values.length} in "${string_}"`);
 }

 return out.set(
  ...(values as [number, number, number, number, number, number, number, number, number]),
 );
}

/**
 * Formats a 3x3 matrix as a string
 *
 * @remarks
 * Supported formats: 'flat', 'nested', 'json'.
 *
 * @param m - Matrix to format
 * @param format - Output format. Defaults to `'flat'`
 * @param precision - Number of decimal places. Defaults to full precision
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * const text = formatMatrix3(parseMatrix3("1,0,0,0,1,0,0,0,1"));
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function formatMatrix3(
 m: ReadonlyMatrix3Like,
 format: 'flat' | 'nested' | 'json' = 'flat',
 precision?: number,
): string {
 const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());

 switch (format) {
  case 'flat':
   return [m.m00, m.m01, m.m02, m.m10, m.m11, m.m12, m.m20, m.m21, m.m22].map(fmt).join(',');
  case 'nested':
   return `[${[
    `[${fmt(m.m00)},${fmt(m.m01)},${fmt(m.m02)}]`,
    `[${fmt(m.m10)},${fmt(m.m11)},${fmt(m.m12)}]`,
    `[${fmt(m.m20)},${fmt(m.m21)},${fmt(m.m22)}]`,
   ].join(',')}]`;
  case 'json': {
   const object: Record<string, number> = {};
   const values = [m.m00, m.m01, m.m02, m.m10, m.m11, m.m12, m.m20, m.m21, m.m22];
   let index = 0;
   for (let row = 0; row < 3; row++) {
    for (let col = 0; col < 3; col++) {
     const key = `m${row}${col}`;
     object[key] = parseFloat(fmt(values[index]!));
     index++;
    }
   }
   return JSON.stringify(object);
  }
 }
}

/* ========================================================================== */
/* Transform2 Parsing and Formatting                                          */
/* ========================================================================== */

/**
 * Parses a string representation of a 2D transform
 *
 * @remarks
 * Supported formats:
 * - "px,py,c,s" (position x,y and rotation cos,sin)
 * - "px,py,c,s,sx,sy" (6-value form with scale sx,sy appended)
 * - "px py c s" (space-separated, 4 or 6 values)
 * - JSON format with `p` and `r` properties (optional `s` for scale)
 *
 * When scale is omitted (4-value form, or JSON without `s`), it defaults to (1, 1).
 *
 * @param string_ - Input string to parse
 * @param out - Optional output transform to avoid allocation. Defaults to `new Transform2()`
 * @returns The `out` transform containing the parsed values
 * @throws {Error} If the string cannot be parsed
 *
 * @example
 * ```typescript
 * const t = parseTransform2("0,0,1,0");
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function parseTransform2(string_: string, out = new Transform2()): Transform2 {
 const trimmed = string_.trim();

 // Fast structural check for JSON to avoid throwing exceptions (JIT de-optimization)
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
  if (/"p"\s*:/i.test(trimmed) && /"r"\s*:/i.test(trimmed)) {
   try {
    const object = JSON.parse(trimmed);
    if (object.p && object.r) {
     // New format with cos/sin
     if (
      typeof object.p.x === 'number' &&
      typeof object.p.y === 'number' &&
      typeof object.r.cos === 'number' &&
      typeof object.r.sin === 'number'
     ) {
      out.position.set(object.p.x, object.p.y);
      // `.set()` enforces unit-length normalization on the rotation components.
      out.rotation.set(object.r.cos, object.r.sin);
      // Extract scale if present, default to (1,1)
      if (object.s && typeof object.s.x === 'number' && typeof object.s.y === 'number') {
       out.scale.set(object.s.x, object.s.y);
      } else {
       out.scale.set(1, 1);
      }
      return out;
     }
     // Legacy format with c/s
     if (
      typeof object.p.x === 'number' &&
      typeof object.p.y === 'number' &&
      typeof object.r.c === 'number' &&
      typeof object.r.s === 'number'
     ) {
      out.position.set(object.p.x, object.p.y);
      // `.set()` enforces unit-length normalization on the rotation components.
      out.rotation.set(object.r.c, object.r.s);
      if (object.s && typeof object.s.x === 'number' && typeof object.s.y === 'number') {
       out.scale.set(object.s.x, object.s.y);
      } else {
       out.scale.set(1, 1);
      }
      return out;
     }
    }
   } catch {
    // Malformed JSON falls through
   }
  }
 }

 // Parse comma or space separated values
 const values = trimmed
  .split(/[,\s]+/)
  .filter((s) => s.length > 0)
  .map(parseFloat);

 if ((values.length !== 4 && values.length !== 6) || values.some(isNaN)) {
  throw new Error(`parseTransform2: expected 4 or 6 values, got ${values.length} in "${string_}"`);
 }

 // `.set()` enforces unit-length normalization on the rotation components.
 out.position.set(values[0]!, values[1]!);
 out.rotation.set(values[2]!, values[3]!);

 // 6-component format includes scale
 if (values.length === 6) {
  out.scale.set(values[4]!, values[5]!);
 } else {
  out.scale.set(1, 1);
 }

 return out;
}

/**
 * Formats a 2D transform as a string
 *
 * @remarks
 * Supported formats: 'flat', 'json'.
 *
 * @param t - Transform to format
 * @param format - Output format. Defaults to `'flat'`
 * @param precision - Number of decimal places. Defaults to full precision
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * const text = formatTransform2(parseTransform2("0,0,1,0"), 'json');
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function formatTransform2(
 t: ReadonlyTransform2Like,
 format: 'flat' | 'json' = 'flat',
 precision?: number,
): string {
 const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());
 const cosValue = t.rotation.cos;
 const sinValue = t.rotation.sin;

 switch (format) {
  case 'flat':
   return `${fmt(t.position.x)},${fmt(t.position.y)},${fmt(cosValue)},${fmt(sinValue)},${fmt(t.scale.x)},${fmt(t.scale.y)}`;
  case 'json':
   return JSON.stringify({
    p: { x: parseFloat(fmt(t.position.x)), y: parseFloat(fmt(t.position.y)) },
    r: { cos: parseFloat(fmt(cosValue)), sin: parseFloat(fmt(sinValue)) },
    s: { x: parseFloat(fmt(t.scale.x)), y: parseFloat(fmt(t.scale.y)) },
   });
 }
}

/* ========================================================================== */
/* Complex Parsing and Formatting                                              */
/* ========================================================================== */

/**
 * Parses a string representation of a complex number
 *
 * @remarks
 * Supported formats:
 * - "a+bi" or "a-bi" (standard mathematical notation)
 * - "bi" (pure imaginary, e.g. "4i" or "-2i")
 * - "a,b" (comma-separated real,imag)
 * - "(a,b)" (with parentheses)
 * - "{real:a, imag:b}" (JSON-like)
 *
 * Note: bracket stripping accepts mismatched brackets (e.g., "(1,2]").
 *
 * @param string_ - Input string to parse
 * @param out - Optional output complex to avoid allocation. Defaults to `new Complex()`
 * @returns The `out` complex containing the parsed values
 * @throws {Error} If the string cannot be parsed
 *
 * @example
 * ```typescript
 * const c1 = parseComplex("3+4i");     // 3 + 4i
 * const c2 = parseComplex("3,-4");     // 3 - 4i
 * const c3 = parseComplex("{\"real\":1,\"imag\":0}"); // 1 + 0i
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function parseComplex(string_: string, out = new Complex()): Complex {
 const trimmed = string_.trim();

 // Fast structural check for JSON to avoid throwing exceptions (JIT de-optimization)
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
  if (/"real"\s*:/i.test(trimmed) && /"imag"\s*:/i.test(trimmed)) {
   try {
    const object = JSON.parse(trimmed);
    if (typeof object.real === 'number' && typeof object.imag === 'number') {
     return out.set(object.real, object.imag);
    }
   } catch {
    // Malformed JSON falls through
   }
  }
 }

 // Try mathematical notation: a+bi, a-bi
 const mathMatch = trimmed.match(
  /^([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)\s*([+-])\s*(\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)i$/,
 );
 if (mathMatch) {
  const real = parseFloat(mathMatch[1]!);
  const sign = mathMatch[2] === '-' ? -1 : 1;
  const imag = sign * parseFloat(mathMatch[3]!);
  if (!isNaN(real) && !isNaN(imag)) {
   return out.set(real, imag);
  }
 }

 // Try pure imaginary: bi, +bi, -bi
 const pureImagMatch = trimmed.match(/^([+-]?\d+(?:\.\d+)?(?:[eE][+-]?\d+)?)i$/);
 if (pureImagMatch) {
  const imag = parseFloat(pureImagMatch[1]!);
  if (!isNaN(imag)) {
   return out.set(0, imag);
  }
 }

 // Remove parentheses/brackets
 const cleaned = trimmed.replace(/^[([{]|[)\]}]$/g, '');

 // Split by comma or space
 const parts = cleaned.split(/[,\s]+/).filter((p) => p.length > 0);

 if (parts.length !== 2) {
  throw new Error(`parseComplex: expected 2 components, got ${parts.length} in "${string_}"`);
 }

 const real = parseFloat(parts[0]!);
 const imag = parseFloat(parts[1]!);

 if (isNaN(real) || isNaN(imag)) {
  throw new Error(`parseComplex: invalid numbers in "${string_}"`);
 }

 return out.set(real, imag);
}

/**
 * Formats a complex number as a string
 *
 * @remarks
 * Supported formats:
 * - 'math': "a+bi" or "a-bi" (standard mathematical notation)
 * - 'csv': "a,b" (comma-separated)
 * - 'json': '{"real":a,"imag":b}'
 *
 * @param c - Complex number to format
 * @param format - Output format. Defaults to `'math'`
 * @param precision - Number of decimal places. Defaults to full precision
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatComplex(new Complex(3, 4), 'math');   // "3+4i"
 * formatComplex(new Complex(3, -4), 'math');  // "3-4i"
 * formatComplex(new Complex(3, 4), 'csv');    // "3,4"
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function formatComplex(
 c: ReadonlyComplexLike,
 format: 'math' | 'csv' | 'json' = 'math',
 precision?: number,
): string {
 const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());
 const real = fmt(c.real);
 const imag = fmt(c.imag);

 switch (format) {
  case 'math': {
   // Preserve `-0` sign while still applying the caller's precision to the
   // literal (e.g. `formatComplex({real: 3, imag: -0}, 'math', 2)` → "3-0.00i").
   if (Object.is(c.imag, -0)) {
    const zeroLiteral = precision !== undefined ? (-0).toFixed(precision) : '0';
    return `${real}-${zeroLiteral}i`;
   }
   return c.imag >= 0 ? `${real}+${imag}i` : `${real}${imag}i`;
  }
  case 'csv':
   return `${real},${imag}`;
  case 'json': {
   const jr = jsonFixed(c.real, precision);
   const ji = jsonFixed(c.imag, precision);
   return `{"real":${jr},"imag":${ji}}`;
  }
 }
}

/* ========================================================================== */
/* Interval Parsing and Formatting                                             */
/* ========================================================================== */

/**
 * Parses a string representation of an interval
 *
 * @remarks
 * Supported formats:
 * - "[a,b]" (standard interval notation)
 * - "(a,b)" (open interval notation, but creates closed)
 * - "a,b" (comma-separated)
 * - "{min:a, max:b}" (JSON-like)
 *
 * @param string_ - Input string to parse
 * @param out - Optional output interval to avoid allocation. Defaults to `new Interval()`
 * @returns The `out` interval containing the parsed values
 * @throws {Error} If the string cannot be parsed, or if `min` exceeds `max`
 *
 * @example
 * ```typescript
 * const i1 = parseInterval("[0,1]");    // [0, 1]
 * const i2 = parseInterval("-5,5");     // [-5, 5]
 * const i3 = parseInterval("{\"min\":0,\"max\":100}"); // [0, 100]
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function parseInterval(string_: string, out = new Interval()): Interval {
 const trimmed = string_.trim();

 // Try JSON format first
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
  try {
   const object = JSON.parse(trimmed);
   if (typeof object.min === 'number' && typeof object.max === 'number') {
    if (object.min > object.max) {
     throw new Error(`parseInterval: min (${object.min}) must not exceed max (${object.max})`);
    }
    return out.set(object.min, object.max);
   }
  } catch (error) {
   // Re-throw validation errors, swallow only SyntaxError from JSON.parse
   if (!(error instanceof SyntaxError)) throw error;
  }
 }

 // Remove brackets/parentheses
 const cleaned = trimmed.replace(/^[([{]|[)\]}]$/g, '');

 // Split by comma or space
 const parts = cleaned.split(/[,\s]+/).filter((p) => p.length > 0);

 if (parts.length !== 2) {
  throw new Error(`parseInterval: expected 2 values, got ${parts.length} in "${string_}"`);
 }

 const min = parseFloat(parts[0]!);
 const max = parseFloat(parts[1]!);

 if (isNaN(min) || isNaN(max)) {
  throw new Error(`parseInterval: invalid numbers in "${string_}"`);
 }

 if (min > max) {
  throw new Error(`parseInterval: min (${min}) must not exceed max (${max})`);
 }

 return out.set(min, max);
}

/**
 * Formats an interval as a string
 *
 * @remarks
 * Supported formats:
 * - 'brackets': "[a,b]" (standard interval notation)
 * - 'csv': "a,b" (comma-separated)
 * - 'json': '{"min":a,"max":b}'
 *
 * @param interval - Interval to format
 * @param format - Output format. Defaults to `'brackets'`
 * @param precision - Number of decimal places. Defaults to full precision
 * @returns Formatted string
 *
 * @example
 * ```typescript
 * formatInterval(new Interval(0, 1), 'brackets');  // "[0,1]"
 * formatInterval(new Interval(-5, 5), 'csv');      // "-5,5"
 * ```
 *
 * @category Conversion
 * @since 0.7.0
 */
export function formatInterval(
 interval: ReadonlyIntervalLike,
 format: 'brackets' | 'csv' | 'json' = 'brackets',
 precision?: number,
): string {
 const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());
 const min = fmt(interval.min);
 const max = fmt(interval.max);

 switch (format) {
  case 'brackets':
   return `[${min},${max}]`;
  case 'csv':
   return `${min},${max}`;
  case 'json': {
   const jmin = jsonFixed(interval.min, precision);
   const jmax = jsonFixed(interval.max, precision);
   return `{"min":${jmin},"max":${jmax}}`;
  }
 }
}
