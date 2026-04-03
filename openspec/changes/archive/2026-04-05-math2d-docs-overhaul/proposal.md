## Why

The @lenguados/math2d package has mature, high-quality source code with comprehensive TSDoc annotations, but its **user-facing markdown documentation** does not match this quality. The root README.md is a generic bilingual placeholder with no API content, no quick-start code, and no badges — failing basic DX expectations for an npm package. The math2d README.md is an exhaustive 400+ line API dump better suited as a reference appendix than a developer onboarding tool. Supporting docs (ARCHITECTURE.md, CONTRIBUTING.md, CHANGELOG.md) exist but vary in completeness, format, and audience clarity. Meanwhile, 24+ research/audit files in `docs/` served their purpose during development but now create noise for contributors and AI agents trying to understand the project.

Modern TypeScript library documentation (gl-matrix, three.js, pixi.js) follows a "funnel" pattern: a concise README that sells and onboards, linking to a dedicated docs site for depth. lenguados already has a Docusaurus site scaffold but the README doesn't funnel to it. Now — after 31 archived OpenSpec changes have stabilized the API — is the right time to bring documentation up to the same standard as the code.

## What Changes

- **Root README.md**: Complete rewrite as a DX-first landing page — badges (npm, CI, coverage, bundle size, license, TypeScript), feature highlights, installation, 5-line quick-start, architecture diagram, links to docs site, contributing guide, and license
- **math2d README.md**: Restructure from exhaustive API dump to a focused package README — installation, quick-start, feature highlights, API overview table (not inline reference), link to full docs, performance tips summary, and bundle size info
- **Root CHANGELOG.md**: Audit and normalize to Keep a Changelog format (keepachangelog.com); ensure all unreleased changes from the 31 archived OpenSpec changes are captured
- **Root CONTRIBUTING.md**: Expand from 3-line stub to proper contributor guide — prerequisites, setup, branch/PR workflow, conventional commits, test/lint instructions, linking to math2d CONTRIBUTING.md for package-specific conventions
- **math2d CONTRIBUTING.md**: Review and update for accuracy; ensure it references current tooling and workflows
- **math2d ARCHITECTURE.md**: Review and update; add Mermaid diagrams for layer dependencies and data flow
- **math2d docs/ directory**: Curate and consolidate — archive obsolete research files, keep only actively-referenced standards and architecture docs, add a clear index

## Capabilities

### New Capabilities

- `readme-dx-overhaul`: Root README.md rewrite as DX-first landing page with badges, quick-start, and docs funnel pattern
- `math2d-readme-restructure`: math2d package README restructure from API dump to focused package README following npm library conventions
- `changelog-normalization`: Audit and normalize all changelogs to Keep a Changelog format with complete history
- `contributing-guide-expansion`: Expand root and math2d CONTRIBUTING.md to comprehensive contributor onboarding guides
- `docs-curation`: Consolidate math2d docs/ directory — archive obsolete files, update index, ensure only current references remain

### Modified Capabilities

- `readme-accuracy`: Existing spec will need updated requirements to reflect the new README structure and content standards
- `documentation-standard`: May need a delta for markdown file conventions (currently focused on TSDoc only)

## Impact

- **Files modified**: README.md (root), packages/math2d/README.md, CHANGELOG.md (root), CONTRIBUTING.md (root), packages/math2d/CONTRIBUTING.md, packages/math2d/ARCHITECTURE.md, packages/math2d/docs/ (multiple files)
- **No code changes**: This is a documentation-only change; no source code, tests, or build configuration affected
- **No breaking changes**: Documentation restructuring has no API impact
- **Bundle size**: Unaffected (markdown files are not bundled)
- **Deterministic guarantees**: Unaffected (no code changes)
- **Tree-shaking**: Unaffected (no code changes)
- **Dependencies**: None added or modified
- **AI agent context**: Improved — cleaner docs/ directory with clear index makes it easier for AI agents to find authoritative information; reduced noise from obsolete research files
