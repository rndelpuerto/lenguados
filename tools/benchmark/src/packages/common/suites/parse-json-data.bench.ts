/**
 * @file packages/common/suites/parse-json-data.bench.ts
 * @description parseJSONData benchmark suite
 *
 * Benchmarks @lenguados/common's JSON parsing helper over a deterministic
 * corpus: a small flat object, a ~10 KB nested object, and one invalid-JSON
 * input exercising the undefined-returning error path.
 */

import { definePackageSuite } from '../../../harness/suite-builder.ts';

// Deterministic corpus (built once at module load — identical every run).
const SMALL_FLAT = JSON.stringify({ id: 42, name: 'lenguado', active: true, ratio: 0.5812 });

const LARGE_NESTED = JSON.stringify({
 meta: { version: '1.0.0', generated: 'static-corpus' },
 items: Array.from({ length: 100 }, (_, i) => ({
  id: i,
  label: `item-${i}`,
  tags: ['alpha', 'beta', 'gamma'],
  position: { x: i * 0.25, y: i * 0.5 },
  nested: { depth: { level: i % 7, flags: [true, false, i % 2 === 0] } },
 })),
});

const INVALID_JSON = '{ id: 42, broken: tru'; // unquoted keys + truncated literal

/**
 * Define the parseJSONData benchmark suite
 *
 * @remarks
 * Measures the happy path on small and large payloads and the catch path on
 * malformed input. Each benchmark returns its value per the suite DCE
 * contract so the JIT cannot eliminate the work.
 */
export const defineSuite = definePackageSuite({
 name: 'parseJSONData',
 entity: 'JSON',
 extract: ['parseJSONData'],

 register(add, _triality, { parseJSONData }) {
  add('parseJSONData (small flat ~100B)', () => parseJSONData(SMALL_FLAT));
  add('parseJSONData (nested ~10KB)', () => parseJSONData(LARGE_NESTED));
  add('parseJSONData (invalid input → undefined)', () => parseJSONData(INVALID_JSON));
 },
});
