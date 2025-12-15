import { describe, expect, it } from '@jest/globals';

import { Matrix2 } from '../../src/core/matrix2';
import { Matrix3 } from '../../src/core/matrix3';
import { Rotation2 } from '../../src/core/rotation2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';
import {
 formatMatrix2,
 formatMatrix3,
 formatRotation2,
 formatTransform2,
 formatVector2,
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

  it('formats as nested', () => {
   const m = new Matrix3(1, 0, 0, 0, 1, 0, 0, 0, 1);
   expect(formatMatrix3(m, 'nested')).toContain('[1,0,0]');
  });
 });

 describe('parseTransform2', () => {
  it('parses flat format (px,py,c,s)', () => {
   const t = parseTransform2('1,2,1,0');
   expect(t.position.x).toBeCloseTo(1);
   expect(t.position.y).toBeCloseTo(2);
   expect(t.rotation).toBeCloseTo(0, 5);
  });

  it('parses JSON format with cos/sin', () => {
   const t = parseTransform2('{"p":{"x":5,"y":6},"r":{"cos":1,"sin":0}}');
   expect(t.position.x).toBeCloseTo(5);
   expect(t.position.y).toBeCloseTo(6);
   expect(t.rotation).toBeCloseTo(0, 5);
  });

  it('parses legacy JSON format with c/s', () => {
   const t = parseTransform2('{"p":{"x":3,"y":4},"r":{"c":1,"s":0}}');
   expect(t.position.x).toBeCloseTo(3);
   expect(t.position.y).toBeCloseTo(4);
  });

  it('throws on invalid format', () => {
   expect(() => parseTransform2('1,2')).toThrow();
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

 describe('roundtrip', () => {
  it('Vector2 roundtrip works', () => {
   const original = new Vector2(3.14159, 2.71828);
   const formatted = formatVector2(original, 'json');
   const parsed = parseVector2(formatted);
   expect(parsed.x).toBeCloseTo(original.x, 5);
   expect(parsed.y).toBeCloseTo(original.y, 5);
  });

  it('Rotation2 roundtrip works', () => {
   const original = Rotation2.fromAngle(Math.PI / 3);
   const formatted = formatRotation2(original, 'json');
   const parsed = parseRotation2(formatted);
   expect(parsed.cos).toBeCloseTo(original.cos, 5);
   expect(parsed.sin).toBeCloseTo(original.sin, 5);
  });

  it('Matrix2 roundtrip works', () => {
   const original = Matrix2.fromRotation(Math.PI / 4);
   const formatted = formatMatrix2(original, 'json');
   const parsed = parseMatrix2(formatted);
   expect(parsed.m00).toBeCloseTo(original.m00, 5);
   expect(parsed.m11).toBeCloseTo(original.m11, 5);
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
});
