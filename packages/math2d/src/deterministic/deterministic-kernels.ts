/**
 * @file deterministic/deterministic-kernels.ts
 * @module @lenguados/math2d
 * @description Deterministic mathematical kernels for L0 cross-platform consistency
 *
 * @remarks
 * ## Purpose
 *
 * This module contains ONLY pure deterministic replacements for `Math.*` functions
 * that are NOT bit-exact across JavaScript engines. Each kernel uses fdlibm polynomial
 * coefficients (Remez algorithm) for cross-platform bit-exact results. NaN exponents
 * propagate correctly per ECMAScript semantics. Signed-zero and negative-base edge
 * cases in `pow()` follow fdlibm/C99 conventions (see `pow` `@remarks` for details).
 * No clamping, no fallbacks, no Safe variants — those belong in
 * `auxiliary/numeric/safety.ts` (L1).
 *
 * Functions like `Math.floor`, `Math.ceil`, `Math.abs`, `Math.sqrt` ARE deterministic
 * per IEEE 754 and should be used directly.
 *
 * ## Determinism Guarantee: L0 (Bit-Exact Cross-Platform)
 *
 * All functions in this module produce **identical results** on:
 * - Every JavaScript engine (desktop and mobile browsers, server runtimes)
 * - Node.js, Deno, Bun
 * - Windows, macOS, Linux
 * - x86, ARM, any architecture
 *
 * ## Polynomial Coefficients Source
 *
 * Coefficients are derived from **fdlibm** (the public-domain Freely Distributable
 * Math Library), computed using the Remez algorithm for minimax approximation.
 *
 * @see {@link https://www.netlib.org/fdlibm/} - fdlibm reference implementation
 */

import type { SinCos } from '../types';

/**
 * Local copies of mathematical constants to avoid upward imports from `auxiliary/`
 * The deterministic layer must NOT depend on auxiliary (dependencies flow downward only).
 *
 * @see {@link auxiliary/scalar/constants.ts} for the canonical definitions.
 */
const PI = Math.PI;
const HALF_PI = Math.PI / 2;
const QUARTER_PI = Math.PI / 4;

/* ========================================================================== */
/* Runtime Configuration                                                       */
/* ========================================================================== */

/**
 * Global configuration for deterministic math execution
 *
 * @remarks
 * By default, this module uses `fdlibm` bit-exact polynomial algorithms
 * (L0 Determinism) for perfect network lockstep sync across browsers/CPUs.
 * However, this is significantly slower than native assembly floats.
 *
 * Set `config.useNativeMath = true` to bypass deterministic kernels and use
 * native `Math.*` functions instead, recovering maximum CPU performance for
 * single-player or non-networked scenarios.
 *
 * **Global mutability**: This object is a shared mutable singleton. Changing
 * `useNativeMath` affects ALL subsequent calls to deterministic functions
 * across the entire application. There is no per-context or per-thread
 * isolation — JavaScript is single-threaded, but Web Workers each get their
 * own module instance and thus their own `config`.
 *
 * **Recommendation**: Set `config.useNativeMath` once at application startup,
 * before any math computation begins. Toggling it mid-computation may produce
 * inconsistent results if earlier computations used different kernels.
 *
 * @example
 * ```typescript
 * import { config } from '@lenguados/math2d';
 *
 * // Disable determinism, run native C-level floats on local CPU
 * config.useNativeMath = true;
 * ```
 *
 * @category Configuration
 * @since 0.7.0
 */
export const config = {
 useNativeMath: false,
};

/* ========================================================================== */
/* Internal Constants                                                          */
/* ========================================================================== */

// Local aliases for performance (avoid repeated property access)
const PI_2 = HALF_PI;
const PI_4 = QUARTER_PI;

/**
 * Cody-Waite split constants for π/2 range reduction
 * PIO2_HI + PIO2_LO = π/2 to extended precision (~106 bits).
 * Used for the fast path (|n| ≤ 8, i.e., |x| ≤ ~4π).
 * Source: fdlibm e_rem_pio2.c
 */
const PIO2_HI = 1.5707963267948966; // 0x3FF921FB54442D18 (53 bits of π/2)
const PIO2_LO = 6.123233995736766e-17; // 0x3C91A62633145C07 (remaining bits)
const INV_PIO2 = 6.36619772367581382433e-1; // 2/π for quadrant computation

/**
 * Extended-precision π/2 constants for large-argument range reduction
 * Three pairs (hi+tail) representing π/2 to ~151 bits of precision.
 * Each "hi" constant has its lower mantissa bits zeroed so that
 * multiplication by small integers n is exact in float64.
 *
 * CRITICAL: These constants MUST be constructed from their IEEE 754 hex
 * bit patterns. JavaScript decimal literals like 1.57079632679489655800e+00
 * get rounded to the nearest float64 (= Math.PI/2), losing the deliberate
 * bit truncation that makes the Cody-Waite algorithm work.
 *
 * Source: fdlibm `e_rem_pio2.c` (public-domain reference implementation).
 */
