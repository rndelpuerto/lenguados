/**
 * Unified diagnostic report for aggregating findings across all suites.
 *
 * Categorizes findings by severity (error/warning/info) and type
 * (overflow, underflow, NaN propagation, cancellation, timeout, etc.).
 */

/* ========================================================================== */
/* Types                                                                       */
/* ========================================================================== */

export type FindingSeverity = 'error' | 'warning' | 'info';

export type FindingType =
 | 'overflow'
 | 'underflow'
 | 'nan-propagation'
 | 'cancellation'
 | 'timeout'
 | 'crash'
 | 'allocation-leak'
 | 'cpu-divergence';

export interface DiagnosticFinding {
 severity: FindingSeverity;
 type: FindingType;
 entity: string;
 operation: string;
 message: string;
 details?: Record<string, unknown>;
}

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

export function createDiagnosticReport(): DiagnosticReport {
 return {
  findings: [],
  summary: {
   'overflow': 0,
   'underflow': 0,
   'nan-propagation': 0,
   'cancellation': 0,
   'timeout': 0,
   'crash': 0,
   'allocation-leak': 0,
   'cpu-divergence': 0,
  },
  totalErrors: 0,
  totalWarnings: 0,
  totalInfos: 0,
 };
}

export function addFinding(report: DiagnosticReport, finding: DiagnosticFinding): void {
 report.findings.push(finding);
 report.summary[finding.type]++;
 switch (finding.severity) {
  case 'error': report.totalErrors++; break;
  case 'warning': report.totalWarnings++; break;
  case 'info': report.totalInfos++; break;
 }
}

export function formatDiagnosticSummary(report: DiagnosticReport): string {
 const total = report.findings.length;
 if (total === 0) return '0 findings. All operations within expected bounds.';

 const parts: string[] = [];
 for (const [type, count] of Object.entries(report.summary)) {
  if (count > 0) {
   const entities = [...new Set(
    report.findings
     .filter((f) => f.type === type)
     .map((f) => f.entity),
   )];
   parts.push(`${count} ${type} (${entities.join(', ')})`);
  }
 }

 return `${total} findings: ${parts.join(', ')}`;
}
