#!/usr/bin/env node
/**
 * @file scripts/build.mjs
 * @description
 * Bundles the current package using the monorepo’s root-level Rollup config.
 * Output STREAMS to the console (no buffering): progress is visible during
 * multi-second builds and cannot be truncated by exec buffer limits, and the
 * local rollup binary is invoked explicitly (no PATH ambiguity).
 *
 * @example
 *   node scripts/build.mjs
 * @returns {Promise<void>}
 */

import { spawn } from 'child_process';
import { createRequire } from 'module';
import path from 'path';

const require = createRequire(import.meta.url);

/**
 * Main entry point.
 *
 * Runs the workspace-local Rollup binary with the root config in the current
 * package folder, inheriting stdio so output streams live, and exits with
 * Rollup's own exit code on failure.
 */
const main = () => {
 const configPath = path.resolve(process.cwd(), '../../rollup.config.mjs');
 const rollupBin = require.resolve('rollup/dist/bin/rollup');

 const child = spawn(process.execPath, [rollupBin, '-c', configPath], {
  cwd: process.cwd(),
  stdio: 'inherit',
 });

 child.on('exit', (code, signal) => {
  if (signal) {
   process.exit(1);
  }

  process.exit(code ?? 1);
 });

 child.on('error', (error) => {
  console.error('build failed:', error);

  process.exit(1);
 });
};

main();
