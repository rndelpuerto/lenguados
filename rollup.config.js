import path from 'path';
import fs from 'fs';
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

const esbuild = pluginEsbuild.default || pluginEsbuild;

// -------------------------
// Environment & Flags
// -------------------------
const ENV = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const IS_PRODUCTION = ENV === 'production';
const TSCONFIG_FILE = IS_PRODUCTION ? 'tsconfig.json' : 'tsconfig.dev.json';

// -------------------------
// IO Constants
// -------------------------
const BUILD_DIR = 'lib';
const TYPES_DIR = '@types';
const INTERNALS_FILE = 'module-internals.json';
const STATS_FILE = 'bundle-stats.html';
const MAX_PARALLEL_OPS = 15;

// -------------------------
// Formats & Extensions
// -------------------------
const FormatTypes = Object.freeze({ COMMONJS: 'cjs', ES_MODULE: 'esm', TYPES: 'es' });
const FORMATS = Object.freeze(Object.values(FormatTypes));
const EXTENSIONS = Object.freeze(['.ts', '.js']);
const TARGET_JS = 'es2020';

// -------------------------
// Paths
// -------------------------
const pkgDir = process.cwd();
const srcDir = path.join(pkgDir, 'src');
const rootEntry = path.join(pkgDir, 'index.ts');

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
      ...INTERNALS_LIST.flatMap(dir =>
        fg.sync(`${dir}/**/*.ts`, { cwd: srcDir }).map(f => path.join(srcDir, f))
      )
    ])
  )
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
    [FormatTypes.TYPES, dtsExternal]
  ])
);

// -------------------------
// Common Plugins
// -------------------------
const COMMON_PLUGINS = Object.freeze([
  peerDepsExternal(),
  json(),
  resolve({ browser: true, extensions: EXTENSIONS, preserveSymlinks: false }),
  commonjs()
]);

// -------------------------
// Build Plugins (cached)
// -------------------------
const buildPlugins = format => {
  const plugins = [...COMMON_PLUGINS];

  if (format === FormatTypes.ES_MODULE) plugins.push(polyfillNode());

  if (format === FormatTypes.TYPES) {
    plugins.push(dts());
  } else {
    plugins.push(
      esbuild({
        tsconfig: path.join(pkgDir, TSCONFIG_FILE),
        sourceMap: !IS_PRODUCTION,
        minify: IS_PRODUCTION,
        target: TARGET_JS
      })
    );

    if (IS_PRODUCTION) plugins.push(cleanup(), filesize(), visualizer({ filename: STATS_FILE, open: false }));
  }

  return Object.freeze(plugins);
};

const PLUGINS_MAP = Object.freeze(new Map(FORMATS.map(fmt => [fmt, buildPlugins(fmt)])));

// -------------------------
// Output Helpers
// -------------------------
const generateFileName = (rel, format) => {
  if (format === FormatTypes.COMMONJS) return `${rel}.${ENV}.js`;

  if (format === FormatTypes.ES_MODULE) {
    return rel === 'index' && IS_PRODUCTION ? 'module.js' : `${rel}.${ENV}.js`;
  }

  return `${rel}.d.ts`;
};

const makeOutputConfig = (format, entry) => {
  const rel = entry === rootEntry
    ? 'index'
    : path.relative(srcDir, entry).replace(/\.ts$/, '');

  const dir = format === FormatTypes.TYPES ? TYPES_DIR : format;

  return {
    file: path.join(pkgDir, BUILD_DIR, dir, generateFileName(rel, format)),
    format,
    sourcemap: format !== FormatTypes.TYPES && !IS_PRODUCTION,
    exports: format === FormatTypes.COMMONJS ? 'named' : undefined,
    treeshake: { moduleSideEffects: false },
    maxParallelFileOps: MAX_PARALLEL_OPS,
    perf: true
  };
};

// -------------------------
// Config Generator
// -------------------------
const makeConfig = (entry, format) => ({
  input: entry,
  external: EXTERNALS_MAP.get(format),
  plugins: PLUGINS_MAP.get(format),
  output: makeOutputConfig(format, entry)
});

const configs = FORMATS.flatMap(format => entryPoints.map(entry => makeConfig(entry, format)));

export default configs;
