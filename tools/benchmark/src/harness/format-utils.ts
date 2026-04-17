/**
 * @file harness/format-utils.ts
 * @description Provide shared formatting utilities for ASCII table reporters
 */

/**
 * Pad a string with trailing spaces to reach the specified length
 *
 * @param str - The string to pad
 * @param len - The target length
 * @returns The right-padded string, or the original if already at or beyond target length
 */
export function padRight(str: string, len: number): string {
 return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

/**
 * Pad a string with leading spaces to reach the specified length
 *
 * @param str - The string to pad
 * @param len - The target length
 * @returns The left-padded string, or the original if already at or beyond target length
 */
export function padLeft(str: string, len: number): string {
 return str.length >= len ? str : ' '.repeat(len - str.length) + str;
}

/**
 * Format a nanosecond duration into a human-readable string with auto-scaling units
 *
 * @param ns - The duration in nanoseconds
 * @returns A formatted string like '1.5 ns', '3.2 us', '10.0 ms', or '1.20 s'
 */
export function formatNs(ns: number): string {
 if (ns < 1000) return `${ns.toFixed(1)} ns`;
 if (ns < 1e6) return `${(ns / 1000).toFixed(1)} us`;
 if (ns < 1e9) return `${(ns / 1e6).toFixed(1)} ms`;
 return `${(ns / 1e9).toFixed(2)} s`;
}

/**
 * Format an operations-per-second value with SI suffixes
 *
 * @param ops - The operations per second value
 * @returns A formatted string like '1.50B', '3.20M', '250.00K', or '42'
 */
export function formatOpsPerSec(ops: number): string {
 if (ops >= 1e9) return `${(ops / 1e9).toFixed(2)}B`;
 if (ops >= 1e6) return `${(ops / 1e6).toFixed(2)}M`;
 if (ops >= 1e3) return `${(ops / 1e3).toFixed(2)}K`;
 return `${ops.toFixed(0)}`;
}