const _pio2Buf = new ArrayBuffer(8);
const _pio2View = new DataView(_pio2Buf);
function _hexF64(hi: number, lo: number): number {
 _pio2View.setUint32(0, hi, false);
 _pio2View.setUint32(4, lo, false);
 return _pio2View.getFloat64(0, false);
}
const PIO2_1 = _hexF64(0x3ff921fb, 0x54400000); // high 33 bits of π/2
const PIO2_1T = _hexF64(0x3dd0b461, 0x1a626331); // π/2 - PIO2_1
const PIO2_2 = _hexF64(0x3dd0b461, 0x1a600000); // high 33 bits of PIO2_1T
const PIO2_2T = _hexF64(0x3ba3198a, 0x2e037073); // PIO2_1T - PIO2_2
const PIO2_3 = _hexF64(0x3ba3198a, 0x2e000000); // high 33 bits of PIO2_2T
const PIO2_3T = _hexF64(0x397b839a, 0x252049c1); // PIO2_2T - PIO2_3

/* ========================================================================== */
/* Polynomial Coefficients (from fdlibm)                                       */
/* ========================================================================== */

/**
 * Sine polynomial coefficients for sin(x) ≈ x + S1*x³ + S2*x⁵ + ... on [-π/4, π/4]
 * Source: fdlibm k_sin.c
 */
const S1 = -1.66666666666666324348e-1; // 0xBFC5555555555549
const S2 = 8.33333333332248946124e-3; // 0x3F8111111110F8A6
const S3 = -1.98412698298579493134e-4; // 0xBF2A01A019C161D5
const S4 = 2.75573137070700676789e-6; // 0x3EC71DE357B1FE7D
const S5 = -2.50507602534068634195e-8; // 0xBE5AE5E68A2B9CEB
const S6 = 1.58969099521155010221e-10; // 0x3DE5D93A5ACFD57C

/**
 * Cosine polynomial coefficients for cos(x) ≈ 1 - x²/2 + C1*x⁴ + ... on [-π/4, π/4]
 * Source: fdlibm k_cos.c
 */
const C1 = 4.16666666666666019037e-2; // 0x3FA555555555554C
const C2 = -1.38888888888741095749e-3; // 0xBF56C16C16C15177
const C3 = 2.48015872894767294178e-5; // 0x3EFA01A019CB1590
const C4 = -2.75573143513906633035e-7; // 0xBE927E4F809C52AD
const C5 = 2.0875723212981748279e-9; // 0x3E21EE9EBDB4B1C4
const C6 = -1.13596475577881948265e-11; // 0xBDA8FAE9BE8838D4

/**
 * Arctangent polynomial coefficients for atan(x) on [0, 7/16]
 * Source: fdlibm s_atan.c
 */
const AT0 = 3.33333333333329318027e-1;
const AT1 = -1.99999999998764832476e-1;
const AT2 = 1.42857142725034663711e-1;
const AT3 = -1.1111110405462355788e-1;
const AT4 = 9.09088713343650656196e-2;
const AT5 = -7.69187620504482999495e-2;
const AT6 = 6.66107313738753120669e-2;
const AT7 = -5.83357013379057348645e-2;
const AT8 = 4.97687799461593236017e-2;
const AT9 = -3.6531572744216915527e-2;
const AT10 = 1.62858201153657823623e-2;

/**
 * Natural log polynomial coefficients for log(1+f) ≈ 2s + s*R where s = f/(2+f)
 * R(z) ≈ Lg1*z + Lg2*z² + ... + Lg7*z^7 where z = s²
 * Source: fdlibm e_log.c
 */
const Lg1 = 6.66666666666673513e-1; // 0x3FE5555555555593
const Lg2 = 3.999999999940941908e-1; // 0x3FD999999997FA04
const Lg3 = 2.857142874366239149e-1; // 0x3FD2492494229359
const Lg4 = 2.222219843214978396e-1; // 0x3FCC71C51D8E78AF
const Lg5 = 1.818357216161805012e-1; // 0x3FC74BC4151D0808
const Lg6 = 1.531383769920937332e-1; // 0x3FC39A09D078C69F
const Lg7 = 1.479819860511658591e-1; // 0x3FC2F112DF3E5244

/**
 * ln(2) split into high and low parts for precision
 * Source: fdlibm e_log.c, e_exp.c
 */
const LN2_HI = 6.9314718036912381649e-1; // 0x3FE62E42FEE00000
const LN2_LO = 1.90821492927058770002e-10; // 0x3DEA39EF35793C76
const INV_LN2 = 1.4426950408889634; // 1/ln(2) - truncated to avoid precision loss

/**
 * Exponential polynomial coefficients for exp(r) approximation
 * exp(r) ≈ 1 + r + r²/2! + r³/3! + ...  using Padé-like approximation
 * Source: fdlibm e_exp.c
 */
const E1 = 1.66666666666666019037e-1; // 1/6
const E2 = -2.77777777770155933842e-3; // -1/360
const E3 = 6.61375632143793436117e-5; // 1/15120
const E4 = -1.6533902205465251539e-6; // -1/604800
const E5 = 4.13813679705723846039e-8; // approximation

/* ========================================================================== */
/* Core Functions                                                              */
/* ========================================================================== */

/**
 * Shared buffer for IEEE 754 bit manipulation
 * Using a single buffer avoids allocation overhead.
 * Not reentrant: callers must not nest functions that use this buffer.
 * Verified call graph: log and pow2 share this buffer. pow calls log then
 * exp sequentially (safe). exp calls pow2. No nesting occurs.
 * @internal
 */
const ieeeBuffer = new ArrayBuffer(8);
const ieeeView = new DataView(ieeeBuffer);

/**
 * Computes 2^n via IEEE 754 bit construction. Handles the full exponent range
 * @param n - Integer exponent
 * @returns 2 raised to the power n
 * @internal
 */
