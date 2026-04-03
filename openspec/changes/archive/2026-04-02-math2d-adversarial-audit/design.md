# Design: Adversarial Agent Architecture

## Agent Topology

```
┌────────────┐  ┌────────────┐  ┌────────────┐  ┌────────────┐
│ Agent 1    │  │ Agent 2    │  │ Agent 3    │  │ Agent 4    │
│ Archaeo-   │  │ Devil's    │  │ Evidence   │  │ Source Code│
│ logist     │  │ Advocate   │  │ Hunter     │  │ Analyst    │
└──────┬─────┘  └──────┬─────┘  └──────┬─────┘  └──────┬─────┘
       │               │               │               │
       └───────────────┼───────────────┼───────────────┘
                       ▼
              ┌────────────────┐
              │ Agent 5        │
              │ Judge          │
              │ Synthesizer    │
              └────────────────┘
```

## Phase 1: Parallel Analysis (Agents 1-4)

All four agents run concurrently, each reading the full source code from their specialized perspective:

- **Agent 1** focuses on historical documentation and decision archaeology
- **Agent 2** focuses on challenging every design decision from first principles
- **Agent 3** focuses on finding authoritative external evidence
- **Agent 4** focuses on real-library source code comparison

## Phase 2: Synthesis (Agent 5)

The Judge Synthesizer receives all four reports and:

1. Re-reads every source file to verify agent claims
2. Cross-references findings where agents agree or disagree
3. Resolves contradictions using evidence hierarchy
4. Produces final KEEP/MODIFY/REMOVE/ADD verdicts
5. Writes comprehensive audit report

## Evidence Hierarchy

When agents disagree, the hierarchy is:

1. Verified source code (what the code actually does)
2. Authoritative standards (IEEE 754, mathematical definitions)
3. Reference implementations (Box2D, fdlibm, gl-matrix)
4. Historical documentation (prior audits)
5. Agent opinion

## Sources Consulted

### Libraries (30+)

Box2D, gl-matrix, three.js, Godot, Unity, nalgebra, GLM, Eigen, Matter.js, Chipmunk2D, Rapier, Planck.js

### Academic/Standards

- fdlibm (Netlib) polynomial coefficients
- IEEE 754-2019
- C++20 std::lerp (P0811R2)
- Baudin & Smith (arXiv:1210.4539) complex division
- Blackman & Vigna (xoshiro/SplitMix)
- Veltkamp/Dekker (error-free splitting)
- Ken Perlin (smootherStep)
- GLSL 4.60 specification
- Goldberg (floating-point arithmetic)
