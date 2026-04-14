/**
 * Statistics engine implementing the Criterion.rs model.
 *
 * Provides bootstrap confidence intervals, Tukey outlier detection,
 * Welch's t-test regression detection, and standard descriptive statistics.
 * Does NOT assume normality of the underlying distribution.
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

export interface DescriptiveStats {
 count: number;
 mean: number;
 median: number;
 stddev: number;
 variance: number;
 mad: number;
 min: number;
 max: number;
 p50: number;
 p95: number;
 p99: number;
}

export interface ConfidenceInterval {
 lo: number;
 hi: number;
 confidence: number;
}

export interface OutlierClassification {
 mildLow: number;
 mildHigh: number;
 severeLow: number;
 severeHigh: number;
 totalMild: number;
 totalSevere: number;
}

export interface RegressionResult {
 significant: boolean;
 effectSize: number;
 pValue: number;
 baselineMean: number;
 currentMean: number;
 withinThreshold: boolean;
}

export interface BenchmarkStats extends DescriptiveStats {
 ci95: ConfidenceInterval;
 outliers: OutlierClassification;
 opsPerSec: number;
}

/* ========================================================================== */
/* Descriptive Statistics                                                       */
/* ========================================================================== */

export function computeMean(data: number[]): number {
 if (data.length === 0) return 0;
 let sum = 0;
 for (let i = 0; i < data.length; i++) {
  sum += data[i]!;
 }
 return sum / data.length;
}

export function computeMedian(sorted: number[]): number {
 if (sorted.length === 0) return 0;
 const mid = sorted.length >>> 1;
 if (sorted.length % 2 === 0) {
  return (sorted[mid - 1]! + sorted[mid]!) / 2;
 }
 return sorted[mid]!;
}

export function computeVariance(data: number[], mean: number): number {
 if (data.length < 2) return 0;
 let sum = 0;
 for (let i = 0; i < data.length; i++) {
  const d = data[i]! - mean;
  sum += d * d;
 }
 return sum / (data.length - 1);
}

export function computeMAD(sorted: number[], median: number): number {
 if (sorted.length === 0) return 0;
 const deviations = new Array<number>(sorted.length);
 for (let i = 0; i < sorted.length; i++) {
  deviations[i] = Math.abs(sorted[i]! - median);
 }
 deviations.sort((a, b) => a - b);
 return computeMedian(deviations);
}

export function computePercentile(sorted: number[], p: number): number {
 if (sorted.length === 0) return 0;
 if (sorted.length === 1) return sorted[0]!;
 const index = (p / 100) * (sorted.length - 1);
 const lo = Math.floor(index);
 const hi = Math.ceil(index);
 if (lo === hi) return sorted[lo]!;
 const frac = index - lo;
 return sorted[lo]! * (1 - frac) + sorted[hi]! * frac;
}

export function descriptiveStats(data: number[]): DescriptiveStats {
 if (data.length === 0) {
  return {
   count: 0, mean: 0, median: 0, stddev: 0, variance: 0,
   mad: 0, min: 0, max: 0, p50: 0, p95: 0, p99: 0,
  };
 }

 const sorted = [...data].sort((a, b) => a - b);
 const mean = computeMean(data);
 const median = computeMedian(sorted);
 const variance = computeVariance(data, mean);

 return {
  count: data.length,
  mean,
  median,
  stddev: Math.sqrt(variance),
  variance,
  mad: computeMAD(sorted, median),
  min: sorted[0]!,
  max: sorted[sorted.length - 1]!,
  p50: computePercentile(sorted, 50),
  p95: computePercentile(sorted, 95),
  p99: computePercentile(sorted, 99),
 };
}

/* ========================================================================== */
/* Bootstrap Confidence Intervals                                              */
/* ========================================================================== */

/**
 * Compute a bootstrap confidence interval for the mean.
 *
 * Generates `numResamples` bootstrap samples, computes the mean of each,
 * sorts the distribution, and extracts percentile-based confidence bounds.
 * Does NOT assume normality.
 */