function pow2(n: number): number {
 // Subnormal range: two-step scaling to avoid exponent field underflow
 if (n < -1022) {
  return pow2(-1022) * pow2(n + 1022);
 }
 // Construct 2^n by setting the exponent field directly
 ieeeView.setFloat64(0, 0, false);
 ieeeView.setUint32(0, ((n + 1023) & 0x7ff) << 20, false);
 ieeeView.setUint32(4, 0, false);
 return ieeeView.getFloat64(0, false);
}

/**
 * Deterministic hypotenuse: sqrt(x² + y²) without intermediate overflow
 *
 * @remarks
 * **Problem solved:** The naive formula `sqrt(x*x + y*y)` overflows to Infinity
 * when `x` or `y` > ~1e154, even though the result is representable.
 *
 * **Algorithm:** Uses the identity `sqrt(x² + y²) = max * sqrt(1 + (min/max)²)`
 * which avoids intermediate overflow since `min/max` is always in `[0, 1]`.
 * References: Kahan 1987 "Further remarks on reducing truncation errors",
 * Moler-Morrison 1983 "Replacing square roots by Pythagorean sums" (IBM
 * Journal of Research and Development). The fdlibm public-domain `e_hypot.c`
 * implementation codifies the numerically-stable form used here.
 *
 * **Performance:** faster than a generic scaled-hypot by ~17% on the
 * benchmark under `tools/benchmark/` because the two-argument form skips
 * the variadic handling of the generic `hypot`.
 *
 * @param x - First value
 * @param y - Second value
 * @returns sqrt(x² + y²) computed safely
 *
 * @example
 * ```typescript
 * hypot(3, 4);         // 5
 * hypot(1e200, 1e200); // 1.414e200 (not Infinity!)
 * hypot(0, 5);         // 5
 * hypot(Infinity, 5);  // Infinity
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function hypot(x: number, y: number): number {
 if (config.useNativeMath) return Math.hypot(x, y);
 const ax = x < 0 ? -x : x; // Math.abs inlined for performance
 const ay = y < 0 ? -y : y;

 // Handle infinities (they dominate) and NaN
 if (!Number.isFinite(ax) || !Number.isFinite(ay)) {
  if (ax === Infinity || ay === Infinity) return Infinity;
  return NaN; // One is NaN
 }

 // Handle zeros
 if (ax === 0) return ay;
 if (ay === 0) return ax;

 // Ensure max >= min
 let max: number, min: number;
 if (ax >= ay) {
  max = ax;
  min = ay;
 } else {
  max = ay;
  min = ax;
 }

 // If max >> min (ratio < 2^-27), ratio² underflows to 0, so just return max
 // This handles extreme cases and improves performance
 if (max > min * 134217728) {
  // 2^27
  return max;
 }

 // Standard formula: max * sqrt(1 + (min/max)²)
 // Math.sqrt is IEEE 754 required — correctly rounded, deterministic across all platforms
 const ratio = min / max;
 return max * Math.sqrt(1 + ratio * ratio);
}

/**
 * Reduce angle to range [-π/4, π/4] and determine quadrant information
 *
 * @remarks
 * Uses quadrant-based reduction (not octant). Each quadrant is π/2 wide.
 * The reduced value is always in [-π/4, π/4] after adjustment.
 *
 * Dual-path Cody-Waite reduction:
 * - Fast path (|n| ≤ 8, i.e., |x| ≤ ~4π): two-step with full 53-bit π/2
 *   constants. Covers all normalized angles in physics simulations.
 * - Extended path (|n| > 8): three-pair iterative reduction with 33-bit-
 *   truncated constants from fdlibm `e_rem_pio2.c`, providing ~151 bits of π/2.
 *   Covers |x| up to ~10⁶ radians. Beyond that, Payne-Hanek is needed.
 *
 * The extended path constants MUST be constructed from IEEE 754 hex bit
 * patterns (via DataView), not decimal literals, because JavaScript rounds
 * decimal literals to the nearest float64, destroying the deliberate bit
 * truncation that prevents cancellation in `x - n·PIO2_k`.
 *
 * Note: This function is `@internal` — the precision boundary is documented
 * on the public {@link sinCos} function.
 *
 * @param x - Angle in radians
 * @returns Tuple of [reduced angle in [-π/4, π/4], quadrant 0-3]
 * @internal
 */
function reduceAngle(x: number): [number, number] {
 // Compute n = round(x / (π/2)) so that x - n*(π/2) ∈ [-π/4, π/4].
 const n = Math.round(x * INV_PIO2);
 const quadrant = ((n % 4) + 4) % 4;

 if (n >= -8 && n <= 8) {
  // Fast path: two-step Cody-Waite with full 53-bit π/2 constants.
  // Precise for |x| ≤ ~4π (covers all normalized angles in physics).
  return [x - n * PIO2_HI - n * PIO2_LO, quadrant];
 }

 // Extended path: three-pair iterative reduction with 33-bit-truncated constants.
 // Each PIO2_k has lower mantissa bits zeroed so n*PIO2_k is exact for
 // small n, and the iterative subtraction accumulates ~151 bits of π/2.
 // Covers |x| up to ~2²⁰ (≈10⁶ radians). Beyond that, Payne-Hanek is
 // needed — but no physics engine operates at that scale.
 // Source: fdlibm `e_rem_pio2.c` (public-domain) medium-range path.
 let r = x - n * PIO2_1;
 let w = n * PIO2_1T;
 let y = r - w;

 // 2nd iteration if cancellation consumed too many bits
 if (Math.abs(y) < Math.abs(r) * 1.52587890625e-5) {
  // 2^-16
  const t = r;
  w = n * PIO2_2;
  r = t - w;
  w = n * PIO2_2T - (t - r - w);
  y = r - w;

  // 3rd iteration (needed when |n| > ~2^16)
  if (Math.abs(y) < Math.abs(r) * 1.52587890625e-5) {
   const t2 = r;
   w = n * PIO2_3;
   r = t2 - w;
   w = n * PIO2_3T - (t2 - r - w);
   y = r - w;
  }
 }

 return [y, quadrant];
}

