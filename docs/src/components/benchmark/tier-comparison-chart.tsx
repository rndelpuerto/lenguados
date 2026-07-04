/**
 * Grouped bar chart for default vs safe vs unchecked tier comparison.
 * Uses Okabe-Ito colors with speedup labels.
 */

import React from 'react';
import { useChartPalette } from '../../hooks/use-chart-palette';
import BenchmarkChart from './benchmark-chart';
import { formatOps } from './format';
import type { EChartsOption } from 'echarts';

interface TierData {
 name: string;
 default: { opsPerSec: number };
 safe?: { opsPerSec: number };
 unchecked?: { opsPerSec: number };
 speedup?: { safeVsDefault?: number; uncheckedVsDefault?: number };
}

interface TierComparisonChartProps {
 data: TierData[];
 title?: string;
}

export default function TierComparisonChart({
 data,
 title,
}: TierComparisonChartProps): React.ReactElement {
 const palette = useChartPalette();
 const operations = data.map((d) => d.name);

 const series: EChartsOption['series'] = [
  {
   name: 'default',
   type: 'bar',
   data: data.map((d) => d.default.opsPerSec),
   itemStyle: { color: palette.primary },
  },
 ];

 if (data.some((d) => d.safe)) {
  series.push({
   name: 'safe',
   type: 'bar',
   data: data.map((d) => d.safe?.opsPerSec ?? 0),
   itemStyle: { color: palette.tertiary },
  });
 }

 if (data.some((d) => d.unchecked)) {
  series.push({
   name: 'unchecked',
   type: 'bar',
   data: data.map((d) => d.unchecked?.opsPerSec ?? 0),
   itemStyle: { color: palette.quaternary },
   label: {
    show: true,
    position: 'top',
    formatter: (p: { dataIndex: number }) => {
     const speedup = data[p.dataIndex]?.speedup?.uncheckedVsDefault;
     return speedup ? `${speedup.toFixed(2)}x` : '';
    },
    fontSize: 10,
   },
  });
 }

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   trigger: 'axis',
   axisPointer: { type: 'shadow' },
   formatter: (params: unknown) => {
    const items = params as Array<{ seriesName: string; value: number; marker: string }>;
    const lines = items.map((p) => `${p.marker} ${p.seriesName}: ${formatOps(p.value)} ops/sec`);
    return `${(items[0] as unknown as { name: string }).name}<br/>${lines.join('<br/>')}`;
   },
  },
  legend: { bottom: 0 },
  grid: { left: '10%', right: '5%', top: title ? 40 : 20, bottom: 40 },
  xAxis: { type: 'category', data: operations },
  yAxis: {
   type: 'value',
   axisLabel: { formatter: (v: number) => formatOps(v) },
   name: 'ops/sec',
  },
  series,
 };

 return <BenchmarkChart option={option} height={Math.max(350, data.length * 60 + 100)} />;
}
