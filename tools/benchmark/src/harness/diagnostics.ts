/**
 * @file harness/diagnostics.ts
 * @description Provide a unified diagnostic report for aggregating findings across all suites
 *
 * Categorizes findings by severity (error/warning/info) and type
 * (overflow, underflow, NaN propagation, cancellation, timeout, etc.).
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

/** Severity level of a diagnostic finding */
export type FindingSeverity = 'error' | 'warning' | 'info';

/** Classification type of a diagnostic finding */
export type FindingType =
 | 'overflow'
 | 'underflow'
 | 'nan-propagation'
 | 'cancellation'
 | 'timeout'
 | 'crash'
 | 'allocation-leak'
 | 'cpu-divergence';

/** Represent a single diagnostic finding with severity, type, and context */
export interface DiagnosticFinding {
 severity: FindingSeverity;
 type: FindingType;
 entity: string;
 operation: string;
 message: string;
 details?: Record<string, unknown>;
}

/** Aggregate diagnostic findings with summary counts by type and severity */
export interface DiagnosticReport {
 findings: DiagnosticFinding[];
 summary: Record<FindingType, number>;
 totalErrors: number;
 totalWarnings: number;
 totalInfos: number;
}

/* ========================================================================== */
/* Lifecycle                                                                   */
/* ========================================================================== */

/**
 * Create an empty diagnostic report with zeroed counters
 *
 * @returns A fresh DiagnosticReport ready to accumulate findings
 */
export function createDiagnosticReport(): DiagnosticReport {
 return {
  findings: [],
  summary: {
   overflow: 0,
   underflow: 0,
   'nan-propagation': 0,
   cancellation: 0,
   timeout: 0,
   crash: 0,
   'allocation-leak': 0,
   'cpu-divergence': 0,
  },
  totalErrors: 0,
  totalWarnings: 0,
  totalInfos: 0,
 };
}

/**
 * Add a finding to a diagnostic report and update summary counters
 *
 * @param report - The diagnostic report to add the finding to
 * @param finding - The diagnostic finding to record
 */
export function addFinding(report: DiagnosticReport, finding: DiagnosticFinding): void {
 report.findings.push(finding);
 report.summary[finding.type]++;
 switch (finding.severity) {
  case 'error':
   report.totalErrors++;
   break;
  case 'warning':
   report.totalWarnings++;
   break;
  case 'info':
   report.totalInfos++;
   break;
 }
}

/**
 * Format a diagnostic report summary as a human-readable string
 *
 * @param report - The diagnostic report to summarize
 * @returns A summary string listing finding counts by type and affected entities
 */
export function formatDiagnosticSummary(report: DiagnosticReport): string {
 const total = report.findings.length;
 if (total === 0) return '0 findings. All operations within expected bounds.';

 const parts: string[] = [];
 for (const [type, count] of Object.entries(report.summary)) {
  if (count > 0) {
   const entities = [
    ...new Set(report.findings.filter((f) => f.type === type).map((f) => f.entity)),
   ];
   parts.push(`${count} ${type} (${entities.join(', ')})`);
  }
 }

 return `${total} findings: ${parts.join(', ')}`;
}