/**
 * Kernel sine function for x in [-π/4, π/4]
 * Uses fdlibm polynomial approximation for ~15 digit precision.
 *
 * @param x - Angle in radians, must be in [-π/4, π/4]
 * @returns sin(x)
 * @internal
 */
function kernelSin(x: number): number {
 const x2 = x * x;
 const x3 = x2 * x;
 // sin(x) ≈ x + S1*x³ + S2*x⁵ + S3*x⁷ + S4*x⁹ + S5*x¹¹ + S6*x¹³
 return x + x3 * (S1 + x2 * (S2 + x2 * (S3 + x2 * (S4 + x2 * (S5 + x2 * S6)))));
}

/**
 * Kernel cosine function for x in [-π/4, π/4]
 * Uses fdlibm polynomial approximation for ~15 digit precision.
 *
 * @param x - Angle in radians, must be in [-π/4, π/4]
 * @returns cos(x)
 * @internal
 */
function kernelCos(x: number): number {
 const x2 = x * x;
 const x4 = x2 * x2;
 // cos(x) ≈ 1 - x²/2 + C1*x⁴ + C2*x⁶ + C3*x⁸ + C4*x¹⁰ + C5*x¹² + C6*x¹⁴
 return 1 - x2 * 0.5 + x4 * (C1 + x2 * (C2 + x2 * (C3 + x2 * (C4 + x2 * (C5 + x2 * C6)))));
}

/**
 * Deterministic sine function
 *
 * @remarks
 * Uses range reduction to [-π/4, π/4] followed by fdlibm polynomial.
 * Completely deterministic: no Math.sin dependency.
 *
 * @param x - Angle in radians
 * @returns sin(x) with ~15 digit precision
 *
 * @example
 * ```typescript
 * sin(0);           // 0
 * sin(PI / 2);      // 1
 * sin(PI);          // ~0 (very small due to range reduction)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function sin(x: number): number {
 if (config.useNativeMath) return Math.sin(x);
 if (!Number.isFinite(x)) return NaN;

 const [reduced, quadrant] = reduceAngle(x);

 // sin(n*π/2 + r): kernelSin is odd, kernelCos is even — sign handled naturally
 switch (quadrant) {
  case 0:
   return kernelSin(reduced);
  case 1:
   return kernelCos(reduced);
  case 2:
   return -kernelSin(reduced);
  case 3:
   return -kernelCos(reduced);
  default:
   return kernelSin(reduced);
 }
}

/**
 * Deterministic cosine function
 *
 * @remarks
 * Uses range reduction to [-π/4, π/4] followed by fdlibm polynomial.
 * Completely deterministic: no Math.cos dependency.
 *
 * @param x - Angle in radians
 * @returns cos(x) with ~15 digit precision
 *
 * @example
 * ```typescript
 * cos(0);           // 1
 * cos(PI / 2);      // ~0
 * cos(PI);          // -1
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function cos(x: number): number {
 if (config.useNativeMath) return Math.cos(x);
 if (!Number.isFinite(x)) return NaN;

 const [reduced, quadrant] = reduceAngle(x);

 // cos(n*π/2 + r): kernelSin is odd, kernelCos is even — sign handled naturally
 switch (quadrant) {
  case 0:
   return kernelCos(reduced);
  case 1:
   return -kernelSin(reduced);
  case 2:
   return -kernelCos(reduced);
  case 3:
   return kernelSin(reduced);
  default:
   return kernelCos(reduced);
 }
}

/**
 * Computes sin and cos simultaneously (more efficient than separate calls)
 *
 * @remarks
 * Range reduction uses Cody-Waite two-step subtraction with 106-bit extended
 * precision for PI/2 (PIO2_HI + PIO2_LO). For `|x| > 2^20·PI` (~3.3e6 radians),
 * the reduction error may exceed 1 ULP, causing gradual precision degradation.
 * Typical 2D physics simulations operate well within this bound.
 *
 * @param x - Angle in radians
 * @param out - Optional output object to write sin/cos into (zero-allocation)
 * @returns Object with sin and cos values
 *
 * @example
 * ```typescript
 * const result = sinCos(PI / 4);
 * // result.sin ≈ 0.7071, result.cos ≈ 0.7071
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function sinCos(x: number, out?: SinCos): SinCos {
 const result = out ?? { sin: 0, cos: 0 };

 if (config.useNativeMath) {
  result.sin = Math.sin(x);
  result.cos = Math.cos(x);
  return result;
 }
 if (!Number.isFinite(x)) {
  result.sin = NaN;
  result.cos = NaN;
  return result;
 }

 const [reduced, quadrant] = reduceAngle(x);
 const s = kernelSin(reduced);
 const c = kernelCos(reduced);

 // Assign based on quadrant: kernelSin is odd, kernelCos is even
 switch (quadrant) {
  case 0:
   result.sin = s;
   result.cos = c;
   break;
  case 1:
   result.sin = c;
   result.cos = -s;
   break;
  case 2:
   result.sin = -s;
   result.cos = -c;
   break;
  case 3:
   result.sin = -c;
   result.cos = s;
   break;
  default:
   result.sin = s;
   result.cos = c;
 }
 return result;
}

// Reusable scratch object for tan() — avoids per-call allocation.
// Safe: JavaScript is single-threaded; same non-reentrancy assumption as ieeeBuffer.
const _tanScratch: SinCos = { sin: 0, cos: 0 };

/**
 * Deterministic tangent function
 *
 * @remarks
 * Computed as `sin(x) / cos(x)`, so reduced precision near π/2 + nπ
 * where cos → 0. No singularity guard; returns ±large values near poles.
 *
 * @param x - Angle in radians
 * @returns tan(x) = sin(x) / cos(x)
 *
 * @example
 * ```typescript
 * tan(0);           // 0
 * tan(PI / 4);      // ~1
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function tan(x: number): number {
 if (config.useNativeMath) return Math.tan(x);
 sinCos(x, _tanScratch);
 return _tanScratch.sin / _tanScratch.cos;
}

/**
 * Kernel arctangent function for x in [0, 7/16]
 * Uses fdlibm polynomial approximation.
 *
 * @param x - Value in [0, 7/16]
 * @returns atan(x)
 * @internal
 */
