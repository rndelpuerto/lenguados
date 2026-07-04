# Benchmark Laboratory

Scientific benchmark + verification suite for `@lenguados/math2d` and other monorepo packages. Hosts performance benchmarks, numerical stress tests, DX (bundle size, tree-shaking) analysis, cross-library comparisons, and cross-environment determinism verification.

## Overview

The bench laboratory is monorepo-wide infrastructure under `tools/benchmark/`. It exposes:

- **Performance**: high-precision micro-benchmarks (`bench`) measuring ops/sec across operations and validation tiers.
- **Numerical stress**: ULP-bounded accuracy verification across input domains (`stress`).
- **DX analysis**: bundle size (raw + gzip), tree-shaking effectiveness, assertion elimination, dev↔prod result parity (`dx`).
- **Cross-library**: math2d versus reference 2D math libraries on identical workloads (`compare`). The comparison output is the dedicated benchmark-artefact surface for competitor naming; this overview page stays library-neutral.
- **Cross-environment determinism**: bit-exact verification of fdlibm-derived deterministic kernels against a committed golden file, optionally extended to chromium/firefox/webkit via Playwright (`cross-env`).
- **Lightweight smoke**: build artifact integrity, dev↔prod parity, structural checks, and determinism verification against the committed golden file (`smoke`). Runs in ~0.3 s harness (~1.3 s wall including npm startup).

## Local commands

All commands proxy through the root `package.json` workspace.

| Command                         | What it does                                                                                                                                                                                                                                                                                                                                     |
| ------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `npm run tools:bench:setup`     | One-time setup. Installs benchmark tooling (`tools/benchmark/node_modules`). Required once per fresh clone.                                                                                                                                                                                                                                      |
| `npm run tools:bench:smoke`     | Lightweight correctness smoke (~0.3 s harness, ~1.3 s wall). Verifies build artifacts, dev↔prod parity, DCE, and the committed determinism golden file. Used as the pre-push hook gate and the CI drift-detection gate.                                                                                                                          |
| `npm run tools:bench`           | High-precision performance benchmarks. Optional flags: `--suite=<name>`, `--tier=<unchecked\|safe\|...>`.                                                                                                                                                                                                                                        |
| `npm run tools:bench:stress`    | Numerical stress tests with ULP bounds.                                                                                                                                                                                                                                                                                                          |
| `npm run tools:bench:dx`        | DX analysis: bundle size (raw + gzip), tree-shaking, assertion elimination, dev↔prod parity, build size comparison.                                                                                                                                                                                                                              |
| `npm run tools:bench:compare`   | Cross-library comparison on shared workloads. Produces the dedicated benchmark-comparison artefact at `docs/docs/packages/math2d/performance/comparisons.mdx`, which is the surface where competitor libraries are named per the project's citation policy.                                                                                      |
| `npm run tools:bench:cross-env` | Cross-environment determinism. Sub-modes via flags (see below).                                                                                                                                                                                                                                                                                  |
| `npm run tools:bench:all`       | Full laboratory run (bench → stress → dx → compare). Does not include `cross-env` (which is run separately on demand). Propagates phase failures: any failed phase makes the orchestrator exit non-zero (after attempting the remaining phases).                                                                                                 |
| `npm run tools:bench:size`      | Bundle-size budget gate. Bundles ONLY the budgeted import entries (same esbuild + `node:zlib` instrument as the dx numbers) and exits non-zero when any entry exceeds its `budgetGzipBytes` (or cannot be measured). `--all` sweeps all registered packages, skipping those without budgets. Runs in PR validation after the distribution build. |
| `npm run tools:bench:summarize` | Generate summary JSON from raw results for the docs site consumption (`tools/benchmark/results/summaries/{package}/`). Guarded — see "Data integrity" below.                                                                                                                                                                                     |
| `npm run tools:bench:trend`     | Warn-only trend surveillance: appends one compact record per run to `results/trend/{package}-history.jsonl` and writes a delta report vs the previous run and the rolling median. Never fails on a performance delta; refuses bad input data. See "Performance trend surveillance" below.                                                        |
| `npm run tools:bench:test`      | Bench lab unit tests (Jest under `tools/benchmark/test/`).                                                                                                                                                                                                                                                                                       |

### Multi-package support (`--package`)

