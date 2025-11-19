/**
 * @file src/angle.ts
 * @module math2d/angle
 * @description Angular utilities for the Lenguado physics-engine family.
 *
 * This module defines robust, well-specified operations on angles:
 * - Normalization to canonical ranges
 * - Shortest-arc differences and distances
 * - CCW sweep tests and lengths
 * - Angle-aware interpolation, bisectors, circular means
 * - Snapping to angular grids and unwrapping sequences
 *
 * Conventions:
 * - Radian-based APIs are primary; degree-based helpers are thin wrappers.
 * - Half-open intervals are used consistently, e.g. [-PI, PI) and [0, TAU).
 */

import { wrap } from './numeric';
import { PI, TAU, DEG2RAD, RAD2DEG, EPSILON } from './scalar';

/* =============================================================================
 * Conversions
 * =============================================================================
 */

/**
 * Converts degrees to radians.
 * @param {number} deg
 * @returns {number} Radians.
 */
export function toRadians(deg: number): number {
 return deg * DEG2RAD;
}

/**
 * Converts radians to degrees.
 * @param {number} rad
 * @returns {number} Degrees.
 */
export function toDegrees(rad: number): number {
 return rad * RAD2DEG;
}

/**
 * Converts radians to turns (1 turn = TAU radians).
 * @param {number} rad
 * @returns {number} Turns.
 */
export function radToTurns(rad: number): number {
 return rad / TAU;
}

/**
 * Converts turns to radians (1 turn = TAU radians).
 * @param {number} turns
 * @returns {number} Radians.
 */
export function turnsToRad(turns: number): number {
 return turns * TAU;
}

/* =============================================================================
 * Normalization
 * =============================================================================
 */

/**
 * Normalizes an angle (radians) to [0, TAU).
 * @param {number} theta
 * @returns {number} Angle in [0, TAU).
 */
export function normalizeRadiansPositive(theta: number): number {
 return wrap(theta, 0, TAU);
}

/**
 * Normalizes an angle (radians) to [-PI, PI).
 * @param {number} theta
 * @returns {number} Angle in [-PI, PI).
 */
export function normalizeRadiansSigned(theta: number): number {
 return wrap(theta, -PI, PI);
}

/**
 * Normalizes an angle (degrees) to [0, 360).
 * @param {number} deg
 * @returns {number} Degrees in [0, 360).
 */
export function normalizeDegreesPositive(deg: number): number {
 return wrap(deg, 0, 360);
}

/**
 * Normalizes an angle (degrees) to [-180, 180).
 * @param {number} deg
 * @returns {number} Degrees in [-180, 180).
 */
export function normalizeDegreesSigned(deg: number): number {
 return wrap(deg, -180, 180);
}

/**
 * Normalizes an angle (radians) to the half-open interval [center - PI, center + PI).
 * Useful to keep continuity around a moving reference.
 * @param {number} theta
 * @param {number} center
 * @returns {number} Angle equivalent to theta and closest to center.
 */
export function normalizeAroundRadians(theta: number, center: number): number {
 return wrap(theta, center - PI, center + PI);
}

/**
 * Normalizes an angle (degrees) to [centerDeg - 180, centerDeg + 180).
 * @param {number} deg
 * @param {number} centerDeg
 * @returns {number} Degrees equivalent to deg and closest to centerDeg.
 */
export function normalizeAroundDegrees(deg: number, centerDeg: number): number {
 return wrap(deg, centerDeg - 180, centerDeg + 180);
}

/* =============================================================================
 * Differences, distances & equality
 * =============================================================================
 */

/**
 * Signed shortest-arc delta in radians: rotate from `a` to `b`.
 * Result is in [-PI, PI).
 * @param {number} a
 * @param {number} b
 * @returns {number} b - a normalized to [-PI, PI).
 */
export function deltaRadians(a: number, b: number): number {
 return normalizeRadiansSigned(b - a);
}

/**
 * Absolute shortest-arc distance in radians: |deltaRadians(a, b)|.
 * @param {number} a
 * @param {number} b
 * @returns {number} Absolute shortest-arc distance in radians.
 */
export function distanceRadians(a: number, b: number): number {
 return Math.abs(deltaRadians(a, b));
}

