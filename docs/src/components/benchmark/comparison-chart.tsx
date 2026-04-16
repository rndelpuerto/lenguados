/**
 * Side-by-side bar chart comparing lenguados vs gl-matrix.
 * Uses blue (#0072B2) for lenguados, vermillion (#D55E00) for competitor,
 * and gray for ties within 2.5% equivalence threshold.
 */

import React from 'react';
import BenchmarkChart from './benchmark-chart';
import type { EChartsOption } from 'echarts';

interface ComparisonData {
 name: string;
 results: Record<string, { opsPerSec: number }>;
 ratio: number | null;
 withinEquivalence: boolean | null;
}

interface ComparisonChartProps {
 data: ComparisonData[];
 libraries: string[];
 title?: string;
}

function formatOps(value: number): string {
 if (value >= 1e9) return `${(value / 1e9).toFixed(1)}G`;
 if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
 if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
 return String(Math.round(value));
}

const COLORS = {
 primary: '#0072B2',
 competitor: '#D55E00',
 tie: '#888888',
};

export default function ComparisonChart({
 data,
 libraries,
 title,
}: ComparisonChartProps): React.ReactElement {
 const [lib1, lib2] = libraries;
 const operations = data.map((d) => d.name);

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   trigger: 'axis',
   axisPointer: { type: 'shadow' },
   formatter: (params: unknown) => {
    const items = params as Array<{ seriesName: string; value: number; marker: string; dataIndex: number }>;
    const d = data[items[0].dataIndex];
    const lines = items.map((p) => `${p.marker} ${p.seriesName}: ${formatOps(p.value)} ops/sec`);
    const ratioStr = d.ratio != null ? `<br/>Ratio: ${d.ratio.toFixed(3)}x` : '';
    const eqStr = d.withinEquivalence ? ' (equivalent)' : '';
    return `${d.name}${ratioStr}${eqStr}<br/>${lines.join('<br/>')}`;
   },
  },
  legend: { bottom: 0 },
  grid: { left: '25%', right: '10%', top: title ? 40 : 10, bottom: 40 },
  yAxis: {
   type: 'category',
   data: operations,
   inverse: true,
   axisLabel: { fontSize: 11 },
  },
  xAxis: {
   type: 'value',
   axisLabel: { formatter: (v: number) => formatOps(v) },
   name: 'ops/sec',
  },
  series: [
   {
    name: lib1,
    type: 'bar',
    data: data.map((d) => d.results[lib1]?.opsPerSec ?? 0),
    itemStyle: { color: COLORS.primary },
   },
   {
    name: lib2,
    type: 'bar',
    data: data.map((d) => d.results[lib2]?.opsPerSec ?? 0),
    itemStyle: { color: COLORS.competitor },
   },
  ],
 };

 return <BenchmarkChart option={option} height={Math.max(300, data.length * 40 + 100)} />;
}
