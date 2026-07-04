/**
 * Entity x operation heatmap showing ops/sec intensity.
 *
 * Color is mapped on a log10 scale: throughput spans several orders of
 * magnitude (tens of thousands to billions of ops/sec), so a linear ramp
 * would render almost every cell at the pale end and hide all contrast.
 * The ramp direction is theme-aware — on dark backgrounds low values recede
 * into darkness and high values glow bright, preserving perceived intensity.
 */

import React from 'react';
import { useColorMode } from '@docusaurus/theme-common';
import BenchmarkChart from './benchmark-chart';
import { formatOps } from './format';
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

/** Sequential blues ramp for light backgrounds: low = near-white, high = dark. */
const LIGHT_RAMP = ['#f7fbff', '#deebf7', '#9ecae1', '#3182bd', '#08306b'];

/** Reversed ramp for dark backgrounds: low = dark, high = near-white (bright). */
const DARK_RAMP = [...LIGHT_RAMP].reverse();

export default function HeatmapChart({ data, title }: HeatmapChartProps): React.ReactElement {
 const { colorMode } = useColorMode();
 const entities = [...new Set(data.map((d) => d.entity))];
 // Alphabetical column order clusters an operation's variants (add, add (out),
 // addSafe, ...) together, making the sparse entity/operation grid scannable.
 const operations = [...new Set(data.map((d) => d.operation))].sort((a, b) => a.localeCompare(b));

 const logValues = data.map((d) => Math.log10(Math.max(1, d.opsPerSec)));
 const minLog = Math.floor(Math.min(...logValues));
 const maxLog = Math.ceil(Math.max(...logValues));

 // [xIndex, yIndex, log10(opsPerSec) for color mapping, raw opsPerSec for tooltip]
 const seriesData = data.map((d, i) => [
  operations.indexOf(d.operation),
  entities.indexOf(d.entity),
  logValues[i],
  d.opsPerSec,
 ]);

 const option: EChartsOption = {
  title: title ? { text: title, left: 'center' } : undefined,
  tooltip: {
   formatter: (params: unknown) => {
    const p = params as { value: [number, number, number, number] };
    const op = operations[p.value[0]];
    const ent = entities[p.value[1]];
    return `${ent}.${op}: ${formatOps(p.value[3])} ops/sec`;
   },
  },
  grid: { left: '15%', right: '15%', top: title ? 40 : 10, bottom: 40 },
  xAxis: {
   type: 'category',
   data: operations,
   axisLabel: { rotate: 45, fontSize: 9, hideOverlap: true },
   splitArea: { show: true },
  },
  yAxis: {
   type: 'category',
   data: entities,
   splitArea: { show: true },
  },
  visualMap: {
   min: minLog,
   max: maxLog,
   dimension: 2,
   calculable: true,
   orient: 'horizontal',
   left: 'center',
   bottom: 0,
   inRange: {
    color: colorMode === 'dark' ? DARK_RAMP : LIGHT_RAMP,
   },
   // Handle labels show real throughput, not the log-scale internals.
   formatter: (value) => formatOps(10 ** Number(value)),
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

 return <BenchmarkChart option={option} height={Math.max(300, entities.length * 40 + 120)} />;
}
