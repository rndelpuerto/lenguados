## Context

The @lenguados/math2d package has undergone 31 OpenSpec change cycles that stabilized the API, TSDoc, and internal architecture. However, the user-facing markdown documentation was never given the same treatment. The root README.md is a bilingual placeholder with no API content. The math2d README.md is a 400+ line API dump that serves as neither a good onboarding guide nor a proper reference. Supporting docs vary in quality. Research/audit files in `docs/` have accumulated without curation.

Modern TypeScript library conventions (gl-matrix, three.js, pixi.js) favor a "funnel" README pattern: concise, DX-focused, linking to dedicated docs. lenguados already has a Docusaurus scaffold at `docs/` — the markdown documentation should funnel to it.

**Current state:**

- Root `README.md`: 45 lines, bilingual, no badges, no quick-start, no API info
- `packages/math2d/README.md`: 424 lines, exhaustive API dump with examples
- Root `CHANGELOG.md`: 3 versions documented, unreleased section exists
- Root `CONTRIBUTING.md`: 3-line stub (fork, test, PR)
- `packages/math2d/CONTRIBUTING.md`: 155 lines, solid but references may be stale
- `packages/math2d/ARCHITECTURE.md`: 94 lines, good but could use updated diagrams
- `packages/math2d/docs/`: 29 files including 16 archived research docs

**Stakeholders:** Library consumers (game/simulation developers), contributors, AI agents using docs for context.

## Goals / Non-Goals

**Goals:**

- Transform root README into a DX-first landing page that sells the library in 30 seconds
- Restructure math2d README to follow npm library conventions (install → quick-start → API overview → docs link)
- Normalize CHANGELOG to Keep a Changelog format
- Create a comprehensive contributor onboarding guide at root level
- Curate math2d docs/ to remove noise and maintain only current, authoritative references
- Ensure all documentation is accurate against the current codebase (API names, examples compile)

**Non-Goals:**

- Auto-generating API reference from TSDoc (future Docusaurus + TypeDoc integration)
- Writing new Docusaurus pages or content beyond markdown files
- Changing any source code, tests, or build configuration
- Translating all documentation to Spanish (root README keeps bilingual description only)
- Creating an `llms.txt` file (future consideration)
- Modifying the TSDoc annotations in source files (covered by existing `documentation-standard` spec)

## Decisions

### D1: README funnel pattern over inline API reference

**Decision:** Both READMEs will follow the funnel pattern — concise content that links to the Docusaurus docs site for full API reference. The math2d README will have an API overview table but NOT inline method signatures.

**Rationale:** Top libraries (gl-matrix, three.js, pixi.js) keep READMEs under 200 lines. The current 424-line math2d README duplicates what TypeDoc can auto-generate. A focused README improves scan-ability and reduces maintenance burden.

**Alternative considered:** Keep the exhaustive API in README. Rejected because it's already outdated in places and will diverge further with each change.

### D2: Multi-agent architecture for content creation

**Decision:** Implementation will use a coordinated agent architecture:

1. **Research agents** (parallel): Each documentation file gets a dedicated agent that reads the current source code, TSDoc, existing docs, and external references to gather accurate, up-to-date content
2. **Draft agents** (parallel): Produce initial drafts following the spec requirements
3. **Adversarial review agent**: Reviews all drafts for accuracy — verifies every API name, method signature, import path, and code example against the actual source
4. **Integration agent**: Ensures cross-document consistency (no conflicting information, links work, terminology matches)

**Rationale:** Documentation accuracy is the single most important quality. A multi-pass approach with adversarial verification catches the errors (wrong method names, outdated examples) that plague the current docs.

**Alternative considered:** Single-pass writing. Rejected because past experience shows API references drift from source without explicit verification.

### D3: English-first with bilingual description

**Decision:** All documentation will be in English. The root README will retain a bilingual (EN/ES) description section as its only Spanish content.

**Rationale:** The codebase, TSDoc, commit messages, and OpenSpec specs are all in English. Maintaining full bilingual docs doubles maintenance without clear benefit — the target audience (TypeScript game developers) reads English.

**Alternative considered:** Full bilingual documentation. Rejected due to maintenance cost.

### D4: Keep a Changelog format for CHANGELOG

**Decision:** Use [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) format with categories: Added, Changed, Deprecated, Removed, Fixed, Security. Combined with Semantic Versioning.

**Rationale:** Industry standard recognized by npm ecosystem. Lerna conventional commits can auto-generate entries in this format for future releases.

### D5: Research files archived, not deleted

**Decision:** Obsolete research/audit files in `packages/math2d/docs/` will be moved to `docs/research/archive/` (if not already there) rather than deleted. The `docs/README.md` index will be updated to reference only current docs.

**Rationale:** These files document decision rationale that may be valuable for future archeology. Archiving preserves history while removing noise from the active docs surface.

### D6: Badge selection

**Decision:** Root README badges (in order): npm version, CI/build status, test coverage, bundle size (bundlephobia), license, TypeScript.

**Rationale:** These are the six most-used badges for npm TypeScript packages. Bundle size is especially important for a math library used in game loops. Badges use shields.io for consistency.

## Risks / Trade-offs

**[Risk: Stale examples in new README]** → Mitigation: Adversarial review agent verifies every code example compiles against current exports. Spec requires `WHEN user copies code from README THEN it compiles without error`.

**[Risk: Incomplete changelog reconstruction]** → Mitigation: Cross-reference git log, existing CHANGELOG.md, and 31 archived OpenSpec changes. Accept that pre-v0.4.0 history may be approximate.

**[Risk: Broken cross-document links after restructure]** → Mitigation: Integration agent checks all relative links resolve. Keep link targets stable.

**[Risk: Research archive loss]** → Mitigation: Git history preserves all files. Archive move is a rename, not delete.

**[Trade-off: Shorter README = less discoverable API]** → Accepted. The API overview table + docs site link provides discoverability. Users who want method-level detail go to the docs site.

**[Trade-off: Docs curation requires judgment calls]** → Accepted. Files in `docs/research/archive/` are clearly historical. Files at `docs/` root (ARCHITECTURE.md, DOCUMENTATION_STANDARD.md, CONTRIBUTING.md) are clearly current. The boundary cases are the `docs/standards/` and `docs/architecture/` subdirectories — these will be evaluated individually.
