/**
 * Side-by-side bar chart comparing two libraries operation by operation.
 * Colors come from the `--chart-color-*` palette: primary for this project,
 * secondary for the competitor, and the tie gray for operations within the
 * 2.5% equivalence threshold (`withinEquivalence`).
 */

import React from 'react';
import { useChartPalette } from '../../hooks/use-chart-palette';
import BenchmarkChart from './benchmark-chart';
import { formatOps } from './format';
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

export default function ComparisonChart({
 data,
 libraries,
 title,
}: ComparisonChartProps): React.ReactElement {
 const palette = useChartPalette();
 const [lib1, lib2] = libraries;
 const operations = data.map((d) => d.name);
 const hasTies = data.some((d) => d.withinEquivalence === true);

 const seriesData = (library: string, baseColor: string) =>
  data.map((d) => ({
   value: d.results[library]?.opsPerSec ?? 0,
   itemStyle: { color: d.withinEquivalence === true ? palette.tie : baseColor },
  }));

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   trigger: 'axis',
   axisPointer: { type: 'shadow' },
   formatter: (params: unknown) => {
    const items = params as Array<{
     seriesName: string;
     value: number;
     marker: string;
     dataIndex: number;
    }>;
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
    data: seriesData(lib1, palette.primary),
    itemStyle: { color: palette.primary },
   },
   {
    name: lib2,
    type: 'bar',
    data: seriesData(lib2, palette.secondary),
    itemStyle: { color: palette.secondary },
   },
  ],
 };

 return (
  <>
   <BenchmarkChart option={option} height={Math.max(300, data.length * 40 + 100)} />
   {hasTies && (
    <p style={{ fontSize: '0.85rem', color: 'var(--ifm-color-emphasis-600)', margin: '0.25rem 0' }}>
     Gray bars mark statistical ties — operations whose throughput difference is within the 2.5%
     equivalence threshold.
    </p>
   )}
  </>
 );
}
