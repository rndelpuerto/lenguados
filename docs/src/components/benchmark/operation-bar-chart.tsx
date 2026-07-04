/**
 * Horizontal bar chart showing ops/sec per operation.
 */

import React from 'react';
import { useChartPalette } from '../../hooks/use-chart-palette';
import BenchmarkChart from './benchmark-chart';
import { formatOps } from './format';
import type { EChartsOption } from 'echarts';

interface OperationData {
 name: string;
 opsPerSec: number;
 ci95?: [number, number];
}

interface OperationBarChartProps {
 data: OperationData[];
 title?: string;
 height?: number;
}

export default function OperationBarChart({
 data,
 title,
 height,
}: OperationBarChartProps): React.ReactElement {
 const palette = useChartPalette();
 const sorted = [...data].sort((a, b) => b.opsPerSec - a.opsPerSec);
 const chartHeight = height ?? Math.max(300, sorted.length * 28 + 80);

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   trigger: 'axis',
   axisPointer: { type: 'shadow' },
   formatter: (params: unknown) => {
    const p = (params as Array<{ name: string; value: number }>)[0];
    return `${p.name}: ${formatOps(p.value)} ops/sec`;
   },
  },
  grid: { left: '30%', right: '15%', top: title ? 40 : 10, bottom: 20 },
  xAxis: {
   type: 'value',
   axisLabel: { formatter: (v: number) => formatOps(v) },
   name: 'ops/sec',
  },
  yAxis: {
   type: 'category',
   data: sorted.map((d) => d.name),
   inverse: true,
   axisLabel: { fontSize: 11 },
  },
  series: [
   {
    type: 'bar',
    data: sorted.map((d) => d.opsPerSec),
    itemStyle: { color: palette.primary },
    label: {
     show: true,
     position: 'right',
     formatter: (p) => formatOps(Number((p as { value: number }).value)),
     fontSize: 10,
    },
   },
  ],
 };

 return <BenchmarkChart option={option} height={chartHeight} />;
}
