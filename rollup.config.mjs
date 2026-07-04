import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import polyfillNode from 'rollup-plugin-polyfill-node';
import { visualizer } from 'rollup-plugin-visualizer';
import { dts } from 'rollup-plugin-dts';
import { swc, minify } from 'rollup-plugin-swc3';
import terser from '@rollup/plugin-terser';
import copy from 'rollup-plugin-copy';

// Compute __dirname in ESM
const __dirname = path.dirname(fileURLToPath(import.meta.url));

// -------------------------
// Environment & Flags
// -------------------------
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const IS_PRODUCTION = ENV === 'production';
const TSCONFIG_FILE = IS_PRODUCTION ? 'tsconfig.json' : 'tsconfig.dev.json';

// -------------------------
// IO Constants
// -------------------------
const SOURCE_DIR_NAME = 'src';
const TYPES_DIR_NAME = '@types';
const BUILD_DIR_NAME = 'lib';
const ASSETS_DIR_NAME = 'assets';
const INTERNALS_FILE = 'module-internals.json';
const STATS_FILE = 'bundle-stats.html';

const MAX_PARALLEL_OPS = 15;

// -------------------------
// Formats & Extensions
// -------------------------
const FormatTypes = Object.freeze({
 COMMONJS: 'cjs',
 ES_MODULE: 'esm',
 TYPES: 'es',
});

const FORMATS = Object.freeze(Object.values(FormatTypes));
const EXTENSIONS = Object.freeze(['.ts', '.js']);
const TARGET_JS = 'es2022';

// -------------------------
// Paths
// -------------------------
const pkgDir = process.cwd();
const srcDir = path.join(pkgDir, SOURCE_DIR_NAME);
const rootEntry = path.join(pkgDir, 'index.ts');
const tsconfigPath = path.join(__dirname, TSCONFIG_FILE);
const assetsDir = path.join(BUILD_DIR_NAME, ASSETS_DIR_NAME);

if (!fs.existsSync(rootEntry)) throw new Error(`Missing entry: ${rootEntry}`);

// -------------------------
// Load package.json
// -------------------------
let pkgJson;

try {
 pkgJson = JSON.parse(fs.readFileSync(path.join(pkgDir, 'package.json'), 'utf8'));
} catch (e) {
 throw new Error(`Error loading package.json: ${e.message}`);
}

// -------------------------
// Load internals
// -------------------------
const loadInternals = () => {
 const file = path.join(pkgDir, INTERNALS_FILE);

 if (!fs.existsSync(file)) return [];

 try {
  return JSON.parse(fs.readFileSync(file, 'utf8'));
 } catch (e) {
  throw new Error(`Invalid JSON in ${INTERNALS_FILE}: ${e.message}`);
 }
};

const INTERNALS_LIST = Object.freeze(loadInternals());

// -------------------------
// Entry Points
// -------------------------
// Stable lexicographic order: chunk/module emission is sensitive to entry
// insertion order, and byte-stable output across builds keeps the published
// bundle-size budgets reproducible.
const entryPoints = Object.freeze(
 Array.from(
  new Set([
   rootEntry,
   ...INTERNALS_LIST.flatMap((item) => {
    // Specific file entry — resolve directly
    if (item.endsWith('.ts')) {
     const filePath = path.join(srcDir, item);
     if (!fs.existsSync(filePath)) {
      throw new Error(`Internal module file not found: ${filePath}`);
     }
     return [filePath];
    }
    // Directory entry — glob for all .ts files (excluding tests)
    return fg
     .sync([`${item}/**/*.ts`, `!${item}/**/test/**/*.ts`], { cwd: srcDir })
     .map((f) => path.join(srcDir, f));
   }),
  ]),
 ).sort(),
);

// -------------------------
// Externals Setup
// -------------------------
const { dependencies = {}, peerDependencies = {} } = pkgJson;
// First-party workspace packages are NEVER externalized: the published-package
// guarantee is zero runtime dependencies, so any @lenguados/* usage is bundled
// (tree-shaken subset as preserved relative modules). Declaring one as an
// optional peerDependency (types resolution for consumers) must not reverse
// that.
const pkgKeys = Object.freeze(
 [...Object.keys(dependencies), ...Object.keys(peerDependencies)].filter(
  (name) => !name.startsWith('@lenguados/'),
 ),
);
const baseExternal = Object.freeze([...pkgKeys]);
const cjsExternal = Object.freeze(['crypto', 'buffer', 'process', 'http', ...baseExternal]);
const esmExternal = baseExternal;
const dtsExternal = [];