export function bootstrapCI(
 data: number[],
 confidence = 0.95,
 numResamples = 10_000,
): ConfidenceInterval {
 if (data.length === 0) return { lo: 0, hi: 0, confidence };
 if (data.length === 1) return { lo: data[0]!, hi: data[0]!, confidence };

 const n = data.length;
 const means = new Float64Array(numResamples);

 // Seed-independent resampling using Math.random
 // (benchmarks are not cryptographic — reproducibility is not needed)
 for (let r = 0; r < numResamples; r++) {
  let sum = 0;
  for (let i = 0; i < n; i++) {
   sum += data[Math.floor(Math.random() * n)]!;
  }
  means[r] = sum / n;
 }

 // Sort bootstrap means
 means.sort();

 const alpha = (1 - confidence) / 2;
 const loIndex = Math.floor(alpha * numResamples);
 const hiIndex = Math.floor((1 - alpha) * numResamples) - 1;

 return {
  lo: means[Math.max(0, loIndex)]!,
  hi: means[Math.min(numResamples - 1, hiIndex)]!,
  confidence,
 };
}

/* ========================================================================== */
/* Tukey Outlier Detection                                                     */
/* ========================================================================== */

/**
 * Classify outliers using modified Tukey's method.
 *
 * Mild: beyond 1.5 * IQR from Q1/Q3
 * Severe: beyond 3 * IQR from Q1/Q3
 *
 * Outliers are reported but NOT excluded from calculations.
 */
export function classifyOutliers(data: number[]): OutlierClassification {
 if (data.length < 4) {
  return {
   mildLow: 0, mildHigh: 0, severeLow: 0, severeHigh: 0,
   totalMild: 0, totalSevere: 0,
  };
 }

 const sorted = [...data].sort((a, b) => a - b);
 const q1 = computePercentile(sorted, 25);
 const q3 = computePercentile(sorted, 75);
 const iqr = q3 - q1;

 const mildLowFence = q1 - 1.5 * iqr;
 const mildHighFence = q3 + 1.5 * iqr;
 const severeLowFence = q1 - 3 * iqr;
 const severeHighFence = q3 + 3 * iqr;

 let mildLow = 0;
 let mildHigh = 0;
 let severeLow = 0;
 let severeHigh = 0;

 for (let i = 0; i < data.length; i++) {
  const v = data[i]!;
  if (v < severeLowFence) {
   severeLow++;
  } else if (v < mildLowFence) {
   mildLow++;
  } else if (v > severeHighFence) {
   severeHigh++;
  } else if (v > mildHighFence) {
   mildHigh++;
  }
 }

 return {
  mildLow,
  mildHigh,
  severeLow,
  severeHigh,
  totalMild: mildLow + mildHigh,
  totalSevere: severeLow + severeHigh,
 };
}

/* ========================================================================== */
/* Regression Detection (Welch's t-test)                                       */
/* ========================================================================== */

/**
 * Welch's t-test for unequal variances.
 *
 * Tests whether two sets of measurements have significantly different means.
 * Returns the t-statistic, degrees of freedom, and approximate p-value.
 */
function welchTTest(
 a: number[],
 b: number[],
): { tStat: number; df: number; pValue: number } {
 const n1 = a.length;
 const n2 = b.length;

 if (n1 < 2 || n2 < 2) {
  return { tStat: 0, df: 0, pValue: 1 };
 }

 const mean1 = computeMean(a);
 const mean2 = computeMean(b);
 const var1 = computeVariance(a, mean1);
 const var2 = computeVariance(b, mean2);

 const se1 = var1 / n1;
 const se2 = var2 / n2;
 const seDiff = Math.sqrt(se1 + se2);

 if (seDiff === 0) {
  return { tStat: 0, df: n1 + n2 - 2, pValue: 1 };
 }

 const tStat = (mean1 - mean2) / seDiff;

 // Welch-Satterthwaite degrees of freedom
 const numerator = (se1 + se2) ** 2;
 const denominator = (se1 ** 2) / (n1 - 1) + (se2 ** 2) / (n2 - 1);
 const df = denominator === 0 ? n1 + n2 - 2 : numerator / denominator;

 // Approximate two-tailed p-value using the t-distribution CDF
 // Uses the regularized incomplete beta function approximation
 const pValue = tDistPValue(Math.abs(tStat), df);

 return { tStat, df, pValue };
}

/**
 * Approximate two-tailed p-value for a t-distribution.
 *
 * Uses a rational approximation adequate for regression detection
 * (not for publishing p-values in scientific papers).
 */
