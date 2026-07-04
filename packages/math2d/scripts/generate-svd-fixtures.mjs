#!/usr/bin/env node
/**
 * @file packages/math2d/scripts/generate-svd-fixtures.mjs
 * @description Reproducible generator for Matrix2 SVD test fixtures
 *
 * Generates 30 fixture entries covering: 5 hand-derived canonical cases,
 * 10 random seeded matrices, 5 near-singular at gradient condition numbers,
 * 5 IEEE 754 boundary cases, 5 reflection-family cases.
 *
 * Each entry stores `{ M, sigma, detM, conditionExpected, note }` where
 * `sigma = [σ_x, σ_y]` is computed via the analytical identities
 *   σ_x² + σ_y² = ‖M‖_F²  (trace of MᵀM)
 *   σ_x · σ_y  = det(M)   (Convention A signed σ_y)
 * which are independent of any specific SVD implementation. The numerically
 * stable form `σ_min = |det|/σ_max` avoids catastrophic cancellation for
 * ill-conditioned matrices.
 *
 * Reproducibility: Mulberry32 PRNG with seed 0x3a39e21c (matches the V10
 * Fixture-generator pattern: deterministic inputs, hex-encoded Float64 outputs.
 * this script produces byte-identical output.
 *
 * Usage: `node packages/math2d/scripts/generate-svd-fixtures.mjs`
 * Writes to: `packages/math2d/test/core/matrix2-svd-fixtures.json`
 */

import { writeFileSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SEED = 0x3a39e21c;
const __dirname = dirname(fileURLToPath(import.meta.url));
const OUTPUT_PATH = join(__dirname, '..', 'test', 'core', 'matrix2-svd-fixtures.json');

/**
 * Mulberry32 PRNG — seedable, fast, sufficient for fixture generation
 *
 * @param {number} seed - 32-bit unsigned seed
 * @returns {() => number} A function returning floats in [0, 1)
 */
function mulberry32(seed) {
 let state = seed | 0;
 return () => {
  state = (state + 0x6d2b79f5) | 0;
  let t = Math.imul(state ^ (state >>> 15), 1 | state);
  t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
 };
}

/**
 * Computes (σ_x, σ_y) analytically from M's components via trace/det identities
 *
 * @param {number} m00 - Matrix2 m00 component (column-major)
 * @param {number} m01 - Matrix2 m01 component
 * @param {number} m10 - Matrix2 m10 component
 * @param {number} m11 - Matrix2 m11 component
 * @returns {[number, number]} [σ_x, σ_y] under Convention A (signed σ_y)
 */
function computeSigma(m00, m01, m10, m11) {
 const traceSq = m00 * m00 + m01 * m01 + m10 * m10 + m11 * m11;
 const det = m00 * m11 - m10 * m01;

 if (traceSq === 0) {
  return [0, 0];
 }

 const detSq = det * det;
 // AM-GM guarantees traceSq² ≥ 4·detSq for real matrices; clamp to 0 to
 // protect against floating-point round-off below the boundary.
 const discriminantSq = traceSq * traceSq - 4 * detSq;
 const discriminant = Math.sqrt(Math.max(0, discriminantSq));

 const sigmaMaxSq = (traceSq + discriminant) / 2;
 const sigmaMax = Math.sqrt(sigmaMaxSq);

 if (sigmaMax === 0) {
  return [0, 0];
 }

 // Convention A: σ_y carries the sign of det(M). The numerically stable form
 // σ_min = |det|/σ_max (vs the cancellation-prone (traceSq − discriminant)/2)
 // preserves precision for ill-conditioned matrices.
 const sigmaY = det / sigmaMax;
 return [sigmaMax, sigmaY];
}

/**
 * Frobenius norm of a 2×2 matrix
 *
 * @param {number} m00 - Matrix2 m00 component (column-major)
 * @param {number} m01 - Matrix2 m01 component
 * @param {number} m10 - Matrix2 m10 component
 * @param {number} m11 - Matrix2 m11 component
 * @returns {number} The Frobenius norm
 */
function frobeniusNorm(m00, m01, m10, m11) {
 return Math.sqrt(m00 * m00 + m01 * m01 + m10 * m10 + m11 * m11);
}

/**
 * Constructs a fixture entry from raw components and a description note
 *
 * @param {number[]} M - [m00, m01, m10, m11] in column-major order
 * @param {string} note - Description of the fixture case
 * @returns {object} Fixture entry with M, sigma, detM, conditionExpected, note
 */
function makeFixture(M, note) {
 const [m00, m01, m10, m11] = M;
 const sigma = computeSigma(m00, m01, m10, m11);
 const detM = m00 * m11 - m10 * m01;
 const fNorm = frobeniusNorm(m00, m01, m10, m11);
 // Condition number κ = σ_max / |σ_min|; for singular σ_min = 0 → +Infinity.
 const conditionExpected = sigma[1] === 0 ? Infinity : sigma[0] / Math.abs(sigma[1]);
 return {
  M,
  sigma,
  detM,
  fNorm,
  conditionExpected,
  note,
 };
}

const fixtures = [];

// 5 hand-derived canonical cases
fixtures.push(
 makeFixture([1, 0, 0, 1], 'Identity matrix; σ = (1, 1), det = 1'),
 makeFixture([0, 0, 0, 0], 'Zero matrix; σ = (0, 0), det = 0'),
 makeFixture(
  [Math.cos(Math.PI / 4), Math.sin(Math.PI / 4), -Math.sin(Math.PI / 4), Math.cos(Math.PI / 4)],
  'Pure rotation π/4; σ = (1, 1), det = 1',
 ),
 makeFixture([3, 0, 0, 2], 'Pure axis-aligned scale (3, 2); σ = (3, 2), det = 6'),
 makeFixture(
  [1, 0, 0, -1],
  'Reflection diag(1, -1); σ = (1, -1), det = -1 (Convention A signed σ_y)',
 ),
);

// 10 random seeded matrices (Mulberry32, integer-valued in [-100, 100] range)
const rng = mulberry32(SEED);
for (let i = 0; i < 10; i++) {
 const m00 = Math.floor(rng() * 201) - 100;
 const m01 = Math.floor(rng() * 201) - 100;
 const m10 = Math.floor(rng() * 201) - 100;
 const m11 = Math.floor(rng() * 201) - 100;
 fixtures.push(
  makeFixture(
   [m00, m01, m10, m11],
   `Random seeded #${i + 1}: M = [[${m00}, ${m10}], [${m01}, ${m11}]] (row notation)`,
  ),
 );
}

// 5 near-singular at gradient condition numbers
const conditions = [1e6, 1e9, 1e12, 1e14, 1e15];
for (const cond of conditions) {
 const sigmaMin = 1 / cond;
 fixtures.push(
  makeFixture(
   [1, 0, 0, sigmaMin],
   `Near-singular diag(1, 1/${cond.toExponential(0)}); σ = (1, ${sigmaMin}), κ = ${cond.toExponential(0)}`,
  ),
 );
}

// 5 IEEE 754 boundary cases
//
// All fixtures stay within the analytical oracle's representable range:
// `traceSq²` and `4·detSq` MUST both be finite (i.e., < MAX_VALUE ≈ 1.8e308).
// Components bounded by ~1e75 keep `traceSq² = (a²+b²+c²+d²)² ≤ 4e300 < ∞`.
// More extreme regimes (subnormal MIN_VALUE, uniform 1e150, etc.) are tested
// directly in the boundary spec (Phase 12) without analytical fixtures.
fixtures.push(
 makeFixture(
  [1, 0, 0, Number.EPSILON],
  'Identity perturbed by EPSILON in m11; σ = (1, EPSILON), κ ≈ 4.5e15',
 ),
 makeFixture(
  [1e-150, 0, 0, 1e-150],
  'Tiny uniform scale near the underflow regime; σ = (1e-150, 1e-150), κ = 1',
 ),
 makeFixture([1, 2, 1, 2], 'Rank-1 outer product; σ_min = 0 exactly, det = 0'),
 makeFixture(
  [1, 0, 0, 1e-150],
  'Very ill-conditioned diag matrix; σ = (1, 1e-150), κ = 1e150 — analytical oracle limit',
 ),
 makeFixture(
  [1e75, 0, 0, 1e75],
  'Near-large-scale uniform; σ = (1e75, 1e75), κ = 1 — fixture below traceSq² overflow boundary',
 ),
);

// 5 reflection-family cases (det < 0)
fixtures.push(
 makeFixture([2, 0, 0, -3], 'Mixed-sign scale diag(2, -3); det = -6'),
 makeFixture(
  [0, 1, 1, 0],
  'Anti-diagonal swap [[0, 1], [1, 0]] (row notation); det = -1, reflection',
 ),
 makeFixture([-1, 0, 0, 1], 'Reflection across y-axis; det = -1'),
 makeFixture(
  [Math.cos(Math.PI / 6), 0, 0, -Math.cos(Math.PI / 6)],
  'Scaled reflection; det = -cos²(π/6) ≈ -0.75',
 ),
 makeFixture([2, 1, 1, -2], 'General reflection-class matrix; det = -5'),
);

if (fixtures.length !== 30) {
 throw new Error(`Expected 30 fixtures, got ${fixtures.length}`);
}

// Verify trace/det identity holds for every fixture (sanity check the generator).
// Detects three failure modes: σ produced NaN, σ produced wrong value (trace
// identity), or σ produced wrong sign (det identity).
for (const f of fixtures) {
 const [m00, m01, m10, m11] = f.M;
 const traceSqExpected = m00 * m00 + m01 * m01 + m10 * m10 + m11 * m11;
 const detExpected = m00 * m11 - m10 * m01;
 if (Number.isNaN(f.sigma[0]) || Number.isNaN(f.sigma[1])) {
  throw new Error(`Sigma is NaN for fixture "${f.note}": [${f.sigma[0]}, ${f.sigma[1]}]`);
 }
 const traceSqActual = f.sigma[0] * f.sigma[0] + f.sigma[1] * f.sigma[1];
 const detActual = f.sigma[0] * f.sigma[1];
 const traceTol = 1e-10 * Math.max(1, traceSqExpected);
 const detTol = 1e-10 * Math.max(1, Math.abs(detExpected));
 if (Number.isFinite(traceSqExpected) && Math.abs(traceSqActual - traceSqExpected) > traceTol) {
  throw new Error(
   `Trace identity failed for fixture "${f.note}": ${traceSqActual} vs ${traceSqExpected}`,
  );
 }
 if (Number.isFinite(detExpected) && Math.abs(detActual - detExpected) > detTol) {
  throw new Error(`Det identity failed for fixture "${f.note}": ${detActual} vs ${detExpected}`);
 }
}

const output = {
 generatedBy: 'packages/math2d/scripts/generate-svd-fixtures.mjs',
 seed: `0x${SEED.toString(16)}`,
 count: fixtures.length,
 schema: {
  M: '[m00, m01, m10, m11] (column-major Matrix2)',
  sigma: '[σ_x, σ_y] under Convention A (signed σ_y)',
  detM: 'm00·m11 − m10·m01',
  fNorm: '√(m00² + m01² + m10² + m11²)',
  conditionExpected: 'σ_x / |σ_y|, +Infinity for σ_y = 0',
  note: 'Human-readable description',
 },
 fixtures,
};

writeFileSync(OUTPUT_PATH, JSON.stringify(output, null, 2) + '\n');
// eslint-disable-next-line no-undef -- Node.js globals (console) not in this file's eslint env
console.log(`Generated ${fixtures.length} fixtures → ${OUTPUT_PATH}`);
