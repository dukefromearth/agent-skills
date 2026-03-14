---
name: duke-dependency-generator
description: Dependency and architecture graph generation playbook for TypeScript repositories. Use when implementing or upgrading `npm run arch` style workflows with dependency-cruiser plus ts-morph call/type graphs. Triggers on creating or refactoring architecture graph generation workflows.
license: MIT
metadata:
  author: duke
  version: "0.1.0"
---

# Duke Dependency Generator

Principal-level implementation skill for adding reproducible architecture graph generation to any TypeScript repository.

## First Step (Required)

Install required analysis libraries before doing anything else:

```bash
npm install --save-dev dependency-cruiser ts-morph fast-glob
```

## When to Apply

- Adding `npm run arch` to a repo
- Rebuilding architecture graph tooling in an existing TypeScript codebase
- Hardening deterministic graph output for docs, reviews, or CI
- Debugging architecture drift and coupling issues

## Rule Categories by Priority

| Priority | Category | Impact | Prefix |
|----------|----------|--------|--------|
| 1 | Bootstrap and Toolchain | CRITICAL | `bootstrap-` |
| 2 | Scope and Project Model | CRITICAL | `scope-` |
| 3 | Dependency Graph Generation | HIGH | `deps-` |
| 4 | Type Graph Generation | HIGH | `types-` |
| 5 | Callgraph Generation | HIGH | `callgraph-` |
| 6 | CLI Contract | HIGH | `cli-` |
| 7 | Verification and Determinism | MEDIUM | `verify-` |
| 8 | Operational Hygiene | MEDIUM | `ops-` |

## Quick Reference

- `bootstrap-install-toolchain` - Install required libraries first
- `scope-tsconfig-arch` - Use dedicated analysis tsconfig
- `deps-merge-base-config` - Merge with generated depcruise config
- `types-deterministic-ids-and-sort` - Keep type graph IDs stable and sorted
- `callgraph-entrypoint-selection` - Seed callgraph from real ingress files
- `cli-validate-arguments` - Fail fast for missing/invalid flags
- `verify-repeatability` - Diff reruns to prove deterministic output
- `ops-document-gotchas` - Keep recurring traps explicit in docs

## How to Use

Read rule files in `rules/`, then run the build package to regenerate compiled outputs.

## Full Compiled Document

For expanded guidance, see `AGENTS.md`.
