/**
 * Horizontal bar chart of gzip KB per import path.
 */

import React from 'react';
import BenchmarkChart from './benchmark-chart';
import type { EChartsOption } from 'echarts';

interface BundleSizeData {
 importPath: string;
 rawBytes: number;
 gzipBytes: number;
}

interface BundleSizeChartProps {
 data: BundleSizeData[];
 title?: string;
}

export default function BundleSizeChart({
 data,
 title,
}: BundleSizeChartProps): React.ReactElement {
 const sorted = [...data].sort((a, b) => b.gzipBytes - a.gzipBytes);

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   trigger: 'axis',
   axisPointer: { type: 'shadow' },
   formatter: (params: unknown) => {
    const p = (params as Array<{ name: string; dataIndex: number }>)[0];
    const d = sorted[p.dataIndex];
    return `${d.importPath}<br/>Raw: ${(d.rawBytes / 1024).toFixed(1)} KB<br/>Gzip: ${(d.gzipBytes / 1024).toFixed(1)} KB`;
   },
  },
  grid: { left: '40%', right: '15%', top: title ? 40 : 10, bottom: 20 },
  xAxis: {
   type: 'value',
   axisLabel: { formatter: (v: number) => `${(v / 1024).toFixed(1)} KB` },
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
    itemStyle: { color: '#0072B2' },
    label: {
     show: true,
     position: 'right',
     formatter: (p: { value: number }) => `${(p.value / 1024).toFixed(1)} KB`,
     fontSize: 10,
    },
   },
  ],
 };

 return <BenchmarkChart option={option} height={Math.max(200, sorted.length * 35 + 80)} />;
}
