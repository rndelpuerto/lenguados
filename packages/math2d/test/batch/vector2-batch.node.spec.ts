import { describe, expect, it } from '@jest/globals';

import { Transform2Batch } from '../../src/batch/transform2-batch';
import { Vector2Batch } from '../../src/batch/vector2-batch';
import { Matrix2 } from '../../src/core/matrix2';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

const createFilled = (capacity: number, x: number, y: number): Vector2Batch => {
 const batch = new Vector2Batch(capacity);
 for (let index = 0; index < capacity; index += 1) {
  batch.x[index] = x;
  batch.y[index] = y;
 }
 return batch;
};

describe('Vector2Batch', () => {
 it('initializes with correct capacity', () => {
  const batch = new Vector2Batch(10);
  expect(batch.count).toBe(10);
  expect(batch.x.length).toBe(10);
  expect(batch.y.length).toBe(10);
 });

 it('exposes SoA views for x/y components', () => {
  const batch = new Vector2Batch(3);
  batch.x[0] = 1;
  batch.y[0] = 2;
  batch.x[1] = 3;
  batch.y[1] = 4;
  batch.x[2] = 5;
  batch.y[2] = 6;

  expect(Array.from(batch.x)).toEqual([1, 3, 5]);
  expect(Array.from(batch.y)).toEqual([2, 4, 6]);
 });

 it('get/set round-trips values', () => {
  const batch = new Vector2Batch(2);
  const v1 = new Vector2(10, 20);
  const v2 = new Vector2(-3, 7);

  batch.set(0, v1);
  batch.set(1, v2);

  expect(batch.get(0).equals(v1)).toBe(true);
  expect(batch.get(1).equals(v2)).toBe(true);
 });

 it('supports batch addition and scaling', () => {
  const a = createFilled(2, 1, 2);
  const b = createFilled(2, 3, 4);

  // a = a + b
  const sum = a.add(b);
  // sum = sum * 2
  const scaled = sum.scale(2);

  expect(Array.from(scaled.x)).toEqual([8, 8]);
  expect(Array.from(scaled.y)).toEqual([12, 12]);
 });

 it('computes dot products', () => {
  const a = createFilled(2, 1, 0);
  const b = createFilled(2, 0, 1);

  const dots = a.dot(b);
  expect(Array.from(dots).every((value) => Math.abs(value) < 1e-6)).toBe(true);

  const c = createFilled(2, 2, 2);
  const d = createFilled(2, 3, 3);
  const dots2 = c.dot(d); // (2*3 + 2*3) = 12
  expect(Array.from(dots2)).toEqual([12, 12]);
 });

 it('rotates vectors deterministically', () => {
  const batch = createFilled(1, 1, 0);
  const rotated = batch.rotate(Math.PI / 2);
  expect(rotated.x[0]).toBeCloseTo(0, 6);
  expect(rotated.y[0]).toBeCloseTo(1, 6);
 });

 it('transformMatrix applies matrix to each vector', () => {
  const batch = createFilled(2, 1, 0);
  const matrix = Matrix2.fromRotation(Math.PI / 2);
  const transformed = batch.transformMatrix(matrix);

  expect(transformed.x[0]).toBeCloseTo(0, 6);
  expect(transformed.y[0]).toBeCloseTo(1, 6);
  expect(transformed.x[1]).toBeCloseTo(0, 6);
  expect(transformed.y[1]).toBeCloseTo(1, 6);
 });

 it('transformTransform applies scale, rotation and translation', () => {
  const batch = createFilled(1, 1, 0);
  const transform = Transform2.fromValues(10, 5, Math.PI / 2, 2, 1);
  const out = batch.transformTransform(transform);

  expect(out.x[0]).toBeCloseTo(10, 6);
  expect(out.y[0]).toBeCloseTo(7, 6);
 });

 it('transformByPackedTransforms uses packed data and preserves untouched entries', () => {
  const batch = new Vector2Batch(2);
  batch.x.set([1, 2]);
  batch.y.set([0, 3]);

  const packed = Transform2Batch.toFloat32Array([Transform2.fromValues(0, 0, Math.PI / 2, 1, 1)]);

  const transformed = batch.transformByPackedTransforms(packed);

  expect(transformed.x[0]).toBeCloseTo(0, 6);
  expect(transformed.y[0]).toBeCloseTo(1, 6);

  // Remaining vector should stay untouched
  expect(transformed.x[1]).toBeCloseTo(2, 6);
  expect(transformed.y[1]).toBeCloseTo(3, 6);
 });

 it('normalize handles zero vectors safely', () => {
  const batch = createFilled(1, 0, 0);
  const normalized = batch.normalize();
  expect(normalized.x[0]).toBeCloseTo(0, 6);
  expect(normalized.y[0]).toBeCloseTo(0, 6);
 });

 it('copyFrom respects offsets and clamps length', () => {
  const source = createFilled(4, 5, 5);
  const target = createFilled(4, 0, 0);
  source.x[2] = 9;
  source.y[2] = 3;
  target.copyFrom(source, 2, 0, 10); // length exceeds available, should clamp
  expect(Array.from(target.x.slice(0, 2))).toEqual([9, 5]);
  expect(Array.from(target.y.slice(0, 2))).toEqual([3, 5]);
 });

 it('lerp clamps interpolation factor', () => {
  const start = createFilled(1, 0, 0);
  const end = createFilled(1, 10, 10);
  const overshoot = start.lerp(end, 1.5);
  expect(Array.from(overshoot.x)).toEqual([10]);
  expect(Array.from(overshoot.y)).toEqual([10]);
  const undershoot = start.lerp(end, -1);
  expect(Array.from(undershoot.x)).toEqual([0]);
  expect(Array.from(undershoot.y)).toEqual([0]);
 });
});