const EXTERNALS_MAP = Object.freeze(
 new Map([
  [FormatTypes.COMMONJS, cjsExternal],
  [FormatTypes.ES_MODULE, esmExternal],
  [FormatTypes.TYPES, dtsExternal],
 ]),
);

// -------------------------
// Common Plugins
// -------------------------
const COMMON_PLUGINS = Object.freeze([
 peerDepsExternal(),
 json(),
 resolve({ browser: true, extensions: EXTENSIONS, preserveSymlinks: false }),
 commonjs(),
]);

// -------------------------
// Build Plugins (cached)
// -------------------------
const buildPlugins = (format) => {
 const plugins = [...COMMON_PLUGINS];

 // Polyfill Node built-ins if ESM
 if (format === FormatTypes.ES_MODULE) plugins.push(polyfillNode());

 // Generate types for .d.ts
 if (format === FormatTypes.TYPES) {
  plugins.push(dts());
 } else {
  // Transpile via SWC
  plugins.push(
   swc({
    tsconfig: tsconfigPath,
    sourceMaps: !IS_PRODUCTION,
    jsc: {
     target: TARGET_JS,
     // Compile-time constant for dead code elimination
     // In production: assertions are completely removed
     // In development: assertions are active
     transform: {
      optimizer: {
       globals: {
        vars: {
         __LENGUADOS_DEV__: IS_PRODUCTION ? 'false' : 'true',
        },
       },
      },
     },
    },
   }),
  );

  // Copy all non-TypeScript assets (HTML, CSS, images, JSON) into the package’s lib/assets directory.
  // - Executes only for the ES module build to prevent redundant operations for other formats.
  // - Uses the `writeBundle` hook to run after the bundle is fully written.
  // - `copyOnce` is disabled under watch so edited assets are re-copied on rebuild;
  //   single-run builds keep the copy-once behavior.
  // - `flatten: false` preserves the original directory structure under `lib/assets`.
  // - `verbose: true` outputs each file as it’s copied for clear visibility.
  if (format === FormatTypes.ES_MODULE) {
   plugins.push(
    copy({
     cwd: pkgDir,
     targets: [
      {
       src: [`${SOURCE_DIR_NAME}/**/*.{html,css,png,svg,json}`],
       dest: assetsDir,
      },
     ],
     hook: 'writeBundle',
     copyOnce: !process.env.ROLLUP_WATCH,
     flatten: false,
     verbose: true,
    }),
   );
  }

  // Post-processing in production: cleanup, size report, bundle stats.
  // ESM minifies with terser because `format.preserve_annotations` keeps the
  // `@__PURE__` pure-call annotations in the SHIPPED files — consumer bundlers
  // need them to drop unused frozen-constant classes. The swc minifier strips
  // all annotations (measured), so it is reserved for CJS, where consumers do
  // not tree-shake and annotations are irrelevant.
  if (IS_PRODUCTION) {
   if (format === FormatTypes.ES_MODULE) {
    plugins.push(
     terser({
      module: true,
      compress: true,
      mangle: true,
      format: { comments: false, preserve_annotations: true },
     }),
    );
   } else {
    plugins.push(minify({ compress: true, mangle: true, module: false }));
   }
   plugins.push(visualizer({ filename: STATS_FILE, open: false }));
  }

  // The ESM tree ships its own `{"type":"module"}` marker so plain-Node
  // consumers resolve the `.js` files as ES modules without the
  // double-parse warning, and Node 24 `require()` of the tree works.
  // `sideEffects: false` MUST be restated here: this file becomes the
  // NEAREST package.json for every tree module, shadowing the package
  // root's flag — without it, consumer bundlers treat every module as
  // side-effectful and whole-module elimination silently dies (measured).
  if (format === FormatTypes.ES_MODULE) {
   plugins.push({
    name: 'emit-esm-package-type',
    generateBundle() {
     this.emitFile({
      type: 'asset',
      fileName: 'package.json',
      source: '{\n "type": "module",\n "sideEffects": false\n}\n',
     });
    },
   });
  }
 }

 return Object.freeze(plugins);
};

