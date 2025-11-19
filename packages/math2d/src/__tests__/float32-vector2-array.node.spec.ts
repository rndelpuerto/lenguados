/**
 * @file float32-vector2-array.node.spec.ts
 * @description Tests for Float32Vector2Array (SIMD-friendly vector storage).
 */

import { Float32Vector2Array } from '../typed-arrays/float32-vector2-array';
import { Vector2 } from '../vector2';

const createFilled = (capacity: number, x: number, y: number): Float32Vector2Array => {
 const array = new Float32Vector2Array(capacity);
 for (let index = 0; index < capacity; index += 1) {
  array.setComponents(index, x, y);
 }
 return array;
};

describe('Float32Vector2Array', () => {
 it('throws when capacity is invalid', () => {
  expect(() => new Float32Vector2Array(0)).toThrow(RangeError);
  expect(() => new Float32Vector2Array(-1)).toThrow(RangeError);
  expect(() => new Float32Vector2Array(1.5)).toThrow(RangeError);
 });

 it('exposes SoA views for x/y components', () => {
  const array = new Float32Vector2Array(3);
  array.setComponents(0, 1, 2).setComponents(1, 3, 4).setComponents(2, 5, 6);

  expect(Array.from(array.x)).toEqual([1, 3, 5]);
  expect(Array.from(array.y)).toEqual([2, 4, 6]);
 });

 it('getVector/setVector round-trips values', () => {
  const array = new Float32Vector2Array(2);
  const v1 = new Vector2(10, 20);
  const v2 = new Vector2(-3, 7);

  array.setVector(0, v1);
  array.setVector(1, v2);

  expect(array.getVector(0).equals(v1)).toBe(true);
  expect(array.getVector(1).equals(v2)).toBe(true);
 });

 it('supports batch addition and scaling', () => {
  const a = createFilled(2, 1, 2);
  const b = createFilled(2, 3, 4);

  a.addBatch(b).scaleBatch(2);

  expect(Array.from(a.x)).toEqual([8, 8]);
  expect(Array.from(a.y)).toEqual([12, 12]);
 });

 it('copyFrom enforces matching lengths', () => {
  const a = new Float32Vector2Array(2);
  const b = new Float32Vector2Array(2);
  const mismatch = new Float32Vector2Array(3);

  expect(() => a.copyFrom(mismatch)).toThrow(RangeError);
  expect(() => a.addBatch(mismatch)).toThrow(RangeError);

  b.setComponents(0, 9, 9);
  b.setComponents(1, -1, -1);
  a.copyFrom(b);

  expect(Array.from(a.data)).toEqual(Array.from(b.data));
 });

 it('converts to Vector2 array without reallocating existing entries', () => {
  const typedArray = new Float32Vector2Array(2);
  typedArray.setComponents(0, 5, 6);
  typedArray.setComponents(1, 7, 8);

  const existing = [new Vector2(), new Vector2()];
  const result = typedArray.toVectorArray(existing);

  expect(result).toBe(existing);
  expect(existing[0].equals(new Vector2(5, 6))).toBe(true);
  expect(existing[1].equals(new Vector2(7, 8))).toBe(true);
 });
});
