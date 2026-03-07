# Claude Code Ecosystem Guide

This document describes the Claude Code development ecosystem configured for the lenguados project.

## Why OpenSpec

lenguados is a deterministic math library where changes often span multiple layers (deterministic → auxiliary → core → utils) and must preserve cross-platform bit-exact guarantees. OpenSpec provides structured change tracking that captures the architectural context before implementation, reducing the risk of breaking the layered architecture or determinism invariants.

## Daily Workflow with OpenSpec

OpenSpec uses a fluid "actions on a change" model. Four core commands:

### `/opsx:explore` — Think Before Building

Use when you need to investigate an idea, compare approaches, or understand existing code before committing to a change.

Example: "I want to add AABB support. What's the best approach given the existing type system?"

### `/opsx:propose` — Create a Complete Change Proposal

Creates a change directory with proposal.md (what & why), design.md (how), and tasks.md (implementation steps).

Example: `/opsx:propose add-aabb-type`

### `/opsx:apply` — Implement the Tasks

Reads the change artifacts and implements tasks one by one, checking them off as completed.

Example: `/opsx:apply add-aabb-type`

### `/opsx:archive` — Archive Completed Work

Moves the change to `openspec/changes/archive/` with date prefix. Optionally syncs delta specs to main specs.

Example: `/opsx:archive add-aabb-type`

### Expanded Profile

Additional commands available via:

```bash
openspec config profile  # select expanded
openspec update          # regenerate AI guidance
```

Expanded adds: `/opsx:new`, `/opsx:continue`, `/opsx:ff`, `/opsx:verify`, `/opsx:sync`, `/opsx:bulk-archive`, `/opsx:onboard`

## Skills

| Skill                 | When to Use                                      | When NOT to Use                    |
| --------------------- | ------------------------------------------------ | ---------------------------------- |
| `implement-math-type` | Adding a new math primitive (AABB, Circle, Ray2) | Modifying existing types           |
| `release`             | Publishing packages to npm                       | Regular development                |
| `openspec-propose`    | Starting a new feature/fix                       | Quick one-line changes             |
| `openspec-explore`    | Investigating before building                    | When you already know the approach |
| `openspec-apply`      | Implementing planned tasks                       | Ad-hoc changes                     |
| `openspec-archive`    | Finalizing completed work                        | Work still in progress             |

## MCPs

No MCP servers are configured. The project is a pure math library with no external service dependencies. For GitHub interactions, use the `gh` CLI directly (more context-efficient than an MCP server).

## Setup on a New Machine

1. **Verify Node.js**: `node --version` — requires 22.14.0 (see `.nvmrc`)
2. **Install dependencies**: `npm install`
3. **Install OpenSpec**: `npm install -g @fission-ai/openspec@latest` (requires Node >= 20.19.0)
4. **Initialize OpenSpec** (if `.claude/skills/openspec-*` don't exist):
   ```bash
   openspec init --tools claude
   openspec update  # if upgrading version or changing profile
   ```
5. **Build**: `npm run build`
6. **Test**: `npm run test:unit`

If `openspec` is not in PATH after install, use `npx @fission-ai/openspec` for all commands.

### Telemetry

OpenSpec collects anonymous usage stats (command names + version, no content/paths/PII). Opt out:

```bash
export OPENSPEC_TELEMETRY=0
```

## Common Workflows

### Implement a New Math Type

1. `/opsx:propose add-new-type` — or use `/implement-math-type` for the checklist
2. `/opsx:apply` — implement following the generated tasks
3. Run tests: `npx jest --testPathPattern="packages/math2d/test/core/newtype" --no-coverage`
4. `/opsx:archive`

### Fix a Bug

1. Write a failing test first
2. Fix the issue in the appropriate layer
3. Verify: `npm run test:unit`
4. Commit with conventional format: `fix(math2d): description`

### Add a Feature to an Existing Type

1. Check the architecture layer rules in `.claude/rules/math2d-patterns.md`
2. Implement with strict/safe/unchecked triality if the operation can fail
3. Use deterministic kernels for trig/sqrt operations
4. Add `out?` parameter as the last arg for static methods
5. Write tests mirroring source structure
