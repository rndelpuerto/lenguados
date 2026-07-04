/**
 * Tree-shaken ECharts setup.
 *
 * Imports only the chart types and components used by benchmark pages
 * to minimize bundle size (~150-200 KB vs ~1 MB for full ECharts).
 */

import { BarChart, HeatmapChart } from 'echarts/charts';
import {
 AriaComponent,
 GridComponent,
 LegendComponent,
 TitleComponent,
 TooltipComponent,
 VisualMapComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
import { SVGRenderer } from 'echarts/renderers';

echarts.use([
 BarChart,
 HeatmapChart,
 GridComponent,
 TooltipComponent,
 LegendComponent,
 TitleComponent,
 AriaComponent,
 VisualMapComponent,
 SVGRenderer,
]);

export { echarts };
