## Context

After 20+ audit iterations with inconsistent results and multiple redo cycles, we need a definitive, file-by-file review of every source file in `@lenguados/math2d`. Previous approaches failed because agents:

1. Reasoned from descriptions instead of reading actual code
2. Applied external library standards instead of the library's own philosophy
3. Scaled horizontally (more agents) without scaling vertically (more depth per agent)
4. Reported tasks complete without verifying against code
5. Could not distinguish design decisions from bugs

A prior audit (math2d-audit-fixes) already identified and fixed: 14 deleted constants, 5 restored constants, 20 restored methods, Rotation2 negate API (3 items), deleted orphaned tests, added 6 new tests. Those fixes are committed.

The current codebase has 32 source files across 6 layers. This review must cover all of them.

## Goals / Non-Goals

**Goals:**

- Review every `.ts` file in `packages/math2d/src/` against the library's 3 pillars (Completeness, Performance, Safety)
- Produce a categorized, prioritized findings document with file paths, line numbers, current behavior, and recommended changes
- Verify cross-type pattern consistency (negate triple, inverse triple, component-wise ops, clone/copy, equality, factory methods, predicates)
- Identify circular dependencies and layer violations
- Validate JSDoc accuracy against actual implementation behavior
- Challenge every finding against the library's own philosophy before including it

**Non-Goals:**

- No code modifications in this change (review-only)
- No README updates (deferred per user direction)
- No applying external library standards (glMatrix, Three.js) as primary criteria
- No benchmarking or performance measurement — only identify allocation patterns

## Decisions

### D1: Depth-first agents, one per layer/type

Each agent reviews a small, well-defined set of files (1-5 files) rather than sweeping across the entire codebase. This prevents the "see everything, understand nothing" problem from prior iterations.

**Alternative considered:** Horizontal agents reviewing all files for one concern (e.g., "JSDoc agent"). Rejected because it fragments understanding — an agent reviewing all JSDoc can't understand whether a method's behavior is correct without understanding the type's algebraic semantics.

### D2: Cross-cutting agents run AFTER layer agents

Pattern consistency (X1) and barrel/dependency (X2) agents run after all layer agents complete. They consume layer agent findings as input and verify cross-type patterns, not individual file correctness.

**Alternative considered:** Running cross-cutting agents in parallel with layer agents. Rejected because cross-cutting agents need the complete picture to identify gaps.

### D3: Adversarial agents review ALL findings

A1 (Philosophy Guardian) and A2 (DX Advocate) review the consolidated findings to filter out recommendations that violate library philosophy or harm developer experience. Every finding must survive this gauntlet.

### D4: Findings format — structured, verifiable

Each finding must include: file path, line number(s), current behavior, recommended change, justification citing library philosophy, priority (P0-P3), and breaking change flag. No vague "consider improving" recommendations.

### D5: Priority definitions

| Priority | Definition                                                   | Action                  |
| -------- | ------------------------------------------------------------ | ----------------------- |
| P0       | Bug: incorrect behavior, wrong results, crashes              | Must fix before release |
| P1       | API inconsistency: breaks pattern contract, missing symmetry | Fix in next iteration   |
| P2       | Quality: JSDoc errors, missing tests, suboptimal perf        | Plan for improvement    |
| P3       | Polish: minor naming, ordering, style                        | Nice to have            |

## Risks / Trade-offs

**[Risk] Agent findings conflict with each other** → Adversarial agents (A1, A2) serve as tiebreakers using library philosophy as the deciding criterion.

**[Risk] Review misses files or patterns** → Checklist-based approach: every file listed explicitly in tasks, every cross-cutting pattern enumerated in X1's mandate.

**[Risk] False positives (recommending changes that break things)** → Every finding must be marked as breaking/non-breaking. Breaking changes require stronger justification.

**[Risk] Scope creep into implementation** → Strict boundary: findings.md is the only output. No code changes.
