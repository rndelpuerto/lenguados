#!/usr/bin/env node
/**
 * @file scripts/watch.mjs
 * @description
 * Spawns Rollup in watch mode to auto-rebundle on file changes,
 * inherits stdio, and forwards termination signals.
 *
 * @example
 *   node scripts/watch.mjs
 * @returns {void}
 */

import { spawn } from 'child_process';
import path from 'path';

/**
 * Main entry point: starts Rollup watcher and handles errors and signals.
 */
function main() {
 const configPath = path.resolve(process.cwd(), '../../rollup.config.mjs');
 const watcher = spawn('rollup', ['-c', configPath, '--watch'], {
  cwd: process.cwd(),
  stdio: 'inherit',
 });

 watcher.on('error', (err) => {
  console.error('Failed to start Rollup watcher:', err);
  process.exit(1);
 });

 watcher.on('exit', (code) => {
  if (code !== 0) {
   console.error(`Rollup watcher exited with code ${code}.`);
   process.exit(code);
  }
 });

 // Forward termination signals to the child process
 ['SIGINT', 'SIGTERM'].forEach((signal) => {
  process.on(signal, () => {
   watcher.kill(signal);
   process.exit();
  });
 });
}

main();
