/**
 * Docusaurus plugin that loads per-package benchmark summary JSON
 * at build time and exposes it via global data for React components.
 *
 * Iterates subdirectories under static/benchmark-data/ — each subdirectory
 * is a package name (e.g., math2d/) containing 4 summary JSON files.
 */

import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs';
import { join } from 'node:path';

import type { LoadContext, Plugin } from '@docusaurus/types';

interface PackageBenchmarkData {
 performance: unknown | null;
 comparison: unknown | null;
 stress: unknown | null;
 dx: unknown | null;
}

type BenchmarkData = Record<string, PackageBenchmarkData>;

function loadJsonFile(filepath: string): unknown | null {
 if (!existsSync(filepath)) return null;
 try {
  return JSON.parse(readFileSync(filepath, 'utf-8'));
 } catch {
  return null;
 }
}

export default function benchmarkDataPlugin(context: LoadContext): Plugin<BenchmarkData> {
 return {
  name: 'docusaurus-plugin-benchmark-data',

  async loadContent(): Promise<BenchmarkData> {
   const dataDirectory = join(context.siteDir, 'static', 'benchmark-data');
   const result: BenchmarkData = {};

   if (!existsSync(dataDirectory)) return result;

   const entries = readdirSync(dataDirectory);
   for (const entry of entries) {
    const entryPath = join(dataDirectory, entry);
    if (!statSync(entryPath).isDirectory()) continue;

    result[entry] = {
     performance: loadJsonFile(join(entryPath, 'performance-summary.json')),
     comparison: loadJsonFile(join(entryPath, 'comparison-summary.json')),
     stress: loadJsonFile(join(entryPath, 'stress-summary.json')),
     dx: loadJsonFile(join(entryPath, 'dx-summary.json')),
    };
   }

   return result;
  },

  async contentLoaded({ content, actions }): Promise<void> {
   const { setGlobalData } = actions;
   setGlobalData(content);
  },
 };
}
