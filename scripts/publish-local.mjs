#!/usr/bin/env node
/**
 * @file scripts/publish-local.mjs
 * @description
 * Publishes the current package to a local Verdaccio registry.
 * Reads port from `config.verdaccioport` in the package’s own package.json.
 *
 * @example
 *   node scripts/publish-local.mjs
 * @returns {Promise<void>}
 */

import { exec as execCb } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCb);

/**
 * Publishes the current package to the local Verdaccio registry.
 *
 * @returns {Promise<void>}
 */
const publishLocal = async () => {
 const port = process.env.npm_package_config_verdaccioport;
 const registry = `http://localhost:${port}/`;
 const cwd = process.cwd();

 try {
  const { stdout, stderr } = await exec(`npm publish --registry ${registry}`, { cwd });

  process.stdout.write(stdout);
  process.stderr.write(stderr);
 } catch (err) {
  console.error('publish-local failed:', err);

  process.exit(1);
 }
};

publishLocal();
