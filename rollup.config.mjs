import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import fg from 'fast-glob';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import pluginEsbuild from 'rollup-plugin-esbuild';
import json from '@rollup/plugin-json';
import peerDepsExternal from 'rollup-plugin-peer-deps-external';
import cleanup from 'rollup-plugin-cleanup';
import filesize from 'rollup-plugin-filesize';
import polyfillNode from 'rollup-plugin-polyfill-node';
import { visualizer } from 'rollup-plugin-visualizer';
import { dts } from 'rollup-plugin-dts';
import copy from 'rollup-plugin-copy';

const esbuild = pluginEsbuild.default || pluginEsbuild;

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
const TARGET_JS = 'es2020';

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
const entryPoints = Object.freeze(
 Array.from(
  new Set([
   rootEntry,
   ...INTERNALS_LIST.flatMap((dir) =>
    fg
     .sync([`${dir}/**/*.ts`, `!${dir}/**/__tests__/**/*.ts`], { cwd: srcDir })
     .map((f) => path.join(srcDir, f)),
   ),
  ]),
 ),
);

// -------------------------
// Externals Setup
// -------------------------
const { dependencies = {}, peerDependencies = {} } = pkgJson;
const pkgKeys = Object.freeze([...Object.keys(dependencies), ...Object.keys(peerDependencies)]);
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
  // Transpile + (dev) sourcemap or (prod) minify
  plugins.push(
   esbuild({
    tsconfig: tsconfigPath,
    sourceMap: !IS_PRODUCTION,
    minify: IS_PRODUCTION,
    target: TARGET_JS,
   }),
  );

  // Copy all non-TypeScript assets (HTML, CSS, images, JSON) into the package’s lib/assets directory.
  // - Executes only for the ES module build to prevent redundant operations for other formats.
  // - Uses the `writeBundle` hook to run after the bundle is fully written.
  // - `copyOnce: true` ensures assets are copied only once in watch mode.
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
     copyOnce: true,
     flatten: false,
     verbose: true,
    }),
   );
  }

  // Post-processing in production: cleanup, size report, bundle stats
  if (IS_PRODUCTION) {
   plugins.push(cleanup(), filesize(), visualizer({ filename: STATS_FILE, open: false }));
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

const makeOutputConfig = (format, entry) => {
 const rel = entry === rootEntry ? 'index' : path.relative(srcDir, entry).replace(/\.ts$/, '');

 const dir = format === FormatTypes.TYPES ? TYPES_DIR_NAME : format;

 return {
  file: path.join(pkgDir, BUILD_DIR_NAME, dir, generateFileName(rel, format)),
  format,
  sourcemap: format !== FormatTypes.TYPES && !IS_PRODUCTION,
  exports: format === FormatTypes.COMMONJS ? 'named' : undefined,
 };
};

// -------------------------
// Config Generator
// -------------------------
const makeConfig = (entry, format) => ({
 input: entry,
 external: EXTERNALS_MAP.get(format),
 plugins: PLUGINS_MAP.get(format),
 treeshake: { moduleSideEffects: false },
 maxParallelFileOps: MAX_PARALLEL_OPS,
 perf: true,
 output: makeOutputConfig(format, entry),
});

const configs = FORMATS.flatMap((format) => entryPoints.map((entry) => makeConfig(entry, format)));

export default configs;
