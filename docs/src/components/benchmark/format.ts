/**
 * Shared number formatters for benchmark charts, tables, and MDX pages.
 *
 * Single source of truth: every component and performance page imports these
 * instead of defining local copies, so throughput and byte values render
 * identically across the whole docs site.
 */

/**
 * Formats an operations-per-second value with a magnitude suffix
 *
 * @remarks
 * Tiers: `G` (billions, one decimal), `M` (millions), `K` (thousands),
 * and the rounded plain number below one thousand.
 * @param value - operations-per-second value to format
 * @returns the formatted value with its magnitude suffix
 * @example formatOps(257_000_000); // '257M'
 * @category Helpers
 * @since 0.7.0
 */
export function formatOps(value: number): string {
 if (value >= 1e9) return `${(value / 1e9).toFixed(1)}G`;
 if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
 if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
 return String(Math.round(value));
}

/**
 * Formats a byte count as kibibytes with one decimal
 *
 * @param bytes - byte count to format
 * @returns the formatted size (for example `6.6 KB`)
 * @example formatKB(6572); // '6.4 KB'
 * @category Helpers
 * @since 0.7.0
 */
export function formatKB(bytes: number): string {
 return `${(bytes / 1024).toFixed(1)} KB`;
}
