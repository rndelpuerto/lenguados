#!/usr/bin/env node
/**
 * @file scripts/unpublish-local.mjs
 * @description
 * Unpublishes the current package version from the local Verdaccio registry,
 * forcing removal.
 *
 * @example
 *   node scripts/unpublish-local.mjs
 * @returns {Promise<void>}
 */

import { exec as execCb } from 'child_process';
import { promisify } from 'util';

const exec = promisify(execCb);

/**
 * Unpublishes the current package from the local Verdaccio registry.
 *
 * Reads package name and version from the package.json context, and the
 * Verdaccio port from `config.verdaccioport`.
 *
 * @returns {Promise<void>}
 */
const unpublishLocal = async () => {
 const port = process.env.npm_package_config_verdaccioport;
 const registry = `http://localhost:${port}/`;
 const name = process.env.npm_package_name;
 const version = process.env.npm_package_version;
 const cmd = `npm unpublish ${name}@${version} --registry ${registry} --force`;
 const cwd = process.cwd();

 try {
  const { stdout, stderr } = await exec(cmd, { cwd });

  process.stdout.write(stdout);
  process.stderr.write(stderr);
 } catch (err) {
  console.error('unpublish-local failed:', err);

  process.exit(1);
 }
};

unpublishLocal();
