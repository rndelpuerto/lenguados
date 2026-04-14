/**
 * ULP (Units in Last Place) accuracy utilities.
 *
 * Provides IEEE 754 bit-level comparison of floating-point values,
 * hex serialization for golden files, and cancellation detection.
 * Uses Float64Array/Int32Array/Uint8Array views over shared ArrayBuffers
 * for zero-copy bit reinterpretation.
 */

import Decimal from 'decimal.js';

/* ========================================================================== */
/* Shared Buffer for Bit Reinterpretation                                      */
/* ========================================================================== */

const SHARED_BUF = new ArrayBuffer(8);
const F64 = new Float64Array(SHARED_BUF);
const I32 = new Int32Array(SHARED_BUF);
const U8 = new Uint8Array(SHARED_BUF);

/* ========================================================================== */
/* ULP Distance                                                                */
/* ========================================================================== */

/**
 * Reinterpret a float64 as an UNSIGNED 64-bit integer (BigInt).
 *
 * Uses unsigned right shift on the low word and unsigned interpretation
 * of the high word to produce a non-negative 64-bit value representing
 * the raw IEEE 754 bit pattern.
 */
function float64ToUnsignedBigInt(value: number): bigint {
 F64[0] = value;
 const lo = BigInt(I32[0]! >>> 0);
 const hi = BigInt(I32[1]! >>> 0);
 return (hi << 32n) | lo;
}

/**
 * Convert an unsigned IEEE 754 bit pattern to a monotonically ordered integer.
 *
 * IEEE 754 uses sign-magnitude, not two's complement. For positive doubles,
 * the unsigned integer representation is already ordered. For negative doubles,
 * we convert to an ordered representation by computing:
 *   ordered = 0x8000000000000000 - unsignedBits
 *
 * After this transformation, the integer distance between any two doubles
 * equals their ULP distance — including across the +0/-0 boundary.
 *
 * Reference: Bruce Dawson, "Comparing Floating Point Numbers, 2012 Edition"
 */
function toOrderedInt(unsignedBits: bigint): bigint {
 const SIGN_BIT = 0x8000000000000000n;
 if (unsignedBits & SIGN_BIT) {
  // Negative float: flip to ordered representation
  return SIGN_BIT - (unsignedBits & ~SIGN_BIT);
 }
 // Positive float: shift above the negative range
 return unsignedBits + SIGN_BIT;
}

export type UlpResult =
 | { kind: 'ulp'; distance: number }
 | { kind: 'special'; description: string };

/**
 * Compute the ULP distance between two float64 values.
 *
 * Uses the standard algorithm: convert IEEE 754 sign-magnitude bit patterns
 * to monotonically ordered integers, then take the absolute difference.
 * This correctly handles same-sign, cross-sign, and ±0 cases.
 *
 * Reference: Bruce Dawson, "Comparing Floating Point Numbers, 2012 Edition"
 *
 * Returns a descriptive string for special value mismatches
 * (NaN, Infinity, signed zero differences).
 */
export function ulpDistance(a: number, b: number): UlpResult {
 // Handle NaN
 if (Number.isNaN(a) && Number.isNaN(b)) {
  return { kind: 'ulp', distance: 0 };
 }
 if (Number.isNaN(a) || Number.isNaN(b)) {
  return {
   kind: 'special',
   description: `NaN mismatch: ${a} vs ${b}`,
  };
 }

 // Handle Infinity
 if (!Number.isFinite(a) || !Number.isFinite(b)) {
  if (a === b) return { kind: 'ulp', distance: 0 };
  return {
   kind: 'special',
   description: `Infinity mismatch: ${a} vs ${b}`,
  };
 }

 // Exact equality — IEEE 754: +0 === -0, and they are 0 ULP apart
 if (a === b) return { kind: 'ulp', distance: 0 };

 // Convert to monotonically ordered integers and take absolute difference.
 // This correctly handles same-sign, cross-sign, and subnormal cases.
 const aOrdered = toOrderedInt(float64ToUnsignedBigInt(a));
 const bOrdered = toOrderedInt(float64ToUnsignedBigInt(b));

 const distance = aOrdered > bOrdered ? aOrdered - bOrdered : bOrdered - aOrdered;

 return { kind: 'ulp', distance: Number(distance) };
}

