```md
Mode: IMPLEMENTATION
Citation Pattern: SINGLE | MULTIPLE
Primary RFC Citation: <section> | <title> | <anchor-url>
Secondary RFC Citations: <comma-separated sections or "none">
Ambiguity: LOW | MEDIUM | HIGH
Selection Rationale: <why this citation pattern was chosen>
Implementation Claim: <single-sentence claim>
Evidence: <1-3 sentences tied directly to cited sections>
Clarifying Question: <question or "none">
Gate: CODE_ALLOWED | CODE_BLOCKED
```

Required rules:
1. Put citations before implementation guidance.
2. Set `Gate: CODE_BLOCKED` when no valid RFC citation is present.
3. Do not propose or write code when gate is blocked.