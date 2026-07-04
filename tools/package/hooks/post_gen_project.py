#!/usr/bin/env python3
"""Post-generation hook: print the manual registration steps a new package
needs that the template cannot perform automatically (they touch shared,
hand-maintained monorepo files outside the package directory)."""

PACKAGE = "{{ cookiecutter.package_name }}"

STEPS = f"""
Package @lenguados/{PACKAGE} scaffolded in packages/{PACKAGE}/.

The generated package builds, lints, tests, and packs on its own. A few shared
monorepo files are hand-maintained and must be updated manually to fully wire it
in — none of these block the package from working locally:

  1. Docs sidebar — add the package to docs/sidebars.ts so its overview and any
     standard reflections appear in the site navigation.
  2. Benchmark lab (optional) — to benchmark this package, add a loader at
     tools/benchmark/src/packages/{PACKAGE}/loader.ts (see the common package
     loader for the minimal shape); it is then discovered by --package={PACKAGE}
     and --package=all with no further script edits.
  3. Bundle-size budgets (optional) — declare budgetGzipBytes entries in a
     dx-config only when you want the size gate to guard this package.
  4. Subpath exports — register internal entry points in module-internals.json
     and mirror them in package.json exports as the package grows (see
     MODULE_EXPORTS.md).

Next: npm install, then npm run build && npm test from the repository root.
"""

print(STEPS)
