/**
 * Entity x operation heatmap showing ops/sec intensity.
 */

import React from 'react';
import BenchmarkChart from './benchmark-chart';
import type { EChartsOption } from 'echarts';

interface HeatmapData {
 entity: string;
 operation: string;
 opsPerSec: number;
}

interface HeatmapChartProps {
 data: HeatmapData[];
 title?: string;
}

function formatOps(value: number): string {
 if (value >= 1e9) return `${(value / 1e9).toFixed(1)}G`;
 if (value >= 1e6) return `${(value / 1e6).toFixed(0)}M`;
 if (value >= 1e3) return `${(value / 1e3).toFixed(0)}K`;
 return String(Math.round(value));
}

export default function HeatmapChart({
 data,
 title,
}: HeatmapChartProps): React.ReactElement {
 const entities = [...new Set(data.map((d) => d.entity))];
 const operations = [...new Set(data.map((d) => d.operation))];

 const maxOps = Math.max(...data.map((d) => d.opsPerSec));

 const seriesData = data.map((d) => [
  operations.indexOf(d.operation),
  entities.indexOf(d.entity),
  d.opsPerSec,
 ]);

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   formatter: (params: unknown) => {
    const p = params as { value: [number, number, number] };
    const op = operations[p.value[0]];
    const ent = entities[p.value[1]];
    return `${ent}.${op}: ${formatOps(p.value[2])} ops/sec`;
   },
  },
  grid: { left: '15%', right: '15%', top: title ? 40 : 10, bottom: 40 },
  xAxis: {
   type: 'category',
   data: operations,
   axisLabel: { rotate: 45, fontSize: 9 },
   splitArea: { show: true },
  },
  yAxis: {
   type: 'category',
   data: entities,
   splitArea: { show: true },
  },
  visualMap: {
   min: 0,
   max: maxOps,
   calculable: true,
   orient: 'horizontal',
   left: 'center',
   bottom: 0,
   inRange: {
    color: ['#f7fbff', '#deebf7', '#9ecae1', '#3182bd', '#08306b'],
   },
   formatter: (value: number) => formatOps(value),
  },
  series: [
   {
    type: 'heatmap',
    data: seriesData,
    label: { show: false },
    emphasis: {
     itemStyle: { shadowBlur: 10, shadowColor: 'rgba(0, 0, 0, 0.5)' },
    },
   },
  ],
 };

 return (
  <BenchmarkChart
   option={option}
   height={Math.max(300, entities.length * 40 + 120)}
  />
 );
}
