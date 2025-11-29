import { describe, expect, it } from '@jest/globals';

import { Transform2Batch } from '../../src/batch/transform2-batch';
import { Transform2 } from '../../src/core/transform2';
import { Vector2 } from '../../src/core/vector2';

const DIGITS = 6;

function expectVecClose(
 actual: Vector2 | Float32Array,
 x: number,
 y: number,
 digits = DIGITS,
): void {
 if (actual instanceof Vector2) {
  expect(actual.x).toBeCloseTo(x, digits);
  expect(actual.y).toBeCloseTo(y, digits);
 } else {
  expect(actual[0]).toBeCloseTo(x, digits);
  expect(actual[1]).toBeCloseTo(y, digits);
 }
}

function expectTransformClose(actual: Transform2, expected: Transform2, digits = DIGITS): void {
 expectVecClose(actual.position, expected.position.x, expected.position.y, digits);
 expect(actual.rotation).toBeCloseTo(expected.rotation, digits);
 expectVecClose(actual.scale, expected.scale.x, expected.scale.y, digits);
}

describe('Transform2Batch', () => {
 describe('applyParentInPlace', () => {
  it('composes parent and child transforms deterministically', () => {
   expect.hasAssertions();
   const child = Transform2.fromValues(1, 0, 0, 1, 1);
   const parent = Transform2.fromValues(2, 3, Math.PI / 2, 2, 1);
   const buffer = Transform2Batch.toFloat32Array([child]);

   Transform2Batch.applyParentInPlace(buffer, parent);

   const [result] = Transform2Batch.fromFloat32Array(buffer);
   const expected = parent.clone().multiply(child, new Transform2());
   expectTransformClose(result, expected);
  });
 });

 describe('transformPoints', () => {
  it('applies packed transforms to point list', () => {
   expect.hasAssertions();
   const transform = Transform2.fromValues(10, -5, Math.PI / 4, 2, 1);
   const transforms = Transform2Batch.toFloat32Array([transform]);
   const points = new Float32Array([3, -1]);
   const out = new Float32Array(2);

   Transform2Batch.transformPoints(points, transforms, out, 1);

   const expected = transform.transformPoint(new Vector2(3, -1));
   expect(out[0]).toBeCloseTo(expected.x, DIGITS);
   expect(out[1]).toBeCloseTo(expected.y, DIGITS);
  });
 });

 describe('setters and conversions', () => {
  it('setRotations writes deterministic cos/sin pairs', () => {
   expect.hasAssertions();
   const buffer = new Float32Array(Transform2Batch.ELEMENTS_PER_TRANSFORM);
   Transform2Batch.setIdentities(buffer, 1);

   const angles = new Float32Array([Math.PI / 3]);
   Transform2Batch.setRotations(buffer, angles, 1);

   const [result] = Transform2Batch.fromFloat32Array(buffer, 1);
   expect(result.rotation).toBeCloseTo(Math.PI / 3, DIGITS);
  });

  it('round-trips through Float32Array conversion', () => {
   expect.hasAssertions();
   const transforms = [
    Transform2.fromValues(0, 0, 0, 1, 1),
    Transform2.fromValues(5, 2, -Math.PI / 6, 3, 0.5),
   ];

   const packed = Transform2Batch.toFloat32Array(transforms);
   const unpacked = Transform2Batch.fromFloat32Array(packed);

   unpacked.forEach((actual, index) => {
    expectTransformClose(actual, transforms[index]!);
   });
  });
 });
});
