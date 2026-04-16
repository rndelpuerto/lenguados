/**
 * Horizontal bar chart showing ops/sec per operation.
 */

import React from 'react';
import BenchmarkChart from './benchmark-chart';
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

function formatOps(value: number): string {
 if (value >= 1e9) return `${(value / 1e9).toFixed(1)}G`;
 if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
 if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
 return String(Math.round(value));
}

export default function OperationBarChart({
 data,
 title,
 height,
}: OperationBarChartProps): React.ReactElement {
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
    itemStyle: { color: 'var(--chart-color-primary, #0072B2)' },
    label: {
     show: true,
     position: 'right',
     formatter: (p: { value: number }) => formatOps(p.value),
     fontSize: 10,
    },
   },
  ],
 };

 return <BenchmarkChart option={option} height={chartHeight} />;
}
