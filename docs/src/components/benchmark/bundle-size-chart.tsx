/**
 * Horizontal bar chart of gzip KB per import path, with optional per-entry
 * budget markers when the summary data carries `budgetGzipBytes`.
 */

import React from 'react';
import { useChartPalette } from '../../hooks/use-chart-palette';
import BenchmarkChart from './benchmark-chart';
import { formatKB } from './format';
import type { EChartsOption } from 'echarts';

interface BundleSizeData {
 importPath: string;
 rawBytes: number;
 gzipBytes: number;
 budgetGzipBytes?: number;
}

interface BundleSizeChartProps {
 data: BundleSizeData[];
 title?: string;
}

export default function BundleSizeChart({ data, title }: BundleSizeChartProps): React.ReactElement {
 const palette = useChartPalette();
 const sorted = [...data].sort((a, b) => b.gzipBytes - a.gzipBytes);
 const hasBudgets = sorted.some((d) => typeof d.budgetGzipBytes === 'number');

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   trigger: 'axis',
   axisPointer: { type: 'shadow' },
   formatter: (params: unknown) => {
    const p = (params as Array<{ name: string; dataIndex: number }>)[0];
    const d = sorted[p.dataIndex];
    const budget =
     typeof d.budgetGzipBytes === 'number' ? `<br/>Budget: ${formatKB(d.budgetGzipBytes)}` : '';
    return `${d.importPath}<br/>Raw: ${formatKB(d.rawBytes)}<br/>Gzip: ${formatKB(d.gzipBytes)}${budget}`;
   },
  },
  grid: { left: '40%', right: '15%', top: title ? 40 : 10, bottom: 20 },
  xAxis: {
   type: 'value',
   axisLabel: { formatter: (v: number) => formatKB(v) },
   name: 'gzip size',
  },
  yAxis: {
   type: 'category',
   data: sorted.map((d) => d.importPath),
   inverse: true,
   axisLabel: { fontSize: 10 },
  },
  series: [
   {
    type: 'bar',
    data: sorted.map((d) => d.gzipBytes),
    itemStyle: { color: palette.primary },
    label: {
     show: true,
     position: 'right',
     formatter: (p) => formatKB(Number((p as { value: number }).value)),
     fontSize: 10,
    },
   },
   // Budget markers: an outlined overlay bar per budgeted entry, rendered as
   // a boundary so the distance between measured size and budget is visible.
   ...(hasBudgets
    ? [
       {
        type: 'bar' as const,
        barGap: '-100%',
        data: sorted.map((d) => (typeof d.budgetGzipBytes === 'number' ? d.budgetGzipBytes : null)),
        itemStyle: { color: 'rgba(0,0,0,0)', borderColor: palette.secondary, borderWidth: 1 },
        emphasis: { disabled: true },
        tooltip: { show: false },
       },
      ]
    : []),
  ],
 };

 return <BenchmarkChart option={option} height={Math.max(200, sorted.length * 35 + 80)} />;
}
