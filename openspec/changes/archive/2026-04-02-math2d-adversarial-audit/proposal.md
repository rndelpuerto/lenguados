# Proposal: math2d Adversarial Audit

## Problem Statement

The @lenguados/math2d package has undergone 20+ audit iterations since March 2026. While these audits have incrementally improved the codebase, contradictions between audit findings have accumulated, and no single audit has verified the entire codebase against authoritative external sources in a systematic, adversarial manner.

## Proposed Solution

Execute a 5-agent adversarial audit:

1. **Documentation Archaeologist** — Review ALL 20+ prior audit documents, extract decisions, find contradictions
2. **Devil's Advocate** — Challenge every constant, method, and design decision with technical arguments
3. **Evidence Hunter** — Search 30+ authoritative sources (Box2D, fdlibm, IEEE 754, academic papers) to validate/refute claims
4. **Source Code Analyst** — Compare method-by-method against 7 reference libraries (Box2D, gl-matrix, three.js, Godot, nalgebra, GLM, Matter.js)
5. **Judge Synthesizer** — Cross-reference all findings, resolve contradictions, produce irrefutable verdicts

## Success Criteria

- Every exported constant, utility, and method has a KEEP/MODIFY/REMOVE/ADD verdict
- Every verdict backed by evidence from 2+ authoritative sources
- All prior audit contradictions resolved
- Prioritized action items (P0-P3)
- No expert in mathematics, physics engines, or software engineering can refute the verdicts

## Scope

- All 28 source files in `packages/math2d/src/` (~25,000 lines)
- All barrel exports (`index.ts` files)
- Cross-cutting patterns (three-tier, *CS variants, out parameter, *Like interfaces)
- Architecture and layer dependencies