/**
 * Signed shortest-arc delta in degrees: rotate from `a` to `b`.
 * Result is in [-180, 180).
 * @param {number} a
 * @param {number} b
 * @returns {number} b - a normalized to [-180, 180).
 */
export function deltaDegrees(a: number, b: number): number {
 return normalizeDegreesSigned(b - a);
}

/**
 * Absolute shortest-arc distance in degrees.
 * @param {number} a
 * @param {number} b
 * @returns {number} Absolute shortest-arc distance in degrees.
 */
export function distanceDegrees(a: number, b: number): number {
 return Math.abs(deltaDegrees(a, b));
}

/**
 * Angle equality under wrap: true if shortest-arc distance ≤ eps.
 * @param {number} a - Radians.
 * @param {number} b - Radians.
 * @param {number} [eps=EPSILON]
 * @returns {boolean} True if shortest-arc distance ≤ eps.
 */
export function equalsRadians(a: number, b: number, eps: number = EPSILON): boolean {
 return distanceRadians(a, b) <= eps;
}

/**
 * Angle equality under wrap (degrees): true if shortest-arc distance ≤ eps.
 * @param {number} a - Degrees.
 * @param {number} b - Degrees.
 * @param {number} [eps=EPSILON]
 * @returns {boolean} True if shortest-arc distance ≤ eps.
 */
export function equalsDegrees(a: number, b: number, eps: number = EPSILON): boolean {
 return distanceDegrees(a, b) <= eps;
}

/**
 * Returns an angle equivalent to `target` that is the closest representation to `reference`.
 * In radians.
 * @param {number} target
 * @param {number} reference
 * @returns {number} Angle equivalent to `target` that is the closest representation to `reference`.
 */
export function closestEquivalentRadians(target: number, reference: number): number {
 return normalizeAroundRadians(target, reference);
}

/**
 * Degrees variant of `closestEquivalentRadians`.
 * @param {number} targetDeg
 * @param {number} referenceDeg
 * @returns {number} Angle equivalent to `targetDeg` that is the closest representation to `referenceDeg`.
 */
export function closestEquivalentDegrees(targetDeg: number, referenceDeg: number): number {
 return normalizeAroundDegrees(targetDeg, referenceDeg);
}

/* =============================================================================
 * CCW sweeps & membership
 * =============================================================================
 */

/**
 * Counter-clockwise sweep length from a → b in radians, in [0, TAU).
 * @param {number} a
 * @param {number} b
 * @returns {number} Counter-clockwise sweep length from a → b in radians, in [0, TAU).
 */
export function sweepLengthCCW(a: number, b: number): number {
 return normalizeRadiansPositive(b - a);
}

/**
 * Degrees variant of `sweepLengthCCW`, in [0, 360).
 * @param {number} aDeg
 * @param {number} bDeg
 * @returns {number} Counter-clockwise sweep length from a → b in degrees, in [0, 360).
 */
export function sweepLengthCCWDegrees(aDeg: number, bDeg: number): number {
 return normalizeDegreesPositive(bDeg - aDeg);
}

/**
 * Tests if `theta` lies on the CCW arc from `a` to `b`.
 * Uses half-open logic with epsilon:
 *  - inclusive=true: 0 - eps ≤ atan(θ) ≤ sweep + eps
 *  - inclusive=false: 0 + eps < atan(θ) < sweep - eps
 * @param {number} a
 * @param {number} b
 * @param {number} theta
 * @param {boolean} [inclusive=true]
 * @param {number} [eps=EPSILON]
 * @returns {boolean} True if `theta` lies on the CCW arc from `a` to `b`.
 */
export function isBetweenCCW(
 a: number,
 b: number,
 theta: number,
 inclusive: boolean = true,
 eps: number = EPSILON,
): boolean {
 const sweep = sweepLengthCCW(a, b);
 const off = normalizeRadiansPositive(theta - a);

 return inclusive ? off <= sweep + eps : off > eps && off < sweep - eps;
}

/**
 * Degrees variant of `isBetweenCCW`.
 * @param {number} aDeg
 * @param {number} bDeg
 * @param {number} thetaDeg
 * @param {boolean} [inclusive=true]
 * @param {number} [eps=EPSILON]
 * @returns {boolean} True if `theta` lies on the CCW arc from `a` to `b`.
 */
