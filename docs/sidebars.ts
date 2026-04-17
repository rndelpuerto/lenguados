import type { SidebarsConfig } from '@docusaurus/plugin-content-docs';

// TypeDoc generates this CJS file during plugin init (before content-docs reads sidebars).
// On fresh builds the file may not exist yet — fall back to empty sidebar.
let typedocSidebar: SidebarsConfig['apiSidebar'] = [];
try {
 typedocSidebar = require('./docs/api/typedoc-sidebar.cjs');
} catch (err) {
 if ((err as NodeJS.ErrnoException).code !== 'MODULE_NOT_FOUND') {
  throw err; // Re-throw unexpected errors (syntax errors, etc.)
 }
}

const sidebars: SidebarsConfig = {
 docsSidebar: [
  'intro',
  'architecture',
  {
   type: 'category',
   label: 'Engine Standards',
   items: [
    'guides/design-philosophy',
    'guides/tsdoc-standard',
    'guides/testing-strategy',
    'guides/iconography-standard',
    'guides/module-exports',
   ],
  },
  {
   type: 'category',
   label: 'Performance',
   items: ['performance/overview', 'performance/methodology', 'performance/interpreting-results'],
  },
  {
   type: 'category',
   label: 'Packages',
   items: [
    {
     type: 'category',
     label: '@lenguados/math2d',
     items: [
      'packages/math2d/overview',
      'packages/math2d/architecture',
      'packages/math2d/design-decisions',
      'packages/math2d/edge-cases',
      'packages/math2d/interoperability',
      'packages/math2d/design-philosophy',
      'packages/math2d/tsdoc-standard',
      'packages/math2d/testing-strategy',
      'packages/math2d/module-exports',
      {
       type: 'category',
       label: 'Performance',
       link: { type: 'doc', id: 'packages/math2d/performance/index' },
       items: [
        'packages/math2d/performance/vector2',
        'packages/math2d/performance/matrices',
        'packages/math2d/performance/rotation-complex',
        'packages/math2d/performance/interval-transform',
        'packages/math2d/performance/auxiliary',
        'packages/math2d/performance/comparisons',
        'packages/math2d/performance/accuracy',
       ],
      },
     ],
    },
    {
     type: 'category',
     label: '@lenguados/common',
     items: ['packages/common/overview'],
    },
    {
     type: 'category',
     label: '@lenguados/examples',
     items: ['packages/examples/overview'],
    },
   ],
  },
  'contributing/index',
 ],
 apiSidebar: typedocSidebar,
};

export default sidebars;
