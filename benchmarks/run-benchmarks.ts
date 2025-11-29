/* eslint-env node */
/* global console, process */
/* eslint-disable no-console */
import { Bench } from 'tinybench';

import { SimdDetector } from '../packages/math2d/src/batch/simd/detector';
import { Vector2BatchSimd } from '../packages/math2d/src/batch/simd/vector2-simd';
import { Transform2Batch } from '../packages/math2d/src/batch/transform2-batch';
import { Vector2Batch } from '../packages/math2d/src/batch/vector2-batch';
import { Matrix2 } from '../packages/math2d/src/core/matrix2';
import { Transform2 } from '../packages/math2d/src/core/transform2';

async function main(): Promise<void> {
 const COUNT = 2048;
 const source = new Vector2Batch(COUNT);
 source.x.fill(1);
 source.y.fill(0.5);

 const rotateOut = new Vector2Batch(COUNT);
 const matrixOut = new Vector2Batch(COUNT);
 const transformOut = new Vector2Batch(COUNT);

 const rotationMatrix = Matrix2.fromRotation(Math.PI / 3);
 const transform = Transform2.fromValues(3, -1, Math.PI / 4, 1.5, 0.75);
 const packedTransforms = Transform2Batch.toFloat32Array([transform]);

 const simdSupported = SimdDetector.detect();
 console.log(
  `SIMD support: ${simdSupported ? 'available' : 'unavailable'} | implementation registered: ${Vector2BatchSimd.isEnabled()}`,
 );

 const bench = new Bench({
  time: 500,
  warmupIterations: 5,
 });

 bench
  .add('Vector2Batch.rotate', () => {
   source.rotate(Math.PI / 3, rotateOut);
  })
  .add('Vector2Batch.transformMatrix', () => {
   source.transformMatrix(rotationMatrix, matrixOut);
  })
  .add('Vector2Batch.transformTransform', () => {
   source.transformTransform(transform, transformOut);
  })
  .add('Vector2Batch.transformByPackedTransforms', () => {
   source.transformByPackedTransforms(packedTransforms, undefined, transformOut);
  });

 await bench.run();

 const results = bench.tasks.map((task) => ({
  name: task.name,
  'ops/sec': task.result?.hz ?? 0,
  'mean (ms)': (task.result?.mean ?? 0) * 1000,
  samples: task.result?.samples?.length ?? 0,
 }));

 console.table(results);
}

void main().catch((error) => {
 console.error(error);
 process.exitCode = 1;
});
