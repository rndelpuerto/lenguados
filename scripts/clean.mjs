#!/usr/bin/env node
/**
 * @file scripts/clean.mjs
 * @description
 * Removes build artifacts and lockfiles from the current package,
 * including `lib/`, `outdated.txt`, `package-lock.json`, and `node_modules`.
 *
 * @returns {Promise<void>}
 */

import { rm } from 'fs/promises';
import path from 'path';

/**
 * Recursively removes a file or directory at the specified path.
 *
 * @param {string} targetPath - Absolute or relative path to remove.
 * @param {import('fs').RmOptions} options - Options for fs.rm.
 * @returns {Promise<void>}
 */
const remove = (targetPath, options) => rm(targetPath, options);

/**
 * Main entry point for cleanup.
 *
 * Executes the following removals in parallel:
 * - `lib/` directory
 * - `outdated.txt` file
 * - `package-lock.json` file
 * - `node_modules/` directory
 *
 * @returns {Promise<void>}
 */
const clean = async () => {
 const cwd = process.cwd();

 await Promise.all([
  remove(path.join(cwd, 'lib'), { recursive: true, force: true }),
  remove(path.join(cwd, 'outdated.txt'), { force: true }),
  remove(path.join(cwd, 'package-lock.json'), { force: true }),
  remove(path.join(cwd, 'node_modules'), { recursive: true, force: true }),
 ]);

 console.log('Cleanup completed successfully.');
};

clean().catch((err) => {
 console.error('Cleanup failed:', err);

 process.exit(1);
});
