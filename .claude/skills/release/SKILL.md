---
name: release
description: Execute the Lerna release workflow for publishing packages to npm.
disable-model-invocation: true
---

# Release Workflow

## Prerequisites

1. Ensure you're on the `main` branch with a clean working tree
2. All tests pass: `npm test`
3. Production build succeeds: `npm run dist`

## Steps

### Standard Release

```bash
# 1. Clean install and check outdated deps
npm run prerelease

# 2. Version bump with conventional commits
npm run version
# This runs: lerna version --conventional-commits --yes
# Creates git tag and updates CHANGELOG.md

# 3. Push tags to trigger CI release
git push --follow-tags
```

The `release.yml` GitHub Action publishes to npm when a version tag is pushed.

### Alpha/Beta Prerelease

```bash
# Alpha
npm run version:alpha

# Beta
npm run version:beta
```

### Verify

After CI completes, verify:

```bash
npm view @lenguados/math2d dist-tags
```
