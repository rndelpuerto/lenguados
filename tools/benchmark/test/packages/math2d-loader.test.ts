import { describe, expect, it } from '@jest/globals';
import { existsSync } from 'node:fs';

import { math2dLoader } from '../../src/packages/math2d/loader.ts';

describe('math2d PackageLoader', () => {
 it('has correct name', () => {
  expect(math2dLoader.name).toBe('math2d');
 });

 it('root points to existing math2d package directory', () => {
  expect(existsSync(math2dLoader.root)).toBe(true);
  expect(math2dLoader.root).toMatch(/packages\/math2d$/);
 });

 it('mainEntry points to main.mjs', () => {
  expect(math2dLoader.mainEntry).toMatch(/main\.mjs$/);
 });

 it('entryPoints has development and production paths', () => {
  expect(math2dLoader.entryPoints.development).toContain('index.development.js');
  expect(math2dLoader.entryPoints.production).toContain('module.js');
 });

 it('entryPoints point to existing build artifacts', () => {
  expect(existsSync(math2dLoader.entryPoints.development)).toBe(true);
  expect(existsSync(math2dLoader.entryPoints.production)).toBe(true);
 });

 it('implements PackageLoader interface', () => {
  expect(typeof math2dLoader.load).toBe('function');
  expect(typeof math2dLoader.getConfig).toBe('function');
 });
});