export function isBetweenCCWDegrees(
 aDeg: number,
 bDeg: number,
 thetaDeg: number,
 inclusive: boolean = true,
 eps: number = EPSILON,
): boolean {
 const sweep = sweepLengthCCWDegrees(aDeg, bDeg);
 const off = normalizeDegreesPositive(thetaDeg - aDeg);

 return inclusive ? off <= sweep + eps : off > eps && off < sweep - eps;
}

/* =============================================================================
 * Interpolation, bisectors & means
 * =============================================================================
 */

/**
 * Angle-aware interpolation (radians) along the shortest arc.
 * Works for any real t (not only [0, 1]). Output is normalized near `a` to avoid jumps.
 * @param {number} a
 * @param {number} b
 * @param {number} t
 * @returns {number} Interpolated angle, in [a-PI, a+PI).
 */
export function lerpRadians(a: number, b: number, t: number): number {
 const d = deltaRadians(a, b);

 return normalizeAroundRadians(a + d * t, a);
}

/**
 * Degrees variant of `lerpRadians`.
 * @param {number} aDeg
 * @param {number} bDeg
 * @param {number} t
 * @returns {number} Interpolated angle, in [a-PI, a+PI).
 */
export function lerpDegrees(aDeg: number, bDeg: number, t: number): number {
 const a = toRadians(aDeg);
 const b = toRadians(bDeg);

 return toDegrees(lerpRadians(a, b, t));
}

/**
 * Circular bisector (radians): halfway from a to b along the shortest arc.
 * @param {number} a
 * @param {number} b
 * @returns {number} Angle in [a-PI, a+PI).
 */
export function bisectorRadians(a: number, b: number): number {
 return normalizeAroundRadians(a + deltaRadians(a, b) * 0.5, a);
}

/**
 * Degrees variant of `bisectorRadians`.
 * @param {number} aDeg
 * @param {number} bDeg
 * @returns {number} Angle in [a-PI, a+PI).
 */
export function bisectorDegrees(aDeg: number, bDeg: number): number {
 return toDegrees(bisectorRadians(toRadians(aDeg), toRadians(bDeg)));
}

/**
 * Circular mean (radians). If weights are provided, computes the weighted circular mean.
 * Returns NaN if the resultant vector has (near) zero magnitude (ambiguous mean) or input is empty.
 * @param {number[]} angles - Radians.
 * @param {number[]} [weights] - Non-negative weights, same length as `angles`.
 * @returns {number} Circular mean (radians).
 */
export function meanRadians(angles: number[], weights?: number[]): number {
 const n = angles.length;

 if (n === 0) return NaN;

 let sumSin = 0;
 let sumCos = 0;

 if (weights !== undefined) {
  if (weights.length !== n) {
   throw new RangeError('meanRadians: weights length mismatch');
  }

  for (let index = 0; index < n; index++) {
   const a = angles[index];
   const w = weights[index];

   if (a === undefined) throw new TypeError('meanRadians: angles array contains holes');
   if (w === undefined) throw new TypeError('meanRadians: weights array contains holes');
   if (w < 0) throw new RangeError('meanRadians: weights must be non-negative');
   if (w === 0) continue;

   sumCos += Math.cos(a) * w;
   sumSin += Math.sin(a) * w;
  }
 } else {
  for (let index = 0; index < n; index++) {
   const a = angles[index];

   if (a === undefined) throw new TypeError('meanRadians: angles array contains holes');

   sumCos += Math.cos(a);
   sumSin += Math.sin(a);
  }
 }

 const mag = Math.hypot(sumCos, sumSin);
 if (mag <= EPSILON) return NaN;

 return Math.atan2(sumSin, sumCos); // Already in [-PI, PI)
}

/**
 * Degrees variant of `meanRadians`.
 * @param {number[]} degAngles
 * @param {number[]} [weights]
 * @returns {number} Circular mean (degrees).
 */
export function meanDegrees(degAngles: number[], weights?: number[]): number {
 const radAngles = degAngles.map(toRadians);
 const m = meanRadians(radAngles, weights);

 return Number.isNaN(m) ? NaN : toDegrees(m);
}

/* =============================================================================
 * Snapping / quantization on the circle
 * =============================================================================
 */

