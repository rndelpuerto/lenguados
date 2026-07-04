# Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.1.0/),
and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- **tooling**: warn-only performance-trend surveillance (`npm run tools:bench:trend`) — every post-merge benchmark run appends a compact record (per-entity geometric mean of median ns + the same-run cross-library ratio) to a rolling history carried as a 90-day CI artifact, and publishes a delta table to the job summary with catastrophic-only "investigate" annotations (entity ±25% vs rolling median, ratio outside the committed band); nothing performance-related ever fails the build, per the documented statistical position on shared-runner noise, while data-integrity failures (missing, partial, corrupt inputs) still refuse loudly
- **tooling**: committed cross-library ratio anchor (`tools/benchmark/baselines/comparison-ratio.json`, ±30% warn band) under the same manual, reviewed regeneration discipline as the determinism golden file, plus a documented evidence-gated promotion bar (≥30 CI data points AND 95% of runs within ±10% before any failing gate may exist)
- **tooling**: event-triggered cross-browser determinism workflow (`determinism-browsers.yml`) — verifies the committed golden bit-for-bit across the three major browser engine families on exactly the drift-capable events (deterministic kernel changes, golden or cross-env harness changes, browser-automation lockfile bumps, `.nvmrc` bumps), on manual dispatch, and on a monthly cron backstop, with browser binaries cached keyed on the benchmark lockfile; supersedes the ADR-018 "local-only" stance via an explicit drift model
- **tooling**: per-entry bundle-size budgets (`budgetGzipBytes` in each package's benchmark dx configuration) enforced by a new `npm run tools:bench:size` gate in pull-request validation — a gzip-size regression on any budgeted import now fails the PR, with budget markers rendered on the documentation bundle-size chart
- **math2d**: Complete modular architecture -- 6 layers (deterministic, auxiliary, core, types, validation, utils) with 30+ source files replacing 3 monolithic modules
- **math2d**: Deterministic math kernels (`sin`, `cos`, `tan`, `atan2`, `exp`, `log`, `pow`) via fdlibm polynomial approximations for L0 bit-exact cross-platform results
- **math2d**: 5 new core types -- Rotation2, Complex, Interval, Matrix3, Transform2
- **math2d**: Auxiliary layer -- scalar (constants, arithmetic, comparison, interpolation), angle (conversion, normalization, operations, unwrapping), numeric (guards, rounding, safety, wrapping)
- **math2d**: Tree-shakeable validation layer with configurable assertions (`setAssertionsEnabled`), stripped from production via conditional exports
- **math2d**: Utility layer -- `SeededRandomSource` (xoshiro128++), parse/format functions, performance measurement
- **math2d**: `Complex.exp()`, `Complex.log()`, `Complex.toPolar()` for analytical 2D math
- **math2d**: `Complex.fromPolarCS()`, `Rotation2.fromCS()` hot-path factories from pre-computed cos/sin
- **math2d**: `Matrix2.fromAngleScale()` combined rotation+scale factory
- **math2d**: `Matrix3.getTranslation()`, `Matrix3.getScale()`, `Matrix3.getRotation()` decomposition methods
- **math2d**: 10 component-wise operations on Complex (abs, floor, ceil, round, trunc, sign, min, max, clamp, mod)
- **math2d**: `Transform2.COMPONENT_COUNT` constant
- **math2d**: `assertRotation2Normalized()` validation function
- **math2d**: Complete triality for `Interval.sqrt` (added `sqrtSafe`, `sqrtUnchecked`)
- **math2d**: Complete instance/static parity for Matrix2 and Matrix3
- **math2d**: `config` object exported for determinism toggle (`config.useNativeMath`)
- **tooling**: 4 custom ESLint rules for TSDoc enforcement (`enforce-category-vocabulary`, `enforce-required-tags`, `enforce-see-format`, `enforce-tag-fragments`)
- **tooling**: ESLint migrated from v8 to v9 (flat config)
- **math2d**: Comprehensive TSDoc standard (`TSDOC_STANDARD.md`) with 14 templates and canonical tag order

### Changed

- **math2d** BREAKING: core-type constructors are now total, scalar-only functions — the array/object constructor overloads on Vector2, Matrix2, and Matrix3 were removed along with their structural throw paths and the silent-fallthrough behavior (primary-source research across the exemplary math libraries found no precedent for either: the universal pattern is total scalar constructors plus named factories that validate runtime-shaped input in every build). Array construction goes exclusively through fromArray (which throws RangeError in all builds); object construction through fromObject (type-trusting). All seven core types now share the identical constructor contract
- **tooling**: the CI dependency audit now runs through a managed, committed allowlist (audit-ci.jsonc) — a fresh advisory is handled by a reviewed allowlist entry instead of freezing every pull request; the gate remains blocking at high severity
- **tooling**: benchmark summaries additionally refuse PRESENT secondary inputs (dx/stress/comparison) that predate the primary run beyond a grace window — closing the last path for stale figures to reach the documentation under a green pipeline
- **tooling**: watch-mode builds re-copy edited source assets (copy-once behavior now applies only to single-run builds)
- **BREAKING (distribution only, zero API change)** -- **math2d**: the published ESM and CJS outputs are now multi-module trees with preserved module boundaries instead of single pre-bundled files; `module.js` and every subpath entry remain at their existing paths as thin facades. Import statements are unchanged; consumer bundlers now eliminate whole modules (a single-type import drops from ~27 KB to ~6.6 KB gzip, −76%)
- **math2d**: build target raised to ES2022 (native class static fields); frozen constants carry pure-call annotations preserved through minification
- **tooling**: the benchmark tree-shaking check is now an enforced gate (a below-threshold reduction fails the run) and the bundle-size budgets were tightened to the new measured floors (the minimal single-type import (`{ Vector2 }`) gated at ~7 KB gzip)

- **BREAKING** -- **math2d**: `Vector2.magnitudeSquared` renamed to `magnitudeSq` (consistency with `Complex.magnitudeSq`)
- **BREAKING** -- **math2d**: `Rotation2.negate()` renamed to `conjugate()` (implementation does conjugation, not negation)
- **BREAKING** -- **math2d**: `Rotation2.inversed` getter renamed to `inverted` (consistency with Matrix2/Matrix3/Transform2)
- **BREAKING** -- **math2d**: Unified scalar multiplication to `multiplyScalar` across all 5 core types; removed ambiguous `scale` alias
- **BREAKING** -- **math2d**: `Complex.argument()` removed; `angle` is canonical (consistent with Vector2/Rotation2)
- **BREAKING** -- **math2d**: `Interval.divide`/`divideSafe`/`divideUnchecked` renamed to `divideScalar`/`divideScalarSafe`/`divideScalarUnchecked`
- **BREAKING** -- **math2d**: `Vector2.angle()` converted from instance method to `get angle()` / `set angle()` accessor pair
- **BREAKING** -- **math2d**: Renamed `fma` parameter `scale` to `scalar` across Vector2, Matrix2, Matrix3
- **math2d**: `Rotation2.fromMatrix2` precision improvement -- direct column extraction + normalize instead of atan2 round-trip
- **math2d**: Widened `randomOnSegment`, `randomInTriangle`, `randomOnTriangle` parameter types from `ReadonlyVector2` to `ReadonlyVector2Like`
- **math2d**: `formatMatrix3` nested format now includes outer brackets for consistency with Matrix2
- **deps**: Updated all dependencies (ESLint 8->9, commitlint 19->20, cross-env 7->10, typescript-eslint 8.30->8.49, Rollup plugins)
- **tooling**: `npm run init` is now `npm install` only; `npm run tools:create-package` runs Cookiecutter through an isolated runner (pipx / uvx / global fallback, PEP 668-robust) with the version pin declared in `requirements.txt`, instead of requiring a global install
- **tooling**: bundle-size measurement now compresses with in-process `node:zlib` (deterministic across platforms) instead of the system `gzip` binary, and a compression failure is a hard error instead of a silent fallback to raw size
- **tooling**: benchmark laboratory scripts are package-generic — every script resolves `--package=<name>` through the package registry, raw results are namespaced per package under `results/<name>/`, and summaries refuse partial, stale, or unverifiable benchmark runs unless deliberately forced

### Removed

- **BREAKING** -- **math2d**: `Rotation2.angleValue` (duplicate of `angle` getter)
- **BREAKING** -- **math2d**: `Interval.NORMALIZED` (duplicate of `Interval.UNIT`)
- **BREAKING** -- **math2d**: Per-type EPSILON constants (Vector2, Complex, Matrix2, Matrix3) -- tolerance is scalar
- **BREAKING** -- **math2d**: `Complex.SQRT2`, `SQRT2_INV`, `PI`, `E` -- real scalar wrappers as Complex have no algebraic significance
- **BREAKING** -- **math2d**: `Matrix2.ONE`, `Matrix3.ONE` -- misleading name (not multiplicative identity), degenerate rank-1
- **BREAKING** -- **math2d**: `Matrix2.SCALE_2`/`SCALE_HALF`, `Matrix3.SCALE_2`/`SCALE_HALF` -- arbitrary; use `fromScale()`
- **BREAKING** -- **math2d**: `Interval.PERCENT` -- ambiguous (0-100 vs 0-1); `Interval.UNIT` covers normalized
- **BREAKING** -- **math2d**: `ITERATIVE_TOLERANCE`, `MAX_SAFE_INTEGER_F64`, `E`, `GOLDEN_RATIO`, `GOLDEN_RATIO_CONJUGATE` scalar constants -- zero consumers

### Fixed

- **tooling**: cross-environment determinism verification is now fail-loud end to end — `cross-env --verify` previously printed divergences but always exited zero (a browser divergence passed green), and a requested browser that failed to launch was silently skipped; any divergence in any environment now exits non-zero, a missing requested browser fails the run unless the local-only `--allow-missing-browsers` opt-out is passed, and the documented verify command's path (broken since introduction — it never resolved under the npm working directory) was corrected; a latent transpiler-serialization defect that crashed the in-browser verification callback in every launched browser was fixed by installing the name-preservation helper shim in the injected page, proven end to end with a real browser run (13,214 entries bit-exact; corrupted-reference probe reports the divergence and fails)
- **tooling**: the cross-library comparison now registers benchmarks operation-major (each operation's benches for both libraries adjacent) instead of library-major — the previous disjoint per-library blocks ran minutes apart, letting machine-state drift move the published geometric-mean ratio by double-digit percentages between identical runs
- **docs**: the performance pages no longer overstate reproducibility — the 2.5% equivalence threshold is now framed as the single-run tie-classification convention it is (not a cross-run reproducibility bound), the aggregate geometric mean carries explicit read-as-a-band framing, and the fairness statements document paired adjacent execution
- **math2d**: the strict/safe/unchecked triality scope is now precisely documented across the API — mathematically fallible operations (including math-conversion factories) carry the full three tiers, structural boundaries are strict-only by design, the scalar layer follows its two-tier kernel/safe model, and the inverse-transform operations document that their pre-computed cos/sin forms are their unchecked tier
- **math2d**: error messages now carry their qualifier uniformly — the seeded random source state-restoration errors name their method, and the array-bounds wording is identical across all core types (a full census of the 120 throw sites confirmed a single message convention library-wide; the assertion layer keeps its own documented prefix)
- **tooling**: a package scaffolded from the project template now passes the monorepo gates out of the box — its tests are placed where Jest discovers them (was an unmatched directory, so a newborn silently never ran tests), its placeholder source carries complete TSDoc (was failing the repo lint), its tarball carries LICENSE and NOTICE, and its README links resolve; the scaffolding command no longer silently overwrites an existing package, and a post-generation checklist prints the shared-file registration steps. Verified end-to-end by generating a package and running it against the real workspace
- **docs**: full-library TSDoc semantic sweep — every one of the 431 documented examples was executed against the shipped build (zero referenced a nonexistent API) and 54 doc-drift defects were corrected: example result comments that stated values the API does not produce (near-equality predicates at the epsilon boundary, fractional-part and π/2 serialization dust), phantom @throws on pure constructors and non-validating factories, missing or wrongly-typed @throws on array-boundary and singular-matrix paths, and incomplete strict/safe/unchecked cross-links. No code changed — the implementations were correct; the documentation had drifted
- **security**: the repository now ships a security policy (private reporting via GitHub Security Advisories), a code of conduct, issue forms, a pull-request template mirroring the real validation gates, code ownership, and weekly grouped dependency updates across all three lockfiles and the workflow actions; all CI action references are pinned to full commit SHAs; releases will carry npm provenance attestations and a GitHub Release generated from the changelog
- **robustness**: branch coverage is now enforced at 80% (was 50%, actual 87%); all seven string parsers gained property-based fuzz suites (undocumented error types and round-trip drift now fail tests); the determinism golden file grew from 11,198 to 13,214 bit-exact reference values (hyperbolic sine/cosine added; the pre-existing entries verified bit-identical); a new compatibility workflow exercises Node 22/24/26 (the golden verified bit-exact across all three majors); an OpenSSF Scorecard workflow tracks supply-chain posture
- **packaging**: every published tarball now carries LICENSE and NOTICE (synchronized from the repository root at pack time — Apache-2.0 requires both in the distributed artifact; npm packs LICENSE automatically but NOT NOTICE) and the tarball gate enforces README/LICENSE/NOTICE presence; the complete publish→install→consume cycle was verified end-to-end against a local registry (CJS, ESM, subpaths, TypeScript strict, and consumption from a sibling package)
- **docs**: documentation truth-and-polish pass across every reader-facing surface — false API contracts corrected (safe-inverse fallback is the identity matrix; nonexistent CS factory variants removed from docs and rules in favor of the rotation-literal idiom), superseded mechanisms no longer taught as current (assertion elimination is the build-time constant model), the overflow-threshold contract stated identically in all four documents that mention it (probe-verified numbers), symbol inventories recounted from source, fabricated or uncited figures made qualitative, and the statistical methodology page now describes the actual confidence-interval computation
- **docs**: reflected pages preserve links (absolute repository links no longer degrade to plain text; known targets rewrite to their docs pages), the build now fails on broken anchors as well as broken links, anchored cross-references survive reflection, and the generator is verified byte-identical across repeated runs
- **docs**: benchmark charts follow the site theme (the colorblind-safe palette with dark-mode variants is now actually consumed), partial benchmark data is visibly flagged to readers, sortable tables are keyboard- and screen-reader-operable, the throughput heatmap uses a readable log scale, and number formatting is consistent site-wide
- **tooling**: one root command (`docs:refresh`) now reproduces the CI benchmark→documentation flow locally — production build, correctness smoke, full benchmark laboratory over EVERY registered package, summary generation, and the site build consuming the fresh data; the laboratory gained an all-packages mode driven by its loader registry (new packages join with zero script edits), capability-gated phases (packages without DX or cross-library configs are skipped, not failed), and dimension filters that no longer exclude packages not participating in an axis; CI switched to the same all-packages mode (it was silently benchmarking only one package)
- **tooling**: the benchmark laboratory gained a TypeScript gate on its test script; eleven accumulated type errors were fixed (a wrong-module type import, seven dead re-exports, unannotated widenings, two stale test fixtures)
- **tooling**: the development watch mode now serves dependent packages (parallel watchers — topological ordering starved every package depending on math2d); release-flow scripts renamed to `release:*` (the previous `version` name shadowed npm's reserved lifecycle hook: a plain `npm version patch` would have bumped, committed, tagged and pushed all packages without a prompt); `npm run clean` no longer deletes the committed lockfile; the documented single-test command now works under the installed Jest (plural `--testPathPatterns`); the TypeScript compiler that gates CI is now declared and pinned; type checking added to the pre-push gate; the dead branch-push docs deployment path removed (Pages deploys via CI only)
- **tooling**: build output streams live (was buffered-silent); local registry scripts abort with guidance when the port is unset; watch-mode tests skip coverage instrumentation; benchmark-lab setup joins the sibling script convention; a throwaway golden-fixture generator and its 1.7 MiB of unconsumed fixtures were removed (git history preserves them)
- **ci**: pull-request validation gains a concurrency group and no longer double-lints; benchmark re-runs no longer fail on artifact immutability
- **examples**: the demo package now actually exercises the library it exists to showcase — the canvas demo models a square with `Vector2` and rotates it with a pre-normalized `Rotation2` (the engine hot-path idiom), with the used math2d subset bundled into self-contained artifacts (published packages still ship zero runtime dependencies)
- **common, examples**: README usage examples now show imports that actually resolve (both package roots are intentionally empty barrels; the real surface is subpath exports — the previous root-barrel examples were impossible and propagated to the public docs site); `publish:local` repaired in both (missing verdaccio port); public surfaces gained the mandated TSDoc; the canvas demo fails loudly and consistently for missing canvas/context
- **docs**: the root architecture dependency graph now shows only edges that exist (the previous graph declared dependencies that were never real)
- **math2d**: `Interval.setFromArray` now validates array bounds with `RangeError` like its four sibling types (the guard was specified for all five types but the implementing change dropped Interval — an out-of-bounds offset silently corrupted the interval with `max: undefined`)
- **math2d**: `Complex.divide`/`divideSafe` zero-detection aligned with the reciprocal family (squared-magnitude epsilon): divisors with magnitude down to the documented 1e-10 threshold now divide correctly instead of being rejected five orders of magnitude early
- **ci**: pull-request validation is now actually runnable — the three third-party actions it referenced no longer exist on GitHub (404; the workflow had zero recorded runs) and were replaced by dependency-free native steps preserving their intent (branch-name convention, milestone presence via the GitHub CLI, and the real license guarantee: published packages ship zero runtime dependencies); broken regex quoting fixed; the permissions block required by code scanning added
- **ci**: releases now run the full unit suite and the determinism smoke before publishing; the rule-invariants workflow pins Node via .nvmrc
- **ci**: conventional commits are now enforced (commit-msg hook); lint warnings now fail the gate (measured at zero before gating); the flat-config ignore list is now genuinely global; staged-file globs deduplicated and extended
- **ci**: documentation deployment and benchmark-data generation are now impossible from any ref other than main (manual dispatches are ref-gated; npm publishing was already ancestry-guarded against main)
- **docs**: the documentation build now fails on broken links (was warn-only, neutering the quality-pipeline docs gate); homepage package cards use the site router (raw anchors broke under the GitHub Pages base URL)
- **tooling**: Jest coverage threshold for functions raised to the documented 90 (measured 92.12% — regression-free); generated math2d reflection pages untracked per their declared gitignore intent (hand-written performance pages remain tracked); docs workspace Node engines aligned with the root pin
- **tooling**: hooks no longer source the deprecated husky v8 bootstrap (forward-compatible with husky v10); the dead v4-format husky.config.js and its package.json key were removed
- **tooling**: CI caches now key on every lockfile the workflow installs (the benchmark lab dependencies are no longer re-downloaded on each runner)
- **tooling**: removed the size-reporting build plugin whose dependency chain pulled the entire npm registry client (the benchmark laboratory budgets supersede it), eliminating six high-severity audit findings at the root
- **tooling**: removed the unresolvable types condition from the ./lib/* wildcard export in every package and the scaffolding template
- **math2d**: cross-entry state split-brain eliminated -- `config.useNativeMath` and `setDefaultRandomSource` now affect every entry point (previously each subpath bundle embedded an isolated copy of the deterministic kernels and mutable state, so the determinism toggle was silently unreachable from `utils/random` and seeding through `utils/random-source` did not seed `utils/random`)
- **math2d**: internal layer files under `lib/` are no longer importable as accidental public API (exports-map denial guards)

- **math2d**: `Transform2.inverse` position computation order for non-uniform scale (`R^-1*S^-1*t` corrected)
- **math2d**: `lerpAngle` intermediate normalization sign inversion at PI boundary
- **math2d**: `pow2` IEEE 754 exponent construction for biased exponents <= -1022 (affected `exp()`)
- **math2d**: `atan2` signed-zero (`-0`) handling to match IEEE 754 semantics
- **math2d**: `Complex.slerp()` instance -- added zero-magnitude guard matching static version
- **math2d**: `Complex.reciprocal` instance using different zero-detection threshold vs static -- standardized
- **math2d**: `Interval.center()` overflow for extreme values -- changed from `(min+max)*0.5` to `min + (max-min)*0.5`
- **math2d**: `Interval.hull()` unsafe type cast in array overload form
- **math2d**: Deep freeze `Transform2.IDENTITY`, `FLIP_X`, `FLIP_Y` -- nested Vector2/Rotation2 were mutable despite `Object.freeze()`
- **math2d**: Epsilon inconsistency in `getLengthAndNormalize()` -- used `EPSILON*EPSILON` (1e-20) while all other normalize paths use `isNearZero()` (1e-10)
- **math2d**: `hypot()` used in `normalize()`/`normalizeSafe()` for Vector2 and Complex -- corrects overflow for components above 1e154
- **math2d**: Double normalization in `Rotation2.fromComplex()`
- **math2d**: Deterministic `exp` 2^k scaling (replaced fragile bit-manipulation with proper scalbn-style two-step multiply)
- **math2d**: Deterministic `sinCos` range reduction (Cody-Waite split for precision on large angles)
- **math2d**: Angle range reduction precision for |x| > 2^20\*PI
- **math2d**: `log` mantissa sqrt(2) boundary adjustment per fdlibm `e_log.c`
- **math2d**: Misleading `lerp` JSDoc in Matrix2, Matrix3, and Interval (claimed "clamped" but implementation is correctly unclamped)
- **math2d**: Eliminated tuple allocation in `complexDivideSmith` (every Complex division)
- **math2d**: Eliminated array allocation in `Interval.multiply` (replaced with 4 local variables)
- **math2d**: Inlined rotation math in `Transform2.multiply`/`inverse` static methods (eliminated temp allocations)
- **math2d**: Vector2 instance triality divergence -- `reject()`/`project()`/`reflect()` now match static counterpart validation behavior
- **tooling**: `npm run init` previously failed because it ran `pip install -r requirements.txt` against a manifest that did not exist; bootstrap no longer depends on Python

## [0.6.0] - 2025-09-27

### Added

- **math2d**: Scalar module with constants, arithmetic, comparison, and interpolation utilities
- **math2d**: Vector2 and Matrix2 core types with full static and instance APIs

## [0.5.0] - 2025-04-30

### Added

- **math2d**: Scalar module (initial implementation)

## [0.4.0] - 2025-04-27

### Added

- **scaffold**: Cookiecutter template for new monorepo packages

## [0.3.4] - 2025-04-25

Version bump only for package lenguados.

[Unreleased]: https://github.com/rndelpuerto/lenguados/compare/v0.6.0...HEAD
[0.6.0]: https://github.com/rndelpuerto/lenguados/compare/v0.5.0...v0.6.0
[0.5.0]: https://github.com/rndelpuerto/lenguados/compare/v0.4.0...v0.5.0
[0.4.0]: https://github.com/rndelpuerto/lenguados/compare/v0.3.4...v0.4.0
[0.3.4]: https://github.com/rndelpuerto/lenguados/releases/tag/v0.3.4
