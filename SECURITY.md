# Security Policy

## Supported Versions

lenguados is pre-1.0 software. Only the **latest published `0.x` release** of each `@lenguados` package receives security fixes. Older releases are not patched — upgrade to the latest release before reporting an issue against an older version.

| Version       | Supported |
| ------------- | --------- |
| Latest `0.x`  | Yes       |
| Earlier `0.x` | No        |

## Scope

This policy covers the npm packages published from this repository under the `@lenguados` scope:

- `@lenguados/math2d`
- `@lenguados/common`
- `@lenguados/examples`

Development-only infrastructure that is never published to npm — the benchmark laboratory (`tools/benchmark/`), build scripts (`scripts/`), and the documentation site (`docs/`) — is out of scope for coordinated disclosure, but reports about it are still welcome through the same channel.

## Reporting a Vulnerability

Report vulnerabilities **privately through GitHub Security Advisories** — this is the canonical channel for this repository:

1. Go to [Report a security vulnerability](https://github.com/rndelpuerto/lenguados/security/advisories/new) (Security tab → Advisories → Report a vulnerability).
2. Describe the issue: affected package and version, impact, and a minimal reproduction if possible.
3. Do **not** open a public issue, discussion, or pull request for a suspected vulnerability — public disclosure before a fix is available puts downstream users at risk.

If the private reporting form is unavailable for any reason, open a minimal public issue that says only "security report — requesting a private channel" without technical details, and a maintainer will follow up.

## Response Expectations

- **Acknowledgement within 7 days** of a private report.
- After acknowledgement, the maintainer will triage the report, keep you informed of progress, and coordinate a fix and disclosure timeline with you.
- Fixes ship in the next release of the affected package(s), and the advisory is published once the fix is available.

Thank you for helping keep lenguados and its users safe.
