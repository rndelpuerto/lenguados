#!/usr/bin/env node
/**
 * @file scripts/build.mjs
 * @description
 * Bundles the current package using the monorepo’s root-level Rollup config.
 *
 * @example
 *   node scripts/build.mjs
 * @returns {Promise<void>}
 */

import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import path from 'path';

const exec = promisify(execCb);

/**
 * Main entry point.
 *
 * Runs `rollup -c ../../rollup.config.mjs` in the current package folder,
 * writes stdout and stderr to the console, and exits with code 1 on error.
 */
const main = async () => {
 const configPath = path.resolve(process.cwd(), '../../rollup.config.mjs');

 try {
  const { stdout, stderr } = await exec(`rollup -c ${configPath}`, {
   cwd: process.cwd(),
  });

  process.stdout.write(stdout);
  process.stderr.write(stderr);
 } catch (err) {
  console.error('build failed:', err);

  process.exit(1);
 }
};

main();
