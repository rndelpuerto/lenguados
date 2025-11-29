import { describe, expect, it } from '@jest/globals';

import { Matrix2Batch } from '../../src/batch/matrix2-batch';
import { Matrix2 } from '../../src/core/matrix2';

const DIGITS = 6;

function expectMatrixClose(actual: Float32Array, offset: number, expected: Matrix2): void {
 expect(actual[offset]).toBeCloseTo(expected.m00, DIGITS);
 expect(actual[offset + 1]).toBeCloseTo(expected.m01, DIGITS);
 expect(actual[offset + 2]).toBeCloseTo(expected.m10, DIGITS);
 expect(actual[offset + 3]).toBeCloseTo(expected.m11, DIGITS);
}

describe('Matrix2Batch', () => {
 describe('multiplyInPlace', () => {
  it('multiplies each matrix by a multiplier deterministically', () => {
   expect.hasAssertions();
   const matrices = Matrix2Batch.toFloat32Array([new Matrix2(1, 0, 0, 1), new Matrix2(2, 0, 0, 2)]);
   const multiplier = Matrix2.fromRotation(Math.PI / 2);

   Matrix2Batch.multiplyInPlace(matrices, multiplier);

   const expected0 = new Matrix2(0, 1, -1, 0);
   expectMatrixClose(matrices, 0, expected0);
   const expected1 = new Matrix2(0, 2, -2, 0);
   expectMatrixClose(matrices, 4, expected1);
  });
 });

 describe('invertInPlace', () => {
  it('inverts matrices with non-zero determinant and skips others', () => {
   expect.hasAssertions();
   const matrices = Matrix2Batch.toFloat32Array([
    new Matrix2(2, 0, 0, 2), // invertible
    new Matrix2(1, 2, 2, 4), // singular
   ]);

   const inverted = Matrix2Batch.invertInPlace(matrices);
   expect(inverted).toBe(1);

   const expected = new Matrix2(0.5, 0, 0, 0.5);
   expectMatrixClose(matrices, 0, expected);
  });
 });

 describe('angle helpers', () => {
  it('extractAngles returns deterministic atan2 output', () => {
   expect.hasAssertions();
   const matrices = Matrix2Batch.toFloat32Array([Matrix2.fromRotation(Math.PI / 4)]);
   const angles = new Float32Array(1);
   Matrix2Batch.extractAngles(matrices, angles, 1);
   expect(angles[0]).toBeCloseTo(Math.PI / 4, DIGITS);
  });

  it('setRotations writes cos/sin pairs', () => {
   expect.hasAssertions();
   const matrices = new Float32Array(Matrix2Batch.ELEMENTS_PER_MATRIX);
   Matrix2Batch.setRotations(matrices, new Float32Array([Math.PI / 3]), 1);
   const angle = Math.PI / 3;
   expect(matrices[0]).toBeCloseTo(Math.cos(angle), DIGITS);
   expect(matrices[1]).toBeCloseTo(-Math.sin(angle), DIGITS);
   expect(matrices[2]).toBeCloseTo(Math.sin(angle), DIGITS);
   expect(matrices[3]).toBeCloseTo(Math.cos(angle), DIGITS);
  });

  it('setRotations normalizes wrapped angles', () => {
   const matrices = new Float32Array(Matrix2Batch.ELEMENTS_PER_MATRIX);
   Matrix2Batch.setRotations(matrices, new Float32Array([Math.PI * 2 + Math.PI / 4]), 1);
   expect(matrices[0]).toBeCloseTo(Math.cos(Math.PI / 4), DIGITS);
   expect(matrices[2]).toBeCloseTo(Math.sin(Math.PI / 4), DIGITS);
  });
 });

 describe('conversion helpers', () => {
  it('round-trips Matrix2 arrays', () => {
   expect.hasAssertions();
   const matrices = [new Matrix2(1, 2, 3, 4), new Matrix2(5, 6, 7, 8)];

   const packed = Matrix2Batch.toFloat32Array(matrices);
   const unpacked = Matrix2Batch.fromFloat32Array(packed);

   unpacked.forEach((matrix, index) => {
    expect(matrix.equals(matrices[index]!)).toBe(true);
   });
  });
 });
});