/* ========================================================================== */
/* Hex Serialization                                                           */
/* ========================================================================== */

/**
 * Encode a float64 as a 16-character hex string (big-endian byte order).
 * Preserves all 64 bits including sign, exponent, mantissa, and signed zeros.
 */
export function float64ToHex(value: number): string {
 F64[0] = value;
 let hex = '';
 // Big-endian: read bytes from high to low
 for (let i = 7; i >= 0; i--) {
  hex += U8[i]!.toString(16).padStart(2, '0');
 }
 return hex;
}

/**
 * Decode a 16-character hex string back to a float64.
 */
export function hexToFloat64(hex: string): number {
 if (hex.length !== 16) {
  throw new Error(`Expected 16-character hex string, got ${hex.length} characters`);
 }
 for (let i = 0; i < 8; i++) {
  U8[7 - i] = parseInt(hex.slice(i * 2, i * 2 + 2), 16);
 }
 return F64[0]!;
}

/* ========================================================================== */
/* Cancellation Detection                                                      */
/* ========================================================================== */

/**
 * Measure significant bits lost due to catastrophic cancellation.
 *
 * Compares the magnitude of inputs against the magnitude of the result.
 * If the result is much smaller than the inputs, bits have been lost.
 *
 * Returns the number of bits lost (0-52). Values > 40 indicate
 * catastrophic cancellation (out of 52 mantissa bits).
 */
export function cancellationBits(a: number, b: number, result: number): number {
 const inputMagnitude = Math.max(Math.abs(a), Math.abs(b));
 const resultMagnitude = Math.abs(result);

 if (inputMagnitude === 0 || resultMagnitude === 0) return 0;
 if (!Number.isFinite(inputMagnitude) || !Number.isFinite(resultMagnitude)) return 0;

 const bitsLost = Math.log2(inputMagnitude) - Math.log2(resultMagnitude);
 return Math.max(0, Math.min(52, bitsLost));
}

/* ========================================================================== */
/* Reference Oracle (decimal.js)                                               */
/* ========================================================================== */

// Isolated 50-digit precision Decimal — does NOT mutate the global Decimal config.
// Uses Decimal.clone() to avoid affecting other decimal.js consumers in the process.
const HighPrecDecimal = Decimal.clone({ precision: 50 });

const ORACLE_FN_MAP: Record<string, (...args: InstanceType<typeof HighPrecDecimal>[]) => InstanceType<typeof HighPrecDecimal>> = {
 sin: (x) => x.sin(),
 cos: (x) => x.cos(),
 tan: (x) => x.tan(),
 asin: (x) => x.asin(),
 acos: (x) => x.acos(),
 atan: (x) => x.atan(),
 atan2: (y, x) => HighPrecDecimal.atan2(y, x),
 log: (x) => x.ln(),
 exp: (x) => x.exp(),
 pow: (base, exp) => base.pow(exp),
 hypot: (x, y) => x.pow(2).plus(y.pow(2)).sqrt(),
};

/**
 * Cache for oracle results to avoid redundant high-precision computation.
 */
const oracleCache = new Map<string, number>();

/**
 * Compute a reference value using decimal.js at 50-digit precision,
 * then round to the nearest IEEE 754 double.
 *
 * Supported functions: sin, cos, tan, asin, acos, atan, atan2,
 * log, exp, pow, hypot.
 */
export function computeReference(fn: string, ...args: number[]): number {
 const cacheKey = `${fn}(${args.join(',')})`;
 const cached = oracleCache.get(cacheKey);
 if (cached !== undefined) return cached;

 const oracleFn = ORACLE_FN_MAP[fn];
 if (!oracleFn) {
  throw new Error(`Unknown oracle function: ${fn}`);
 }

 const decimalArgs = args.map((a) => new HighPrecDecimal(a));
 const result = oracleFn(...decimalArgs);
 const doubleResult = result.toNumber();

 oracleCache.set(cacheKey, doubleResult);
 return doubleResult;
}

/**
 * Clear the oracle cache (for memory management in long stress runs).
 */
export function clearOracleCache(): void {
 oracleCache.clear();
}