Every script except `smoke` (which always sweeps every registered package) accepts `--package=<name>` (default `math2d`) and resolves the target through the package registry at `src/packages/{name}/`. Capabilities are declared per package: a package without a `dx-config.ts` / `comparison-config.ts` / `cross-env-config.ts` makes the corresponding script fail loudly naming the missing capability — it never silently falls back to another package. Exception: `run-all` treats the DX and comparison phases as capability-gated and SKIPS them with a message for packages that do not register the config, so a heterogeneous all-packages run stays green. Raw results are namespaced per package under `results/{name}/` (timestamped files plus the `latest.json`, `stress-latest.json`, `dx-latest.json`, and `comparison-latest.json` pointers), so two packages never clobber each other's data.

`run-all` and `summarize` additionally accept `--package=all`: they fan out over every directory under `src/packages/` (a newly registered package joins with zero script edits). The root `docs:refresh` script uses this mode to reproduce the CI benchmark→documentation flow locally, and `bench.yml` uses it in CI — local and CI produce the same summary sets. Dimension filters only constrain cells that declare the axis (a package that does not participate in, say, the determinism dimension is unaffected by `--determinism=...`).

```bash
npm run tools:bench -- --package=common        # bench the second registered package
npm run tools:bench:all -- --package=math2d    # full run, explicit package
npm run tools:bench:all -- --package=all       # full run, every registered package
npm run docs:refresh                           # build → smoke → bench all → summarize all → docs
```

### Onboarding a new package (3 steps)

1. **Loader** — create `src/packages/<name>/loader.ts` exporting a `PackageLoader` (use `resolvePackageRoot` + `createModuleCache` from `src/harness/loader-utils.ts`; point `entryPoints` at the bundles the package actually publishes — see `src/packages/common/loader.ts` for the minimal-citizen shape).
2. **Suites** — add `src/packages/<name>/suites/*.bench.ts` files exporting `defineSuite` via `definePackageSuite` (the suite receives the loaded module through `setup` injection; benched functions must return their values).
3. **Run** — `npm run tools:bench -- --package=<name>` followed by `npm run tools:bench:summarize -- --package=<name>`. Optional capabilities (dx, comparison, cross-env, stress definitions) are added later by declaring the corresponding config files in the package's registry directory.

### Data integrity (provenance + summarize guard)

Every run records machine metadata (timestamp, Node version, OS, CPU, architecture, commit hash) plus **run-scope provenance**: `full: true` for a publishable run (suite/tier/entity-unfiltered AND covering the canonical publication cell — production build, fdlibm determinism), or the filter values used. `summarize` refuses — exiting non-zero before writing anything — when the input `latest.json` is missing, filtered, generated under a Node major different from `.nvmrc`, or carries legacy metadata without provenance. `--force` permits a deliberate partial summary and stamps `partial: true` into every summary file so docs pages can label the data. Staleness past 30 days warns.

## First-time contributor setup

After cloning the repository, run `npm run tools:bench:setup` **once**. This installs `tools/benchmark/node_modules`, which:

- Enables the pre-push hook to run `tools:bench:smoke` (the hook in `.husky/pre-push` is conditional on `tools/benchmark/node_modules` existing — without setup, smoke silently skips).
- Allows you to run any of the local commands above.

If you do not run setup, your local pre-push hook will not catch determinism drift; the authoritative gate is the `pr-validation.yml` CI workflow, which installs the tooling automatically. Setup is a one-time action per clone; subsequent `git pull` operations work transparently.

## Cross-environment determinism verification

The library promises bit-exact deterministic kernel output across JavaScript engines, operating systems, and CPU architectures (`.claude/rules/architecture-and-layers.md §Deterministic Functions`). The cross-environment golden file is the committed reference that anchors this contract.

### What the golden file is

- Path: `tools/benchmark/baselines/golden.json` (committed to the repository).
- Format: JSON containing approximately 13,000 entries. Each entry stores `{ fn, inputsHex, expectedHex, inputsDecimal, expectedDecimal }` for one input/output pair across the thirteen scalar kernel functions with shipped implementations (`sin`, `cos`, `tan`, `asin`, `acos`, `atan`, `atan2`, `exp`, `log`, `pow`, `hypot`, `sinh`, `cosh`). The `sinCos` pair has its own kernel code path and is not covered. The scalar `tanh` kernel is declared in the verification vocabulary but has no shipped artifact (no library-internal consumer — tree-shaken from every bundle), so it produces no entries; the generator prints a per-kernel breakdown flagging any declared-but-uncovered kernel.
- Encoding: `inputsHex` and `expectedHex` are 16-character hex strings encoding the IEEE 754 Float64 bytes via `Float64Array`/`Uint8Array` views. This captures sign + exponent + mantissa exactly (no decimal-string precision loss).
- Generated from Node.js (V8/fdlibm) running on Linux x86_64 by convention. See the `generator` and `nodeVersion` fields in the file header for the capture context.
- Size: approximately 2.5–3 MB JSON. Tracked by git; declared as `diff=binary -text` in the repository's top-level `.gitattributes` to suppress unreviewable line-by-line diffs on regeneration.

