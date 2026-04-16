import { describe, expect, it } from '@jest/globals';

import {
 addTriality,
 createBenchmarkBuilder,
 defaultDimensions,
 definePackageSuite,
} from '../../src/harness/suite-builder.ts';
import { cartesianProduct } from '../../src/harness/dimensions.ts';
import type { TrialityConfig } from '../../src/harness/suite-builder.ts';

describe('defaultDimensions', () => {
 it('sets environment and buildMode defaults', () => {
  const dims = defaultDimensions({ entity: 'Vector2' });
  expect(dims.environment).toEqual(['node']);
  expect(dims.buildMode).toEqual(['development', 'production']);
  expect(dims.entity).toEqual(['Vector2']);
 });

 it('omits tier and determinism when not provided', () => {
  const dims = defaultDimensions({ entity: 'Body' });
  expect(dims.tier).toBeUndefined();
  expect(dims.determinism).toBeUndefined();
 });

 it('includes tier when provided', () => {
  const dims = defaultDimensions({
   entity: 'Vector2',
   tier: ['default', 'safe', 'unchecked'],
  });
  expect(dims.tier).toEqual(['default', 'safe', 'unchecked']);
 });

 it('includes determinism when provided', () => {
  const dims = defaultDimensions({
   entity: 'Vector2',
   determinism: ['fdlibm'],
  });
  expect(dims.determinism).toEqual(['fdlibm']);
  expect(dims.tier).toBeUndefined();
 });

 it('allows overriding buildMode', () => {
  const dims = defaultDimensions({
   entity: 'scalar',
   buildMode: ['production'],
  });
  expect(dims.buildMode).toEqual(['production']);
 });

 it('produces zero cells when tier is empty array', () => {
  const dims = defaultDimensions({ entity: 'Vector2', tier: [] });
  expect(cartesianProduct(dims)).toHaveLength(0);
 });
});

describe('addTriality', () => {
 it('registers 3 benchmarks for full triality', () => {
  const builder = createBenchmarkBuilder();
  addTriality(builder, {
   default: ['Vector2.normalize (out)', () => 1],
   safe: ['Vector2.normalizeSafe (out)', () => 2],
   unchecked: ['Vector2.normalizeUnchecked (out)', () => 3],
  });
  expect(builder.entries).toHaveLength(3);
  expect(builder.entries[0]!.name).toBe('Vector2.normalize (out)');
  expect(builder.entries[0]!.tier).toBe('default');
  expect(builder.entries[1]!.tier).toBe('safe');
  expect(builder.entries[2]!.tier).toBe('unchecked');
 });

 it('registers 2 benchmarks for partial triality', () => {
  const builder = createBenchmarkBuilder();
  addTriality(builder, {
   default: ['op', () => 1],
   safe: ['opSafe', () => 2],
  });
  expect(builder.entries).toHaveLength(2);
 });

 it('skips missing entries', () => {
  const builder = createBenchmarkBuilder();
  const config: TrialityConfig = { default: ['op', () => 1] };
  addTriality(builder, config);
  expect(builder.entries).toHaveLength(1);
 });

 it('passes names through exactly (no suffix manipulation)', () => {
  const builder = createBenchmarkBuilder();
  addTriality(builder, {
   default: ['Vector2.normalize (out)', () => 0],
   safe: ['Vector2.normalizeSafe (out)', () => 0],
   unchecked: ['Vector2.normalizeUnchecked (out)', () => 0],
  });
  expect(builder.entries[0]!.name).toBe('Vector2.normalize (out)');
  expect(builder.entries[1]!.name).toBe('Vector2.normalizeSafe (out)');
  expect(builder.entries[2]!.name).toBe('Vector2.normalizeUnchecked (out)');
 });
});

describe('definePackageSuite', () => {
 it('creates a valid SuiteDefinition factory', () => {
  const factory = definePackageSuite({
   name: 'test-suite',
   entity: 'TestEntity',
   extract: ['TestClass'],
   register(add, _triality, modules) {
    add('TestClass.op', () => modules['TestClass']);
   },
  });

  expect(typeof factory).toBe('function');
  const suite = factory();
  expect(suite.name).toBe('test-suite');
  expect(suite.dimensions.entity).toEqual(['TestEntity']);
 });

 it('validates extracted exports on setup', () => {
  const factory = definePackageSuite({
   name: 'fail-suite',
   entity: 'X',
   extract: ['NonExistent'],
   register() {},
  });
  const suite = factory();

  expect(() => suite.setup!({ SomeOtherClass: {} })).toThrow(
   "fail-suite suite: module does not export 'NonExistent'",
  );
 });

 it('provides extracted modules to register callback', () => {
  const mockClass = { add: () => 42 };
  let received: Record<string, unknown> = {};

  const factory = definePackageSuite({
   name: 'extract-test',
   entity: 'Mock',
   extract: ['MockClass'],
   register(_add, _triality, modules) {
    received = modules;
   },
  });
  const suite = factory();
  suite.setup!({ MockClass: mockClass });

  expect(received['MockClass']).toBe(mockClass);
 });

 it('applies dimension overrides', () => {
  const factory = definePackageSuite({
   name: 'dims-test',
   entity: 'Vector2',
   extract: [],
   dimensions: {
    tier: ['default', 'safe', 'unchecked'],
    determinism: ['fdlibm', 'native'],
   },
   register() {},
  });
  const suite = factory();

  expect(suite.dimensions.tier).toEqual(['default', 'safe', 'unchecked']);
  expect(suite.dimensions.determinism).toEqual(['fdlibm', 'native']);
 });
});

describe('addTriality naming consistency with docs generator', () => {
 it('Safe/Unchecked suffixes are before parenthetical', () => {
  // The docs generator's detectTier() splits on space to get methodPart,
  // then checks endsWith('Safe') / endsWith('Unchecked').
  // Verify that the names we pass to addTriality follow this convention.
  const names = [
   ['Vector2.normalize (out)', 'Vector2.normalizeSafe (out)', 'Vector2.normalizeUnchecked (out)'],
   ['Vector2.divideScalar', 'Vector2.divideScalarSafe', 'Vector2.divideScalarUnchecked'],
  ];

  for (const [defaultName, safeName, uncheckedName] of names) {
   const safeMethod = safeName!.split(' ')[0]!;
   const uncheckedMethod = uncheckedName!.split(' ')[0]!;
   expect(safeMethod.endsWith('Safe')).toBe(true);
   expect(uncheckedMethod.endsWith('Unchecked')).toBe(true);

   // Verify the base name is recoverable
   const defaultMethod = defaultName!.split(' ')[0]!;
   expect(safeMethod.slice(0, -4)).toBe(defaultMethod);
   expect(uncheckedMethod.slice(0, -9)).toBe(defaultMethod);
  }
 });
});