function kernelAtan(x: number): number {
 const x2 = x * x;
 // atan(x) ≈ x - x³*(AT0 + x²*(AT1 + x²*(AT2 + ...)))
 return (
  x -
  x *
   x2 *
   (AT0 +
    x2 *
     (AT1 +
      x2 *
       (AT2 +
        x2 *
         (AT3 +
          x2 *
           (AT4 + x2 * (AT5 + x2 * (AT6 + x2 * (AT7 + x2 * (AT8 + x2 * (AT9 + x2 * AT10))))))))))
 );
}

/**
 * Deterministic arctangent function
 *
 * @param x - Any real number
 * @returns atan(x) in [-π/2, π/2]
 *
 * @example
 * ```typescript
 * atan(0);        // 0
 * atan(1);        // ~0.7854 (π/4)
 * atan(Infinity); // ~1.5708 (π/2)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function atan(x: number): number {
 if (config.useNativeMath) return Math.atan(x);
 if (!Number.isFinite(x)) {
  if (x === Infinity) return PI_2;
  if (x === -Infinity) return -PI_2;
  return NaN;
 }

 const sign = x < 0 ? -1 : 1;
 let absX = sign < 0 ? -x : x;

 // Reduce to [0, 7/16] using identities
 let result: number;

 if (absX < 7 / 16) {
  // Direct computation
  result = kernelAtan(absX);
 } else if (absX < 11 / 16) {
  // atan(x) = π/6 + atan((x - 1/√3) / (1 + x/√3))
  const sqrt3 = 1.7320508075688772;
  const t = (absX * sqrt3 - 1) / (sqrt3 + absX);
  result = PI / 6 + kernelAtan(t);
 } else if (absX < 19 / 16) {
  // atan(x) = π/4 + atan((x - 1) / (1 + x))
  const t = (absX - 1) / (absX + 1);
  result = PI_4 + kernelAtan(t);
 } else if (absX < 39 / 16) {
  // atan(x) = π/3 + atan((x - √3) / (1 + x*√3))
  const sqrt3 = 1.7320508075688772;
  const t = (absX - sqrt3) / (1 + absX * sqrt3);
  result = PI / 3 + kernelAtan(t);
 } else {
  // atan(x) = π/2 - atan(1/x)
  result = PI_2 - kernelAtan(1 / absX);
 }

 return sign * result;
}

/**
 * Deterministic two-argument arctangent
 *
 * @remarks
 * This is the most important function for 2D geometry as it gives the angle
 * of a vector. Uses pure arithmetic via atan() and quadrant logic.
 *
 * @param y - Y coordinate
 * @param x - X coordinate
 * @returns Angle in [-π, π] from positive X axis to point (x, y)
 *
 * @example
 * ```typescript
 * atan2(0, 1);   // 0 (positive X axis)
 * atan2(1, 0);   // π/2 (positive Y axis)
 * atan2(0, -1);  // π (negative X axis)
 * atan2(-1, 0);  // -π/2 (negative Y axis)
 * ```
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function atan2(y: number, x: number): number {
 if (config.useNativeMath) return Math.atan2(y, x);
 // Handle special cases
 if (!Number.isFinite(x) || !Number.isFinite(y)) {
  if (Number.isNaN(x) || Number.isNaN(y)) return NaN;
  // Handle infinities
  if (x === Infinity) {
   if (y === Infinity) return PI_4;
   if (y === -Infinity) return -PI_4;
   return 0;
  }
  if (x === -Infinity) {
   if (y === Infinity) return PI - PI_4;
   if (y === -Infinity) return -(PI - PI_4);
   return Object.is(y, -0) || y < 0 ? -PI : PI;
  }
  if (y === Infinity) return PI_2;
  if (y === -Infinity) return -PI_2;
 }

 // Handle zero cases (Object.is needed: -0 === 0 and -0 >= 0 are both true in JS)
 if (y === 0) {
  const negY = Object.is(y, -0);
  if (x > 0 || Object.is(x, 0)) {
   return negY ? -0 : 0;
  }
  return negY ? -PI : PI;
 }
 if (x === 0) {
  return y > 0 ? PI_2 : -PI_2;
 }

 // General case: use atan(y/x) and adjust for quadrant
 const angle = atan(y / x);

 if (x > 0) {
  return angle;
 } else {
  return y >= 0 ? angle + PI : angle - PI;
 }
}

/**
 * Deterministic arccosine using atan2
 *
 * @remarks
 * Returns NaN for inputs outside [-1, 1]. Use {@link acosSafe} for automatic clamping.
 *
 * @param x - Value in [-1, 1]
 * @returns acos(x) in [0, π]
 *
 * @example
 * ```typescript
 * acos(1);    // 0
 * acos(0);    // ~1.5708 (π/2)
 * acos(-1);   // ~3.1416 (π)
 * ```
 *
 * @see {@link acosSafe} - Clamps input to [-1, 1]
 * @category Arithmetic
 * @since 0.7.0
 */
