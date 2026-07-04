/**
 * @file dx/budget-gate.ts
 * @description Pure budget-evaluation core for the bundle-size gate
 *
 * Separated from the CLI (scripts/size.ts) so the gate semantics —
 * pass, breach, and the unmeasurable-is-a-breach rule — are unit-testable
 * with an injected measurer (no esbuild invocation in tests).
 */

import type { BundleSizeResult } from './bundle-size.ts';
import type { DxConfig } from '../harness/dx-types.ts';

/** One evaluated budget row */
export interface BudgetRow {
 label: string;
 /** Measured gzip bytes, or null when bundling failed (unmeasurable) */
 measuredGzipBytes: number | null;
 budgetGzipBytes: number;
 /** true when measured within budget; false on breach OR unmeasurable */
 withinBudget: boolean;
}

/** Aggregate result of gating one package's budgeted entries */
export interface BudgetGateResult {
 rows: BudgetRow[];
 breaches: number;
}

/**
 * Evaluate every budgeted entry of a dx configuration
 *
 * @remarks
 * An entry whose measurement is null (bundling failure) counts as a breach:
 * a budget that cannot be verified must never pass silently.
 *
 * @param imports - The package's dx-config imports array
 * @param measure - Measurer invoked per budgeted entry (injectable for tests)
 * @returns Rows for every budgeted entry plus the breach count
 */
export function gateBudgetedEntries(
 imports: DxConfig['imports'],
 measure: (statement: string, label: string) => BundleSizeResult | null,
): BudgetGateResult {
 const rows: BudgetRow[] = [];
 let breaches = 0;

 for (const entry of imports) {
  if (entry.budgetGzipBytes === undefined) continue;

  const result = measure(entry.statement, entry.label);
  const measuredGzipBytes = result?.gzipBytes ?? null;
  const withinBudget = measuredGzipBytes !== null && measuredGzipBytes <= entry.budgetGzipBytes;
  if (!withinBudget) breaches++;

  rows.push({
   label: entry.label,
   measuredGzipBytes,
   budgetGzipBytes: entry.budgetGzipBytes,
   withinBudget,
  });
 }

 return { rows, breaches };
}

/**
 * Decide whether a package participates in the budget gate
 *
 * @param config - The package's resolved DxConfig, or null when it has none
 * @returns true when at least one import entry declares a budget
 */
export function hasDeclaredBudgets(config: Pick<DxConfig, 'imports'> | null): boolean {
 return config !== null && config.imports.some((entry) => entry.budgetGzipBytes !== undefined);
}
