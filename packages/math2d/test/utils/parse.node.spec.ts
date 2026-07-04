/**
 * @file test/utils/parse.node.spec.ts
 * @module @lenguados/math2d/utils
 * @description Tests for parsing and formatting utilities.
 */

import { describe, expect, it } from '@jest/globals';

import { Complex } from '../../src/core/complex';
import { Interval } from '../../src/core/interval';
import { Matrix2 } from '../../src/core/matrix2';
import { Matrix3 } from '../../src/core/matrix3';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';
import {
 formatComplex,
 formatInterval,
 formatMatrix2,
 formatMatrix3,
 formatRotation2,
 formatTransform2,
 formatVector2,
 parseComplex,
 parseInterval,
 parseMatrix2,
 parseMatrix3,
 parseRotation2,
 parseTransform2,
 parseVector2,
} from '../../src/utils/parse';

describe('utils/parse', () => {
 describe('parseVector2', () => {
  it('parses comma-separated format', () => {
   const v = parseVector2('1.5,2.5');
   expect(v.x).toBeCloseTo(1.5);
   expect(v.y).toBeCloseTo(2.5);
  });

  it('parses space-separated format', () => {
   const v = parseVector2('3 4');
   expect(v.x).toBeCloseTo(3);
   expect(v.y).toBeCloseTo(4);
  });

  it('parses parentheses format', () => {
   const v = parseVector2('(1, 2)');
   expect(v.x).toBeCloseTo(1);
   expect(v.y).toBeCloseTo(2);
  });

  it('parses brackets format', () => {
   const v = parseVector2('[5, 6]');
   expect(v.x).toBeCloseTo(5);
   expect(v.y).toBeCloseTo(6);
  });

  it('parses JSON format', () => {
   const v = parseVector2('{"x": 7, "y": 8}');
   expect(v.x).toBeCloseTo(7);
   expect(v.y).toBeCloseTo(8);
  });

  it('uses out parameter when provided', () => {
   const out = new Vector2();
   const result = parseVector2('1,2', out);
   expect(result).toBe(out);
   expect(out.x).toBeCloseTo(1);
   expect(out.y).toBeCloseTo(2);
  });

  it('throws on invalid format', () => {
   expect(() => parseVector2('invalid')).toThrow();
   expect(() => parseVector2('1,2,3')).toThrow();
   expect(() => parseVector2('a,b')).toThrow();
  });

  it('handles negative numbers', () => {
   const v = parseVector2('-1.5, -2.5');
   expect(v.x).toBeCloseTo(-1.5);
   expect(v.y).toBeCloseTo(-2.5);
  });

  it('handles scientific notation', () => {
   const v = parseVector2('1e-5, 2e3');
   expect(v.x).toBeCloseTo(1e-5);
   expect(v.y).toBeCloseTo(2e3);
  });
 });

 describe('formatVector2', () => {
  it('formats as csv by default', () => {
   const v = new Vector2(1, 2);
   expect(formatVector2(v)).toBe('1,2');
  });

  it('formats as space-separated', () => {
   const v = new Vector2(1, 2);
   expect(formatVector2(v, 'space')).toBe('1 2');
  });

  it('formats as JSON', () => {
   const v = new Vector2(1, 2);
   expect(formatVector2(v, 'json')).toBe('{"x":1,"y":2}');
  });

  it('formats as brackets', () => {
   const v = new Vector2(1, 2);
   expect(formatVector2(v, 'brackets')).toBe('[1,2]');
  });

  it('respects precision', () => {
   const v = new Vector2(1.23456, 2.34567);
   expect(formatVector2(v, 'csv', 2)).toBe('1.23,2.35');
  });
 });

 describe('parseRotation2', () => {
  it('parses angle in radians', () => {
   const r = parseRotation2('1.5707963267948966');
   expect(r.sin).toBeCloseTo(1, 5);
   expect(r.cos).toBeCloseTo(0, 5);
  });

  it('parses angle in degrees', () => {
   const r = parseRotation2('90deg');
   expect(r.sin).toBeCloseTo(1, 5);
   expect(r.cos).toBeCloseTo(0, 5);
  });

  it('parses cos,sin format', () => {
   const r = parseRotation2('0.707,0.707');
   expect(r.cos).toBeCloseTo(0.707, 3);
   expect(r.sin).toBeCloseTo(0.707, 3);
  });

  it('parses JSON format with cos/sin', () => {
   const r = parseRotation2('{"cos": 1, "sin": 0}');
   expect(r.cos).toBeCloseTo(1);
   expect(r.sin).toBeCloseTo(0);
  });

  it('parses legacy JSON format with c/s', () => {
   const r = parseRotation2('{"c": 1, "s": 0}');
   expect(r.cos).toBeCloseTo(1);
   expect(r.sin).toBeCloseTo(0);
  });

  it('throws on invalid format', () => {
   expect(() => parseRotation2('invalid')).toThrow();
  });
 });

 describe('formatRotation2', () => {
  it('formats as radians by default', () => {
   const r = Rotation2.fromAngle(Math.PI / 2);
   const formatted = parseFloat(formatRotation2(r));
   expect(formatted).toBeCloseTo(Math.PI / 2, 5);
  });

  it('formats as degrees', () => {
   const r = Rotation2.fromAngle(Math.PI / 2);
   expect(formatRotation2(r, 'degrees')).toContain('deg');
   expect(parseFloat(formatRotation2(r, 'degrees'))).toBeCloseTo(90, 0);
  });

  it('formats as components', () => {
   const r = Rotation2.fromAngle(0);
   expect(formatRotation2(r, 'components')).toBe('1,0');
  });

  it('formats as JSON', () => {
   const r = Rotation2.fromAngle(0);
   const json = JSON.parse(formatRotation2(r, 'json'));
   expect(json.cos).toBeCloseTo(1);
   expect(json.sin).toBeCloseTo(0);
  });
 });

 describe('parseMatrix2', () => {
  it('parses flat format', () => {
   const m = parseMatrix2('1,0,0,1');
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(0);
   expect(m.m10).toBe(0);
   expect(m.m11).toBe(1);
  });

  it('parses nested array format', () => {
   const m = parseMatrix2('[[1,2],[3,4]]');
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('parses JSON object format', () => {
   const m = parseMatrix2('{"m00":1,"m01":2,"m10":3,"m11":4}');
   expect(m.m00).toBe(1);
   expect(m.m01).toBe(2);
   expect(m.m10).toBe(3);
   expect(m.m11).toBe(4);
  });

  it('throws on invalid format', () => {
   expect(() => parseMatrix2('1,2,3')).toThrow();
   // Note: 'a,b,c,d' parses as NaN values which throws
   expect(() => parseMatrix2('only_one')).toThrow();
  });

  // V9-Parse-01: per-cell numeric guard (previously accepted strings silently)
  it('throws on nested array with non-numeric cell (V9-Parse-01)', () => {
   expect(() => parseMatrix2('[[1,"x"],[3,4]]')).toThrow();
   expect(() => parseMatrix2('[[1,2],[null,4]]')).toThrow();
  });
 });

 describe('formatMatrix2', () => {
  it('formats as flat by default', () => {
   const m = new Matrix2(1, 0, 0, 1);
   expect(formatMatrix2(m)).toBe('1,0,0,1');
  });

  it('formats as nested', () => {
   const m = new Matrix2(1, 0, 0, 1);
   expect(formatMatrix2(m, 'nested')).toBe('[[1,0],[0,1]]');
  });

  it('formats as JSON', () => {
   const m = new Matrix2(1, 0, 0, 1);
   const json = JSON.parse(formatMatrix2(m, 'json'));
   expect(json.m00).toBe(1);
   expect(json.m11).toBe(1);
  });
 });

 describe('parseMatrix3', () => {
  it('parses flat format', () => {
   const m = parseMatrix3('1,0,0,0,1,0,0,0,1');
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
   expect(m.m22).toBe(1);
  });

  it('parses nested array format', () => {
   const m = parseMatrix3('[[1,2,3],[4,5,6],[7,8,9]]');
   expect(m.m00).toBe(1);
   expect(m.m02).toBe(3);
   expect(m.m22).toBe(9);
  });

  it('throws on invalid format', () => {
   expect(() => parseMatrix3('1,2,3,4,5')).toThrow();
  });
 });

 describe('formatMatrix3', () => {
  it('formats as flat by default', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(formatMatrix3(m)).toBe('1,0,0,0,1,0,0,0,1');
  });

  it('formats as nested with outer brackets', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(formatMatrix3(m, 'nested')).toBe('[[1,0,0],[0,1,0],[0,0,1]]');
  });
 });

 describe('parseTransform2', () => {
  it('parses flat format (px,py,c,s)', () => {
   const t = parseTransform2('1,2,1,0');
   expect(t.position.x).toBeCloseTo(1);
   expect(t.position.y).toBeCloseTo(2);
   expect(t.rotation.angle).toBeCloseTo(0, 5);
  });

  it('parses JSON format with cos/sin', () => {
   const t = parseTransform2('{"p":{"x":5,"y":6},"r":{"cos":1,"sin":0}}');
   expect(t.position.x).toBeCloseTo(5);
   expect(t.position.y).toBeCloseTo(6);
   expect(t.rotation.angle).toBeCloseTo(0, 5);
  });

  it('parses legacy JSON format with c/s', () => {
   const t = parseTransform2('{"p":{"x":3,"y":4},"r":{"c":1,"s":0}}');
   expect(t.position.x).toBeCloseTo(3);
   expect(t.position.y).toBeCloseTo(4);
  });

  it('throws on invalid format', () => {
   expect(() => parseTransform2('1,2')).toThrow();
  });

  // V9-Parse-02: .set() normalizes rotation; denormalized {cos: 2, sin: 0} no longer silently accepted
  it('normalizes denormalized rotation input via .set() (V9-Parse-02)', () => {
   // Input {cos: 2, sin: 0} is not unit-length — .set() should normalize to {cos: 1, sin: 0}
   const t = parseTransform2('{"p":{"x":0,"y":0},"r":{"cos":2,"sin":0}}');
   expect(t.rotation.cos).toBeCloseTo(1, 10);
   expect(t.rotation.sin).toBeCloseTo(0, 10);
   // cos² + sin² = 1 post-normalization
   const magSq = t.rotation.cos * t.rotation.cos + t.rotation.sin * t.rotation.sin;
   expect(magSq).toBeCloseTo(1, 10);
  });

  it('normalizes denormalized rotation in flat format (V9-Parse-02)', () => {
   const t = parseTransform2('1,2,0.5,0.5'); // cos=0.5, sin=0.5 → not unit-length
   const magSq = t.rotation.cos * t.rotation.cos + t.rotation.sin * t.rotation.sin;
   expect(magSq).toBeCloseTo(1, 10); // normalized
  });
 });

 describe('formatTransform2', () => {
  it('formats as flat by default', () => {
   const t = Transform2.fromValues(1, 2, 0, 1, 1);
   const formatted = formatTransform2(t);
   expect(formatted).toContain('1');
   expect(formatted).toContain('2');
  });

  it('formats as JSON', () => {
   const t = Transform2.fromValues(1, 2, 0, 1, 1);
   const json = JSON.parse(formatTransform2(t, 'json'));
   expect(json.p.x).toBeCloseTo(1);
   expect(json.p.y).toBeCloseTo(2);
   expect(json.r.cos).toBeCloseTo(1);
   expect(json.r.sin).toBeCloseTo(0);
  });
 });

 describe('Vector2 round-trip (all formats)', () => {
  const original = new Vector2(3.14159, -2.71828);

  it('csv round-trip', () => {
   const parsed = parseVector2(formatVector2(original, 'csv'));
   expect(parsed.x).toBeCloseTo(original.x, 5);
   expect(parsed.y).toBeCloseTo(original.y, 5);
  });

  it('space round-trip', () => {
   const parsed = parseVector2(formatVector2(original, 'space'));
   expect(parsed.x).toBeCloseTo(original.x, 5);
   expect(parsed.y).toBeCloseTo(original.y, 5);
  });

  it('json round-trip', () => {
   const parsed = parseVector2(formatVector2(original, 'json'));
   expect(parsed.x).toBeCloseTo(original.x, 5);
   expect(parsed.y).toBeCloseTo(original.y, 5);
  });

  it('brackets round-trip', () => {
   const parsed = parseVector2(formatVector2(original, 'brackets'));
   expect(parsed.x).toBeCloseTo(original.x, 5);
   expect(parsed.y).toBeCloseTo(original.y, 5);
  });
 });

 describe('Rotation2 round-trip (all formats)', () => {
  const original = Rotation2.fromAngle(Math.PI / 3);

  it('radians round-trip', () => {
   const parsed = parseRotation2(formatRotation2(original, 'radians'));
   expect(parsed.cos).toBeCloseTo(original.cos, 5);
   expect(parsed.sin).toBeCloseTo(original.sin, 5);
  });

  it('degrees round-trip', () => {
   const parsed = parseRotation2(formatRotation2(original, 'degrees'));
   expect(parsed.cos).toBeCloseTo(original.cos, 4);
   expect(parsed.sin).toBeCloseTo(original.sin, 4);
  });

  it('components round-trip', () => {
   const parsed = parseRotation2(formatRotation2(original, 'components'));
   expect(parsed.cos).toBeCloseTo(original.cos, 5);
   expect(parsed.sin).toBeCloseTo(original.sin, 5);
  });

  it('json round-trip', () => {
   const parsed = parseRotation2(formatRotation2(original, 'json'));
   expect(parsed.cos).toBeCloseTo(original.cos, 5);
   expect(parsed.sin).toBeCloseTo(original.sin, 5);
  });
 });

 describe('Matrix2 round-trip (all formats)', () => {
  const original = Matrix2.fromRotation(Math.PI / 4);

  it('flat round-trip', () => {
   const parsed = parseMatrix2(formatMatrix2(original, 'flat'));
   expect(parsed.m00).toBeCloseTo(original.m00, 5);
   expect(parsed.m01).toBeCloseTo(original.m01, 5);
   expect(parsed.m10).toBeCloseTo(original.m10, 5);
   expect(parsed.m11).toBeCloseTo(original.m11, 5);
  });

  it('nested round-trip', () => {
   const parsed = parseMatrix2(formatMatrix2(original, 'nested'));
   expect(parsed.m00).toBeCloseTo(original.m00, 5);
   expect(parsed.m01).toBeCloseTo(original.m01, 5);
   expect(parsed.m10).toBeCloseTo(original.m10, 5);
   expect(parsed.m11).toBeCloseTo(original.m11, 5);
  });

  it('json round-trip', () => {
   const parsed = parseMatrix2(formatMatrix2(original, 'json'));
   expect(parsed.m00).toBeCloseTo(original.m00, 5);
   expect(parsed.m01).toBeCloseTo(original.m01, 5);
   expect(parsed.m10).toBeCloseTo(original.m10, 5);
   expect(parsed.m11).toBeCloseTo(original.m11, 5);
  });
 });

 describe('Matrix3 round-trip (all formats)', () => {
  const original = new Matrix3(1.5, 2.3, 0.1, 4.2, 5.7, 0.9, 7.1, 8.4, 1.0);

  it('flat round-trip', () => {
   const parsed = parseMatrix3(formatMatrix3(original, 'flat'));
   expect(parsed.m00).toBeCloseTo(original.m00, 5);
   expect(parsed.m11).toBeCloseTo(original.m11, 5);
   expect(parsed.m22).toBeCloseTo(original.m22, 5);
  });

  it('nested round-trip', () => {
   const parsed = parseMatrix3(formatMatrix3(original, 'nested'));
   expect(parsed.m00).toBeCloseTo(original.m00, 5);
   expect(parsed.m11).toBeCloseTo(original.m11, 5);
   expect(parsed.m22).toBeCloseTo(original.m22, 5);
  });

  it('json round-trip', () => {
   const parsed = parseMatrix3(formatMatrix3(original, 'json'));
   expect(parsed.m00).toBeCloseTo(original.m00, 5);
   expect(parsed.m11).toBeCloseTo(original.m11, 5);
   expect(parsed.m22).toBeCloseTo(original.m22, 5);
  });
 });

 describe('Transform2 round-trip (all formats)', () => {
  const original = Transform2.fromValues(3.5, -1.2, Math.PI / 6, 2.0, 0.5);

  it('flat round-trip preserves scale', () => {
   const parsed = parseTransform2(formatTransform2(original, 'flat'));
   expect(parsed.position.x).toBeCloseTo(original.position.x, 5);
   expect(parsed.position.y).toBeCloseTo(original.position.y, 5);
   expect(parsed.rotation.cos).toBeCloseTo(original.rotation.cos, 5);
   expect(parsed.rotation.sin).toBeCloseTo(original.rotation.sin, 5);
   expect(parsed.scale.x).toBeCloseTo(original.scale.x, 5);
   expect(parsed.scale.y).toBeCloseTo(original.scale.y, 5);
  });

  it('json round-trip preserves scale', () => {
   const parsed = parseTransform2(formatTransform2(original, 'json'));
   expect(parsed.position.x).toBeCloseTo(original.position.x, 5);
   expect(parsed.position.y).toBeCloseTo(original.position.y, 5);
   expect(parsed.rotation.cos).toBeCloseTo(original.rotation.cos, 5);
   expect(parsed.rotation.sin).toBeCloseTo(original.rotation.sin, 5);
   expect(parsed.scale.x).toBeCloseTo(original.scale.x, 5);
   expect(parsed.scale.y).toBeCloseTo(original.scale.y, 5);
  });

  it('json without scale defaults to (1,1)', () => {
   const parsed = parseTransform2('{"p":{"x":1,"y":2},"r":{"cos":1,"sin":0}}');
   expect(parsed.scale.x).toBe(1);
   expect(parsed.scale.y).toBe(1);
  });

  it('flat 4-component legacy defaults scale to (1,1)', () => {
   const parsed = parseTransform2('1,2,1,0');
   expect(parsed.scale.x).toBe(1);
   expect(parsed.scale.y).toBe(1);
  });
 });

 describe('Complex round-trip (all formats)', () => {
  const original = new Complex(3.14, -2.72);

  it('math round-trip', () => {
   const parsed = parseComplex(formatComplex(original, 'math'));
   expect(parsed.real).toBeCloseTo(original.real, 5);
   expect(parsed.imag).toBeCloseTo(original.imag, 5);
  });

  it('csv round-trip', () => {
   const parsed = parseComplex(formatComplex(original, 'csv'));
   expect(parsed.real).toBeCloseTo(original.real, 5);
   expect(parsed.imag).toBeCloseTo(original.imag, 5);
  });

  it('json round-trip', () => {
   const parsed = parseComplex(formatComplex(original, 'json'));
   expect(parsed.real).toBeCloseTo(original.real, 5);
   expect(parsed.imag).toBeCloseTo(original.imag, 5);
  });
 });

 describe('Interval round-trip (all formats)', () => {
  const original = new Interval(-3.5, 7.2);

  it('brackets round-trip', () => {
   const parsed = parseInterval(formatInterval(original, 'brackets'));
   expect(parsed.min).toBeCloseTo(original.min, 5);
   expect(parsed.max).toBeCloseTo(original.max, 5);
  });

  it('csv round-trip', () => {
   const parsed = parseInterval(formatInterval(original, 'csv'));
   expect(parsed.min).toBeCloseTo(original.min, 5);
   expect(parsed.max).toBeCloseTo(original.max, 5);
  });

  it('json round-trip', () => {
   const parsed = parseInterval(formatInterval(original, 'json'));
   expect(parsed.min).toBeCloseTo(original.min, 5);
   expect(parsed.max).toBeCloseTo(original.max, 5);
  });
 });

 describe('parse error cases', () => {
  it('parseVector2 throws on empty string', () => {
   expect(() => parseVector2('')).toThrow();
  });

  it('parseVector2 throws on non-numeric values', () => {
   expect(() => parseVector2('abc,def')).toThrow();
  });

  it('parseRotation2 throws on non-numeric string', () => {
   expect(() => parseRotation2('not-a-number')).toThrow();
  });

  it('parseMatrix2 throws on too few values', () => {
   expect(() => parseMatrix2('1,2')).toThrow();
  });

  it('parseMatrix3 throws on NaN-producing input', () => {
   expect(() => parseMatrix3('a,b,c,d,e,f,g,h,i')).toThrow();
  });

  it('parseTransform2 throws on too few values', () => {
   expect(() => parseTransform2('1,2')).toThrow();
  });

  it('parseComplex throws on empty string', () => {
   expect(() => parseComplex('')).toThrow();
  });

  it('parseInterval throws on min > max in JSON', () => {
   expect(() => parseInterval('{"min":10,"max":5}')).toThrow();
  });

  it('parseInterval throws on NaN values', () => {
   expect(() => parseInterval('NaN,5')).toThrow();
  });
 });

 describe('parseMatrix3 Coverage', () => {
  it('parses nested array JSON format', () => {
   const json = '[[1, 2, 3], [4, 5, 6], [7, 8, 9]]';
   const m = parseMatrix3(json);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(5);
   expect(m.m22).toBe(9);
  });

  it('parses comma-separated values', () => {
   const string_ = '1, 2, 3, 4, 5, 6, 7, 8, 9';
   const m = parseMatrix3(string_);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(5);
   expect(m.m22).toBe(9);
  });

  it('parses space-separated values', () => {
   const string_ = '1 2 3 4 5 6 7 8 9';
   const m = parseMatrix3(string_);
   expect(m.m00).toBe(1);
   expect(m.m22).toBe(9);
  });

  it('throws on invalid nested array rows', () => {
   const json = '[[1, 2, 3], [4, 5], [7, 8, 9]]'; // second row has only 2 values
   expect(() => parseMatrix3(json)).toThrow();
  });

  it('throws on wrong number of values', () => {
   const string_ = '1, 2, 3, 4, 5'; // only 5 values
   expect(() => parseMatrix3(string_)).toThrow(/expected 9 values/);
  });

  it('throws on invalid values', () => {
   const string_ = '1, 2, 3, abc, 5, 6, 7, 8, 9';
   expect(() => parseMatrix3(string_)).toThrow();
  });
 });

 describe('formatMatrix2 Coverage', () => {
  it('formats Matrix2 to nested format', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const result = formatMatrix2(m, 'nested', 2);
   expect(result).toContain('[[');
  });

  it('formats Matrix2 to JSON with precision', () => {
   const m = new Matrix2(1.123456, 2.654321, 3.111111, 4.999999);
   const result = formatMatrix2(m, 'json', 2);
   const parsed = JSON.parse(result);
   expect(parsed.m00).toBe(1.12);
  });

  it('formats Matrix2 to flat format', () => {
   const m = new Matrix2(1, 2, 3, 4);
   const result = formatMatrix2(m, 'flat');
   expect(result).toBe('1,2,3,4');
  });
 });

 describe('parseMatrix3 Extended', () => {
  it('parses JSON object format', () => {
   expect.hasAssertions();
   const json = '{"m00":1,"m01":2,"m02":3,"m10":4,"m11":5,"m12":6,"m20":7,"m21":8,"m22":9}';
   const m = parseMatrix3(json);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(5);
   expect(m.m22).toBe(9);
  });

  it('parses nested array with spaces', () => {
   expect.hasAssertions();
   const json = '[ [1, 0, 0], [0, 1, 0], [0, 0, 1] ]';
   const m = parseMatrix3(json);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
   expect(m.m22).toBe(1);
  });

  it('parses flat array JSON', () => {
   expect.hasAssertions();
   const json = '[1, 0, 0, 0, 1, 0, 0, 0, 1]';
   const m = parseMatrix3(json);
   expect(m.m00).toBe(1);
   expect(m.m11).toBe(1);
  });
 });

 describe('parseComplex', () => {
  it('parses math notation (a+bi)', () => {
   const c = parseComplex('3+4i');
   expect(c.real).toBe(3);
   expect(c.imag).toBe(4);
  });

  it('parses math notation (a-bi)', () => {
   const c = parseComplex('3-4i');
   expect(c.real).toBe(3);
   expect(c.imag).toBe(-4);
  });

  it('parses csv format', () => {
   const c = parseComplex('5,6');
   expect(c.real).toBe(5);
   expect(c.imag).toBe(6);
  });

  it('parses JSON format', () => {
   const c = parseComplex('{"real":1,"imag":2}');
   expect(c.real).toBe(1);
   expect(c.imag).toBe(2);
  });

  it('throws on invalid format', () => {
   expect(() => parseComplex('invalid')).toThrow();
  });
 });

 describe('formatComplex', () => {
  it('formats as math notation', () => {
   expect(formatComplex(new Complex(3, 4), 'math')).toBe('3+4i');
   expect(formatComplex(new Complex(3, -4), 'math')).toBe('3-4i');
  });

  it('formats as csv', () => {
   expect(formatComplex(new Complex(3, 4), 'csv')).toBe('3,4');
  });

  it('formats as json', () => {
   expect(formatComplex(new Complex(3, 4), 'json')).toBe('{"real":3,"imag":4}');
  });
 });

 describe('parseInterval', () => {
  it('parses bracket format', () => {
   const interval = parseInterval('[0,10]');
   expect(interval.min).toBe(0);
   expect(interval.max).toBe(10);
  });

  it('parses csv format', () => {
   const interval = parseInterval('5,15');
   expect(interval.min).toBe(5);
   expect(interval.max).toBe(15);
  });

  it('parses JSON format', () => {
   const interval = parseInterval('{"min":1,"max":9}');
   expect(interval.min).toBe(1);
   expect(interval.max).toBe(9);
  });

  it('throws on min > max', () => {
   expect(() => parseInterval('10,5')).toThrow();
  });
 });

 describe('formatInterval', () => {
  it('formats as brackets', () => {
   expect(formatInterval(new Interval(0, 10), 'brackets')).toBe('[0,10]');
  });

  it('formats as csv', () => {
   expect(formatInterval(new Interval(3, 7), 'csv')).toBe('3,7');
  });

  it('formats as json', () => {
   expect(formatInterval(new Interval(1, 5), 'json')).toBe('{"min":1,"max":5}');
  });
 });

 /* ===== Section 9: Serialization robustness tests ===== */

 describe('scientific notation parsing', () => {
  it('parseComplex("1e5+2e3i") returns Complex(100000, 2000)', () => {
   const c = parseComplex('1e5+2e3i');
   expect(c.real).toBe(1e5);
   expect(c.imag).toBe(2e3);
  });

  it('parseComplex("1e-5i") returns Complex(0, 1e-5)', () => {
   const c = parseComplex('1e-5i');
   expect(c.real).toBe(0);
   expect(c.imag).toBeCloseTo(1e-5);
  });

  it('parseComplex("1.5e2+3.7e-1i") handles decimal + scientific', () => {
   const c = parseComplex('1.5e2+3.7e-1i');
   expect(c.real).toBe(150);
   expect(c.imag).toBeCloseTo(0.37);
  });
 });

 describe('JSON validity for non-finite values', () => {
  it('formatVector2 with NaN produces valid JSON (null)', () => {
   const string_ = formatVector2(new Vector2(NaN, 0), 'json');
   expect(() => JSON.parse(string_)).not.toThrow();
   const parsed = JSON.parse(string_);
   expect(parsed.x).toBeNull();
   expect(parsed.y).toBe(0);
  });

  it('formatComplex with Infinity produces valid JSON', () => {
   const string_ = formatComplex(new Complex(Infinity, 0), 'json');
   expect(() => JSON.parse(string_)).not.toThrow();
  });

  it('formatInterval with valid values produces valid JSON', () => {
   const string_ = formatInterval(new Interval(1, 5), 'json');
   expect(() => JSON.parse(string_)).not.toThrow();
  });
 });

 describe('parseInterval validation error re-throw', () => {
  it('re-throws min > max validation error from JSON input', () => {
   expect(() => parseInterval('{"min": 10, "max": 5}')).toThrow(/min.*must not exceed.*max/);
  });
 });

 describe('round-trip tests', () => {
  it('parseComplex(formatComplex(c, "json")) round-trips', () => {
   const original = new Complex(3.14, -2.71);
   const string_ = formatComplex(original, 'json');
   const parsed = parseComplex(string_);
   expect(parsed.real).toBeCloseTo(3.14);
   expect(parsed.imag).toBeCloseTo(-2.71);
  });

  it('formatComplex negative-zero shows minus sign', () => {
   const c = new Complex(1, -0);
   const string_ = formatComplex(c, 'math');
   expect(string_).toContain('-');
  });
 });
});