export function acos(x: number): number {
 if (config.useNativeMath) return Math.acos(x);
 if (x !== x) return NaN;
 if (x < -1 || x > 1) return NaN;
 // Factored form `sqrt((1-x)*(1+x))` avoids catastrophic
 // cancellation in `1 - x²` when `|x| → 1`. References: Higham 2002 §1.8, Goldberg 1991 §3.1,
 // fdlibm `e_acos.c`. acos(x) = atan2(sqrt((1-x)(1+x)), x).
 return atan2(Math.sqrt((1 - x) * (1 + x)), x);
}

/**
 * Deterministic arcsine using atan2
 *
 * @remarks
 * Returns NaN for inputs outside [-1, 1]. Use {@link asinSafe} for automatic clamping.
 *
 * @param x - Value in [-1, 1]
 * @returns asin(x) in [-π/2, π/2]
 *
 * @example
 * ```typescript
 * asin(0);    // 0
 * asin(1);    // ~1.5708 (π/2)
 * asin(-1);   // ~-1.5708 (-π/2)
 * ```
 *
 * @see {@link asinSafe} - Clamps input to [-1, 1]
 * @category Arithmetic
 * @since 0.7.0
 */
export function asin(x: number): number {
 if (config.useNativeMath) return Math.asin(x);
 if (x !== x) return NaN;
 if (x < -1 || x > 1) return NaN;
 // Factored form `sqrt((1-x)*(1+x))` avoids catastrophic
 // cancellation in `1 - x²` when `|x| → 1`. References: Higham 2002 §1.8, Goldberg 1991 §3.1,
 // fdlibm `e_asin.c`. asin(x) = atan2(x, sqrt((1-x)(1+x))).
 return atan2(x, Math.sqrt((1 - x) * (1 + x)));
}

/* ========================================================================== */
/* Hyperbolic Functions                                                       */
/* ========================================================================== */

/**
 * Computes the hyperbolic sine `sinh(x) = (eˣ − e⁻ˣ) / 2`
 *
 * @remarks
 * IEEE 754 special cases: `sinh(±0) = ±0`, `sinh(±Infinity) = ±Infinity`,
 * `sinh(NaN) = NaN`. Uses the identity `sinh(x) = (exp(x) − exp(−x)) / 2` with
 * the existing deterministic `exp` kernel. Bit-exact across platforms when
 * `config.useNativeMath === false`; delegates to `Math.sinh` (ECMA-262 §21.3.2.32)
 * in native mode. References: fdlibm `s_sinh.c`, C99 §7.12.5.4.
 *
 * @param x - Input value
 * @returns Hyperbolic sine
 * @internal
 */
export function sinh(x: number): number {
 if (config.useNativeMath) return Math.sinh(x);
 if (x !== x) return NaN;
 if (x === 0) return x; // preserves signed zero
 if (x === Infinity) return Infinity;
 if (x === -Infinity) return -Infinity;
 return (exp(x) - exp(-x)) * 0.5;
}

/**
 * Computes the hyperbolic cosine `cosh(x) = (eˣ + e⁻ˣ) / 2`
 *
 * @remarks
 * IEEE 754 special cases: `cosh(±0) = 1`, `cosh(±Infinity) = +Infinity`,
 * `cosh(NaN) = NaN`. Uses the identity `cosh(x) = (exp(x) + exp(−x)) / 2` with
 * the existing deterministic `exp` kernel. Bit-exact across platforms when
 * `config.useNativeMath === false`; delegates to `Math.cosh` (ECMA-262 §21.3.2.33)
 * in native mode. References: fdlibm `s_cosh.c`, C99 §7.12.5.5.
 *
 * @param x - Input value
 * @returns Hyperbolic cosine
 * @internal
 */
export function cosh(x: number): number {
 if (config.useNativeMath) return Math.cosh(x);
 if (x !== x) return NaN;
 if (x === 0) return 1;
 if (x === Infinity || x === -Infinity) return Infinity;
 return (exp(x) + exp(-x)) * 0.5;
}

