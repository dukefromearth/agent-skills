---
name: rfc
description: Use before implementing, modifying, or reviewing OAuth or HTTP behavior in code. Do not use for general OAuth/HTTP explanations or non-code discussions.
---

## RFC

**RFC 9110 HTTP Semantics** -  [rfc-9110-toc.json](./references/rfc-9110-toc.json) if your task requires HTTP semantics.
**RFC 9700 Best Current Practice for OAuth 2.0 Security** - [rfc-9700-toc.json](./references/rfc-9700-toc.json) if your task requires OAuth 2.0 security.


## Trigger
Use this skill only when at least one condition is true:
1. Pre-implementation planning for HTTP behavior in code.
2. Implementation of HTTP behavior where RFC citations are required before code decisions.
3. QA/review of HTTP behavior that requires RFC-backed challenge.

Do not use this skill for generic HTTP Q&A without code intent.

## Decision Lens
Choose one lens per response:

**OAUTH:**
- `FLOW_PROTECTION`
- `TOKEN_SECURITY`
- `ATTACK_MITIGATION`
- `CLIENT_AUTH`
- `DEPLOYMENT_HARDENING`

**HTTP:**
- `BEHAVIOR`
- `VALIDATION`
- `ROUTING`
- `REPRESENTATION`
- `SECURITY`

## Section Selection Rules
1. Extract the concrete HTTP topic from the request.
2. Select the most specific matching RFC section anchor for that topic.
3. Prefer the deepest subsection that directly answers the decision.
4. Build a citation set of at most 3 sections.
5. Use citation pattern:
   - `SINGLE` when one section is sufficient.
   - `MULTIPLE` when multiple sections are both required for correctness.
6. Return section number, section title, and direct anchor link.

## Ambiguity Handling
1. Set `Ambiguity` to `LOW`, `MEDIUM`, or `HIGH`.
2. Explain ambiguity in one sentence in `Selection Rationale`.
3. In implementation mode, if `Ambiguity` is `HIGH`, set `Gate: CODE_BLOCKED` and ask one `Clarifying Question`.
4. In QA mode, if `Ambiguity` is `HIGH`, include scoped uncertainty in `Challenge`.

## Output Template
Use exactly one template based on mode.

### Mode: IMPLEMENTATION
If implementing or modifying code, read and use [IMPLEMENTATION.md](./references/implementation.md)

### Mode: QA
If reviewing or qaing code, read and use [QA.md](./references/qa.md)