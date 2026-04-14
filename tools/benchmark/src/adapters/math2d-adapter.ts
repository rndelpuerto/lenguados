/**
 * math2d self-adapter for cross-library comparison.
 *
 * Wraps @lenguados/math2d into the LibraryAdapter interface using
 * the library's standard configuration (default tier + fdlibm).
 * Enables apples-to-apples comparison against competitor libraries.
 */

import { createRequire } from 'node:module';

import type { LibraryAdapter, OperationFn } from '../harness/library-adapter.ts';
import { loadMath2d, getConfig } from '../harness/math2d-loader.ts';

export interface Math2dAdapterOptions {
 /** Validation tier to use: 'default' | 'unchecked'. Default: 'default'. */
 tier?: 'default' | 'unchecked';
 /** Build mode: 'development' | 'production'. Default: 'production'. */
 buildMode?: 'development' | 'production';
}

export async function createMath2dAdapter(
 options: Math2dAdapterOptions = {},
): Promise<LibraryAdapter> {
 const tier = options.tier ?? 'default';
 const buildMode = options.buildMode ?? 'production';

 const mod = await loadMath2d(buildMode);
 const config = getConfig(mod);
 config.useNativeMath = false;

 const Vector2 = mod['Vector2'] as any;
 const Matrix3 = mod['Matrix3'] as any;
 const Rotation2 = mod['Rotation2'] as any;

 let version = '0.0.0';
 try {
  const require = createRequire(import.meta.url);
  const pkg = require('../../../packages/math2d/package.json') as { version: string };
  version = pkg.version;
 } catch {
  // Fallback if package.json not accessible
 }

 // Pre-allocate test data
 const a = Vector2.fromValues(3.5, 7.2);
 const b = Vector2.fromValues(1.1, 4.8);
 const out = Vector2.fromValues(0, 0);
 const m1 = Matrix3.fromRotation(0.7);
 const m2 = Matrix3.fromScale(2.0, 1.5);
 const mOut = Matrix3.fromValues(0, 0, 0, 0, 0, 0, 0, 0, 0);
 const r1 = Rotation2.fromAngle(0.5);
 const r2 = Rotation2.fromAngle(1.2);
 const rOut = Rotation2.fromAngle(0);

 const suffix = tier === 'unchecked' ? 'Unchecked' : '';

 const ops = new Map<string, OperationFn>();

 // Vector operations
 ops.set('vectorAdd', () => Vector2.add(a, b, out));
 ops.set('vectorSubtract', () => Vector2.subtract(a, b, out));
 ops.set('vectorScale', () => Vector2.multiplyScalar(a, 2.5, out));
 ops.set('vectorDot', () => Vector2.dot(a, b));
 ops.set('vectorCross', () => Vector2.cross(a, b));
 ops.set('vectorMagnitude', () => Vector2.magnitude(a));
 ops.set('vectorNormalize', () =>
  (Vector2 as any)[`normalize${suffix}`](a, out),
 );
 ops.set('vectorDistance', () => Vector2.distance(a, b));
 ops.set('vectorLerp', () => Vector2.lerp(a, b, 0.5, out));

 // Matrix operations
 ops.set('matrixMultiply', () => Matrix3.multiply(m1, m2, mOut));
 ops.set('matrixTranspose', () => Matrix3.transpose(m1, mOut));
 ops.set('matrixDeterminant', () => Matrix3.determinant(m1));
 ops.set('matrixInvert', () =>
  (Matrix3 as any)[`inverse${suffix}`](m1, mOut),
 );
 ops.set('matrixFromRotation', () => Matrix3.fromRotation(0.7, mOut));
 ops.set('matrixFromScale', () => Matrix3.fromScale(2.0, 1.5, mOut));
 ops.set('matrixTransformPoint', () => Matrix3.transformPoint(m1, a, out));
 ops.set('matrixTransformVector', () => Matrix3.transformVector(m1, a, out));

 // Rotation operations
 ops.set('rotationFromAngle', () => Rotation2.fromAngle(0.5, rOut));
 ops.set('rotationMultiply', () => Rotation2.multiply(r1, r2, rOut));
 ops.set('rotationApplyToVector', () => Rotation2.apply(r1, a, out));

 return {
  name: `math2d${tier === 'unchecked' ? ' (unchecked)' : ''}`,
  version,
  getOperations() { return ops; },
 };
}
