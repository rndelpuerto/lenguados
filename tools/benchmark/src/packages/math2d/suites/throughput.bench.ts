/**
 * Throughput benchmark suite.
 *
 * Measures batch processing performance: transforming arrays of
 * 1000+ elements. Tests both allocating and pre-allocated output paths.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

const BATCH_SIZE = 1000;

export const defineSuite = definePackageSuite({
 name: 'throughput',
 entity: 'Vector2',
 extract: ['Vector2', 'Matrix3'],
 // Both builds — assertion overhead is amplified at 1000x batch scale.
 // Both determinism modes for fdlibm vs native throughput comparison.
 dimensions: {
  determinism: ['fdlibm', 'native'],
 },

 register(add, _triality, { Vector2: V2, Matrix3: M3 }) {
  // Pre-allocate input array
  const inputVectors: unknown[] = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
   inputVectors.push(V2.fromValues(Math.random() * 100, Math.random() * 100));
  }

  // Pre-allocate output array
  const outputVectors: unknown[] = [];
  for (let i = 0; i < BATCH_SIZE; i++) {
   outputVectors.push(V2.fromValues(0, 0));
  }

  const matrix = M3.fromRotation(0.7);
  const scalarT = 0.5;
  const target = V2.fromValues(50, 50);

  // Batch transform by matrix (pre-allocated)
  add(`transformPoint ×${BATCH_SIZE} (pre-alloc)`, () => {
   for (let i = 0; i < BATCH_SIZE; i++) {
    M3.transformPoint(matrix, inputVectors[i], outputVectors[i]);
   }
   return outputVectors[BATCH_SIZE - 1];
  });

  // Batch transform by matrix (allocating)
  add(`transformPoint ×${BATCH_SIZE} (alloc)`, () => {
   let last: unknown;
   for (let i = 0; i < BATCH_SIZE; i++) {
    last = M3.transformPoint(matrix, inputVectors[i]);
   }
   return last;
  });

  // Batch normalize (pre-allocated)
  add(`normalize ×${BATCH_SIZE} (pre-alloc)`, () => {
   for (let i = 0; i < BATCH_SIZE; i++) {
    V2.normalize(inputVectors[i], outputVectors[i]);
   }
   return outputVectors[BATCH_SIZE - 1];
  });

  // Batch normalize (allocating)
  add(`normalize ×${BATCH_SIZE} (alloc)`, () => {
   let last: unknown;
   for (let i = 0; i < BATCH_SIZE; i++) {
    last = V2.normalize(inputVectors[i]);
   }
   return last;
  });

  // Batch lerp (pre-allocated)
  add(`lerp ×${BATCH_SIZE} (pre-alloc)`, () => {
   for (let i = 0; i < BATCH_SIZE; i++) {
    V2.lerp(inputVectors[i], target, scalarT, outputVectors[i]);
   }
   return outputVectors[BATCH_SIZE - 1];
  });

  // Batch dot product (scalar — no allocation)
  add(`dot ×${BATCH_SIZE}`, () => {
   let sum = 0;
   for (let i = 0; i < BATCH_SIZE - 1; i++) {
    sum += V2.dot(inputVectors[i], inputVectors[i + 1]);
   }
   return sum;
  });

  // Batch magnitude (scalar — no allocation)
  add(`magnitude ×${BATCH_SIZE}`, () => {
   let sum = 0;
   for (let i = 0; i < BATCH_SIZE; i++) {
    sum += V2.magnitude(inputVectors[i]);
   }
   return sum;
  });
 },
});
