<!-- .github/PULL_REQUEST_TEMPLATE.md -->

## Summary

<!-- What does this PR change, and why? Link the related issue: Closes #NNN -->

## Type of change

<!-- feat / fix / docs / refactor / test / chore / perf / build / ci / style / revert -->

## Checklist

The `pr-validation` workflow runs every gate below on the PR — running them locally first saves review round-trips (see [CONTRIBUTING.md](https://github.com/rndelpuerto/lenguados/blob/main/CONTRIBUTING.md) for the full gate reference).

- [ ] PR title follows [Conventional Commits](https://www.conventionalcommits.org/) (`type(scope): description`)
- [ ] Branch name matches the convention: `release|hotfix/vX.Y.Z` or `<type>/<topic>` with `<type>` in `feature|feat|fix|enhancement|docs|chore|refactor|test|perf|ci|build`
- [ ] `npm run lint` passes (ESLint + Stylelint, zero warnings)
- [ ] `npm run format:check` passes (Prettier)
- [ ] `npm run typecheck` passes
- [ ] `npm run test:unit` passes with coverage thresholds met (90% lines/statements/functions, 80% branches)
- [ ] `npm run dist` builds cleanly (development + production bundles)
- [ ] `node scripts/verify-tarball.mjs` passes (publishable packages pack a complete tarball)
- [ ] `npm run tools:bench:smoke` passes (build integrity, dev↔prod match, determinism golden file — run `npm run tools:bench:setup` once first)
- [ ] `npm run tools:bench:size` passes (bundle-size budgets)
- [ ] `npm run docs` builds with no broken links
- [ ] `CHANGELOG.md` has an entry under `[Unreleased]` for user-facing changes (skip for internal-only changes)
- [ ] New/changed public API carries TSDoc per the [TSDoc Standard](https://github.com/rndelpuerto/lenguados/blob/main/TSDOC_STANDARD.md)

## Notes for the reviewer

<!-- Anything non-obvious: design trade-offs, follow-ups, benchmark results -->

---

**Milestone**: a maintainer assigns the `vX.Y.Z` milestone during triage — you do not need to set it yourself, but the PR cannot merge without it (CI gate).
