/**
 * FNV-1a state hash for determinism verification.
 *
 * Computes a deterministic hash over raw Float64Array bytes.
 * Sensitive to single-ULP differences — any bit change in any
 * double produces a different hash.
 */

const FNV_OFFSET_BASIS = 0x811c9dc5;
const FNV_PRIME = 0x01000193;

/**
 * Compute FNV-1a hash over an array of doubles.
 *
 * Reinterprets each double as 8 raw bytes via shared ArrayBuffer,
 * then applies the FNV-1a algorithm.
 *
 * Returns a 32-bit unsigned integer as a hex string.
 */
export function hashFloat64Array(values: number[]): string {
 const buf = new ArrayBuffer(8);
 const f64 = new Float64Array(buf);
 const u8 = new Uint8Array(buf);

 let hash = FNV_OFFSET_BASIS;

 for (let i = 0; i < values.length; i++) {
  f64[0] = values[i]!;
  for (let b = 0; b < 8; b++) {
   hash ^= u8[b]!;
   hash = Math.imul(hash, FNV_PRIME);
  }
 }

 return (hash >>> 0).toString(16).padStart(8, '0');
}

/**
 * Compare hashes from two engines/runs.
 * Returns true if they match (deterministic), false if they diverge.
 */
export function hashesMatch(a: string, b: string): boolean {
 return a === b;
}
