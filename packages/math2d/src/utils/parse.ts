/**
 * @file src/utils/parse.ts
 * @module math2d/utils/parse
 * @description
 * Parsing and serialization utilities for mathematical types.
 *
 * Provides consistent string parsing for all math types, supporting
 * various formats commonly used in configuration files and data interchange.
 *
 * Design principles:
 * - Flexible input format acceptance
 * - Consistent error handling
 * - Support for both creation and in-place parsing (out parameter)
 *
 * @remarks
 * All trigonometric operations use {@link DeterministicMath} for
 * cross-platform reproducibility.
 *
 * @migration
 * **Planned Migration**: This module will be moved to `@lenguados/math2d-io`
 * in version 2.0. The I/O concern (string parsing/serialization) is outside
 * the core mathematical scope of this library.
 *
 * **What will change in v2.0:**
 * - Import path: `@lenguados/math2d-io` instead of `@lenguados/math2d`
 * - Additional formats: Binary serialization, CSV batch parsing
 * - Streaming support for large datasets
 *
 * **Migration path:**
 * ```typescript
 * // Before (v1.x)
 * import { parseVector2, formatVector2 } from '@lenguados/math2d';
 *
 * // After (v2.0)
 * import { parseVector2, formatVector2 } from '@lenguados/math2d-io';
 * ```
 */

import { DEG_TO_RAD, RAD_TO_DEG } from '../auxiliary/scalar/constants';
import { Matrix2, type ReadonlyMatrix2 } from '../core/matrix2';
import { Matrix3, type ReadonlyMatrix3 } from '../core/matrix3';
import { Rotation2, type ReadonlyRotation2 } from '../core/rotation2';
import { Transform2, type ReadonlyTransform2 } from '../core/transform2';
import { Vector2, type ReadonlyVector2 } from '../core/vector2';
import { DeterministicMath } from '../deterministic/deterministic-math';

/**
 * Parses a string representation of a 2D vector.
 *
 * Supported formats:
 * - "x,y" (comma-separated)
 * - "x y" (space-separated)
 * - "(x,y)" (with parentheses)
 * - "[x,y]" (with brackets)
 * - "\{x:n, y:n\}" (JSON-like)
 *
 * @param str - String to parse
 * @param out - Optional output vector (default: new Vector2)
 * @returns Parsed vector
 * @throws {Error} If the string cannot be parsed
 */
