/**
 * @file packages/math2d/suites/deterministic.bench.ts
 * @description Deterministic kernel benchmark suite
 *
 * THE key suite for quantifying the determinism performance cost.
 * Benchmarks all 12 fdlibm kernel functions with both fdlibm and
 * native Math.* to measure the exact performance penalty of
 * cross-platform bit-exact determinism.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

/**
 * Define the deterministic kernel benchmark suite
 *
 * @remarks
 * Measures trigonometric, inverse-trigonometric, logarithmic, exponential,
 * hypotenuse, and combined sinCos operations under both fdlibm and native
 * determinism modes. This is the primary suite for quantifying the
 * performance cost of cross-platform determinism.
 */
export const defineSuite = definePackageSuite({
 name: 'deterministic',
 entity: 'deterministic',
 extract: [],
 // Both builds to measure assertion overhead (dev has DEV_MODE guards).
 // Both determinism modes — this is THE key suite for quantifying fdlibm cost.
 dimensions: {
  determinism: ['fdlibm', 'native'],
 },

 register(add, _triality, _modules, math2d) {
  const m = math2d;

  // Trigonometric
  add('sin(0.7)', () => m.sin(0.7));
  add('cos(0.7)', () => m.cos(0.7));
  add('tan(0.7)', () => m.tan(0.7));
  add('sin(large: 1e6)', () => m.sin(1e6));
  add('cos(large: 1e6)', () => m.cos(1e6));

  // Inverse trigonometric
  add('asin(0.5)', () => m.asin(0.5));
  add('acos(0.5)', () => m.acos(0.5));
  add('atan(1.0)', () => m.atan(1.0));
  add('atan2(1, 1)', () => m.atan2(1, 1));
  add('atan2(0.001, 1000)', () => m.atan2(0.001, 1000));

  // Logarithmic / exponential
  add('log(10)', () => m.log(10));
  add('exp(5)', () => m.exp(5));
  add('pow(2, 10)', () => m.pow(2, 10));
  add('pow(1.001, 1000)', () => m.pow(1.001, 1000));

  // Hypotenuse
  add('hypot(3, 4)', () => m.hypot(3, 4));
  add('hypot(1e154, 1e154)', () => m.hypot(1e154, 1e154));

  // Combined sin+cos
  add('sinCos(0.7)', () => m.sinCos(0.7));
  add('sinCos(large: 1e6)', () => m.sinCos(1e6));
 },
});
