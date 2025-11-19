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
 */

import { Mat2 } from '../mat2';
import type { ReadonlyMat2 } from '../mat2';
import { Mat3 } from '../mat3';
import type { ReadonlyMat3 } from '../mat3';
import type { ReadonlyRot2 } from '../rot2';
import { Rot2 } from '../rot2';
import type { ReadonlyTransform2 } from '../transform2';
import { Transform2 } from '../transform2';
import type { ReadonlyVector2 } from '../vector2';
import { Vector2 } from '../vector2';

/**
 * Parses a string representation of a 2D vector.
 *
 * Supported formats:
 * - "x,y" (comma-separated)
 * - "x y" (space-separated)
 * - "(x,y)" (with parentheses)
 * - "[x,y]" (with brackets)
 * - "{x:n, y:n}" (JSON-like)
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
 * - "{c:n, s:n}" (JSON-like)
 *
 * @param str - String to parse
 * @param out - Optional output rotation (default: new Rot2)
 * @returns Parsed rotation
 * @throws {Error} If the string cannot be parsed
 */
export function parseRot2(string_: string, out = new Rot2()): Rot2 {
 const trimmed = string_.trim();

 // Try JSON format
 if (trimmed.startsWith('{') && trimmed.endsWith('}')) {
  try {
   const object = JSON.parse(trimmed);
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
   return Rot2.fromAngle((degrees * Math.PI) / 180, out);
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
  return Rot2.fromAngle(angle, out);
 }

 throw new Error(`parseRot2: cannot parse rotation from "${string_}"`);
}

/**
 * Formats a 2D rotation as a string.
 *
 * @param r - Rotation to format
 * @param format - Output format: 'radians', 'degrees', 'components', 'json'
 * @param precision - Number of decimal places
 * @returns Formatted string
 */
export function formatRot2(
 r: ReadonlyRot2,
 format: 'radians' | 'degrees' | 'components' | 'json' = 'radians',
 precision?: number,
): string {
 switch (format) {
  case 'radians': {
   const angle = Math.atan2(r.s, r.c);
   return precision !== undefined ? angle.toFixed(precision) : angle.toString();
  }
  case 'degrees': {
   const angle = (Math.atan2(r.s, r.c) * 180) / Math.PI;
   const string_ = precision !== undefined ? angle.toFixed(precision) : angle.toString();
   return `${string_}deg`;
  }
  case 'components': {
   const c = precision !== undefined ? r.c.toFixed(precision) : r.c.toString();
   const s = precision !== undefined ? r.s.toFixed(precision) : r.s.toString();
   return `${c},${s}`;
  }
  case 'json': {
   const c = precision !== undefined ? r.c.toFixed(precision) : r.c.toString();
   const s = precision !== undefined ? r.s.toFixed(precision) : r.s.toString();
   return `{"c":${c},"s":${s}}`;
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
 * @param out - Optional output matrix (default: new Mat2)
 * @returns Parsed matrix
 * @throws {Error} If the string cannot be parsed
 */
export function parseMat2(string_: string, out = new Mat2()): Mat2 {
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
  throw new Error(`parseMat2: expected 4 values, got ${values.length} in "${string_}"`);
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
export function formatMat2(
 m: ReadonlyMat2,
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
 * @param out - Optional output matrix (default: new Mat3)
 * @returns Parsed matrix
 * @throws {Error} If the string cannot be parsed
 */
export function parseMat3(string_: string, out = new Mat3()): Mat3 {
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
  throw new Error(`parseMat3: expected 9 values, got ${values.length} in "${string_}"`);
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
export function formatMat3(
 m: ReadonlyMat3,
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
    if (
     typeof object.p.x === 'number' &&
     typeof object.p.y === 'number' &&
     typeof object.r.c === 'number' &&
     typeof object.r.s === 'number'
    ) {
     out.p.set(object.p.x, object.p.y);
     out.r.set(object.r.c, object.r.s);
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

 return Transform2.fromValues(values[0]!, values[1]!, values[2]!, values[3]!, out);
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

 switch (format) {
  case 'flat':
   return `${fmt(t.p.x)},${fmt(t.p.y)},${fmt(t.r.c)},${fmt(t.r.s)}`;
  case 'json':
   return JSON.stringify({
    p: { x: parseFloat(fmt(t.p.x)), y: parseFloat(fmt(t.p.y)) },
    r: { c: parseFloat(fmt(t.r.c)), s: parseFloat(fmt(t.r.s)) },
   });
 }
}