export function parseVector2(string_: string, out = new Vector2()): Vector2 {
 // Trim whitespace
 const trimmed = string_.trim();

 // Try JSON-like format first
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
  try {
   const object = JSON.parse(trimmed);
   if (typeof object.x === 'number' && typeof object.y === 'number') {
    return out.set(object.x, object.y);
   }
  } catch {
   // Fall through to other formats
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
 * Formats a 2D vector as a string.
 *
 * @param v - Vector to format
 * @param format - Output format: 'csv', 'space', 'json', 'brackets'
 * @param precision - Number of decimal places (default: full precision)
 * @returns Formatted string
 */
export function formatVector2(
 v: ReadonlyVector2,
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
  case 'json':
   return `{"x":${x},"y":${y}}`;
  case 'brackets':
   return `[${x},${y}]`;
 }
}

/**
 * Parses a string representation of a 2D rotation.
 *
 * Supported formats:
 * - "angle" (single number in radians)
 * - "90deg" (with degree suffix)
 * - "c,s" (cosine,sine components)
 * - "\{c:n, s:n\}" (JSON-like)
 *
 * @param str - String to parse
 * @param out - Optional output rotation (default: new Rotation2)
 * @returns Parsed rotation
 * @throws {Error} If the string cannot be parsed
 */
export function parseRotation2(string_: string, out = new Rotation2()): Rotation2 {
 const trimmed = string_.trim();

 // Try JSON format
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
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
   // Fall through
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
 * Formats a 2D rotation as a string.
 *
 * @param r - Rotation to format
 * @param format - Output format: 'radians', 'degrees', 'components', 'json'
 * @param precision - Number of decimal places
 * @returns Formatted string
 */
export function formatRotation2(
 r: ReadonlyRotation2,
 format: 'radians' | 'degrees' | 'components' | 'json' = 'radians',
 precision?: number,
): string {
 switch (format) {
  case 'radians': {
   const angle = DeterministicMath.atan2(r.sin, r.cos);
   return precision !== undefined ? angle.toFixed(precision) : angle.toString();
  }
  case 'degrees': {
   const angle = DeterministicMath.atan2(r.sin, r.cos) * RAD_TO_DEG;
   const string_ = precision !== undefined ? angle.toFixed(precision) : angle.toString();
   return `${string_}deg`;
  }
  case 'components': {
   const cos = precision !== undefined ? r.cos.toFixed(precision) : r.cos.toString();
   const sin = precision !== undefined ? r.sin.toFixed(precision) : r.sin.toString();
   return `${cos},${sin}`;
  }
  case 'json': {
   const cos = precision !== undefined ? r.cos.toFixed(precision) : r.cos.toString();
   const sin = precision !== undefined ? r.sin.toFixed(precision) : r.sin.toString();
   return `{"cos":${cos},"sin":${sin}}`;
  }
 }
}

/**
 * Parses a string representation of a 2x2 matrix.
 *
 * Supported formats:
 * - "m00,m01,m10,m11" (row-major, comma-separated)
 * - "m00 m01 m10 m11" (row-major, space-separated)
 * - "[[m00,m01],[m10,m11]]" (nested arrays)
 * - JSON format
 *
 * @param str - String to parse
 * @param out - Optional output matrix (default: new Matrix2)
 * @returns Parsed matrix
 * @throws {Error} If the string cannot be parsed
 */
export function parseMatrix2(string_: string, out = new Matrix2()): Matrix2 {
 const trimmed = string_.trim();

 // Try JSON format
 if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
  try {
   const parsed = JSON.parse(trimmed);

   // Handle nested arrays
   if (Array.isArray(parsed) && parsed.length === 2) {
    const [row0, row1] = parsed;
    if (Array.isArray(row0) && Array.isArray(row1)) {
     return out.set(row0[0], row0[1], row1[0], row1[1]);
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
   // Fall through
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
 * Formats a 2x2 matrix as a string.
 *
 * @param m - Matrix to format
 * @param format - Output format
 * @param precision - Number of decimal places
 * @returns Formatted string
 */
export function formatMatrix2(
 m: ReadonlyMatrix2,
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

/**
 * Parses a string representation of a 3x3 matrix.
 *
 * @param str - String to parse
 * @param out - Optional output matrix (default: new Matrix3)
 * @returns Parsed matrix
 * @throws {Error} If the string cannot be parsed
 */
export function parseMatrix3(string_: string, out = new Matrix3()): Matrix3 {
 const trimmed = string_.trim();

 // Try JSON format
 if (trimmed.startsWith('{') || trimmed.startsWith('[')) {
  try {
   const parsed = JSON.parse(trimmed);

   // Handle nested arrays
   if (Array.isArray(parsed) && parsed.length === 3) {
    const values: number[] = [];
    for (const row of parsed) {
     if (Array.isArray(row) && row.length === 3) {
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
   // Fall through
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
 * Formats a 3x3 matrix as a string.
 *
 * @param m - Matrix to format
 * @param format - Output format
 * @param precision - Number of decimal places
 * @returns Formatted string
 */
export function formatMatrix3(
 m: ReadonlyMatrix3,
 format: 'flat' | 'nested' | 'json' = 'flat',
 precision?: number,
): string {
 const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());

 switch (format) {
  case 'flat':
   return [m.m00, m.m01, m.m02, m.m10, m.m11, m.m12, m.m20, m.m21, m.m22].map(fmt).join(',');
  case 'nested':
   return [
    `[${fmt(m.m00)},${fmt(m.m01)},${fmt(m.m02)}]`,
    `[${fmt(m.m10)},${fmt(m.m11)},${fmt(m.m12)}]`,
    `[${fmt(m.m20)},${fmt(m.m21)},${fmt(m.m22)}]`,
   ].join(',');
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

/**
 * Parses a string representation of a 2D transform.
 *
 * Supported formats:
 * - "px,py,c,s" (position x,y and rotation cos,sin)
 * - "px py c s" (space-separated)
 * - JSON format with p and r properties
 *
 * @param str - String to parse
 * @param out - Optional output transform (default: new Transform2)
 * @returns Parsed transform
 * @throws {Error} If the string cannot be parsed
 */
export function parseTransform2(string_: string, out = new Transform2()): Transform2 {
 const trimmed = string_.trim();

 // Try JSON format
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
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
     out.rotation = DeterministicMath.atan2(object.r.sin, object.r.cos);
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
     out.rotation = DeterministicMath.atan2(object.r.s, object.r.c);
     return out;
    }
   }
  } catch {
   // Fall through
  }
 }

 // Parse comma or space separated values
 const values = trimmed
  .split(/[,\s]+/)
  .filter((s) => s.length > 0)
  .map(parseFloat);

 if (values.length !== 4 || values.some(isNaN)) {
  throw new Error(`parseTransform2: expected 4 values, got ${values.length} in "${string_}"`);
 }

 // Format is px, py, c, s
 const rotation = DeterministicMath.atan2(values[3]!, values[2]!);
 return Transform2.fromValues(values[0]!, values[1]!, rotation, 1, 1, out);
}

/**
 * Formats a 2D transform as a string.
 *
 * @param t - Transform to format
 * @param format - Output format: 'flat', 'json'
 * @param precision - Number of decimal places
 * @returns Formatted string
 */
export function formatTransform2(
 t: ReadonlyTransform2,
 format: 'flat' | 'json' = 'flat',
 precision?: number,
): string {
 const fmt = (n: number) => (precision !== undefined ? n.toFixed(precision) : n.toString());
 const cos = DeterministicMath.cos(t.rotation);
 const sin = DeterministicMath.sin(t.rotation);

 switch (format) {
  case 'flat':
   return `${fmt(t.position.x)},${fmt(t.position.y)},${fmt(cos)},${fmt(sin)}`;
  case 'json':
   return JSON.stringify({
    p: { x: parseFloat(fmt(t.position.x)), y: parseFloat(fmt(t.position.y)) },
    r: { cos: parseFloat(fmt(cos)), sin: parseFloat(fmt(sin)) },
   });
 }
}
