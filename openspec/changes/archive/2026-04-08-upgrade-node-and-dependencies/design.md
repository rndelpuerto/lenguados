## Context

The monorepo currently runs on Node.js 22.14.0 (Jod LTS) with npm 10.9.2. The toolchain includes 40+ devDependencies at the root level plus Docusaurus 3.x dependencies in `docs/`. All CI/CD workflows (pr-validation, release, deploy-docs) reference `.nvmrc` for the Node version. Node 24 (Krypton) has been the active LTS since October 2025, and Node 22 enters maintenance mode with EOL in April 2027.

**Current version map:**

| File                     | Current    | Target                      |
| ------------------------ | ---------- | --------------------------- |
| `.nvmrc`                 | `22.14.0`  | `24.14.1`                   |
| Root `engines.node`      | `^22.14.0` | `^24.14.0`                  |
| Workspace `engines.node` | `>=22`     | `>=24`                      |
| Docs `engines.node`      | `>=18.0`   | `>=18.0` (evaluate)         |
| npm                      | 10.9.2     | 11.x (bundled with Node 24) |

**Stakeholders:** All contributors, CI/CD pipelines, downstream consumers of `@lenguados/*` packages.

## Goals / Non-Goals

**Goals:**

- Upgrade to Node 24 LTS (Krypton) as the project runtime
- Upgrade all dependencies to their latest stable versions
- Ensure the full build → lint → test → dist pipeline passes cleanly
- Update all documentation to reflect the new runtime and dependency versions
- Maintain 100% backward compatibility of the math library's API and deterministic guarantees

**Non-Goals:**

- Migrating to a different package manager (pnpm, yarn, bun)
- Upgrading to new major versions of core tooling that would require architectural changes (e.g., if Jest 30 ships with a new config format — evaluate but don't force)
- Adopting Node 24-specific APIs in library code (keep runtime-agnostic)
- Changing the monorepo structure or build architecture
- Upgrading TypeScript target/module beyond ESNext (already at ceiling)

## Decisions

### D1: Target Node 24 LTS, not Node 25 Current

**Decision:** Pin `.nvmrc` to `24.14.1` and set root engines to `^24.14.0`.

**Rationale:** LTS releases receive security patches and bug fixes for 30 months. Current releases (odd-numbered) are unsuitable for library development — they go EOL when the next major ships. Node 24 Krypton has active LTS support until April 2028.

**Alternative considered:** Stay on Node 22 and only bump patch — rejected because Node 22 enters maintenance mode soon and we'd be deferring the same migration with less runway.

### D2: Workspace engines set to `>=24`, docs stays `>=18.0`

**Decision:** Workspace packages (`common`, `math2d`, `examples`) use `>=24`. The `docs` package keeps `>=18.0` since Docusaurus 3.x officially supports Node 18+, and docs contributors may not have Node 24 installed.

**Rationale:** Workspace packages are the published artifacts — they should match the runtime we test against. The docs workspace is a dev-only build tool with its own compatibility matrix.

**Alternative considered:** Unify all engines to `>=24` — rejected because it would unnecessarily block docs contributions from environments running Node 20/22.

### D3: npm 11.x via Node 24 bundle, no explicit pin

**Decision:** Use whatever npm ships with Node 24 (currently 11.x). Do not pin npm version in engines or CI.

**Rationale:** npm is tightly coupled to Node releases. Pinning creates maintenance burden and version conflicts. The lockfile format (v3) is compatible across npm 9-11.

### D4: Upgrade strategy — `npm outdated` then `npm update`, not `rm node_modules`

**Decision:** Use incremental upgrade: `npm outdated` to audit → `npm update` for semver-compatible bumps → manual version edits for major bumps → `npm install` to regenerate lockfile.

**Rationale:** Incremental upgrades are easier to debug when something breaks. A clean `rm -rf node_modules && npm install` masks which specific upgrade caused a regression.

**Alternative considered:** `npm-check-updates` (ncu) to bump all at once — acceptable as a starting point, but each major bump needs individual verification.

### D5: Verify deterministic math output is unchanged

**Decision:** After all upgrades, run the full test suite including property-based tests. The fdlibm polynomial implementations are pure JavaScript with no native bindings — they are V8-version-independent by design.

**Rationale:** While the deterministic layer has no theoretical risk from a Node upgrade (it's all JS arithmetic), the test suite serves as empirical proof. Any regression would indicate an environment issue, not a code issue.

### D6: Documentation update scope

**Decision:** Update version references in all markdown files that mention Node.js version, npm version, or runtime requirements. Do NOT rewrite content that doesn't reference versions.

**Rationale:** Minimizes diff noise. Only files that reference specific version numbers need updating.

## Risks / Trade-offs

| Risk                                         | Likelihood | Impact | Mitigation                                                                                                       |
| -------------------------------------------- | ---------- | ------ | ---------------------------------------------------------------------------------------------------------------- |
| A devDependency doesn't support Node 24 yet  | Low        | Medium | Check each package's Node support before upgrading. Pin to last compatible version if needed.                    |
| npm 11 lockfile format incompatibility       | Low        | Low    | npm 11 uses lockfile v3, same as npm 9/10. No format migration needed.                                           |
| SWC binary not available for Node 24         | Low        | High   | SWC publishes prebuilt binaries quickly for new Node releases. Verify `@swc/core` has Node 24 binaries.          |
| jest-environment-jsdom breaks under Node 24  | Low        | Medium | jsdom relies on Node APIs that occasionally change. Run DOM tests early in the upgrade process.                  |
| Rollup plugin ecosystem lag                  | Low        | Medium | Most Rollup plugins are pure JS. Verify `rollup-plugin-swc3` and `rollup-plugin-dts` work.                       |
| Docusaurus build fails with Node 24          | Low        | Medium | Docusaurus 3.x should support Node 24. If not, docs workspace can temporarily stay on Node 22 via engines field. |
| **Breaking change for downstream consumers** | Certain    | Medium | Consumers on Node <24 cannot use upgraded packages. Document in CHANGELOG as **BREAKING**.                       |

## Migration Plan

**Execution order** (dependencies flow top-to-bottom):

1. **Runtime upgrade** — Update `.nvmrc`, switch local environment to Node 24, verify `node -v` and `npm -v`
2. **Engine fields** — Update `engines.node` in root and workspace `package.json` files
3. **Root devDependency upgrades** — Audit with `npm outdated`, upgrade incrementally, run `npm install`
4. **Docs dependency upgrades** — Upgrade Docusaurus suite and related packages separately
5. **Configuration fixes** — Adapt any configs broken by dependency upgrades (ESLint, Jest, Rollup, etc.)
6. **Verification gate** — Run full pipeline: `npm run lint && npm run test:unit && npm run dist && npm run docs`
7. **Documentation updates** — Update all markdown files referencing Node/npm versions
8. **Final verification** — Clean install from scratch: `npm run clean-install && npm run build && npm test`

**Rollback:** Revert the commit. Since `.nvmrc` controls CI and local dev, reverting restores Node 22 immediately. No data migration involved.

## Open Questions

- **Q1:** Should we add a Node 22 compatibility CI matrix job for a transitional period? (Recommendation: no — clean break is simpler for a pre-1.0 project)
- **Q2:** Should TypeScript be upgraded if a new major (6.x) is available? (Recommendation: yes, if stable; otherwise stay on 5.x latest)
