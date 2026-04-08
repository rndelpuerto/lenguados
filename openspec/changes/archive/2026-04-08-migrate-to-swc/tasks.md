## 1. Jest SWC Migration — Dependencies

- [x] 1.1 Install `@swc/core` and `@swc/jest` as devDependencies in the root workspace (`npm install -D @swc/core @swc/jest`)
- [x] 1.2 Verify `@swc/core` resolves correctly (`node -e "require('@swc/core')"` exits without error)

## 2. Jest SWC Migration — Configuration

- [x] 2.1 Replace the `sharedTransform` in `jest.config.ts` from `{ '^.+\\.ts$': 'ts-jest' }` to `{ '^.+\\.ts$': ['@swc/jest', { sourceMaps: true, jsc: { parser: { syntax: 'typescript', decorators: false }, target: 'es2022' } }] }`
- [x] 2.2 Remove the `globals: { 'ts-jest': { tsconfig: 'tsconfig.test.json' } }` block from `jest.config.ts`
- [x] 2.3 Replace the `JestConfigWithTsJest` type import with `import type { Config } from 'jest'` and update the `baseConfig` type annotation to `Config`

## 3. Jest SWC Migration — Validation

- [x] 3.1 Run `npx jest --selectProjects node --no-coverage` and verify all node tests pass
- [x] 3.2 Run `npx jest --selectProjects jsdom --no-coverage` and verify all jsdom tests pass (including DOM polyfills from `jest.dom.setup.ts`)
- [x] 3.3 Run `npm run test:unit` and verify full suite passes with coverage thresholds met (90% lines/statements, 85% functions, 50% branches)
- [x] 3.4 Run `npx jest --testPathPattern="properties" --no-coverage` and verify property-based fast-check tests pass

## 4. Jest SWC Migration — Cleanup

- [x] 4.1 Uninstall `ts-jest` from root devDependencies (`npm uninstall ts-jest`)
- [x] 4.2 Verify `npm ls ts-jest` shows no direct dependency on ts-jest
- [x] 4.3 Run `npm run test:unit` one final time to confirm everything works without ts-jest installed

## 5. Docusaurus SWC Acceleration — Dependencies

- [x] 5.1 Install `@docusaurus/faster` in the docs workspace (`npm install @docusaurus/faster --workspace=docs`), matching the installed Docusaurus core version
- [x] 5.2 Verify the package resolves correctly in the docs workspace

## 6. Docusaurus SWC Acceleration — Configuration

- [x] 6.1 Add `future: { experimental_faster: true }` to the config object in `docs/docusaurus.config.ts`

## 7. Docusaurus SWC Acceleration — Validation

- [x] 7.1 Run `npm run build --workspace=docs` and verify the docs site builds without errors
- [x] 7.2 Run `npm run start --workspace=docs` and verify the dev server starts and renders correctly
- [x] 7.3 Verify TypeDoc-generated API docs render without MDX parsing errors
- [x] 7.4 Verify sidebar navigation, navbar, footer links, and custom CSS render correctly

## 8. Type-Checking Safety Net

- [x] 8.1 Add a `typecheck` script (`tsc --noEmit`) to root `package.json`
- [x] 8.2 Add a `tsc --noEmit` step to `.github/workflows/pr-validation.yml` after lint and before tests
- [x] 8.3 Run `npm run typecheck` locally to verify it passes

## 9. Final Validation

- [x] 9.1 Run `npm run lint` from root to ensure no lint regressions
- [x] 9.2 Run `npm run build` from root to ensure Rollup build is unaffected
- [x] 9.3 Run `npm test` (full suite with lint pretest) to confirm end-to-end green
