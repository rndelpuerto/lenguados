import type * as Preset from '@docusaurus/preset-classic';
import type { Config } from '@docusaurus/types';
import { themes as prismThemes } from 'prism-react-renderer';
import rehypeKatex from 'rehype-katex';
import remarkMath from 'remark-math';

const config: Config = {
 future: {
  v4: true,
  faster: true,
 },

 title: 'Lenguados',
 tagline:
  'TypeScript\u2011based, lightweight, deterministic, and extensible 2\u2011D physics engine.',
 favicon: 'img/favicon.ico',

 markdown: {
  format: 'detect',
  mermaid: true,
 },

 url: 'https://rndelpuerto.github.io',
 baseUrl: '/lenguados/',

 organizationName: 'rndelpuerto',
 projectName: 'lenguados',
 deploymentBranch: 'gh-pages',

 onBrokenLinks: 'throw',
 // onBrokenLinks does not cover #fragment links; without this, a dead anchor
 // ships silently as a warning with exit code 0.
 onBrokenAnchors: 'throw',

 headTags: [
  {
   tagName: 'link',
   attributes: {
    rel: 'apple-touch-icon',
    sizes: '180x180',
    href: '/lenguados/img/apple-touch-icon.png',
   },
  },
 ],

 i18n: {
  defaultLocale: 'en',
  locales: ['en'],
 },

 presets: [
  [
   'classic',
   {
    docs: {
     sidebarPath: './sidebars.ts',
     remarkPlugins: [remarkMath],
     rehypePlugins: [rehypeKatex],
    },
    theme: {
     customCss: './src/css/custom.css',
    },
   } satisfies Preset.Options,
  ],
 ],

 plugins: [
  './src/plugins/benchmark-data-plugin.ts',
  [
   'docusaurus-plugin-typedoc',
   {
    id: 'api',
    entryPoints: ['../packages/*'],
    entryPointStrategy: 'packages',
    // With entryPointStrategy: 'packages', TypeDoc bootstraps a per-package
    // converter and reads `typedocOptions` from each package.json. Options
    // declared here at the plugin root apply only to the outer shell; the
    // per-package converters need their config inside the `packageOptions`
    // block below. Per-package entry points still come from each
    // `packages/<pkg>/package.json` typedocOptions.entryPoints.
    packageOptions: {
     // Register the project's TSDoc extension tags alongside TypeDoc's defaults.
     // TypeDoc replaces (not merges) the built-in `blockTags` list when the option
     // is set, so this array must include both the TypeDoc defaults and the
     // project-specific tags defined in docs/docs/guides/tsdoc-standard.md §1.
     blockTags: [
      // TypeDoc built-in block tags (from typedoc/dist/lib/utils/options/tsdoc-defaults.js).
      '@defaultValue',
      '@deprecated',
      '@example',
      '@jsx',
      '@param',
      '@privateRemarks',
      '@remarks',
      '@returns',
      '@see',
      '@throws',
      '@typeParam',
      '@author',
      '@callback',
      '@category',
      '@categoryDescription',
      '@default',
      '@document',
      '@extends',
      '@augments',
      '@yields',
      '@group',
      '@groupDescription',
      '@import',
      '@inheritDoc',
      '@license',
      '@module',
      '@mergeModuleWith',
      '@prop',
      '@property',
      '@return',
      '@satisfies',
      '@since',
      '@sortStrategy',
      '@template',
      '@this',
      '@type',
      '@typedef',
      '@summary',
      '@preventInline',
      '@inlineType',
      '@preventExpand',
      '@expandType',
      // Project-specific TSDoc extension tags.
      '@file',
      '@description',
      '@internal',
      '@constant',
      '@public',
      '@packageDocumentation',
     ],
     excludeInternal: true,
    },
    tsconfig: '../tsconfig.json',
    exclude: ['**/test/**/*'],
    readme: 'none',
    excludeScopesInPaths: true,
    cleanOutputDir: true,
    categorizeByGroup: true,
    excludeInternal: true,
    parametersFormat: 'table',
    hideBreadcrumbs: true,
    sidebar: {
     autoConfiguration: true,
     pretty: true,
    },
   },
  ],
 ],

 themes: [
  '@docusaurus/theme-mermaid',
  [
   require.resolve('@easyops-cn/docusaurus-search-local'),
   {
    hashed: true,
    indexDocs: true,
    indexBlog: false,
    indexPages: false,
    language: ['en'],
   },
  ],
 ],

 themeConfig: {
  image: 'img/social-card.png',
  navbar: {
   title: 'Lenguados',
   logo: {
    alt: 'Lenguados Logo',
    src: 'img/logo.svg',
   },
   items: [
    {
     type: 'docSidebar',
     sidebarId: 'docsSidebar',
     position: 'left',
     label: 'Docs',
    },
    {
     type: 'docSidebar',
     sidebarId: 'apiSidebar',
     position: 'left',
     label: 'API',
    },
    {
     href: 'https://github.com/rndelpuerto/lenguados',
     position: 'right',
     className: 'header-github-link',
     'aria-label': 'GitHub repository',
    },
   ],
  },
  footer: {
   style: 'dark',
   links: [
    {
     title: 'Documentation',
     items: [
      {
       label: 'Getting Started',
       to: '/docs/intro',
      },
      {
       label: 'API Reference',
       to: '/docs/api',
      },
     ],
    },
    {
     title: 'More',
     items: [
      {
       label: 'GitHub',
       href: 'https://github.com/rndelpuerto/lenguados',
      },
      {
       label: 'License (Apache-2.0)',
       href: 'https://github.com/rndelpuerto/lenguados/blob/main/LICENSE',
      },
     ],
    },
   ],
   copyright: `Copyright \u00A9 ${new Date().getFullYear()} Lenguados.`,
  },
  prism: {
   theme: prismThemes.github,
   darkTheme: prismThemes.dracula,
  },
 } satisfies Preset.ThemeConfig,
};

export default config;
