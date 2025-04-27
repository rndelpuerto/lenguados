#!/usr/bin/env node
/**
 * @file scripts/outdated.mjs
 * @description
 * Captures outdated dependencies in the current package, writes them to `outdated.txt`,
 * and prints the same output to the console.
 */

import { exec as execCb } from 'child_process';
import { promisify } from 'util';
import { writeFile } from 'fs/promises';
import path from 'path';

const exec = promisify(execCb);

/**
 * Executes `npm outdated --depth=0` in the specified directory.
 *
 * @param {string} cwd - The directory in which to run the command.
 * @returns {Promise<string>} The standard output of the command.
 * @throws Will throw an error containing `stdout`/`stderr` and `code`.
 */
const getOutdated = async (cwd) => {
 const { stdout } = await exec('npm outdated --depth=0', { cwd });

 return stdout;
};

/**
 * Writes the provided content to a file, creating or overwriting it.
 *
 * @param {string} filePath - The path to the file to write.
 * @param {string} content - The content to write into the file.
 * @returns {Promise<void>}
 */
const writeOutdated = async (filePath, content) => {
 await writeFile(filePath, content, 'utf8');
};

/**
 * Main entry point.
 *
 * - Runs `npm outdated --depth=0` in the current working directory.
 * - Writes output to `outdated.txt`.
 * - Prints output to the console.
 *
 * @returns {Promise<void>}
 */
const main = async () => {
 const cwd = process.cwd();
 const outFile = path.join(cwd, 'outdated.txt');

 try {
  const output = await getOutdated(cwd);

  await writeOutdated(outFile, output);

  process.stdout.write(output);
 } catch (err) {
  /** @type {{ stdout?: string; stderr?: string; code?: number }} */
  const error = /** @type any */ (err);
  const fallback = error.stdout ?? error.stderr ?? '';

  // npm outdated returns code 1 when dependencies are outdated
  if (error.code === 1 && fallback) {
   await writeOutdated(outFile, fallback);

   process.stdout.write(fallback);
   process.exit(0);
  }

  console.error('Error running npm outdated:', err);

  process.exit(1);
 }
};

main();
