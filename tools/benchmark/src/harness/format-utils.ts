/**
 * Shared formatting utilities for ASCII table reporters.
 */

export function padRight(str: string, len: number): string {
 return str.length >= len ? str : str + ' '.repeat(len - str.length);
}

export function padLeft(str: string, len: number): string {
 return str.length >= len ? str : ' '.repeat(len - str.length) + str;
}

export function formatNs(ns: number): string {
 if (ns < 1000) return `${ns.toFixed(1)} ns`;
 if (ns < 1e6) return `${(ns / 1000).toFixed(1)} us`;
 if (ns < 1e9) return `${(ns / 1e6).toFixed(1)} ms`;
 return `${(ns / 1e9).toFixed(2)} s`;
}

export function formatOpsPerSec(ops: number): string {
 if (ops >= 1e9) return `${(ops / 1e9).toFixed(2)}B`;
 if (ops >= 1e6) return `${(ops / 1e6).toFixed(2)}M`;
 if (ops >= 1e3) return `${(ops / 1e3).toFixed(2)}K`;
 return `${ops.toFixed(0)}`;
}
