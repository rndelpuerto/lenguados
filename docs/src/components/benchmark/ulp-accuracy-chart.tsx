/**
 * Stacked bar chart for ULP histogram per deterministic kernel.
 */

import React from 'react';
import { useChartPalette } from '../../hooks/use-chart-palette';
import BenchmarkChart from './benchmark-chart';
import type { EChartsOption } from 'echarts';

interface UlpData {
 fn: string;
 histogram: Record<string, number>;
 maxUlp: number;
 meanUlp: number;
}

interface UlpAccuracyChartProps {
 data: UlpData[];
 title?: string;
}

/**
 * Sort value for a ULP histogram bucket key. Bucket keys are either exact
 * counts ('0', '1') or open-ended trailing-plus buckets ('2+'), which must
 * sort after every bounded bucket — treated as +Infinity here.
 */
function bucketSortValue(key: string): number {
 return key.endsWith('+') ? Number.POSITIVE_INFINITY : Number(key);
}

export default function UlpAccuracyChart({
 data,
 title,
}: UlpAccuracyChartProps): React.ReactElement {
 const palette = useChartPalette();
 const functions = data.map((d) => d.fn);

 // Collect all ULP bucket keys across all functions
 const allKeys = new Set<string>();
 for (const d of data) {
  for (const key of Object.keys(d.histogram)) {
   allKeys.add(key);
  }
 }
 const sortedKeys = [...allKeys].sort((a, b) => {
  const diff = bucketSortValue(a) - bucketSortValue(b);
  // Two open-ended buckets (both +Infinity) fall back to their numeric prefix.
  return Number.isNaN(diff) ? Number.parseFloat(a) - Number.parseFloat(b) : diff;
 });

 const colors = [
  palette.tertiary,
  palette.primary,
  palette.quaternary,
  palette.secondary,
  palette.quinary,
 ];

 const series: EChartsOption['series'] = sortedKeys.map((key, i) => ({
  name: `${key} ULP`,
  type: 'bar' as const,
  stack: 'ulp',
  data: data.map((d) => d.histogram[key] ?? 0),
  itemStyle: { color: colors[i % colors.length] },
 }));

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   trigger: 'axis',
   axisPointer: { type: 'shadow' },
  },
  legend: { bottom: 0 },
  grid: { left: '15%', right: '5%', top: title ? 40 : 10, bottom: 40 },
  xAxis: { type: 'category', data: functions },
  yAxis: {
   type: 'value',
   name: 'Sample Count',
  },
  series,
 };

 return <BenchmarkChart option={option} />;
}