/**
 * Snaps an angle (radians) to the nearest multiple of `stepRad` around `originRad`.
 * The result is an angle equivalent to `origin + k*step` that is closest to `theta`.
 * If |stepRad| ≤ EPS, returns `normalizeAroundRadians(theta, originRad)`.
 * @param {number} theta
 * @param {number} stepRad
 * @param {number} [originRad=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Snapped angle, in [originRad-PI, originRad+PI).
 */
export function snapRadians(
 theta: number,
 stepRad: number,
 originRad: number = 0,
 eps: number = EPSILON,
): number {
 const s = Math.abs(stepRad);
 if (s <= eps) return normalizeAroundRadians(theta, originRad);

 // Relative angle closest to origin
 const relativeAngle = deltaRadians(originRad, theta); // in [-PI, PI)
 const k = Math.round(relativeAngle / s);

 return normalizeAroundRadians(originRad + k * s, originRad);
}

/**
 * Degrees variant of `snapRadians`.
 * @param {number} deg
 * @param {number} stepDeg
 * @param {number} [originDeg=0]
 * @param {number} [eps=EPSILON]
 * @returns {number} Snapped angle, in [originDeg-PI, originDeg+PI).
 */
export function snapDegrees(
 deg: number,
 stepDeg: number,
 originDeg: number = 0,
 eps: number = EPSILON,
): number {
 return toDegrees(snapRadians(toRadians(deg), toRadians(stepDeg), toRadians(originDeg), eps));
}

/* =============================================================================
 * Unwrapping (array and streaming)
 * =============================================================================
 */

/**
 * Unwraps a sequence of angles (radians) into a continuous series by
 * taking shortest-arc steps between consecutive elements.
 *
 * If `reference` is provided, the first element is chosen equivalent to `a[0]`
 * but closest to `reference`.
 *
 * Note: large real jumps (> PI) will still choose the shortest path and may not
 * reflect true multi-turn motion—this is by design for continuity.
 *
 * @param {number[]} a - Input angles in radians.
 * @param {number} [reference] - Optional continuity reference for the first element.
 * @returns {number[]} A new array of unwrapped angles (real-valued).
 */
export function unwrapRadiansArray(a: number[], reference?: number): number[] {
 const n = a.length;

 if (n === 0) return [];

 const out = new Array<number>(n);
 const first = a[0];

 if (first === undefined) throw new TypeError('unwrapRadiansArray: input array contains holes');

 let previous = reference !== undefined ? closestEquivalentRadians(first, reference) : first;

 out[0] = previous;

 for (let index = 1; index < n; index++) {
  const ai = a[index];

  if (ai === undefined) throw new TypeError('unwrapRadiansArray: input array contains holes');

  previous = previous + deltaRadians(previous, ai); // step along shortest arc

  out[index] = previous;
 }

 return out;
}

/**
 * Degrees variant of `unwrapRadiansArray`.
 * @param {number[]} degs
 * @param {number} [referenceDeg]
 * @returns {number[]} A new array of unwrapped angles (real-valued).
 */
export function unwrapDegreesArray(degs: number[], referenceDeg?: number): number[] {
 const rads = degs.map(toRadians);
 const reference = referenceDeg === undefined ? undefined : toRadians(referenceDeg);
 const unwrapped = unwrapRadiansArray(rads, reference);

 return unwrapped.map(toDegrees);
}

/**
 * Streaming unwrapper for angles in radians.
 * Maintains continuity across calls by accumulating shortest-arc deltas.
 */
export class AngleUnwrapper {
 private _initialized = false;
 private _value = 0;

 /**
  * Feeds a new wrapped angle and returns the continuous (unwrapped) value.
  * On first call, it initializes to the provided angle.
  * @param {number} theta - Wrapped radians.
  * @returns {number} Unwrapped radians.
  */
 next(theta: number): number {
  if (!this._initialized) {
   this._value = theta;
   this._initialized = true;

   return this._value;
  }

  this._value = this._value + deltaRadians(this._value, theta);

  return this._value;
 }

 /**
  * Returns the last unwrapped value.
  * @returns {number} The last unwrapped value.
  */
 get value(): number {
  return this._value;
 }

 /**
  * Resets the internal state. If `theta` is provided, sets it as the starting value.
  * @param {number} [theta]
  * @returns {void}
  */
 reset(theta?: number): void {
  this._initialized = theta !== undefined;

  if (theta !== undefined) this._value = theta;
 }
}
