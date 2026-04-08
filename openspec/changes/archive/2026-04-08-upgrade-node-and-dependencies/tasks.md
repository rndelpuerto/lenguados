## 1. Runtime Upgrade

- [x] 1.1 Update `.nvmrc` from `22.14.0` to `24.14.1`
- [x] 1.2 Switch local environment to Node 24 (`nvm install 24.14.1 && nvm use`) and verify `node -v` and `npm -v`
- [x] 1.3 Update root `package.json` `engines.node` from `^22.14.0` to `^24.14.0`
- [x] 1.4 Update `packages/common/package.json` `engines.node` from `>=22` to `>=24`
- [x] 1.5 Update `packages/math2d/package.json` `engines.node` from `>=22` to `>=24`
- [x] 1.6 Update `packages/examples/package.json` `engines.node` from `>=22` to `>=24`
- [x] 1.7 Evaluate `docs/package.json` `engines.node` (`>=18.0`) — kept as-is for broader contributor compatibility

## 2. Root DevDependency Upgrades

- [x] 2.1 Run `npm outdated` at root to audit all devDependencies
- [x] 2.2 Upgrade build tooling: `rollup`, `@rollup/plugin-*`, `rollup-plugin-*`, `cross-env`
- [x] 2.3 Upgrade TypeScript tooling: `@typescript-eslint/eslint-plugin`, `@typescript-eslint/parser`, `typedoc`
- [x] 2.4 Upgrade linting: `eslint`, `eslint-config-prettier`, `eslint-plugin-*`, `stylelint`, `stylelint-*`, `prettier`
- [x] 2.5 Upgrade testing: `jest`, `@swc/jest`, `@swc/core`, `jest-environment-jsdom`, `jest-canvas-mock`, `@testing-library/jest-dom`, `@types/jest`, `fast-check`
- [x] 2.6 Upgrade monorepo tooling: `lerna`, `husky`, `lint-staged`, `@commitlint/cli`, `@commitlint/config-conventional`
- [x] 2.7 Upgrade remaining utilities: `rimraf`, `fast-glob`, `ts-node`, `eslint-define-config`, `eslint-import-resolver-typescript`
- [x] 2.8 Run `npm install` to regenerate `package-lock.json`

## 3. Docs Dependency Upgrades

- [x] 3.1 Run `npm outdated --workspace docs` to audit docs dependencies
- [x] 3.2 Upgrade Docusaurus suite: `@docusaurus/core`, `@docusaurus/preset-classic`, `@docusaurus/faster`, `@docusaurus/module-type-aliases`, `@docusaurus/tsconfig`, `@docusaurus/types` (3.9.2 → 3.10.0)
- [x] 3.3 Upgrade docs utilities: react/react-dom 19.2.1 → 19.2.4 (via semver range)
- [x] 3.4 TypeScript kept at ~5.9.3 — TS 6.0 too new for ecosystem validation
- [x] 3.5 Run `npm install` to apply docs dependency changes

## 4. Configuration Fixes

- [x] 4.1 Verify ESLint flat config works with upgraded plugins — clean pass
- [x] 4.2 Verify Jest config works with Jest 30 + @swc/jest — 41 suites, 3495 tests pass
- [x] 4.3 Verify Rollup config works with upgraded plugins — all 3 packages build
- [x] 4.4 Verify TypeScript config — fixed `experimental_faster` → `faster` in docusaurus.config.ts for Docusaurus 3.10.0
- [x] 4.5 Verify Husky hooks — pre-commit and pre-push hooks in place
- [x] 4.6 Verify commitlint config — rejects invalid, accepts valid conventional commits

## 5. Verification Gate

- [x] 5.1 Run `npm run lint` — ESLint + Stylelint clean
- [x] 5.2 Run `npm run test:unit` — 41 suites, 3495 tests, coverage thresholds met
- [x] 5.3 Run `npm run dist` — production build succeeds for all 3 packages
- [x] 5.4 Run `npm run docs` — Docusaurus site builds successfully
- [x] 5.5 Run `npm run typecheck` — TypeScript type-checking passes
- [x] 5.6 Run `npm run format:check` — all files formatted (cleaned stale docs/build)
- [x] 5.7 Deterministic math verified: all fast-check property-based tests pass, bit-exact results confirmed

## 6. Documentation Updates

- [x] 6.1 Update `CLAUDE.md` — Node 22.14.0 → 24.14.1
- [x] 6.2 Update root `README.md` — nvm install comment updated
- [x] 6.3 Update `CONTRIBUTING.md` — prerequisite Node 24.14.1
- [x] 6.4 Root `ARCHITECTURE.md` — no Node version references found, skip
- [x] 6.5 `packages/math2d/README.md` — no Node version references found, skip
- [x] 6.6 `packages/common/README.md` — no Node version references found, skip
- [x] 6.7 `packages/examples/README.md` — no Node version references found, skip
- [x] 6.8 `docs/docs/` site pages — no Node version references found, skip
- [x] 6.9 Update `.claude/rules/build-and-exports.md` — `>=22` → `>=24`
- [x] 6.10 Full scan complete: updated openspec/specs/{swc-jest-integration,contributing-guide-expansion}; archived changes left as historical records

## 7. Final Verification

- [x] 7.1 Clean install from scratch: `npm run clean-install` — success
- [x] 7.2 Full build: `npm run build` — 3 packages built
- [x] 7.3 Full test suite: `npm test` — lint clean, 41 suites, 3495 tests pass
- [x] 7.4 Production dist: `npm run dist` — 3 packages dist'd
- [x] 7.5 Docs build: `npm run docs` — Docusaurus site generated
- [x] 7.6 Verified: 3 packages intentionally held (ESLint 9.x, TypeScript 5.9.x — ecosystem compatibility)