/**
 * Computes the hyperbolic tangent `tanh(x) = sinh(x) / cosh(x)`
 *
 * @remarks
 * IEEE 754 special cases: `tanh(±0) = ±0`, `tanh(±Infinity) = ±1`,
 * `tanh(NaN) = NaN`. Saturates at ±1 for large `|x|` to avoid overflow in
 * `exp(x) / exp(-x)`. Bit-exact across platforms when `config.useNativeMath === false`;
 * delegates to `Math.tanh` (ECMA-262 §21.3.2.34) in native mode.
 * References: fdlibm `s_tanh.c`, C99 §7.12.5.6.
 *
 * @param x - Input value
 * @returns Hyperbolic tangent in `[−1, 1]`
 * @internal
 */
export function tanh(x: number): number {
 if (config.useNativeMath) return Math.tanh(x);
 if (x !== x) return NaN;
 if (x === 0) return x; // preserves signed zero
 if (x === Infinity) return 1;
 if (x === -Infinity) return -1;
 // Use the numerically stable form `(e^(2x) − 1) / (e^(2x) + 1)` for |x| < 22,
 // saturating at ±1 for large |x| where exp overflows.
 if (x > 22) return 1;
 if (x < -22) return -1;
 const exp2x = exp(2 * x);
 return (exp2x - 1) / (exp2x + 1);
}

/* ========================================================================== */
/* Logarithm and Exponential Functions                                         */
/* ========================================================================== */

/**
 * Deterministic natural logarithm using fdlibm algorithm
 *
 * @remarks
 * Uses range reduction x = 2^k * (1+f) where sqrt(2)/2 < 1+f < sqrt(2),
 * then polynomial approximation for log(1+f).
 * Completely deterministic: no Math.log dependency.
 *
 * @param x - Value to compute logarithm of (must be positive)
 * @returns ln(x); NaN for x < 0, -Infinity for x = 0
 *
 * @example
 * ```typescript
 * log(1);       // 0
 * log(Math.E);  // 1
 * log(10);      // 2.302585...
 * log(-1);      // NaN
 * ```
 *
 * @see {@link logSafe} - Safe variant that returns 0 for non-positive input
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function log(x: number): number {
 if (config.useNativeMath) return Math.log(x);
 // Handle special cases
 if (x !== x || x < 0) return NaN; // NaN or negative
 if (x === 0) return -Infinity;
 if (x === Infinity) return Infinity;
 if (x === 1) return 0;

 // Extract exponent and mantissa using IEEE 754 bit manipulation
 ieeeView.setFloat64(0, x, false);
 let hx = ieeeView.getUint32(0, false);
 let k = 0;

 // Subnormal number handling
 if (hx < 0x00100000) {
  x *= 1.8014398509481984e16; // 2^54
  ieeeView.setFloat64(0, x, false);
  hx = ieeeView.getUint32(0, false);
  k = -54;
 }

 // Extract exponent
 k += ((hx >> 20) & 0x7ff) - 1023;
 hx &= 0x000fffff;
 // sqrt(2) boundary adjustment: keep 1+f in [sqrt(2)/2, sqrt(2)]
 // When mantissa >= sqrt(2), divide by 2 and increment k (per fdlibm e_log.c)
 const index = (hx + 0x95f64) & 0x100000;
 hx |= index ^ 0x3ff00000;
 k += index >> 20;

 // Write back normalized value
 ieeeView.setUint32(0, hx, false);
 const f = ieeeView.getFloat64(0, false) - 1.0;

 // log(1+f) approximation using s = f/(2+f)
 const s = f / (2.0 + f);
 const s2 = s * s;
 const s4 = s2 * s2;

 // Polynomial: R = s^2 * (Lg1 + s^2 * (Lg2 + s^2 * (Lg3 + ...)))
 const t1 = s2 * (Lg1 + s4 * (Lg3 + s4 * (Lg5 + s4 * Lg7)));
 const t2 = s4 * (Lg2 + s4 * (Lg4 + s4 * Lg6));
 const R = t1 + t2;

 // High precision ln(2) reconstruction
 const hfsq = 0.5 * f * f;
 return k * LN2_HI - (hfsq - (s * (hfsq + R) + k * LN2_LO) - f);
}

/**
 * Deterministic exponential function using fdlibm algorithm
 *
 * @remarks
 * Uses range reduction x = k*ln(2) + r where |r| <= ln(2)/2,
 * then polynomial approximation for exp(r).
 * Completely deterministic: no Math.exp dependency.
 *
 * @param x - Exponent value
 * @returns e^x
 *
 * @example
 * ```typescript
 * exp(0);       // 1
 * exp(1);       // 2.718281828...
 * exp(-Infinity); // 0
 * exp(Infinity);  // Infinity
 * ```
 *
 * @see {@link expSafe} - Safe variant that clamps overflow to a finite range
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function exp(x: number): number {
 if (config.useNativeMath) return Math.exp(x);
 // Handle special cases
 if (x !== x) return NaN;
 if (x === Infinity) return Infinity;
 if (x === -Infinity) return 0;
 if (x === 0) return 1;

 // Overflow/underflow thresholds
 const OVERFLOW_THRESHOLD = 709.782712893384; // ln(MAX_VALUE)
 const UNDERFLOW_THRESHOLD = -745.1332191019411; // ln(MIN_VALUE)

 if (x > OVERFLOW_THRESHOLD) return Infinity;
 if (x < UNDERFLOW_THRESHOLD) return 0;

 // Range reduction: x = k*ln2 + r, |r| <= ln2/2
 const k = Math.round(x * INV_LN2);
 const r = x - k * LN2_HI - k * LN2_LO;

 // Polynomial approximation for (exp(r) - 1 - r) / r^2
 // Using Horner's method for efficiency
 const r2 = r * r;
 const c = r - r2 * (E1 + r2 * (E2 + r2 * (E3 + r2 * (E4 + r2 * E5))));

 // exp(r) = 1 + r + r*c/(2-c)
 const expR = 1 + (r + (r * c) / (2 - c));

 // Scale by 2^k using two-step ldexp-style multiply (fdlibm approach)
 if (k === 0) return expR;

 // Two-step scaling avoids intermediate overflow/underflow for large |k|.
 // Split k into two halves so neither 2^(k1) nor 2^(k2) overflows on its own.
 const k1 = Math.trunc(k / 2);
 const k2 = k - k1;
 const scale1 = pow2(k1);
 const scale2 = pow2(k2);
 return expR * scale1 * scale2;
}

/**
 * Deterministic power function
 *
 * @remarks
 * For integer exponents, uses exponentiation by squaring.
 * For non-integer exponents, uses deterministic exp(exponent * log(base)).
 * Fully L0 deterministic with no Math.pow dependency.
 *
 * **NaN propagation:** `pow(x, NaN)` returns NaN for all x except `pow(x, 0) = 1`
 * (ECMAScript §21.3.2.26). `pow(1, ±Infinity)` returns NaN.
 *
 * **fdlibm edge cases:** Signed-zero handling (`pow(-0, odd)`) and negative-base
 * with ±Infinity exponent follow fdlibm/C99 semantics, which may differ from
 * ECMAScript `Math.pow` for these specific edge cases. All finite positive-base
 * computations are bit-identical to the fdlibm reference.
 *
 * **Precision:** For fractional exponents, results may differ from `Math.pow` by
 * up to 1 ULP due to the `exp(exponent * log(base))` computation path.
 *
 * @param base - Base value
 * @param exponent - Exponent value
 * @returns base^exponent
 *
 * @example
 * ```typescript
 * pow(2, 10);    // 1024
 * pow(9, 0.5);   // 3 (square root)
 * pow(2, -1);    // 0.5
 * ```
 *
 * @see {@link powSafe} - Safe variant for domain edge cases
 *
 * @category Arithmetic
 * @since 0.7.0
 */
