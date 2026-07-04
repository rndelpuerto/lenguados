/**
 * Barrel export for benchmark components.
 *
 * ECharts-dependent components are wrapped in BrowserOnly to prevent
 * SSG failures (Docusaurus runs in Node.js during static site generation).
 * Non-ECharts components are exported directly.
 */

import React from 'react';
import BrowserOnly from '@docusaurus/BrowserOnly';

/* ========================================================================== */
/* ECharts-dependent components (require BrowserOnly wrapper)                   */
/* ========================================================================== */

function createBrowserOnlyChart<P extends object>(
 loader: () => { default: React.ComponentType<P> },
): React.ComponentType<P> {
 return function BrowserOnlyChart(props: P) {
  // Reserve vertical space in the SSR fallback to reduce layout shift when
  // the chart mounts client-side (charts are at least 200-300px tall).
  const fallbackStyle: React.CSSProperties = {
   minHeight: 300,
   display: 'flex',
   alignItems: 'center',
   justifyContent: 'center',
   color: 'var(--ifm-color-emphasis-500)',
  };
  return React.createElement(BrowserOnly, {
   fallback: React.createElement('div', { style: fallbackStyle }, 'Loading chart...'),
   children: () => {
    const Component = loader().default;
    return React.createElement(Component, props);
   },
  });
 };
}

export const OperationBarChart = createBrowserOnlyChart(() => require('./operation-bar-chart'));

export const TierComparisonChart = createBrowserOnlyChart(() => require('./tier-comparison-chart'));

export const ComparisonChart = createBrowserOnlyChart(() => require('./comparison-chart'));

export const UlpAccuracyChart = createBrowserOnlyChart(() => require('./ulp-accuracy-chart'));

export const BundleSizeChart = createBrowserOnlyChart(() => require('./bundle-size-chart'));

export const HeatmapChart = createBrowserOnlyChart(() => require('./heatmap-chart'));

/* ========================================================================== */
/* Non-ECharts components (safe for SSR)                                       */
/* ========================================================================== */

export { default as DataTable } from './data-table';
export { default as TldrBox } from './tldr-box';
export { default as InsightCallout } from './insight-callout';
export { default as MethodologyNote } from './methodology-note';
export { default as NoDataFallback } from './no-data-fallback';
export { default as PartialDataNotice } from './partial-data-notice';

/* ========================================================================== */
/* Shared formatting utilities                                                 */
/* ========================================================================== */

export { formatOps, formatKB } from './format';