function tDistPValue(absT: number, df: number): number {
 // Hill's 1970 approximation for the incomplete beta function
 // Adequate for df > 1 and typical benchmark sample sizes
 const x = df / (df + absT * absT);

 if (df <= 0 || !Number.isFinite(absT)) return 1;

 // Use the relationship: p = I_x(df/2, 1/2)
 // Approximated via continued fraction / series
 const a = df / 2;
 const b = 0.5;
 const beta = incompleteBetaApprox(x, a, b);

 return Math.min(1, Math.max(0, beta));
}

/**
 * Regularized incomplete beta function approximation.
 *
 * Uses a series expansion adequate for our use case.
 */
function incompleteBetaApprox(x: number, a: number, b: number): number {
 if (x <= 0) return 0;
 if (x >= 1) return 1;

 // Use the series expansion when x < (a+1)/(a+b+2)
 const threshold = (a + 1) / (a + b + 2);
 if (x > threshold) {
  return 1 - incompleteBetaApprox(1 - x, b, a);
 }

 // Log-beta function using Stirling's approximation
 const logBeta = lgamma(a) + lgamma(b) - lgamma(a + b);
 const prefix = Math.exp(a * Math.log(x) + b * Math.log(1 - x) - logBeta) / a;

 // Series expansion
 let sum = 1;
 let term = 1;
 for (let n = 1; n <= 200; n++) {
  term *= ((n - b) * x) / (a + n);
  sum += term;
  if (Math.abs(term) < 1e-15 * Math.abs(sum)) break;
 }

 return prefix * sum;
}

/**
 * Log-gamma function (Lanczos approximation).
 */
function lgamma(x: number): number {
 const g = 7;
 const c = [
  0.99999999999980993, 676.5203681218851, -1259.1392167224028,
  771.32342877765313, -176.61502916214059, 12.507343278686905,
  -0.13857109526572012, 9.9843695780195716e-6, 1.5056327351493116e-7,
 ];

 if (x < 0.5) {
  return Math.log(Math.PI / Math.sin(Math.PI * x)) - lgamma(1 - x);
 }

 x -= 1;
 let a = c[0]!;
 const t = x + g + 0.5;
 for (let i = 1; i < g + 2; i++) {
  a += c[i]! / (x + i);
 }

 return 0.5 * Math.log(2 * Math.PI) + (x + 0.5) * Math.log(t) - t + Math.log(a);
}

/**
 * Detect performance regression between baseline and current measurements.
 *
 * A regression is flagged when:
 * 1. The p-value from Welch's t-test is below 0.05
 * 2. The effect size exceeds the noise threshold (default 2%)
 *
 * Both conditions must be true to avoid flagging noise as regression.
 */
export function detectRegression(
 baseline: number[],
 current: number[],
 noiseThresholdPercent = 2,
): RegressionResult {
 if (baseline.length < 2 || current.length < 2) {
  return {
   significant: false,
   effectSize: 0,
   pValue: 1,
   baselineMean: computeMean(baseline),
   currentMean: computeMean(current),
   withinThreshold: true,
  };
 }

 const baselineMean = computeMean(baseline);
 const currentMean = computeMean(current);
 const effectSize =
  baselineMean === 0 ? 0 : ((currentMean - baselineMean) / baselineMean) * 100;

 const { pValue } = welchTTest(baseline, current);

 const significant = pValue < 0.05;
 const withinThreshold = Math.abs(effectSize) <= noiseThresholdPercent;

 return {
  significant: significant && !withinThreshold,
  effectSize,
  pValue,
  baselineMean,
  currentMean,
  withinThreshold,
 };
}

/* ========================================================================== */
/* Aggregate Benchmark Statistics                                              */
/* ========================================================================== */

/**
 * Compute full benchmark statistics from raw nanosecond measurements.
 */
export function benchmarkStats(dataNs: number[]): BenchmarkStats {
 const desc = descriptiveStats(dataNs);
 const ci95 = bootstrapCI(dataNs, 0.95);
 const outliers = classifyOutliers(dataNs);
 const opsPerSec = desc.mean > 0 ? 1e9 / desc.mean : 0;

 return {
  ...desc,
  ci95,
  outliers,
  opsPerSec,
 };
}