### How to verify locally

```bash
npm run tools:bench:smoke
```

The smoke step loads `tools/benchmark/baselines/golden.json`, runs the current production build's kernel implementations against every hex-encoded input, and confirms that each output matches the stored hex-encoded expected value bit-for-bit. On success it reports `Determinism: <N> golden values match (fdlibm bit-exact)`. On failure it lists each function with divergence count.

For cross-browser verification (Playwright, ~5–10 min cold, minutes when browsers are cached). The `--verify` path is resolved from `tools/benchmark/` (the working directory `npm --prefix` assigns), so the committed golden is `baselines/golden.json`:

```bash
# Prerequisite (one-time)
npx playwright install --with-deps

# Verify Node + chromium + firefox + webkit
npm run tools:bench:cross-env -- --verify=baselines/golden.json

# Or restrict to specific browsers
npm run tools:bench:cross-env -- --verify=baselines/golden.json --browsers=chromium,firefox

# Local machine missing an engine? Downgrade MISSING BROWSERS (never divergences)
# to warnings — CI never uses this flag:
npm run tools:bench:cross-env -- --verify=baselines/golden.json --allow-missing-browsers
```

Verification is **fail-loud end to end**: any bit divergence in any environment exits non-zero, and a requested browser that cannot launch fails the run unless `--allow-missing-browsers` is passed. A silent skip would report green while removing the verification's purpose.

### When to regenerate

Regeneration is a deliberate action. The acceptable triggers are:

1. **Node major version upgrade** that affects V8/fdlibm-derived results (rare but real — V8 occasionally updates fdlibm ports).
2. **Deliberate kernel optimisation or refactor** where the new bit-exact output values are the intended outcome (e.g. a future reduce-angle kernel re-attempt that is currently parked in the project roadmap).
3. **Confirmation that an observed drift is correct** (not a bug) and the new values are accepted as the new reference.

### How to regenerate

```bash
# 1. Make sure your production build is current
npm run dist

# 2. Regenerate the golden file (writes to tools/benchmark/baselines/golden.json)
npm run tools:bench:cross-env -- --generate-golden

# 3. Verify the new file
npm run tools:bench:smoke

# 4. Commit with a descriptive message
git add tools/benchmark/baselines/golden.json
git commit -m "..."
```

The `--generate-golden` command prints a **state hash** (e.g. `State hash: 2cd952f7`). Capture this hash in the PR description so reviewers can correlate intent with the regenerated content without inspecting the binary-diffed JSON.

### Regeneration PR template

When opening a regeneration PR, the description SHOULD include:

- **Trigger**: which of the three acceptable triggers applied (Node upgrade / kernel change / accepted drift).
- **State hash**: `Before: <hash>` and `After: <hash>` as printed by the `--generate-golden` command.
- **Verification**: confirmation that `npm run tools:bench:smoke` passes locally post-regeneration.

Reviewers focus on the trigger justification and the kernel change (if any). The CI smoke step verifies the new file matches the current kernel output before the merge proceeds.

### Concurrent regeneration handling

If two PRs simultaneously regenerate the golden file, the second-to-merge resolves the standard git merge conflict by:

1. Rebasing onto the latest `main`.
2. Re-running `npm run tools:bench:cross-env -- --generate-golden` against the rebased state.
3. Committing the resolved file.

The state hash printed by the second regeneration is the canonical tiebreaker.

## CI integration

| Workflow                              | Trigger                                    | What it runs against the golden file                                                                                                                                               |
| ------------------------------------- | ------------------------------------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `.github/workflows/pr-validation.yml` | Pull request → `main`                      | `tools:bench:setup` + `tools:bench:smoke` (Node-only). Catches drift before merge so `main` is never left in a broken determinism state.                                           |
| `.github/workflows/bench.yml`         | Push → `main` + manual `workflow_dispatch` | `tools:bench:smoke` (Node-only) after the build step, before the benchmark suite. Failure aborts the run so downstream benchmark summaries reflect a known-good determinism state. |
| `.husky/pre-push`                     | Local `git push`                           | `tools:bench:smoke` (conditional on `tools/benchmark/node_modules` existing). Best-effort local gate; the authoritative gate is `pr-validation.yml`.                               |

