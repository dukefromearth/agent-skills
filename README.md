# Agent Skills

A collection of AI-agent skills with deterministic build tooling and CI validation.

## Available Skills

### duke-dependency-generator

Dependency and architecture graph generation playbook for TypeScript repositories. Use this when implementing or upgrading `npm run arch` style workflows with `dependency-cruiser`, `ts-morph`, and `fast-glob`.

## Repository Architecture

- `skills/<skill>/` - skill source and generated outputs
- `packages/<skill>-build/` - build/validate/extract tooling for rule compilation
- `.github/workflows/` - path-scoped CI for each skill/tooling package

## Local Workflow

```bash
cd packages/duke-dependency-generator-build
pnpm install
pnpm validate
pnpm build
```
