## 1. Kernel Purification (L0)

- [x] 1.1 In `packages/math2d/src/deterministic/deterministic-kernels.ts`, remove the `acosSafe` function (lines ~720-724) and its preceding TSDoc block.
- [x] 1.2 Remove the `asinSafe` function (lines ~736-740) and its preceding TSDoc block.
- [x] 1.3 Remove the `logKernelSafe` function (lines ~834-837) and its preceding TSDoc block.
- [x] 1.4 Remove the `expSafe` function (lines ~913-918) and its preceding TSDoc block.
- [x] 1.5 Remove `acosSafe`, `asinSafe`, `logKernelSafe`, `expSafe` from the `DeterministicKernels` namespace object (lines ~1000, 1002, 1015, 1016).
- [x] 1.6 PI_2 still used by atan/atan2 — kept.
- [x] 1.7 Update the module header TSDoc to reflect "pure deterministic kernels only, no Safe variants."

## 2. Safety Consolidation (L1)

- [x] 2.1 In `packages/math2d/src/auxiliary/numeric/safety.ts`, replace the `export { acosSafe }` re-export (line ~129) with the full function definition, importing `acos` from `../../deterministic/deterministic-kernels`. Add the PI constant import from `../scalar/constants`.
- [x] 2.2 Replace the `export { asinSafe }` re-export (line ~140) with the full function definition, importing `asin` from `../../deterministic/deterministic-kernels`. Add HALF_PI constant import.
- [x] 2.3 Add the `expSafe` function to `safety.ts`, importing `exp` from `../../deterministic/deterministic-kernels`. Preserve the existing signature and behavior.
- [x] 2.4 Import updated to `{ acos, asin, exp, log, pow }`.
- [x] 2.5 logKernelSafe not imported or referenced in safety.ts — confirmed.
- [x] 2.6 TSDoc blocks preserved with correct cross-references.

## 3. Export Cleanup (index.ts)

- [x] 3.1 Removed `acosSafe`, `asinSafe`, `expSafe` from deterministic re-export block. Added comment explaining Safe variants come via auxiliary.
- [x] 3.2 No `logKernelSafe` reference in `index.ts` — confirmed.
- [x] 3.3 Safe functions reach barrel via `export * from './auxiliary/numeric'` — verified by structure.

## 4. Update Internal Consumers

- [x] 4.1 No source files imported acosSafe/asinSafe from deterministic-kernels (only safety.ts did, already updated).
- [x] 4.2 Fixed safety.node.spec.ts: expSafe import moved from deterministic-kernels to safety.ts.
- [x] 4.3 Removed logKernelSafe import/tests from deterministic-kernels.node.spec.ts. Removed acosSafe/asinSafe/expSafe tests from same file (covered by safety.node.spec.ts).

## 5. Document the Standard

- [x] 5.1 Added "L0/L1 Safety Boundary" section to `.claude/rules/architecture-and-layers.md`.
- [x] 5.2 Added Safe existence criteria table with domain restrictions.
- [x] 5.3 Added DeterministicKernels namespace rule.
- [x] 5.4 Table shows sin/cos/tan/atan/atan2/hypot have "none needed" — domain = all reals.

## 6. Tests and Verification

- [x] 6.1 Deterministic tests: 41 passed, 0 failed.
- [x] 6.2 Safety tests: 55 passed, 0 failed.
- [x] 6.3 Full test suite: 3495 passed, 0 failed (6 duplicate tests removed).
- [x] 6.4 Build: successful, no TypeScript errors.
- [x] 6.5 Lint: 0 errors after lint:fix (10 pre-existing warnings).
- [x] 6.6 Empirical: acosSafe, asinSafe, expSafe, logSafe all work from barrel. logKernelSafe = undefined. DeterministicKernels has 13 pure entries, 0 Safe.