Cross-browser verification runs in CI through the dedicated `.github/workflows/determinism-browsers.yml` workflow on an **event-triggered** cadence, not per-PR: kernel-numerics changes are already caught per-PR by the Node golden gate, and browser engine binaries only change when Playwright is bumped in `tools/benchmark/package-lock.json`. The workflow triggers on the enumerated drift-capable paths (deterministic kernel sources, the committed golden, the cross-env harness, the benchmark lockfile, `.nvmrc`), on manual `workflow_dispatch`, and on a monthly cron backstop for runner-image drift no path filter can see. Playwright browsers are cached keyed on the benchmark lockfile, so warm runs skip the download entirely. The run verifies chromium, firefox, and webkit against the committed golden with fail-loud semantics (no `--allow-missing-browsers`). Rationale and the drift model: `packages/math2d/DESIGN_DECISIONS.md` ADR-018 (amendment).

## Performance trend surveillance (warn-only)

Single-run wall-clock numbers on shared CI runners carry a measured noise floor (double-digit-percentage run-to-run swings per operation), so per-run pass/fail thresholds below ~2x are statistically dishonest and would train developers to ignore alerts (see `.claude/rules/quality-pipeline.md`). Instead of gating, `bench.yml` runs **trend surveillance** after every benchmark run on `main`:

1. **Rolling history** — `npm run tools:bench:trend -- --package=all` appends one compact record per run (commit, timestamp, per-entity geometric mean of per-operation median ns, and the same-run cross-library geometric-mean ratio) to `results/trend/{package}-history.jsonl`. In CI the history travels as the `benchmark-history` artifact (90-day retention, re-uploaded after each append); a gap longer than the retention restarts the window — acceptable for a warn-only surface.
2. **Delta report** — the script writes `results/trend/{package}-report.md` comparing the current run against the previous record and the rolling median of up to the last 30 records. CI publishes it to the job summary. Annotations (`⚠ investigate`) appear ONLY beyond catastrophic bands: an entity geomean deviating more than ±25% from the rolling median, or the comparison ratio leaving the committed band. Nothing in the report ever fails the build.
3. **Committed ratio anchor** — `baselines/comparison-ratio.json` pins the expected same-run geometric-mean ratio against the reference library with a generous band (±30%, outside the measured noise envelope). Because both libraries execute in the same run with each operation's benches registered adjacently, machine identity and tenancy noise cancel to first order, making the ratio the most machine-independent wall-clock signal available. Regeneration follows the golden-file discipline verbatim: manual, reviewed, and the PR states the trigger (dependency upgrade / deliberate optimization / accepted drift).

Data-integrity failures on current inputs (missing, partial, or malformed summaries; invalid committed baseline) DO exit non-zero — bad data must never be recorded silently. An invalid **history** file is the one deliberate exception: it is quarantined to `<history>.corrupt` (outside the artifact upload glob), the window restarts, and the report opens with a prominent warning — a hard refusal would self-perpetuate in CI, because the failed run never uploads a fresh artifact and every later run re-downloads the same corrupt history, wedging the bench→docs pipeline permanently.

**Escalation bar (documented, deliberately not implemented):** after ≥30 recorded CI-runner points, compute the empirical envelope of the comparison ratio. Promote the band check to a failing gate ONLY if 95% of runs fall within ±10%. If the spread confirms the double-digit amplitude published for shared runners, the data itself proves warn-only is the honest ceiling; the remaining escalations are living with warn-only, a deterministic-simulation external service (a user decision — data leaves the repository), or a self-hosted runner.

## Troubleshooting

**Smoke fails with "Golden file missing"**: the committed file has been deleted or is absent in your working tree. Restore from `main`:

```bash
git checkout main -- tools/benchmark/baselines/golden.json
```

Or regenerate (see "How to regenerate" above) if you have an intentional reason for an update.

**Smoke fails with divergences**: the current build's kernel output diverges from the committed golden values. Inspect the divergent function(s) listed in the failure message. Possible causes:

- A recent kernel change introduced a regression (intended new values → regenerate; unintended → revert the change).
- A Node major upgrade altered V8/fdlibm intrinsics (regenerate with PR description noting the trigger).

**`tools:bench:setup` fails**: clean reinstall:

```bash
cd tools/benchmark
rm -rf node_modules
npm ci
```

(`npm ci` requires the lockfile — do not delete `package-lock.json`; if lockfile regeneration is truly intended, use `npm install` instead.)

**Playwright `--verify` fails to launch browsers**: run `npx playwright install --with-deps` and retry.