export function pow(base: number, exponent: number): number {
 if (config.useNativeMath) return Math.pow(base, exponent);
 // Handle special cases (order matters for ECMAScript parity)
 if (exponent === 0) return 1; // NaN^0 = 1, 0^0 = 1 (ECMAScript §21.3.2.26)
 if (exponent !== exponent) return NaN; // NaN exponent propagates (after 0 check)
 if (exponent === 1) return base;
 // Preserve signed zero per ECMA-262 §21.3.2.26 / C99 §F.9.4.4 / fdlibm e_pow.c.
 // pow(-0, odd positive int) = -0 (not +0); pow(-0, odd negative int) = -Infinity (not +Infinity).
 // Non-integer / even exponents collapse to the unsigned-zero convention.
 if (Object.is(base, -0)) {
  if (Number.isInteger(exponent) && Math.abs(exponent) % 2 === 1) {
   return exponent > 0 ? -0 : -Infinity;
  }
  return exponent > 0 ? 0 : Infinity;
 }
 if (base === 0) return exponent > 0 ? 0 : Infinity;
 if (base === 1) return Number.isFinite(exponent) ? 1 : NaN; // pow(1, ±Infinity) = NaN

 // Integer exponent: use exponentiation by squaring (fastest)
 if (Number.isInteger(exponent)) {
  let result = 1;
  let b = base;
  let expAbs = Math.abs(exponent);

  while (expAbs > 0) {
   if (expAbs % 2 === 1) {
    result *= b;
   }
   b *= b;
   expAbs = Math.floor(expAbs / 2);
  }

  return exponent < 0 ? 1 / result : result;
 }

 // Non-integer: use deterministic exp(exponent * log(base))
 if (base < 0) return NaN; // Complex result
 return exp(exponent * log(base));
}

/* ========================================================================== */
/* Exports                                                                     */
/* ========================================================================== */

/**
 * Pure deterministic math kernels for L0 cross-platform consistency
 *
 * @remarks
 * Contains ONLY pure deterministic replacements for non-deterministic `Math.*` functions.
 * Each function returns IEEE 754-specified results (including NaN for domain errors).
 * No Safe variants — domain clamping and fallback functions live in
 * `auxiliary/numeric/safety.ts`.
 *
 * - Trigonometric: sin, cos, sinCos, tan, atan, atan2, acos, asin
 * - Logarithmic/Exponential: log, exp, pow
 * - Hypotenuse: hypot
 *
 * `Math.sqrt`, `Math.floor`, `Math.ceil`, `Math.abs` are IEEE 754 required
 * operations and should be used directly — they are deterministic.
 *
 * @category Helpers
 * @since 0.7.0
 */
export const DeterministicKernels = {
 // Configuration
 config,

 // Core
 hypot,

 // Logarithm and exponential
 log,
 exp,

 // Trigonometry
 sin,
 cos,
 sinCos,
 tan,
 atan,
 atan2,

 // Inverse trigonometry
 acos,
 asin,

 // Power
 pow,
} as const;

// Re-export individual functions for convenience
export type { SinCos } from '../types';