const PLUGINS_MAP = Object.freeze(new Map(FORMATS.map((fmt) => [fmt, buildPlugins(fmt)])));

// -------------------------
// Output Helpers
// -------------------------
const generateFileName = (rel, format) => {
 if (format === FormatTypes.COMMONJS) {
  return `${rel}.${ENV}.js`;
 }

 if (format === FormatTypes.ES_MODULE) {
  return rel === 'index' && IS_PRODUCTION ? 'module.js' : `${rel}.${ENV}.js`;
 }

 // TYPES
 return `${rel}.d.ts`;
};

// Per-module file naming for the preserved-modules tree. Every module keeps
// its source-relative path with an environment suffix — the suffix is
// mandatory because `npm run dist` layers the development and production
// passes into the same lib/ directory without cleaning between them. The
// root barrel keeps its historical entry names (`module.js` production ESM,
// `index.<env>.js` otherwise) so package.json exports, the three root entry
// files, and every downstream tool keep resolving unchanged paths.
const treeEntryFileNames = (format) => (chunkInfo) => {
 const id = chunkInfo.facadeModuleId ?? '';

 if (id === rootEntry) {
  return generateFileName('index', format);
 }
 if (id.startsWith(srcDir + path.sep)) {
  // Normalize to forward slashes: path.relative emits backslashes on
  // Windows, and Rollup file-name patterns require POSIX separators.
  const rel = path.relative(srcDir, id).split(path.sep).join('/').replace(/\.ts$/, '');
  return generateFileName(rel, format);
 }
 // Virtual/helper modules (polyfills, injected helpers) — internal, never
 // part of the public exports map.
 return `chunks/[name].${ENV}.js`;
};

// -------------------------
// Config Generators
// -------------------------
// Types remain one declaration bundle per entry point (unchanged contract).
const makeTypesConfig = (entry) => {
 const rel = entry === rootEntry ? 'index' : path.relative(srcDir, entry).replace(/\.ts$/, '');

 return {
  input: entry,
  external: EXTERNALS_MAP.get(FormatTypes.TYPES),
  plugins: PLUGINS_MAP.get(FormatTypes.TYPES),
  treeshake: { moduleSideEffects: false },
  maxParallelFileOps: MAX_PARALLEL_OPS,
  perf: true,
  output: {
   file: path.join(
    pkgDir,
    BUILD_DIR_NAME,
    TYPES_DIR_NAME,
    generateFileName(rel, FormatTypes.TYPES),
   ),
   format: FormatTypes.TYPES,
   sourcemap: false,
  },
 };
};

// CJS and ESM emit ONE multi-entry build each with preserved module
// boundaries. Preserved modules (instead of per-entry self-contained
// bundles) are what make consumer-side whole-module elimination work in
// every bundler, and they guarantee shared state — deterministic kernels,
// `config`, assertion enablement, the default RandomSource — exists exactly
// once across all published entries (per-entry duplication is a determinism
// defect: entries would each own an isolated mutable state realm).
const makeTreeConfig = (format) => ({
 input: [...entryPoints],
 external: EXTERNALS_MAP.get(format),
 plugins: PLUGINS_MAP.get(format),
 treeshake: { moduleSideEffects: false },
 maxParallelFileOps: MAX_PARALLEL_OPS,
 perf: true,
 output: {
  dir: path.join(pkgDir, BUILD_DIR_NAME, format),
  format,
  preserveModules: true,
  preserveModulesRoot: srcDir,
  entryFileNames: treeEntryFileNames(format),
  chunkFileNames: `chunks/[name].${ENV}.js`,
  hoistTransitiveImports: false,
  sourcemap: !IS_PRODUCTION,
  exports: format === FormatTypes.COMMONJS ? 'named' : undefined,
 },
});

const configs = [
 makeTreeConfig(FormatTypes.COMMONJS),
 makeTreeConfig(FormatTypes.ES_MODULE),
 ...entryPoints.map((entry) => makeTypesConfig(entry)),
];

export default configs;
