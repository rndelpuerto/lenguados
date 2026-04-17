/**
 * @file packages/math2d/adapters/gl-matrix-adapter.ts
 * @description gl-matrix adapter for cross-library comparison
 *
 * Maps gl-matrix's functional API (vec2.*, mat3.*) to the standard
 * operation vocabulary. Uses gl-matrix's native idiom: pre-allocated
 * Float32Array output buffers.
 *
 * gl-matrix v3.x uses Float32Array-backed typed arrays for all types.
 * vec2 = Float32Array(2), mat3 = Float32Array(9).
 */

import { vec2, vec3, mat3 } from 'gl-matrix';
import { createRequire } from 'node:module';

import type { LibraryAdapter, OperationFn } from '../../../harness/library-adapter.ts';

/**
 * Create a LibraryAdapter wrapping gl-matrix for cross-library comparison
 *
 * @returns A LibraryAdapter mapping gl-matrix operations to the standard vocabulary
 */
export function createGlMatrixAdapter(): LibraryAdapter {
 // Pre-allocate ALL test data (gl-matrix native idiom: typed arrays).
 // No allocations inside benchmark closures — fair comparison.
 const a = vec2.fromValues(3.5, 7.2);
 const b = vec2.fromValues(1.1, 4.8);
 const out = vec2.create();
 const crossOut = vec3.create();
 // Pre-allocate vec3 representations for cross product (avoids per-call allocation)
 const a3 = vec3.fromValues(3.5, 7.2, 0);
 const b3 = vec3.fromValues(1.1, 4.8, 0);
 const scaleVec = vec2.fromValues(2.0, 1.5);
 const m1 = mat3.fromRotation(mat3.create(), 0.7);
 const m2Rotation = mat3.fromRotation(mat3.create(), 1.2);
 const mOut = mat3.create();
 // Extract the 2x2 linear submatrix from m1 for vector transform (no translation)
 const m1Linear = mat3.create();
 m1Linear[0] = m1[0]!;
 m1Linear[1] = m1[1]!;
 m1Linear[3] = m1[3]!;
 m1Linear[4] = m1[4]!;
 m1Linear[8] = 1;

 const ops = new Map<string, OperationFn>();

 // Vector operations
 ops.set('vectorAdd', () => vec2.add(out, a, b));
 ops.set('vectorSubtract', () => vec2.sub(out, a, b));
 ops.set('vectorScale', () => vec2.scale(out, a, 2.5));
 ops.set('vectorDot', () => vec2.dot(a, b));
 // vec3.cross with pre-allocated vec3 inputs (no per-call allocation)
 ops.set('vectorCross', () => vec3.cross(crossOut, a3, b3));
 ops.set('vectorMagnitude', () => vec2.length(a));
 ops.set('vectorNormalize', () => vec2.normalize(out, a));
 ops.set('vectorDistance', () => vec2.distance(a, b));
 ops.set('vectorLerp', () => vec2.lerp(out, a, b, 0.5));

 // Matrix operations (gl-matrix mat3 = 3x3 matrix)
 ops.set('matrixMultiply', () => mat3.multiply(mOut, m1, m2Rotation));
 ops.set('matrixTranspose', () => mat3.transpose(mOut, m1));
 ops.set('matrixDeterminant', () => mat3.determinant(m1));
 ops.set('matrixInvert', () => mat3.invert(mOut, m1));
 ops.set('matrixFromRotation', () => mat3.fromRotation(mOut, 0.7));
 // Pre-allocated scale vector — no allocation per call
 ops.set('matrixFromScale', () => mat3.fromScaling(mOut, scaleVec));
 // transformPoint: full affine transform (includes translation)
 ops.set('matrixTransformPoint', () => vec2.transformMat3(out, a, m1));
 // transformVector: linear part only (no translation) — use zeroed-translation matrix
 ops.set('matrixTransformVector', () => vec2.transformMat3(out, a, m1Linear));

 // Rotation operations
 // gl-matrix has no dedicated Rotation2 type — rotations are mat3
 ops.set('rotationFromAngle', () => mat3.fromRotation(mOut, 0.5));
 // Compose two rotation matrices (both are pure rotations)
 ops.set('rotationMultiply', () => mat3.multiply(mOut, m1, m2Rotation));
 ops.set('rotationApplyToVector', () => vec2.transformMat3(out, a, m1));

 // Version from package.json via ESM-compatible createRequire
 let version = '3.4.3';
 try {
  const require = createRequire(import.meta.url);
  const pkg = require('gl-matrix/package.json') as { version: string };
  version = pkg.version;
 } catch {
  // Use default version if package.json not accessible
 }

 return {
  name: 'gl-matrix',
  version,
  getOperations() {
   return ops;
  },
 };
}
